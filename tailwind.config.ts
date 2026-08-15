import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:   '#0F3B78',
        gold:   '#D4AF37',
        cream:  '#F8F5EE',
        'cream-2': '#F0EBE0',
        dark:   '#0F1B35',
        'dark-2': '#162040',
        islamic: '#1B5E20',
      },
      fontFamily: { sans: ['Inter', 'Arial', 'sans-serif'] },
      boxShadow: {
        luxury: '0 20px 60px rgba(15,59,120,.1)',
        gold:   '0 8px 32px rgba(212,175,55,.25)',
        card:   '0 4px 24px rgba(0,0,0,.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;