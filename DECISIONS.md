# Architectural Decision Records (ADR)

This document captures key technical decisions and their rationale.

---

## 001. Use of Vite over Create React App
- **Status**: Accepted
- **Date**: 2026-01-16
- **Context**: Needed a modern, fast build tool with excellent DX.
- **Decision**: Use Vite.
- **Consequences**: Faster HMR, native ES modules, better build performance. Config differs from CRA.

---

## 002. Styling with Tailwind CSS + shadcn/ui
- **Status**: Accepted
- **Date**: 2026-01-16
- **Context**: Need rapid UI development with consistent design tokens and accessible primitives.
- **Decision**: Adopt Tailwind CSS for utility-first styling and shadcn/ui for component patterns.
- **Consequences**: Learning curve for class names, but highly scalable and maintainable. Bundle optimized via PurgeCSS.

---

## 003. Firebase as Backend-as-a-Service
- **Status**: Accepted
- **Date**: 2026-01-16
- **Context**: Need rapid deployment, authentication, and database without managing servers.
- **Decision**: Use Firebase (Hosting, Firestore, Auth).
- **Consequences**: Vendor lock-in accepted for development speed. Scales well for MVP through production.

---

## 004. Cal.com Widget Initialization
- **Status**: Accepted
- **Date**: 2026-01-17
- **Context**: Cal.com booking widget needs DOM fully rendered before initialization.
- **Decision**: Use `useEffect` with timeout to delay widget initialization.
- **Rationale**: Cal.com SDK doesn't support async loading; must wait for container element to exist.
- **Consequences**: Slight delay on widget appearance, but reliable initialization.

```typescript
// Using setTimeout because Cal.com widget needs DOM fully rendered
// before initialization — their SDK doesn't support async loading yet
useEffect(() => {
  const timer = setTimeout(() => {
    Cal("ui", { /* config */ });
  }, 100);
  return () => clearTimeout(timer);
}, []);
```

---

## 005. Google Auth for Admin Access
- **Status**: Accepted
- **Date**: 2026-01-17
- **Context**: Need simple, secure admin authentication without building custom auth flow.
- **Decision**: Use Firebase Auth with Google provider + Firestore whitelist.
- **Implementation**:
  - `admin_users` collection stores allowed email addresses
  - `ProtectedRoute` component checks auth state + whitelist
- **Consequences**: Limited to Google accounts, but zero password management overhead.

---

## 006. Firebase Hosting over Vercel
- **Status**: Accepted
- **Date**: 2026-01-18
- **Context**: Both Firebase Hosting and Vercel are viable; project uses Firebase for other services.
- **Decision**: Use Firebase Hosting for unified infrastructure.
- **Rationale**: 
  - Single dashboard for hosting + database + auth
  - Simplified deployment workflow
  - No additional vendor relationships
- **Consequences**: Vercel's edge functions not available, but Firebase Functions can fill gap if needed.

---

## 007. React Query for Server State
- **Status**: Accepted
- **Date**: 2026-01-16
- **Context**: Need efficient data fetching with caching and automatic background updates.
- **Decision**: Use TanStack Query (React Query v5).
- **Consequences**: Cleaner separation of server state vs local state. Automatic cache invalidation. Works well with Firestore.

---

## 008. Vitest over Jest for Testing
- **Status**: Accepted
- **Date**: 2026-01-19
- **Context**: Need testing framework compatible with Vite.
- **Decision**: Use Vitest (native Vite integration).
- **Rationale**: Zero-config with Vite, same API as Jest, faster execution.
- **Consequences**: Excellent DX, but team may need to learn Vitest-specific features.
