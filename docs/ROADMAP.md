# MerkadAgency Roadmap

**Last updated:** 2025-01-24

## Overview

This roadmap outlines the phased development of MerkadAgency from MVP 0.1 (technical proof-of-concept) through 0.4 (market-ready product). Each phase builds on the previous, with clear deliverables and success criteria.

## Roadmap Phases

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **0.1** | Weeks 1-4 | Technical proof-of-concept | ✅ Complete |
| **0.2** | Weeks 5-8 | Production readiness + real AI | 🔄 Planning |
| **0.3** | Weeks 9-14 | Scale & quality improvements | 📋 Planned |
| **0.4** | Weeks 15-20 | Market-ready product | 📋 Planned |

---

## Phase 0.1: Technical Proof-of-Concept ✅

**Goal**: Prove end-to-end workflow with mock adapters

**Duration**: 4 weeks (COMPLETE)

### Deliverables

- [x] Monorepo structure (TurboRepo + pnpm)
- [x] Core data models (Project, Asset, Scene, VoSegment, RenderJob)
- [x] 5 BullMQ workers (Director, ImageLab, ScriptVO, Music, Editor)
- [x] FFmpeg render pipeline (1080×1920, 30fps)
- [x] FCPXML and EDL export
- [x] Next.js web UI (dashboard + project canvas)
- [x] Mock adapters (TTS, ImageGen, Music)
- [x] Docker Compose infrastructure
- [x] Documentation system

### Success Criteria

- [x] Developer can run `pnpm dev` and have working system in <10 min
- [x] User can create project → render video → download MP4/FCPXML in <15 min
- [x] FCPXML imports successfully into Final Cut Pro
- [x] Codebase is documented and extensible

### Risks & Issues

- ✅ **FFmpeg complexity**: Mitigated with fluent-ffmpeg wrapper
- ✅ **FCPXML compatibility**: Tested with manual imports
- ⚠️ **Performance at scale**: Not tested beyond single project

---

## Phase 0.2: Production Readiness + Real AI

**Goal**: Replace mocks with real services, add authentication, improve UX

**Duration**: 4 weeks

**Target**: End of Month 2

### Deliverables

#### Core Features

- [ ] **User authentication** (Clerk or Auth0)
  - Sign up, login, logout
  - Multi-tenancy (projects scoped to user)
  - Team invites (basic)

- [ ] **Asset upload UI**
  - Drag-and-drop for images/videos
  - Upload progress indicators
  - Asset library view

- [ ] **Real TTS integration** (ElevenLabs)
  - Implement ElevenLabsTTSProvider
  - Voice selection UI
  - Cost tracking per project

- [ ] **Real image generation** (Stability AI SDXL)
  - Implement StabilityImageGenProvider
  - Prompt engineering for product shots
  - Image quality settings

- [ ] **Crossfade transitions**
  - FFmpeg xfade filter between scenes
  - Configurable transition duration

- [ ] **Timeline editor (basic)**
  - Drag to reorder scenes
  - Edit scene durations
  - Live preview updates

#### Technical Improvements

- [ ] Database migrations (switch from db:push to proper migrations)
- [ ] Error boundaries in React
- [ ] Structured logging (Winston or Pino)
- [ ] Health check endpoints
- [ ] Job retry strategies (exponential backoff)

#### Testing & Quality

- [ ] End-to-end smoke test in CI
- [ ] Integration tests for job flows
- [ ] Visual regression tests (Chromatic or Percy)
- [ ] Load testing (1000 concurrent renders)

### Success Criteria

- [ ] 10 beta users can create accounts and render videos
- [ ] Real TTS produces natural-sounding voiceover
- [ ] Real image gen produces on-brand visuals
- [ ] System handles 100 renders/day without failures
- [ ] <5 minute render time maintained

### Definition of Done

- All deliverables shipped to staging
- Beta users can sign up and create videos
- ElevenLabs and Stability AI integrations working
- CI pipeline runs all tests
- Documentation updated for new features

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **API costs exceed budget** | High | Implement cost caps, optimize prompts |
| **TTS quality inconsistent** | Medium | Fallback to mock, add quality checks |
| **Image gen takes too long** | Medium | Parallel processing, caching |
| **Auth complexity** | Low | Use managed service (Clerk) |

---

## Phase 0.3: Scale & Quality Improvements

**Goal**: Multi-format support, batch workflows, professional polish

**Duration**: 6 weeks

**Target**: End of Month 4

### Deliverables

#### Video Features

- [ ] **Multiple aspect ratios**
  - 16:9 (horizontal)
  - 1:1 (square)
  - Responsive templates per ratio

- [ ] **Real music library integration**
  - Epidemic Sound or Artlist API
  - Music search and preview
  - License tracking

- [ ] **Advanced text animations**
  - Fade in/out
  - Slide from edges
  - Typewriter effect

- [ ] **Stock footage integration**
  - Pexels or Unsplash API
  - Search and insert into scenes
  - Auto-licensing

- [ ] **Batch video generation**
  - Upload CSV with product data
  - Generate 10-100 variations
  - Bulk download

#### UX Improvements

- [ ] **Template library**
  - 5+ pre-made templates
  - Template preview and selection
  - Custom template builder

- [ ] **Brand kit**
  - Save brand colors, fonts, logos
  - Apply brand kit to all projects
  - Multiple brand kits per account

- [ ] **Timeline editor (advanced)**
  - Split scenes
  - Trim clips
  - Add B-roll overlays

