# Agent Specifications

**Last updated:** 2025-01-24

## Overview

MerkadAgency uses specialized "agent" workers for each stage of video production. Each agent has a clear contract (inputs/outputs) and swappable adapter interfaces.

## Agent Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Agent Workers                       │
├──────────┬──────────┬──────────┬─────────┬───────────┤
│ Director │ ImageLab │ Script&VO│  Music  │  Editor   │
└──────────┴──────────┴──────────┴─────────┴───────────┘
     ↓          ↓          ↓          ↓          ↓
┌────────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Mock  │ │  Mock   │ │  Mock  │ │  Mock  │ │ FFmpeg │
│  LLM   │ │ Canvas  │ │  TTS   │ │ Select │ │  Core  │
└────────┘ └─────────┘ └────────┘ └────────┘ └────────┘
     │          │          │          │
     ↓          ↓          ↓          ↓
┌────────┐ ┌─────────┐ ┌────────┐ ┌────────┐
│ GPT-4  │ │ SDXL/   │ │Eleven- │ │Epidemic│
│ Claude │ │Photoshop│ │ Labs   │ │ Sound  │
└────────┘ └─────────┘ └────────┘ └────────┘
```

---

## 1. Director Agent

**Purpose**: Analyze brief and generate storyboard

### Inputs

```typescript
{
  projectId: string;
  brief: string;
}
```

### Outputs

```typescript
{
  scenes: Scene[]; // 5-8 scenes, ~15s total
}
```

### Responsibilities

1. Parse product brief
2. Identify key messages
3. Generate 5-8 scene storyboard
4. Assign durations (total ~15 seconds)
5. Write overlay text for each scene
6. Auto-trigger ImageLab for placeholder generation

### Adapter Interface

**Future**: `StoryboardProvider`

```typescript
interface StoryboardProvider {
  generate(brief: string): Promise<Storyboard>;
}
```

**Implementations**:
- `MockStoryboardProvider` (current): Hardcoded template
- `GPT4StoryboardProvider` (future): OpenAI GPT-4 API
- `ClaudeStoryboardProvider` (future): Anthropic Claude API

### Configuration

```env
USE_MOCK_STORYBOARD=true
OPENAI_API_KEY=sk-...
```

---

## 2. ImageLab Agent

**Purpose**: Generate/process images for scenes

### Inputs

```typescript
{
  projectId: string;
  sceneIds: string[];
}
```

### Outputs

```typescript
{
  assets: Asset[]; // One per scene
}
```

### Responsibilities

1. For each scene, generate placeholder image
2. Create Canvas-based image with overlay text
3. Upload image to S3
4. Create Asset record
5. Link asset to scene

### Adapter Interface

```typescript
interface ImageGenProvider {
  name: string;
  generate(options: ImageGenOptions): Promise<ImageGenResult>;
}

interface ImageGenOptions {
  prompt: string;
  width: number;
  height: number;
  style?: string;
}

interface ImageGenResult {
  imageUrl: string;
  width: number;
  height: number;
  format: string;
}
```

**Implementations**:
- `MockImageGenProvider` (current): Canvas placeholders
- `StabilityImageGenProvider` (future): Stability AI SDXL
- `PhotoshopProvider` (future): Adobe Photoshop Cloud API

### Configuration

```env
USE_MOCK_IMAGE_GEN=true
STABILITY_API_KEY=sk-...
PHOTOSHOP_CLIENT_ID=...
```

---

## 3. Script & VO Agent

**Purpose**: Generate script and synthesize voiceover

### Inputs

```typescript
{
  projectId: string;
  useMock: boolean;
}
```

### Outputs

```typescript
{
  voSegments: VoSegment[]; // One per scene
}
```

### Responsibilities

1. Generate script for each scene
2. Align script to scene durations
3. Call TTS adapter to synthesize audio
4. Create VoSegment records
5. Link segments to scenes

### Adapter Interface

```typescript
interface TTSProvider {
  name: string;
  synthesize(options: TTSOptions): Promise<TTSResult>;
}

interface TTSOptions {
  text: string;
  voiceId?: string;
  model?: string;
}

interface TTSResult {
  audioUrl: string;
  durationMs: number;
  format: string;
}
```

**Implementations**:
- `MockTTSProvider` (current): Estimates duration, returns mock URL
- `ElevenLabsTTSProvider` (future): ElevenLabs API
- `GoogleTTSProvider` (future): Google Cloud TTS

### Configuration

```env
USE_MOCK_TTS=true
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
```

---

## 4. Music Agent

**Purpose**: Select background music

### Inputs

```typescript
{
  projectId: string;
  mood?: string;
  useMock: boolean;
}
```

### Outputs

```typescript
{
  musicAsset: Asset;
}
```

### Responsibilities

1. Select music track based on mood
2. Create music Asset record
3. Link to project

### Adapter Interface

```typescript
interface MusicProvider {
  name: string;
  select(options: MusicOptions): Promise<MusicResult>;
}

interface MusicOptions {
  mood?: string;
  durationMs: number;
  genre?: string;
}

interface MusicResult {
  audioUrl: string;
  durationMs: number;
  title: string;
  artist: string;
  mood: string;
}
```

**Implementations**:
- `MockMusicProvider` (current): Returns mock track
- `EpidemicSoundProvider` (future): Epidemic Sound API
- `ArtlistProvider` (future): Artlist API

### Configuration

```env
USE_MOCK_MUSIC=true
EPIDEMIC_SOUND_API_KEY=...
```

---

## 5. Editor Agent

**Purpose**: Assemble final video with FFmpeg

### Inputs

```typescript
{
  projectId: string;
  renderJobId: string;
  exportFcpxml?: boolean;
  exportEdl?: boolean;
}
```

### Outputs

```typescript
{
  artifacts: {
    mp4Url: string;
    fcpxmlUrl?: string;
    edlUrl?: string;
  };
}
```

### Responsibilities

1. Fetch project with all scenes, VO, music
2. Download assets (or use mock placeholders)
3. Create image+text composites for each scene
4. Convert images to video segments
5. Concatenate all segments
6. Mix VO and music audio
7. Normalize loudness
8. Encode final MP4
9. Generate FCPXML/EDL
10. Upload artifacts to S3
11. Update RenderJob status

### No Adapter Interface

Editor uses FFmpeg directly (not swappable in MVP).

**Future**: Consider `RenderProvider` interface for Remotion, etc.

### Configuration

```env
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
```

---

## Future Agents

### Publisher Agent (0.4)

**Purpose**: Publish videos to platforms

- Upload to YouTube, Vimeo, TikTok
- Schedule posts
- Track analytics

### Rights & Compliance Agent (0.4)

**Purpose**: Ensure content compliance

- Check music licenses
- Validate voice permissions
- Track asset expiration dates
- Generate usage reports

### Collaboration Agent (Post-MVP)

**Purpose**: Manage team workflows

- Approval workflows
- Comments on scenes
- Version control
- Notifications

---

## Agent Communication

### Direct (Sync)

Agents call adapters directly (TTS, Image Gen, Music).

### Indirect (Async)

Agents enqueue jobs for other agents:

```typescript
// Director worker
await imageLabQueue.add('generate-images', {
  projectId,
  sceneIds: scenes.map(s => s.id),
});
```

### State Management

All agents read/write to Postgres:

- **Read**: Fetch project, scenes, assets
- **Write**: Update statuses, create records

---

**Next**: See [MCP_INTEGRATIONS.md](./MCP_INTEGRATIONS.md) for external service integrations.
