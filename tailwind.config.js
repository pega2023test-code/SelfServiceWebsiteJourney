/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001F3F',
        accent: '#155DFC',
        gold: '#F59E0B',
        bgMain: '#DEE6EC',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
