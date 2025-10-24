'use client';

import { motion } from 'framer-motion';
import { Music, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  duration: number;
  genre: string;
  mood: string;
  url?: string;
}

interface MusicPanelProps {
  tracks: MusicTrack[];
  selectedTrackId?: string;
  onSelectTrack?: (id: string) => void;
  onPlayTrack?: (id: string) => void;
  onGenerateMusic?: () => void;
  className?: string;
}

/**
 * MusicPanel - Music selection and management
 * Tab panel in Studio right sidebar
 */
export function MusicPanel({
  tracks,
  selectedTrackId,
  onSelectTrack,
  onPlayTrack,
  onGenerateMusic,
  className,
}: MusicPanelProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Music</h3>
        <Button size="sm" variant="outline" onClick={onGenerateMusic}>
          <Music className="mr-1 h-3 w-3" />
          Generate Track
        </Button>
      </div>

      {/* Tracks List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Music className="mb-3 h-12 w-12 text-graycool/50" />
            <p className="text-sm text-graycool">No music tracks yet</p>
            <p className="text-xs text-graycool-dark">Generate or upload music</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group glass-card rounded-lg p-3 cursor-pointer transition-all',
                selectedTrackId === track.id && 'border-violet bg-violet/10'
              )}
              onClick={() => onSelectTrack?.(track.id)}
            >
              {/* Track Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {track.name}
                    </h4>
                    {selectedTrackId === track.id && (
                      <Check className="h-4 w-4 text-violet flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-graycool truncate">{track.artist}</p>
                </div>
              </div>

              {/* Track Metadata */}
              <div className="mb-3 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {track.genre}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {track.mood}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {track.duration}s
                </Badge>
              </div>

              {/* Controls */}
              {track.url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-full justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack?.(track.id);
                  }}
                >
                  <Play className="mr-1 h-3 w-3" />
                  Preview
                </Button>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Selected Track Summary */}
      {selectedTrackId && (
        <div className="mt-4 border-t border-violet/20 pt-4">
          <div className="text-xs text-graycool">
            Selected:{' '}
            <span className="text-white">
              {tracks.find(t => t.id === selectedTrackId)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
