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
        'custom-black': '#0B0B0B',
        'custom-white': '#fafafa',
        'custom-gray': '#212020',
        'custom-light': '#464545',
        'custom-dark': '#2C2C2C',
      },
      fontFamily: {
        'spartan': ['League Spartan', 'sans-serif'],
      },
      screens: {
        'custom-md': '1600px',
        'custom1-md': '940px', 
      },
      backgroundImage: {
        'footer-bg': "url('Images/footerbg.jpg')",
    }
    },
  },
  plugins: [],
}
