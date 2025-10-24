# Video Render Pipeline

**Last updated:** 2025-01-24

## Overview

The Editor worker uses [FFmpeg](https://ffmpeg.org/) to assemble final videos from scenes, voiceover, and music. This document details the rendering process, FFmpeg commands, and export formats.

## Pipeline Stages

```
1. Scene Preparation
   ↓
2. Image + Text Composition (Canvas)
   ↓
3. Video Segment Creation (image → video)
   ↓
4. Scene Concatenation
   ↓
5. Audio Mixing (VO + Music)
   ↓
6. Loudness Normalization
   ↓
7. Final Encode (MP4)
   ↓
8. Generate FCPXML/EDL
```

## Stage Details

### 1. Scene Preparation

```typescript
// For each scene
const sceneData = {
  imageUrl: scene.imageAsset?.url,
  overlayText: scene.overlayText,
  durationMs: scene.durationMs,
  voAudioUrl: scene.voSegment?.audioUrl,
};
```

### 2. Image + Text Composition

Uses **node-canvas** to create images with text overlays:

```typescript
import { createCanvas, loadImage } from 'canvas';

const canvas = createCanvas(1080, 1920);
const ctx = canvas.getContext('2d');

// Draw image
const image = await loadImage(imagePath);
ctx.drawImage(image, 0, 0, 1080, 1920);

// Add text overlay
ctx.fillStyle = 'rgba(15, 17, 21, 0.7)'; // Semi-transparent ink
ctx.fillRect(0, 1620, 1080, 300); // Bottom overlay

ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 56px Arial';
ctx.textAlign = 'center';
ctx.fillText(overlayText, 540, 1770);

const buffer = canvas.toBuffer('image/png');
```

### 3. Video Segment Creation

Convert static image to video segment:

```bash
ffmpeg \
  -loop 1 \
  -i scene-0-text.png \
  -t 2.5 \
  -r 30 \
  -c:v libx264 \
  -pix_fmt yuv420p \
  scene-0.mp4
```

**Flags**:
- `-loop 1`: Loop input image
- `-t 2.5`: Duration (2.5 seconds)
- `-r 30`: Frame rate (30 fps)
- `-c:v libx264`: H.264 codec
- `-pix_fmt yuv420p`: Pixel format (compatible with most players)

### 4. Scene Concatenation

Create concat demuxer file:

```
# concat.txt
file 'scene-0.mp4'
file 'scene-1.mp4'
file 'scene-2.mp4'
```

Concatenate:

```bash
ffmpeg \
  -f concat \
  -safe 0 \
  -i concat.txt \
  -c copy \
  video-only.mp4
```

### 5. Audio Mixing

Mix voiceover and background music:

```bash
ffmpeg \
  -i video-only.mp4 \
  -i music.mp3 \
  -filter_complex " \
    [1:a]volume=-12dB,aloop=loop=-1:size=2e+09[music]; \
    [music]atrim=0:15[aout] \
  " \
  -map 0:v \
  -map "[aout]" \
  -c:v copy \
  -c:a aac \
  -b:a 192k \
  output.mp4
```

**Filter Explanation**:
- `volume=-12dB`: Duck music by 12dB
- `aloop=loop=-1`: Loop music infinitely
- `atrim=0:15`: Trim to 15 seconds

**Note**: Voiceover mixing (scene-by-scene timing) is simplified in MVP. Full implementation requires precise timestamp alignment.

### 6. Loudness Normalization

Apply EBU R128 loudness normalization:

```bash
ffmpeg \
  -i input.mp4 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:v copy \
  -c:a aac \
  output.mp4
```

**Parameters**:
- `I=-16`: Integrated loudness target (-16 LUFS)
- `TP=-1.5`: True peak maximum (-1.5 dBTP)
- `LRA=11`: Loudness range (11 LU)

### 7. Final Encode

```bash
ffmpeg \
  -i final-mixed.mp4 \
  -c:v libx264 \
  -preset fast \
  -crf 23 \
  -pix_fmt yuv420p \
  -c:a aac \
  -b:a 192k \
  -ar 48000 \
  final.mp4
```

**Video Settings**:
- `libx264`: H.264 codec
- `preset fast`: Encoding speed/quality balance
- `crf 23`: Constant Rate Factor (18-28, lower = better quality)
- `pix_fmt yuv420p`: Pixel format

**Audio Settings**:
- `aac`: AAC codec
- `b:a 192k`: Bitrate (192 kbps)
- `ar 48000`: Sample rate (48 kHz)

## Output Specifications

### Video Format

| Setting | Value | Notes |
|---------|-------|-------|
| **Resolution** | 1080×1920 | 9:16 (vertical) |
| **Frame Rate** | 30 fps | Standard for social |
| **Codec** | H.264 (libx264) | Universal compatibility |
| **Bitrate** | Variable (CRF 23) | ~5-8 Mbps |
| **Profile** | High | Best quality |
| **Level** | 4.0 | iPhone/Android compatible |

### Audio Format

| Setting | Value |
|---------|-------|
| **Codec** | AAC-LC |
| **Bitrate** | 192 kbps |
| **Sample Rate** | 48 kHz |
| **Channels** | Stereo |

### File Size

Approximate for 15-second video:
- **Video**: ~15-20 MB
- **Audio**: ~0.4 MB
- **Total**: ~15-20 MB

## FCPXML Generation

### Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.11">
  <resources>
    <format id="r1080x1920p30" .../>
    <asset id="scene-0" src="file:///path/scene-0.png" .../>
    <asset id="vo-0" src="file:///path/vo-0.mp3" .../>
    <asset id="music" src="file:///path/music.mp3" .../>
  </resources>
  <library>
    <event name="Project Title">
      <project name="Project Title">
        <sequence duration="450/30s" format="r1080x1920p30">
          <spine>
            <asset-clip ref="scene-0" offset="0/30s" duration="75/30s"/>
            <asset-clip ref="scene-1" offset="75/30s" duration="90/30s"/>
            ...
          </spine>
          <audio>
            <asset-clip ref="vo-0" offset="0/30s" duration="75/30s"/>
            <asset-clip ref="music" offset="0/30s" duration="450/30s" audioLevel="-12dB"/>
          </audio>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
```

### Key Elements

- **format**: Video format definition (resolution, frame rate)
- **asset**: Reference to external media file
- **asset-clip**: Placed clip on timeline
- **spine**: Primary video track
- **audio**: Audio tracks

### Timecode Format

- `duration="75/30s"` = 75 frames at 30fps = 2.5 seconds
- `offset="0/30s"` = Start at 0 frames

## EDL Generation

### CMX 3600 Format

```
TITLE: Smartwatch Ad
FCM: NON-DROP FRAME

001  Scene1     V     C        00:00:00:00 00:00:02:15 00:00:00:00 00:00:02:15
* FROM CLIP NAME: Scene 1
* SOURCE FILE: scene-0.png

002  Scene2     V     C        00:00:00:00 00:00:03:00 00:00:02:15 00:00:05:15
* FROM CLIP NAME: Scene 2
* SOURCE FILE: scene-1.png

003  VO1        A1    C        00:00:00:00 00:00:02:15 00:00:00:00 00:00:02:15
* FROM CLIP NAME: VO 1
* SOURCE FILE: vo-0.mp3

004  Music      A2    C        00:00:00:00 00:00:15:00 00:00:00:00 00:00:15:00
* FROM CLIP NAME: Background Music
* SOURCE FILE: music.mp3
```

### Format Breakdown

- `001`: Event number
- `Scene1`: Clip name (max 32 chars)
- `V`: Track (V=video, A1/A2=audio)
- `C`: Edit type (C=cut, D=dissolve)
- Timecodes: Source IN, Source OUT, Record IN, Record OUT

## Performance Optimizations

### Current (MVP)

- Sequential processing (one scene at a time)
- Single-threaded FFmpeg
- Local file I/O

### Future (0.2+)

1. **Parallel scene rendering**: Render scenes in parallel before concatenation
2. **GPU acceleration**: Use `-hwaccel` flag for encoding
3. **Caching**: Cache pre-rendered scenes for re-renders
4. **Distributed rendering**: Split scenes across multiple workers
5. **Incremental rendering**: Only re-render changed scenes

## Troubleshooting

### Common Issues

**Issue**: Video plays but no audio
- **Cause**: Missing `-c:a aac` in final encode
- **Fix**: Ensure audio codec specified

**Issue**: Video won't play on iPhone
- **Cause**: Incompatible pixel format
- **Fix**: Use `-pix_fmt yuv420p`

**Issue**: Text overlay too small/large
- **Cause**: Font size not scaled for resolution
- **Fix**: Calculate font size based on canvas height

**Issue**: Render takes >10 minutes
- **Cause**: Slow preset or high-resolution input images
- **Fix**: Use `-preset fast`, resize images before processing

### Debug Commands

```bash
# Check video info
ffprobe -v quiet -print_format json -show_format -show_streams video.mp4

# Extract frame at timestamp
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 frame.png

# Test audio levels
ffmpeg -i video.mp4 -af "volumedetect" -f null -

# Validate FCPXML
xmllint --noout timeline.fcpxml
```

---

**Next**: See [AGENTS.md](./AGENTS.md) for worker agent specifications.
