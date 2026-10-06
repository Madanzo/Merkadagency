# Website-only release candidate — 6 October 2026

This addendum supersedes the older README's automatic deployment description, named proof review-state assumption and unthrottled performance scope. No deployment, merge or activation has been performed. CAM-265/266 remain In Review.

## One publication path

`.github/workflows/firebase-deploy.yml` is manual `workflow_dispatch` only, on main, with a full approved SHA checked for main ancestry. There is no push deployment trigger. Remove-and-rebuild npm deployment aliases were removed. Review and release both invoke the same build; `build:review` aliases `build`.

`node scripts/build-website.mjs` overrides both flags to literal false even when the caller supplies true, builds with Vite, generates the sitemap and runs `verify:website`. The verifier rejects known customer proof strings, intake bootstrap/Turnstile and analytics provider URLs, source maps and test harnesses. The build emits `website-release.json` and logs a sorted artifact SHA256. The verifier runs again as Hosting predeploy, without rebuilding. CI stores the built dist artifact before authenticating for release.

Hosting uses **firebase.website-review.json**, public directory **dist**, explicit site **merkadagency-dd2aa** in project **merkadagency-dd2aa**, live channel. No alias target is used; the explicit site prevents selection through a different active project. Only Hosting is deployed. Default firebase.json, Functions, rules and other website targets are not publication inputs. The environment name `website-production` is declared; required-reviewer protection has not been independently confirmed and must not be assumed.

Pushing this PR branch triggers only Website review checks. The other workflow has no push or pull-request trigger. Its manual job also requires the main ref. No manual release has been dispatched. External integrations outside the repository's workflows have not been independently inventoried.

## Rollback record (read-only)

Supported CLI read, 2026-10-06: `npx -y firebase-tools@latest hosting:channel:list --project merkadagency-dd2aa --site merkadagency-dd2aa --json`.

- Site/channel: merkadagency-dd2aa / live.
- Existing release: `1789080868216000`.
- Existing version: `5a85de4fce7c621b`, FINALIZED.
- Release time: `2026-09-10T22:54:28.216Z`.
- 16 files, 994190 bytes. This is a Hosting version, not a Git SHA.

Re-read immediately before an authorized release; stop if the live version changed and update the rollback record. Do not delete this retained version. Existing content has not been revalidated as meeting the new candidate's off-gate/proof policy; rollback restores the prior site, not necessarily this milestone's acceptance.

## Exact proposed procedure — DO NOT EXECUTE without release authorization

1. Approve APPROVAL.md, resolve or explicitly accept the remaining coverage limitations below, and assign Camilo Reyna (proposed, not yet accepted) as release/monitoring/rollback owner. Confirm service-account scope and `website-production` required reviewers separately. Confirm no external publication automation.
2. Review and authorize merging the exact candidate PR. Merging the proposed workflow does not publish automatically. Record the resulting full main commit SHA and passing **Website review checks** for that revision; if the merge produces a new SHA, validate that exact SHA before release.
3. In GitHub Actions select **Manual website-only release**, main branch, input that exact approved main SHA. Dispatch once. The sole publish command in that workflow is `npx -y firebase-tools@latest deploy --only hosting --config firebase.website-review.json --project merkadagency-dd2aa --non-interactive`. Do not separately run a local deployment. Save workflow run, artifact checksum and new Hosting release/version.
4. Verify HTTPS/custom domain, home, service, contact, book, privacy, terms, proof, deep-link refresh and mobile navigation. Fetch `/website-release.json`: both flags false and source matches approved SHA. Contact must have no fields or submit button and the approved mailto. No Turnstile/intake/analytics requests or false receipt. Proof paths must contain no customer material. Inspect console/network, broken assets, external referral targets and policy links. Do not send a customer message or book an appointment as a smoke test.
5. If a critical route/asset/contact failure, unapproved proof, or unintended activation appears, stop further release work. Authorized rollback command: `npx -y firebase-tools@latest hosting:clone merkadagency-dd2aa:@5a85de4fce7c621b merkadagency-dd2aa:live --project merkadagency-dd2aa`. Alternatively select that recorded release's **Roll back** action in Firebase Hosting release history. This creates a new release of the old version; it does not revert Git. Re-read Hosting live metadata and repeat route/security checks. Neither command was executed here.

Official procedure: https://firebase.google.com/docs/hosting/manage-hosting-resources#roll-back .

