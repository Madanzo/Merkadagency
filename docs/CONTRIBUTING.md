# Contributing Guide

**Last updated:** 2025-01-24

## Getting Started

```bash
# 1. Clone repo
git clone https://github.com/merkadagency/platform.git
cd platform

# 2. Install dependencies
pnpm install

# 3. Start infrastructure
docker-compose up -d

# 4. Initialize database
pnpm db:push

# 5. Start dev servers
pnpm dev
```

## Branching Strategy

```
main (protected)
  ├── develop
  │   ├── feature/add-timeline-editor
  │   ├── fix/render-audio-sync
  │   └── chore/update-deps
  └── hotfix/critical-bug
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance
- `docs/description` - Documentation
- `hotfix/description` - Urgent fixes

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(editor): add crossfade transitions
fix(api): validate project status before render
docs(readme): update quick start guide
```

## Pull Request Process

### 1. Create PR

```bash
git checkout -b feature/timeline-editor
# Make changes
git add .
git commit -m "feat(web): add timeline editor component"
git push origin feature/timeline-editor
```

### 2. PR Template

See `.github/PULL_REQUEST_TEMPLATE.md`

### 3. Checks

- [ ] Tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] TypeScript compiles
- [ ] Documentation updated
- [ ] No console.log statements

### 4. Review

- Request review from code owner
- Address feedback
- Squash commits if needed

### 5. Merge

- Use "Squash and merge"
- Delete branch after merge

## Code Style

### TypeScript

```typescript
// ✅ Good
interface UserData {
  id: string;
  name: string;
}

async function createUser(data: UserData): Promise<User> {
  // ...
}

// ❌ Bad
function createUser(data: any) {
  // ...
}
```

### React

```tsx
// ✅ Good
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardTitle>{project.title}</CardTitle>
    </Card>
  );
}

// ❌ Bad
export default ({ project }: any) => <div>{project.title}</div>;
```

## Testing

### Run Tests

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @merkad/workers test

# Watch mode
pnpm test --watch
```

### Write Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('MockTTSProvider', () => {
  it('should generate audio URL', async () => {
    const provider = new MockTTSProvider();
    const result = await provider.synthesize({ text: 'Hello' });
    expect(result.audioUrl).toContain('mock://');
  });
});
```

## Documentation

### Update Docs

- Edit `.md` files in `/docs`
- Update "Last updated" date
- Add entry to "What Changed" section in docs/README.md

### API Changes

- Update `docs/API_CONTRACT.md`
- Update OpenAPI spec (future)

## Code Owners

**Placeholder** - Assign actual team members:

```
# .github/CODEOWNERS
/docs/**                   @product-team
/packages/web/**           @frontend-team
/packages/api/**           @backend-team
/packages/workers/**       @backend-team
*.md                       @docs-team
```

---

**See [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) for operational procedures.**
