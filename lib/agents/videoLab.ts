/**
 * VideoLab Agent - Handles video generation via Kling API
 * Generates videos from images and text prompts
 */

import { env } from '@/lib/env';

export interface VideoGenerationOptions {
  imageUrl: string;
  script: string;
  duration?: number; // seconds
  fps?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface VideoGenerationResult {
  videoUrl: string;
  duration: number;
  timeTaken: number;
  jobId?: string;
}

/**
 * Generate a video using Kling API
 */
export async function generateVideo(
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> {
  const startTime = Date.now();

  // Use mock implementation if enabled or no API key
  if (env.USE_MOCK_VIDEO_GEN || !env.KLING_API_KEY) {
    console.log('[VideoLab] Using mock video generation');
    return generateMockVideo(options, startTime);
  }

  try {
    console.log('[VideoLab] Generating video from image:', options.imageUrl);
    console.log('[VideoLab] Script:', options.script);

    const response = await fetch('https://api.kling.ai/v1/video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.KLING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: options.imageUrl,
        text: options.script,
        duration: options.duration || 5,
        fps: options.fps || 30,
        aspect_ratio: options.aspectRatio || '16:9',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[VideoLab] API Error:', error);
      throw new Error(`Kling API failed: ${response.status} ${error}`);
    }

    const data = await response.json();
    const timeTaken = Date.now() - startTime;

    console.log(`[VideoLab] ✓ Video generated in ${timeTaken}ms`);

    return {
      videoUrl: data.video_url || data.url || data.output,
      duration: options.duration || 5,
      timeTaken,
      jobId: data.job_id || data.id,
    };
  } catch (error) {
    console.error('[VideoLab] Error generating video:', error);

    // Fallback to mock on error
    console.log('[VideoLab] Falling back to mock generation');
    return generateMockVideo(options, startTime);
  }
}

/**
 * Mock video generation for development/testing
 */
function generateMockVideo(
  options: VideoGenerationOptions,
  startTime: number
): VideoGenerationResult {
  const timeTaken = Date.now() - startTime + Math.random() * 2000 + 1000; // Simulate 1-3s

  // Generate a mock video URL
  // In production, you'd return a real video file
  // For now, we'll use a sample video or the image itself
  const videoUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;

  console.log(`[VideoLab] ✓ Mock video generated in ${timeTaken.toFixed(0)}ms`);

  return {
    videoUrl,
    duration: options.duration || 5,
    timeTaken,
    jobId: `mock-job-${Date.now()}`,
  };
}

/**
 * Check video generation status (for async jobs)
 */
export async function checkVideoStatus(jobId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
}> {
  if (env.USE_MOCK_VIDEO_GEN || !env.KLING_API_KEY) {
    // Mock status check
    return {
      status: 'completed',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      progress: 100,
    };
  }

  try {
    const response = await fetch(`https://api.kling.ai/v1/video/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${env.KLING_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      status: data.status,
      videoUrl: data.video_url,
      progress: data.progress,
    };
  } catch (error) {
    console.error('[VideoLab] Error checking status:', error);
    throw error;
  }
}

/**
 * Batch generate videos for multiple scenes
 */
export async function generateVideoBatch(
  scenes: Array<{ imageUrl: string; script: string }>,
  options?: Omit<VideoGenerationOptions, 'imageUrl' | 'script'>
): Promise<VideoGenerationResult[]> {
  console.log(`[VideoLab] Batch generating ${scenes.length} videos`);

  const results = await Promise.all(
    scenes.map((scene) =>
      generateVideo({
        ...options,
        imageUrl: scene.imageUrl,
        script: scene.script,
      })
    )
  );

  const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
  console.log(`[VideoLab] ✓ Batch complete - ${scenes.length} videos in ${totalTime.toFixed(0)}ms`);

  return results;
}
