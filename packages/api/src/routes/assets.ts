import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/db';
import { generateUploadUrl } from '../lib/storage';
import { GetUploadUrlRequestSchema } from '@merkad/shared';

const router = Router();

/**
 * POST /projects/:id/assets/upload-url
 * Get signed URL for uploading asset
 */
router.post('/:id/assets/upload-url', async (req, res) => {
  try {
    const data = GetUploadUrlRequestSchema.parse(req.body);
    const projectId = req.params.id;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate upload URL
    const { uploadUrl, publicUrl, key } = await generateUploadUrl(
      data.fileName,
      data.fileType,
      `projects/${projectId}/assets`
    );

    // Create asset record
    const asset = await prisma.asset.create({
      data: {
        id: uuidv4(),
        projectId,
        kind: data.assetKind,
        url: publicUrl,
        meta: {
          originalName: data.fileName,
          fileType: data.fileType,
        },
      },
    });

    res.json({
      uploadUrl,
      assetId: asset.id,
      publicUrl,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to generate upload URL',
    });
  }
});

/**
 * GET /projects/:id/assets
 * List project assets
 */
router.get('/:id/assets', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { projectId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(assets);
  } catch (error) {
    console.error('Error listing assets:', error);
    res.status(500).json({ error: 'Failed to list assets' });
  }
});

/**
 * DELETE /assets/:id
 * Delete an asset
 */
router.delete('/:assetId', async (req, res) => {
  try {
    await prisma.asset.delete({
      where: { id: req.params.assetId },
    });

    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
