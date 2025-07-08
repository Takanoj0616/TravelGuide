/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#FFF8F9',
          100: '#FFE7ED',
          200: '#FFD4DB',
          300: '#FFB7C5',
          400: '#FF8DA1',
          500: '#FF6B86',
          600: '#FF4B6B',
          700: '#E63946',
          800: '#C53030',
          900: '#9B2C2C',
        },
        gold: {
          50: '#FFFBF0',
          100: '#FFF5D6',
          200: '#FFEBAD',
          300: '#FFD700',
          400: '#FFC107',
          500: '#FFB300',
          600: '#FF9800',
          700: '#FF6F00',
          800: '#E65100',
          900: '#BF360C',
        },
        indigo: {
          50: '#F0F4FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        japanese: ['Noto Sans JP', 'sans-serif'],
        korean: ['Noto Sans KR', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'gradient-y': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
        },
        'gradient-xy': {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
          '50%': { 'background-size': '400% 400%', 'background-position': 'right center' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 183, 197, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(255, 183, 197, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(45deg, #FFB7C5 0%, #FFD700 25%, #6366F1 50%, #22C55E 75%, #FFB7C5 100%)',
        'sakura-gradient': 'linear-gradient(135deg, #FFB7C5 0%, #FF8DA1 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
        'indigo-gradient': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        'forest-gradient': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};
