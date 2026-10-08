# Owner decisions and promotion review — 8 October 2026

Preparing changes only. No merge, publication, intake/CRM/analytics activation or customer messages authorized. Preserved baseline: `98de0482fea5fe3e215eb3229bbf720f13be0115`.

## Confirmed decisions

- Current offer: **website development only**. No separately available AI pilot, CRM integration, SEO retainer or advertising-management service. Navigation and homepage offer rows now describe website development; existing service URLs explain the current limits.
- Public availability wording: “Website development available. CRM integration and AI pilots are not offered as separate services.” Diagrams retain their visual design but are explicitly conceptual, not availability claims.
- Camilo Reyna handles privacy requests at `camiloreyna@merkadagency.com`.
- Camilo Reyna oversees monitoring and makes rollback decisions. The agent prepares and performs technical checks only within authorized scope. No future deployment, rollback or messages are authorized by that assignment.
- Intake and analytics remain disabled. CRM activation is unverified.

## CRM promotion — draft only, not in the published website artifact

Camilo’s proposed offer:

> Your website with MerkadAgency includes one year of free CRM access, provided your website remains active with us.

Do not publish this offer until the following terms are approved and the CRM capability is confirmed. Current public copy promises no immediate CRM access.

Confirmed by Camilo:

1. The free year starts only when BOTH the website is active with MerkadAgency and usable CRM access has been provisioned and confirmed. The year must not run while CRM access is unavailable, including later unavailability; the tracking and extension process still requires operational verification.
2. Eligibility requires the website to remain active with MerkadAgency.
3. No automatic paid renewal. Paid continuation requires the customer’s affirmative agreement.

Remaining concrete proposal, **not approved or advertised terms**:

| Item | Recommendation | Evidence/decision still required |
|---|---|---|
| Included features | Offer a narrowly defined customer record and inquiry workspace only after customer access, permitted record operations and isolation are demonstrated. Exclude custom integrations, AI, outbound messaging, payments and revenue attribution from the initial inclusion. | Existing website intake tests are not evidence of a customer-ready CRM plan. CRM owner must identify the exact deployed, customer-accessible functions before any list is promised. |
| Seats | Propose one named customer user initially; additional seats by separately agreed scope. No shared logins. | A proposed commercial boundary, not a claim of supported licensing or provisioned access. CRM owner must verify customer role, invitation, revocation and isolation before adopting it. |
| Usage limits | Do not say “unlimited.” Attach a written schedule of verified record/storage/attachment/API limits to the project agreement; no metered or third-party charges without affirmative agreement. | No tested numeric customer-plan capacity is currently established in this website evidence. Numeric limits must come from verified CRM capacity and owner approval, not an invented quota. |
| Active website service | Define as the customer’s website published and maintained under an ongoing MerkadAgency website-service agreement, not cancelled or terminated. A MerkadAgency-caused outage should not by itself remove eligibility. | Owner must approve billing/grace/suspension treatment and what services the agreement includes. Do not silently equate a temporary outage with cancellation. |
| Free-year accounting | Record the confirmed start and periods without usable CRM access; extend the end date by unavailable time. | CRM/operations owner must verify how outages are recorded and extensions applied; automated subscription-clock support is not established. |
| Expiry and export | Send an expiry notice and offer an export before access ends. If no paid continuation is agreed, end CRM access without charging. Recommend an owner-assisted export of the customer’s permitted records if a verified self-service export does not exist. | Validate a tenant-safe export, included fields/formats and who performs it. Approve notice/export-request windows and retention/deletion timing before promotion publication; no deadlines or automatic deletion capability are invented. |

The promotion remains withheld from public offer copy. Confirm readiness and approve the remaining plan/eligibility/expiry details before publishing. The confirmed start/renewal decisions do not activate CRM.

## Contact and scheduling — confirmed

Use `camiloreyna@merkadagency.com` as the current contact path. The mismatched calendar, its warning and all scheduler links/widgets are removed from the public experience. Existing `/book` inbound links now show an email-only contact page. No calendar account was modified and no booking was made.

Scheduling can return only after MerkadAgency branding and actual availability are verified. Previous calendar observations and screenshots are historical evidence, not current public content or approval to restore it.

## Testing decisions still open

Acknowledging this checklist does not accept all gaps. Record actual results by device/browser or explicitly accept each remaining limitation: Firefox; WebKit; physical iOS Safari/Android Chrome including touch and rotation; VoiceOver/NVDA/JAWS; actual OS reduced-motion preference; full CPU/network-throttled mobile coverage; browser text-only zoom. Follow PHONE-REVIEW.md. Earlier isolated and browser evidence remains evidence for its tested scope only.

## Unchanged release gates

Keep PR #1 draft. A future merged main SHA must receive passing **Website review checks** with exactly that `head_sha`; PR-head success does not validate a different merge SHA. The workflow runs on main pushes. Manual release remains separate and unauthorized.

Rollback record remains version `5a85de4fce7c621b`; re-read before any authorized release. Restoring that old site does not necessarily preserve disabled features or proof withholding. CAM-265/266 remain In Review. CAM-269 dependency boundaries and CAM-223 historical completion remain unchanged; blocked metadata is not republished.
