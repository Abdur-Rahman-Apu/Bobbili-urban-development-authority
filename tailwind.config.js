import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#FFD66C",
        btnHover: "#edab03",
        violetLight: "#a36ee0",
        violetDark: "#6a39a1",
        normalViolet: "#8B5BF6",
        black: "#1f1132",
        bgColor: "#E8EAEC",
      },
      fontFamily: {
        sofadi: ["Sofadi One", "cursive"],
        roboto: ["Roboto Condensed", "sans-serif"],
        notSerif: ["Noto Serif JP", "seri"],
        poppins: ["Poppins", "sans-serif"],
        titleFont: ["Neuton", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
};
