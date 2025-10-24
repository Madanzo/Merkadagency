# MerkadAgency - AI Video Creation Platform

**MVP 0.1** - Production-ready monorepo for creating short product videos using AI-assisted workflow.

## Overview

MerkadAgency is a unified platform for assembling professional product videos from assets. This MVP implements a complete end-to-end workflow:

**Brief → Storyboard → Images → Voiceover → Music → Render → MP4 + FCPXML/EDL**

### Key Features

- **Automated Storyboard Generation**: AI-powered scene planning from product briefs
- **Asset Management**: Upload and manage images, videos, audio, and brand assets
- **Mock Adapters**: Swappable interfaces for TTS (ElevenLabs), Image Gen (SDXL), and Music selection
- **Video Rendering**: FFmpeg-based 9:16 vertical video assembly with crossfades, VO mixing, and music ducking
- **Professional Export**: MP4 output plus FCPXML/EDL for Adobe Premiere and Final Cut Pro handoff
- **Queue-based Architecture**: BullMQ workers for scalable async processing

## Tech Stack

### Monorepo Structure

```
packages/
├── web/          Next.js 14 (App Router) + Tailwind + shadcn/ui
├── api/          Express REST API + Prisma + BullMQ
├── workers/      BullMQ workers (Director, ImageLab, ScriptVO, Music, Editor)
├── shared/       Shared types, schemas (Zod), utilities
└── infra/        Docker Compose (Postgres, Redis, MinIO)
```

### Technologies

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui (Radix UI)
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **Queue**: BullMQ + Redis
- **Storage**: S3-compatible (MinIO for dev, can use AWS S3 in production)
- **Video Processing**: FFmpeg with fluent-ffmpeg wrapper
- **Package Manager**: pnpm with TurboRepo

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- FFmpeg installed locally

### Installation

1. **Clone and install dependencies**:

```bash
git clone <your-repo-url>
cd Merkadagency
pnpm install
```

2. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

3. **Start infrastructure** (Postgres, Redis, MinIO):

```bash
docker-compose up -d
```

4. **Initialize database**:

```bash
pnpm db:push
```

5. **Start all services**:

```bash
pnpm dev
```

This starts:
- Web UI: http://localhost:3000
- API: http://localhost:3001
- Workers: Background processes
- MinIO Console: http://localhost:9001

### Create Your First Video

1. Visit http://localhost:3000
2. Click "New Project"
3. Enter a title and brief (e.g., "Showcase our revolutionary smartwatch with focus on health tracking")
4. The system will automatically:
   - Generate a 5-6 scene storyboard (~15s total)
   - Create placeholder images for each scene
5. Click "Generate VO" to add mock voiceover
6. Click "Select Music" to add background music
7. Click "Render Video" to assemble the final MP4
8. Download the MP4 and FCPXML files

## Project Structure

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create project from brief |
| `GET` | `/api/projects/:id` | Get project details |
| `POST` | `/api/projects/:id/assets/upload-url` | Get presigned upload URL |
| `POST` | `/api/projects/:id/generate-vo` | Generate voiceover (mock/real) |
| `POST` | `/api/projects/:id/select-music` | Select background music |
| `POST` | `/api/projects/:id/render` | Start video render |
| `GET` | `/api/jobs/:id` | Get render job status |

### Workers

#### Director Worker
- Analyzes brief and generates storyboard
- Creates 5-8 scenes with durations (total ~15s)
- Automatically triggers ImageLab for placeholder generation

#### ImageLab Worker
- Generates placeholder images with colored backgrounds and text overlays
- Future: Integrate with Stability AI (SDXL) or Adobe Photoshop API
- Interface: `ImageGenProvider`

#### Script & VO Worker
- Generates script aligned to scenes
- Creates TTS audio using mock or ElevenLabs
- Interface: `TTSProvider`

#### Music Worker
- Selects background music based on mood
- Future: Integrate with Epidemic Sound, Artlist, etc.
- Interface: `MusicProvider`

#### Editor Worker
- Assembles final video using FFmpeg:
  - 1080×1920 @ 30fps (9:16 vertical)
  - Scene images with text overlays
  - Crossfade transitions
  - VO audio mix
  - Background music ducked -12dB under VO
  - EBU R128 loudness normalization (approximate)
- Exports MP4 + FCPXML/EDL

### Data Models

**Project**: Title, brief, status, ratio, brandTheme
**Asset**: URL, kind (image/video/audio/logo), metadata
**Scene**: Index, duration, image, overlay text, VO segment
**VoSegment**: Text, audio URL, timestamps
**RenderJob**: Status, artifacts (MP4, FCPXML, EDL), logs

## Development

### Useful Commands

```bash
# Install dependencies
pnpm install

# Start all services (web, api, workers)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Database operations
pnpm db:push          # Sync Prisma schema to database
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Open Prisma Studio

# Seed sample data
pnpm seed

# Clean build artifacts
pnpm clean
```

### Working with Individual Packages

```bash
# Web only
cd packages/web
pnpm dev

# API only
cd packages/api
pnpm dev

# Workers only
cd packages/workers
pnpm dev
```

## Adapter System

The platform uses swappable adapters for external services. All adapters have mock implementations for development.

