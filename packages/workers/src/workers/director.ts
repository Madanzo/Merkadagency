/**
 * Director Worker
 * Generates storyboard from project brief
 */

import { Worker, Job, Queue } from 'bullmq';
import { prisma } from '../lib/db';
import { QUEUE_NAMES, JOB_TYPES, TARGET_VIDEO_DURATION_MS } from '@merkad/shared';
import { v4 as uuidv4 } from 'uuid';

interface DirectorJobData {
  projectId: string;
  brief: string;
}

/**
 * Generate storyboard from brief using AI (mock implementation)
 * In production, this would use GPT-4 or Claude to analyze the brief
 */
async function generateStoryboard(brief: string, targetDurationMs: number = TARGET_VIDEO_DURATION_MS) {
  console.log('[Director] Generating storyboard from brief...');

  // Mock storyboard generation
  // In production, this would use an LLM to analyze the brief and create scenes
  const scenes = [
    {
      index: 0,
      durationMs: 2500,
      description: 'Product hero shot with dramatic lighting',
      overlayText: 'Introducing Innovation',
      voiceoverText: 'Discover the future of innovation with our revolutionary product.',
    },
    {
      index: 1,
      durationMs: 3000,
      description: 'Close-up of key product feature',
      overlayText: 'Advanced Features',
      voiceoverText: 'Packed with cutting-edge technology designed to simplify your life.',
    },
    {
      index: 2,
      durationMs: 2500,
      description: 'Product in use, lifestyle context',
      overlayText: 'Everyday Excellence',
      voiceoverText: 'Perfect for professionals who demand the best.',
    },
    {
      index: 3,
      durationMs: 3000,
      description: 'Benefits visualization',
      overlayText: 'Unmatched Performance',
      voiceoverText: 'Experience performance that exceeds all expectations.',
    },
    {
      index: 4,
      durationMs: 2500,
      description: 'Brand logo and call to action',
      overlayText: 'Available Now',
      voiceoverText: 'Order today and transform the way you work.',
    },
    {
      index: 5,
      durationMs: 1500,
      description: 'Final brand screen',
      overlayText: 'MerkadAgency',
      voiceoverText: '',
    },
  ];

  return {
    scenes,
    totalDurationMs: scenes.reduce((sum, s) => sum + s.durationMs, 0),
    musicMood: 'energetic',
  };
}

export function createDirectorWorker(connection: any) {
  const imageLabQueue = new Queue(QUEUE_NAMES.IMAGE_LAB, { connection });

  return new Worker(
    QUEUE_NAMES.DIRECTOR,
    async (job: Job<DirectorJobData>) => {
      const { projectId, brief } = job.data;

      console.log(`[Director] Processing storyboard for project ${projectId}`);

      try {
        // Generate storyboard
        const storyboard = await generateStoryboard(brief);

        // Create scenes in database
        const scenePromises = storyboard.scenes.map(scene =>
          prisma.scene.create({
            data: {
              id: uuidv4(),
              projectId,
              index: scene.index,
              durationMs: scene.durationMs,
              overlayText: scene.overlayText,
            },
          })
        );

        const scenes = await Promise.all(scenePromises);

        // Update project status
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'storyboard_generated' },
        });

        console.log(`[Director] Created ${storyboard.scenes.length} scenes for project ${projectId}`);

        // Automatically trigger image generation for all scenes
        const sceneIds = scenes.map((s: any) => s.id);
        await imageLabQueue.add(JOB_TYPES.GENERATE_IMAGES, { projectId, sceneIds });
        console.log(`[Director] Triggered image generation for ${sceneIds.length} scenes`);

        return {
          success: true,
          sceneCount: storyboard.scenes.length,
          totalDurationMs: storyboard.totalDurationMs,
        };
      } catch (error) {
        console.error('[Director] Error:', error);
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'failed' },
        });
        throw error;
      }
    },
    { connection }
  );
}
