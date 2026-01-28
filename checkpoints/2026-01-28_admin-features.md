# Checkpoint: Admin Features & Hardening
**Date:** 2026-01-28
**Version:** 0.1.1

## ✅ Status: Working
- **Lead Management:**
    - "Delete Lead" functionality added to Admin Dashboard (Pipeline & Table views).
    - Includes confirmation dialog to prevent accidental deletion.
- **Data Safety:**
    - `scheduledBackup` Cloud Function deployed (runs daily at 00:00).
    - Backs up Firestore `(default)` database to App Engine default GCS bucket.
    - Timeout configured to 540s (9 mins).
- **Security:**
    - `npm audit fix` applied (0 vulnerabilities).
    - Strict types in `AdminDashboard.tsx`, `ResultsPage.tsx`, `CaseStudiesHub.tsx`.

## 🚧 Pending / Known Issues
- **Backup Permissions:**
    - User needs to manually enable `Cloud Datastore Import Export Admin` role for the default service account in GCP Console.
    - API `datastore.googleapis.com` must be enabled.

## 🔗 Key Files
- `src/pages/admin/AdminDashboard.tsx` (Delete logic)
- `functions/src/admin/backup.ts` (Backup cron job)
- `firestore.rules` (Permissions)
