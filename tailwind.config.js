const path = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [path.join(__dirname, 'src', 'components', '**', '*.{js,ts,jsx,tsx}')],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        focus: {
          DEFAULT: colors.indigo[500],
          dark: colors.indigo[300],
          100: colors.indigo[100],
          200: colors.indigo[200],
          300: colors.indigo[300],
          400: colors.indigo[400],
          500: colors.indigo[500],
          600: colors.indigo[600],
          700: colors.indigo[700],
          800: colors.indigo[800],
          900: colors.indigo[900],
        },
        primary: {
          DEFAULT: colors.sky[500],
          ...colors.sky,
        },
        onPrimary: {
          DEFAULT: colors.neutral[100],
          50: colors.neutral[900],
          100: colors.neutral[900],
          200: colors.neutral[900],
          300: colors.neutral[900],
          400: colors.neutral[900],
          500: colors.neutral[100],
          600: colors.neutral[100],
          700: colors.neutral[100],
          800: colors.neutral[100],
          900: colors.neutral[100],
        },
      },
      boxShadow: {
        right: '6px 1px 7px -3px rgb(0 0 0 / 20%)',
        left: '-6px 1px 7px -3px rgb(0 0 0 / 20%)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/forms'),
  ],
}
