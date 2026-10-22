# Visual restoration — review candidate, 22 October 2026

Camilo confirmed preparing the supplied screenshot's visual design as a review candidate while retaining the website-only offer, email contact, disabled intake/analytics and withheld CRM promotion. Preparation is authorized; this is not a merge or publication approval.

## Baseline and design source

Current remote main is `26738dbd3a143963104846e06eb91ad4f1129820`. Read-only checks before implementation confirmed live release `1792533718589000`, version `58586e925886fccd`, all 21 Hosting entries/config and 38 delivered-file hashes on canonical/Firebase hostnames. Existing PR #1 remains draft/unmerged at `60069898dd0e9317f043c3457e6cb5ecb132eda4`.

The folded-glass 480/640 WebP files are exact copies from that preserved PR #1 revision. The logo is the already-published favicon image; its bytes remain unchanged. Only artwork is reused from the preserved concept implementation. The visual layer uses the current six-page static site and its current approved copy.

## Implemented design

- Branded charcoal header, local logo and wordmark, horizontal navigation and desktop email action. On narrow screens the navigation remains visible without JavaScript or a menu toggle. It links only Home, Website development, Website brief and Contact; the existing legal destinations remain in the footer.
- Two-column hero on Home and Website Development, large white/lavender headings, purple arrow action and the original folded-glass artwork. The image is a static concept illustration; four labels describe Plan, Content, Build and Review. On phones the artwork follows the introductory email action, and stage labels reflow when text grows.
- Shared dark cards, section dividers, reading typography, disclosures and footer across all six pages, with matching safe 404 styling. The existing persistent action remains restricted to service/contact pages, now below the 800px breakpoint. No fixed header covers content.
- Existing service and guide wording, scope checklist, conceptual shop disclaimer, email recipient/subjects/prompts, privacy owner and commercial statements remain intact. `website/content.mjs` is byte-identical to published main. H1 text and all metadata/canonical/schema/sitemap data remain unchanged; emphasis spans add visual hierarchy.

The body is split into layout chunks, whose concatenation must equal every source body byte in order. Release verification rejects missing/duplicated content, with a negative test for both cases. This supports the layout change while retaining the initial HTML and existing OFF/proof/link guards. All artwork must resolve to a retained local file. No executable public script or new dependency was introduced.

## Exact presentation additions

The prior public body copy is unchanged. New presentation text is:

- Eyebrow: `MerkadAgency / Website development` (previously `Website development`).
- Visible navigation: `Home`; desktop header action reuses `Discuss your website` and its existing optional draft.
- Figure caption: `Website planning concept`.
- Stage labels: `01 Plan`, `02 Content`, `03 Build`, `04 Review`.
- Caption: `Plan the pages, shape the content, build and review.`
- Disclosure: `Concept illustration — not a client project or a result.`
- Brand-link accessible name: `MerkadAgency home`. Arrow decoration is excluded from action names.

The screenshot's former system-review wording, CRM/AI journey and unsupported navigation are not reintroduced. No customer proof, package, pricing, turnaround, result or permission is invented. No new canonical page or URL retirement/redirect is proposed. Two new local concept-art asset URLs are emitted under `/visuals/`.

## Boundaries and later publication

Private source/assets and their existing routing remain untouched. Configs, release workflows, manual-only publication controls, robots and sitemap remain unchanged. No tracking, intake, calendar, payment/backend feature, CRM promotion or other-website change. No customer message, submission, indexing request or spending. Existing lint debt remains outside this design work. Production is not changed by the branch or draft PR.

Owner review concerns the new presentation across all six pages, its concept labels, header action and responsive layouts. Physical-phone, Safari/WebKit, screen-reader, native zoom, actual OS-motion and real mail-app testing are not covered by emulation; earlier bounded-release acceptance is not blanket acceptance of this redesign. Private-provider login/signing remains unverified. The screenshots/browser/lab results are candidate evidence, not production delivery, indexing, field CWV or acquisition outcomes.

Any later approved publication must refresh the live baseline, preserve intervening changes, check the actual final merged main SHA independently, verify that revision's artifact/config/private/OFF boundaries and perform the existing final fresh main guard. No dispatch is authorized here.

## Compatible rollback proposal

Retain the exact current full site at Hosting version `58586e925886fccd`, source `26738dbd3a143963104846e06eb91ad4f1129820`, aggregate SHA-256 `d711d53035a4c29767c75736ef7b2202779c31e20f7c0438f0819a26e1df7ddb`, with its original artifact/config/file lists. It reverses the presentation without restoring historical tracking or unapproved proof. The new build's generated shortened fallback keeps the new stylesheet/header, so it is not an exact visual rollback.

Supported exact-version operator command, proposed only, **not executed**:

```sh
npx -y firebase-tools@latest hosting:clone merkadagency-dd2aa@58586e925886fccd merkadagency-dd2aa:live --project merkadagency-dd2aa
```

Use only after a confirmed failure and appropriate authorization, expected-current release recording, target config/files/OFF/proof compatibility checks and a fresh unchanged main/baseline check. Stop on intervening changes and reverify after any authorized rollback. This is an operator procedure, not an additional automatic publication path or guard. Camilo retains monitoring/rollback decisions. Neither exact restoration nor shortened fallback repairs provider-side login/signing problems. Never restore the historical tracking/proof version.
