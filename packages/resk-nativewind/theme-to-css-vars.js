/**
 * Tailwind CSS plugin function that generates CSS custom properties from theme colors.
 * 
 * This plugin processes your Tailwind theme colors and creates corresponding CSS custom properties
 * that can be used throughout your application. It provides automatic dark mode support by
 * detecting colors prefixed with "dark-" and applying them when the user's system preference
 * is set to dark mode.
 * 
 * **Features:**
 * - 🎨 Converts all theme colors to CSS custom properties
 * - 🌙 Automatic dark mode support via `prefers-color-scheme`
 * - 📱 Responsive color switching without JavaScript
 * - 🔧 Zero configuration required
 * - ⚡ Build-time generation for optimal performance
 * 
 * **Color Naming Convention:**
 * - Regular colors: `primary` → `--color-primary`  
 * - Nested colors: `gray.500` → `--color-gray-500`
 * - Dark mode colors: `dark-primary` → Applied in dark mode media query
 * 
 * @param {Object} tailwindApi - Tailwind CSS plugin API object
 * @param {Function} tailwindApi.addBase - Function to add base styles to Tailwind
 * @param {Function} tailwindApi.theme - Function to access theme configuration
 * 
 * @returns {void} This function doesn't return a value, it registers base styles
 * 
 * @see {@link https://tailwindcss.com/docs/plugins|Tailwind CSS Plugin Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/--*|CSS Custom Properties}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme|prefers-color-scheme}
 * 
 *  * @fileoverview Converts Tailwind color palette to CSS custom properties with automatic dark mode detection
 * @version 1.0.0
 * @author Your Name
 * @since 1.0.0
 * 
 * @example
 * ```javascript
 * // tailwind.config.js
 * module.exports = {
 *   theme: {
 *     colors: {
 *       primary: '#3b82f6',
 *       'dark-primary': '#1d4ed8',
 *       secondary: {
 *         100: '#f1f5f9',
 *         500: '#64748b'
 *       }
 *     }
 *   },
 *   plugins: [
 *     require('@resk/nativewind/theme-to-css-vars')({
 *   ]
 * }
 * ```
 * 
 * @example
 * ```css
 * //Generated CSS output 
 * :root {
 *   --color-primary: #3b82f6;
 *   --color-secondary-100: #f1f5f9;
 *   --color-secondary-500: #64748b;
 * }
 * 
 * @media (prefers-color-scheme: dark) {
 *   :root {
 *     --color-primary: #1d4ed8;
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 */
module.exports = function themeToCssVars({ addBase, theme }) {
    const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default
    const colors = flattenColorPalette(theme('colors'))
    const darkColors = {};
    const cssVariables = Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
            const keyValue = `--color-${key.replace(/[.]/g, '-').toLowerCase()}`;
            if (key.startsWith("dark-")) {
                darkColors[keyValue] = value;
            }
            return [
                keyValue,
                value
            ]
        })
    )
    addBase({
        ':root': cssVariables,
        '@media (prefers-color-scheme: dark)': {
            ':root': darkColors
        },
    })
}