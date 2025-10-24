# Product Brief: MerkadAgency

**Last updated:** 2025-01-24

## Elevator Pitch

**MerkadAgency transforms product briefs into polished 15-second videos in minutes, not days—giving marketers the speed of AI with the quality of a video agency.**

## 30-Second Pitch

Marketers need dozens of product videos for ads, social, and e-commerce. Traditional agencies take weeks and cost thousands. Generic AI tools lack brand control and export flexibility. MerkadAgency bridges the gap: submit a brief, get an AI-generated storyboard, add your assets, and render professional videos with voiceover and music—ready for editing in Premiere or Final Cut Pro. Launch campaigns faster without sacrificing quality.

## Problem Statement

### Current State

Product marketers and content creators face three bad options for video production:

1. **Traditional Agencies**: High quality, but slow (weeks), expensive ($5K-$50K), and inflexible
2. **In-House Production**: Requires video expertise, equipment, and significant time investment
3. **Generic AI Tools**: Fast but produce low-quality output with no brand consistency or professional export formats

### Pain Points

- **Time**: Campaigns require dozens of video variations; manual production can't keep pace
- **Cost**: Agency rates make A/B testing and iteration prohibitively expensive
- **Control**: Generic AI tools don't support brand guidelines or custom assets
- **Handoff**: Most AI video tools export locked MP4s—no room for fine-tuning in professional NLEs
- **Consistency**: Maintaining visual and narrative consistency across campaigns is difficult

## Target Audience

### Primary Persona: Growth Marketer
- **Role**: Performance marketer, growth lead, or social media manager
- **Company**: D2C brands, e-commerce, SaaS (10-500 employees)
- **Goals**: Launch high-volume ad campaigns, test creative variations, maintain brand consistency
- **Skills**: Marketing-savvy but not video production experts
- **Pain**: Needs 20-50 video ads per month; can't afford agency rates or hire in-house team

### Secondary Persona: Video Producer / Creative Lead
- **Role**: In-house video producer, creative director
- **Company**: Agencies, brands with creative teams
- **Goals**: Scale video production without hiring more editors; focus on strategy, not execution
- **Skills**: Professional video editing (Premiere, Final Cut Pro)
- **Pain**: Spends too much time on routine product videos; needs to offload grunt work

## Value Proposition

### Core Value

**Speed + Quality + Control**: Create professional product videos 10x faster than agencies, with brand consistency and export flexibility that generic AI tools can't match.

### Key Benefits

1. **Minutes, Not Weeks**: Brief → storyboard → rendered video in <10 minutes
2. **Agency-Quality Output**: Professional voiceover, music, and video assembly
3. **Brand Consistency**: Custom templates with your fonts, colors, and messaging tone
4. **Professional Handoff**: MP4 + FCPXML/EDL exports for seamless editing in Premiere/Final Cut
5. **Cost-Effective**: Fraction of agency cost; unlimited iterations
6. **Scalable**: Batch-generate variations for A/B testing or multi-platform campaigns

## Non-Goals (Explicit Scope Limits)

❌ **Not building** (at least not in MVP 0.1-0.3):
- Long-form content (>60 seconds)
- Live-action video editing or motion tracking
- Social media scheduling or analytics
- Stock footage library (use integrations instead)
- Real-time collaboration features
- Mobile apps (web-first)
- Advanced color grading or VFX tools

❌ **Not competing with**:
- Professional editing suites (Premiere, Final Cut) - we *integrate* with them
- Stock media platforms (Shutterstock, Getty) - we *connect* to them
- Full creative agencies for brand strategy - we *execute* the creative

## Success Metrics

### MVP 0.1 (First Slice)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time-to-render** | <10 min from brief to MP4 | Job completion time |
| **Quality consistency** | 90%+ scenes rendered without errors | Render success rate |
| **Export compatibility** | 100% FCPXML/EDL compatibility | Manual testing |
| **Developer experience** | <5 min setup (local dev) | Onboarding time |

### MVP 0.2-0.3 (Scale & Quality)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **User time-to-value** | <15 min from signup to first video | Onboarding funnel |
| **Iteration speed** | <2 min to re-render after changes | End-to-end edit cycle |
| **Brand adoption** | 80%+ use custom brand tokens | Feature usage analytics |
| **Professional handoff** | 70%+ download FCPXML/EDL | Export format analytics |
| **Cost per video** | <$2 (at scale, with real APIs) | Infrastructure cost tracking |

### Post-MVP (Product-Market Fit)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Weekly Active Users** | 100+ creators | Weekly logins |
| **Videos created** | 1,000+ videos/month | Render job count |
| **Retention** | 60%+ month-2 retention | Cohort analysis |
| **NPS** | 40+ | User surveys |
| **Revenue** | $10K MRR | Billing system |

## Differentiation

| Competitor | Strength | Our Advantage |
|------------|----------|---------------|
| **Traditional Agencies** | Highest quality | 100x faster, 10x cheaper, unlimited iterations |
| **Canva Video** | Easy to use | Better AI assistance, professional exports (FCPXML) |
| **Runway/Pika** | AI video generation | Brand consistency, template system, batch workflows |
| **Descript** | Transcript-based editing | Purpose-built for product ads, better storyboard UX |
| **Remotion** | Programmatic video | No-code for marketers, AI-assisted scripting |

## Strategic Positioning

**Category**: AI-Powered Video Production Platform
**Positioning**: The video production layer between generic AI tools and professional agencies
**Tagline**: "AI video production that respects your brand"

## Market Opportunity

### TAM (Total Addressable Market)
- **Video ad spending**: $120B+ globally (2024)
- **D2C/e-commerce video needs**: Growing 40% YoY
- **Trend**: Shift from static ads to short video (TikTok, Reels, YouTube Shorts)

### SAM (Serviceable Addressable Market)
- **SMB/mid-market brands** spending <$50K/yr on video production
- Estimated 500K+ companies globally

### SOM (Serviceable Obtainable Market)
- **Initial focus**: Tech-forward D2C brands, SaaS companies
- Target: 1,000 paying customers in Year 1

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **AI quality not production-ready** | High | Medium | Mock adapters allow testing; manual fallbacks in MVP |
| **Rendering costs too high** | High | Medium | FFmpeg keeps costs low; cache pre-renders |
| **FCPXML compatibility issues** | Medium | Low | Thorough testing; EDL as fallback |
| **Rights/licensing complexity** | High | Medium | Clear policies, track licenses, integrate with vetted libraries |
| **Competitive pressure from big players** | Medium | High | Focus on niche (product ads), superior UX, professional handoff |

## Open Questions

1. **Pricing model**: Per-video, subscription, or seat-based? (Recommend: tiered subscription)
2. **Target video length**: Optimize for 15s, 30s, or both? (Recommend: 15s for MVP, expand later)
3. **Self-serve vs. guided onboarding**: Fully automated or sales-assisted for first customers? (Recommend: self-serve with docs)
4. **International markets**: English-only or multi-language from start? (Recommend: English MVP, expand via TTS)

---

**Next Steps**: See [MVP_SCOPE.md](./MVP_SCOPE.md) for implementation details and [ROADMAP.md](./ROADMAP.md) for phased rollout plan.
