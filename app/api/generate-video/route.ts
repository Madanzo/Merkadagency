import { NextResponse } from 'next/server';
import { generateVideo } from '@/lib/agents/videoLab';

/**
 * POST /api/generate-video
 * Generate a video from an image and script using Kling
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, script, duration, fps, aspectRatio } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!script) {
      return NextResponse.json(
        { error: 'Script is required' },
        { status: 400 }
      );
    }

    console.log('[API] Generate video request:', { imageUrl, script, duration });

    const result = await generateVideo({
      imageUrl,
      script,
      duration,
      fps,
      aspectRatio,
    });

    return NextResponse.json({
      success: true,
      video_url: result.videoUrl,
      duration: result.duration,
      job_id: result.jobId,
      time_taken_ms: result.timeTaken,
    });
  } catch (error) {
    console.error('[API] Error generating video:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate video',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
