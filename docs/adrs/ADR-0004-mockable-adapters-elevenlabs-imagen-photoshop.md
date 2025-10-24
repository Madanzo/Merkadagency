# ADR-0004: Mockable Adapters for External Services

**Status**: Accepted
**Date**: 2025-01-24
**Deciders**: Engineering Team
**Related**: [ADR-0002](./ADR-0002-queue-and-workers-bullmq.md)

## Context

Need TTS, image generation, and music services for production quality. But:
- APIs require paid subscriptions
- Rate limits complicate development
- Testing shouldn't hit real APIs
- Want flexibility to swap providers

## Decision

Use **Adapter Pattern** with mock and real implementations.

**Interfaces**:
- `TTSProvider` (Mock, ElevenLabs)
- `ImageGenProvider` (Mock, Stability AI, Photoshop)
- `MusicProvider` (Mock, Epidemic Sound, Artlist)

**Environment toggle**:
```env
USE_MOCK_TTS=true
USE_MOCK_IMAGE_GEN=true
USE_MOCK_MUSIC=true
```

## Alternatives Considered

### 1. Direct API Calls (No Abstraction)

**Pros**:
- Simpler, less code
- No interface overhead

**Cons**:
- Tightly coupled to one provider
- Can't test without API keys
- Hard to swap providers later

### 2. Service Layer (API Gateway)

**Pros**:
- Centralized service management

**Cons**:
- Adds network hop
- More complex architecture
- Overkill for MVP

### 3. Dependency Injection

**Pros**:
- Very testable
- Clean separation

**Cons**:
- More boilerplate
- Harder to understand for simple cases

## Consequences

### Positive

- **Development**: Works without API keys
- **Testing**: Mock providers in unit tests
- **Flexibility**: Swap ElevenLabs → Google TTS easily
- **Cost control**: Don't burn API credits in dev

### Negative

- **Maintenance**: Must keep mocks in sync with real APIs
- **False confidence**: Tests pass with mocks, fail with real APIs

### Mitigation

- Integration tests with real APIs in staging
- Document API differences in adapter code
- Regular manual QA with real services

## Implementation Notes

**Interface**:
```typescript
interface TTSProvider {
  name: string;
  synthesize(options: TTSOptions): Promise<TTSResult>;
}
```

**Mock**:
```typescript
class MockTTSProvider implements TTSProvider {
  async synthesize(options) {
    return {
      audioUrl: 'mock://audio.mp3',
      durationMs: estimateDuration(options.text),
      format: 'mp3',
    };
  }
}
```

**Real**:
```typescript
class ElevenLabsTTSProvider implements TTSProvider {
  async synthesize(options) {
    const res = await fetch('https://api.elevenlabs.io/...', ...);
    // Upload to S3, return URL
  }
}
```

**Factory**:
```typescript
export function createTTSProvider(): TTSProvider {
  return process.env.USE_MOCK_TTS === 'false'
    ? new ElevenLabsTTSProvider(process.env.ELEVENLABS_API_KEY!)
    : new MockTTSProvider();
}
```

---

**Next Review**: 2025-04-24 - Evaluate if adapter pattern scales to 5+ providers.
