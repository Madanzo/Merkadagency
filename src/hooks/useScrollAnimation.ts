import { useEffect } from 'react';

/**
 * Hook to trigger animations when elements scroll into view
 * Adds 'visible' class to elements with 'animate-on-scroll' class
 */
export function useScrollAnimation() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optional: Stop observing once visible to run animation only once
                        // observer.unobserve(entry.target); 
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        const handleScroll = () => {
            // Find all elements to animate
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                if (!el.classList.contains('visible')) {
                    observer.observe(el);
                }
            });
        };

        // Initial check
        setTimeout(handleScroll, 100);

        // Re-check on route changes or content updates (basic implementation)
        window.addEventListener('scroll', handleScroll, { once: true });

        // Set up a mutation observer to catch dynamically added elements
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    handleScroll();
                }
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Clean up
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Safety fallback: Ensure everything is visible after 2 seconds
    // This prevents the "blank site" issue if the observer fails or script stalls
    useEffect(() => {
        const safetyTimeout = setTimeout(() => {
            const remaining = document.querySelectorAll('.animate-on-scroll:not(.visible)');
            if (remaining.length > 0) {
                console.warn(`Recovered ${remaining.length} elements that failed to animate.`);
                remaining.forEach(el => el.classList.add('visible'));
            }
        }, 2000);

        return () => clearTimeout(safetyTimeout);
    }, []);
}
