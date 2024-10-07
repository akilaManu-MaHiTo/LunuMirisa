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
        'custom-white': '#F5F5F5',
        'custom-gray': '#212020',
        'custom-light': '#464545',
        'custom-dark': '#2C2C2C',
        'custom-toolight': '#999999',
        'custom-maroon': '#1A0E0E',
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
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        bounceCustom: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        spin_4991: 'spin_4991 4s infinite',
        'slide-in-right': 'slideInRight 0.7s forwards',
        'slide-out-left': 'slideOutLeft 0.7s forwards',
        'bounce-custom': 'bounceCustom 0.6s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in forwards',
        fadeOut: 'fadeOut 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
