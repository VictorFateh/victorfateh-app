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
          '0%': { opacity: '0', filter: 'blur(6px)', transform: 'translateY(10px)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
