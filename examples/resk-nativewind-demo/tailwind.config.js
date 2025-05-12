import { warn } from 'console';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "../../packages/resk-nativewind/build/**/*.js",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6750A4",
        },
        "primary-foreground": {
          DEFAULT: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#625B71"
        },
        "secondary-foreground": {
          DEFAULT: "#FFFFFF",
        },
        accent: {

        },
        neutral: {

        },
        info: {
          DEFAULT: "#2196F3"
        },
        "info-foreground": {
          DEFAULT: "#FFFFFF"
        },
        success: {
          DEFAULT: "#4CAF50"
        },
        "success-foreground": {
          DEFAULT: "#FFFFFF"
        },
        warning: {
          DEFAULT: "#FF9800",
        },
        "warning-foreground": {
          DEFAULT: "#000000"
        },
        error: {
          DEFAULT: "#B3261E",
        },
        "error-foreground": {
          DEFAULT: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#E7E0EC"
        },
        "surface-foreground": {
          DEFAULT: "#1C1B1F",
        },
      }
    },
  },
  plugins: [],
}
