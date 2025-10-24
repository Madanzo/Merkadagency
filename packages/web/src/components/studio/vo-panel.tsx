'use client';

import { motion } from 'framer-motion';
import { Mic, Play, Pause, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VoSegment {
  id: string;
  text: string;
  audioUrl?: string;
  duration?: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  sceneOrder: number;
}

interface VoPanelProps {
  segments: VoSegment[];
  isGenerating?: boolean;
  onGenerate?: () => void;
  onPlaySegment?: (id: string) => void;
  className?: string;
}

/**
 * VoPanel - Voice-over generation and management
 * Tab panel in Studio right sidebar
 */
export function VoPanel({
  segments,
  isGenerating = false,
  onGenerate,
  onPlaySegment,
  className,
}: VoPanelProps) {
  const completedCount = segments.filter(s => s.status === 'completed').length;
  const progress = segments.length > 0 ? (completedCount / segments.length) * 100 : 0;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Voice Over</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <Mic className="mr-1 h-3 w-3" />
            {isGenerating ? 'Generating...' : 'Generate VO'}
          </Button>
        </div>

        {/* Progress */}
        {segments.length > 0 && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-graycool">
              <span>{completedCount} of {segments.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Segments List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {segments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mic className="mb-3 h-12 w-12 text-graycool/50" />
            <p className="text-sm text-graycool">No voice-over yet</p>
            <p className="text-xs text-graycool-dark">Generate VO from script</p>
          </div>
        ) : (
          segments.map((segment, index) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-lg p-3"
            >
              {/* Segment Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Scene {segment.sceneOrder}
                  </Badge>
                  <Badge
                    variant={
                      segment.status === 'completed'
                        ? 'secondary'
                        : segment.status === 'failed'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {segment.status}
                  </Badge>
                </div>
                {segment.duration && (
                  <span className="text-xs text-graycool">{segment.duration}s</span>
                )}
              </div>

              {/* Segment Text */}
              <p className="mb-3 text-xs text-graycool line-clamp-3">
                {segment.text}
              </p>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {segment.status === 'completed' && segment.audioUrl && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => onPlaySegment?.(segment.id)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      asChild
                    >
                      <a href={segment.audioUrl} download>
                        <Download className="h-3 w-3" />
                      </a>
                    </Button>
                  </>
                )}
                {segment.status === 'generating' && (
                  <div className="flex items-center gap-2 text-xs text-violet">
                    <div className="h-1 w-1 rounded-full bg-violet animate-pulse" />
                    Generating...
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
