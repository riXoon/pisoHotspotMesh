/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glow-cyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-cyan': {
          '0%': { 'box-shadow': '0 0 5px rgba(6, 182, 212, 0.2), 0 0 10px rgba(6, 182, 212, 0.2)' },
          '100%': { 'box-shadow': '0 0 15px rgba(6, 182, 212, 0.6), 0 0 25px rgba(6, 182, 212, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}

