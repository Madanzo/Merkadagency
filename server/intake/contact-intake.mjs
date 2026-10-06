import { boundedJson } from './bounded-json.mjs';
/** Prepared server boundary. Mount at POST /api/contact-intake after rollout review.
 * No Firebase writes, CRM mutations, or outbound communications are implemented here.
 * CRM owns persistence, identity, opportunities, deduplication and communications.
 */
const reply = (status, code, extra = {}) => Response.json({ code, ...extra }, {
  status, headers: { 'Cache-Control': 'no-store' },
});
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;

export function createContactIntake({ config, verifyAbuse, fetchImpl = fetch }) {
  return async function handle(request) {
    if (request.method !== 'POST') return reply(405, 'method_not_allowed');
    // Fail closed: an operator must approve tenant, origin, service and abuse controls.
    let crm;
    try { crm = new URL(config.crmOrigin); } catch { return reply(503, 'not_configured'); }
    if (config.enabled !== true || crm.protocol !== 'https:' || crm.username || crm.password ||
        crm.pathname !== '/' || crm.search || crm.hash || !/^[a-z0-9_-]+$/.test(config.tenantSlug || '') ||
        !nonempty(config.apiKey) || !nonempty(config.requestedService) ||
        !Array.isArray(config.allowedOrigins) || !config.allowedOrigins.length ||
        typeof verifyAbuse !== 'function') return reply(503, 'not_configured');
    if (!config.allowedOrigins.includes(request.headers.get('origin'))) return reply(403, 'origin_rejected');
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return reply(415, 'invalid_content_type');
    const key = request.headers.get('idempotency-key') || '';
    if (!/^[a-zA-Z0-9_-]{16,120}$/.test(key)) return reply(400, 'invalid_key');
    // Bound actual bytes, including chunked requests, before parsing.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'invalid_body');
    let size = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16_384) { await reader.cancel(); return reply(413, 'payload_too_large'); }
      chunks.push(value);
    }
    let input;
    try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return reply(400, 'invalid_body'); }
    const limits = { name: 200, email: 320, subject: 200, message: 4500, submittedAt: 40, website: 0 };
    const optionalLimits = { companyName: 200, currentStack: 600, locale: 20, referralBrand: 60, desiredTimeline: 120, estimatedBudget: 60 };
    if (!input || Array.isArray(input) || Object.keys(input).some(k => !Object.hasOwn(limits, k) && !Object.hasOwn(optionalLimits, k) && k !== 'attribution') ||
        Object.entries(limits).some(([k, max]) => typeof input[k] !== 'string' || input[k].length > max) ||
        Object.entries(optionalLimits).some(([k, max]) => input[k] !== undefined && (typeof input[k] !== 'string' || input[k].length > max)) ||
        (typeof input.locale === 'string' && input.locale.trim() && !/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(input.locale.trim())) ||
        ['name', 'email', 'subject', 'message'].some(k => !nonempty(input[k])) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
        /[\r\n]/.test(input.subject) ||
        !/^\d{4}-\d{2}-\d{2}T/.test(input.submittedAt) || Number.isNaN(Date.parse(input.submittedAt))) {
      return reply(422, 'invalid_submission');
    }
    const attributionLimits = { pageUrl: 2048, landingPage: 2048, referrer: 2048, utmSource: 100, utmMedium: 100, utmCampaign: 100, utmContent: 100, utmTerm: 100 };
    if (input.attribution !== undefined && (!input.attribution || typeof input.attribution !== 'object' || Array.isArray(input.attribution) ||
        Object.entries(input.attribution).some(([key, value]) => !Object.hasOwn(attributionLimits, key) || typeof value !== 'string' || value.length > attributionLimits[key] ||
          (key.startsWith('utm') ? !/^[A-Za-z0-9_-]{1,100}$/.test(value) : (() => { try { const url = new URL(value); return !['https:', 'http:'].includes(url.protocol) || Boolean(url.username || url.password || url.search || url.hash); } catch { return true; } })())))) {
      return reply(422, 'invalid_submission');
    }
    try {
      // Must enforce trusted client IP/rate limits + verified anti-abuse at deployment edge.
      // Never trust a browser-supplied turnstileVerified flag.
      if (!(await verifyAbuse(request, input))) return reply(429, 'verification_required');
      // Stable mapping: no generated timestamp, dynamic enrichment, or lossy truncation.
      const qualification = Object.fromEntries(Object.keys(optionalLimits)
        .filter(k => typeof input[k] === 'string' && input[k].trim())
        .map(k => [k, input[k]]));
      const body = JSON.stringify({
        fullName: input.name, email: input.email, message: `Subject: ${input.subject}\n\n${input.message}`,
        requestedService: config.requestedService, preferredContactMethod: 'email',
        sourceSystem: 'merkadagency_contact_v1', externalDocId: key, submittedAt: input.submittedAt,
        marketingConsent: false, smsConsent: false, website: '', turnstileVerified: true,
        ...qualification,
        ...(input.attribution !== undefined ? { attribution: input.attribution } : {}),
      });
      const response = await fetchImpl(`${crm.origin}/api/v1/tenants/${config.tenantSlug}/leads/intake`, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(12_000),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}`, 'Idempotency-Key': key }, body,
      });
      const result = await boundedJson(response, 16384);
      // CRM can return 201 for rejected spam. HTTP success alone is insufficient.
      if (!response.ok || result.ok !== true || !['created', 'duplicate_ignored'].includes(result.code) ||
          !['leadId', 'contactId', 'opportunityId'].every(k => nonempty(result.data?.[k]))) {
        return reply(response.status === 409 ? 409 : 502, 'persistence_unconfirmed');
      }
      // Keep CRM identifiers private; expose only the receipt the browser generated.
      return reply(200, 'persisted', { submissionId: key });
    } catch {
      // Upstream may have committed: preserve original key and bytes on retry.
      // Do not log request content, upstream response content, or credentials.
      return reply(502, 'persistence_unconfirmed');
    }
  };
}
