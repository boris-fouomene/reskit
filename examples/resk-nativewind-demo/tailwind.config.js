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
        outline: {
          DEFAULT: "#79747E",
        },
        "dark-outline": {
          DEFAULT: '#938F99'
        }
      },
      spacing: {
        // w-100 = 400dp, w-96 = 384dp, etc.
        72: 288,
        80: 320,
        96: 384,
        100: 400,
        104: 416,
        112: 448,
        128: 512,
      },
    },
  },
  plugins: [],
}
