# ADR-0005: Dark Theme with Tailwind + shadcn/ui

**Status**: Accepted
**Date**: 2025-01-24
**Deciders**: Design + Engineering Team
**Related**: None

## Context

Need a design system for web UI. Requirements:
- Professional appearance for video production tool
- Accessibility (WCAG AA)
- Fast development (pre-built components)
- Dark theme (easier on eyes for long sessions)

## Decision

Use **Tailwind CSS** + **shadcn/ui** with custom dark theme.

**Brand Colors**:
- Ink (#0F1115) - Background
- Violet (#5A27FF) - Primary
- Teal (#16B8A6) - Accent

## Alternatives Considered

### 1. Material-UI (MUI)

**Pros**:
- Comprehensive component library
- Battle-tested

**Cons**:
- Heavy bundle size
- Harder to customize
- "Google" aesthetic hard to override

### 2. Chakra UI

**Pros**:
- Excellent dark mode support
- Good accessibility

**Cons**:
- CSS-in-JS performance overhead
- Less flexibility than Tailwind

### 3. Ant Design

**Pros**:
- Huge component library

**Cons**:
- Very opinionated styling
- Harder to make "not look like Ant Design"

## Consequences

### Positive

- **Fast development**: shadcn/ui components copy-paste ready
- **Full control**: Components in our repo, can modify freely
- **Performance**: Tailwind purges unused CSS
- **Dark-first**: Designed for dark theme from start
- **Accessibility**: Radix UI primitives (shadcn foundation) are WCAG compliant

### Negative

- **Learning curve**: Tailwind utility classes can be verbose
- **Consistency**: Need discipline to follow design tokens
- **No "out of box" theme**: Must define all colors, spacing

### Mitigation

- Document all design tokens in BRAND_TOKENS.md
- Use Tailwind `@apply` for repeated patterns
- Lint for color usage (future: no arbitrary hex values)

## Implementation Notes

**tailwind.config.ts**:
```typescript
{
  theme: {
    extend: {
      colors: {
        ink: '#0F1115',
        violet: { DEFAULT: '#5A27FF', ... },
        teal: { DEFAULT: '#16B8A6', ... },
      },
    },
  },
}
```

**shadcn/ui components**:
- Button, Card, Dialog, Input, Progress, Tabs, Toast
- Styled with Tailwind classes
- Accessible (Radix UI primitives)

---

**Next Review**: 2025-04-24 - Evaluate if custom components needed beyond shadcn/ui.
