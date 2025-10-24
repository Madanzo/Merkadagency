'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PreviewPlayerProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  className?: string;
}

/**
 * PreviewPlayer - Video preview and playback component
 * Center panel in Studio UI
 */
export function PreviewPlayer({
  videoUrl,
  posterUrl,
  title,
  className,
}: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className={cn('flex h-full flex-col bg-ink', className)}>
      {/* Header */}
      <div className="border-b border-violet/20 p-4">
        <h2 className="text-lg font-semibold text-white">
          {title || 'Preview'}
        </h2>
      </div>

      {/* Player */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          {/* Aspect ratio container for 9:16 vertical video */}
          <div className="relative mx-auto w-full max-w-md" style={{ paddingBottom: '177.78%' }}>
            <div className="absolute inset-0 rounded-lg overflow-hidden bg-ink-dark border border-violet/30">
              {videoUrl ? (
                <video
                  className="h-full w-full object-cover"
                  poster={posterUrl}
                  controls={false}
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto mb-3 h-16 w-16 text-graycool/50" />
                    <p className="text-sm text-graycool">No video to preview</p>
                    <p className="text-xs text-graycool-dark">Render a project to see it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          {videoUrl && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" variant="outline">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
