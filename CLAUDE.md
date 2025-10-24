# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MerkadAgency is a production-ready monorepo for creating AI-powered short product videos. It implements an end-to-end workflow: Brief → Storyboard → Images → Voiceover → Music → FFmpeg Render → MP4 + FCPXML/EDL export.

## Architecture

### Monorepo Structure (TurboRepo + pnpm)

- **packages/shared**: Zod schemas, TypeScript types, constants, FCPXML/EDL generators
- **packages/api**: Express REST API, Prisma ORM, BullMQ queue management, S3 storage
- **packages/workers**: BullMQ workers (Director, ImageLab, ScriptVO, Music, Editor)
- **packages/web**: Next.js 14 (App Router), shadcn/ui, Tailwind dark theme
- **docker-compose.yml**: Postgres, Redis, MinIO for local development

### Key Technologies

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui (Radix)
- **Backend**: Node.js + Express, Prisma (Postgres), BullMQ (Redis)
- **Storage**: S3-compatible (MinIO local, AWS S3 production)
- **Video**: FFmpeg via fluent-ffmpeg, Canvas for image generation
- **Queue**: BullMQ + Redis for async job processing

## Development Commands

```bash
# Install all dependencies
pnpm install

# Start infrastructure (Postgres, Redis, MinIO)
docker-compose up -d

# Initialize database
pnpm db:push

# Start all services (web, api, workers)
pnpm dev

# Run tests
pnpm test

# Database management
pnpm db:migrate      # Create migration
pnpm db:studio       # Open Prisma Studio
pnpm seed            # Seed sample data
```

## Common Development Tasks

### Adding a New API Endpoint

1. Define request/response schemas in `packages/shared/src/schemas.ts` using Zod
2. Create route handler in `packages/api/src/routes/` using Express Router
3. Register route in `packages/api/src/index.ts`
4. Add API client function in `packages/web/src/lib/api.ts`
5. Update types in shared package if needed

### Creating a New Worker

1. Define job data interface in worker file
2. Create worker function in `packages/workers/src/workers/`
3. Export and register in `packages/workers/src/index.ts`
4. Add queue helper in `packages/api/src/lib/queue.ts`
5. Enqueue jobs from API routes as needed

### Modifying Database Schema

1. Edit `packages/api/prisma/schema.prisma`
2. Run `pnpm db:push` (dev) or `pnpm db:migrate` (production)
3. Update corresponding Zod schemas in `packages/shared/src/schemas.ts`
4. Regenerate Prisma client: `pnpm --filter @merkad/api db:generate`

### Adding Adapter Providers

All external services use swappable adapter interfaces:

- **TTS**: `packages/workers/src/adapters/tts.ts` - implement `TTSProvider` interface
- **Image Gen**: `packages/workers/src/adapters/image-gen.ts` - implement `ImageGenProvider` interface
- **Music**: `packages/workers/src/adapters/music.ts` - implement `MusicProvider` interface

Mock implementations are default. Switch by setting env vars (e.g., `USE_MOCK_TTS=false`, `ELEVENLABS_API_KEY=xxx`).

## Data Flow

1. **User creates project** → API creates Project record → Enqueues Director job
2. **Director worker** → Generates storyboard → Creates Scenes → Auto-enqueues ImageLab job
3. **ImageLab worker** → Creates placeholder images with Canvas → Uploads to S3 → Links to Scenes
4. **User clicks "Generate VO"** → API enqueues ScriptVO job
5. **ScriptVO worker** → Generates script → Calls TTS adapter → Creates VoSegments
6. **User clicks "Select Music"** → API enqueues Music job
7. **Music worker** → Calls Music adapter → Creates music Asset
8. **User clicks "Render"** → API creates RenderJob → Enqueues Editor job
9. **Editor worker** → Downloads assets → FFmpeg assembly → Uploads MP4/FCPXML → Updates RenderJob

## Video Rendering Pipeline (Editor Worker)

The Editor worker (`packages/workers/src/lib/ffmpeg-renderer.ts`) orchestrates FFmpeg:

