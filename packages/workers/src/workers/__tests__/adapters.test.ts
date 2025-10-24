/**
 * Tests for adapter interfaces
 */

import { describe, it, expect } from 'vitest';
import { MockTTSProvider } from '../../adapters/tts';
import { MockImageGenProvider } from '../../adapters/image-gen';
import { MockMusicProvider } from '../../adapters/music';

describe('Adapters', () => {
  describe('MockTTSProvider', () => {
    it('should generate TTS result with duration', async () => {
      const provider = new MockTTSProvider();
      const result = await provider.synthesize({
        text: 'This is a test voiceover script.',
      });

      expect(result).toBeDefined();
      expect(result.audioUrl).toContain('mock://');
      expect(result.durationMs).toBeGreaterThan(0);
      expect(result.format).toBe('mp3');
    });

    it('should estimate duration based on word count', async () => {
      const provider = new MockTTSProvider();
      const shortText = 'Hello';
      const longText = 'This is a much longer piece of text that should take significantly more time to speak.';

      const shortResult = await provider.synthesize({ text: shortText });
      const longResult = await provider.synthesize({ text: longText });

      expect(longResult.durationMs).toBeGreaterThan(shortResult.durationMs);
    });
  });

  describe('MockImageGenProvider', () => {
    it('should generate image placeholder', async () => {
      const provider = new MockImageGenProvider();
      const result = await provider.generate({
        prompt: 'A beautiful sunset over mountains',
        width: 1080,
        height: 1920,
      });

      expect(result).toBeDefined();
      expect(result.imageUrl).toContain('mock://');
      expect(result.width).toBe(1080);
      expect(result.height).toBe(1920);
      expect(result.format).toBe('png');
    });
  });

  describe('MockMusicProvider', () => {
    it('should select music track', async () => {
      const provider = new MockMusicProvider();
      const result = await provider.select({
        mood: 'energetic',
        durationMs: 15000,
      });

      expect(result).toBeDefined();
      expect(result.audioUrl).toContain('mock://');
      expect(result.durationMs).toBe(15000);
      expect(result.mood).toBe('energetic');
      expect(result.title).toBeDefined();
    });

    it('should handle different moods', async () => {
      const provider = new MockMusicProvider();

      const energetic = await provider.select({ mood: 'energetic', durationMs: 10000 });
      const calm = await provider.select({ mood: 'calm', durationMs: 10000 });

      expect(energetic.mood).toBe('energetic');
      expect(calm.mood).toBe('calm');
      expect(energetic.title).not.toBe(calm.title);
    });
  });
});
