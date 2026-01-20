# Contributing to MerkadAgency

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]
```

### Types

| Type | Usage |
|------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting (no code change) |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks (deps, config) |

### Examples

```bash
feat: add blog listing page
fix: resolve video caching between portfolio tabs
docs: update ARCHITECTURE with data flow diagram
refactor: extract shared button component
chore: update react-router-dom to fix vulnerability
```

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch (optional) |
| `feat/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation updates |

### Workflow

1. Create feature branch from `main`
2. Make changes with atomic commits
3. Push and create Pull Request
4. Request review (if team)
5. Merge to `main` after approval
6. Tag releases with semantic versioning

---

## Code Style

### TypeScript
- Use explicit types over `any`
- Prefer interfaces for component props
- Use `type` for unions and intersections

### React
- Functional components only
- Hooks for state and effects
- Props destructuring in function signature

### CSS
- Tailwind utility classes preferred
- Custom CSS only when necessary
- Follow design tokens in `tailwind.config.ts`

---

## Pull Request Checklist

- [ ] Code builds without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Commit messages follow convention
- [ ] Documentation updated if needed
- [ ] No `console.log` statements left in code

---

## Release Process

1. Update `CHANGELOG.md` with release notes
2. Bump version in `package.json`
3. Create release commit: `chore: release v1.0.0`
4. Tag release: `git tag -a v1.0.0 -m "Release v1.0.0"`
5. Push with tags: `git push origin main --tags`
