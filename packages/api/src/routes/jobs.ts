import { Router } from 'express';
import { prisma } from '../lib/db';

const router = Router();

/**
 * GET /jobs/:id
 * Get render job status and artifacts
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.renderJob.findUnique({
      where: { id: req.params.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

/**
 * GET /projects/:projectId/jobs
 * List all render jobs for a project
 */
router.get('/projects/:projectId', async (req, res) => {
  try {
    const jobs = await prisma.renderJob.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error listing jobs:', error);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
});

export default router;
