/** Inquiry metadata only; never initializes an analytics provider or stores browsing history. */
export type InquiryAttribution = Partial<Record<'pageUrl' | 'landingPage' | 'referrer' | 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmContent' | 'utmTerm', string>>;
const campaignKeys = { utmSource: 'utm_source', utmMedium: 'utm_medium', utmCampaign: 'utm_campaign', utmContent: 'utm_content', utmTerm: 'utm_term' } as const;
function publicUrl(raw: string): string | undefined {
  try {
    const url = new URL(raw);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return;
    // Query, hash and dynamic/private paths can contain personal or signing data.
    if (!/^\/(?:|contact|book|about(?:\/method)?|services\/[a-z-]+|industries\/[a-z-]+|resources\/[a-z-]+|case-studies\/[a-z-]+)$/.test(url.pathname)) return url.origin;
    return `${url.origin}${url.pathname}`;
  } catch { return; }
}
export function captureInquiryAttribution(href: string, referrer: string): InquiryAttribution {
  const result: InquiryAttribution = {};
  const landingPage = publicUrl(href);
  if (landingPage) result.landingPage = landingPage;
  try {
    const url = new URL(href);
    for (const [key, parameter] of Object.entries(campaignKeys)) {
      const value = url.searchParams.get(parameter);
      // Campaign codes only; reject emails, URLs, free text and oversized values.
      if (value && /^[A-Za-z0-9_-]{1,100}$/.test(value)) result[key as keyof InquiryAttribution] = value;
    }
    if (referrer) { const url = new URL(referrer); if (['https:', 'http:'].includes(url.protocol)) result.referrer = url.origin; }
  } catch { /* Missing attribution must never block an inquiry. */ }
  return result;
}
// Memory-only first entry for this page load, including subsequent SPA navigation.
const entry = captureInquiryAttribution(window.location.href, document.referrer);
export function inquiryAttribution(): InquiryAttribution {
  return { ...entry, pageUrl: publicUrl(window.location.href) };
}
