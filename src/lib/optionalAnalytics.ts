import { analyticsConfig, approvedAnalytics, createAnalyticsGate, type AnalyticsConsent } from './analyticsGate';

type Queue = ((...args: unknown[]) => void) & { q?: unknown[][] };
const browser = window as unknown as { dataLayer?: unknown[]; gtag?: Queue; clarity?: Queue };
function script(src: string) {
  const tag = document.createElement('script'); tag.async = true; tag.src = src;
  tag.dataset.optionalAnalytics = 'true'; document.head.append(tag);
}
const activate = createAnalyticsGate(analyticsConfig, {
  ga: () => {
    browser.dataLayer = browser.dataLayer || [];
    browser.gtag = function (...args: unknown[]) { browser.dataLayer!.push(args); };
    browser.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    browser.gtag('js', new Date());
    browser.gtag('config', analyticsConfig.gaId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    script(`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.gaId}`);
  },
  clarity: () => {
    const queue: Queue = (...args) => { (queue.q ||= []).push(args); };
    browser.clarity = queue;
    queue('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
    script(`https://www.clarity.ms/tag/${analyticsConfig.clarityId}`);
  },
});
/** Call only from an approved consent manager's explicit visitor choice, never page load.
 * No public UI or stored consent is installed until the privacy/consent implementation is approved.
 * Host/config alone therefore cannot activate either provider in this release.
 */
let previous: AnalyticsConsent = { ga: false, clarity: false };
export function applyAnalyticsConsent(consent: AnalyticsConsent) {
  if (!approvedAnalytics(analyticsConfig)) return;
  // Exclude operational and inquiry pages even if a future caller is miswired.
  if (/^\/(admin|sign|contact|book)(\/|$)/.test(location.pathname) || location.pathname === '/resources/free-audit') return;
  if ((previous.ga && !consent.ga) || (previous.clarity && !consent.clarity)) {
    // Unload running SDKs; consent is not persisted or restored on page load.
    location.reload(); return;
  }
  activate(consent); previous = { ...consent };
}
