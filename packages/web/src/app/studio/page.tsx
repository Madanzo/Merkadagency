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
import { Play, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data types
interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'logo';
  url: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface Scene {
  id: string;
  order: number;
  duration: number;
  imageUrl: string;
  visualDescription: string;
  overlayText?: string;
}

interface VoSegment {
  id: string;
  sceneId: string;
  text: string;
  audioUrl?: string;
  startTime: number;
  endTime: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

interface MusicTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  mood: string;
}

interface RenderJob {
  id: string;
  projectId: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  mp4Url?: string;
  fcpxmlUrl?: string;
  edlUrl?: string;
  createdAt: Date;
  error?: string;
}

export default function StudioPage() {
  const { toast } = useToast();
  const [currentProject] = useState({ id: '1', name: 'My Project' });
  const [activeTab, setActiveTab] = useState('storyboard');
  const [isRendering, setIsRendering] = useState(false);

  // Mock state
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'product-hero.jpg',
      type: 'image',
      url: 'mock://product-hero.jpg',
    },
    {
      id: '2',
      name: 'background-music.mp3',
      type: 'audio',
      url: 'mock://background-music.mp3',
      duration: 30,
    },
  ]);

  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: '1',
      order: 1,
      duration: 3,
      imageUrl: 'mock://scene-1.jpg',
      visualDescription: 'Product hero shot on gradient background',
      overlayText: 'Introducing the Future',
    },
    {
      id: '2',
      order: 2,
      duration: 3,
      imageUrl: 'mock://scene-2.jpg',
      visualDescription: 'Close-up of key features',
      overlayText: 'Innovation Meets Design',
    },
  ]);

  const [voSegments, setVoSegments] = useState<VoSegment[]>([
    {
      id: '1',
      sceneId: '1',
      text: 'Introducing the future of technology.',
      startTime: 0,
      endTime: 3,
      status: 'pending',
    },
    {
      id: '2',
      sceneId: '2',
      text: 'Where innovation meets design.',
      startTime: 3,
      endTime: 6,
      status: 'pending',
    },
  ]);

  const [musicTracks] = useState<MusicTrack[]>([
    {
      id: '1',
      name: 'Upbeat Corporate',
      url: 'mock://music-1.mp3',
      duration: 30,
      mood: 'energetic',
    },
    {
      id: '2',
      name: 'Cinematic Intro',
      url: 'mock://music-2.mp3',
      duration: 30,
      mood: 'dramatic',
    },
  ]);

  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);

  // Handlers
  const handleUploadAsset = () => {
    toast({
      title: 'Upload Asset',
      description: 'Asset upload functionality coming soon. Use API to upload assets.',
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
    console.log('Selected asset:', asset);
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene-${scenes.length + 1}`,
      order: scenes.length + 1,
      duration: 3,
      imageUrl: 'mock://placeholder.jpg',
      visualDescription: 'New scene',
    };
    setScenes([...scenes, newScene]);
  };

  const handleDeleteScene = (sceneId: string) => {
    setScenes(scenes.filter((s) => s.id !== sceneId));
  };

  const handleReorderScene = (sceneId: string, direction: 'up' | 'down') => {
    console.log('Reorder scene:', sceneId, direction);
    // Implement reordering logic
  };

  const handleGenerateVo = async () => {
    toast({
      title: 'Generating Voice-Over',
      description: 'Creating AI voice-over for all scenes...',
    });

    // Mock: Update segments to generating, then completed
    setVoSegments(
      voSegments.map((seg) => ({ ...seg, status: 'generating' as const }))
    );

    setTimeout(() => {
      setVoSegments(
        voSegments.map((seg) => ({
          ...seg,
          status: 'completed' as const,
          audioUrl: `mock://vo-${seg.id}.mp3`,
        }))
      );
      toast({
        title: 'Voice-Over Complete',
        description: 'All voice-over segments have been generated.',
      });
    }, 2000);
  };

  const handleSelectMusic = (trackId: string) => {
    toast({
      title: 'Music Selected',
      description: 'Background music has been added to the project.',
    });
  };

  const handleRender = async () => {
    setIsRendering(true);
    const newJob: RenderJob = {
      id: `job-${Date.now()}`,
      projectId: currentProject.id,
      status: 'rendering',
      progress: 0,
      createdAt: new Date(),
    };
    setRenderJobs([newJob, ...renderJobs]);

    toast({
      title: 'Render Started',
      description: 'Your video is being rendered. This may take a few minutes.',
    });

    // Mock: Simulate render progress
    const interval = setInterval(() => {
      setRenderJobs((jobs) =>
        jobs.map((job) => {
          if (job.id === newJob.id && job.status === 'rendering') {
            const newProgress = Math.min(job.progress + 10, 100);
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
                mp4Url: 'mock://output.mp4',
                fcpxmlUrl: 'mock://output.fcpxml',
                edlUrl: 'mock://output.edl',
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
          <Badge variant="outline" className="border-violet/30 text-violet">
            {currentProject.name}
          </Badge>
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
            videoUrl={renderJobs[0]?.mp4Url}
            scenes={scenes}
            currentTime={0}
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
                <MusicPanel tracks={musicTracks} onSelect={handleSelectMusic} />
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
