import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Primary: "#FFC800",
        btnHover: "#edab03",
        violetLight: "#a36ee0",
        violetDark: "#6a39a1",
        normalViolet: "#8B5BF6",
        black: "#1f1132",
        bgColor: "#E8EAEC",
        leaf: "#149777",
        brown: "#673500",
      },
      fontFamily: {
        sofadi: ["Sofadi One", "cursive"],
        roboto: ["Roboto Condensed", "sans-serif"],
        notSerif: ["Noto Serif JP", "seri"],
        poppins: ["Poppins", "sans-serif"],
        titleFont: ["Neuton", "sans-serif"],
        captcha: ["Indie Flower", "serif"],
        // captcha: ["Monofett", "serif"],
      },
    },
  },
  plugins: [daisyui],
};
