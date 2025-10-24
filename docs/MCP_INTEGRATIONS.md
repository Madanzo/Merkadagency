# MCP Integrations

**Last updated:** 2025-01-24

## Overview

MerkadAgency integrates with external services via swappable adapters. All integrations have mock implementations for development.

## Integration Matrix

| Service | Status | Purpose | Adapter | Cost Guard |
|---------|--------|---------|---------|------------|
| **ElevenLabs** | Planned | Text-to-speech | `TTSProvider` | API key required |
| **Stability AI** | Planned | Image generation (SDXL) | `ImageGenProvider` | API key required |
| **Adobe Photoshop** | Future | Image compositing | `ImageGenProvider` | OAuth + Cloud API |
| **Epidemic Sound** | Future | Licensed music | `MusicProvider` | Subscription required |
| **Artlist** | Future | Licensed music | `MusicProvider` | Subscription required |
| **MinIO/S3** | Active | File storage | Direct | Included |
| **Whisper** | Future | Speech-to-text | `TranscriptionProvider` | OpenAI API |

## ElevenLabs (TTS)

**Status**: Interface ready, implementation pending

### Setup

```bash
# .env
ELEVENLABS_API_KEY=sk-...
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
USE_MOCK_TTS=false
```

### Rate Limits

- **Free tier**: 10,000 chars/month
- **Paid tier**: Unlimited
- **Cost**: $0.30/1K chars (standard)

### Cost Guard

```typescript
const textLength = text.length;
if (textLength > 5000) {
  throw new Error('Text too long for TTS (max 5000 chars)');
}
```

### Implementation

```typescript
class ElevenLabsTTSProvider implements TTSProvider {
  async synthesize(options: TTSOptions): Promise<TTSResult> {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey,
      },
      body: JSON.stringify({ text: options.text, model_id: 'eleven_monolingual_v1' }),
    });
    // Upload to S3, return URL
  }
}
```

## Stability AI (Image Generation)

**Status**: Interface ready, implementation pending

### Setup

```bash
# .env
STABILITY_API_KEY=sk-...
USE_MOCK_IMAGE_GEN=false
```

### Rate Limits

- **Cost**: $0.04/image (SDXL 1.0)
- **Rate**: ~10 images/min

### Cost Guard

```typescript
const budget = await getMonthlyBudget(userId);
if (budget.imageGenSpend > budget.imageGenLimit) {
  throw new Error('Monthly image generation budget exceeded');
}
```

## Storage (S3/MinIO)

**Status**: Active

### Configuration

```bash
# .env
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=merkadagency
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
```

### Usage Patterns

- **Presigned URLs**: Client uploads directly to S3
- **Public access**: Bucket configured for public reads
- **Lifecycle**: Delete old renders after 30 days (future)

---

**See [SECURITY_COMPLIANCE.md](./SECURITY_COMPLIANCE.md) for security practices.**
