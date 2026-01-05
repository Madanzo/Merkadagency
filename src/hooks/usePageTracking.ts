import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Hook that tracks page views on route changes
 * Use this in your Layout or App component
 */
export function usePageTracking(): void {
    const location = useLocation();

    useEffect(() => {
        // Track the page view when the route changes
        trackPageView(location.pathname);
    }, [location.pathname]);
}
