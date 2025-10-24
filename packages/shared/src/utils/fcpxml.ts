/**
 * FCPXML (Final Cut Pro XML) generator utility
 * Generates basic FCPXML for handoff to professional editing tools
 */

export interface FcpxmlAsset {
  id: string;
  name: string;
  url: string;
  duration: number; // in seconds
  format: 'image' | 'video' | 'audio';
  width?: number;
  height?: number;
}

export interface FcpxmlClip {
  assetId: string;
  start: number; // in seconds
  duration: number; // in seconds
  offset?: number; // trim start
  audioLevel?: number; // in dB
}

export interface FcpxmlTimeline {
  name: string;
  duration: number; // in seconds
  frameRate: number;
  width: number;
  height: number;
}

export interface FcpxmlProject {
  name: string;
  timeline: FcpxmlTimeline;
  assets: FcpxmlAsset[];
  videoClips: FcpxmlClip[];
  audioClips: FcpxmlClip[];
}

/**
 * Generate FCPXML 1.11 document
 */
export function generateFcpxml(project: FcpxmlProject): string {
  const { timeline, assets, videoClips, audioClips } = project;

  const formatId = `r${timeline.width}x${timeline.height}p${timeline.frameRate}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.11">
  <resources>
    <format id="${formatId}" name="FFVideoFormat${timeline.width}x${timeline.height}p${timeline.frameRate}" frameDuration="${frameDuration(timeline.frameRate)}" width="${timeline.width}" height="${timeline.height}"/>
    ${assets.map(asset => generateAssetResource(asset, timeline.frameRate)).join('\n    ')}
  </resources>

  <library>
    <event name="${project.name}">
      <project name="${project.name}">
        <sequence duration="${toFrames(timeline.duration, timeline.frameRate)}/${timeline.frameRate}s" format="${formatId}" tcStart="0s" tcFormat="NDF" audioLayout="stereo" audioRate="48k">
          <spine>
            ${videoClips.map(clip => generateVideoClip(clip, timeline.frameRate)).join('\n            ')}
          </spine>
          ${audioClips.length > 0 ? `
          <audio>
            ${audioClips.map(clip => generateAudioClip(clip, timeline.frameRate)).join('\n            ')}
          </audio>` : ''}
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
}

function frameDuration(frameRate: number): string {
  const rateMap: Record<number, string> = {
    24: '1001/24000s',
    25: '1/25s',
    30: '1001/30000s',
    60: '1001/60000s',
  };
  return rateMap[frameRate] || `1/${frameRate}s`;
}

function toFrames(seconds: number, frameRate: number): number {
  return Math.round(seconds * frameRate);
}

function generateAssetResource(asset: FcpxmlAsset, frameRate: number): string {
  const duration = `${toFrames(asset.duration, frameRate)}/${frameRate}s`;

  if (asset.format === 'image') {
    return `<asset id="${asset.id}" name="${asset.name}" src="file://${encodeURI(asset.url)}" duration="${duration}" hasVideo="1"/>`;
  } else if (asset.format === 'video') {
    return `<asset id="${asset.id}" name="${asset.name}" src="file://${encodeURI(asset.url)}" duration="${duration}" hasVideo="1" hasAudio="0" videoSources="1"/>`;
  } else if (asset.format === 'audio') {
    return `<asset id="${asset.id}" name="${asset.name}" src="file://${encodeURI(asset.url)}" duration="${duration}" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000"/>`;
  }
  return '';
}

function generateVideoClip(clip: FcpxmlClip, frameRate: number): string {
  const offset = clip.offset || 0;
  const start = `${toFrames(clip.start, frameRate)}/${frameRate}s`;
  const duration = `${toFrames(clip.duration, frameRate)}/${frameRate}s`;
  const offsetStr = `${toFrames(offset, frameRate)}/${frameRate}s`;

  return `<asset-clip ref="${clip.assetId}" offset="${start}" duration="${duration}" start="${offsetStr}" tcFormat="NDF"/>`;
}

function generateAudioClip(clip: FcpxmlClip, frameRate: number): string {
  const offset = clip.offset || 0;
  const start = `${toFrames(clip.start, frameRate)}/${frameRate}s`;
  const duration = `${toFrames(clip.duration, frameRate)}/${frameRate}s`;
  const offsetStr = `${toFrames(offset, frameRate)}/${frameRate}s`;
  const audioLevel = clip.audioLevel !== undefined ? ` audioLevel="${clip.audioLevel}dB"` : '';

  return `<asset-clip ref="${clip.assetId}" offset="${start}" duration="${duration}" start="${offsetStr}" tcFormat="NDF"${audioLevel}/>`;
}
