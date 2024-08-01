/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { "custom-gray": "#888", "custom-black": "#1d1d1f" },
    },
  },
  plugins: [],
};
