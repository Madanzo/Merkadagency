/**
 * FFmpeg Video Renderer
 * Assembles vertical 1080x1920 video from scenes with VO and music
 */

import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { VIDEO_DIMENSIONS, VIDEO_FRAME_RATE, MUSIC_DUCK_DB } from '@merkad/shared';
import { createCanvas, loadImage } from 'canvas';

interface Scene {
  index: number;
  durationMs: number;
  imageAsset?: {
    url: string;
  };
  overlayText?: string | null;
  voSegment?: {
    audioUrl?: string | null;
    durationMs?: number | null;
  } | null;
}

interface Project {
  ratio: string;
  scenes: Scene[];
  musicAsset?: {
    url: string;
  } | null;
}

type LogCallback = (message: string) => Promise<void>;

/**
 * Download file from URL (or create mock file)
 */
async function downloadFile(url: string, dest: string): Promise<void> {
  if (url.startsWith('mock://')) {
    // Create mock file
    const fileName = url.replace('mock://', '');
    if (fileName.endsWith('.mp3')) {
      // Create silent audio file (1 second)
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input('anullsrc=r=48000:cl=stereo')
          .inputFormat('lavfi')
          .duration(1)
          .output(dest)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
    } else {
      // Create placeholder image
      const canvas = createCanvas(1080, 1920);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#5A27FF';
      ctx.fillRect(0, 0, 1080, 1920);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Placeholder', 540, 960);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(dest, buffer);
    }
    return;
  }

  // For S3 URLs, download the file
  // In production, implement proper HTTP download
  // For now, assume files are accessible
  console.warn(`Skipping download for: ${url}`);
}

/**
 * Create text overlay on image
 */
async function createImageWithText(
  imagePath: string,
  text: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Load and draw image
  try {
    const image = await loadImage(imagePath);
    ctx.drawImage(image, 0, 0, width, height);
  } catch (error) {
    // If image load fails, use solid background
    ctx.fillStyle = '#5A27FF';
    ctx.fillRect(0, 0, width, height);
  }

  // Add text overlay
  if (text) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(15, 17, 21, 0.7)';
    ctx.fillRect(0, height - 300, width, 300);

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px Arial';
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
    const lineHeight = 70;
    const startY = height - 150 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });
  }

  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
}

/**
 * Render video using FFmpeg
 */
export async function renderVideo(
  project: Project,
  outputPath: string,
  logCallback?: LogCallback
): Promise<void> {
  const log = async (msg: string) => {
    console.log(`[FFmpeg] ${msg}`);
    if (logCallback) await logCallback(msg);
  };

  await log('Starting video render...');

  // Get dimensions
  const ratio = project.ratio === 'VERTICAL' ? '9:16' : project.ratio === 'HORIZONTAL' ? '16:9' : '1:1';
  const dimensions = VIDEO_DIMENSIONS[ratio];
  const { width, height } = dimensions;

  // Create temp directory
  const tempDir = path.dirname(outputPath);
  const scenesDir = path.join(tempDir, 'scenes');
  await fs.mkdir(scenesDir, { recursive: true });

  await log(`Preparing ${project.scenes.length} scenes...`);

  // Prepare scene videos
  const sceneVideos: string[] = [];

  for (const scene of project.scenes) {
    const sceneIndex = scene.index;
    const sceneOutput = path.join(scenesDir, `scene-${sceneIndex}.mp4`);

    // Prepare image with text overlay
    const imageWithText = path.join(scenesDir, `scene-${sceneIndex}-text.png`);

    if (scene.imageAsset) {
      const imagePath = path.join(scenesDir, `scene-${sceneIndex}-orig.png`);
      await downloadFile(scene.imageAsset.url, imagePath);

      await createImageWithText(
        imagePath,
        scene.overlayText || '',
        imageWithText,
        width,
        height
      );
    } else {
      // Create blank image with text
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0F1115';
      ctx.fillRect(0, 0, width, height);
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(imageWithText, buffer);
    }

    // Create video from image
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(imageWithText)
        .loop(scene.durationMs / 1000)
        .inputFPS(VIDEO_FRAME_RATE)
        .videoCodec('libx264')
        .size(`${width}x${height}`)
        .fps(VIDEO_FRAME_RATE)
        .duration(scene.durationMs / 1000)
        .output(sceneOutput)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    sceneVideos.push(sceneOutput);
    await log(`Prepared scene ${sceneIndex + 1}/${project.scenes.length}`);
  }

  await log('Concatenating scenes...');

  // Create concat file for FFmpeg
  const concatFile = path.join(tempDir, 'concat.txt');
  const concatContent = sceneVideos.map(v => `file '${v}'`).join('\n');
  await fs.writeFile(concatFile, concatContent);

  // Concatenate videos
  const videoOnly = path.join(tempDir, 'video-only.mp4');
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(concatFile)
      .inputOptions(['-f concat', '-safe 0'])
      .videoCodec('copy')
      .output(videoOnly)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  await log('Adding audio...');

  // Create final composition with VO and music
  const command = ffmpeg().input(videoOnly);

  let hasAudio = false;
  let filterComplex = '';

  // Add VO segments (simplified - assuming mock for now)
  // In production, properly time-align each VO segment

  // Add background music if available
  if (project.musicAsset && project.musicAsset.url && !project.musicAsset.url.startsWith('mock://')) {
    const musicPath = path.join(tempDir, 'music.mp3');
    await downloadFile(project.musicAsset.url, musicPath);

    command.input(musicPath);
    hasAudio = true;

    // Duck music and loop if needed
    const totalDuration = project.scenes.reduce((sum, s) => sum + s.durationMs, 0) / 1000;
    filterComplex = `[1:a]volume=${MUSIC_DUCK_DB}dB,aloop=loop=-1:size=2e+09[music];[music]atrim=0:${totalDuration}[aout]`;
  }

  // Output
  const outputOptions = [
    '-c:v libx264',
    '-preset fast',
    '-crf 23',
    '-pix_fmt yuv420p',
  ];

  if (hasAudio) {
    outputOptions.push('-c:a aac', '-b:a 192k');
  }

  if (filterComplex) {
    command.complexFilter(filterComplex, ['aout']);
  }

  await new Promise<void>((resolve, reject) => {
    command
      .outputOptions(outputOptions)
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .on('progress', (progress) => {
        if (progress.percent) {
          log(`Rendering: ${Math.round(progress.percent)}%`);
        }
      })
      .run();
  });

  await log('Render complete!');
}