1. For each scene: Create image with text overlay using Canvas
2. Convert images to video segments (loop for duration)
3. Concatenate all segments
4. Layer VO audio at correct timestamps
5. Add music track, ducked -12dB when VO plays
6. Normalize loudness (EBU R128 approximation)
7. Export MP4 (H.264, AAC, 30fps, 1080x1920 for 9:16)
8. Generate FCPXML/EDL with asset references

## Important Patterns

### Error Handling in Workers

Workers should catch errors, update job/project status to 'failed', log errors, then re-throw:

```typescript
try {
  // worker logic
} catch (error) {
  console.error('[Worker] Error:', error);
  await prisma.renderJob.update({
    where: { id: jobId },
    data: { status: 'failed', error: error.message },
  });
  throw error;
}
```

### S3 Upload Pattern

Use presigned URLs for client uploads:

1. Client requests upload URL from API
2. API generates presigned PUT URL via AWS SDK
3. Client uploads directly to S3 using presigned URL
4. API creates Asset record with public URL

### Queue Job Chaining

Workers can enqueue subsequent jobs automatically (see Director → ImageLab chain).

## Testing

- **Adapter tests**: `packages/workers/src/workers/__tests__/adapters.test.ts`
- Run with `pnpm test` (uses Vitest)
- Mock adapters allow testing without external API keys

## Environment Variables

See `.env.example`. Critical ones:

- `DATABASE_URL`: Postgres connection string
- `REDIS_URL`: Redis connection string
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`: Storage config
- `USE_MOCK_TTS`, `USE_MOCK_IMAGE_GEN`, `USE_MOCK_MUSIC`: Feature flags
- `ELEVENLABS_API_KEY`, `STABILITY_API_KEY`: Real service keys (optional)
- `FFMPEG_PATH`: Path to FFmpeg binary (default: `ffmpeg`)

## Brand Theme

UI uses dark theme with brand colors (defined in `packages/shared/src/constants.ts`):

- Ink: #0F1115 (background)
- Violet: #5A27FF (primary)
- Teal: #16B8A6 (accent)
- Gray: #9CA3AF (muted)
- White: #FFFFFF (foreground)

## Debugging Tips

- Check worker logs: Workers log to console with `[WorkerName]` prefix
- Inspect queues: Use Redis CLI or BullBoard (not implemented yet)
- Database inspection: `pnpm db:studio` opens Prisma Studio
- FFmpeg debugging: Workers log FFmpeg commands and progress
- MinIO console: http://localhost:9001 (minioadmin/minioadmin)

## Next Steps for Development

Priority features to add:

1. **Real TTS**: Implement ElevenLabs adapter (template in `tts.ts`)
2. **Real Image Gen**: Implement Stability AI SDXL adapter (template in `image-gen.ts`)
3. **Asset Upload UI**: Drag-and-drop in web app for custom images/videos
4. **Timeline Editor**: Visual editing of scene order, durations, transitions
5. **Remotion Templates**: Alternative to FFmpeg for complex animations
6. **Webhook Notifications**: Notify on render completion
7. **BullBoard Dashboard**: Monitor queue jobs in real-time

## Known Limitations (MVP 0.1)

- TTS/Image/Music use mocks by default (need API keys for real services)
- FFmpeg rendering is synchronous (blocks worker; consider job timeout)
- No real-time render progress (progress is estimated)
- File downloads from S3 URLs are not implemented (workers assume mock:// URLs)
- No user authentication (single-tenant for now)
- Canvas-based text overlay is basic (no advanced typography)
- No crossfade transitions implemented yet (concatenate only)

## File Paths Reference

- Prisma schema: `packages/api/prisma/schema.prisma`
- API routes: `packages/api/src/routes/*.ts`
- Queue setup: `packages/api/src/lib/queue.ts`
- Workers: `packages/workers/src/workers/*.ts`
- Adapters: `packages/workers/src/adapters/*.ts`
- FFmpeg renderer: `packages/workers/src/lib/ffmpeg-renderer.ts`
- Shared schemas: `packages/shared/src/schemas.ts`
- Web pages: `packages/web/src/app/**/*.tsx`
- Web API client: `packages/web/src/lib/api.ts`
