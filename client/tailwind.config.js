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
        'custom-toolight':'#999999',
        'custom-maroon':'#1A0E0E',
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
      },
      keyframes: {
        spin_4991: {
          '10%': { transform: 'translateY(-102%)' },
          '25%': { transform: 'translateY(-100%)' },
          '35%': { transform: 'translateY(-202%)' },
          '50%': { transform: 'translateY(-200%)' },
          '60%': { transform: 'translateY(-302%)' },
          '75%': { transform: 'translateY(-300%)' },
          '85%': { transform: 'translateY(-402%)' },
          '100%': { transform: 'translateY(-400%)' },
        },
      },
      animation: {
        spin_4991: 'spin_4991 4s infinite',
      },
    },
  },
  plugins: [],
}
