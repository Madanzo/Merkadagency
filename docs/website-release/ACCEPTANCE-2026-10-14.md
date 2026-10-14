# Informational publication acceptance — 14 October 2026

This report supersedes earlier untested-browser and proposed-owner notes. PR #1's baseline `7e5e01a6d9c3b6a5df04c6d0e50767ddbddea696` is preserved in history. Changes are limited to two demonstrated defects: horizontal scrolling with enlarged text, and slow cold discovery/delivery of the existing hero image. No merge, deployment, workflow/credential/IAM change, activation, production submission or customer message occurred.

## Scope and review evidence

Website development and email-only contact remain the public offer. Camilo's privacy, monitoring and rollback responsibilities stand. The confirmed free-CRM start/eligibility/no-auto-renewal rules are retained; the one-user/restricted-package suggestions remain unapproved. The withheld promotion and CAM-269 activation dependencies do not block the informational website without them.

Fixes: long email/footer text wraps, social links can wrap at enlarged text sizes, the original artwork has lossless 480/640/960px derivatives, and only the homepage preloads its selected derivative. The homepage renders from the initial module rather than waiting for a lazy module. Original imagery, copy and other lazy routes are retained. The build resolves Vite 5's unhandled `imagesrcset` asset paths by matching emitted bytes; the verifier rejects unresolved `/src/` paths. No default Hosting, Functions, rules, admin or signing behavior was modified.

[Normal homepage screenshot](acceptance-2026-10-14/home-desktop.jpg) · [Disabled email contact](acceptance-2026-10-14/chromium-contact.png) · [Original reflow defect](acceptance-2026-10-14/before-reflow.png) · [Browser results](acceptance-2026-10-14/browser-results.json) · [Cold performance samples](acceptance-2026-10-14/cold-performance.json) · [Enlarged-text Chromium](acceptance-2026-10-14/chromium-contact-text200.png) · [Enlarged-text Firefox](acceptance-2026-10-14/firefox-contact-text200.png).

## Coverage matrix

| Check | Current evidence | Limit |
|---|---|---|
| Chromium 149 / Firefox 151 | 41 checks each: seven public routes, navigation/keyboard focus, 320/390px portrait and 844px landscape reflow, legacy `/book` refresh, email-only contact, no scheduler | Automated desktop engines, not physical phones |
| Accessibility scans | Seven routes per engine; zero axe WCAG A/AA violations | Automated scans do not certify screen-reader usability |
| Manual accessibility behavior | Skip link focuses main; desktop menu exposes website destination; mobile Enter/Escape restores menu-button focus; explanatory diagram controls work with reduced motion | No VoiceOver/NVDA/JAWS session |
| Reduced motion | Browser preference emulation: illustrations stop, pulse/playback disappear, explanations remain selectable | Actual phone/OS preference still needs owner observation |
| Enlarged text | 200% root font at 390px, strict no-horizontal-scroll assertion; before/after defect evidence retained locally | Controlled text-resize surrogate; not native browser text-only zoom UI |
| Contrast | Label text `#e9e6ee` against conservative `#25252b` background bound: 12.35:1. White CTA on `#7133df`: 6.48:1. Secondary text on page: 10.07:1 | Overlapping illustration labels still produce automated contrast-incomplete results; decorative lines excluded |
| Disabled features | Tested routes: zero intake/Turnstile/analytics/calendar requests, zero mutation requests; no contact fields; approved mailto | No CRM/provider activation or production-intake test |
| WebKit / Safari | Current Playwright WebKit install explicitly rejects this host's macOS 13 | WebKit/iOS Safari unverified; cannot call Firefox or Chromium a substitute |
| Physical devices / assistive tech | No physical iOS/Android/touch/rotation or screen-reader result inferred | Camilo must test or explicitly accept each remaining limitation |

Cold-load lab uses fresh contexts, cache cleared before navigation, normal within-page preload reuse, 390×844 DPR1/touch/mobile, 4× CPU, 150ms latency, 200000 bytes/sec down and 93750 bytes/sec up. All origins are shaped. Three samples per route are recorded; this is local static serving, not Firebase CDN performance or field Core Web Vitals. An earlier diagnostic disabled all caching and downloaded the preload twice; it is retained locally but is not labeled a normal cold-user result. Production field CWV belongs to post-release observation.

