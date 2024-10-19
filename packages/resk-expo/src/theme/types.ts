/**
 * @interface IThemeTokens
 * Represents the default tokens available in a theme. You can extends this interface to add custom tokens.
 * 
 * This includes optional custom colors for various application states like warnings, success, info, etc.
 * 
 * @typedef {Object} IThemeTokens
 * @property {string} [text] - The color applied on text elements
 * @property {string} [primary] - The primary color of the application
 * @property {string} [onPrimary] - The color applied on top of the primary background (e.g., text or icons).
 * @property {string} [secondary] - The secondary color of the application.
 * @property {string} [onSecondary] - The color applied on top of the secondary background.
 * @property {string} [surface] - The color of surface component
 * @property {string} [onSurface] - The color applied on top of the surface component
 * @property {string} [background] - The application background color.
 * @property {string} [onBackground] - The color applied on top of the background.
 * @property {string} [warning] - The color used for warnings.
 * @property {string} [onWarning] - The color applied on top of the warning background (e.g., text or icons).
 * @property {string} [statusBar] - The color of the status bar.
 * @property {string} [info] - The color used for informational messages.
 * @property {string} [onInfo] - The color applied on top of the info background.
 * @property {string} [success] - The color used for success states.
 * @property {string} [onSuccess] - The color applied on top of the success background.
 * @property {string} [error] - The color used for error states.
 * @property {string} [onError] - The color applied on top of the error background.
 * @property {string} [placeholder] - The color used for placeholders.
 * @property {string} [divider] - The color used for dividers.  
 * @property {string} [backdrop] - The color used for modal's backdrop.
 * @property {string} [disabled] - The color used for disabled elements.
 * 
 * @example
 * ```ts
 * const themeColors: IThemeTokens = {
 *    primary: "#6200EE",
 *    onPrimary: "#FFFFFF",
 *    warning: "#FFA726",
 *    onWarning: "#FFFFFF",
 *    statusBar: "#000000"
 * };
 * ```
 */
export interface IThemeTokens {
    text?: string;
    primary?: string;
    onPrimary?: string;
    secondary?: string;
    onSecondary?: string;
    surface?: string;
    onSurface?: string;
    background?: string;
    onBackground?: string;
    warning?: string;
    onWarning?: string;
    statusBar?: string;
    placeholder?: string;
    divider?: string;
    backdrop?: string;
    info?: string;
    onInfo?: string;
    success?: string;
    onSuccess?: string;
    error?: string;
    onError?: string;
    disabled?: string;
};

export type IThemeTokenKey = keyof IThemeTokens;

/**
 * @interface  ITheme
 * Defines the theme structure for the application.
 * 
 * This includes the theme name, color scheme, and helper methods for retrieving specific colors or color schemes.
 * 
 * @typedef {Object} ITheme
 * @property {string} [name] - The name of the theme.
 * @property {boolean | number} [dark] - Whether the theme is in dark mode (`true` for dark, `false` for light).
 * @property {string} [customCSS] - Custom CSS properties applied to the theme (mainly for web platforms).
 * @property {IThemeTokens} colors - The set of colors associated with the theme.
 * 
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
 *    }
 * };
 * ```
 */
export interface ITheme {
    name?: string;
    dark?: boolean;
    customCSS?: string;
    colors: IThemeTokens;
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
