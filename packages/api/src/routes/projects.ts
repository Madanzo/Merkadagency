import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/db';
import {
  CreateProjectSchema,
  GenerateVoRequestSchema,
  SelectMusicRequestSchema,
  RenderRequestSchema,
  BRAND_THEME,
} from '@merkad/shared';
import {
  enqueueStoryboardGeneration,
  enqueueVoGeneration,
  enqueueMusicSelection,
  enqueueVideoRender,
} from '../lib/queue';

const router = Router();

/**
 * POST /projects
 * Create a new project from brief
 */
router.post('/', async (req, res) => {
  try {
    const data = CreateProjectSchema.parse(req.body);

    // Create project
    const project = await prisma.project.create({
      data: {
        id: uuidv4(),
        title: data.title,
        brief: data.brief,
        ratio: data.ratio === '9:16' ? 'VERTICAL' : data.ratio === '16:9' ? 'HORIZONTAL' : 'SQUARE',
        brandTheme: data.brandTheme || BRAND_THEME,
        status: 'draft',
      },
      include: {
        scenes: true,
        assets: true,
      },
    });

    // Enqueue storyboard generation
    await enqueueStoryboardGeneration(project.id, data.brief);

    res.status(201).json({
      id: project.id,
      title: project.title,
      status: project.status,
      ratio: data.ratio,
      brandTheme: project.brandTheme,
      createdAt: project.createdAt,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create project' });
  }
});

/**
 * GET /projects/:id
 * Get project details
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        scenes: {
          include: {
            imageAsset: true,
            voSegment: true,
          },
          orderBy: { index: 'asc' },
        },
        assets: true,
        voSegments: true,
        renderJobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        musicAsset: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

/**
 * GET /projects
 * List all projects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            scenes: true,
            assets: true,
          },
        },
      },
    });

    res.json(projects);
  } catch (error) {
    console.error('Error listing projects:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

/**
 * POST /projects/:id/generate-vo
 * Generate voiceover for project
 */
router.post('/:id/generate-vo', async (req, res) => {
  try {
    const data = GenerateVoRequestSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { scenes: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.scenes.length === 0) {
      return res.status(400).json({ error: 'No scenes found. Generate storyboard first.' });
    }

    // Enqueue VO generation
    const job = await enqueueVoGeneration(project.id, data.useMock);

    res.json({
      message: 'VO generation enqueued',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error generating VO:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to generate VO' });
  }
});

/**
 * POST /projects/:id/select-music
 * Select music for project
 */
router.post('/:id/select-music', async (req, res) => {
  try {
    const data = SelectMusicRequestSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Enqueue music selection
    const job = await enqueueMusicSelection(project.id, data.mood, data.useMock);

    res.json({
      message: 'Music selection enqueued',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error selecting music:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to select music' });
  }
});

/**
 * POST /projects/:id/render
 * Start video render
 */
router.post('/:id/render', async (req, res) => {
  try {
    const data = RenderRequestSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        scenes: true,
        voSegments: true,
        musicAsset: true,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.scenes.length === 0) {
      return res.status(400).json({ error: 'No scenes found' });
    }

    // Create render job
    const renderJob = await prisma.renderJob.create({
      data: {
        id: uuidv4(),
        projectId: project.id,
        status: 'queued',
        artifacts: {},
        logs: [],
      },
    });

    // Update project status
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'rendering' },
    });

    // Enqueue render
    await enqueueVideoRender(project.id, renderJob.id, {
      exportFcpxml: data.exportFcpxml,
      exportEdl: data.exportEdl,
    });

    res.json({
      message: 'Render enqueued',
      renderJobId: renderJob.id,
    });
  } catch (error) {
    console.error('Error starting render:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to start render' });
  }
});

export default router;
