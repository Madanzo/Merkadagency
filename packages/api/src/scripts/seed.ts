/**
 * Seed script for creating sample data
 */

import 'dotenv/config';
import { prisma } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { BRAND_THEME } from '@merkad/shared';

async function seed() {
  console.log('Seeding database...');

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      id: uuidv4(),
      title: 'Sample Product Ad',
      brief: 'Create an engaging 15-second ad showcasing our innovative new product',
      status: 'draft',
      ratio: 'VERTICAL',
      brandTheme: BRAND_THEME,
    },
  });

  console.log(`Created sample project: ${project.id}`);

  // Create sample scenes
  const scenes = [
    {
      index: 0,
      durationMs: 2500,
      overlayText: 'Introducing Innovation',
    },
    {
      index: 1,
      durationMs: 3000,
      overlayText: 'Advanced Features',
    },
    {
      index: 2,
      durationMs: 2500,
      overlayText: 'Everyday Excellence',
    },
    {
      index: 3,
      durationMs: 3000,
      overlayText: 'Unmatched Performance',
    },
    {
      index: 4,
      durationMs: 2500,
      overlayText: 'Available Now',
    },
  ];

  for (const sceneData of scenes) {
    await prisma.scene.create({
      data: {
        id: uuidv4(),
        projectId: project.id,
        ...sceneData,
      },
    });
  }

  console.log(`Created ${scenes.length} sample scenes`);

  // Update project status
  await prisma.project.update({
    where: { id: project.id },
    data: { status: 'storyboard_generated' },
  });

  console.log('Seed completed successfully!');
  console.log(`Project ID: ${project.id}`);
  console.log('You can now run the ImageLab worker to generate placeholder images.');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
