# Test Strategy

**Last updated:** 2025-01-24

## Test Pyramid

```
        ┌──────────┐
        │   E2E    │  1-2 critical paths
        ├──────────┤
        │Integration│  10-20 job flows
        ├──────────┤
        │   Unit   │  50+ adapter/util tests
        └──────────┘
```

## Unit Tests

### Coverage

- ✅ Adapter interfaces (TTS, ImageGen, Music)
- ✅ Utility functions (FCPXML, EDL generators)
- 📋 Validators (Zod schemas)
- 📋 Helper functions

### Example

```typescript
// packages/workers/src/adapters/__tests__/tts.test.ts
import { describe, it, expect } from 'vitest';
import { MockTTSProvider } from '../tts';

describe('MockTTSProvider', () => {
  it('should estimate duration based on word count', async () => {
    const provider = new MockTTSProvider();
    const result = await provider.synthesize({ text: 'Hello world' });
    expect(result.durationMs).toBeGreaterThan(0);
  });
});
```

### Run

```bash
pnpm test
```

## Integration Tests

### Scope

Test job flows end-to-end:

1. **Director → ImageLab**: Storyboard generates, images created
2. **ScriptVO**: VO segments created with mock TTS
3. **Music**: Music asset assigned
4. **Editor**: Full render pipeline (with mocks)

### Example (Future)

```typescript
describe('End-to-end render flow', () => {
  it('should render video from brief to MP4', async () => {
    // Create project
    const project = await createProject({ title: 'Test', brief: 'Test product' });

    // Wait for storyboard
    await waitForStatus(project.id, 'storyboard_generated');

    // Generate VO
    await generateVo(project.id);
    await waitForStatus(project.id, 'vo_generated');

    // Select music
    await selectMusic(project.id);
    await waitForStatus(project.id, 'music_selected');

    // Render
    const renderJob = await renderVideo(project.id);
    await waitForJobStatus(renderJob.id, 'completed');

    // Assert artifacts exist
    expect(renderJob.artifacts.mp4Url).toBeDefined();
    expect(renderJob.artifacts.fcpxmlUrl).toBeDefined();
  });
});
```

## Smoke Test

### Manual Smoke Test (MVP 0.1)

Checklist to run before releases:

1. [ ] Start services: `pnpm dev`
2. [ ] Create project with brief
3. [ ] Wait for storyboard (6 scenes)
4. [ ] Check placeholder images loaded
5. [ ] Click "Generate VO" → Wait for completion
6. [ ] Click "Select Music" → Wait for completion
7. [ ] Click "Render" → Wait for completion (~5 min)
8. [ ] Download MP4 → Plays in VLC
9. [ ] Download FCPXML → Imports in Final Cut Pro
10. [ ] Check video quality (text visible, no glitches)

### Automated Smoke Test (Future)

```bash
pnpm test:smoke
```

## CI/CD Tests

### GitHub Actions (Future)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

## Test Data

### Seed Data

```bash
pnpm seed
```

Creates sample project for manual testing.

### Test Fixtures

```typescript
// packages/api/src/__tests__/fixtures/projects.ts
export const mockProject = {
  title: 'Test Project',
  brief: 'Test product description',
  ratio: '9:16' as const,
};
```

## Coverage Goals

| Package | Target | Current |
|---------|--------|---------|
| shared | 80% | 0% |
| api | 60% | 0% |
| workers | 70% | ~20% (adapters only) |
| web | 40% | 0% |

---

**See [GLOSSARY.md](./GLOSSARY.md) for terminology reference.**
