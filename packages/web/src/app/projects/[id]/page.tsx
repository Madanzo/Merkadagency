'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getProject, generateVo, selectMusic, renderProject, getRenderJob } from '@/lib/api';
import { ArrowLeft, Video, Music, Download, FileText } from 'lucide-react';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [renderJobId, setRenderJobId] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState(0);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  useEffect(() => {
    if (renderJobId) {
      const interval = setInterval(checkRenderStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [renderJobId]);

  async function loadProject() {
    try {
      const data = await getProject(projectId);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateVo() {
    setProcessing(true);
    try {
      await generateVo(projectId);
      setTimeout(loadProject, 2000); // Reload after a delay
    } catch (error) {
      alert('Failed to generate VO');
    } finally {
      setProcessing(false);
    }
  }

  async function handleSelectMusic() {
    setProcessing(true);
    try {
      await selectMusic(projectId);
      setTimeout(loadProject, 2000);
    } catch (error) {
      alert('Failed to select music');
    } finally {
      setProcessing(false);
    }
  }

  async function handleRender() {
    setProcessing(true);
    try {
      const result = await renderProject(projectId, { exportFcpxml: true });
      setRenderJobId(result.renderJobId);
    } catch (error) {
      alert('Failed to start render');
      setProcessing(false);
    }
  }

  async function checkRenderStatus() {
    if (!renderJobId) return;

    try {
      const job = await getRenderJob(renderJobId);

      if (job.status === 'completed') {
        setRenderProgress(100);
        setProcessing(false);
        await loadProject();
      } else if (job.status === 'failed') {
        setProcessing(false);
        alert('Render failed: ' + (job.error || 'Unknown error'));
      } else if (job.status === 'processing') {
        setRenderProgress(50); // Mock progress
      }
    } catch (error) {
      console.error('Failed to check render status:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const latestRender = project.renderJobs?.[0];

  return (
    <div className="min-h-screen bg-ink p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.push('/')} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">Status: {project.status.replace(/_/g, ' ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storyboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Storyboard ({project.scenes?.length || 0} scenes)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.scenes?.map((scene: any) => (
                    <div key={scene.id} className="bg-muted p-4 rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold">Scene {scene.index + 1}</span>
                        <span className="text-sm text-muted-foreground">{scene.durationMs}ms</span>
                      </div>
                      {scene.overlayText && (
                        <p className="text-sm mb-2">{scene.overlayText}</p>
                      )}
                      {scene.voSegment && (
                        <p className="text-sm text-teal italic">{scene.voSegment.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleGenerateVo}
                  disabled={processing || project.status === 'vo_generated' || project.status === 'music_selected' || project.status === 'completed'}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {project.status === 'vo_generated' || project.status === 'music_selected' || project.status === 'completed' ? 'VO Generated' : 'Generate VO'}
                </Button>

                <Button
                  className="w-full"
                  onClick={handleSelectMusic}
                  disabled={processing || project.status !== 'vo_generated' && project.status !== 'music_selected' && project.status !== 'completed'}
                >
                  <Music className="w-4 h-4 mr-2" />
                  {project.status === 'music_selected' || project.status === 'completed' ? 'Music Selected' : 'Select Music'}
                </Button>

                <Button
                  className="w-full"
                  onClick={handleRender}
                  disabled={processing || project.status !== 'music_selected' && project.status !== 'completed'}
                  variant="secondary"
                >
                  Render Video
                </Button>
              </CardContent>
            </Card>

            {processing && renderJobId && (
              <Card>
                <CardHeader>
                  <CardTitle>Rendering...</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={renderProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                </CardContent>
              </Card>
            )}

            {latestRender?.status === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Downloads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {latestRender.artifacts?.mp4Url && (
                    <a
                      href={latestRender.artifacts.mp4Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download MP4
                      </Button>
                    </a>
                  )}
                  {latestRender.artifacts?.fcpxmlUrl && (
                    <a
                      href={latestRender.artifacts.fcpxmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Download FCPXML
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
