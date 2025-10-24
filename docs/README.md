# MerkadAgency Documentation

**Last updated:** 2025-01-24

## Overview

MerkadAgency is an AI-powered platform for creating professional product videos at scale. This documentation system provides comprehensive guidance for developers, designers, operators, and stakeholders working on the platform.

## What This Repo Is

MerkadAgency transforms product briefs into polished short-form videos through an automated workflow:

**Brief → AI Storyboard → Assets → Voiceover → Music → Video Assembly → MP4 + Professional Exports**

Built as a production-ready TurboRepo monorepo with:
- **Web**: Next.js 14 marketing site + project canvas
- **API**: Express REST API with Prisma ORM
- **Workers**: BullMQ-based async job processing
- **Shared**: Type-safe schemas and utilities

## Documentation Organization

### 🎯 Start Here (Essential Reading)

If you only read three docs, read these:

1. **[PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md)** - Problem, value prop, and success metrics
2. **[MVP_SCOPE.md](./MVP_SCOPE.md)** - What's in/out of MVP 0.1, acceptance criteria
3. **[JOB_FLOW.md](./JOB_FLOW.md)** - How jobs move through the system

### 📚 Documentation Structure

#### Product & Planning
- [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) - Vision, audience, metrics
- [MVP_SCOPE.md](./MVP_SCOPE.md) - MVP 0.1 scope and acceptance criteria
- [ROADMAP.md](./ROADMAP.md) - Multi-phase roadmap (0.1 → 0.4)

#### Design & Brand
- [BRAND_TOKENS.md](./BRAND_TOKENS.md) - Colors, typography, design system
- [UI_GUIDE.md](./UI_GUIDE.md) - Component library and usage patterns
- [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) - Site structure and content model

#### Technical Architecture
- [API_CONTRACT.md](./API_CONTRACT.md) - REST endpoints, request/response schemas
- [JOB_FLOW.md](./JOB_FLOW.md) - Queue topology and job lifecycle
- [RENDER_PIPELINE.md](./RENDER_PIPELINE.md) - FFmpeg rendering process
- [AGENTS.md](./AGENTS.md) - Worker agents and their responsibilities

#### Integrations & Security
- [MCP_INTEGRATIONS.md](./MCP_INTEGRATIONS.md) - External service integrations
- [SECURITY_COMPLIANCE.md](./SECURITY_COMPLIANCE.md) - Security practices and compliance
- [LICENSING_AND_RIGHTS.md](./LICENSING_AND_RIGHTS.md) - Content licensing policies

#### Development & Operations
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute code
- [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) - Running and debugging the system
- [TEST_STRATEGY.md](./TEST_STRATEGY.md) - Testing approach and coverage
- [GLOSSARY.md](./GLOSSARY.md) - Terminology reference

#### Architecture Decision Records
- [ADR-0001: Monorepo Structure](./adrs/ADR-0001-monorepo-structure.md)
- [ADR-0002: Queue and Workers (BullMQ)](./adrs/ADR-0002-queue-and-workers-bullmq.md)
- [ADR-0003: FFmpeg over Remotion for MVP](./adrs/ADR-0003-renderer-ffmpeg-over-remotion-for-mvp.md)
- [ADR-0004: Mockable Adapters](./adrs/ADR-0004-mockable-adapters-elevenlabs-imagen-photoshop.md)
- [ADR-0005: Dark Theme Tokens](./adrs/ADR-0005-dark-theme-tokens-tailwind-shadcn.md)

## Quick Navigation by Role

### 👩‍💻 Developers
Start: [CONTRIBUTING.md](./CONTRIBUTING.md) → [API_CONTRACT.md](./API_CONTRACT.md) → [JOB_FLOW.md](./JOB_FLOW.md)

### 🎨 Designers
Start: [BRAND_TOKENS.md](./BRAND_TOKENS.md) → [UI_GUIDE.md](./UI_GUIDE.md) → [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)

### 🔧 DevOps/SRE
Start: [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md) → [SECURITY_COMPLIANCE.md](./SECURITY_COMPLIANCE.md) → [MCP_INTEGRATIONS.md](./MCP_INTEGRATIONS.md)

### 📊 Product Managers
Start: [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md) → [MVP_SCOPE.md](./MVP_SCOPE.md) → [ROADMAP.md](./ROADMAP.md)

### ⚖️ Legal/Compliance
Start: [LICENSING_AND_RIGHTS.md](./LICENSING_AND_RIGHTS.md) → [SECURITY_COMPLIANCE.md](./SECURITY_COMPLIANCE.md)

## Documentation Ownership

| Area | Owner | Backup |
|------|-------|--------|
| Product & Planning | Product Lead | Engineering Lead |
| Design & Brand | Design Lead | Product Lead |
| Technical Architecture | Engineering Lead | Senior Engineer |
| Integrations | Engineering Lead | DevOps Lead |
| Security & Compliance | Security Lead | Engineering Lead |
| Operations | DevOps Lead | Engineering Lead |

_Placeholders - assign actual team members as project scales_

## Maintaining These Docs

### When to Update

- **Product docs**: When scope, goals, or roadmap changes
- **Technical docs**: When architecture, APIs, or data models change
- **ADRs**: When making significant architectural decisions (create new ADR)
- **Runbooks**: When discovering new operational procedures or fixes

### Update Process

1. Edit the relevant .md file(s)
2. Update "Last updated" date at top of file
3. If significant change, add note to "What Changed" section below
4. Include doc updates in PR that introduces the change
5. Tag docs owners for review

### Style Guide

- Use clear, scannable Markdown (headers, lists, tables)
- Include code blocks with language tags
- Add TOC for docs >20 lines
- Use relative links between docs
- Keep each doc focused on one topic
- Write for your audience (avoid jargon unless defined in GLOSSARY)

## What Changed in This Batch

**2025-01-24** - Initial documentation system created
- Created complete doc structure for MVP 0.1
- Established 18 core documentation files
- Added 5 Architecture Decision Records
- Created GitHub PR and issue templates
- Documented current state of monorepo, workers, and render pipeline

## External Resources

- [Main README](../README.md) - Quick start guide
- [CLAUDE.md](../CLAUDE.md) - Repository guidance for Claude Code
- [.env.example](../.env.example) - Environment variable reference
- [Prisma Schema](../packages/api/prisma/schema.prisma) - Database models

## Getting Help

- **Technical questions**: See [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md)
- **Contributing questions**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Product questions**: See [PRODUCT_BRIEF.md](./PRODUCT_BRIEF.md)
- **Terminology**: See [GLOSSARY.md](./GLOSSARY.md)

---

**Note**: This documentation reflects the state of MerkadAgency MVP 0.1. As the platform evolves, docs will be updated to match.
