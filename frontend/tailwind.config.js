/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2E7D5B',
          accent: '#1E3A5F',
        },
        // Eco pillar colors
        eco: {
          green: '#16a34a',
          'green-dark': '#15803d',
          'green-light': '#f0fdf4',
          blue: '#2563eb',
          'blue-light': '#eff6ff',
          violet: '#7c3aed',
          'violet-light': '#f5f3ff',
          orange: '#ea580c',
          'orange-light': '#fff7ed',
          teal: '#0d9488',
          'teal-light': '#f0fdfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        eco: '0 8px 30px rgb(22 163 74 / 0.15)',
      },
    },
  },
  plugins: [],
}
