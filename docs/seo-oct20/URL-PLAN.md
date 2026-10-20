# Complete public URL and asset disposition

Proposed only; wording and retirements require Camilo approval. Includes all 34 captured live-router patterns and all 16 version-file paths, deduplicated. Reserved Hosting endpoints are distinguished from application 404s. No customer story is republished by listing a retired URL.

| URL/path | Candidate response | Reason |
|---|---|---|
| `/` | 200 static HTML | Approved informational replacement |
| `/services` | 301 → /services/website-development | One commercial service URL |
| `/services/ai-lead-capture` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/services/crm-automation` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/services/seo-content` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/services/paid-advertising` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/industries` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/industries/medspas` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/industries/cannabis` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/industries/construction` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/industries/ecommerce` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/results` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/portfolio` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/case-studies` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/case-studies/kravings` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/case-studies/teonanacatl` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/case-studies/gridnguard` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/free-audit` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/roi-calculator` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/medspa-automation-checklist` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/cannabis-marketing-playbook` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/contractor-lead-gen-guide` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/ecommerce-automation-blueprint` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/about` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/about/method` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/book` | 302 → /contact | Email-only contact; scheduling withheld |
| `/contact` | 200 static HTML | Approved informational replacement |
| `/blog` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/legal/privacy` | 200 static HTML | Approved informational replacement |
| `/legal/terms` | 200 static HTML | Approved informational replacement |
| `/admin/login` | 200 private shell | Retained route, auth/signing behavior isolated and verified |
| `/admin` | 200 private shell | Retained route, auth/signing behavior isolated and verified |
| `/sign/:contractId` | 200 private shell | Retained route, auth/signing behavior isolated and verified |
| `*` | 404 safe noindex | All other application URLs, except Hosting reserved and private rewrite patterns |
| `/__/firebase/init.js` | Platform-managed reserved endpoint | Not a new static artifact file; not loaded by informational pages |
| `/__/firebase/init.json` | Platform-managed reserved endpoint | Not a new static artifact file; not loaded by informational pages |
| `/assets/html2canvas.esm-QH1iLAAe.js` | 200 identical live bytes | Fingerprint enforced by build |
| `/assets/index-DxLjU7W-.css` | 200 identical live bytes | Fingerprint enforced by build |
| `/assets/index-oYkhmNmm.js` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/assets/index.es-BLzAEPB-.js` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/assets/purify.es-B9ZVCkUG.js` | 200 identical live bytes | Fingerprint enforced by build |
| `/favicon.png` | 200 identical live bytes | Fingerprint enforced by build |
| `/index.html` | 301 → / | Hosting cleanUrls canonical root |
| `/medspa-checklist.html` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/cannabis-marketing-playbook.html` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/contractor-lead-gen-guide.html` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/ecommerce-automation-blueprint.html` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/resources/medspa-automation-checklist.html` | 404 safe noindex | Retired unsupported content or incompatible legacy asset |
| `/robots.txt` | 200 replaced | Six informational destinations; private exclusions |
| `/sitemap.xml` | 200 replaced | Six informational destinations; private exclusions |
| `/services/website-development` | 200 static HTML | New distinct service or educational intent |
| `/resources/website-brief` | 200 static HTML | New distinct service or educational intent |
| `/admin/** and /sign/** outside the three named routes` | 200 noindex private fallback | Existing private rewrite scopes; React renders only a return-to-website link for unmatched paths |
| `/private-app.html` | 301 → /private-app | cleanUrls alias; noindex shell, fallback link outside named private routes |
| `/private-app` | 200 noindex shell | Private named routes only; no public marketing |
| `/website-release.json` | 200 release metadata | Source/OFF/config hashes, no secret values |
| `/private-boundary.json` | 200 boundary metadata | Non-sensitive fingerprints only |
| `/site.css` | 200 informational stylesheet | Self-hosted |
| `/{six retained pages}.html` | 301 → extensionless canonical | Hosting cleanUrls; /index.html → / |
| `/{retained static public URL}/` | 301 → URL without trailing slash | Hosting trailingSlash:false; private rewrites retain slash/query URLs |
| `/assets/{new-private-primary,new-private-PDF}.js` | 200 source-pinned generated files | Old primary cannot be preserved with OFF/proof requirements; old PDF imports it |
| `/__/auth/* and other Hosting reserved URLs` | Platform-managed | Not overridden; existing Firebase Auth hosting behavior retained |

Both candidate and compatible fallback use this same configuration. Old copies in browser caches cannot be revoked by this release.
