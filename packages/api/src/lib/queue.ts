import { Queue, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES, JOB_TYPES } from '@merkad/shared';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Create queues
export const directorQueue = new Queue(QUEUE_NAMES.DIRECTOR, { connection });
export const imageLabQueue = new Queue(QUEUE_NAMES.IMAGE_LAB, { connection });
export const scriptVoQueue = new Queue(QUEUE_NAMES.SCRIPT_VO, { connection });
export const musicQueue = new Queue(QUEUE_NAMES.MUSIC, { connection });
export const editorQueue = new Queue(QUEUE_NAMES.EDITOR, { connection });

// Queue events for monitoring
export const directorEvents = new QueueEvents(QUEUE_NAMES.DIRECTOR, { connection });
export const imageLabEvents = new QueueEvents(QUEUE_NAMES.IMAGE_LAB, { connection });
export const scriptVoEvents = new QueueEvents(QUEUE_NAMES.SCRIPT_VO, { connection });
export const musicEvents = new QueueEvents(QUEUE_NAMES.MUSIC, { connection });
export const editorEvents = new QueueEvents(QUEUE_NAMES.EDITOR, { connection });

/**
 * Add a job to generate storyboard
 */
export async function enqueueStoryboardGeneration(projectId: string, brief: string) {
  return directorQueue.add(JOB_TYPES.GENERATE_STORYBOARD, { projectId, brief });
}

/**
 * Add a job to generate images for scenes
 */
export async function enqueueImageGeneration(projectId: string, sceneIds: string[]) {
  return imageLabQueue.add(JOB_TYPES.GENERATE_IMAGES, { projectId, sceneIds });
}

/**
 * Add a job to generate voiceover
 */
export async function enqueueVoGeneration(projectId: string, useMock: boolean = true) {
  return scriptVoQueue.add(JOB_TYPES.GENERATE_VO, { projectId, useMock });
}

/**
 * Add a job to select music
 */
export async function enqueueMusicSelection(projectId: string, mood?: string, useMock: boolean = true) {
  return musicQueue.add(JOB_TYPES.SELECT_MUSIC, { projectId, mood, useMock });
}

/**
 * Add a job to render video
 */
export async function enqueueVideoRender(
  projectId: string,
  renderJobId: string,
  options: { exportFcpxml?: boolean; exportEdl?: boolean } = {}
) {
  return editorQueue.add(JOB_TYPES.RENDER_VIDEO, {
    projectId,
    renderJobId,
    ...options,
  });
}
