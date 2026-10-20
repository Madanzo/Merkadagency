# Informational patch acceptance — October 20

Technical follow-up: see PRIVATE-BOUNDARY.md and RELEASE-GATES.md. The original source-parity hold below is historical: current live bytes were captured, safe assets preserved, seven retained function bodies/direct dependencies/configuration compared, and the bounded migration covered by 32 paired synthetic tests. Six release-gate fixtures were added. No actual merge/dispatch/publication or real private transaction is claimed.

This evidence applies to `codex/seo-informational-oct20`, not PR #1's design or any deployed website. Exact head/artifact/hosted-run results are recorded in the issue and final handoff after pushing. Builds require a clean checkout, pin manifest source to git HEAD, reject GITHUB_SHA mismatch, forcibly disable intake/analytics and verify both normal and compatible fallback files.

## Completed local checks

- Chromium 149.0.7827.55 and Firefox 151.0: **31 named checks each**, six public routes at 320/390/844-landscape/1280 pixels. 48 axe scans, zero violations **and zero incomplete items**. Six pages remain readable with JavaScript disabled.
- Keyboard skip link moves focus to main; native question disclosures open/close with Enter; visible focus rules exist. Main/heading/link structure and desktop/mobile screenshots reviewed. 200% root-font-size surrogate at 390 pixels passes all six routes after correcting an observed service-heading overflow; initial failure is retained in `browser-failure.txt`. This is not a claim of native browser text-only zoom coverage.
- 140 observed requests across both matrices: all GETs to the local preview origin, zero analytics/intake/calendar/Turnstile or external requests, zero HTTP/resource/page exceptions. No usable form or false success. Mailto target is the approved email; no email was sent.
- Actual Firebase Hosting emulator: service hub 301, legacy book 302, slash and `.html` canonical redirects, safe retired proof/industry/API 404; private login/sign paths return the same noindex static private shell without running a contract. Preview HTML and successful-page X-Robots-Tag are noindex. No public JavaScript, third-party font, image, embed or motion is required.
- Sitemap has exactly the six approved informational URLs. Initial HTML has substantive text, unique titles/descriptions, one self canonical and matching Organization/Service/BreadcrumbList JSON-LD; every internal link resolves to a retained page. No unsupported client files or legacy public bundles are copied. Verifier scans all emitted files, including private assets, for known unapproved customer references, analytics-provider URLs, source maps and private-key patterns.
- Existing frontend tests: 5 pass (2 files). App TypeScript and scoped lint pass. Five additional static-publication tests cover initial HTML, compatible fallback, retired assets and manual/main workflow separation. Full-repo cleanup is not part of this patch; PR #1's existing 49 lint errors / 10 warnings are preserved as debt.

## Coverage that is not established

- WebKit runner is absent (`webkit-2311/pw_run.sh`); earlier installation attempts establish this macOS 13 environment is unsupported. **No Safari/WebKit pass claimed.** No physical iPhone/Android, actual touch/rotation, native zoom UI, OS reduced-motion setting, VoiceOver, TalkBack, NVDA or JAWS review. The public pages have no animated behavior to suppress; matrix contexts set prefers-reduced-motion=reduce, which is emulation only.
- Browser automation and axe do not establish WCAG conformance. The short phone checklist must be completed or the specific remaining gaps explicitly accepted by Camilo; no blanket acceptance is inferred.
- Private app static routing/build/type checks are covered, but authenticated admin and real signing/payment/backend operations were not exercised. No customer record or contract was submitted. Whole-bundle/provider parity with the old manually deployed private app is not claimed; the bounded component migration is now independently checked as described in PRIVATE-BOUNDARY.md; fallback uses the same private bundle and cannot fix that regression risk.
- Local Hosting emulator is not a production/CDN assertion. TLS, domain redirect, publication headers/routes and delivery must be reread after an authorized release. No public preview channel was deployed.
- Final isolated cold-load samples: homepage LCP 468/468/532 ms (median 468); service 508/492/996 ms (median 508); guide 1236/788/1028 ms (median 1028). CLS was 0 in all nine samples. Fresh 390×844 DPR1 contexts, CPU 4×, 150 ms latency, 1.6 Mbps down / 750 Kbps up; cache cleared before each navigation and enabled within-page. These are laboratory results only (explicit CPU/network/cache conditions in `cold-performance.json`). No production field Core Web Vitals result is claimed. Search Console access is unavailable; there is no indexing, ranking, query, traffic, qualified-lead, revenue or AI-citation outcome.

## Separate outcome record

Implemented / locally tested: yes, limited as above. Hosted CI: exact-source evidence linked in Linear after completion. Merged: no. Deployed: no. Production verification of candidate: not performed. Indexing submission/outcome: not performed. Intake/analytics activation: no. CAM-257 and full CAM-272 remain open; CAM-265/266 remain In Review.

## Lint baseline clarification

The historical PR#1 record remains 49 errors / 10 warnings. This independent main-based PR#2 branch reports **54 errors / 10 warnings**, which are **identical finding-by-finding to its pre-follow-up head0950f66** using the same locked ESLint toolchain. No error/warning was added by this technical follow-up. App/private TypeScript and affected scoped lint pass. No unrelated admin/signing cleanup was performed.
