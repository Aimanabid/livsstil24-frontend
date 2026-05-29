/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        secondary: ['"Glacial Indifference"', 'Arial', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FAFAF7',
          100: '#F4F0EA',
          200: '#E9E3DA',
          300: '#D9D0C4',
        },
        gold: {
          400: '#C8AC82',
          500: '#B89B72',
          600: '#9A8262',
        },
        olive: {
          500: '#5A5B46',
          600: '#4A4B38',
          700: '#3A3B2A',
        },
        mocha: {
          400: '#B8A898',
          500: '#A39284',
        },
        charcoal: {
          800: '#0E0E0E',
          900: '#000000',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    }
  },
  plugins: []
};
