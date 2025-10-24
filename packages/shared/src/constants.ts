export const BRAND_THEME = {
  ink: '#0F1115',
  violet: '#5A27FF',
  teal: '#16B8A6',
  gray: '#9CA3AF',
  white: '#FFFFFF',
} as const;

export const VIDEO_DIMENSIONS = {
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '1:1': { width: 1080, height: 1080 },
} as const;

export const VIDEO_FRAME_RATE = 30;

export const AUDIO_SAMPLE_RATE = 48000;

export const MAX_SCENES = 20;
export const MIN_SCENES = 3;

export const DEFAULT_SCENE_DURATION_MS = 2000;
export const MIN_SCENE_DURATION_MS = 500;
export const MAX_SCENE_DURATION_MS = 10000;

export const TARGET_VIDEO_DURATION_MS = 15000; // 15 seconds for MVP

export const MUSIC_DUCK_DB = -12; // Duck music by 12dB when VO is playing

export const QUEUE_NAMES = {
  DIRECTOR: 'director-queue',
  IMAGE_LAB: 'imagelab-queue',
  SCRIPT_VO: 'scriptvo-queue',
  MUSIC: 'music-queue',
  EDITOR: 'editor-queue',
} as const;

export const JOB_TYPES = {
  GENERATE_STORYBOARD: 'generate-storyboard',
  GENERATE_IMAGES: 'generate-images',
  GENERATE_VO: 'generate-vo',
  SELECT_MUSIC: 'select-music',
  RENDER_VIDEO: 'render-video',
} as const;
