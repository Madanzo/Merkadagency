# Visual-restoration acceptance

Tested implementation: `37bf3fb218d4adcecd332d739a39476560d8a518`. Documentation/screenshots are added in the final evidence commit; the final clean build must match these tested preview files except manifest source/tree provenance. This is review preparation, not production acceptance.

## Actual results

- **100 browser check groups pass**: 50 each in Chromium 149.0.7827.55 and Firefox 151.0. All six pages at 320, 390, 844-landscape and 1370 CSS px were checked for overflow, navigation, canonical, email URLs, disabled controls and accessibility. **48 axe WCAG A/AA scans have zero violations and zero incomplete checks.** This is not full accessibility certification.
- Beyond scans: real Tab/Enter events verify skip link, all links/disclosures and visible focus above the fixed action; native FAQ toggle; exact email recipient/subjects/prompts; no-JavaScript content/navigation/email path; print; 200% root-text enlargement and focused main links across all pages. Enlargement is a surrogate, not native text zoom.
- The header/footer, typography and body are all in initial static HTML. Every source body byte is retained in order; omitted/duplicated copy is rejected by the verifier and its negative test. **13 static/release-control tests pass**. H1 text, metadata, schema, canonical, sitemap and URL rules match the published baseline. The current content module is byte-identical.
- No public executable script, form, input, iframe, storage or tracking feature. The routed test contexts observed zero external/mutating requests and zero page errors. Real mail-app handoff and sending were not performed. All public art/font resources are first-party or local font fallbacks.
- No browser animation under either emulated motion preference. The folded-glass art and stage composition are static. Physical OS-motion behavior is not certified by media emulation.

The first test passes exposed two actual defects: a decorative CSS arrow entered the link's accessible name, and long Firefox contact links could scroll under the enlarged fixed action. The final arrow is empty decorative geometry; the mobile action omits it, with explicit focus clearance and normal scalable text retained. The same keyboard/enlargement checks pass after correction. Diagram labels now have solid charcoal backgrounds and an explicit layer order above the SVG/artwork; the contrast checks no longer require manual review. Harness corrections for pages without a mobile bar were not product defects.

## Cold-load mobile lab evidence

Three fresh Chromium contexts, cache disabled, local Hosting emulator, 390×844 / DPR 1, 150ms RTT, 1.6Mbps downstream, 0.75Mbps upstream, 4× CPU slowdown. Median LCP **692ms**, median FCP **692ms**, maximum observed CLS **0**. Encoded subresource bytes: **490,139** per sample (excludes navigation document). Local-machine conditions and synthetic throttling limit comparison with real devices/networks. No INP or production field Core Web Vitals result is claimed. `evidence/performance.json` retains each sample and resource path.

## Preserved and unavailable coverage

Private assets/shell/boundary bytes, source, config and routing are unchanged. The new art adds two files; the other shared changes are six page wrappers, safe 404, stylesheet and release provenance. Current Hosting release/version and approved PR #1 are not modified. The existing 49 lint errors remain unrelated debt; admin/signing cleanup was not expanded.

Physical phone, Safari, screen reader, native text zoom, actual OS-motion and real mail-app handoff remain untested for this new candidate. Playwright WebKit's executable is not installed; no WebKit runtime download or Safari result is claimed. Prior release gap acceptance is not blanket approval of this redesign. Actual provider login/signing behavior remains unverified, with no customer or contract writes.

## Owner review

Review the visual treatment across Home, Website Development, Website Brief, Contact, Privacy, Terms and safe 404, plus the exact presentation additions in `REVIEW.md`. On a phone using the supplied same-network preview: read the hero, scroll through the planning image/stages and scope cards, follow the guide/contact links, increase text and rotate, then confirm the fixed action remains readable. Inspect an email draft if desired without sending. Report the device/browser; this does not replace screen-reader/Safari/native-zoom coverage or authorize publication.

Any publication needs approval of the concrete final package, refreshed baseline, independently successful checks on the actual merged main SHA, artifact/private/OFF verification and the existing immediate revision guard. Intake/analytics remain OFF; CRM promotion stays withheld. Current production, deployment/indexing outcomes and acquisition results are separate from this candidate.
