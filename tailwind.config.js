/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,hbs,handlebars,ts}'],
  darkMode: false,
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
