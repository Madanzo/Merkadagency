/**
 * Music Provider Interface
 * Supports mock and future music library integrations
 */

export interface MusicOptions {
  mood?: string;
  durationMs: number;
  genre?: string;
}

export interface MusicResult {
  audioUrl: string;
  durationMs: number;
  title: string;
  artist: string;
  mood: string;
}

export interface MusicProvider {
  name: string;
  select(options: MusicOptions): Promise<MusicResult>;
}

/**
 * Mock Music Provider
 * Returns mock music tracks
 */
export class MockMusicProvider implements MusicProvider {
  name = 'mock-music';

  private tracks = [
    { title: 'Upbeat Corporate', artist: 'Stock Music Library', mood: 'energetic' },
    { title: 'Calm Ambient', artist: 'Stock Music Library', mood: 'calm' },
    { title: 'Inspiring Future', artist: 'Stock Music Library', mood: 'inspiring' },
    { title: 'Tech Innovation', artist: 'Stock Music Library', mood: 'modern' },
  ];

  async select(options: MusicOptions): Promise<MusicResult> {
    const mood = options.mood || 'energetic';
    const track = this.tracks.find(t => t.mood === mood) || this.tracks[0];

    console.log(`[Mock Music] Selected track: "${track.title}" (${mood})`);
    console.log(`[Mock Music] Duration: ${options.durationMs}ms`);

    return {
      audioUrl: `mock://music-${track.mood}-${Date.now()}.mp3`,
      durationMs: options.durationMs,
      title: track.title,
      artist: track.artist,
      mood: track.mood,
    };
  }
}

/**
 * Create music provider based on environment
 */
export function createMusicProvider(): MusicProvider {
  const useMock = process.env.USE_MOCK_MUSIC !== 'false';

  if (useMock) {
    return new MockMusicProvider();
  }

  // TODO: Add real music library integrations (Epidemic Sound, Artlist, etc.)
  console.warn('No music provider configured, falling back to mock');
  return new MockMusicProvider();
}
