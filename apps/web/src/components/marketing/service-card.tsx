'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  className?: string;
  onClick?: () => void;
}

/**
 * ServiceCard - Service offering display card
 * Used on homepage and services page
 */
export function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  className,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'glass-card-violet group relative rounded-xl p-6 transition-all duration-300',
        'hover:shadow-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 inline-flex rounded-lg bg-violet/20 p-3 transition-colors group-hover:bg-violet/30">
        <Icon className="h-6 w-6 text-violet" />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="mb-4 text-graycool">{description}</p>

      {/* Features list */}
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-graycool-light">
              <span className="mr-2 mt-0.5 text-violet">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-violet/0 to-pink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}