- [ ] **Render presets**
  - YouTube, Instagram, TikTok optimized settings
  - Custom resolution/bitrate

#### Platform

- [ ] **Webhooks**
  - Notify on render complete
  - Integrate with Zapier/Make

- [ ] **API for developers**
  - REST API with docs
  - SDK for Node.js
  - Rate limiting

- [ ] **Collaborative editing**
  - Share projects with team
  - Comment on scenes
  - Approval workflows

### Success Criteria

- [ ] 100+ active users
- [ ] 1,000+ videos rendered/month
- [ ] <2 minute re-render time for edits
- [ ] 90%+ render success rate
- [ ] 70%+ users download FCPXML (indicates pro usage)

### Definition of Done

- All deliverables in production
- Paying customers using batch workflows
- API documentation published
- Team collaboration features tested

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Scope creep** | High | Strict prioritization, defer features to 0.4 |
| **Music licensing complexity** | High | Legal review, clear terms in UI |
| **Performance degradation** | Medium | Load testing, optimize FFmpeg |
| **User adoption slow** | Medium | Marketing push, onboarding improvements |

---

## Phase 0.4: Market-Ready Product

**Goal**: Polish, performance, market launch

**Duration**: 6 weeks

**Target**: End of Month 6

### Deliverables

#### Rendering Engine

- [ ] **Remotion templates** (optional)
  - React-based templates for complex animations
  - Fallback to FFmpeg for simple videos
  - Template marketplace (future)

- [ ] **GPU acceleration**
  - Hardware-accelerated encoding
  - 2-3x faster renders

- [ ] **Render optimization**
  - Pre-render scene thumbnails
  - Incremental rendering (only changed scenes)
  - Distributed rendering (multi-worker)

#### Platform Polish

- [ ] **Onboarding flow**
  - Interactive tutorial
  - Sample projects
  - Tooltips and help docs

- [ ] **Billing & subscriptions**
  - Stripe integration
  - Tiered pricing (Starter, Pro, Enterprise)
  - Usage analytics dashboard

- [ ] **Notifications**
  - Email on render complete
  - In-app notifications
  - Slack integration

- [ ] **Export formats**
  - ProRes for high-quality handoff
  - GIF for previews
  - Social media-optimized (vertical, square)

#### Compliance & Security

- [ ] **Rights management**
  - Track music/image licenses
  - Expiration warnings
  - Compliance dashboard

- [ ] **Privacy controls**
  - GDPR compliance
  - Data export/deletion
  - SOC 2 Type II prep

- [ ] **Advanced security**
  - SSO (SAML)
  - Audit logs
  - Role-based access control

### Success Criteria

- [ ] 500+ active users
- [ ] 10,000+ videos rendered/month
- [ ] $10K+ MRR
- [ ] 60%+ month-2 retention
- [ ] NPS >40

### Definition of Done

- Public launch announced
- Billing live and collecting revenue
- SOC 2 audit initiated
- Support processes in place
- Roadmap for 1.0 defined

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Competitive launch** | High | Differentiate on FCPXML, brand control |
| **Infrastructure costs** | High | Optimize rendering, tiered pricing |
| **Support overhead** | Medium | Self-serve docs, community forum |
| **Legal issues (licensing)** | High | Legal review before launch |

---

## Post-0.4: Future Considerations

### 1.0 and Beyond

- **AI Script Refinement**: GPT-4/Claude for better copywriting
- **Voice Cloning**: Custom voice models per brand
- **Real-time Collaboration**: Multi-user editing like Figma
- **Mobile Apps**: iOS/Android for on-the-go editing
- **White-label**: Let agencies resell platform
- **Marketplace**: User-generated templates
- **Advanced Analytics**: Video performance tracking
- **Localization**: Multi-language UI and TTS

### Research & Exploration

- **Text-to-video models**: Explore Runway, Pika for generative B-roll
- **Auto-subtitle generation**: Whisper integration
- **Dynamic music**: AI-generated soundtracks
- **Photoshop Cloud API**: Advanced image compositing
- **Virtual avatars**: Synthesia-style presenters

---

## Release Strategy

### Version Numbering

- **0.x**: Pre-launch development
- **1.0**: Public launch
- **1.x**: Incremental improvements
- **2.0**: Major architecture changes

### Feature Flags

Use feature flags for:
- Beta features (real TTS, image gen)
- A/B tests (onboarding flows)
- Gradual rollouts (new render engine)

### Rollback Plan

- Database migrations are reversible
- Feature flags allow instant disable
- Docker images tagged and archived
- Monitoring alerts for error rate spikes

---

## Dependencies & Blockers

| Item | Blocker For | Owner | Status |
|------|-------------|-------|--------|
| ElevenLabs API access | 0.2 TTS | Engineering | Pending |
| Stability AI API key | 0.2 Image Gen | Engineering | Pending |
| Legal review (music licensing) | 0.3 Music | Legal | Not started |
| SOC 2 audit kickoff | 0.4 Launch | Security | Not started |
| Pricing model finalized | 0.4 Billing | Product | In progress |

---

## How to Use This Roadmap

1. **Planning**: Use this for sprint planning and quarterly OKRs
2. **Communication**: Share with stakeholders for transparency
3. **Prioritization**: Features not on roadmap go to backlog
4. **Adjustment**: Review and update monthly; roadmap is living document

**Update Process**: Product Lead reviews monthly, Engineering Lead approves timeline, team votes on priorities in quarterly planning.

---

**Next Review**: End of Month 1 (post-0.1 retrospective)
