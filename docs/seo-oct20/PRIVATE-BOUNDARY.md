# Private-app boundary — coordinator follow-up

This supersedes the earlier undefined private-source parity hold; historical evidence remains preserved. A historical Git SHA is still unestablished, but the current live bytes/configuration were independently captured on October20. No private production transaction, auth sign-in, real contract read/write, email or backend trigger was performed.

## Verified baseline and preservation decision

Project/site `merkadagency-dd2aa`, release `1789080868216000`, version `5a85de4fce7c621b`. Official read-only Hosting version-file API returned all **16 ACTIVE files**. [Capture manifest](../../website/private-baseline/manifest.json) includes metadata hashes and separate HTTP-byte hashes, all 34 router patterns extracted from the delivered bundle and all 16 static paths. Hosting's stored/version hashes and delivered-byte hashes are different representations; do not interchange them. The full original bytes are archived locally only, not in this branch's public assets or review pages.

Private `/admin`, `/admin/login`, and `/sign/:contractId` returned the same 2,098-byte shell as `/`, SHA-256 `30302ca010672fbb7d84630f344d979e116ab69df9e0fdd685ddf92be2d52390`. That shell loads GA regardless of route. The live 1,928,181-byte primary JS (`d54443722c1a8e3eeb7877ffd9503d84a86b4b2767c7b7183ed9ceec51913a9a`) combines private code, legacy public customer-proof strings and Clarity startup. Thus preserving the original shell/bundle unchanged would re-enable tracking and publish withheld material. Noindex/CSP alone cannot make downloadable customer-proof strings private. No such legacy bundle is copied to the release artifact.

The original PDF support chunk imports that incompatible original primary by filename. It cannot remain unchanged while that primary is removed. Its module links are therefore rebuilt with the private entry. The following safe live assets **are preserved byte-for-byte**, with build-time hash enforcement:

| Asset | SHA-256 of delivered bytes |
|---|---|
| `/assets/index-DxLjU7W-.css` | `1507e06bfaf94c67ae84422a81bd98654b51dc31e285c0681ee647d9d4858154` |
| `/assets/html2canvas.esm-QH1iLAAe.js` | `061c08e50c0dc57b8d5e6531f0b8237a52a68b233260d49ab2f2c2906ad112c4` |
| `/assets/purify.es-B9ZVCkUG.js` | `8f994fedccc1596fbf513fa2242f1c6e86b7a530310614dfe5b3b28d637df46e` |
| `/favicon.png` | See the exact capture manifest and emitted `private-boundary.json` |

The live Google Fonts links are retained **on the private shell only**; informational pages remain free of external fonts/scripts. Delivery of those existing private fonts is distinct from analytics. The private shell is noindex, has no GA/Clarity initializer and uses only the three existing named app routes. Existing private rewrite scopes remain; unmatched private paths show a return-to-website link without customer data. Other application URLs use safe 404; reserved Firebase Hosting auth/init endpoints remain platform-managed and are not loaded by informational pages.

## Smallest necessary source migration

1. Keep the original authentication, protected-route, login controls, dashboard, signing and signature-pad business source. Replace only the private bootstrap/router so it cannot import legacy public pages/analytics. Publicly reachable login's old marketing Header/Footer are replaced by a return-to-website link via a private-build-only Layout alias.
2. Restore live dashboard bottom spacing (`pb-24`); repository main had `pb-20`. This one-class correction preserves observed live layout rather than introducing unrelated admin cleanup.
3. Keep the existing isolated replacement of one unapproved customer-story email preview with a withholding notice. No email sending/scheduling or data-operation function changes. Analytics initialization stays gated and dynamically loaded; forced-OFF builds omit provider URLs.
4. Preserve the live stylesheet/favicon and the two independent support modules. Rebuild only the coupled primary/PDF module links with the locked dependency tree; no SDK upgrade, auth allowlist, provider account, backend, Functions, rules or Storage change.

## Evidence and practical limits

`private-analysis.mjs` parses actual captured live and emitted candidate bundles, resolves lexical bindings, and fingerprints identifier-normalized ASTs. It enforces equality of **seven retained functions** (signing, auth hook, allowlist helper, protected route, login, signature pad and dashboard), their direct dependency fingerprints and the hashed literal Firebase public configuration. The only permitted direct dependency change is login's intentionally replaced marketing Layout. The live allowlist constants are compared by hash; no identity list is copied into reports. This is structural evidence, not a claim that two complete bundles are byte-identical or a formal proof of all runtime behavior. The SDK output is rebuilt from the same lock; deep compiler/vendor/export output is not claimed byte-identical.

Only the seven private function bodies and non-sensitive hashes were captured into test fixtures; the full legacy bundle/customer material is not republished. **32 paired synthetic tests** execute the actual captured live and emitted candidate function bodies through the same local React DOM/dependency fixtures:

- Auth loading/signed-out/denied/allowed states; redirects, case-insensitive allowlist semantics, login/sign-out intent and listener cleanup.
- Dashboard fixture loading and People/Settings/Inbox handoffs, without destructive controls or real data.
- Missing/malformed/wrong/mismatched/expired token, missing document/read failure and already-signed states; no writes in rejection paths.
- Scroll/acknowledgment/actual signature-pad drawing/clear guards; exact synthetic document path/payload/callback; successful write, write failure and noncritical callback failure.

Every read/write/callback is a local spy; no Firebase SDK or real account/contract is used in the fixture runtime. IP lookup is stubbed with documentation-only `192.0.2.1`; no request is sent. Historical signed-screen wording is not proof that an email was sent. The fixtures do not validate deployed provider availability, auth/security rules, actual email delivery or real-contract execution. Those systems are unchanged and no live mutation is authorized.

The compatible fallback retains this same verified private package, OFF flags, contact and proof exclusions while removing the long new public service/guide content. It covers public informational regressions. It does **not** claim to repair every possible private-runtime/provider failure; an unexpected private failure requires a reviewed fix, or an explicit decision about the incompatible old rollback. The old Hosting version restores legacy tracking/proof and is not an OFF-safe fallback. No source, API or production state was changed merely to obtain this evidence.
