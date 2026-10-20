# Review decision — informational website only

**Prepared, not authorized or deployed.** Owner: Camilo Reyna (wording/release approval, privacy requests, monitoring oversight, rollback decision). Agent: technical checks within authorized scope. No CRM, analytics, payment or messaging activation.

## Public wording and URL diff to approve

The full exact public wording and metadata is in [website/content.mjs](../../website/content.mjs); shared presentation is [website/site.css](../../website/site.css). This is a simple static informational layout in the existing dark/purple palette, not PR #1's unresolved redesign. Publication would replace the **current live public experience**, including its older analytics and calendar/form paths, with this explicitly reviewed email-only experience. It is more than a metadata-only correction.

| URL | Candidate public text / change |
|---|---|
| `/` | H1: “A clear website starts with a clear plan.” Intro: “MerkadAgency offers website development. Start with the pages your customers need, the information they are looking for, and a practical way to contact your business.” Links to service and guide. Removes unsupported AI/growth/results/proof offers. |
| `/services/website-development` | New functional URL (live currently returns the generic SPA shell). H1: “Website development built around your business.” Concrete scope/process, existing-site planning, content ownership, testing and handover. |
| `/resources/website-brief` | New ungated resource. H1: “Write a website brief before you redesign.” Seven practical sections; no overlap with a second redesign landing page. |
| `/contact` | H1: “Tell Camilo about your website.” Exact CTA: “Email Camilo about your website” → `mailto:camiloreyna@merkadagency.com`. Copyable address; no form or false success. |
| `/legal/privacy` | Factual no-form/no-analytics notice, Hosting delivery and email processing; Camilo handles privacy requests at the approved email. Exact draft requires owner review; no invented retention period or jurisdiction. |
| `/legal/terms` | Project scope/cost/timing require a separate agreement; no delivery, ranking, lead or revenue guarantee. |
| `/services` | 301 → `/services/website-development`; consolidates service intent. |
| `/book` | 302 → `/contact`; no calendar, embed or public calendar-mismatch warning. |
| old AI/CRM/SEO/advertising, industry, results/portfolio/case-study, about/method/blog and lead-magnet/resource URLs | 404 with safe navigation and noindex; absent from sitemap and artifact. No blanket irrelevant homepage redirects. This candidate withholds material from its new public files; it cannot revoke prior downloads or browser caches. Review the complete old-sitemap URL disposition in `evidence/url-diff.json` before publication. No search data is available to quantify migration impact. |
| `/admin`, `/admin/login`, `/sign/:contractId` | Explicit static private-app shell rewrites preserve repository-main implementation. Existing auth/dashboard/signing business logic is untouched; no authenticated or real-contract operation is tested or submitted. See provenance limitation below. |

Website development remains the only offered service; no pricing/turnaround promise, customer proof or CRM promotion is added. Free-CRM start/eligibility/no-automatic-paid-renewal decisions stand in prior records. Package features/seats/limits/expiry/export terms remain unapproved proposals and are not publication blockers without the promotion.

## Exact source and live baseline

Read-only October 20 Hosting listing: project/site `merkadagency-dd2aa`, live release `1789080868216000`, version `5a85de4fce7c621b`, FINALIZED, September 10 2026 22:54:28.216 UTC. Apex HTML SHA-256 `30302ca010672fbb7d84630f344d979e116ab69df9e0fdd685ddf92be2d52390` (2,098 bytes). It contains legacy claims, GA script and an empty React root; service/contact initial HTML is identical. Live primary JS SHA-256 `d54443722c1a8e3eeb7877ffd9503d84a86b4b2767c7b7183ed9ceec51913a9a`; CSS `1507e06bfaf94c67ae84422a81bd98654b51dc31e285c0681ee647d9d4858154`.

Repository main is `ce3a0aaca5d46fcf9a3eb28f7739491014bd325a`. Its last successful hosted deploy run is 22607403164 (March 3), which does **not** prove the September 10 manual Hosting version. A locked `npm ci` build of main did not match the live JS/CSS names or HTML hash. Therefore the live artifact is verified, but **a Git SHA for that exact live release is not established**. Do not call main an exact-source reproduction of live. This candidate has a separately pinned Git source/artifact; private app packaging is based on repository main, not verified deployed private-source parity. Resolve provenance/approve that narrowly described private-shell migration before production, or revise the release boundary. This is a precise outstanding release concern, not CRM work.

Original root changes and all PR #1 evidence remain untouched. One old customer-story email preview is replaced with a withholding notice because its strings would otherwise be publicly downloadable in the private bundle; no email sending or sequence scheduling logic changes. Shared Firebase analytics initialization is gated behind the forced-OFF flag and loaded dynamically so its SDK/provider URL does not enter this artifact. No other admin/signing cleanup. PR #1's 49 lint errors/10 warnings remain recorded existing debt; that milestone is not expanded here.

