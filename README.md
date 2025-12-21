# MerkadAgency

AI-powered marketing agency website for regulated industries—cannabis, medspa, and local service businesses.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Vanilla CSS** (design tokens in `globals.css`)
- **Firebase** (Firestore, Auth)
- **Vercel** (deployment)

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add Firebase credentials to .env.local
# See HANDOFF.md for required variables

# Start development server
npm run dev

# Build for production
npm run build
```

## Documentation

See **[HANDOFF.md](./HANDOFF.md)** for:
- Current project state
- Firebase configuration
- Environment variables
- File structure
- Deployment instructions

## Project Structure

```
app/            # Next.js pages and routes
components/     # Reusable React components
lib/            # Firebase, auth, analytics utilities
public/         # Static assets
```

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/services` | CRM Automation services |
| `/case-study` | Case studies index |
| `/book` | Cal.com booking |
| `/admin` | Lead management CRM |

## Environment Variables

Required variables (see `.env.example`):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT_KEY
```

## Deployment

Deployed via Vercel. Push to `main` triggers auto-deploy.

---

**© 2024 MerkadAgency**
