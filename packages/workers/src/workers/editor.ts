/**
 * Editor Worker
 * Assembles final video using FFmpeg
 */

import { Worker, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { renderVideo } from '../lib/ffmpeg-renderer';
import { QUEUE_NAMES, JOB_TYPES } from '@merkad/shared';
import { generateFcpxml, generateEdl } from '@merkad/shared';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || 'merkadagency';
const PUBLIC_URL = process.env.S3_PUBLIC_URL || 'http://localhost:9000/merkadagency';

interface EditorJobData {
  projectId: string;
  renderJobId: string;
  exportFcpxml?: boolean;
  exportEdl?: boolean;
}

async function uploadFileToS3(filePath: string, projectId: string, fileName: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const key = `projects/${projectId}/renders/${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: fileName.endsWith('.mp4') ? 'video/mp4' : 'application/xml',
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export function createEditorWorker(connection: any) {
  return new Worker(
    QUEUE_NAMES.EDITOR,
    async (job: Job<EditorJobData>) => {
      const { projectId, renderJobId, exportFcpxml = true, exportEdl = false } = job.data;

      console.log(`[Editor] Starting render for project ${projectId}`);

      const tempDir = path.join(os.tmpdir(), `merkad-render-${renderJobId}`);
      await fs.mkdir(tempDir, { recursive: true });

      try {
        // Update render job status
        await prisma.renderJob.update({
          where: { id: renderJobId },
          data: {
            status: 'processing',
            logs: ['Starting render process...'],
          },
        });

        // Fetch project data
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            scenes: {
              include: {
                imageAsset: true,
                voSegment: true,
              },
              orderBy: { index: 'asc' },
            },
            voSegments: true,
            musicAsset: true,
          },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        if (project.scenes.length === 0) {
          throw new Error('No scenes to render');
        }

        // Render video
        const outputPath = path.join(tempDir, 'output.mp4');
        await renderVideo(project, outputPath, async (log) => {
          // Add log to render job
          await prisma.renderJob.update({
            where: { id: renderJobId },
            data: {
              logs: { push: log },
            },
          });
        });

        console.log('[Editor] Video rendered successfully');

        // Upload video to S3
        const mp4Url = await uploadFileToS3(outputPath, projectId, `${Date.now()}.mp4`);

        const artifacts: any = { mp4Url };

        // Export FCPXML if requested
        if (exportFcpxml) {
          console.log('[Editor] Generating FCPXML...');
          const fcpxmlContent = await generateFcpxmlForProject(project);
          const fcpxmlPath = path.join(tempDir, 'timeline.fcpxml');
          await fs.writeFile(fcpxmlPath, fcpxmlContent);
          artifacts.fcpxmlUrl = await uploadFileToS3(fcpxmlPath, projectId, `${Date.now()}.fcpxml`);
        }

        // Export EDL if requested
        if (exportEdl) {
          console.log('[Editor] Generating EDL...');
          const edlContent = await generateEdlForProject(project);
          const edlPath = path.join(tempDir, 'timeline.edl');
          await fs.writeFile(edlPath, edlContent);
          artifacts.edlUrl = await uploadFileToS3(edlPath, projectId, `${Date.now()}.edl`);
        }

        // Update render job with artifacts
        await prisma.renderJob.update({
          where: { id: renderJobId },
          data: {
            status: 'completed',
            artifacts,
            completedAt: new Date(),
          },
        });

        // Update project status
        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'completed' },
        });

        console.log(`[Editor] Render completed for project ${projectId}`);

        return {
          success: true,
          artifacts,
        };
      } catch (error) {
        console.error('[Editor] Error:', error);

        await prisma.renderJob.update({
          where: { id: renderJobId },
          data: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });

        await prisma.project.update({
          where: { id: projectId },
          data: { status: 'failed' },
        });

        throw error;
      } finally {
        // Cleanup temp directory
        await fs.rm(tempDir, { recursive: true, force: true });
      }
    },
    { connection }
  );
}

async function generateFcpxmlForProject(project: any): Promise<string> {
  const ratio = project.ratio === 'VERTICAL' ? '9:16' : project.ratio === 'HORIZONTAL' ? '16:9' : '1:1';
  const dimensions = { '9:16': { width: 1080, height: 1920 }, '16:9': { width: 1920, height: 1080 }, '1:1': { width: 1080, height: 1080 } }[ratio];

  const assets: any[] = [];
  const videoClips: any[] = [];
  const audioClips: any[] = [];

  let currentTime = 0;

  // Add scene images as video clips
  for (const scene of project.scenes) {
    if (scene.imageAsset) {
      const assetId = `asset-${scene.id}`;
      assets.push({
        id: assetId,
        name: `Scene ${scene.index + 1}`,
        url: scene.imageAsset.url,
        duration: scene.durationMs / 1000,
        format: 'image',
        width: dimensions?.width,
        height: dimensions?.height,
      });

      videoClips.push({
        assetId,
        start: currentTime,
        duration: scene.durationMs / 1000,
      });
    }

    currentTime += scene.durationMs / 1000;
  }

  // Add VO segments as audio clips
  currentTime = 0;
  for (const scene of project.scenes) {
    if (scene.voSegment && scene.voSegment.audioUrl && !scene.voSegment.audioUrl.startsWith('mock://')) {
      const assetId = `vo-${scene.voSegment.id}`;
      assets.push({
        id: assetId,
        name: `VO ${scene.index + 1}`,
        url: scene.voSegment.audioUrl,
        duration: (scene.voSegment.durationMs || scene.durationMs) / 1000,
        format: 'audio',
      });

      audioClips.push({
        assetId,
        start: currentTime,
        duration: (scene.voSegment.durationMs || scene.durationMs) / 1000,
      });
    }

    currentTime += scene.durationMs / 1000;
  }

  // Add music
  if (project.musicAsset && !project.musicAsset.url.startsWith('mock://')) {
    const totalDuration = project.scenes.reduce((sum: number, s: any) => sum + s.durationMs, 0) / 1000;
    assets.push({
      id: 'music',
      name: 'Background Music',
      url: project.musicAsset.url,
      duration: totalDuration,
      format: 'audio',
    });

    audioClips.push({
      assetId: 'music',
      start: 0,
      duration: totalDuration,
      audioLevel: -12,
    });
  }

  return generateFcpxml({
    name: project.title,
    timeline: {
      name: project.title,
      duration: project.scenes.reduce((sum: number, s: any) => sum + s.durationMs, 0) / 1000,
      frameRate: 30,
      width: dimensions?.width || 1080,
      height: dimensions?.height || 1920,
    },
    assets,
    videoClips,
    audioClips,
  });
}

async function generateEdlForProject(project: any): Promise<string> {
  const clips: any[] = [];
  let currentTime = 0;

  for (const scene of project.scenes) {
    if (scene.imageAsset) {
      clips.push({
        clipName: `Scene${scene.index + 1}`,
        sourceFile: scene.imageAsset.url,
        startTime: currentTime,
        duration: scene.durationMs / 1000,
        track: 'V',
      });
    }

    if (scene.voSegment && scene.voSegment.audioUrl) {
      clips.push({
        clipName: `VO${scene.index + 1}`,
        sourceFile: scene.voSegment.audioUrl,
        startTime: currentTime,
        duration: (scene.voSegment.durationMs || scene.durationMs) / 1000,
        track: 'A1',
      });
    }

    currentTime += scene.durationMs / 1000;
  }

  if (project.musicAsset) {
    clips.push({
      clipName: 'Music',
      sourceFile: project.musicAsset.url,
      startTime: 0,
      duration: currentTime,
      track: 'A2',
    });
  }

  return generateEdl({
    title: project.title,
    frameRate: 30,
    clips,
  });
}
