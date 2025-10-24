/**
 * Workers Entry Point
 * Starts all BullMQ workers
 */

import 'dotenv/config';
import Redis from 'ioredis';
import { createDirectorWorker } from './workers/director';
import { createImageLabWorker } from './workers/imagelab';
import { createScriptVoWorker } from './workers/scriptvo';
import { createMusicWorker } from './workers/music';
import { createEditorWorker } from './workers/editor';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

console.log('Starting MerkadAgency workers...');

// Create workers
const directorWorker = createDirectorWorker(connection);
const imageLabWorker = createImageLabWorker(connection);
const scriptVoWorker = createScriptVoWorker(connection);
const musicWorker = createMusicWorker(connection);
const editorWorker = createEditorWorker(connection);

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down workers...');
  await Promise.all([
    directorWorker.close(),
    imageLabWorker.close(),
    scriptVoWorker.close(),
    musicWorker.close(),
    editorWorker.close(),
  ]);
  await connection.quit();
  process.exit(0);
});

console.log('All workers started successfully');
console.log('- Director Worker: Ready');
console.log('- ImageLab Worker: Ready');
console.log('- Script/VO Worker: Ready');
console.log('- Music Worker: Ready');
console.log('- Editor Worker: Ready');