Monitoring proposal: owner checks immediately and at 24 hours/7 days; investigate route failures, accidental activation, inquiry fallback problems and permission complaints. Field Core Web Vitals belong to post-release observation (e.g. available CrUX/Search Console data), not a pre-release pass. No new analytics activation is part of monitoring.

## Practical acceptance

- Flags-OFF artifact passed even with both caller flags set true: 50 files, initial local checksum `c58b4b2429ac9145619ef13aeb1e9adc4b67a396af9bb9d593ee01d1a5dc636e`. CI source marker changes the checksum; use that run's recorded value for release.
- Cold first-party mobile-width lab: fresh localhost:8094 origin, 390×844 iframe, no-store, gzip, shared 200000 bytes/s (1.6 Mbps), 150ms per response. Home FCP 1152ms / LCP 1572ms / CLS 0.008423; contact FCP 1216ms / LCP 1532ms / CLS 0.008423. One run each. No CPU shaping, external fonts/logo not shaped and may have cached state. This is not a complete simulated-phone benchmark or field CWV. Raw sanitized measurements: cold-mobile-audit.json and cold-contact-audit.json.
- Both updated scans: zero axe WCAG A/AA violations. Home contrast has four overlap-related incomplete nodes; prior manual contrast evidence remains, not an automated pass for those nodes.
- Beyond scans: mobile menu Enter opens, Escape closes and focus returns; no horizontal overflow at 390px; desktop skip link reaches main-content with visible outline; Services keyboard opens submenu. Disabled contact shows zero input/select/textarea fields and zero submit buttons, approved mailto, explicit no-send explanation. Referrals point separately to Canvas/Phantom with no form data; no external inquiry sent. Updated proof direct legacy path renders generic copy with no named association. Existing qualification validation/feedback fixtures and evidence are preserved.
- Reduced-motion component test: both illustrations do not play, no pulse or playback button; explanations remain selectable, arrow keys select next inquiry step. CSS reduced-motion rules disable animation/transition/smooth scrolling. Real browser OS-preference toggling is unavailable through the current control surface, so it is not claimed tested.
- Browser inventory exposes only Codex IAB and MCP Apps. No Firefox/WebKit connection is available. No physical iOS Safari/Android Chrome devices, touch/screen rotation verification, VoiceOver/NVDA/JAWS control, full CPU-throttled mobile run or browser text-only zoom test was available. These remain explicit coverage gaps for owner acceptance or separate testing, not successful results.
- Resource observations on home and disabled contact contain no analytics/intake/Turnstile requests. Static verifier independently rejects known bootstrap/provider URLs. Delivery requests to Google Fonts and Firebase image storage are disclosed by the policy and are not labeled analytics.
- Public proof: named case associations were removed from pages, route metadata and blog. A single legacy case-study email preview embedded in a public JS bundle was replaced with a withheld placeholder; no email sending behavior changed. No broader admin/signing cleanup. Public assets contain favicon and generic planning worksheets, no client galleries/PDFs. Artifact check includes all emitted JS, including lazy chunks. Noindex is not relied on for withholding. Historical repository source is not access-controlled by website routing; no claim is made to erase Git history.
- Local checks: 42 frontend tests and 15 isolated Node intake tests pass. One initial Node run was denied loopback binding by the sandbox; the authorized loopback rerun passed all 15. TypeScript and scoped lint pass.
- Full lint remains **49 errors / 10 warnings**, existing debt; no attempt to fix unrelated admin/signing work. TypeScript, scoped lint and test results are recorded in PR CI.

## Unchanged activation boundaries

CAM-269's website implementation is separate from CRM-owned deployed contract/configuration confirmation (CAM-220/CAM-214), then production activation/validation. No proposal is live evidence. CAM-223 remains historically complete. Retain its successful reference-only request. The previously rejected metadata-rich Linear action remains blocked because automatic review identified disclosure of non-public configuration metadata; no repost or alternate-channel workaround occurred.

Before intake activation: authenticated deployed configuration and durable synthetic receipt; server-only secrets; real Turnstile hostname/action/expiry/failure verification; origin/body/honeypot limits; trusted proxy and distributed abuse controls; no duplicate writes/notifications on retry; monitoring/rollback. Analytics consent, provider settings, shared event schema and revenue joins remain a separate activation gate. This release changes neither.
