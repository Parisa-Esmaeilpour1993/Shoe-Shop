/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./PROJECT-JS/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      fontFamily: {
        inter: ["Inter"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
