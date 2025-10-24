/**
 * Music Worker
 * Selects and assigns background music to project
 */

import { Worker, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { createMusicProvider } from '../adapters/music';
import { QUEUE_NAMES, JOB_TYPES } from '@merkad/shared';
import { v4 as uuidv4 } from 'uuid';

interface MusicJobData {
  projectId: string;
  mood?: string;
  useMock: boolean;
}

export function createMusicWorker(connection: any) {
  const musicProvider = createMusicProvider();

  return new Worker(
    QUEUE_NAMES.MUSIC,
    async (job: Job<MusicJobData>) => {
      const { projectId, mood, useMock } = job.data;

      console.log(`[Music] Selecting music for project ${projectId}`);

      try {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            scenes: true,
          },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        // Calculate total duration
        const totalDurationMs = project.scenes.reduce((sum, scene) => sum + scene.durationMs, 0);

        // Select music
        const musicResult = await musicProvider.select({
          mood: mood || 'energetic',
          durationMs: totalDurationMs,
        });

        // Create music asset
        const musicAsset = await prisma.asset.create({
          data: {
            id: uuidv4(),
            projectId,
            kind: 'audio',
            url: musicResult.audioUrl,
            meta: {
              title: musicResult.title,
              artist: musicResult.artist,
              mood: musicResult.mood,
              durationMs: musicResult.durationMs,
            },
          },
        });

        // Link music to project
        await prisma.project.update({
          where: { id: projectId },
          data: {
            musicAssetId: musicAsset.id,
            status: 'music_selected',
          },
        });

        console.log(`[Music] Selected "${musicResult.title}" for project ${projectId}`);

        return {
          success: true,
          music: musicResult.title,
        };
      } catch (error) {
        console.error('[Music] Error:', error);
        throw error;
      }
    },
    { connection }
  );
}
