import { Material3Scheme } from "@pchmn/expo-material3-theme";



/**
 * @interface IThemeColorsScheme
 * Represents the default tokens available in a theme. You can extends this interface to add custom tokens.
 * It's designed on the basis of the latest version of Google’s open-source design system
 * It's defines the full set of color tokens that are part of the Material Design 3 color system.
 * Each token serves a specific role within the theme, helping maintain visual consistency across UI components.
 * Use these tokens to style various React Native elements according to Material Design 3 principles.
 * @description 
 * @see : https://m3.material.io for more information.
 * The role of the different colors is described on the site as follows: 
 * `Surface` – A role used for backgrounds and large, low-emphasis areas of the screen.
 * `Primary`, Secondary, Tertiary – Accent color roles used to emphasize or de-emphasize foreground elements.
 * `Container` – Roles used as a fill color for foreground elements like buttons. They should not be used for text or icons.
 * `On` – Roles starting with this term indicate a color for text or icons on top of its paired parent color. For example, onPrimary is used for text and icons against the primary fill color.
 * `Variant` – Roles ending with this term offer a lower emphasis alternative to its non-variant pair. For example, outline variant is a less emphasized version of the outline color.
 * @remarks
 * The `Theme` interface provides all necessary properties to manage visual consistency
 * in your app following Material Design 3 guidelines. It covers colors for
 * backgrounds, surfaces, text, and components
 *
 * @example
 * ```ts
 * const theme: Theme = {
 *   colors: {
 *     primary: '#6750A4',
 *     onPrimary: '#FFFFFF',
 *     background: '#FFFBFE',
 *     // More color tokens here
 *   },
 *   typography: {
 *     bodyLarge: {
 *       fontFamily: 'Roboto',
 *       fontWeight: '400',
 *       fontSize: '16',
 *       letterSpacing: '0.5',
 *     },
 *     // Other typography tokens here
 *   },
 *   elevations: {
 *     level0: 'none',
 *     level1: '0 1 3 rgba(0, 0, 0, 0.12), 0 1 2 rgba(0, 0, 0, 0.24)',
 *     // More elevation tokens here
 *   },
 *   roundedCorners: {
 *     small: '4',
 *     medium: '8',
 *     // Other corner tokens here
 *   },
 * };
 * 
 * @typedef {Object} IThemeColorsScheme
 * @property {string} [text] - The color applied on text elements
 * @property {string} [primary] - The primary color of the application. It's used to highlight important elements like buttons or icons. Primary color tokens representing the most prominent color in the app. Used for key UI elements like FABs, prominent buttons, active states.
 * @property {string} [onPrimary] - The color applied on top of the primary background (e.g., text or icons).Secondary color tokens for less prominent UI elements.Provides complementary accents to your primary color.
 * @property {string} [primaryContainer] - A container color associated with the primary color, typically used for background areas. 
 * @property {string} [onPrimaryContainer] - Color used for text or icons placed on a primary container. 
 * @property {string} [secondary] - The secondary color, used for less prominent elements in the UI. 
 * @property {string} [onSecondary] - The color used for text or icons placed on secondary-colored backgrounds.
 * @property {string} [secondaryContainer] - A container color associated with the secondary color, used for background areas.
 * @property {string} [onSecondaryContainer] - Text or icons placed on a secondary container background. 
 * @property {string} [tertiary] - Tertiary color, often used for accents or additional visual differentiation.
 * @property {string} [onTertiary] - Text or icons placed on tertiary-colored backgrounds.
 * @property {string} [tertiaryContainer] - Background or container color associated with the tertiary color. 
 * @property {string} [onTertiaryContainer] - Text or icons placed on a tertiary container background. 
 * @property {string} [surface] - Main surface color, used for cards, sheets, or other elevated elements. 
 * @property {string} [onSurface] - Text or icons placed on surfaces. 
 * @property {string} [surfaceVariant] - Variant of the surface color for distinguishing different UI sections. it can be used for elements like chips or buttons.$
 * @property {string} [onSurfaceVariant] - Text or icons placed on a surface variant. The onSurfaceVariant color is a good choice for placeholders, as it contrasts against the surface but appears softer than primary text colors.
 * @property {string} [outline] - Outline color used for borders or outlines.
 * @property {string} [surfaceTint] - Surface tint color for elements like hover or focus states.  For a backdrop or overlay, you can use the surfaceTint for a lighter, more subtle effect or inverseSurface for a contrasting, darker effect. This provides a visually distinct background for modals or other overlays
 * @property {string} [inverseSurface] - Inverse of the surface color, for use in dark/light modes.
 * @property {string} [inverseOnSurface] - Text or icons placed on the inverse surface. 
 * @property {string} [inversePrimary] - Inverse of the primary color, for contrast in dark or light themes. 
 * @property {string} [background] - Main background color for the application. 
 * @property {string} [onBackground] - Text or icons placed on the background. 
 * @property {string} [warning] - The color used for warnings.
 * @property {string} [onWarning] - The color applied on top of the warning background (e.g., text or icons).
 * @property {string} [statusBar] - The color of the status bar.
 * @property {string} [info] - The color used for informational messages.
 * @property {string} [onInfo] - The color applied on top of the info background.
 * @property {string} [success] - The color used for success states.
 * @property {string} [onSuccess] - The color applied on top of the success background.
 * @property {string} [error] - Error color used to indicate failure or important issues. 
 * @property {string} [onError] - Text or icons placed on error-colored backgrounds. 
 * @property {string} [errorContainer] - Background or container color associated with error states. 
 * @property {string} [onErrorContainer] - Text or icons placed on an error container background.
 * 
 * @property {string} [placeholder] - The color used for placeholders.
 * @property {string} [outline] - The color used for outlines.  
 * @property {string} [backdrop] - The color used for modal's backdrop.
 * @example
 * ```ts
 * const themeColors: IThemeColorsScheme = {
 *    primary: "#6200EE",
 *    onPrimary: "#FFFFFF",
 *    warning: "#FFA726",
 *    onWarning: "#FFFFFF",
 *    statusBar: "#000000"
 * };
 * ```
 */
