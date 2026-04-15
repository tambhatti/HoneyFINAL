/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        baskerville: ["'Baskerville Old Face'", "'Libre Baskerville'", 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#F5F5EF',
        green: { DEFAULT: '#174a37', dark: '#1a5c45' },
        gold: { DEFAULT: '#CFB383', dark: '#a08860' },
      },
    },
  },
  plugins: [],
};
