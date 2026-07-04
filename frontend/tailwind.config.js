/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#F8F7FF",
        accent: "#FF6584",
        success: "#43D9A2",
        warning: "#FFB347",
        dark: "#1A1A2E",
        card: "#16213E",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}