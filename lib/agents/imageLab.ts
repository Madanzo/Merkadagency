/**
 * ImageLab Agent - Handles image generation via Nano Banana API
 * Generates images from text prompts for storyboard scenes
 */

import { env } from '@/lib/env';

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
}

export interface ImageGenerationResult {
  imageUrl: string;
  seed?: number;
  timeTaken: number;
}

/**
 * Generate an image using Nano Banana API
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const startTime = Date.now();

  // Use mock implementation if enabled or no API key
  if (env.USE_MOCK_IMAGE_GEN || !env.NANOBANANA_API_KEY) {
    console.log('[ImageLab] Using mock image generation');
    return generateMockImage(options, startTime);
  }

  try {
    console.log('[ImageLab] Generating image with prompt:', options.prompt);

    const response = await fetch('https://api.nanobanana.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NANOBANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio || '16:9',
        width: options.width || 1024,
        height: options.height || 576,
        steps: options.steps || 30,
        seed: options.seed,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[ImageLab] API Error:', error);
      throw new Error(`Nano Banana API failed: ${response.status} ${error}`);
    }

    const data = await response.json();
    const timeTaken = Date.now() - startTime;

    console.log(`[ImageLab] ✓ Image generated in ${timeTaken}ms`);

    return {
      imageUrl: data.image_url || data.url || data.output,
      seed: data.seed,
      timeTaken,
    };
  } catch (error) {
    console.error('[ImageLab] Error generating image:', error);

    // Fallback to mock on error
    console.log('[ImageLab] Falling back to mock generation');
    return generateMockImage(options, startTime);
  }
}

/**
 * Mock image generation for development/testing
 */
function generateMockImage(
  options: ImageGenerationOptions,
  startTime: number
): ImageGenerationResult {
  const timeTaken = Date.now() - startTime + Math.random() * 1000 + 500; // Simulate 500-1500ms

  // Generate a placeholder image URL based on prompt
  const encodedPrompt = encodeURIComponent(options.prompt.slice(0, 50));
  const [width, height] = options.aspectRatio === '9:16'
    ? [576, 1024]
    : options.aspectRatio === '1:1'
    ? [1024, 1024]
    : [1024, 576];

  // Use a placeholder service that generates images with text
  const imageUrl = `https://placehold.co/${width}x${height}/5A27FF/FFFFFF?text=${encodedPrompt}`;

  console.log(`[ImageLab] ✓ Mock image generated in ${timeTaken.toFixed(0)}ms`);

  return {
    imageUrl,
    seed: Math.floor(Math.random() * 1000000),
    timeTaken,
  };
}

/**
 * Batch generate images for multiple prompts
 */
export async function generateImageBatch(
  prompts: string[],
  options?: Omit<ImageGenerationOptions, 'prompt'>
): Promise<ImageGenerationResult[]> {
  console.log(`[ImageLab] Batch generating ${prompts.length} images`);

  const results = await Promise.all(
    prompts.map((prompt) =>
      generateImage({
        ...options,
        prompt,
      })
    )
  );

  const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
  console.log(`[ImageLab] ✓ Batch complete - ${prompts.length} images in ${totalTime.toFixed(0)}ms`);

  return results;
}
