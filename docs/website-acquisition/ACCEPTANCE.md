# Affected acceptance — acquisition review

Tested implementation: `ae676d69865a148ec59c5081d415b955edcde908`. The final evidence commit adds documentation/screenshots only. Final package identity belongs in the release-review record; rebuild and compare the preview bytes after that commit, allowing only `website-release.json` provenance to differ.

## Actual results

- Clean candidate and noindex preview builds pass; both flags forced OFF. Static release/control tests: **11/11 pass**.
- **Chromium 149.0.7827.55 and Firefox 151.0: 20 affected check groups pass** (10 per engine). Eight axe WCAG A/AA scans at 320, 390, 844 landscape and 1280 CSS px: **zero violations and zero incomplete checks**. This is not full accessibility certification.
- Five email-draft anchors have the exact expected recipient, subject and editable blank prompts; no cc/bcc or tracking parameters. Plain email fallback has the same recipient. No actual mail app opened or message sent.
- Scripted keyboard traversal in both engines reaches both new links with visible focus unobscured by the existing fixed mobile action. Skip link and disclosure Enter behavior pass. At 200% root-text enlargement, the two new actions remain readable, within the viewport and above the mobile bar. This is a surrogate, not native browser/OS text zoom.
- No horizontal overflow at the tested widths. Mobile action appears at narrow widths and remains unchanged. No-JavaScript HTML includes both new links/checklist. Print keeps scope content and hides the mobile bar. Existing conceptual example remains labeled. The unchanged contact fallback remains email-only.
- Each engine observed 18 same-origin GET requests across this suite; zero external/blocked requests, zero mutating requests and zero page errors. The public page includes no executable client script. Analytics requests were not observed; intake controls are absent. Static artifact checks separately verify OFF boundaries/private packaging.
- Baseline artifact comparison: exact 19-file inventory; **only** service-page HTML and release manifest differ. Other five public pages, 404, CSS, private assets/HTML/boundary manifest, sitemap and robots are byte-identical. Source diff leaves metadata/schema/canonical, Hosting config, redirects, private source and workflows unchanged. No URL added, retired or redirected in this patch.

The first enlarged-text run exposed clipped focus on the newly added padded card buttons. The final implementation uses ordinary underlined email links in those cards, retaining the existing prominent mobile button and shared styles. Both engines pass the affected enlargement/keyboard checks after this fix. The harness selector was also corrected to separate five draft links from the unchanged plain footer address; that selector correction was not a product failure.

## Explicit coverage limits

Physical-phone, Safari/WebKit, screen reader, native text zoom, actual OS-motion preference and real mail-app handoff remain untested for this candidate. Prior bounded-release acceptance does not automatically approve a subsequent change. The patch introduces no motion; media emulation is not an OS-motion test. This suite uses local headless engines and the Hosting emulator, not physical devices or a deployed preview.

Unchanged evidence is reused: private synthetic suite/release controls run in PR CI, while actual production login/signing delivery remains unverified. No provider/customer/contract write is performed. The existing 49 whole-project lint errors remain pre-existing debt; this content-only patch does not expand into admin/signing cleanup. No new performance/Core Web Vitals result is claimed; field results require post-publication measurement. Deployment, indexing and business outcomes have not occurred for this candidate.

## Owner phone review for this patch

Open the supplied same-Wi-Fi preview address while this machine/emulator is running (localhost on a phone points to the phone itself). Read both project cards and the five scope items. Check that the persistent contact action does not cover content, and that both new email links offer the correct draft/recipient without sending. If no email app is configured, use the contact-page plain address. Check large text/landscape in the actual phone browser. Report device/browser and any obstruction; do not send a test inquiry. Screen-reader/native-zoom/WebKit gaps require their own testing or explicit bounded acceptance before publication.

## Future publication gate

Preparation only. Review the exact copy and concrete package before authorizing publication. A passing PR synthetic merge build does **not** certify a future merged main SHA. After authorization: refresh expected live baseline, stop on unreviewed intervening changes, merge the approved head, require independently successful checks on actual final main, verify that revision's artifact/private/OFF/config hashes, and perform the existing immediate main recheck before one guarded Hosting-only publication to `merkadagency-dd2aa` with `firebase.seo.json`. No automatic publication is triggered by this branch/PR. `REVIEW.md` retains the compatible exact-current-version rollback proposal and its manual preconditions.
