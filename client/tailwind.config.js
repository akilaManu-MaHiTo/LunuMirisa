/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-cyan': '#00bcd4',
        'custom-black': '#3f3d3d',
        'custom-white': '#fafafa',
        'custom-gray': '#272829',
        'custom-light': '#61677A',
      },
      fontFamily: {
        'spartan': ['League Spartan', 'sans-serif'],
      },
      screens: {
        'custom-md': '1200px',
      },
    },
  },
  plugins: [],
}
