import { NextResponse } from 'next/server';
import { generateImage } from '@/lib/agents/imageLab';

/**
 * POST /api/generate-image
 * Generate an image from a text prompt using Nano Banana
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, width, height, steps, seed } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('[API] Generate image request:', { prompt, aspectRatio });

    const result = await generateImage({
      prompt,
      aspectRatio,
      width,
      height,
      steps,
      seed,
    });

    return NextResponse.json({
      success: true,
      image_url: result.imageUrl,
      seed: result.seed,
      time_taken_ms: result.timeTaken,
    });
  } catch (error) {
    console.error('[API] Error generating image:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
