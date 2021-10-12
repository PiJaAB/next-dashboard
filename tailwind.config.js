const path = require('path');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: [path.join(__dirname, 'src', 'components', '**', '*.{js,ts,jsx,tsx}')],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: {
          DEFAULT: colors.sky[500],
          ...colors.sky,
        },
        onPrimary: {
          DEFAULT: colors.trueGray[100],
          50: colors.trueGray[900],
          100: colors.trueGray[900],
          200: colors.trueGray[900],
          300: colors.trueGray[900],
          400: colors.trueGray[900],
          500: colors.trueGray[100],
          600: colors.trueGray[100],
          700: colors.trueGray[100],
          800: colors.trueGray[100],
          900: colors.trueGray[100],
        },
      },
      boxShadow: {
        right: '6px 1px 7px -3px rgb(0 0 0 / 20%)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
