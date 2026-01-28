# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Vitest testing framework with smoke tests
- `CONTRIBUTING.md` with commit conventions
- `SETUP.md` with complete environment setup guide
- `.nvmrc` for Node version locking

### Changed
- Enhanced documentation layer (README, ARCHITECTURE, DECISIONS, TODO)
- Organized `/checkpoints` folder with naming convention
- Pinned critical dependencies for stability

### Security
- Fixed 7 npm vulnerabilities via `npm audit fix`
- Added daily Cloud Function backup for Firestore
- Implemented Delete Lead functionality with confirmation safeguards

---

## [0.1.0] - 2026-01-19

### Added
- Complete homepage with hero, features, and testimonials
- Results page with client portfolio showcase
- Industry landing pages (Medspas, Cannabis, Construction)
- Case studies hub with Grid & Guard featured
- Admin dashboard with Google Auth protection
- Blog structure (Phase 11)
- Firebase integration (Hosting, Firestore, Auth)
- Cal.com booking widget integration
- SEO optimization with react-helmet-async

### Changed
- Cleaned up `FirebaseTest.tsx` (removed test/debug page)
- Removed legacy `bun.lockb` lockfile
- Cleaned `.gitignore` duplicate entries

### Fixed
- Video caching between portfolio tabs (added key prop)
- Duplicate route definitions

---

## [0.0.1] - 2026-01-16

### Initialized
- Project setup with Vite + React + TypeScript
- Firebase project configuration
- Basic UI components using shadcn/ui
- Tailwind CSS design system
- React Router navigation structure
