'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Particle {
    id: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
}

interface UseParticlesOptions {
    /** Interval between creating new particles (ms) */
    interval?: number;
    /** How long particles live before being removed (ms) */
    lifetime?: number;
    /** Maximum number of particles at once */
    maxParticles?: number;
    /** Initial number of particles to render */
    initialCount?: number;
    /** Whether to auto-start particle generation */
    autoStart?: boolean;
}

/**
 * React-idiomatic hook for particle effects.
 * Replaces direct DOM manipulation with state-based approach.
 * 
 * @example
 * const { particles, containerRef } = useParticles({ interval: 3000 });
 * 
 * return (
 *   <div ref={containerRef} className="particles">
 *     {particles.map(p => (
 *       <div
 *         key={p.id}
 *         className="particle"
 *         style={{
 *           left: `${p.left}%`,
 *           animationDelay: `${p.animationDelay}s`,
 *           animationDuration: `${p.animationDuration}s`
 *         }}
 *       />
 *     ))}
 *   </div>
 * );
 */
export function useParticles(options: UseParticlesOptions = {}) {
    const {
        interval = 3000,
        lifetime = 25000,
        maxParticles = 20,
        initialCount = 9,
        autoStart = true,
    } = options;

    const [particles, setParticles] = useState<Particle[]>([]);
    const [isRunning, setIsRunning] = useState(autoStart);
    const containerRef = useRef<HTMLDivElement>(null);
    const idCounter = useRef(0);

    // Generate initial particles
    useEffect(() => {
        const initialParticles: Particle[] = Array.from(
            { length: initialCount },
            (_, i) => ({
                id: idCounter.current++,
                left: (i + 1) * 10,
                animationDelay: i * 2,
                animationDuration: 20,
            })
        );
        setParticles(initialParticles);
    }, [initialCount]);

    // Create a new particle
    const createParticle = useCallback((): Particle => {
        return {
            id: idCounter.current++,
            left: Math.random() * 100,
            animationDelay: Math.random() * 20,
            animationDuration: 15 + Math.random() * 10,
        };
    }, []);

    // Remove a particle by ID
    const removeParticle = useCallback((id: number) => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
    }, []);

    // Add new particles periodically
    useEffect(() => {
        if (!isRunning) return;

        const intervalId = setInterval(() => {
            setParticles((prev) => {
                // Don't add more if at max
                if (prev.length >= maxParticles) return prev;

                const newParticle = createParticle();

                // Schedule removal after lifetime
                setTimeout(() => {
                    removeParticle(newParticle.id);
                }, lifetime);

                return [...prev, newParticle];
            });
        }, interval);

        return () => clearInterval(intervalId);
    }, [isRunning, interval, lifetime, maxParticles, createParticle, removeParticle]);

    // Control functions
    const start = useCallback(() => setIsRunning(true), []);
    const stop = useCallback(() => setIsRunning(false), []);
    const clear = useCallback(() => setParticles([]), []);

    return {
        particles,
        containerRef,
        isRunning,
        start,
        stop,
        clear,
    };
}

export default useParticles;
