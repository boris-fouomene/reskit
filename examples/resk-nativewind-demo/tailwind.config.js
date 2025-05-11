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
          DEFAULT: "red",
        }
      }
    },
  },
  plugins: [],
}
