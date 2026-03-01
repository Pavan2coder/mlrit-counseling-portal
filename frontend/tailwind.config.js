/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#08A045",
        secondary: "#ea580c"
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"]
      },
    },
  },
  plugins: [],
}