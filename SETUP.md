# Environment Setup Guide

Complete guide for setting up MerkadAgency development environment.

---

## Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 22.19.0+ | `node --version` |
| npm | 10.0.0+ | `npm --version` |
| Git | 2.0+ | `git --version` |

### Install Node.js (recommended: nvm)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use project Node version
nvm install
nvm use
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Madanzo/Merkadagency.git
cd Merkadagency
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials (see Firebase Setup below).

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

---

## Firebase Setup {#firebase}

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name: `merkadagency` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Services

#### Firestore Database
1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Select region (us-central1 recommended)

#### Authentication
1. Build → Authentication → Get started
2. Sign-in providers → Add new provider
3. Enable **Google**
4. Configure OAuth consent screen if prompted

#### Hosting
1. Build → Hosting → Get started
2. Follow setup wizard (skip for now, we deploy via CLI)

### Get Configuration

1. Project Settings (gear icon) → General
2. Scroll to "Your apps" → Web app (</> icon)
3. Register app (name: "MerkadAgency Web")
4. Copy the `firebaseConfig` object

### Update .env

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### Admin Whitelist

To access admin dashboard:

1. Firestore → Start collection
2. Collection ID: `admin_users`
3. Add document with your Google email:
   ```json
   {
     "email": "your-email@gmail.com",
     "role": "admin"
   }
   ```

---

## Cal.com Setup {#calcom}

### Create Cal.com Account

1. Go to [Cal.com](https://cal.com) and sign up
2. Create an event type for "Discovery Call"
3. Copy your booking link (e.g., `cal.com/yourname/discovery`)

### Configure in Project

Update the Cal.com link in:
- `src/components/home/HeroSection.tsx`
- Any other components with booking CTAs

---

## Verify Setup

```bash
# Build should complete without errors
npm run build

# Run lint
npm run lint

# Run tests
npm test

# Start dev server
npm run dev
```

---

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Verify `.env` has correct Firebase credentials
- Ensure Firebase Auth is enabled in console

### "Permission denied" on Firestore
- Check Firestore rules allow reads
- Verify user email is in `admin_users` collection

### Port 8080 in use
```bash
lsof -ti:8080 | xargs kill -9
npm run dev
```

---

## Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
npm run build
firebase deploy --only hosting
```

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Madanzo/Merkadagency/issues)
- **Documentation**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
