# Affected verification — 20 October 2026

Implementation tested at `e875111237dfab74ce58665629d58c70549e5f20`, based on published main `a348a65d661b093faff38f6f02f8cc78e9cfac4d`. Subsequent review-only documentation/evidence is identified separately in the final handoff; compare generated public bytes before treating that head as tested. Source, artifact and preview manifests require a clean commit. No publication occurred for this candidate.

## Completed affected checks

- Clean forced-OFF candidate, compatible-fallback and noindex-preview builds passed with 19 files each. Existing verifier checked meaningful initial HTML, metadata uniqueness, canonicals, sitemap, internal links, schema JSON, OFF flags, proof/secret exclusions, private fingerprints and exact Hosting scope. Node syntax checks passed for changed `.mjs` source.
- Five existing frontend tests and app TypeScript passed. Eleven existing static/publication-gate tests passed, including preview rejection and independent main-check requirements. Unchanged private tests are retained as prior evidence rather than replaying real operations; hosted review CI still runs the existing required synthetic suite.
- Chromium 149 and Firefox 151 each passed 15 named checks (30 total), including 320/390/844-landscape/1280 widths for both changed pages, 200% root-text reflow surrogate, keyboard skip/disclosures/focus, visible focus outside the fixed action, print, no-JavaScript readability/actions, exact optional mailto prompts and the concept label. Sixteen axe scans had zero violations or incomplete findings. Screenshots and raw results are in `evidence/`.
- All 68 observed requests in the main browser contexts were GETs to the local preview. Zero external, analytics, intake or mutation request attempts; no page exceptions. No actual email link was launched or message sent. The mailto recipient, subject and body were parsed and verified, including absence of cc/bcc recipients. The plain-address fallback remains visible.
- Eight additional checks cover the unchanged home, guide, privacy and terms pages in both engines at 320px: no overflow, no unwanted mobile action and working keyboard skip links.
- Compared every emitted candidate file to the downloaded, verified publication artifact. Same 19-file inventory. Only `contact.html`, `services/website-development.html`, `site.css` and `website-release.json` differ. The four other public page HTML files, private shell/primary/support modules, baseline CSS/favicon, robots and sitemap are byte-identical. No routes, redirects, private configuration or release controls changed. Exact config SHA-256 remains `10fba4d8718a8a6535dd83feab8e7516900bacd0a081b0de7e6e33079abfec71`.
- Initial local preview harness returned 404 because the emulator joined an absolute public path to its config directory. Corrected the local-only harness to a relative path; the complete affected matrix then passed on the unchanged implementation. This was not a production or candidate-source failure.

## Reused evidence and limits

The already published release's 32 synthetic private tests and 20 private browser checks remain applicable to unchanged emitted private bytes. No actual production login, contract write or signing delivery is inferred. Its release and compatible fallback are retained. Existing repository lint debt is not cleaned up or marked resolved; no admin/signing source is changed.

Physical phone/touch, Safari/WebKit, screen reader, native text-only zoom, real OS motion preference and actual mail-app handoff were not tested. Headless viewport and root-font enlargement are substitutes with defined limits. New controls require Camilo review; the earlier release's accepted gaps are not blanket acceptance of this candidate. No new cold-load laboratory or field Core Web Vitals result is claimed; there are no added scripts, fonts, image assets or providers on the public pages. A separate field result still requires production observations after an authorized release.

## Review preview and publication boundary

Local noindex Hosting emulator: `http://localhost:8097/services/website-development` and `http://localhost:8097/contact`. It requires the Mac/emulator to remain running. These are implemented review pages, not production URLs for the proposed copy. No hosted preview deployment, merge, publication, indexing submission, analytics/CRM/Finix activation or customer message is performed.

One concrete review candidate covers only the two existing pages and their mobile email action. Review exact copy in `COPY-DIFF.md`, particularly Austin/shop framing and commercial answers, and the action's phone/accessibility behavior. Future production release requires a separate decision under the unchanged guarded Hosting-only procedure. CRM and Finix are not dependencies. Record real inquiries and quotes manually through Camilo's existing process; no tracking is added here.
