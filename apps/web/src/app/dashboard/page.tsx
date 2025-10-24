'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProjects, createProject } from '@/lib/api';
import { Video, Plus, Clock } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (!title || !brief) return;

    setCreating(true);
    try {
      const project = await createProject({ title, brief, ratio: '9:16' });
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    } finally {
      setCreating(false);
    }
  }

  if (showNewProject) {
    return (
      <div className="min-h-screen bg-ink p-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Video className="w-8 h-8 text-violet mr-3" />
            <h1 className="text-3xl font-bold">MerkadAgency</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Start with a brief to generate your video storyboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-violet"
                  placeholder="My Product Ad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brief</label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 bg-muted rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-violet"
                  placeholder="Describe your product, target audience, and key messages..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateProject} disabled={creating || !title || !brief}>
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
                <Button variant="outline" onClick={() => setShowNewProject(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Video className="w-8 h-8 text-violet mr-3" />
            <h1 className="text-3xl font-bold">MerkadAgency</h1>
          </div>
          <Button onClick={() => setShowNewProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-4">Create your first AI-powered video project</p>
              <Button onClick={() => setShowNewProject(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:border-violet transition-colors"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{project.status.replace(/_/g, ' ')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
