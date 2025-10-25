/**
 * Environment variable loader with type safety
 * Ensures all required API keys are present at runtime
 */

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  // AI Generation APIs
  NANOBANANA_API_KEY: getEnvVar('NANOBANANA_API_KEY', false),
  KLING_API_KEY: getEnvVar('KLING_API_KEY', false),

  // API Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Feature flags
  USE_MOCK_IMAGE_GEN: process.env.USE_MOCK_IMAGE_GEN === 'true',
  USE_MOCK_VIDEO_GEN: process.env.USE_MOCK_VIDEO_GEN === 'true',
} as const;

// Validation on server startup (only in production)
if (env.NODE_ENV === 'production') {
  const missingKeys: string[] = [];

  if (!env.NANOBANANA_API_KEY && !env.USE_MOCK_IMAGE_GEN) {
    missingKeys.push('NANOBANANA_API_KEY');
  }

  if (!env.KLING_API_KEY && !env.USE_MOCK_VIDEO_GEN) {
    missingKeys.push('KLING_API_KEY');
  }

  if (missingKeys.length > 0) {
    console.warn(
      `[ENV] Missing API keys in production: ${missingKeys.join(', ')}. ` +
      `Set USE_MOCK_IMAGE_GEN or USE_MOCK_VIDEO_GEN to use mock implementations.`
    );
  }
}
