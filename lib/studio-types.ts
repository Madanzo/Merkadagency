/**
 * Shared TypeScript types for Studio components
 * These types ensure consistency across all Studio UI components
 */

export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
  duration?: number;
  createdAt: Date;
}

export interface Scene {
  id: string;
  order: number;
  imageUrl?: string;
  visualDescription: string;
  duration: number;
}

export interface VoSegment {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  sceneOrder: number;
}

export interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  url?: string;
}

export interface RenderJob {
  id: string;
  projectName: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  fcpxmlUrl?: string;
  edlUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface Project {
  id: string;
  name: string;
  brief?: string;
  status: 'draft' | 'storyboard' | 'production' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
