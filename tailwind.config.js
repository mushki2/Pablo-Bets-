/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'arb-dark': '#001a00',
        'arb-green': '#003300',
        'arb-lime': '#00ff00',
        'arb-profit': '#00ff00',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
