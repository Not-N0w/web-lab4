/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
    "./src/**/*.component.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface-color)",
        primary: "var(--primary-color)",
        light: "var(--light-color)",
      },
      fontFamily: {
        base: "var(--font-base)",
      },
      fontSize: {
        base: "var(--base-font-size)",
      },
      lineHeight: {
        base: "var(--base-line-height)",
      }
    },
  },
  plugins: [],
}
