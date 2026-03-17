/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.html",
  ],
  safelist: ['animate-fade-in'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
          'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"',
          'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"',
          '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"',
        ],
        system: [
          'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"',
          'sans-serif',
        ],
      },
      colors: {
        'dark-bg': '#0a0a14',
        'dark-text': '#dddddd',
        'dark-heading': '#eeeeee',
        'accent': '#4f46e5',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
    },
  },
  plugins: [],
}
