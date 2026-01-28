# TODO / Backlog

## 🔴 High Priority

- [x] Complete Project Audit and Cleanup
- [x] Set up documentation layer (README, ARCHITECTURE, etc.)
- [ ] Fix npm vulnerabilities (`npm audit fix`)
- [ ] Verify mobile responsiveness on all pages
- [ ] Set up automated testing (Vitest)

## 🟡 Features

### Email Automation & Marketing (Phase 2) - ✅ Completed
- [x] Integrate Resend for email delivery
- [x] Create Newsletter Signup component
- [x] Implement Drip Campaign system (Day 0, 1, 3, 7, 14)
- [x] Build Admin Email Dashboard:
  - [x] Subscriber management
  - [x] Email template editor
  - [x] Campaign logs & analytics
  - [x] Sequence visualization (Time-warps)
- [x] Add triggers for:
  - [x] Contact form submission
  - [x] Newsletter signup
  - [x] Cal.com booking (Post-booking sequence)
  - [x] Manual client onboarding

### Blog (Phase 11)
- [ ] Implement blog listing page
- [ ] Add blog post template
- [ ] Connect to Firestore for dynamic posts
- [ ] Add blog categories/tags

### Portfolio / Case Studies
- [ ] Add more case studies (3+ additional)
- [ ] Implement case study filtering
- [ ] Add video testimonials

### Admin Dashboard
- [ ] Add analytics overview
- [x] Lead management interface
- [x] Email marketing suite
- [ ] Blog post editor (WYSIWYG)

## 🟢 Technical Debt

- [x] Remove `FirebaseTest.tsx` debug page
- [x] Clean `.gitignore` duplicates
- [x] Remove `bun.lockb` legacy file
- [x] Fix Caching Issues (Cloudflare/Firebase headers)
- [x] Fix Service Worker conflicts
- [ ] Fix TypeScript `any` types in:
  - `ResultsPage.tsx`
  - `AdminDashboard.tsx`
  - `CaseStudiesHub.tsx`
  - Industry pages
- [ ] Add proper error boundaries
- [ ] Implement code splitting for routes

## 🔵 Infrastructure

- [x] Set up Firebase Hosting
- [x] Configure Firestore Security Rules
- [ ] Set up secondary git remote mirror (GitLab)
- [ ] Configure Firebase daily backups
- [x] Add CI/CD pipeline (GitHub Actions)
- [ ] Set up staging environment

## 💡 Ideas / Future

- [ ] Dark mode toggle
- [ ] Multi-language support (i18n)
- [ ] Live chat widget
- [ ] A/B testing for landing pages
- [ ] Performance monitoring (Web Vitals)

---

*Last updated: 2026-01-28*
