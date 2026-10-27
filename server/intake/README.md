# Contact intake boundary — mounted locally, disabled, not deployed

The website owns validation and transport only. Canonical CRM owns identity, lead/contact/opportunity persistence, audit and ongoing communications. This code creates no operational database, email sender, CRM UI or migration job.

## Mount and explicit configuration

`runtime.mjs` mounts POST `/api/contact-intake` and GET `/api/contact-intake/config`. The shared Node listener is used by the Firebase v2 export in `index.cjs` and the Vite plugin. Vite development and preview always use disabled configuration, even if shell environment variables exist. The public config exposes only enabled/siteKey. Local POST returns 503 without forwarding. `firebase.intake-review.json` proposes exact API rewrites before the SPA fallback and a separate function codebase; the existing dirty firebase.json and Functions codebase remain untouched. This review configuration is NOT applied by the main deployment workflow. Do not deploy it wholesale without reconciling existing sites/functions/configuration.

The deployed runtime remains disabled unless CONTACT_INTAKE_ENABLED=true and every required setting is valid:

- CONTACT_CRM_ORIGIN: approved HTTPS origin, no path/query/userinfo/trailing slash.
- CONTACT_CRM_TENANT: approved MerkadAgency slug; never borrow another brand's tenant.
- CONTACT_CRM_SERVICE: service key approved by that tenant's mapper.
- CONTACT_ALLOWED_ORIGINS: comma-separated exact HTTPS public origins.
- CONTACT_TURNSTILE_SITE_KEY: public widget key for approved hostnames.
- CONTACT_CRM_API_KEY and CONTACT_TURNSTILE_SECRET: server secret bindings only. No VITE variables. No credentials were accessed or provisioned.

Keep routing and serialization stable for outstanding retries. Tenant and service cannot be supplied by the browser. Unknown payload properties (including tenant/consent/verified overrides) are rejected. Limits: 16KiB actual bytes, four required strings with length/email/timestamp checks, subject cannot contain line breaks, empty honeypot. Exact origin required; no CORS access enabled.

Turnstile token travels in a header, is not persisted, and must pass server-side Siteverify success, hostname and contact_intake action checks. Every retry needs a fresh token. Local tests stub Siteverify only. Runtime limits eight concurrent requests and eight attempts/minute per socket address, with at most 5,000 expiring hashed buckets. Raw addresses are not retained. Forwarded-IP headers are ignored. Proxy traffic may share a conservative bucket. This in-memory limiter resets on restart and is not distributed; trusted proxy addressing and edge-wide abuse policy remain rollout blockers. Function concurrency/maxInstances are bounded, but are not a substitute for that policy. Body and upstream verification/request sizes/timeouts are bounded; Firebase request timeout is 30s.

## Canonical contract and receipts

Inspected and tested committed source: central `merkad-agency-canvas` SHA `13f8ca7c309fb9dc3b53b3126db0364104a47c64`, route `/api/v1/tenants/{tenantSlug}/leads/intake`. Browser UUID is both Idempotency-Key and externalDocId. Subject and message map losslessly into message; sourceSystem=merkadagency_contact_v1; marketingConsent/smsConsent=false. Server sets turnstileVerified only after verification. No company/stack/urgency/budget/UTM qualification is invented.

Canonical executeIntake writes lead, contact, deal, activity, audit and idempotency in one Firestore transaction and resolves after commit. Adapter accepts only ok=true, created/duplicate_ignored and all three nonempty persisted IDs. Spam/HTML/partial receipt/HTTP-only success fails. Browser receives only code=persisted plus its submissionId. This means confirmed inquiry persistence under the inspected contract, not email delivery or promised response time.

Canonical-agent contract review was requested in the existing CRM tasks. The lead-capture task currently awaits approval; no final agent signoff has been received. Older Canvas-specific intake documentation names a different endpoint. Resolve the authoritative deployed contract, MerkadAgency tenant/service, tenant-scoped credential, authentication and notification semantics before enabling. Local source and emulator evidence do not establish deployed behavior.

## Same-tab retention

Before the first send, sessionStorage key `merkadagency.contact.pending.v1` stores `{key,body}`: UUID plus exact serialized name, email, subject, message, original submittedAt timestamp and empty honeypot. No credentials or Turnstile token are stored. Unsaved typing is in React memory only. It is not autosaved on each keystroke. If sessionStorage fails, no request is made. Same-tab reload restores attempted data. Fields freeze after an attempt; retries reuse identical bytes and key. Concurrent clicks are locked synchronously.

Confirmed success removes the stored draft. Discard requires a visible confirmation explaining that it clears only local data and does not cancel a received inquiry; a new submission after an uncertain result may duplicate it. Discard clears fields/key/storage and permits a fresh inquiry. Browser session restoration or a duplicated tab can retain/copy sessionStorage; tab closure is not a guaranteed secure erasure. The browser data is accessible to scripts on the same origin. Cross-device deduplication and global exactly-once delivery are not promised.

## Executed local evidence

`npm test`: frontend tests plus Node adapter/runtime/abuse tests. Network/provider behavior is mocked except a synthetic local HTTP mount. `npm run build`: local bundle only.

`CRM_SOURCE_DIR=/tmp/merkad-canonical-13f8ca7 FIRESTORE_EMULATOR_HOST=127.0.0.1:8685 npm run test:intake:integration`: six tests passed through actual local HTTP mounts, canonical validation/serialization/transaction code and the real Firestore emulator (demo-merkad-intake). Tests read committed lead/contact/deal documents before emitting a receipt. Cases: committed receipt; dropped connection after commit and exact-body/key retry; changed payload conflict; four concurrent identical requests; transaction abort with no partial writes; concurrent changed payload with one winner and one 409. Idempotency counts are checked too.

Reproduce with an archive of the specified canonical commit, its installed dependencies, and Firestore emulator on 127.0.0.1:8685. `vitest.intake.config.ts` requires explicit source directory and exact emulator host. Only synthetic tenant/owner/contact/credential/verifier values are used. No notification worker or provider is invoked. The HTTP fixture replaces deployed authentication/tenant resolution, not persistence. Real CRM auth, deployed routing, Turnstile, consent/owner/SLA/notification outcomes and full qualification still need an approved development-tenant rollout test.

New function dependencies are pinned to firebase-functions 7.3.2 / firebase-admin 14.4.0. The export loads locally. Public npm audit after compatible fixes still reports two moderate transitive findings (gaxios/uuid); dependency/security review is a release blocker. Existing backend dependencies were not changed.
