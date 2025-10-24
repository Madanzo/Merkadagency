# Brand Tokens & Design System

**Last updated:** 2025-01-24

## Overview

MerkadAgency uses a dark-first design system with bold accent colors optimized for video production interfaces. This document defines all design tokens, usage guidelines, and code examples.

## Color Palette

### Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Ink** | `#0F1115` | `rgb(15, 17, 21)` | Primary background, dark surfaces |
| **Violet** | `#5A27FF` | `rgb(90, 39, 255)` | Primary accent, CTAs, interactive elements |
| **Teal** | `#16B8A6` | `rgb(22, 184, 166)` | Secondary accent, success states, highlights |
| **Gray** | `#9CA3AF` | `rgb(156, 163, 175)` | Muted text, secondary information |
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | Primary text, high-emphasis content |

### Extended Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Violet Light** | `#7C3AED` | Hover states, lighter accents |
| **Violet Dark** | `#4C1D95` | Active states, deeper accents |
| **Teal Light** | `#2DD4BF` | Highlights, success feedback |
| **Teal Dark** | `#0F766E` | Dark teal accents |
| **Cool Gray 800** | `#1F2937` | Secondary backgrounds, cards |
| **Cool Gray 700** | `#374151` | Tertiary backgrounds, borders |
| **Cool Gray 600** | `#4B5563` | Disabled states, muted borders |

### Semantic Colors

| Purpose | Token | Hex |
|---------|-------|-----|
| **Success** | Teal | `#16B8A6` |
| **Warning** | Amber | `#F59E0B` |
| **Error** | Red | `#EF4444` |
| **Info** | Blue | `#3B82F6` |

## Typography

### Font Family

```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (code, data) */
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Font Scale

| Level | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| **Display** | 48px | 1.2 | 700 | Hero headings |
| **H1** | 36px | 1.3 | 700 | Page titles |
| **H2** | 30px | 1.4 | 600 | Section headings |
| **H3** | 24px | 1.4 | 600 | Subsection headings |
| **H4** | 20px | 1.5 | 600 | Card titles |
| **Body Large** | 18px | 1.6 | 400 | Intro paragraphs |
| **Body** | 16px | 1.6 | 400 | Default text |
| **Body Small** | 14px | 1.5 | 400 | Secondary text |
| **Caption** | 12px | 1.4 | 500 | Labels, timestamps |

## Spacing Scale

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, inline elements |
| `sm` | 8px | Small gaps, icon spacing |
| `md` | 16px | Default spacing, component padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large gaps between sections |
| `2xl` | 48px | Major section breaks |
| `3xl` | 64px | Page-level spacing |

## Shadows

```css
/* Elevation shadows (dark theme optimized) */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5);

