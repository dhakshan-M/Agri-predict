/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d', // Primary Forest Green
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdfbf7',
          100: '#f7f2ea',
          200: '#ece1cf',
          300: '#dfcbaf',
          400: '#cfb08c',
          500: '#ba9468',
          600: '#a37c52',
          700: '#78350f', // Earthy Brown
          800: '#451a03',
          900: '#290f02',
        }
      }
    },
  },
  plugins: [],
}
