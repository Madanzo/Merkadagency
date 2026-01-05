import { useEffect, useRef, useState } from 'react';

const metrics = [
  { value: '$2.4M+', label: 'Revenue Generated for Clients' },
  { value: '150-200%', label: 'Average Growth' },
  { value: '< 2 Min', label: 'Response Time' },
  { value: '90 Days', label: 'To See Results' },
];

export function SocialProofBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-12 border-y border-white/5 bg-merkad-bg-primary/50">
      <div className="container-custom">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl lg:text-3xl font-mono font-bold text-merkad-purple-light text-glow">
                {metric.value}
              </div>
              <div className="text-sm text-merkad-text-muted mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}