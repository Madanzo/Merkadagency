# ADR-0002: Queue and Workers with BullMQ

**Status**: Accepted
**Date**: 2025-01-24
**Deciders**: Engineering Team
**Related**: [ADR-0001](./ADR-0001-monorepo-structure.md)

## Context

Video rendering is CPU-intensive and slow (5-10 minutes). We need:
- Async job processing (don't block API)
- Job retry with backoff
- Queue monitoring and management
- Scalable worker architecture

## Decision

Use **BullMQ** + **Redis** for async job processing.

Five worker types:
1. Director (storyboard generation)
2. ImageLab (image processing)
3. ScriptVO (TTS)
4. Music (music selection)
5. Editor (FFmpeg rendering)

## Alternatives Considered

### 1. Direct Processing (No Queue)

**Pros**:
- Simpler architecture
- No Redis dependency

**Cons**:
- Blocks API requests
- No retry mechanism
- Can't scale workers independently

### 2. AWS SQS + Lambda

**Pros**:
- Managed service (no Redis to maintain)
- Auto-scaling

**Cons**:
- Vendor lock-in
- Cold start latency
- More expensive at scale
- Lambda timeout limits (15 min) problematic for rendering

### 3. Celery (Python)

**Pros**:
- Mature, proven at scale

**Cons**:
- Requires Python (we're Node.js)
- Different language for workers

## Consequences

### Positive

- **Async**: API responds immediately, jobs process in background
- **Retry**: Exponential backoff on transient failures
- **Scalable**: Add more workers horizontally
- **Monitoring**: BullBoard UI for queue inspection (future)
- **Ecosystem**: BullMQ well-maintained, good docs

### Negative

- **Redis dependency**: Need Redis in production
- **Complexity**: More moving parts vs. direct processing
- **State management**: Jobs are stateless, must query DB for context

### Mitigation

- Use managed Redis (ElastiCache, Upstash) in production
- Comprehensive logging for debugging
- Health checks for worker processes

## Implementation Notes

**Queue Configuration**:
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s, 4s, 8s
  },
  removeOnComplete: {
    age: 86400, // 24 hours
  },
}
```

**Worker Concurrency**:
- Director: 2 (lightweight)
- ImageLab: 4 (CPU-bound)
- Editor: 1 (heavy FFmpeg)

---

**Next Review**: 2025-04-24 - Monitor queue depth, failure rates, retry patterns.