export interface IThemeColorsScheme extends Material3Scheme {
  statusBar?: string;
  /*** colors of text and icons elements */
  text?: string;

  /**
   * The color applied on placeholder text.
   */
  placeholder?: string;
};

/**
 * @interface IThemeColorTokenKey
 * Represents the keys of the `IThemeColorsScheme` interface.
 * 
 * This type is a union of string literals that correspond to the property names 
 * defined in the `IThemeColorsScheme` interface. It is useful for ensuring that 
 * only valid theme color token keys can be used in contexts where theme colors 
 * are referenced or manipulated.
 * 
 * ## Usage Example
 * 
 * For instance, if `IThemeColorsScheme` has properties like `primary`, `secondary`, 
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
export type IThemeColorTokenKey = keyof IThemeColorsScheme;


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
 * @property {number} [roundness] - The roundness value for the theme. It's used to adjust the border radius of components like buttons, cards, text inputs, and other UI elements. 
     * This property influences how "rounded" the corners of these elements appear. 
     * A low roundness value results in sharper corners, while a higher value makes the corners more rounded.
 * @property {IThemeColorsScheme} colors - The set of color tokens associated with the theme.
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
  roundness?: number;
  /***
   * The roundness value is used to adjust the border radius of components like buttons, cards, text inputs, and other UI elements. 
   * This property influences how "rounded" the corners of these elements appear. 
   * A low roundness value results in sharper corners, while a higher value makes the corners more rounded.
   */
  colors: IThemeColorsScheme;
}

/**
 * @interface IThemeColorSheme
 * Represents a color scheme containing both `color` and `backgroundColor`.
 * 
 * This type is used to define foreground and background colors for various theme elements.
 * 
 * @typedef {Object} IThemeColorSheme
 * @property {string} [color] - The foreground color.
 * @property {string} [backgroundColor] - The background color.
 * 
 * @example
 * ```ts
 * const colorScheme: IThemeColorSheme = {
 *    color: "#FFFFFF",
 *    backgroundColor: "#6200EE"
 * };
 * ```
 */
export type IThemeColorSheme = { color?: string; backgroundColor?: string };
