/**
 * ImageLab Worker
 * Generates placeholder images for scenes
 */

import { Worker, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { createImageGenProvider } from '../adapters/image-gen';
import { QUEUE_NAMES, JOB_TYPES, VIDEO_DIMENSIONS } from '@merkad/shared';
import { createCanvas } from 'canvas';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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

interface ImageLabJobData {
  projectId: string;
  sceneIds: string[];
}

/**
 * Create a placeholder image with colored background and text
 */
async function createPlaceholderImage(
  text: string,
  width: number,
  height: number,
  backgroundColor: string = '#5A27FF'
): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 60px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap
  const maxWidth = width - 100;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw lines
  const lineHeight = 80;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  return canvas.toBuffer('image/png');
}

/**
 * Upload image buffer to S3
 */
async function uploadImageToS3(buffer: Buffer, projectId: string): Promise<string> {
  const key = `projects/${projectId}/images/${uuidv4()}.png`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export function createImageLabWorker(connection: any) {
  const imageGenProvider = createImageGenProvider();

  return new Worker(
    QUEUE_NAMES.IMAGE_LAB,
    async (job: Job<ImageLabJobData>) => {
      const { projectId, sceneIds } = job.data;

      console.log(`[ImageLab] Generating images for ${sceneIds.length} scenes`);

      try {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            scenes: {
              where: { id: { in: sceneIds } },
            },
          },
        });

        if (!project) {
          throw new Error('Project not found');
        }

        // Get video dimensions
        const ratio = project.ratio === 'VERTICAL' ? '9:16' : project.ratio === 'HORIZONTAL' ? '16:9' : '1:1';
        const dimensions = VIDEO_DIMENSIONS[ratio];

        // Generate images for each scene
        for (const scene of project.scenes) {
          const text = scene.overlayText || `Scene ${scene.index + 1}`;

          // Create placeholder image
          const imageBuffer = await createPlaceholderImage(
            text,
            dimensions.width,
            dimensions.height,
            '#5A27FF'
          );

          // Upload to S3
          const imageUrl = await uploadImageToS3(imageBuffer, projectId);

          // Create asset
          const asset = await prisma.asset.create({
            data: {
              id: uuidv4(),
              projectId,
              kind: 'image',
              url: imageUrl,
              meta: {
                width: dimensions.width,
                height: dimensions.height,
                format: 'png',
                generated: true,
              },
            },
          });

          // Link asset to scene
          await prisma.scene.update({
            where: { id: scene.id },
            data: { imageAssetId: asset.id },
          });

          console.log(`[ImageLab] Created image for scene ${scene.index}`);
        }

        return { success: true, imageCount: sceneIds.length };
      } catch (error) {
        console.error('[ImageLab] Error:', error);
        throw error;
      }
    },
    { connection }
  );
}
