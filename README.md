# MerkadAgency

AI-Powered Growth Systems for Service Businesses. A modern web application built with React, Vite, TypeScript, and Firebase.

## Quick Start

### Prerequisites
- **Node.js** v22.19.0+ (use `.nvmrc` with `nvm use`)
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Madanzo/Merkadagency.git
cd Merkadagency

# Use correct Node version (if using nvm)
nvm use

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

### Verify Installation
```bash
# Build should complete without errors
npm run build

# Run tests
npm test
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 18, TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Firebase (Hosting, Firestore, Auth) |
| State | TanStack Query (React Query) |
| Icons | Lucide React |
| Scheduling | Cal.com Widget |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |

---

## Third-Party Accounts Required

| Service | Purpose | Setup Guide |
|---------|---------|-------------|
| **Firebase** | Hosting, Auth, Firestore | [SETUP.md#firebase](./SETUP.md#firebase) |
| **Cal.com** | Booking widget | [SETUP.md#calcom](./SETUP.md#calcom) |
| **Google Cloud** | OAuth for admin | Configured via Firebase |

---

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

```
/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── ui/         # shadcn/ui base components
│   ├── pages/          # Route components
│   ├── lib/            # Utilities & Firebase config
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
├── checkpoints/        # Development milestones
└── [config files]
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, data flow diagrams |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [DECISIONS.md](./DECISIONS.md) | Technical decision records |
| [TODO.md](./TODO.md) | Backlog and upcoming work |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Commit conventions, workflow |
| [SETUP.md](./SETUP.md) | Detailed setup instructions |

---

## Troubleshooting

### Port 8080 already in use
```bash
# Kill existing process
lsof -ti:8080 | xargs kill -9
npm run dev
```

### Firebase connection errors
1. Verify `.env` has correct Firebase credentials
2. Check Firebase project is active at [console.firebase.google.com](https://console.firebase.google.com)
3. Ensure Firestore rules allow reads

### Build fails with TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit

# Common fix: regenerate node_modules
rm -rf node_modules package-lock.json
npm install
```

### Cal.com widget not loading
- Widget requires DOM fully rendered before initialization
- Check browser console for CORS errors
- Verify Cal.com link is correct in component

---

## License

MIT License - see [LICENSE](./LICENSE) for details.
