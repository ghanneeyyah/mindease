/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#f4f7f2",
          100: "#e3ecdf",
          200: "#c7d9bf",
          300: "#a3bf97",
          400: "#7fa070",
          500: "#5f8450",
          600: "#4a6a3d",
          700: "#3b5231",
          800: "#2e4226",
          900: "#24351e",
        },
        warm: {
          50: "#fffaf5",
          100: "#fff0e6",
          200: "#ffe0cc",
          300: "#ffccaa",
          400: "#ffb380",
          500: "#ff9966",
        },
        crisis: {
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#b45309",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "breathe-in": "breatheIn 4s ease-in-out",
        "breathe-out": "breatheOut 6s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-in",
      },
      keyframes: {
        breatheIn: {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.2)", opacity: "1" },
        },
        breatheOut: {
          "0%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0.6" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};