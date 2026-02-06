/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF", // Deep Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F59E0B", // Bright Yellow
          foreground: "#1F2937",
        },
        background: "#F3F4F6", // Light Gray for background
        foreground: "#1F2937", // Dark Gray for text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Noto Sans SC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
