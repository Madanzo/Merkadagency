# Cleanup Candidates
**Date:** 2026-01-28
**Status:** Pending Review

## 🗑️ Files to Delete
These files appear to be unused or legacy artifacts:

- `public/medspa-checklist.html`
    - **Reason:** No references found in `src`. Likely a legacy lead magnet.
- `public/placeholder.svg`
    - **Reason:** No references found in `src`.

## 🧹 Code Cleanup
- **`src/main.tsx`**
    - Remove `console.log('Unregistering legacy service worker:', registration);`

## ✅ Verified Safe (Keep)
- `src/__tests__/smoke.test.ts` (Active test)
- `src/components/ui/button.test.tsx` (Active test)
- `public/case-studies/` (Content needed)
- `public/resources/` (Content needed)

## 📋 Action Plan
1. Delete the files listed above.
2. Remove the console log.
3. Update `CHECKPOINT_2026-01-28.md` with cleanup actions.
