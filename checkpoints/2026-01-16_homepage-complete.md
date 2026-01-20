# Project Checkpoint — 2026-01-16

## Project Overview
**Name:** MerkadAgency  
**Description:** Modern marketing agency website and lead management platform built with React, featuring service pages, case studies, portfolio, resource guides, and admin dashboard with CRM functionality.

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend** | React | 18.3.1 |
| **Build Tool** | Vite | 5.4.19 |
| **Language** | TypeScript | 5.8.3 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **UI Components** | shadcn-ui (Radix primitives) | Various |
| **State Management** | TanStack React Query | 5.83.0 |
| **Routing** | React Router DOM | 6.30.1 |
| **Backend** | Firebase (Hosting, Firestore, Functions) | 12.7.0 |
| **Forms** | React Hook Form + Zod | 7.61.1 / 3.25.76 |
| **Icons** | Lucide React | 0.462.0 |

---

## Folder Structure Overview

```
/
├── public/                    # Static assets (favicon, robots.txt, resources)
│   ├── case-studies/         # Case study media assets
│   └── resources/            # Downloadable resources & guides
├── src/
│   ├── components/           # 76 reusable components
│   │   ├── ui/               # 49 shadcn-ui base components
│   │   ├── sections/         # 10 homepage sections
│   │   ├── common/           # 10 shared utilities (SEO, VideoPlayer, etc.)
│   │   ├── layout/           # Header, Footer, Layout, PageBackground
│   │   ├── admin/            # Admin-specific components
│   │   └── templates/        # Page templates
│   ├── pages/                # 34 route components
│   │   ├── services/         # Service detail pages
│   │   ├── industries/       # Industry vertical pages
│   │   ├── case-studies/     # Case study pages
│   │   ├── resources/        # Resource guide pages
│   │   ├── about/            # About & Method pages
│   │   ├── blog/             # Blog section
│   │   ├── legal/            # Privacy & Terms pages
│   │   └── admin/            # Admin login & dashboard
│   ├── lib/                  # 5 utility modules
│   │   ├── firebase.ts       # Firebase configuration
│   │   ├── firestore.ts      # Firestore operations
│   │   ├── auth.ts           # Authentication utils
│   │   ├── analytics.ts      # Analytics tracking
│   │   └── utils.ts          # General utilities (cn helper)
│   ├── hooks/                # 4 custom React hooks
│   │   ├── use-mobile.tsx    # Mobile detection
│   │   ├── use-toast.ts      # Toast notifications
│   │   ├── useAuth.ts        # Auth state management
│   │   └── usePageTracking.ts # Page view tracking
│   ├── App.tsx               # Main routing configuration
│   ├── main.tsx              # React DOM entry point
│   └── index.css             # Global styles & Tailwind config
├── checkpoints/              # Historical checkpoint files
├── dist/                     # Production build output
├── .firebase/                # Firebase hosting cache
└── [Config Files]            # vite.config, tailwind.config, etc.
```

---

## Key Files & Purposes

### Core Application
| File | Purpose |
|------|---------|
| `src/App.tsx` | Main router with all route definitions |
| `src/main.tsx` | React DOM rendering & entry point |
| `src/index.css` | Global styles, CSS variables, Tailwind layers |

### Configuration
| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration with path aliases |
| `tailwind.config.ts` | Tailwind theme, colors, typography |
| `firebase.json` | Firebase Hosting configuration |
| `components.json` | shadcn-ui component settings |
| `tsconfig.json` | TypeScript compiler options |

### Firebase Integration
| File | Purpose |
|------|---------|
| `src/lib/firebase.ts` | Firebase app initialization |
| `src/lib/firestore.ts` | Firestore CRUD operations for leads |
| `src/lib/auth.ts` | Firebase Authentication wrapper |
| `src/lib/analytics.ts` | Google Analytics event tracking |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Project overview, quick start guide |
| `ARCHITECTURE.md` | System design, data flow, structure |
| `DECISIONS.md` | Architectural decision records |
| `CHANGELOG.md` | Version history |
| `TODO.md` | Backlog and upcoming tasks |

---

## Environment Variables Required

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

---

## Current Integrations

### Firebase Services
- **Firebase Hosting** — SPA deployment with custom domain
- **Cloud Firestore** — Lead storage and management
- **Firebase Authentication** — Admin login
- **Google Analytics** — Page tracking via Measurement ID

### Third-Party Services
- **Cal.com** — Calendar booking embed (`/book` page)
- **Lucide Icons** — Iconography throughout UI

---

## Data Model (Firestore)

### `leads` Collection
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Contact name |
| `email` | string | Contact email |
| `phone` | string | Phone number |
| `company` | string | Company name |
| `message` | string | Inquiry message |
| `source` | string | Lead source page |
| `createdAt` | timestamp | Submission time |
| `status` | string | Lead status (new, contacted, etc.) |

---

## Recent Changes / Features Implemented

- ✅ Complete documentation layer (README, ARCHITECTURE, DECISIONS, CHANGELOG, TODO)
- ✅ Checkpoint system structure (`checkpoints/` directory)
- ✅ 4 Industry vertical pages (Medspas, Cannabis, Construction, E-commerce)
- ✅ 6 Resource guide pages with lead magnets
- ✅ 3 Case study pages (Kravings, Teonanacatl, Grid N Guard)
- ✅ Admin dashboard with lead management
- ✅ Protected routes for admin section
- ✅ Firebase Analytics integration

---

## Known Issues / TODOs

### High Priority
- [ ] Complete mobile responsiveness audit
- [ ] Set up automated backups if not handled by Firebase
- [ ] Project audit and cleanup (in progress)

### Features
- [ ] Implement Blog structure (Phase 11)
- [ ] Add more case studies to Portfolio

### Technical Debt
- [ ] Run `npm audit` for security vulnerabilities
- [ ] Standardize code comments
- [ ] Setup secondary git remote mirror

### Ideas
- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)

---

## Next Steps Planned

1. Complete project audit and cleanup
2. Implement Blog feature
3. Mobile responsiveness verification
4. Additional case studies

---

*Checkpoint created: 2026-01-16*

---

## Cleanup Completed — 2026-01-19

### Files Removed
| File | Size | Reason |
|------|------|--------|
| `src/pages/FirebaseTest.tsx` | 11,229 bytes | Temporary test/debug page |
| `bun.lockb` | 198,722 bytes | Legacy lockfile (project uses npm) |

### Code Changes
- Removed `FirebaseTest` import from `src/App.tsx`
- Removed `/firebase-test` route from `src/App.tsx`
- Cleaned duplicate entries in `.gitignore`

### Verification Results
- **Build:** ✅ Successful (2108 modules)
- **Bundle size:** Reduced by ~5.5 KB
- **Lint:** Pre-existing TypeScript warnings (unrelated to cleanup)

*Cleanup performed: 2026-01-19*
