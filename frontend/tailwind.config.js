/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#EB5E28',
          'orange-hover': '#d44e1e',
          'orange-light': '#FFF0EB',
          charcoal: '#252422',
          'charcoal-light': '#3d3a37',
          cream: '#FFFBF7',
          'warm-gray': '#F5F0EB',
          muted: '#7A7570',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '22px',
        '4xl': '32px',
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        'slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
