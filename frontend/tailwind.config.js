/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        weather: {
          clear:   { from: '#fef08a', to: '#fde047' },
          cloudy:  { from: '#e5e7eb', to: '#9ca3af' },
          rainy:   { from: '#bfdbfe', to: '#60a5fa' },
          snowy:   { from: '#e0f2fe', to: '#bae6fd' },
          default: { from: '#eff6ff', to: '#dbeafe' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow-blue':  '0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)',
        'glow-amber': '0 0 30px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)',
        'glow-cyan':  '0 0 30px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.15)',
        'card':  '0 8px 32px rgba(0,0,0,0.22)',
        'card-lg': '0 20px 60px rgba(0,0,0,0.35)',
      },
      keyframes: {
        'float': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'bounce-gentle': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'float':          'float 5s ease-in-out infinite',
        'shimmer':        'shimmer 2s infinite',
        'fade-in':        'fade-in 0.5s ease-out',
        'bounce-gentle':  'bounce-gentle 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
