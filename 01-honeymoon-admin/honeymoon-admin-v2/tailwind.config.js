/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#F5F5EF',
        'cream-dark': '#E8E0D0',
        green:   { DEFAULT: '#174a37', dark: '#1a5c45' },
        gold:    { DEFAULT: '#CFB383', dark: '#B8A06E' },
      },
      fontFamily: {
        baskerville: ["'Baskerville Old Face'", "'Libre Baskerville'", 'Georgia', 'serif'],
        serif: ["'Libre Baskerville'", 'Georgia', 'serif'],
        sans:  ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        modal: '0 20px 60px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
