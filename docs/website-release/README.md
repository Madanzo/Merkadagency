> **Current candidate:** See [release addendum](RELEASE.md) and [approval sheet](APPROVAL.md). They supersede deployment, proof and performance statements below.

# Website-only release review — 2026-10-06

This candidate preserves the approved design and public implementation from local `ce8e9d99bdccf9547a4059dd3b151be21438ff3b`. Intake and analytics are disabled. It is a review candidate, not a production release or activation approval.

The original `codex/website-intake-review` history, earlier evidence and unrelated working changes remain local. A clean candidate branch is based on remote main `ce3a0aa`; it excludes historical coordination documents, deployment proposals and unrelated admin, signing, Functions, rules, indexes and Hosting changes. One existing design screenshot remains because the development-only art comparison imports it. No Canvas or Phantom website was changed.

## Review and reproduction

- `npm ci` using `.nvmrc` (Node 22.19.0).
- `npm test`: 41 frontend tests and 15 Node intake tests passed in the isolated candidate.
- `npx tsc --noEmit -p tsconfig.app.json`: passed.
- `npm run lint:website`: passed. Full repository lint still has 49 errors and 10 warnings; every error file is unchanged from main. These are principally existing admin/signing types. They are not concealed by the website check.
- `npm run build:review`: passed. This explicitly sets both public activation flags false. The default absence of either flag also fails closed.
- `npm run preview -- --host 127.0.0.1 --port 8092`: local review at http://localhost:8092/.
- Review workflow `.github/workflows/website-review.yml` runs tests, typecheck, scoped lint and disabled build. Read-only repository permission; no credentials, deploy step or production environment.

Existing production workflow was fetched from remote main and inspected: only `push` to `main` triggers its live deployment. The candidate branch and PR do not match that trigger. Do not merge this PR as a routine review action: a main push currently deploys. No assertion is made about inaccessible external webhooks.

## Completed acceptance and limits

| Area | Actual result |
| --- | --- |
| Desktop/mobile | Embedded browser at 1440×1000 and 390×844; home, CRM service, proof and contact screenshots. Home/contact also checked at 320px: no horizontal overflow. |
| Navigation | Desktop Tab opens service links; Escape closes dropdown and returns focus to its parent. Mobile menu scrolls within the viewport, links have at least 44px height, Escape returns focus, and selecting a route closes the menu. Skip link focuses the main landmark. |
| Contact OFF | Contact and audit routes contain zero inputs/selects/textareas and no submit action. Owner-approved `camiloreyna@merkadagency.com` opens the visitor's email app. The website does not send mail or claim receipt. Earlier pending attempts are not automatically replayed, erased or declared cancelled. |
| Qualification | Separate localhost-only synthetic fixture: name/email/subject/message validation, optional company/current tools/budget/timeline/language, keyboard order, ambiguous failure, locked retry values, focused error and focused confirmed receipt passed. Invalid fields made zero fixture calls. Failure then retry used identical body bytes. No live CRM or verification provider was used. |
| Automated accessibility | axe-core 4.10.3, WCAG 2 A/AA and 2.1 AA: zero violations on home, contact, CRM service, case-study review surface, privacy and service-information pages. JSON evidence accompanies this report. |
| Manual accessibility | Home label/background and contact panel/button contrast exceptions reviewed against rendered colors; button ratio 6.48:1, muted panel text 9.64:1, conceptual labels above 12:1. Service diagram caption has high contrast against its dark gradient. Pause control stops animation; visible focus and heading order checked. Reduced-motion source safeguards remain; OS preference and assistive-technology testing across browsers remain outstanding. Automated scans do not establish complete WCAG conformance. |
| Analytics OFF | Browser resource observations for home/contact contain no GA, GTM, Clarity, Turnstile or contact-intake requests. Boot scripts do not initialize optional analytics. Calendar SDK stays unloaded until the visitor chooses it. Google Fonts and Firebase images remain resource requests, as described in the notice. |
| Referral boundary | Canvas/Phantom links preserve static referral campaign codes, explicitly leave this website, and do not submit form details. Both destination origins returned HTTPS 200 on Oct 6. This is not proof of downstream CRM attribution. |
| Policy/copy | Removed unsupported generic retention/security/guarantee language from mounted notices. Copy separates website projects, CRM testing and human-reviewed AI pilot; demos are illustrative. No invented testimonials, customer outcomes, pricing or permissions. Notices require owner/legal approval before publication. |
| Indexing | Canonical/route metadata and sitemap checks pass. Unapproved proof and article routes remain reachable review states, noindex and excluded from sitemap. No Search Console verification or production structured-data validation claimed. |
| Performance | Final unthrottled, warm-cache local iframe observation: home FCP 196ms, LCP 364ms, CLS 0.00417. About 1.78 MB decoded resources observed; this is not cold-network transfer size. Lossless WebP artwork is 1,104,702 bytes versus 1,522,729 PNG bytes, with decoded RGBA pixels checked identical. Main entry is about 112 KB gzip; lazy admin bundle remains large and is not loaded by public home/contact. |
| Production access | Oct 6 read-only checks: apex HTTPS 200; www HTTPS 301 to apex, then 200. Existing responses include nosniff, SAMEORIGIN and strict-origin-when-cross-origin. These checks do not deploy or verify candidate headers. |