## Dedicated Hosting scope

Sole proposed production path: `.github/workflows/firebase-deploy.yml`, **manual workflow_dispatch on main only**. It replaces the old main-push deployment trigger, avoiding an automatic second release. New review-branch pushes cannot deploy. `seo-review.yml` validates push on main and the SEO branch, plus pull requests; no deployment step.

The publication command is:

```
npx -y firebase-tools@latest deploy --only hosting --config firebase.seo.json --project merkadagency-dd2aa --non-interactive
```

The config has exactly one top-level key, `hosting`; explicit `site: merkadagency-dd2aa`, `public: dist-site`, clean URLs and no trailing slash. **No alias target**. No `hosting.source`, frameworks backend, function/run/API rewrites, backend predeploy hook, Functions/Firestore/Storage block or root `firebase.json` loading. Thus the artifact is static files and the command cannot select a framework backend through this configuration. Its only predeploy hook verifies the already built artifact, without rebuilding it. It preserves private-route static rewrites and retires the catch-all SPA rewrite for public URLs.

## Proposed release sequence — do not execute yet

1. Resolve the provenance/private-shell concern above; review exact wording/URL retirement, browser results and stated limitations. Camilo completes the short phone checklist or explicitly accepts its specific remaining coverage gaps. Obtain one approval for this concrete candidate only.
2. When merge is separately authorized, merge the reviewed patch. Record actual full **final main SHA**; never substitute the PR head or its synthetic merge revision.
3. Wait for `Informational website checks` **push/main** at that exact SHA, recording workflow path, event, run, job and conclusions. Pull-request success alone is insufficient. If main advanced or a required check is unavailable, stop and validate the actual revision before publication.
4. Separately authorized dispatcher runs `Manual informational website release` on main with full `approved_sha`, mode `candidate`. Workflow requires that SHA to equal current origin/main, repeats npm ci/tests/types/scoped lint/forced-OFF build/static acceptance at that checked-out SHA, archives `dist-site` and `dist-rollback`, then authenticates using the existing approved secret and publishes only the dedicated Hosting config. No dispatch has occurred.
5. Before the deploy step, record the archived manifest, sorted file checksum and fallback checksum from the exact source/build. The build rejects GITHUB_SHA/source mismatch and hard-sets both flags false even if caller passes true. No production permission/IAM modification is proposed.
6. After an approved deployment, agent reads live release/version/source manifest, HTTP statuses, canonical/robots/sitemap, CSS and all internal links; checks email-only/no-calendar/no-form, no analytics/intake requests, retired proof paths/assets absent, private shell/static assets and unauthenticated auth boundary without writes. Camilo reviews visible pages/contact address. Stop on unexpected activation, proof, route or asset failure.
7. Camilo oversees immediate and next-day monitoring; agent performs authorized read-only checks, then reports at day 7 and day 30 when requested/scheduled. No background automation is created by this document. Production field Core Web Vitals and indexing/query data are post-release observations, not pre-release passes. Deployment and indexing evidence get separate entries.

## Compatible fallback and old rollback

`npm run build:seo` also builds and verifies **dist-rollback**, a minimal safe informational version retaining the same six URLs, current contact/privacy/terms, OFF flags and proof exclusions, with detailed new service/guide text removed. Private app bytes and CSS match the same candidate build. This is a **prepared fallback**, not an already live/field-proven release. Review its content and emulator checks before using it. Retain the approved build's two artifacts and their SHA-256 records before publication.

If Camilo decides to roll back this candidate's new informational content, the same manual workflow accepts the approved deployed source SHA and mode `compatible-fallback`; it must remain an ancestor of main and reruns that source's safety checks, then selects the verified fallback artifact. Prefer the retained exact artifact where dependency/runtime drift prevents checksum reproduction: in a clean checkout of the approved source, replace dist-site with the archived dist-rollback, verify all recorded file hashes and `node scripts/seo/verify.mjs dist-site`, then run the dedicated Hosting command above **only after rollback authorization**. Do not deploy unverified rebuilt bytes. Record the new Hosting release and repeat the six-page/contact/OFF/proof/header checks. The fallback cannot repair an unknown private-app regression because its private assets are identical; that risk must be resolved before release.

The prior supported old-version command remains recorded, never executed:

```
npx -y firebase-tools@latest hosting:clone merkadagency-dd2aa:@5a85de4fce7c621b merkadagency-dd2aa:live --project merkadagency-dd2aa
```

**Restoring the old site reintroduces the old artifact and does not preserve disabled analytics/intake or withheld-proof behavior. It is not the compatible fallback.** Re-read the current release record before any authorized release/rollback. Neither release nor rollback has been executed.
