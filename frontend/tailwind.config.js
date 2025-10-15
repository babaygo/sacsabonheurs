module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#6B2E1C',
        secondary: '#F6E1D5',
        accent: '#D2B48C',
        neutral: '#FAF8F6',
        text: '#3C3C3C',
      },
      fontFamily: {
        sans: ["var(--font-montserrat)"],
        serif: ["var(--font-playfair-display)"],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: []
}
