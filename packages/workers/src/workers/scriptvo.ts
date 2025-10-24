/**
 * Script & VO Worker
 * Generates script and voiceover for scenes
 */

import { Worker, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { createTTSProvider } from '../adapters/tts';
import { QUEUE_NAMES, JOB_TYPES } from '@merkad/shared';
import { v4 as uuidv4 } from 'uuid';

interface ScriptVoJobData {
  projectId: string;
  useMock: boolean;
}

/**
 * Generate script for scenes
 * In production, this would use an LLM to create compelling copy
 */
async function generateScript(scenes: any[]) {
  console.log('[ScriptVO] Generating script for scenes...');

  const scripts = [
    'Discover the future of innovation with our revolutionary product.',
    'Packed with cutting-edge technology designed to simplify your life.',
    'Perfect for professionals who demand the best.',
    'Experience performance that exceeds all expectations.',
    'Order today and transform the way you work.',
  ];

  return scenes.map((scene, i) => ({
    sceneId: scene.id,
    text: scene.overlayText && i < scripts.length ? scripts[i] : '',
  }));
}

export function createScriptVoWorker(connection: any) {
  const ttsProvider = createTTSProvider();

  return new Worker(
    QUEUE_NAMES.SCRIPT_VO,
    async (job: Job<ScriptVoJobData>) => {
      const { projectId, useMock } = job.data;

      console.log(`[ScriptVO] Processing VO for project ${projectId}`);

      try {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            scenes: {
              orderBy: { index: 'asc' },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        // Generate script
        const scripts = await generateScript(project.scenes);

        // Generate VO for each scene
        for (const script of scripts) {
          if (!script.text) continue;

          // Generate audio using TTS
          const ttsResult = await ttsProvider.synthesize({ text: script.text });

          // Create VO segment
          const voSegment = await prisma.voSegment.create({
            data: {
              id: uuidv4(),
              projectId,
              sceneId: script.sceneId,
              text: script.text,
              audioUrl: ttsResult.audioUrl,
              durationMs: ttsResult.durationMs,
            },
          });

          // Link VO segment to scene
          await prisma.scene.update({
            where: { id: script.sceneId },
            data: { voSegmentId: voSegment.id },
          });

          console.log(`[ScriptVO] Created VO segment for scene`);
        }

        // Update project status
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'vo_generated' },
        });

        return {
          success: true,
          segmentCount: scripts.filter(s => s.text).length,
        };
      } catch (error) {
        console.error('[ScriptVO] Error:', error);
        throw error;
      }
    },
    { connection }
  );
}
