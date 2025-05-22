/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../packages/resk-nativewind/build/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}