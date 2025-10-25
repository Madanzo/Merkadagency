'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AssetBin } from '@/components/studio/asset-bin';
import { PreviewPlayer } from '@/components/studio/preview-player';
import { StoryboardPanel } from '@/components/studio/storyboard-panel';
import { VoPanel } from '@/components/studio/vo-panel';
import { MusicPanel } from '@/components/studio/music-panel';
import { RenderQueueList } from '@/components/studio/render-queue-list';
import { Badge } from '@/components/ui/badge';
import { Play, Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Asset, Scene, VoSegment, MusicTrack, RenderJob, Project } from '@/lib/studio-types';

export default function StudioPage() {
  const { toast } = useToast();

  // Current project
  const [currentProject] = useState<Project>({
    id: '1',
    name: 'Product Launch Video',
    brief: 'Create a 15-second vertical video showcasing our new smartwatch',
    status: 'storyboard',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [activeTab, setActiveTab] = useState('storyboard');
  const [isRendering, setIsRendering] = useState(false);

  // Assets state
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'asset-1',
      name: 'product-hero.jpg',
      type: 'image',
      url: '/placeholder-image.jpg',
      createdAt: new Date(),
    },
    {
      id: 'asset-2',
      name: 'background-music.mp3',
      type: 'audio',
      url: '/placeholder-audio.mp3',
      duration: 30,
      createdAt: new Date(),
    },
  ]);

  // Storyboard state
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'scene-1',
      order: 1,
      duration: 3,
      imageUrl: '/placeholder-scene1.jpg',
      visualDescription: 'Close-up of smartwatch on wrist showing heart rate',
    },
    {
      id: 'scene-2',
      order: 2,
      duration: 3,
      imageUrl: '/placeholder-scene2.jpg',
      visualDescription: 'Person running with watch tracking workout stats',
    },
    {
      id: 'scene-3',
      order: 3,
      duration: 2,
      visualDescription: 'Smartwatch display showing notifications',
    },
  ]);

  // Voice-over state
  const [voSegments, setVoSegments] = useState<VoSegment[]>([
    {
      id: 'vo-1',
      text: 'Meet the future of fitness tracking.',
      status: 'completed',
      sceneOrder: 1,
      audioUrl: '/placeholder-vo1.mp3',
      duration: 3,
    },
    {
      id: 'vo-2',
      text: 'Track your workouts in real-time with precision.',
      status: 'completed',
      sceneOrder: 2,
      audioUrl: '/placeholder-vo2.mp3',
      duration: 3,
    },
    {
      id: 'vo-3',
      text: 'Stay connected without missing a beat.',
      status: 'pending',
      sceneOrder: 3,
    },
  ]);

  // Music state
  const [musicTracks] = useState<MusicTrack[]>([
    {
      id: 'music-1',
      name: 'Upbeat Corporate',
      artist: 'Studio Library',
      duration: 30,
      genre: 'Electronic',
      mood: 'energetic',
      url: '/music/upbeat-corporate.mp3',
    },
    {
      id: 'music-2',
      name: 'Cinematic Intro',
      artist: 'Epic Sounds',
      duration: 25,
      genre: 'Orchestral',
      mood: 'dramatic',
      url: '/music/cinematic-intro.mp3',
    },
    {
      id: 'music-3',
      name: 'Modern Tech',
      artist: 'Digital Beats',
      duration: 30,
      genre: 'Electronic',
      mood: 'inspiring',
      url: '/music/modern-tech.mp3',
    },
  ]);

  const [selectedMusicId, setSelectedMusicId] = useState<string>('music-1');

  // Render queue state
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);

  // Event handlers
  const handleUploadAsset = () => {
    toast({
      title: 'Upload Asset',
      description: 'Asset upload functionality coming soon.',
    });
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter((a) => a.id !== assetId));
    toast({
      title: 'Asset Deleted',
      description: 'Asset has been removed from the project.',
    });
  };

  const handleSelectAsset = (asset: Asset) => {
    toast({
      title: 'Asset Selected',
      description: `Selected: ${asset.name}`,
    });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene-${scenes.length + 1}`,
      order: scenes.length + 1,
      duration: 3,
      visualDescription: 'New scene',
    };
    setScenes([...scenes, newScene]);
    toast({
      title: 'Scene Added',
      description: 'New scene added to storyboard.',
    });
  };

  const handleDeleteScene = (sceneId: string) => {
    setScenes(scenes.filter((s) => s.id !== sceneId));
    toast({
      title: 'Scene Deleted',
      description: 'Scene removed from storyboard.',
    });
  };

  const handleReorderScene = (sceneId: string, direction: 'up' | 'down') => {
    // Reordering logic would go here
    toast({
      title: 'Scene Reordered',
      description: `Scene moved ${direction}.`,
    });
  };

  const handleGenerateVo = async () => {
    toast({
      title: 'Generating Voice-Over',
      description: 'Creating AI voice-over for all scenes...',
    });

    // Simulate VO generation
    setVoSegments(
      voSegments.map((seg) => ({ ...seg, status: 'generating' as const }))
    );

    setTimeout(() => {
      setVoSegments(
        voSegments.map((seg) => ({
          ...seg,
          status: 'completed' as const,
          audioUrl: `/placeholder-vo-${seg.sceneOrder}.mp3`,
          duration: 3,
        }))
      );
      toast({
        title: 'Voice-Over Complete',
        description: 'All voice-over segments have been generated.',
      });
    }, 2000);
  };

  const handleSelectMusic = (trackId: string) => {
    setSelectedMusicId(trackId);
    toast({
      title: 'Music Selected',
      description: 'Background music has been added to the project.',
    });
  };

  const handleRender = async () => {
    setIsRendering(true);
    const newJob: RenderJob = {
      id: `job-${Date.now()}`,
      projectName: currentProject.name,
      status: 'rendering',
      progress: 0,
      createdAt: new Date(),
    };
    setRenderJobs([newJob, ...renderJobs]);

    toast({
      title: 'Render Started',
      description: 'Your video is being rendered. This may take a few minutes.',
    });

    // Simulate render progress
    const interval = setInterval(() => {
      setRenderJobs((jobs) =>
        jobs.map((job) => {
          if (job.id === newJob.id && job.status === 'rendering') {
            const newProgress = Math.min((job.progress || 0) + 10, 100);
            if (newProgress === 100) {
              clearInterval(interval);
              setIsRendering(false);
              toast({
                title: 'Render Complete',
                description: 'Your video is ready to download!',
              });
              return {
                ...job,
                status: 'completed' as const,
                progress: 100,
                outputUrl: '/renders/output.mp4',
                fcpxmlUrl: '/renders/output.fcpxml',
                edlUrl: '/renders/output.edl',
                completedAt: new Date(),
              };
            }
            return { ...job, progress: newProgress };
          }
          return job;
        })
      );
    }, 500);
  };

  const handleDownload = (jobId: string, format: 'mp4' | 'fcpxml' | 'edl') => {
    toast({
      title: `Downloading ${format.toUpperCase()}`,
      description: 'File download will start shortly.',
    });
  };

  const handleRetry = (jobId: string) => {
    toast({
      title: 'Retrying Render',
      description: 'Restarting the render job...',
    });
  };

  return (
    <div className="flex h-screen flex-col bg-ink pt-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-violet/20 bg-ink-dark px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-white">Studio</h1>
          <Button variant="ghost" size="sm" className="gap-2">
            <Badge variant="outline" className="border-violet/30 text-violet">
              {currentProject.name}
            </Badge>
            <ChevronDown className="h-4 w-4 text-graycool" />
          </Button>
        </div>
        <Button
          onClick={handleRender}
          disabled={isRendering}
          className="bg-gradient-to-tr from-violet to-purple-400 shadow-glow"
        >
          {isRendering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Render Video
            </>
          )}
        </Button>
      </div>

      {/* Main Layout: 3 columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Asset Bin */}
        <div className="w-64 border-r border-violet/20">
          <AssetBin
            assets={assets}
            onUpload={handleUploadAsset}
            onDelete={handleDeleteAsset}
            onSelect={handleSelectAsset}
          />
        </div>

        {/* Center: Preview Player */}
        <div className="flex flex-1 flex-col">
          <PreviewPlayer
            videoUrl={renderJobs[0]?.outputUrl}
            title={currentProject.name}
          />
        </div>

        {/* Right: Tabs (Storyboard, VO, Music, Render Queue) */}
        <div className="flex w-96 flex-col border-l border-violet/20 bg-ink-dark">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-violet/20 bg-transparent p-0">
              <TabsTrigger
                value="storyboard"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet data-[state=active]:bg-transparent"
              >
                Storyboard
              </TabsTrigger>
              <TabsTrigger
                value="voiceover"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet data-[state=active]:bg-transparent"
              >
                Voice Over
              </TabsTrigger>
              <TabsTrigger
                value="music"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet data-[state=active]:bg-transparent"
              >
                Music
              </TabsTrigger>
              <TabsTrigger
                value="render"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-violet data-[state=active]:bg-transparent"
              >
                Render Queue
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="storyboard" className="mt-0">
                <StoryboardPanel
                  scenes={scenes}
                  onAddScene={handleAddScene}
                  onDeleteScene={handleDeleteScene}
                  onReorderScene={handleReorderScene}
                />
              </TabsContent>

              <TabsContent value="voiceover" className="mt-0">
                <VoPanel
                  segments={voSegments}
                  isGenerating={voSegments.some((s) => s.status === 'generating')}
                  onGenerate={handleGenerateVo}
                />
              </TabsContent>

              <TabsContent value="music" className="mt-0">
                <MusicPanel
                  tracks={musicTracks}
                  selectedTrackId={selectedMusicId}
                  onSelectTrack={handleSelectMusic}
                />
              </TabsContent>

              <TabsContent value="render" className="mt-0">
                <RenderQueueList
                  jobs={renderJobs}
                  onDownload={handleDownload}
                  onRetry={handleRetry}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
