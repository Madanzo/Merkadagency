# MerkadAgency Website

AI-powered marketing agency website built with Next.js 16, React 19, and Tailwind CSS 4.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/merkadagency/website.git
cd merkadagency

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout with Header/Footer
│   ├── globals.css        # Global styles and design tokens
│   ├── service/           # Services page
│   ├── book/              # Booking page with GoHighLevel widget
│   ├── ai-lead-capture/   # AI Lead Capture service page
│   ├── portfolio-web/     # Portfolio page
│   ├── innovation-log/    # Blog/Innovation log
│   ├── seo-audit/         # SEO audit tool page
│   ├── privacy-policy/    # Privacy policy
│   ├── terms-conditions/  # Terms and conditions
│   ├── cookies-policy/    # Cookies policy
│   └── api/               # API routes (WordPress proxy)
├── components/            # Shared React components
│   ├── Header.tsx         # Site header with navigation
│   └── Footer.tsx         # Site footer with links
├── hooks/                 # Custom React hooks
│   ├── useScrollAnimation.ts  # Scroll-triggered animations
│   ├── useParticles.ts       # Particle effect system
│   └── index.ts              # Barrel export
└── public/                # Static assets
    └── images/            # Images including logo
```

## 🎨 Design System

The project uses CSS custom properties (design tokens) defined in `globals.css`:

### Colors
- `--royal-purple`: Primary dark background
- `--secondary-pink`: Accent color
- `--gradient-purple`: Primary gradient
- `--gradient-accent`: Accent gradient

### Spacing
- `--space-xs` to `--space-4xl`: Consistent spacing scale

### Typography
- `--font-size-xs` to `--font-size-5xl`: Font size scale

### Layout
- `--header-height`: Header height (responsive)
- `--max-width`: Container max width

## 🔧 Key Features

- **AI Lead Capture** - Service pages showcasing automation capabilities
- **WordPress Integration** - Blog content proxied via API routes
- **GoHighLevel Integration** - Embedded booking widgets and forms
- **Scroll Animations** - Custom hooks for intersection observer animations
- **Particle Effects** - React-based particle system
- **Responsive Design** - Mobile-first responsive layouts
- **Security Headers** - XSS protection, clickjacking prevention

## 📦 Dependencies

### Production
- `next` - React framework
- `react` / `react-dom` - UI library

### Development
- `typescript` - Type safety
- `tailwindcss` - Utility CSS
- `eslint` - Code linting

## 🧪 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security

Security headers are configured in `next.config.ts`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📝 Environment Variables

See `.env.example` for available environment variables.

Currently, no environment variables are required for basic functionality.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com) for the best Next.js experience.

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Docker containers
- Self-hosted Node.js

## 📄 License

Copyright © 2025 MerkadAgency. All rights reserved.

## 📞 Contact

- Website: [merkadagency.com](https://merkadagency.com)
- Email: info@merkadagency.com
- Phone: +1 (512) 434-3793
