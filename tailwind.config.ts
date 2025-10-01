import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Container queries support
      containerType: {
        'inline-size': 'inline-size',
        'size': 'size',
      },
      // Colors remain using CSS variables for easy theming
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
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(10px)' },
        },
        // Scroll-driven animation keyframes
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'reveal': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
      },
      animation: {
        in: 'in 200ms ease-out',
        out: 'out 200ms ease-in',
        'fade-in-up': 'fade-in-up 400ms ease-out',
        'scale-up': 'scale-up 300ms ease-out',
        'reveal': 'reveal 500ms ease-in-out',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;