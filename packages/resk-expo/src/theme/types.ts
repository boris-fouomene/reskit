import { Material3Scheme } from '@pchmn/expo-material3-theme';

/**
 * @interface IThemeColors
 * Represents the colors available in a theme, extending the default `Material3Scheme`.
 * 
 * This includes optional custom colors for various application states like warnings, success, info, etc.
 * 
 * @typedef {Object} IThemeColors
 * @property {string} [warning] - The color used for warnings.
 * @property {string} [onWarning] - The color applied on top of the warning background (e.g., text or icons).
 * @property {string} [statusBar] - The color of the status bar.
 * @property {string} [info] - The color used for informational messages.
 * @property {string} [onInfo] - The color applied on top of the info background.
 * @property {string} [success] - The color used for success states.
 * @property {string} [onSuccess] - The color applied on top of the success background.
 * @property {string} [error] - The color used for error states.
 * @property {string} [onError] - The color applied on top of the error background.
 * 
 * @example
 * ```ts
 * const themeColors: IThemeColors = {
 *    primary: "#6200EE",
 *    onPrimary: "#FFFFFF",
 *    warning: "#FFA726",
 *    onWarning: "#FFFFFF",
 *    statusBar: "#000000"
 * };
 * ```
 */
export type IThemeColors = Material3Scheme & {
    text?: string;
    warning?: string;
    onWarning?: string;
    statusBar?: string;
    info?: string;
    onInfo?: string;
    success?: string;
    onSuccess?: string;
    error?: string;
    onError?: string;
};

/**
 * @interface  ITheme
 * Defines the theme structure for the application.
 * 
 * This includes the theme name, color scheme, and helper methods for retrieving specific colors or color schemes.
 * 
 * @typedef {Object} ITheme
 * @property {string} [name] - The name of the theme.
 * @property {boolean | number} [dark] - Whether the theme is in dark mode (`true` for dark, `false` for light, or a number to indicate the intensity).
 * @property {string} [customCSS] - Custom CSS properties applied to the theme (mainly for web platforms).
 * @property {IThemeColors} colors - The set of colors associated with the theme.
 * 
 * @method getColor
 * @description Retrieves a specific color from the theme based on the color key.
 * @param {string | keyof IThemeColors} [color] - The key of the color to retrieve (e.g., "primary", "warning").
 * @param {...any[]} defaultColors - Default colors to return if the requested color is not found.
 * @returns {string | undefined} The color string if found, otherwise one of the default colors.
 * 
 * @method getColorScheme
 * @description Retrieves a color scheme with `color` and `backgroundColor` based on the provided color scheme key.
 * @param {keyof IThemeColors} [colorSheme] - The key of the color scheme to retrieve (e.g., "primary", "error").
 * @returns {IColorSheme} An object containing `color` and `backgroundColor` properties.
 * 
 * @example
 * ```ts
 * const theme: ITheme = {
 *    name: "DarkTheme",
 *    dark: true,
 *    colors: {
 *      primary: "#6200EE",
 *      onPrimary: "#FFFFFF",
 *      error: "#B00020",
 *      onError: "#FFFFFF"
 *    },
 *    getColor: (color, ...defaultColors) => {
 *      return theme.colors[color] || defaultColors[0];
 *    },
 *    getColorScheme: (colorScheme) => ({
 *      color: theme.colors[colorScheme],
 *      backgroundColor: theme.colors.onPrimary,
 *    })
 * };
 * 
 * const primaryColor = theme.getColor("primary", "#000000"); // "#6200EE"
 * const errorScheme = theme.getColorScheme("error"); // { color: "#B00020", backgroundColor: "#FFFFFF" }
 * ```
 */
export type ITheme = {
    name?: string;
    dark?: boolean | number;
    customCSS?: string;
    colors: IThemeColors;
    getColor(color?: string | keyof IThemeColors, ...defaultColors: any[]): string | undefined;
    getColorScheme(colorSheme?: keyof IThemeColors): { color?: string, backgroundColor?: string }
}

/**
 * @interface IColorSheme
 * Represents a color scheme containing both `color` and `backgroundColor`.
 * 
 * This type is used to define foreground and background colors for various theme elements.
 * 
 * @typedef {Object} IColorSheme
 * @property {string} [color] - The foreground color.
 * @property {string} [backgroundColor] - The background color.
 * 
 * @example
 * ```ts
 * const colorScheme: IColorSheme = {
 *    color: "#FFFFFF",
 *    backgroundColor: "#6200EE"
 * };
 * ```
 */
export type IColorSheme = { color?: string; backgroundColor?: string };
