# MerkadAgency Brand Guide

## Brand Colors

### Primary - Royal Purple
| Variant | HEX | Usage |
|---------|-----|-------|
| Main | `#5A27FF` | Primary actions, CTAs, links |
| Light | `#7B4FFF` | Hover states |
| Dark | `#4A1FD9` | Active/pressed states |

### Secondary - Silver
| Variant | HEX | Usage |
|---------|-----|-------|
| Main | `#C9CCD6` | Secondary text, borders |
| Light | `#E1E3E8` | Subtle backgrounds |
| Dark | `#9A9DA6` | Muted text |

### Accent - Electric Pink
| Variant | HEX | Usage |
|---------|-----|-------|
| Main | `#FF4FD8` | Accent highlights, badges |
| Light | `#FF7AE5` | Hover accents |
| Dark | `#D93FB3` | Active accents |

### Neutrals
| Color | HEX | Usage |
|-------|-----|-------|
| Pure White | `#FFFFFF` | Primary text on dark |
| Dark Background | `#0F1115` | Main background |
| Light Surface | `#1A1D24` | Cards, elevated surfaces |

### State Colors
| State | HEX |
|-------|-----|
| Success | `#10B981` |
| Error | `#EF4444` |
| Warning | `#F59E0B` |

---

## Primary Background

### Deep Royal Purple (Foundation)
| Property | Value |
|----------|-------|
| HEX | `#1F0E33` |
| RGB | `31, 14, 51` |

**Role**: Hero sections, full-screen backgrounds, technology pages

This darker royal purple feels premium and restrained. It avoids the "neon SaaS" look while still reading as AI-forward.

### Recommended Gradient (Brand-Safe)

Use a subtle vertical or radial gradient to add depth without noise:

| Position | HEX | Description |
|----------|-----|-------------|
| Start | `#1F0E33` | Deep royal base |
| End | `#2B145A` | Elevated royal purple |

```css
background: radial-gradient(
  circle at top left,
  #2B145A 0%,
  #1F0E33 55%
);
```

### Accent Compatibility

This background pairs perfectly with:
- **Primary CTA Purple**: `#5A27FF`
- **Soft Silver Text**: `#C9CCD6`
- **Electric Pink Accents**: `#FF4FD8` (use sparingly)

### Design Philosophy

- **Dark royal purple** = authority + infrastructure
- **Bright royal purple** = action + conversion  
- **Pink** = energy, not dominance

Keep the background calm and heavy while letting CTAs do the talking. This differentiates from template SaaS sites.

---

## Services

- **AI Lead Capture & Qualification** - Automated lead generation and qualification
- **SEO Audit & Optimization** - Website SEO analysis and recommendations
- **Marketing Automation** - CRM and workflow automation
- **Web Development** - Custom website design and development
- **Content Marketing** - Blog and content strategy

---

## Industries We Focus On

- **Cannabis** - Dispensaries, cultivation, CBD brands
- **E-commerce** - Online stores, DTC brands
- **Roofing & Construction** - Contractors, home services
- **Med Spas & Spas** - Aesthetics, wellness centers

---

## Contact

- **Website**: [merkadagency.com](https://merkadagency.com)
- **Email**: camilo.reyna@merkadagency.com
- **Phone**: +1 (512) 434-3793

---

## Firebase Storage Conventions

### Image Naming (Case Studies)
```
/case-studies/{slug}/hero.webp
/case-studies/{slug}/before-01.webp
/case-studies/{slug}/after-01.webp
```

### Video Naming
```
/videos/{slug}.mp4
```

### Logo
```
/branding/logo.png
```

---

© 2025 MerkadAgency. All rights reserved.
