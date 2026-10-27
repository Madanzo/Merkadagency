import { createContactIntake } from './contact-intake.mjs';
import { createLimiter, createTurnstileVerifier } from './abuse.mjs';

export const disabledConfig = Object.freeze({ enabled: false });
// Called only inside deployed server runtime. No browser environment variables.
export function runtimeConfig(env) {
  if (env.CONTACT_INTAKE_ENABLED !== 'true') return disabledConfig;
  return {
    enabled: true, crmOrigin: env.CONTACT_CRM_ORIGIN, tenantSlug: env.CONTACT_CRM_TENANT,
    apiKey: env.CONTACT_CRM_API_KEY, requestedService: env.CONTACT_CRM_SERVICE,
    allowedOrigins: (env.CONTACT_ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    turnstileSiteKey: env.CONTACT_TURNSTILE_SITE_KEY, turnstileSecret: env.CONTACT_TURNSTILE_SECRET,
  };
}
export function createRuntime({ config = disabledConfig, fetchImpl = fetch, limiter = createLimiter() } = {}) {
  const validOrigin = value => {
    try { const url = new URL(value); return url.protocol === 'https:' && url.origin === value; }
    catch { return false; }
  };
  const nonempty = value => typeof value === 'string' && value.trim().length > 0;
  const configured = validOrigin(config.crmOrigin) && /^[a-z0-9_-]+$/.test(config.tenantSlug || '') &&
    Array.isArray(config.allowedOrigins) && config.allowedOrigins.every(validOrigin) && config.enabled === true && config.crmOrigin && config.tenantSlug && nonempty(config.apiKey) &&
    nonempty(config.requestedService) && nonempty(config.turnstileSiteKey) && nonempty(config.turnstileSecret) && config.allowedOrigins?.length;
  const bound = Object.freeze({ ...config, enabled: Boolean(configured), allowedOrigins: configured ? [...config.allowedOrigins] : [] });
  const intake = createContactIntake({ config: bound, fetchImpl, verifyAbuse: createTurnstileVerifier({
    secret: bound.turnstileSecret, allowedHostnames: bound.allowedOrigins.map(value => new URL(value).hostname), fetchImpl,
  }) });
  let active = 0;
  return async (request, { address } = {}) => {
    const pathname = new URL(request.url).pathname;
    const response = (status, body) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
    if (pathname === '/api/contact-intake/config' && request.method === 'GET') {
      return response(200, { enabled: bound.enabled, ...(bound.enabled ? { siteKey: bound.turnstileSiteKey } : {}) });
    }
    if (pathname !== '/api/contact-intake') return response(404, { code: 'not_found' });
    if (request.method !== 'POST') return response(405, { code: 'method_not_allowed' });
    if (!bound.enabled) return response(503, { code: 'not_configured' });
    if (active >= 8 || !limiter(address)) return response(429, { code: 'rate_limited' });
    active++;
    try { return await intake(request); }
    catch { return response(400, { code: 'invalid_request' }); }
    finally { active--; }
  };
}

// Shared Node/Firebase mount. Ignore forwarded-IP headers supplied by callers.
// A reverse proxy shares the socket bucket: conservative, possibly stricter than desired.
export function nodeListener(runtime) {
  return async (req, res) => {
    try {
      req.setTimeout?.(10000, () => req.destroy());
      const url = new URL(req.originalUrl || req.url, 'http://local.invalid');
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value);
      const hasBody = !['GET', 'HEAD'].includes(req.method);
      if (Number(headers.get('content-length')) > 16_384 || (req.rawBody && req.rawBody.length > 16_384)) {
        res.writeHead(413, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({code:'payload_too_large'})); return;
      }
      const request = new Request(url, { method: req.method, headers,
        ...(hasBody ? { body: req.rawBody || req, duplex: 'half' } : {}),
      });
      const result = await runtime(request, { address: req.socket.remoteAddress });
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch {
      if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({code:'invalid_request'}));
    }
  };
}
