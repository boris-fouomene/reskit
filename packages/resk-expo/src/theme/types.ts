/**
 * @interface IThemeColorTokens
 * Represents the default tokens available in a theme. You can extends this interface to add custom tokens.
 * 
 * This includes optional custom colors for various application states like warnings, success, info, etc.
 * 
 * @typedef {Object} IThemeColorTokens
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
 * @description 
 * The theming system is designed on the basis of the latest version of Google’s open-source design system
 * @see : https://m3.material.io/styles/color/roles for more information.
 * The role of the different colors is described on the site as follows: 
 * `Surface` – A role used for backgrounds and large, low-emphasis areas of the screen.
 * `Primary`, Secondary, Tertiary – Accent color roles used to emphasize or de-emphasize foreground elements.
 * `Container` – Roles used as a fill color for foreground elements like buttons. They should not be used for text or icons.
 * `On` – Roles starting with this term indicate a color for text or icons on top of its paired parent color. For example, onPrimary is used for text and icons against the primary fill color.
 * `Variant` – Roles ending with this term offer a lower emphasis alternative to its non-variant pair. For example, outline variant is a less emphasized version of the outline color.
 * @example
 * ```ts
 * const themeColors: IThemeColorTokens = {
 *    primary: "#6200EE",
 *    onPrimary: "#FFFFFF",
 *    warning: "#FFA726",
 *    onWarning: "#FFFFFF",
 *    statusBar: "#000000"
 * };
 * ```
 */
export interface IThemeColorTokens {
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

/**
 * @interface IThemeColorTokenKey
 * Represents the keys of the `IThemeColorTokens` interface.
 * 
 * This type is a union of string literals that correspond to the property names 
 * defined in the `IThemeColorTokens` interface. It is useful for ensuring that 
 * only valid theme color token keys can be used in contexts where theme colors 
 * are referenced or manipulated.
 * 
 * ## Usage Example
 * 
 * For instance, if `IThemeColorTokens` has properties like `primary`, `secondary`, 
 * and `background`, then `IThemeColorTokenKey` will be equivalent to the union type 
 * `"primary" | "secondary" | "background"`. This allows developers to use these 
 * keys safely in their code without the risk of typos or invalid property names.
 * 
 * ### Example of Valid Usage
 * 
 * ```typescript
 * const themeColor: IThemeColorTokenKey = 'primary'; // Valid
 * const anotherColor: IThemeColorTokenKey = 'background'; // Valid
 * 
 * // The following would cause a TypeScript error:
 * const invalidColor: IThemeColorTokenKey = 'invalidColor'; // Error: Type '"invalidColor"' is not assignable to type 'IThemeColorTokenKey'.
 * ```
 * 
 * ## Notes
 * 
 * - This type is particularly useful in scenarios where theme customization 
 *   is required, allowing for dynamic access to theme properties.
 * - It helps in maintaining type safety and reducing runtime errors by leveraging 
 *   TypeScript's type system.
 */
export type IThemeColorTokenKey = keyof IThemeColorTokens;


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
 * @property {IThemeColorTokens} colors - The set of colors associated with the theme.
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
    colors: IThemeColorTokens;
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
