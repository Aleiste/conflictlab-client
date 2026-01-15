/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game': {
          'bg': '#0a0a0f',
          'card': '#12121a',
          'accent': '#6366f1',
          'accent-light': '#818cf8',
          'success': '#10b981',
          'warning': '#f59e0b',
          'danger': '#ef4444',
          'assistant': '#8b5cf6',
          'ingenieur': '#3b82f6'
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
