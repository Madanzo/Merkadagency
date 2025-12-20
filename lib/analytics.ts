// Simple analytics utility for tracking page views and CTA clicks
// Can be connected to GA4, Mixpanel, or any analytics platform later

type EventName = "page_view" | "cta_click";

interface AnalyticsEvent {
    event: EventName;
    page?: string;
    cta_location?: string;
    timestamp: string;
}

// Store events locally for debugging (replace with real analytics in production)
const events: AnalyticsEvent[] = [];

export function trackPageView(page: string) {
    const event: AnalyticsEvent = {
        event: "page_view",
        page,
        timestamp: new Date().toISOString(),
    };

    events.push(event);
    console.log("[Analytics] Page View:", page);

    // Send to Google Analytics if available
    if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
        (window as Window & { gtag?: Function }).gtag?.("event", "page_view", {
            page_path: page,
        });
    }
}

export function trackCTAClick(location: string) {
    const event: AnalyticsEvent = {
        event: "cta_click",
        cta_location: location,
        timestamp: new Date().toISOString(),
    };

    events.push(event);
    console.log("[Analytics] CTA Click:", location);

    // Send to Google Analytics if available
    if (typeof window !== "undefined" && (window as Window & { gtag?: Function }).gtag) {
        (window as Window & { gtag?: Function }).gtag?.("event", "cta_click", {
            event_category: "engagement",
            event_label: location,
        });
    }
}

// Debug function to view all tracked events
export function getTrackedEvents() {
    return events;
}

// Get CTA click count
export function getCTAClickCount() {
    return events.filter((e) => e.event === "cta_click").length;
}

// Get page view count for a specific page
export function getPageViewCount(page: string) {
    return events.filter((e) => e.event === "page_view" && e.page === page).length;
}
