/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        weather: {
          clear: {
            from: '#fef08a',
            to: '#fde047',
          },
          cloudy: {
            from: '#e5e7eb',
            to: '#9ca3af',
          },
          rainy: {
            from: '#bfdbfe',
            to: '#60a5fa',
          },
          snowy: {
            from: '#e0f2fe',
            to: '#bae6fd',
          },
          default: {
            from: '#eff6ff',
            to: '#dbeafe',
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
