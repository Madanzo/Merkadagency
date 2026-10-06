/** All flags are explicit public build configuration, never credentials. */
export type AnalyticsConfig = {
  production: boolean; enabled: string | undefined; approval: string | undefined;
  approvedHost: string | undefined; hostname: string; gaId?: string; clarityId?: string;
};
export type AnalyticsConsent = { ga: boolean; clarity: boolean };
export function approvedAnalytics(config: AnalyticsConfig) {
  return config.production && config.enabled === 'true' && Boolean(config.approval?.trim()) &&
    config.hostname === config.approvedHost && !['localhost', '127.0.0.1', '[::1]'].includes(config.hostname) &&
    /^G-[A-Z0-9]+$/.test(config.gaId || '') && /^[a-z0-9]+$/.test(config.clarityId || '');
}
/** No imports, SDK initialization or network requests before BOTH gates. */
export function createAnalyticsGate(config: AnalyticsConfig, loaders: { ga: () => void; clarity: () => void }) {
  const started = { ga: false, clarity: false };
  return (consent: AnalyticsConsent) => {
    if (!approvedAnalytics(config)) return;
    for (const provider of ['ga', 'clarity'] as const) {
      if (consent[provider] === true && !started[provider]) {
        loaders[provider](); started[provider] = true;
      }
    }
  };
}
export const analyticsConfig: AnalyticsConfig = {
  production: import.meta.env.PROD, enabled: import.meta.env.VITE_ANALYTICS_ENABLED,
  approval: import.meta.env.VITE_ANALYTICS_APPROVAL, approvedHost: import.meta.env.VITE_ANALYTICS_HOST,
  hostname: window.location.hostname, gaId: import.meta.env.VITE_GA_ID, clarityId: import.meta.env.VITE_CLARITY_ID,
};
