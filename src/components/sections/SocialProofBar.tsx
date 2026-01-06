import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Users, Boxes, DollarSign } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: '196%',
    label: 'Revenue Growth',
    color: 'text-merkad-green'
  },
  {
    icon: Users,
    value: '50+',
    label: 'Automations Deployed',
    color: 'text-merkad-purple-light'
  },
  {
    icon: Boxes,
    value: '3',
    label: 'Industries Specialized',
    color: 'text-pink-400'
  },
  {
    icon: DollarSign,
    value: '$2M+',
    label: 'Revenue Generated',
    color: 'text-amber-400'
  }
];

export function SocialProofBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate on mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-merkad-bg-elevated/50 border-y border-white/5 backdrop-blur-sm relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-merkad-purple/5 via-transparent to-merkad-purple/5" />

      <div className="container-custom py-6">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className={cn("p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className={cn("text-2xl font-mono font-bold text-glow", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-xs text-merkad-text-secondary font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
              {/* Separator except for last item */}
              {index < stats.length - 1 && (
                <div className="h-8 w-px bg-white/10 ml-8" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile View (Carousel) */}
        <div className="md:hidden relative h-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 flex items-center justify-center gap-4 transition-all duration-500 transform",
                index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className={cn("text-xl font-mono font-bold text-glow", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-xs text-merkad-text-secondary font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Indicators */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
            {stats.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-1 h-1 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-white w-3" : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}