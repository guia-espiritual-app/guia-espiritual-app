/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          dark: '#1a1a2e',
          purple: '#8b5cf6',
          gold: '#d4af37',
          light: '#a78bfa',
        },
      },
    },
  },
  plugins: [],
}
