import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-violet text-white shadow',
        secondary: 'border-transparent bg-teal/20 text-teal',
        destructive: 'border-transparent bg-red-500/20 text-red-400',
        outline: 'border-violet/50 text-violet',
        pink: 'border-transparent bg-pink/20 text-pink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
