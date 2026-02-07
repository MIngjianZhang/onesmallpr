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
        // RPG Theme Colors
        guild: {
          wood: "#5D4037", // Dark Wood
          "wood-light": "#8D6E63", // Light Wood
          bronze: "#CD7F32", // Bronze/Copper
          gold: "#FFD700", // Gold
          parchment: "#F5E6CA", // Parchment/Paper
          "parchment-dark": "#E6D0A5",
          red: "#B91C1C", // Wax Seal Red
          green: "#15803D", // Success Green
        },
        primary: {
          DEFAULT: "#5D4037", // Default to Wood
          foreground: "#F5E6CA", // Parchment text
        },
        secondary: {
          DEFAULT: "#CD7F32", // Bronze
          foreground: "#FFFFFF",
        },
        background: "#2C1810", // Very Dark Wood/Shadow for overall background
        foreground: "#F5E6CA", // Parchment text by default
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Cinzel", "serif"], // Medieval/Fantasy Font (Need to import)
        handwritten: ["Dancing Script", "cursive"], // For Scrolls
      },
      backgroundImage: {
        'guild-hall': "url('/assets/guild-hall-bg.jpg')", // Placeholder
        'wood-texture': "url('/assets/wood-pattern.png')", // Placeholder
        'parchment-texture': "url('/assets/parchment.png')", // Placeholder
      }
    },
  },
  plugins: [],
};
