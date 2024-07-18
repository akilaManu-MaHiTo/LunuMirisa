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
        'custom-black': '#222222',
        'custom-white': '#fafafa',
        'custom-gray': '#191919'
      },
    },
  },
  plugins: [],
}
