// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use Lora everywhere as your signature font
        body: ["Lora", "serif"],
        title: ["Lora", "serif"],
      },
      colors: {
        // background, accents, borders, buttons
        "story-bg": "#fdf6e3",
        "story-accent": "#2f1c12",
        "storybook-border": "#e8dbc7",
        "storybook-btn": {
          DEFAULT: "#6478e3",
          hover: "#5265c9",
        },
      },
      boxShadow: {
        // soft “storybook” shadow
        storybook: "0 10px 25px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
