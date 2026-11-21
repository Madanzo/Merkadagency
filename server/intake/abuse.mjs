import { boundedJson } from './bounded-json.mjs';
import { createHash } from 'node:crypto';

// Ephemeral abuse metadata only. No leads, messages, CRM state or raw IPs stored.
export function createLimiter({ limit = 8, windowMs = 60_000, maxEntries = 5000, now = Date.now } = {}) {
  const buckets = new Map();
  return (address) => {
    if (!address) return false;
    const time = now();
    for (const [key, entry] of buckets) if (entry.until <= time) buckets.delete(key);
    const key = createHash('sha256').update(address).digest('hex');
    const entry = buckets.get(key);
    if (entry) { if (entry.count >= limit) return false; entry.count++; return true; }
    if (buckets.size >= maxEntries) return false;
    buckets.set(key, { count: 1, until: time + windowMs });
    return true;
  };
}

export function createTurnstileVerifier({ secret, allowedHostnames, fetchImpl = fetch }) {
  return async (request) => {
    const token = request.headers.get('x-turnstile-token') || '';
    if (!secret || !token || token.length > 2048 || !allowedHostnames?.length) return false;
    try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    if (!response.ok) return false;
    const result = await boundedJson(response);
    return result?.success === true && result.action === 'contact_intake' && allowedHostnames.includes(result.hostname);
    } catch { return false; }
  };
}
