'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseScrollAnimationOptions {
    /** Threshold for intersection observer (0-1) */
    threshold?: number;
    /** Root margin for intersection observer */
    rootMargin?: string;
    /** CSS class to add when element is visible */
    visibleClass?: string;
    /** Whether to unobserve after first intersection */
    once?: boolean;
}

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 * Replaces duplicate animation logic across multiple pages.
 * 
 * @example
 * // With CSS Modules
 * const containerRef = useScrollAnimation({ visibleClass: styles.visible });
 * 
 * @example
 * // With global classes
 * const containerRef = useScrollAnimation({ visibleClass: 'visible' });
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        visibleClass = 'visible',
        once = true,
    } = options;

    const containerRef = useRef<T>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(visibleClass);
                    if (once && observerRef.current) {
                        observerRef.current.unobserve(entry.target);
                    }
                } else if (!once) {
                    entry.target.classList.remove(visibleClass);
                }
            });
        },
        [visibleClass, once]
    );

    useEffect(() => {
        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin,
        });

        const container = containerRef.current;
        if (!container) return;

        // Find all elements with data-animate attribute
        const elements = container.querySelectorAll('[data-animate]');
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [threshold, rootMargin, handleIntersection]);

    return containerRef;
}

/**
 * Hook to observe a single element for scroll animation
 */
export function useElementAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        visibleClass = 'visible',
        once = true,
    } = options;

    const elementRef = useRef<T>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(visibleClass);
                        if (once) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!once) {
                        entry.target.classList.remove(visibleClass);
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, visibleClass, once]);

    return elementRef;
}

export default useScrollAnimation;