Final lab: homepage LCP 3.108/2.384/2.516s (median **2.516s**), CLS 0.0158; contact LCP 1.676/1.856/1.672s (median **1.676s**), CLS 0.00051. Homepage is borderline against a 2.5s “good” LCP guideline; no field pass or universal device guarantee is claimed. Owner review must explicitly accept this lab evidence or request further optimization. Main entry gzip grows from about 112KB to 120KB while eliminating the homepage's second module round trip. CI run identities are recorded in the PR and Linear checkpoint for this exact follow-up commit. Required local checks passed: 42 frontend and 15 isolated intake tests, app TypeScript, scoped lint and forced-OFF build. Current artifact: 42 files, local sorted SHA256 `dbb7218de08786ae46ac3ce335484b6557a8ed340cdaecaf100494602eb219ed`; CI/release source markers change the checksum, so record that run’s artifact hash separately. Required checks remain tests, app TypeScript, scoped lint and forced-OFF build. Full repository lint retains the existing 49-error debt outside this milestone.

## Reproduce the isolated checks

The committed `browser-checks.cjs` and `performance-checks.cjs` use optional isolated tooling, not production dependencies. Install Playwright 1.61.0 and axe-core 4.10.3 into a temporary tooling directory, install its Chromium/Firefox engines, and serve the forced-OFF build on port 8095. Set `NODE_PATH` to that tooling directory's node_modules and optionally `MERKAD_PREVIEW_URL` / `MERKAD_EVIDENCE_DIR`; run each script with Node. Run performance alone, without concurrent browser suites. WebKit 1.61's supported installer rejects macOS 13; do not relabel an old unsupported runtime as current Safari coverage.

## Publication procedure and refreshed rollback

Reviewed `.github/workflows/website-review.yml`: push to main runs the required checks on that resulting SHA. Passing PR-head checks cannot validate a different merge SHA. Reviewed `.github/workflows/firebase-deploy.yml`: only manual dispatch on main, full approved SHA validation plus main ancestry, repeated tests/type/lint/build, artifact upload, authentication and a single Hosting publish. No push deployment or second publication path was added. GitHub reports no active repository webhooks.

Target: `firebase.website-review.json`, directory `dist`, explicit site/project `merkadagency-dd2aa`, live channel. This config contains only Hosting. Both flags are forced OFF and artifact verification runs again before upload without rebuilding. Do not deploy through default firebase.json or run a second local deployment.

Control limitation verified read-only: the named `website-production` environment does not exist. The repository has a separate `Production` environment with no protection rules. No enforced environment reviewer gate or main branch protection is claimed. Do not dispatch without Camilo's explicit approval. Setting additional protections requires a separately approved settings change; none was made here. The job's authentication must succeed before publication; secret contents and service-account privilege were not inspected.

Refreshed read-only on 14 October using supported `hosting:channel:list`: existing release `1789080868216000`, version `5a85de4fce7c621b` FINALIZED, release time `2026-09-10T22:54:28.216Z`. Apex HTTPS returned 200; www HTTPS returned 301 to apex with certificate validation enabled. Current site retains nosniff, SAMEORIGIN and referrer headers. These describe the current old release, not this undeployed candidate.

After separate approval: merge the reviewed candidate, wait for Website review checks on the exact resulting main SHA, refresh the live rollback record again, and manually dispatch the one release workflow for that approved SHA. Verify its manifest/source, public routes/deep links, email fallback, proof withholding, disabled-network behavior, headers and errors. Camilo oversees monitoring and decides rollback; the agent performs only authorized technical checks.

Recorded rollback command, **not executed**: `npx -y firebase-tools@latest hosting:clone merkadagency-dd2aa:@5a85de4fce7c621b merkadagency-dd2aa:live --project merkadagency-dd2aa`. Re-read live metadata and repeat public-route checks afterward. Restoring that old site does not necessarily preserve this candidate's disabled-feature/proof-withholding behavior. Do not describe rollback as preserving those guarantees.

## Remaining owner gate

Use the phone checklist below; record actual results or accept limitations explicitly. Then give one informational publication approval. No separate service commercial terms, CRM promotion approval, intake activation or analytics activation is required to publish without those features. CAM-265/266 stay In Review and CAM-272 remains open through release acceptance.

Phone: same Wi-Fi as the awake Mac, open `http://192.168.0.84:8095/` (HTTP, not HTTPS). If the Mac's LAN address changes, read its current address and use port 8095; the local preview must remain running. `localhost` on a phone points to the phone. This local preview is not internet publication.

1. Menu → Website development → Contact → Back. Check portrait/landscape, enlarged text and no sideways scrolling.
2. Tap email; confirm `camiloreyna@merkadagency.com`; cancel without sending. `/book` must also be email-only, with no calendar or warning.
3. Enable Reduce Motion; check still illustrations and usable explanations. Use VoiceOver/TalkBack if available and record issues.
4. Open privacy/terms and portfolio; confirm the privacy owner and no customer material. Record phone, OS/browser and pass/fail/not-tested for each item.
