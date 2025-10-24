/**
 * Text-to-Speech Provider Interface
 * Supports mock and ElevenLabs implementations
 */

export interface TTSOptions {
  text: string;
  voiceId?: string;
  model?: string;
}

export interface TTSResult {
  audioUrl: string;
  durationMs: number;
  format: string;
}

export interface TTSProvider {
  name: string;
  synthesize(options: TTSOptions): Promise<TTSResult>;
}

/**
 * Mock TTS Provider
 * Returns a mock audio URL and calculated duration
 */
export class MockTTSProvider implements TTSProvider {
  name = 'mock-tts';

  async synthesize(options: TTSOptions): Promise<TTSResult> {
    // Estimate duration: ~150 words per minute, ~5 chars per word
    const words = options.text.split(/\s+/).length;
    const durationMs = Math.ceil((words / 150) * 60 * 1000);

    console.log(`[Mock TTS] Generated audio for: "${options.text.substring(0, 50)}..."`);
    console.log(`[Mock TTS] Duration: ${durationMs}ms (${words} words)`);

    // In production, this would be a real audio file URL
    return {
      audioUrl: `mock://tts-audio-${Date.now()}.mp3`,
      durationMs,
      format: 'mp3',
    };
  }
}

/**
 * ElevenLabs TTS Provider
 * TODO: Implement when ELEVENLABS_API_KEY is available
 */
export class ElevenLabsTTSProvider implements TTSProvider {
  name = 'elevenlabs';
  private apiKey: string;
  private defaultVoiceId: string;

  constructor(apiKey: string, defaultVoiceId?: string) {
    this.apiKey = apiKey;
    this.defaultVoiceId = defaultVoiceId || 'EXAVITQu4vr4xnSDxMaL'; // Default voice
  }

  async synthesize(options: TTSOptions): Promise<TTSResult> {
    // TODO: Implement ElevenLabs API integration
    // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'audio/mpeg',
    //     'Content-Type': 'application/json',
    //     'xi-api-key': this.apiKey,
    //   },
    //   body: JSON.stringify({
    //     text: options.text,
    //     model_id: options.model || 'eleven_monolingual_v1',
    //   }),
    // });

    throw new Error('ElevenLabs TTS not implemented yet. Use mock provider.');
  }
}

/**
 * Create TTS provider based on environment
 */
export function createTTSProvider(): TTSProvider {
  const useMock = process.env.USE_MOCK_TTS !== 'false';

  if (useMock) {
    return new MockTTSProvider();
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn('ELEVENLABS_API_KEY not set, falling back to mock TTS');
    return new MockTTSProvider();
  }

  return new ElevenLabsTTSProvider(apiKey, process.env.ELEVENLABS_VOICE_ID);
}
