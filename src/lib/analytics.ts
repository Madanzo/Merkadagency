import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const PAGEVIEWS_COLLECTION = "pageviews";
const EVENTS_COLLECTION = "events";

interface PageViewData {
    page: string;
    referrer: string;
    userAgent: string;
    timestamp: Timestamp;
}

interface EventData {
    event: string;
    data?: Record<string, unknown>;
    page: string;
    timestamp: Timestamp;
}

/**
 * Track a page view
 */
export async function trackPageView(page: string): Promise<void> {
    try {
        const pageViewData: PageViewData = {
            page,
            referrer: document.referrer || "direct",
            userAgent: navigator.userAgent,
            timestamp: Timestamp.now(),
        };

        await addDoc(collection(db, PAGEVIEWS_COLLECTION), pageViewData);
    } catch (error) {
        // Silently fail - don't break the app for analytics
        console.warn("Failed to track page view:", error);
    }
}

/**
 * Track a custom event (e.g., CTA clicks)
 */
export async function trackEvent(
    event: string,
    data?: Record<string, unknown>
): Promise<void> {
    try {
        const eventData: EventData = {
            event,
            data,
            page: window.location.pathname,
            timestamp: Timestamp.now(),
        };

        await addDoc(collection(db, EVENTS_COLLECTION), eventData);
    } catch (error) {
        // Silently fail - don't break the app for analytics
        console.warn("Failed to track event:", error);
    }
}

/**
 * Pre-defined event helpers for common actions
 */
export const Analytics = {
    // CTA clicks
    ctaClick: (button: string) => trackEvent("cta_click", { button }),

    // Form submissions
    formSubmit: (form: string) => trackEvent("form_submit", { form }),

    // Booking events
    bookingStarted: () => trackEvent("booking_started"),
    bookingCompleted: () => trackEvent("booking_completed"),

    // Page-specific events
    caseStudyViewed: (study: string) => trackEvent("case_study_viewed", { study }),
    serviceViewed: (service: string) => trackEvent("service_viewed", { service }),
};
