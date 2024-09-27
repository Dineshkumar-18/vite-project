/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor: '#00163D',
        secondary: '#F5EFFF',  // Your custom color
        flightbg: "#f7f7f7",
        'neutral-100': '#e6e6e6',
        'secondary-500': '#36c',
        'neutral-400': '#999',
        'custom-dark': '#471d36'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        outfit: ['Outfit','sans-serif']
      },
    },
  },
  variants: {
    extend: {
      cursor: ['active'],
      borderColor: ['active', 'focus', 'hover', 'group-hover'],
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide') 
  ],
}