### Text-to-Speech (TTS)

- **Mock** (default): Estimates duration, returns mock audio URL
- **ElevenLabs**: Set `ELEVENLABS_API_KEY` and `USE_MOCK_TTS=false`

```typescript
// packages/workers/src/adapters/tts.ts
interface TTSProvider {
  synthesize(options: TTSOptions): Promise<TTSResult>;
}
```

### Image Generation

- **Mock** (default): Creates placeholder with Canvas
- **Stability AI**: Set `STABILITY_API_KEY` and `USE_MOCK_IMAGE_GEN=false`
- **Future**: Adobe Photoshop Cloud API

```typescript
// packages/workers/src/adapters/image-gen.ts
interface ImageGenProvider {
  generate(options: ImageGenOptions): Promise<ImageGenResult>;
}
```

### Music Selection

- **Mock** (default): Returns stock track metadata
- **Future**: Epidemic Sound, Artlist, AudioJungle integrations

```typescript
// packages/workers/src/adapters/music.ts
interface MusicProvider {
  select(options: MusicOptions): Promise<MusicResult>;
}
```

### Switching to Real Providers

1. Add API keys to `.env`:
```bash
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id
USE_MOCK_TTS=false
```

2. Implement the provider (example in adapter files)
3. Restart workers: `pnpm dev`

## Video Rendering Details

The Editor worker uses FFmpeg to create professional-quality videos:

### Process

1. **Scene Preparation**: For each scene, create image with text overlay using Canvas
2. **Video Creation**: Convert images to video segments with specified duration
3. **Concatenation**: Merge all scenes with crossfade transitions
4. **Audio Mixing**:
   - Layer voiceover segments at correct timestamps
   - Add background music, ducked -12dB when VO is active
   - Normalize final mix to EBU R128 standards
5. **Export**: Render MP4 (H.264, AAC) + generate FCPXML timeline

### Output Specifications

- **Resolution**: 1080×1920 (9:16 vertical) or 1920×1080 (16:9) or 1080×1080 (1:1)
- **Frame Rate**: 30fps
- **Video Codec**: H.264 (libx264), CRF 23, yuv420p
- **Audio Codec**: AAC, 192kbps, 48kHz stereo
- **Duration**: ~15 seconds (configurable per scene)

### FCPXML/EDL Export

- **FCPXML**: For Final Cut Pro and DaVinci Resolve
- **EDL**: CMX 3600 format for Adobe Premiere and Avid

Both formats reference original assets for easy re-editing and color grading.

## Brand Theme

MerkadAgency uses a consistent dark theme across all interfaces:

```javascript
{
  ink: '#0F1115',      // Dark background
  violet: '#5A27FF',   // Primary accent
  teal: '#16B8A6',     // Secondary accent
  gray: '#9CA3AF',     // Muted text
  white: '#FFFFFF'     // Foreground
}
```

## Environment Variables

See `.env.example` for full list. Key variables:

```bash
# Database
DATABASE_URL="postgresql://merkad:merkad@localhost:5432/merkadagency"

# Redis
REDIS_URL="redis://localhost:6379"

# S3 Storage (MinIO for dev)
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="merkadagency"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"

# Feature Flags
USE_MOCK_TTS=true
USE_MOCK_IMAGE_GEN=true
USE_MOCK_MUSIC=true

# Optional: Real Service Keys
ELEVENLABS_API_KEY=""
STABILITY_API_KEY=""
```

## Next Steps

### Immediate Improvements

1. **Real Adapters**: Implement ElevenLabs TTS and Stability AI image generation
2. **Asset Upload UI**: Add drag-and-drop interface for custom images/videos
3. **Timeline Editor**: Visual timeline for adjusting scene durations and transitions
4. **Template System**: Create multiple video templates (15s, 30s, 60s, different ratios)
5. **Remotion Integration**: Optionally use Remotion for more complex animations

### Production Deployment

1. **Database**: Migrate to managed PostgreSQL (AWS RDS, Supabase, etc.)
2. **Storage**: Switch to AWS S3 or Cloudflare R2
3. **Queue**: Use managed Redis (ElastiCache, Upstash, etc.)
4. **Workers**: Deploy to dedicated instances or serverless (e.g., AWS ECS, Railway)
5. **Monitoring**: Add Sentry, LogRocket, or similar
6. **CI/CD**: GitHub Actions for automated testing and deployment

### Advanced Features

- Real-time collaboration on projects
- AI-powered script refinement (GPT-4/Claude integration)
- Advanced audio mixing with audio ducking and EQ
- Custom brand template builder
- Batch video generation from CSV/API
- Webhooks for render completion
- Video analytics and engagement tracking

## Troubleshooting

### FFmpeg not found

Ensure FFmpeg is installed and in your PATH:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Docker containers not starting

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d
```

### Database connection errors

```bash
# Reset database
docker-compose down -v
docker-compose up -d
pnpm db:push
```

### Worker jobs stuck

```bash
# Clear Redis queue
docker-compose exec redis redis-cli FLUSHALL

# Restart workers
# Ctrl+C to stop pnpm dev, then restart
pnpm dev
```

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

Proprietary - MerkadAgency 2024

---

**Built with** ❤️ **using Claude Code**