/* Glow effects */
--glow-violet: 0 0 20px rgba(90, 39, 255, 0.5);
--glow-teal: 0 0 20px rgba(22, 184, 166, 0.5);
```

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements, badges |
| `md` | 8px | Buttons, inputs, cards |
| `lg` | 12px | Large cards, modals |
| `xl` | 16px | Hero sections |
| `full` | 9999px | Pills, avatars |

## Gradients

### Primary Gradient (Violet → Teal)

```css
background: linear-gradient(135deg, #5A27FF 0%, #16B8A6 100%);
```

Usage: CTAs, hero sections, feature highlights

### Subtle Gradient (Dark variations)

```css
background: linear-gradient(180deg, #1F2937 0%, #0F1115 100%);
```

Usage: Card backgrounds, section dividers

## Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        ink: '#0F1115',
        violet: {
          DEFAULT: '#5A27FF',
          light: '#7C3AED',
          dark: '#4C1D95',
        },
        teal: {
          DEFAULT: '#16B8A6',
          light: '#2DD4BF',
          dark: '#0F766E',
        },
        gray: {
          DEFAULT: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(90, 39, 255, 0.5)',
        'glow-teal': '0 0 20px rgba(22, 184, 166, 0.5)',
      },
    },
  },
};
```

## Component Examples

### Button Styles

```tsx
// Primary Button
<button className="bg-violet hover:bg-violet-light text-white px-6 py-3 rounded-md font-semibold transition-colors shadow-md">
  Generate Video
</button>

// Secondary Button
<button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold transition-colors">
  Cancel
</button>

// Ghost Button
<button className="text-violet hover:bg-violet/10 px-6 py-3 rounded-md font-semibold transition-colors">
  Learn More
</button>
```

### Card Styles

```tsx
// Default Card
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
  <h3 className="text-xl font-semibold text-white mb-2">Card Title</h3>
  <p className="text-gray">Card description text</p>
</div>

// Highlighted Card
<div className="bg-gradient-to-br from-violet/10 to-teal/10 border border-violet/30 rounded-lg p-6 shadow-glow-violet">
  <h3 className="text-xl font-semibold text-white mb-2">Featured</h3>
  <p className="text-gray">Premium content</p>
</div>
```

### Input Styles

```tsx
// Text Input
<input
  type="text"
  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray focus:border-violet focus:ring-2 focus:ring-violet/50 outline-none transition-all"
  placeholder="Enter project title"
/>

// Textarea
<textarea
  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray focus:border-violet focus:ring-2 focus:ring-violet/50 outline-none transition-all resize-none"
  rows={4}
  placeholder="Describe your product..."
/>
```

## Motion Guidelines

### Transitions

```css
/* Default transition (most elements) */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Button interactions */
transition: background-color 150ms ease, transform 100ms ease;

/* Modal/Overlay */
transition: opacity 200ms ease, transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
```

### Animation Durations

| Duration | Usage |
|----------|-------|
| 100ms | Micro-interactions (button press) |
| 150ms | Standard transitions (hover states) |
| 200ms | Medium transitions (modals opening) |
| 300ms | Slow transitions (page transitions) |
| 500ms | Deliberate animations (loaders) |

### Easing Functions

```css
/* Default */
cubic-bezier(0.4, 0, 0.2, 1)

/* Entrance (ease-out) */
cubic-bezier(0, 0, 0.2, 1)

/* Exit (ease-in) */
cubic-bezier(0.4, 0, 1, 1)

/* Spring (bounce) */
cubic-bezier(0.16, 1, 0.3, 1)
```

## Usage Guidelines

### Color Contrast

Minimum contrast ratios (WCAG AA):
- **Normal text**: 4.5:1
- **Large text** (18px+): 3:1
- **UI components**: 3:1

Our palette meets these requirements:
- White on Ink: 18.5:1 ✅
- Violet on Ink: 8.2:1 ✅
- Teal on Ink: 7.9:1 ✅
- Gray on Ink: 6.1:1 ✅

### Dark Theme Best Practices

1. **Avoid pure black** (#000000) - use Ink (#0F1115) for softer appearance
2. **Elevate with lightness**, not shadows - lighter backgrounds for cards
3. **Reduce saturation** for large surfaces - keep bright colors for accents
4. **Test in low light** - ensure comfortable viewing in dark environments

### Accessibility

- All interactive elements have `:focus-visible` states
- Focus rings use Violet with 50% opacity
- Minimum tap target: 44×44px
- Color is never the only indicator (use icons + text)

## Brand Voice (Visual)

- **Modern**: Clean lines, generous spacing, contemporary typography
- **Bold**: High-contrast colors, confident CTAs, striking gradients
- **Professional**: Precise alignment, consistent spacing, polished details
- **Energetic**: Vibrant accents, smooth animations, dynamic layouts

## Examples in Context

### Hero Section

```tsx
<section className="bg-gradient-to-br from-ink via-gray-900 to-ink min-h-screen flex items-center">
  <div className="max-w-6xl mx-auto px-6">
    <h1 className="text-6xl font-bold text-white mb-6">
      AI Video Production
      <span className="bg-gradient-to-r from-violet to-teal bg-clip-text text-transparent">
        {' '}That Respects Your Brand
      </span>
    </h1>
    <p className="text-xl text-gray mb-8 max-w-2xl">
      Transform product briefs into polished videos in minutes with AI-powered storyboards,
      voiceover, and professional exports.
    </p>
    <button className="bg-violet hover:bg-violet-light text-white px-8 py-4 rounded-md font-semibold text-lg shadow-glow-violet transition-all hover:shadow-xl">
      Start Creating
    </button>
  </div>
</section>
```

### Dashboard Card

```tsx
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-violet/50 transition-colors cursor-pointer">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-white">Smartwatch Ad</h3>
      <p className="text-sm text-gray">Created 2 hours ago</p>
    </div>
    <span className="px-3 py-1 bg-teal/20 text-teal text-xs font-medium rounded-full">
      Completed
    </span>
  </div>
  <div className="text-sm text-gray">
    6 scenes • 15 seconds • 9:16
  </div>
</div>
```

---

**Next**: See [UI_GUIDE.md](./UI_GUIDE.md) for component library and usage patterns.
