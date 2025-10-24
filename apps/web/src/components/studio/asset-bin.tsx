'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Video, Music, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
  duration?: number;
  createdAt: Date;
}

interface AssetBinProps {
  assets: Asset[];
  onUpload?: () => void;
  onDelete?: (id: string) => void;
  onSelect?: (asset: Asset) => void;
  className?: string;
}

/**
 * AssetBin - Manages project assets (images, videos, audio)
 * Left sidebar component in Studio UI
 */
export function AssetBin({
  assets,
  onUpload,
  onDelete,
  onSelect,
  className,
}: AssetBinProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
    }
  };

  const handleSelect = (asset: Asset) => {
    setSelectedId(asset.id);
    onSelect?.(asset);
  };

  return (
    <div className={cn('flex h-full flex-col bg-ink-dark border-r border-violet/20', className)}>
      {/* Header */}
      <div className="border-b border-violet/20 p-4">
        <h2 className="mb-3 text-lg font-semibold text-white">Assets</h2>
        <Button
          size="sm"
          className="w-full bg-violet hover:bg-violet-light"
          onClick={onUpload}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-2">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="mb-3 h-12 w-12 text-graycool/50" />
            <p className="text-sm text-graycool">No assets yet</p>
            <p className="text-xs text-graycool-dark">Upload to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assets.map((asset) => {
              const Icon = getIcon(asset.type);
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'group relative rounded-lg border p-3 cursor-pointer transition-all',
                    selectedId === asset.id
                      ? 'border-violet bg-violet/10'
                      : 'border-violet/20 bg-ink hover:border-violet/40 hover:bg-violet/5'
                  )}
                  onClick={() => handleSelect(asset)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-violet/20">
                      <Icon className="h-5 w-5 text-violet" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {asset.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {asset.type}
                        </Badge>
                        {asset.duration && (
                          <span className="text-xs text-graycool">
                            {asset.duration}s
                          </span>
                        )}
                      </div>
                    </div>
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(asset.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-violet/20 p-4">
        <div className="text-xs text-graycool">
          {assets.length} asset{assets.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
