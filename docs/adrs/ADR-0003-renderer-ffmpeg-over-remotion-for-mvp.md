# ADR-0003: FFmpeg over Remotion for MVP Renderer

**Status**: Accepted
**Date**: 2025-01-24
**Deciders**: Engineering Team
**Related**: [ADR-0002](./ADR-0002-queue-and-workers-bullmq.md)

## Context

Need to render videos from scenes, images, and audio. Requirements:
- 1080×1920 @ 30fps (9:16 vertical)
- Text overlays
- Audio mixing (VO + music)
- Professional export (MP4 + FCPXML/EDL)

## Decision

Use **FFmpeg** via **fluent-ffmpeg** wrapper for MVP.

Reserve Remotion for future complex animations (0.4+).

## Alternatives Considered

### 1. Remotion (React-based rendering)

**Pros**:
- React components for video
- Excellent for complex animations
- TypeScript-native
- Good developer experience

**Cons**:
- Requires Chrome/Puppeteer (heavy)
- Slower than FFmpeg for simple compositions
- More complex to deploy
- Learning curve for video-specific React patterns

### 2. MoviePy (Python)

**Pros**:
- Simpler API than FFmpeg
- Good for programmatic video

**Cons**:
- Requires Python (we're Node.js)
- Slower than FFmpeg
- Less mature ecosystem

### 3. Canvas + MediaRecorder (Browser)

**Pros**:
- Pure JavaScript
- No FFmpeg dependency

**Cons**:
- Requires headless browser
- Limited codec support
- Unreliable for production

## Consequences

### Positive

- **Fast**: FFmpeg is highly optimized C code
- **Reliable**: Battle-tested, used by YouTube, Netflix
- **Flexible**: Supports all codecs, formats
- **Lightweight**: Single binary, no browser overhead
- **FCPXML/EDL**: We control export formats completely

### Negative

- **Complex**: FFmpeg CLI is intimidating
- **Debugging**: Error messages can be cryptic
- **No UI**: Harder to preview edits vs. Remotion

### Mitigation

- Use fluent-ffmpeg for cleaner API
- Extensive logging in render pipeline
- Manual QA with sample videos
- Consider Remotion for future complex templates (0.4)

## Implementation Notes

**Render Pipeline**:
1. Canvas creates image+text composites
2. FFmpeg converts images to video segments
3. FFmpeg concatenates segments
4. FFmpeg mixes audio (VO + music with ducking)
5. FFmpeg encodes final MP4

**Command Example**:
```bash
ffmpeg -i video-only.mp4 -i music.mp3 \
  -filter_complex "[1:a]volume=-12dB[music];[music]..." \
  -c:v libx264 -preset fast -crf 23 \
  output.mp4
```

---

**Next Review**: 2025-04-24 - Evaluate if Remotion needed for advanced templates.
