# MerkadAgency System Pattern

> **Canonical Source of Truth** — DO NOT DEVIATE

---

## Background

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#100818` | All page backgrounds |
| `--bg-elevated` | `#150C1F` | Alternate sections |
| `--bg-surface` | `#1A1025` | System blocks |
| `--bg-card` | `#1E132A` | Cards |

**Rules:**
- No gradients unless explicitly approved
- Background = quiet, non-distracting

---

## Accent

| Token | Value | Usage |
|-------|-------|-------|
| `--purple-primary` | `#7C3AED` | CTAs ONLY |
| `--purple-hover` | `#8B5CF6` | CTA hover |
| `--purple-glow` | `rgba(124,58,237,0.35)` | CTA hover glow |

**Rules:**
- NEVER use purple for body text, icons, or decoration
- Glow only on actionable elements

---

## Typography

| Element | Font | Weight | Tracking |
|---------|------|--------|----------|
| Headlines | Inter | 600 (SemiBold) | -0.025em |
| Body | Inter | 400 (Regular) | normal |
| Micro-labels | SF Mono | 500 | 0.1-0.15em |
| Status values | SF Mono | 400 | 0.02em |

**Rules:**
- No playful spacing
- No italics
- Declarative, not persuasive

---

## System Status Pattern

```
┌─────────────────────────────┐
│ STATUS                      │  ← micro-label (uppercase, muted)
│ ● Conversion funnel  ACTIVE │  ← dot + label + value
│ ● Follow-ups     AUTOMATED  │
│ ● Response time      < 60s  │
└─────────────────────────────┘
```

**Component:** `<StatusCard />`

**Props:**
- `label`: micro-label (e.g., "STATUS", "PERFORMANCE")
- `items`: array of `{ label, value, active? }`

---

## Cards

| Property | Value |
|----------|-------|
| Background | `--bg-card` |
| Border | `1px solid rgba(255,255,255,0.04)` |
| Radius | `6px` |
| Padding | `1.25rem` |

**Rules:**
- Hard edges, small radius
- No heavy shadows
- No rounded "SaaS fluff"

---

## CTA Rules

**Component:** `<CTAButton />`

| Property | Value |
|----------|-------|
| Background | `--purple-primary` |
| Text | White, 500 weight, 0.875rem |
| Padding | `0.75rem 1.25rem` |
| Hover | glow + translateY(-1px) |

**Rules:**
- ONE primary CTA per section
- Same wording per page
- Always routes to `/book`
- No secondary CTA styles

---

## Page Structure

### Services Pages
```
1. Hero (headline + subhead + CTA)
2. System Status block (service-specific)
3. Problem Removed section
4. What's Automated section
5. What Improves (speed, CPL, response time)
6. Final CTA → /book
```

### Case Studies (System Logs)
```
1. Hero (headline + subhead)
2. INPUTS section
3. SYSTEM CHANGES section
4. OUTPUTS section
5. System Status (before/after)
6. Final CTA → /book
```

### /book Confirmation
```
STATUS: BOOKED
NEXT ACTION: STRATEGY CALL
RESPONSE TIME: < 24h
```

---

## Governance

1. ❌ Do NOT invent new visual styles
2. ❌ Do NOT add new accent colors
3. ❌ Do NOT redesign components per page
4. ✓ New pages composed ONLY from this pattern
5. ✓ Deviations must be documented and approved

---

## Success Criteria

> A user can navigate Homepage → Services → Case Study → Book
> without feeling they changed products.