Remaining technical acceptance: Safari/Firefox/physical-device and screen-reader coverage; throttled cold-load measurements and production Core Web Vitals/INP; production candidate headers/redirects and rollback rehearsal. Build warnings remain for stale Browserslist data, legacy noise assets and large lazy admin chunks. No universal browser or performance certification is claimed.

## Security and CAM-269 handoff

[CAM-269](https://linear.app/camiloreynar/issue/CAM-269/connect-the-merkadagency-website-to-tenant-safe-crm-intake) now explicitly depends on Platform [CAM-220](https://linear.app/camiloreynar/issue/CAM-220/lead-intake-811-settings-integrations-website-leads), with [CAM-214](https://linear.app/camiloreynar/issue/CAM-214/lead-intake-211-per-tenant-api-credentials-platform-capability) supporting credential verification. Existing relations are preserved. The existing CRM intake agent confirmed on Oct 6 that the agreement is recorded, but current deployed configuration and authenticated intake remain unverified. No shared CRM behavior was changed.

**Website-owned implementation:** build-time OFF gate; no editable form before verified availability; bounded configuration/script wait; token expiry/failure clears authorization; strict same-origin input boundary, honeypot, byte limits, server verification of provider success/hostname/action, fail-closed malformed/oversized provider results, concurrency cap, bounded in-memory rate limiter, strict persisted receipt and exact key/body retries. Credentials are server-only, never VITE configuration or browser payload. No credentials were read or included in this report.

**CRM-owned confirmation:** compare every field of the existing agreement with deployed configuration, including tenant, service, responsible owner and membership, entry stage, source and notification ownership. Return pass/fail attestation plus deployment revision, not configuration values. Confirm credential tenant/scope/revocation, accepted schema, persistence and audit behavior, next action/SLA and notification result. A source implementation, historical agreement, reported release or successful GET is not this evidence. The responsible owner's identity and membership validity remain unverified.

**Before intake activation:** securely provision/bind approved credentials; verify real Turnstile keys, hostname/action, expiry/replay and provider-outage behavior; validate deployed origin/header/body limits. Current socket-address buckets can group callers behind a proxy and are process-local, not a distributed abuse guarantee. A trusted edge/proxy policy and cross-instance controls must be verified. Separately authorize controlled synthetic persistence, duplicate/concurrent retry and response-loss tests, tenant isolation, audit/owner/stage, notification suppression and rollback. No production test, secret provisioning, deployment or activation was performed.

CAM-223 remains Done for its historical Canvas completion. The successful reference-only request, comment `5be344ba-18dd-462e-b5b5-a59d92a7c9f1`, is retained. An earlier metadata-rich configuration comment was rejected by automatic approval review because it would disclose non-public configuration metadata to Linear. That blocked metadata was not reposted or included in this candidate. The Oct 6 non-sensitive dependency handoff is comment `4fe49635-f113-46af-85f7-2dc11b02922e` on CAM-269.

## Issue acceptance and commercial decisions

- CAM-265/266 stay **In Review**. Approved visual system, reused public components, qualification states and local evidence are implemented. Final product/content review, cross-brand reuse comparison, complete supported-browser coverage and staging/production acceptance are not all met.
- CAM-253: approved headline/CTA retained. Still decide primary ICP, secondary segments, buying triggers/disqualifiers, systems-review deliverables, free versus paid terms, pricing/payment, support, cancellation/refund and IP/commercial handoff. This candidate makes no new commercial promise.
- CAM-258: current page inventory and route metadata preserve the approved structure; home → service/method → contact is the primary path, email is the disabled-intake endpoint, scheduling is a separate explicit provider choice. Proof remains an honest review state. Final industry specificity and conversion-map approval remain.
- CAM-251: no approved Canvas/Phantom client narrative, logo/screenshot usage permission, metric definition/evidence window, attribution permission or testimonial permission was supplied. Publish no named customer results until permission and supporting evidence exist. The plan explicitly avoids unsupported case studies.
- CAM-271: local allowlisted event seams and inquiry attribution mapping exist; they transmit no analytics. Shared event vocabulary approval, consent/withdrawal, provider masking/retention, offer/industry identifiers and joins through qualification/proposal/deposit/booked revenue remain unaccepted. No revenue attribution is claimed.
- CAM-272 remains open: this review is the website-only subset, not the full production intake/analytics launch gate. Policy owner must confirm retention/deletion handling, controller/jurisdiction and operational response ownership. The email fallback decision is resolved; it is not a test of mailbox deliverability.

## Three separate release proposals

1. **Website-only publication:** review this exact candidate and screenshots; approve final public copy/policy and the contact fallback; complete remaining browser/performance checks and assign monitoring/rollback owner. Use `build:review` and the static-only `firebase.website-review.json` after separately verifying the correct Hosting target. Publish only Hosting, with intake and analytics OFF; no Functions/rules/CRM/Canvas/Phantom changes. Record the current live release for rollback first. Main currently auto-deploys, so merge/publication requires explicit authorization. On a broken page/contact link or accidental network activation, revert to the recorded Hosting release and keep both gates off.
2. **Intake activation:** only after CAM-220/CAM-214 confirmation and website security prerequisites above; approve a controlled synthetic test window and rollback criteria, verify actual durable records/no notifications, then decide whether to enable general intake. This is a separate change and approval.
3. **Analytics activation:** approve shared definitions, consent UI/withdrawal, masking and retention, sensitive-route exclusions and CRM outcome joins first. Run isolated provider debug tests, then separately approve production activation. Do not infer booked revenue from form submission or email clicks.

After website publication: day 1 inspect public routes, mailbox fallback and error reports; day 7 review inquiry quality and search/indexing observations without inventing conversion rates; day 30 review search visibility, qualification friction and approved CRM pipeline evidence. Quantitative funnel and revenue reporting starts only after its separate consent/measurement gate.

## Screenshots

Normal website: [desktop](home-desktop.jpg), [mobile](home-mobile.jpg). Disabled contact: [desktop](contact-desktop.jpg), [mobile](contact-mobile.jpg). CRM service: [desktop](service-desktop.jpg), [mobile](service-mobile.jpg). Proof review state: [desktop](proof-desktop.jpg), [mobile](proof-mobile.jpg).

Synthetic-only qualification evidence: [desktop fields](qualification-desktop-fixture.jpg), [mobile uncertain response](qualification-error-fixture.jpg), [mobile synthetic receipt](qualification-success-fixture.jpg). These fixture screenshots do not represent enabled production intake.
