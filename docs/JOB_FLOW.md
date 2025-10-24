# Job Flow & Queue Topology

**Last updated:** 2025-01-24

## Overview

MerkadAgency uses [BullMQ](https://docs.bullmq.io/) + Redis for async job processing. Five worker types handle different stages of video production.

## Queue Topology

```
┌─────────────────┐
│  API Server     │ Enqueues jobs
└────────┬────────┘
         │
    ┌────▼─────┬──────────┬──────────┬─────────┐
    │          │          │          │         │
┌───▼───┐  ┌──▼───┐  ┌──▼───┐  ┌───▼──┐  ┌──▼────┐
│Director│ │Image │ │Script│ │Music │ │ Editor │
│ Queue  │ │ Lab  │ │ &VO  │ │Queue │ │ Queue  │
└───┬────┘ └──┬───┘ └──┬───┘ └───┬──┘ └───┬────┘
    │          │        │         │        │
┌───▼──────────▼────────▼─────────▼────────▼────┐
│              Workers (5 types)                 │
│  Read/Write: Postgres + S3                    │
└────────────────────────────────────────────────┘
```

## Queue Names

| Queue | Purpose | Worker |
|-------|---------|--------|
| `director-queue` | Storyboard generation | Director Worker |
| `imagelab-queue` | Image generation | ImageLab Worker |
| `scriptvo-queue` | Script + TTS | ScriptVO Worker |
| `music-queue` | Music selection | Music Worker |
| `editor-queue` | Video rendering | Editor Worker |

## Job Types

| Job Type | Queue | Data |
|----------|-------|------|
| `generate-storyboard` | director-queue | `{ projectId, brief }` |
| `generate-images` | imagelab-queue | `{ projectId, sceneIds[] }` |
| `generate-vo` | scriptvo-queue | `{ projectId, useMock }` |
| `select-music` | music-queue | `{ projectId, mood?, useMock }` |
| `render-video` | editor-queue | `{ projectId, renderJobId, exportFcpxml, exportEdl }` |

## Job Lifecycle

### States

```
queued → active → completed
           ↓
         failed
           ↓
        (retry)
```

1. **Queued**: Job added to queue, waiting for worker
2. **Active**: Worker picked up job, processing
3. **Completed**: Job finished successfully
4. **Failed**: Job encountered error
5. **Retry**: Failed job re-queued (up to 3 attempts)

### Example Timeline

```
T+0s    User creates project
        → Project record created (status: draft)
        → Director job enqueued

T+2s    Director worker picks up job
        → Generates 6-scene storyboard
        → Creates Scene records
        → Updates project (status: storyboard_generated)
        → Enqueues ImageLab job
        → Director job completed

T+5s    ImageLab worker picks up job
        → Processes 6 scenes in parallel
        → Creates placeholder images (Canvas)
        → Uploads to S3
        → Creates Asset records
        → Links assets to scenes
        → ImageLab job completed

T+60s   User clicks "Generate VO"
        → API enqueues ScriptVO job

T+62s   ScriptVO worker picks up job
        → Generates script for each scene
        → Calls TTS adapter (mock)
        → Creates VoSegment records
        → Links segments to scenes
        → Updates project (status: vo_generated)
        → ScriptVO job completed

T+90s   User clicks "Select Music"
        → API enqueues Music job

T+92s   Music worker picks up job
        → Calls Music adapter (mock)
        → Creates music Asset
        → Links to project
        → Updates project (status: music_selected)
        → Music job completed

T+120s  User clicks "Render"
        → API creates RenderJob (status: queued)
        → API enqueues Editor job

T+125s  Editor worker picks up job
        → Downloads assets (or uses mock)
        → Runs FFmpeg pipeline (5 min)
        → Generates FCPXML/EDL
        → Uploads artifacts to S3
        → Updates RenderJob (status: completed)
        → Updates project (status: completed)
        → Editor job completed

T+450s  User downloads MP4 + FCPXML
```

## Retry Strategy

### Configuration

```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s, 4s, 8s
  },
}
```

### Retry Scenarios

- **Transient failures**: Network errors, S3 timeouts → Retry
- **Permanent failures**: Invalid data, missing dependencies → Don't retry
- **Resource exhaustion**: FFmpeg OOM → Retry with smaller batch

### Error Handling

Workers catch errors, log details, update job/project status:

```typescript
try {
  // worker logic
} catch (error) {
  console.error('[Worker] Error:', error);
  await updateJobStatus('failed', error.message);
  throw error; // Triggers BullMQ retry
}
```

## Logging

### Log Fields

```json
{
  "timestamp": "2025-01-24T10:35:00Z",
  "level": "info",
  "worker": "director",
  "jobId": "uuid",
  "projectId": "uuid",
  "message": "Storyboard generated",
  "meta": {
    "sceneCount": 6,
    "totalDurationMs": 15000
  }
}
```

### Log Levels

- **debug**: Detailed execution steps
- **info**: Normal operation (job started, completed)
- **warn**: Recoverable issues (retry triggered)
- **error**: Failures requiring attention

## Monitoring

### Metrics to Track

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Queue depth** | Jobs waiting in queue | >100 |
| **Processing time** | Avg job duration | >10 min (editor) |
| **Failure rate** | % of failed jobs | >5% |
| **Retry rate** | % of retried jobs | >20% |
| **Worker utilization** | Active workers / total | <50% or >90% |

### Health Checks

```bash
# Redis connection
redis-cli ping

# Queue status
redis-cli KEYS bull:*

# Worker count
ps aux | grep node | grep worker
```

## Concurrency

### Worker Concurrency

```typescript
// packages/workers/src/index.ts
new Worker(QUEUE_NAMES.DIRECTOR, handler, {
  connection,
  concurrency: 2, // Process 2 jobs at a time
});
```

### Per-Queue Limits

| Queue | Concurrency | Reason |
|-------|-------------|--------|
| Director | 2 | Lightweight (JSON generation) |
| ImageLab | 4 | CPU-bound (Canvas) |
| ScriptVO | 3 | API rate limits |
| Music | 3 | API rate limits |
| Editor | 1 | Heavy (FFmpeg CPU/memory) |

## Job Chaining

### Auto-Chaining

Director → ImageLab (automatic):

```typescript
// Director worker
const scenes = await createScenes(projectId);
await imageLabQueue.add('generate-images', {
  projectId,
  sceneIds: scenes.map(s => s.id),
});
```

### Manual Chaining

User-triggered jobs (VO, Music, Render):

```typescript
// API route
app.post('/api/projects/:id/generate-vo', async (req, res) => {
  const job = await scriptVoQueue.add('generate-vo', {
    projectId: req.params.id,
    useMock: req.body.useMock,
  });
  res.json({ jobId: job.id });
});
```

## Cleanup

### Completed Jobs

```typescript
// Auto-remove completed jobs after 24 hours
{
  removeOnComplete: {
    age: 86400, // seconds
    count: 1000, // max to keep
  },
}
```

### Failed Jobs

Keep failed jobs for debugging:

```typescript
{
  removeOnFail: false, // Never auto-remove
}
```

Manual cleanup:

```bash
# Remove old failed jobs
redis-cli KEYS bull:*:failed | xargs redis-cli DEL
```

---

**Next**: See [RENDER_PIPELINE.md](./RENDER_PIPELINE.md) for FFmpeg rendering details.
