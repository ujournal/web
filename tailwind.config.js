/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./_frontend/**/*.{html,css,js}",
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./index.html",
    "./editor.html",
    "./finder.html",
  ],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn .1s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },

      backgroundPosition: {
        "select-arrow": "center right 0.5rem",
      },
    },
  },
  plugins: [],
};
