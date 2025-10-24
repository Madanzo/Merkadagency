'use client';

import { motion } from 'framer-motion';
import { Film, Download, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RenderJob {
  id: string;
  projectName: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress?: number;
  outputUrl?: string;
  fcpxmlUrl?: string;
  edlUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

interface RenderQueueListProps {
  jobs: RenderJob[];
  onDownload?: (jobId: string, format: 'mp4' | 'fcpxml' | 'edl') => void;
  onRetry?: (jobId: string) => void;
  className?: string;
}

/**
 * RenderQueueList - Shows render jobs and their progress
 * Used in Studio to monitor video rendering
 */
export function RenderQueueList({
  jobs,
  onDownload,
  onRetry,
  className,
}: RenderQueueListProps) {
  const getStatusIcon = (status: RenderJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-graycool" />;
      case 'rendering':
        return <Loader2 className="h-4 w-4 text-violet animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-teal" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: RenderJob['status']) => {
    const variants = {
      queued: 'outline' as const,
      rendering: 'outline' as const,
      completed: 'secondary' as const,
      failed: 'destructive' as const,
    };
    return variants[status];
  };

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Render Queue</h3>
        <Badge variant="outline" className="text-xs">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Jobs List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Film className="mb-3 h-12 w-12 text-graycool/50" />
            <p className="text-sm text-graycool">No render jobs</p>
            <p className="text-xs text-graycool-dark">Start rendering to see jobs here</p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-lg p-3"
            >
              {/* Job Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <h4 className="text-sm font-medium text-white">
                    {job.projectName}
                  </h4>
                </div>
                <Badge variant={getStatusBadge(job.status)} className="text-xs">
                  {job.status}
                </Badge>
              </div>

              {/* Progress */}
              {job.status === 'rendering' && job.progress !== undefined && (
                <div className="mb-3">
                  <Progress value={job.progress} className="h-2 mb-1" />
                  <div className="flex justify-between text-xs text-graycool">
                    <span>Rendering...</span>
                    <span>{Math.round(job.progress)}%</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {job.status === 'failed' && job.error && (
                <div className="mb-3 rounded bg-red-500/10 p-2">
                  <p className="text-xs text-red-400">{job.error}</p>
                </div>
              )}

              {/* Download Buttons */}
              {job.status === 'completed' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {job.outputUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onDownload?.(job.id, 'mp4')}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        MP4
                      </Button>
                    )}
                    {job.fcpxmlUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => onDownload?.(job.id, 'fcpxml')}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        FCPXML
                      </Button>
                    )}
                  </div>
                  {job.edlUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => onDownload?.(job.id, 'edl')}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      EDL
                    </Button>
                  )}
                </div>
              )}

              {/* Retry Button */}
              {job.status === 'failed' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onRetry?.(job.id)}
                >
                  Retry
                </Button>
              )}

              {/* Timestamp */}
              <div className="mt-2 text-xs text-graycool">
                {job.completedAt
                  ? `Completed ${new Date(job.completedAt).toLocaleString()}`
                  : `Started ${new Date(job.createdAt).toLocaleString()}`}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
