/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: '#1A1A1A',
        clay: '#FF6B35',
        cream: '#F0F0F0',
        charcoal: '#0A0A0A',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
};
