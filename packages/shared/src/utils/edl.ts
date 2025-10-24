/**
 * EDL (Edit Decision List) generator utility
 * Generates CMX 3600 EDL for compatibility with Adobe Premiere and other NLEs
 */

export interface EdlClip {
  clipName: string;
  sourceFile: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  track: 'V' | 'A1' | 'A2'; // Video or Audio track
}

export interface EdlProject {
  title: string;
  frameRate: number;
  clips: EdlClip[];
}

/**
 * Generate CMX 3600 EDL
 */
export function generateEdl(project: EdlProject): string {
  const { title, frameRate, clips } = project;

  const header = `TITLE: ${title}
FCM: NON-DROP FRAME

`;

  const events = clips.map((clip, index) => {
    const eventNumber = String(index + 1).padStart(3, '0');
    const track = clip.track;
    const sourceStart = toTimecode(0, frameRate);
    const sourceEnd = toTimecode(clip.duration, frameRate);
    const recStart = toTimecode(clip.startTime, frameRate);
    const recEnd = toTimecode(clip.startTime + clip.duration, frameRate);

    return `${eventNumber}  ${clip.clipName.padEnd(32)} ${track}     C        ${sourceStart} ${sourceEnd} ${recStart} ${recEnd}
* FROM CLIP NAME: ${clip.clipName}
* SOURCE FILE: ${clip.sourceFile}
`;
  }).join('\n');

  return header + events;
}

/**
 * Convert seconds to SMPTE timecode (HH:MM:SS:FF)
 */
function toTimecode(seconds: number, frameRate: number): string {
  const totalFrames = Math.round(seconds * frameRate);
  const frames = totalFrames % frameRate;
  const totalSeconds = Math.floor(totalFrames / frameRate);
  const secs = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const mins = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return [
    String(hours).padStart(2, '0'),
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0'),
    String(frames).padStart(2, '0'),
  ].join(':');
}
