# MVP 0.1 Scope

**Last updated:** 2025-01-24

## Overview

MVP 0.1 delivers a working end-to-end slice: a user can input a product brief and receive a rendered 15-second vertical video (9:16) with AI-generated storyboard, placeholder images, mock voiceover, mock background music, and professional exports (MP4 + FCPXML/EDL).

**Goal**: Prove the technical feasibility of the workflow and establish the foundation for future iterations.

## One-Sentence Scope

**Submit a brief → system generates storyboard → renders 15s 9:16 video with images, VO, and music → exports MP4 + FCPXML.**

## Detailed Workflow

### User Journey

1. **User visits web UI** (http://localhost:3000)
2. **Creates new project** with title and brief (e.g., "Smartwatch ad highlighting health tracking")
3. **System automatically**:
   - Generates 5-6 scene storyboard (~15 seconds total)
   - Creates placeholder images for each scene (colored backgrounds with text)
4. **User clicks "Generate VO"** → system creates mock voiceover segments
5. **User clicks "Select Music"** → system assigns mock background music
6. **User clicks "Render"** → FFmpeg assembles final video
7. **User downloads** MP4 and FCPXML files

### Technical Flow

```
Brief (API)
  ↓
Director Worker (generates storyboard, creates scenes in DB)
  ↓
ImageLab Worker (creates placeholder images, uploads to S3)
  ↓
[User action] Generate VO
  ↓
ScriptVO Worker (generates script, creates mock TTS segments)
  ↓
[User action] Select Music
  ↓
Music Worker (assigns mock background track)
  ↓
[User action] Render
  ↓
Editor Worker (FFmpeg assembly: scenes + VO + music → MP4 + FCPXML/EDL)
  ↓
Download artifacts
```

## In Scope / Out of Scope

### ✅ In Scope (MVP 0.1)

| Feature | Details |
|---------|---------|
| **Web UI** | Dashboard, project list, project canvas with storyboard view |
| **Project creation** | Title + brief → auto-generate storyboard |
| **Storyboard generation** | 5-6 scenes, ~15 seconds total, mock AI (no real LLM yet) |
| **Placeholder images** | Canvas-based colored backgrounds with scene text |
| **Mock voiceover** | TTS adapter interface with mock implementation |
| **Mock music** | Music provider interface with mock track selection |
| **Video rendering** | FFmpeg assembly: 1080×1920 @ 30fps, H.264, AAC |
| **Audio mixing** | VO + music, music ducked -12dB under VO |
| **Professional exports** | MP4 + FCPXML + EDL (CMX 3600) |
| **S3 storage** | MinIO for local dev, presigned URLs for uploads |
| **Queue-based workers** | BullMQ + Redis for async job processing |
| **Database** | Postgres + Prisma ORM |
| **Adapter interfaces** | Swappable TTS, ImageGen, Music providers |
| **Dark theme UI** | Brand colors (ink, violet, teal) with shadcn/ui |
| **Monorepo structure** | TurboRepo with pnpm workspaces |
| **Local dev setup** | Docker Compose for infrastructure |
| **Basic tests** | Unit tests for adapters |

### ❌ Out of Scope (Future Versions)

| Feature | Deferred To |
|---------|-------------|
| **User authentication** | 0.2 |
| **Asset upload UI** | 0.2 (API already supports it) |
| **Custom brand tokens** | 0.2 |
| **Real TTS (ElevenLabs)** | 0.2 |
| **Real image generation (SDXL)** | 0.2 |
| **Real music libraries** | 0.3 |
| **Timeline editor** | 0.3 |
| **Multiple video templates** | 0.3 |
| **Batch video generation** | 0.3 |
| **Remotion templates** | 0.4 |
| **16:9 and 1:1 ratios** | 0.2 (DB supports, just not tested) |
| **Crossfade transitions** | 0.2 |
| **Advanced text animations** | 0.3 |
| **Stock footage search** | 0.3 |
| **Collaboration features** | 0.4+ |
| **Webhooks** | 0.3 |
| **Mobile app** | Post-MVP |

## Acceptance Criteria

### Functional Requirements

All criteria below must pass before MVP 0.1 is considered complete:

#### 1. Setup & Installation
- [ ] `pnpm install` completes without errors
- [ ] `docker-compose up -d` starts Postgres, Redis, MinIO successfully
- [ ] `pnpm db:push` initializes database schema
- [ ] `pnpm dev` starts web (3000), api (3001), and workers
- [ ] All services remain stable for >5 minutes

#### 2. Project Creation
- [ ] User can visit http://localhost:3000
- [ ] User can click "New Project" button
- [ ] User can enter project title (required, <200 chars)
- [ ] User can enter project brief (required, >10 chars)
- [ ] System creates project and redirects to project page
- [ ] Project status shows "draft" initially

#### 3. Storyboard Generation
- [ ] Director worker auto-triggers on project creation
- [ ] Storyboard contains 5-8 scenes
- [ ] Total duration is ~13-17 seconds
- [ ] Each scene has: index, duration, overlay text
- [ ] Project status updates to "storyboard_generated"

#### 4. Image Generation
- [ ] ImageLab worker auto-triggers after storyboard
- [ ] Each scene gets a placeholder image (PNG)
- [ ] Images are 1080×1920 resolution
- [ ] Images uploaded to S3 (MinIO) successfully
- [ ] Scene records link to image assets

#### 5. Voiceover Generation
- [ ] User can click "Generate VO" button
- [ ] Button is disabled until storyboard is complete
- [ ] ScriptVO worker creates VoSegments for each scene
- [ ] Each VoSegment has text and estimated duration
- [ ] Project status updates to "vo_generated"

#### 6. Music Selection
- [ ] User can click "Select Music" button
- [ ] Button is disabled until VO is generated
- [ ] Music worker assigns a music asset to project
- [ ] Music has mood, title, artist metadata
- [ ] Project status updates to "music_selected"

#### 7. Video Rendering
- [ ] User can click "Render Video" button
- [ ] Button is disabled until music is selected
- [ ] RenderJob is created with status "queued"
- [ ] Editor worker processes job
- [ ] Job status updates to "processing" → "completed"
- [ ] Render completes within 5 minutes for 15s video

#### 8. Video Output Quality
- [ ] MP4 file is generated
- [ ] Video is 1080×1920 resolution (9:16)
- [ ] Video is ~15 seconds duration (±2s)
- [ ] Video plays without errors in VLC/QuickTime
- [ ] All scenes are present in correct order
- [ ] Text overlays are visible and readable
- [ ] Audio is present (even if mock)

#### 9. Professional Exports
- [ ] FCPXML file is generated
- [ ] FCPXML is valid XML (no parse errors)
- [ ] FCPXML imports into Final Cut Pro (manual test)
- [ ] EDL file is generated (CMX 3600 format)
- [ ] EDL contains all video and audio clips

#### 10. Downloads
- [ ] User can download MP4 from UI
- [ ] User can download FCPXML from UI
- [ ] Download links work (files accessible)
- [ ] Files are stored in S3 with correct permissions

#### 11. Error Handling
- [ ] Invalid brief (too short) shows error message
- [ ] Worker failures update job status to "failed"
- [ ] Failed renders show error in UI
- [ ] System remains stable after worker errors

#### 12. Code Quality
- [ ] All TypeScript compiles without errors
- [ ] ESLint passes (or only warnings)
- [ ] Tests run successfully: `pnpm test`
- [ ] Adapter tests pass (TTS, ImageGen, Music)

### Non-Functional Requirements

#### Performance
- [ ] Storyboard generation: <10 seconds
- [ ] Image generation: <30 seconds for 6 scenes
- [ ] VO generation: <20 seconds (mock)
- [ ] Render job: <5 minutes for 15s video
- [ ] Web UI: Pages load in <2 seconds

#### Reliability
- [ ] Workers auto-restart on failure (BullMQ retry)
- [ ] Database connections are pooled and managed
- [ ] S3 uploads have retry logic
- [ ] No memory leaks in long-running workers

#### Developer Experience
- [ ] README has clear quick start instructions
- [ ] .env.example documents all required variables
- [ ] Error messages are descriptive
- [ ] Logs use structured format with [WorkerName] prefix
- [ ] Code has inline comments for complex logic

## MVP 0.1 Deliverables Checklist

- [x] Monorepo scaffold (TurboRepo + pnpm)
- [x] Docker Compose (Postgres, Redis, MinIO)
- [x] Prisma schema with all models
- [x] API routes (projects, assets, jobs)
- [x] 5 BullMQ workers (Director, ImageLab, ScriptVO, Music, Editor)
- [x] FFmpeg render pipeline
- [x] FCPXML and EDL generators
- [x] Adapter interfaces (TTS, ImageGen, Music)
- [x] Next.js web UI with dark theme
- [x] Dashboard and project canvas pages
- [x] README.md with quick start
- [x] .env.example with all variables
- [x] Seed script for sample data
- [x] Unit tests for adapters
- [ ] End-to-end smoke test (pending - see TEST_STRATEGY.md)
- [x] CLAUDE.md for repository guidance
- [x] Comprehensive documentation (this folder)

## Known Limitations (MVP 0.1)

1. **No real AI**: Storyboard and script generation use hardcoded templates
2. **No real TTS**: Voiceover segments use mock audio URLs
3. **No real music**: Background music uses mock track metadata
4. **No asset upload**: Users can't upload custom images/videos (API ready, UI pending)
5. **No authentication**: Single-tenant, no user accounts
6. **No collaboration**: One user per project
7. **Limited video formats**: Only 9:16 tested (16:9, 1:1 in schema but not tested)
8. **Basic text rendering**: No advanced typography or animations
9. **No transitions**: Scenes are concatenated (crossfades planned for 0.2)
10. **Local only**: Designed for local dev; production deployment needs work

## Success Criteria (MVP 0.1)

✅ **MVP is successful if**:

1. A developer can `pnpm install && pnpm dev` and have a working system in <10 minutes
2. A user can create a project and get a rendered MP4 + FCPXML in <15 minutes
3. The rendered video is watchable and demonstrates the workflow
4. The codebase is well-documented and extensible for 0.2

❌ **MVP fails if**:

1. Setup requires >30 minutes of debugging
2. Renders consistently fail or produce corrupted videos
3. FCPXML doesn't import into Final Cut Pro
4. Code is undocumented or tightly coupled

## Next Steps After MVP 0.1

See [ROADMAP.md](./ROADMAP.md) for 0.2, 0.3, 0.4 planning.

Immediate priorities for 0.2:
1. User authentication and multi-tenancy
2. Asset upload UI (drag-and-drop)
3. Real TTS integration (ElevenLabs)
4. Real image generation (Stability AI SDXL)
5. Crossfade transitions in render
6. End-to-end smoke test in CI

---

**Definition of Done**: All acceptance criteria checked, deliverables shipped, and at least one full manual test run documented.
