# Email-only candidate follow-up — 8 October 2026

Owner confirmed: free year starts only after both active website service and confirmed usable CRM access; unavailable time does not consume the year; website must remain active; no automatic paid renewal. Included features/seats/limits, active-service definition and expiry/export details remain proposals in APPROVAL.md, not public promises.

Calendar removal: contact CTA uses approved email, legacy `/book` remains an email-only destination, public policies no longer describe an available scheduler. No calendar account change or booking. Artifact verifier rejects scheduler URLs and the removed calendar identifier; no scheduler bundle emitted. Historical screenshots retained unchanged.

Checks: 42 frontend tests; 15 isolated intake tests after loopback permission; TypeScript app project and scoped lint pass. Disabled artifact verified: 47 files, SHA256 `46a315645d12a014ba296282edbd5ae3de53de4fd8fea5384e5c1e6a6df8dbaa`. No unrelated cleanup.

Browser: desktop contact has zero scheduler links/iframes, zero fields, no Canvas-calendar warning and only approved mailto recipients. `/book` shows email contact. At 320px: zero horizontal overflow, no input fields, Enter opens menu, Escape closes and focus returns. No email sent. Device, engine, assistive-technology and other previously listed gaps remain individually open; no new field performance result claimed.

CRM evidence: current website intake tests verify website boundaries, not a customer-facing CRM subscription plan. A non-sensitive capability-only confirmation request was sent to the CRM agent; no deployed customer-plan confirmation was received at the time of this record. No configuration metadata or secrets reproduced. CAM-269 dependencies, CAM-223 history, disabled activation gates and rollback limitations remain unchanged.

Screenshots: [contact desktop](contact-desktop.jpg), [contact mobile](contact-mobile.jpg), [legacy booking route](legacy-book-desktop.jpg).
