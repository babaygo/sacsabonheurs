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
      fontFamily: {
         sans: ["var(--font-montserrat)"],
         mono: ["var(--font-playfair-display)"],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: []
}
