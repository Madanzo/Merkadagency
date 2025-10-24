# ADR-0001: Monorepo Structure with TurboRepo

**Status**: Accepted
**Date**: 2025-01-24
**Deciders**: Engineering Team
**Related**: None

## Context

MerkadAgency requires coordinated development across web UI, API, workers, and shared utilities. We need a repository structure that:
- Enables code sharing (types, schemas, utilities)
- Supports independent deployments
- Provides fast, cached builds
- Maintains developer experience

## Decision

Use **TurboRepo** monorepo with **pnpm workspaces**.

Structure:
```
packages/
├── web/        Next.js frontend
├── api/        Express backend
├── workers/    BullMQ workers
└── shared/     Shared types, schemas, utils
```

## Alternatives Considered

### 1. Multi-repo (Separate Repos)

**Pros**:
- Clear ownership boundaries
- Independent versioning
- Simpler CI/CD

**Cons**:
- Code duplication (types, schemas)
- Difficult to coordinate changes
- Version drift between repos

### 2. Lerna Monorepo

**Pros**:
- Established monorepo tool
- Good npm support

**Cons**:
- Slower builds (no caching)
- Less active development vs. TurboRepo
- More complex configuration

### 3. Nx Monorepo

**Pros**:
- Excellent caching and task orchestration
- Rich plugin ecosystem

**Cons**:
- More complex than TurboRepo
- Heavier learning curve
- Overkill for our scale

## Consequences

### Positive

- **Fast builds**: Turbo caches unchanged packages
- **Type safety**: Shared types ensure API/web consistency
- **Atomic changes**: Update API + web in single PR
- **Developer experience**: Single `pnpm dev` starts everything

### Negative

- **Repo size**: Single repo grows larger over time
- **CI complexity**: Need to test all affected packages
- **Learning curve**: Team must learn monorepo patterns

### Mitigation

- Use `.gitignore` aggressively (node_modules, dist, .next)
- Implement affected-only CI (future)
- Document monorepo workflows in CONTRIBUTING.md

## Implementation Notes

**turbo.json**:
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["^build"] }
  }
}
```

**pnpm-workspace.yaml**:
```yaml
packages:
  - 'packages/*'
```

---

**Next Review**: 2025-04-24 (3 months) - Evaluate if TurboRepo meets needs at scale.
