# MerkadAgency - Project Handoff Document

> Last Updated: December 20, 2024

## Current Project State

| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ Complete | Homepage with positioning, hero, services overview |
| `/book` | ✅ Complete | Cal.com embed for booking consultations |
| `/services` | ✅ Complete | CRM Automation services page |
| `/case-study` | ✅ Complete | Case studies index page |
| `/case-study/kravingsclub` | ✅ Complete | Kravings Club cannabis delivery case study |
| `/admin` | ✅ Complete | Firebase Auth + Google sign-in, lead management |
| `/api/webhooks/cal` | ✅ Complete | Cal.com webhook for auto-creating leads |

---

## Tech Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **React:** 19
- **TypeScript:** 5.x
- **Styling:** Vanilla CSS (globals.css design system)
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (Google provider)
- **Deployment:** Vercel

---

## Firebase Setup

| Setting | Value |
|---------|-------|
| Project ID | `merkadagency-dd2aa` |
| Firestore Collection | `/leads` |
| Auth Provider | Google |
| Whitelisted Emails | `camilo.reyna97@gmail.com`, `camilo.reyna@merkadagency.com` |
| Storage | Case study images, video assets |

### Firestore `/leads` Collection Schema

```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'booked' | 'closed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notes: LeadNote[];
  source?: string;
  phone?: string;
}

interface LeadNote {
  content: string;
  createdAt: Timestamp;
}
```

---

## Environment Variables

### Required for Vercel Deployment

```env
# Firebase Client SDK (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin SDK (server-side, for webhook)
FIREBASE_SERVICE_ACCOUNT_KEY=

# Optional
CAL_WEBHOOK_SECRET=
```

### Getting `FIREBASE_SERVICE_ACCOUNT_KEY`

1. Go to [Firebase Console → Project Settings → Service Accounts](https://console.firebase.google.com/project/merkadagency-dd2aa/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Download the JSON file
4. Minify the JSON to a single line
5. Add as `FIREBASE_SERVICE_ACCOUNT_KEY` env variable

---

## Cal.com Webhook Configuration

| Setting | Value |
|---------|-------|
| URL | `https://www.merkadagency.com/api/webhooks/cal` |
| Trigger | `BOOKING_CREATED` |
| Secret | Set in `CAL_WEBHOOK_SECRET` (optional) |

> ⚠️ **Important:** Use `www.merkadagency.com` subdomain. The non-www domain returns a 307 redirect which breaks webhook delivery.

---

## File Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Design system tokens
│   ├── admin/
│   │   └── page.tsx            # Admin CRM dashboard
│   ├── api/
│   │   └── webhooks/
│   │       └── cal/
│   │           └── route.ts    # Cal.com webhook handler
│   ├── book/
│   │   └── page.tsx            # Cal.com booking embed
│   ├── case-study/
│   │   ├── page.tsx            # Case study index
│   │   └── kravingsclub/
│   │       └── page.tsx        # Kravings Club case study
│   └── services/
│       ├── page.tsx            # CRM Automation services
│       └── services.module.css
│
├── components/
│   ├── Header.tsx              # Navigation (desktop + mobile hamburger)
│   ├── Footer.tsx              # Site footer
│   ├── CTAButton.tsx           # Call-to-action button
│   ├── TrackedCTA.tsx          # CTA with analytics tracking
│   ├── CalendarEmbed.tsx       # Cal.com embed component
│   ├── Card.tsx                # Generic card component
│   ├── Section.tsx             # Page section wrapper
│   ├── StatusCard.tsx          # Status display card
│   ├── StatusRow.tsx           # Status row component
│   ├── ConsolePanel.tsx        # Console-style panel
│   ├── CRMConsolePanel.tsx     # CRM-specific console panel
│   ├── SystemPanel.tsx         # System panel component
│   ├── SystemBriefVideo.tsx    # Video component with controls
│   ├── PrimaryCTA.tsx          # Primary CTA component
│   ├── GoogleAnalytics.tsx     # GA4 script loader
│   └── PageViewTracker.tsx     # Page view tracking
│
├── lib/
│   ├── firebase.ts             # Firebase client initialization
│   ├── firestore.ts            # Firestore CRUD helpers
│   ├── auth.ts                 # Auth helpers (Google sign-in)
│   └── analytics.ts            # Analytics event tracking
│
├── public/
│   └── (static assets)
│
├── .env.local                  # Local environment variables (not committed)
├── .env.example                # Example env file template
├── next.config.ts              # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## CRM Features

### Admin Dashboard (`/admin`)
- Google Sign-In authentication
- Email whitelist for access control
- Lead pipeline visualization
- Activity feed (recent leads)
- Follow-up queue
- Lead status management (`new` → `contacted` → `qualified` → `booked` → `closed`)
- Notes system

### Cal.com Integration
- Webhook receives `BOOKING_CREATED` events
- Auto-creates leads with `booked` status
- Extracts name, email, phone from booking data

---

## Design System

The design system is defined in `app/globals.css` with CSS custom properties:

- **Colors:** Royal purple primary, dark backgrounds, subtle borders
- **Typography:** System font stack, defined scales
- **Spacing:** Consistent padding/margin tokens
- **Components:** Cards, buttons, status indicators, console panels

See `BRAND.md` for detailed branding guidelines.

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local
# Fill in Firebase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Deployment

1. Push to `main` branch
2. Vercel auto-deploys from GitHub
3. Ensure all environment variables are set in Vercel dashboard
4. Configure Cal.com webhook to point to `https://www.merkadagency.com/api/webhooks/cal`
