'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, MoveUp, MoveDown, Sparkles, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Scene {
  id: string;
  order: number;
  imageUrl?: string;
  videoUrl?: string;
  visualDescription: string;
  duration: number;
  generatingImage?: boolean;
  generatingVideo?: boolean;
}

interface StoryboardPanelProps {
  scenes: Scene[];
  onAddScene?: () => void;
  onDeleteScene?: (id: string) => void;
  onReorderScene?: (id: string, direction: 'up' | 'down') => void;
  onEditScene?: (scene: Scene) => void;
  onGenerateImage?: (sceneId: string) => void;
  onGenerateVideo?: (sceneId: string) => void;
  className?: string;
}

/**
 * StoryboardPanel - Visual storyboard editor
 * Tab panel in Studio right sidebar
 */
export function StoryboardPanel({
  scenes,
  onAddScene,
  onDeleteScene,
  onReorderScene,
  onEditScene,
  onGenerateImage,
  onGenerateVideo,
  className,
}: StoryboardPanelProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Storyboard</h3>
        <Button size="sm" variant="outline" onClick={onAddScene}>
          <Plus className="mr-1 h-3 w-3" />
          Add Scene
        </Button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="mb-3 h-12 w-12 text-graycool/50" />
            <p className="text-sm text-graycool">No scenes yet</p>
            <p className="text-xs text-graycool-dark">Generate storyboard from brief</p>
          </div>
        ) : (
          scenes.map((scene, index) => (
            <motion.div
              key={scene.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group glass-card rounded-lg p-3 cursor-pointer hover:border-violet/50 transition-colors"
              onClick={() => onEditScene?.(scene)}
            >
              {/* Scene Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Scene {scene.order}
                  </Badge>
                  <span className="text-xs text-graycool">{scene.duration}s</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderScene?.(scene.id, 'up');
                      }}
                      className="p-1 hover:bg-violet/20 rounded"
                    >
                      <MoveUp className="h-3 w-3 text-violet" />
                    </button>
                  )}
                  {index < scenes.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReorderScene?.(scene.id, 'down');
                      }}
                      className="p-1 hover:bg-violet/20 rounded"
                    >
                      <MoveDown className="h-3 w-3 text-violet" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScene?.(scene.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Scene Image */}
              <div className="mb-2 aspect-video w-full overflow-hidden rounded bg-ink-dark">
                {scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={`Scene ${scene.order}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-graycool/30" />
                  </div>
                )}
              </div>

              {/* Scene Description */}
              <p className="text-xs text-graycool line-clamp-2 mb-3">
                {scene.visualDescription}
              </p>

              {/* AI Generation Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateImage?.(scene.id);
                  }}
                  disabled={scene.generatingImage}
                >
                  {scene.generatingImage ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1 h-3 w-3" />
                      {scene.imageUrl ? 'Regenerate' : 'Generate'} Image
                    </>
                  )}
                </Button>

                {scene.imageUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs h-7 border-teal/30 text-teal hover:bg-teal/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateVideo?.(scene.id);
                    }}
                    disabled={scene.generatingVideo || !scene.imageUrl}
                  >
                    {scene.generatingVideo ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Video className="mr-1 h-3 w-3" />
                        {scene.videoUrl ? 'Regenerate' : 'Generate'} Video
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Video Status Badge */}
              {scene.videoUrl && (
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs bg-teal/20 text-teal border-teal/30">
                    Video Ready
                  </Badge>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
