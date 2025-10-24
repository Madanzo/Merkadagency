import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand colors
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
      },
      gradientColorStops: (theme: any) => ({
        'brand-a': theme('colors.violet.DEFAULT'),
        'brand-b': theme('colors.pink.DEFAULT'),
        'brand-dark-0': '#0F1220',
        'brand-dark-1': '#1A1D2E',
      }),
      boxShadow: {
        glow: '0 8px 30px rgba(90, 39, 255, 0.35)',
        'glow-soft': '0 4px 20px rgba(90, 39, 255, 0.2)',
        soft: '0 10px 30px rgba(251, 203, 213, 0.18)',
        'soft-lg': '0 15px 40px rgba(251, 203, 213, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 8px 30px rgba(90, 39, 255, 0.35)' },
          '50%': { boxShadow: '0 8px 40px rgba(90, 39, 255, 0.5)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
