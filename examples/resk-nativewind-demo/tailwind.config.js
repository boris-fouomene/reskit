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
          DEFAULT: "#4CAF50"
        },
        "accent-foreground": {
          DEFAULT: "#FFFFFF",
        },
        neutral: {
          DEFAULT: "#625B71"
        },
        "neutral-foreground": {
          DEFAULT: "#FFFFFF",
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
        },
        "dark-primary": {
          DEFAULT: "#6750A4"
        },
        "dark-primary-foreground": {
          DEFAULT: "#FFFFFF",
        },
        "dark-secondary": {
          DEFAULT: "#625B71"
        },
        "dark-secondary-foreground": {
          DEFAULT: "#FFFFFF",
        },
        "dark-accent": {
          DEFAULT: "#4CAF50"
        },
        "dark-accent-foreground": {
          DEFAULT: "#FFFFFF",
        },
        "dark-neutral": {
          DEFAULT: "#625B71"
        },
        "dark-neutral-foreground": {
          DEFAULT: "#FFFFFF",
        },
        "dark-info": {
          DEFAULT: "#2196F3"
        },
        "dark-info-foreground": {
          DEFAULT: "#FFFFFF"
        },
        "dark-success": {
          DEFAULT: "#4CAF50"
        },
        "dark-success-foreground": {
          DEFAULT: "#FFFFFF"
        },
        "dark-warning": {
          DEFAULT: "#FF9800",
        },
        "dark-warning-foreground": {
          DEFAULT: "#000000"
        },
        "dark-error": {
          DEFAULT: "#B3261E",
        },
        "dark-error-foreground": {
          DEFAULT: "#FFFFFF",
        },
        "dark-surface": {
          DEFAULT: "#E7E0EC"
        },
        "dark-surface-foreground": {
          DEFAULT: "#1C1B1F",
        },
      },
      spacing11: {
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
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary': theme('colors.primary'),
          '--color-primary-foreground': theme('colors.primary-foreground'),
          '--color-secondary': theme('colors.secondary'),
          '--color-secondary-foreground': theme('colors.secondary-foreground'),
          '--color-accent': theme('colors.accent'),
          '--color-accent-foreground': theme('colors.accent-foreground'),
          '--color-info': theme('colors.info'),
          '--color-info-foreground': theme('colors.info-foreground'),
          '--color-success': theme('colors.success'),
          '--color-success-foreground': theme('colors.success-foreground'),
          '--color-warning': theme('colors.warning'),
          '--color-warning-foreground': theme('colors.warning-foreground'),
          '--color-error': theme('colors.error'),
          '--color-error-foreground': theme('colors.error-foreground'),
          '--color-surface': theme('colors.surface'),
          '--color-surface-foreground': theme('colors.surface-foreground'),
          '--color-outline': theme('colors.outline'),
          '--color-dark-outline': theme('colors.dark-outline'),
          '--color-dark-primary': theme('colors.dark-primary'),
          '--color-dark-primary-foreground': theme('colors.dark-primary-foreground'),
          '--color-dark-secondary': theme('colors.dark-secondary'),
          '--color-dark-secondary-foreground': theme('colors.dark-secondary-foreground'),
          '--color-dark-accent': theme('colors.dark-accent'),
          '--color-dark-accent-foreground': theme('colors.dark-accent-foreground'),
          '--color-dark-info': theme('colors.dark-info'),
          '--color-dark-info-foreground': theme('colors.dark-info-foreground'),
          '--color-dark-success': theme('colors.dark-success'),
          '--color-dark-success-foreground': theme('colors.dark-success-foreground'),
          '--color-dark-warning': theme('colors.dark-warning'),
          '--color-dark-warning-foreground': theme('colors.dark-warning-foreground'),
          '--color-dark-error': theme('colors.dark-error'),
          '--color-dark-error-foreground': theme('colors.dark-error-foreground'),
          '--color-dark-surface': theme('colors.dark-surface'),
          '--color-dark-surface-foreground': theme('colors.dark-surface-foreground'),
        },
        '@media (prefers-color-scheme: dark)': {
          ':root': {
            '--color-primary': theme('colors.dark-primary'),
            '--color-primary-foreground': theme('colors.dark-primary-foreground'),
            '--color-secondary': theme('colors.dark-secondary'),
            '--color-secondary-foreground': theme('colors.dark-secondary-foreground'),
            '--color-accent': theme('colors.dark-accent'),
            '--color-accent-foreground': theme('colors.dark-accent-foreground'),
            '--color-info': theme('colors.dark-info'),
            '--color-info-foreground': theme('colors.dark-info-foreground'),
            '--color-success': theme('colors.dark-success'),
            '--color-success-foreground': theme('colors.dark-success-foreground'),
            '--color-warning': theme('colors.dark-warning'),
            '--color-warning-foreground': theme('colors.dark-warning-foreground'),
            '--color-error': theme('colors.dark-error'),
            '--color-error-foreground': theme('colors.dark-error-foreground'),
            '--color-surface': theme('colors.dark-surface'),
            '--color-surface-foreground': theme('colors.dark-surface-foreground'),
            '--color-outline': theme('colors.dark-outline'),
            '--color-dark-outline': theme('colors.outline'),
          },
        },
      })
    },
  ],
}
