/**
 * Design System Theme Tokens
 *
 * Centralized theme configuration for MerkadAgency.
 * Used across both marketing pages and Studio UI.
 */

export const theme = {
  colors: {
    // Base colors
    ink: {
      DEFAULT: '#0F1220',
      dark: '#0A0D15',
    },
    violet: {
      DEFAULT: '#5A27FF',
      light: '#7B4FFF',
      dark: '#4518CC',
    },
    teal: {
      DEFAULT: '#16B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
    },
    graycool: {
      DEFAULT: '#9CA3AF',
      light: '#D1D5DB',
      dark: '#6B7280',
    },
    pink: {
      DEFAULT: '#FBCBD5',
      light: '#FCE0E7',
      dark: '#F9A8BB',
    },
    white: '#FFFFFF',
  },

  gradients: {
    primary: 'bg-gradient-to-r from-violet to-purple-400',
    heading: 'bg-gradient-to-r from-white to-pink',
    card: 'bg-gradient-to-br from-violet/10 to-pink/5',
    button: 'bg-gradient-to-tr from-violet to-purple-400',
  },

  shadows: {
    glow: 'shadow-glow',
    glowSoft: 'shadow-glow-soft',
    soft: 'shadow-soft',
    softLg: 'shadow-soft-lg',
  },

  animations: {
    gradientShift: 'animate-gradient-shift',
    float: 'animate-float',
    glowPulse: 'animate-glow-pulse',
  },

  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    weights: {
      normal: 400,
      semibold: 600,
      bold: 700,
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
    },
  },

  spacing: {
    section: {
      sm: '4rem',   // 64px
      md: '6rem',   // 96px
      lg: '8rem',   // 128px
      xl: '10rem',  // 160px
    },
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
} as const;

/**
 * Utility function to generate gradient text classes
 */
export const gradientText = (from: string = 'white', to: string = 'pink') =>
  `bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`;

/**
 * Utility function to generate glass card classes
 */
export const glassCard = (variant: 'violet' | 'pink' | 'teal' = 'violet') => {
  const backgrounds = {
    violet: 'bg-[linear-gradient(135deg,rgba(90,39,255,0.10),rgba(251,203,213,0.05))]',
    pink: 'bg-[linear-gradient(135deg,rgba(251,203,213,0.15),rgba(90,39,255,0.05))]',
    teal: 'bg-[linear-gradient(135deg,rgba(22,184,166,0.10),rgba(90,39,255,0.05))]',
  };

  return `${backgrounds[variant]} border border-pink/30 backdrop-blur-sm`;
};

/**
 * Utility function to generate button variants
 */
export const buttonVariants = {
  primary: 'bg-gradient-to-tr from-violet to-purple-400 text-white shadow-glow hover:shadow-glow-soft hover:-translate-y-0.5 transition-all duration-200',
  secondary: 'border-2 border-pink text-pink hover:bg-pink/10 transition-colors duration-200',
  ghost: 'text-graycool hover:text-white hover:bg-white/5 transition-colors duration-200',
  outline: 'border border-violet/50 text-violet hover:bg-violet/10 transition-colors duration-200',
};

/**
 * Container max-width utility
 */
export const container = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

/**
 * Section spacing utility
 */
export const sectionSpacing = 'py-16 md:py-24 lg:py-32';
