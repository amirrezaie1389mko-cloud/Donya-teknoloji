/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#080B0C',
        surface: '#0D1113',
        card: '#171A1C',
        elevated: '#1D2022',
        gold: '#D7B77A',
        bronze: '#B9955F',
        'ghost-white': '#F5F3EE',
        'silver-halide': '#B8B7B1',
        muted: '#858783',
        'subtle-border': 'rgba(255,255,255,0.09)',
      },
      fontFamily: {
        sans: ['Vazirmatn Variable', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
