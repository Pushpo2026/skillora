/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefcf6',
          100: '#d4f7e8',
          200: '#abefd2',
          300: '#75e0b8',
          400: '#3ccb98',
          500: '#18b07e',
          600: '#0d8f66',
          700: '#0d7253',
          800: '#0e5a44',
          900: '#0d4a39',
          950: '#022c20',
        },
        accent: {
          50: '#fff8eb',
          100: '#feeac7',
          200: '#fdd98a',
          300: '#fcbf4d',
          400: '#fba128',
          500: '#f97b16',
          600: '#ea5c0c',
          700: '#c23d0c',
          800: '#9a3011',
          900: '#7c2812',
          950: '#451306',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 30px -12px rgb(0 0 0 / 0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
