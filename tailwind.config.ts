import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0D2B20',
          deep: '#061D15',
          soft: '#163D2F',
        },
        gold: {
          DEFAULT: '#059669',
          bright: '#34D399',
          deep: '#047857',
        },
        ruby: {
          DEFAULT: '#DC2626',
          bright: '#F87171',
          deep: '#991B1B',
        },
        emerald: {
          DEFAULT: '#059669',
          bright: '#10B981',
          light: '#D1FAE5',
          deep: '#047857',
          dark: '#064E3B',
        },
        ivory: {
          DEFAULT: '#F3F8F5',
          warm: '#E5F0EB',
        },
        stone: {
          DEFAULT: '#395347',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      boxShadow: {
        card: '0 20px 50px -20px rgba(6,29,21,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
