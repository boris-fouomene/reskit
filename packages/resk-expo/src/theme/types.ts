/**
 * @interface IThemeColorTokens
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
 * @typedef {Object} IThemeColorTokens
 * @property {string} [text] - The color applied on text elements
 * @property {string} [primary] - The primary color of the application. It's used to highlight important elements like buttons or icons. 
 * @property {string} [onPrimary] - The color applied on top of the primary background (e.g., text or icons).
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
  /** 
 * Primary color for elements that need to stand out. 
 * @remarks
 * The primary color is used for key components such as buttons, active states, and highlighted elements.
 * Use this for interactive elements that need to be prominent.
 * 
 * **Example:**
 * ```ts
 * const buttonStyle = { backgroundColor: theme.primary };
 * ```
 */
  primary?: string;
  /** 
 * Color to be used for text or icons placed on `primary` colored surfaces. 
 * @remarks
 * Use `onPrimary` for content (like text or icons) displayed on surfaces colored with the `primary` token.
 * 
 * **Example:**
 * ```ts
 * const buttonTextStyle = { color: theme.onPrimary };
 * ```
 */
  onPrimary?: string;
  /** 
 * Primary container color, often used for surfaces that hold content. 
 * @remarks
 * Use `primaryContainer` for background colors in components like cards or containers. It provides a lighter, supporting tone of the primary color.
 * 
 * **Example:**
 * ```ts
 * const cardStyle = { backgroundColor: theme.primaryContainer };
 * ```
 */
  primaryContainer?: string;
  /** 
* Color for text or icons on `primaryContainer` surfaces.
* @remarks
* Use this token for content placed on primary container surfaces, ensuring contrast and readability.
* 
* **Example:**
* ```ts
* const cardTextStyle = { color: theme.onPrimaryContainer };
* ```
*/
  onPrimaryContainer?: string;
  /** The secondary color, used for less prominent elements in the UI. */
  secondary?: string;
  /** The color used for text or icons placed on secondary-colored backgrounds. */
  onSecondary?: string;
  /** A container color associated with the secondary color, used for background areas. */
  secondaryContainer?: string;
  /** Text or icons placed on a secondary container background. */
  onSecondaryContainer?: string;
  /** Tertiary color, often used for accents or additional visual differentiation.
   * tertiary and tertiaryContainer: Tertiary colors are often used as an accent color or for components like floating buttons or special UI elements that need attention without overwhelming the primary interface.
   */
  tertiary?: string;
  /** Text or icons placed on tertiary-colored backgrounds. */
  onTertiary?: string;
  /** Background or container color associated with the tertiary color. */
  tertiaryContainer?: string;
  /** Text or icons placed on a tertiary container background. */
  onTertiaryContainer?: string;
  /** 
* Error color for error states and alerts. 
* @remarks
* Use this token for indicating errors in form fields, error messages, or any component needing an error state.
* 
* **Example:**
* ```ts
* const errorTextStyle = { color: theme.error };
* ```
*/
  error?: string;
  /** 
* Text or icon color for content displayed on `error`-colored surfaces.
* @remarks
* Use `onError` for content displayed on surfaces that use the `error` token, ensuring visibility and contrast.
* 
* **Example:**
* ```ts
* const errorButtonTextStyle = { color: theme.onError };
* ```
*/
  onError?: string;
  /** Background or container color associated with error states. */
  errorContainer?: string;
  /** Text or icons placed on an error container background. */
  onErrorContainer?: string;
  /** Main background color for the application. */
  background?: string;
  /** Text or icons placed on the background. */
  onBackground?: string;
  /** 
 * Background color for the main content surfaces. 
 * @remarks
 * The `surface` color is used as the background for surfaces like cards, sheets, and panels. It is designed to be neutral and less prominent.
 * 
 * **Example:**
 * ```ts
 * const viewStyle = { backgroundColor: theme.surface };
 * ```
 */
  surface?: string;
  /** 
 * Text or icon color for content placed on surfaces that use the `surface` color.
 * @remarks
 * This token provides good contrast for text or icons on surface-colored backgrounds.
 * 
 * **Example:**
 * ```ts
 * const textStyle = { color: theme.onSurface };
 * ```
 */
  onSurface?: string;
  /** 
  * Variant of the surface color, typically used for backgrounds or secondary containers.
  * @remarks
  * Use `surfaceVariant` for less prominent surfaces, such as the background of dialogs or inactive elements.
  * 
  * **Example:**
  * ```ts
  * const dialogStyle = { backgroundColor: theme.surfaceVariant };
  * ```
  */
  surfaceVariant?: string;
  /** 
 * Color for text or icons on `surfaceVariant`-colored surfaces.
 * @remarks
 * This token ensures contrast for text or icons displayed on `surfaceVariant` surfaces.
 * 
 * **Example:**
 * ```ts
 * const dialogTextStyle = { color: theme.onSurfaceVariant };
 * ```
 */
  onSurfaceVariant?: string;
  /** 
   * Used for borders or outlines of interactive elements like input fields or buttons.
     Example: Use outline for the border of a TextInput or card component.
  */
  outline?: string;
  /** Inverse of the surface color, for use in dark/light modes. Background color for app bars, navigation bars, and other container surfaces.
   * These are alternative surface colors, often used for elements like bottom sheets or snackbars, providing contrast to the main surface colors.
     Example: Use inverseSurface as a snackbar background color, with inverseOnSurface for the snackbar text.
  */
  inverseSurface?: string;
  /** Text or icon color used on `inverseSurface`-colored surfaces. */
  inverseOnSurface?: string;
  /** Inverse of the primary color, for contrast in dark or light themes. */
  inversePrimary?: string;
  /** Dynamic color for highlight or background tints. it's used for elevating components and creating depth. */
  shadow?: string;

  /** 
  * Color used to indicate disabled state.
  */
  disabled?: string;
  /**
   * Overlay color used for elevated surfaces like modals or backdrops.
   * Surface tint color for elements like hover or focus states.  
   * For a backdrop or overlay, you can use the surfaceTint for a lighter, more subtle effect or inverseSurface for a contrasting, darker effect. This provides a visually distinct background for modals or other overlays.
      Example: Apply surfaceTint to slightly elevated UI components to visually indicate depth. 
  */
  surfaceTint?: string;
  /*** colors of text and icons elements */
  text?: string;

  warning?: string;
  onWarning?: string;
  statusBar?: string;
  placeholder?: string;
  backdrop?: string;
  info?: string;
  onInfo?: string;
  success?: string;
  onSuccess?: string;

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
 * @property {number} [roundness] - The roundness value for the theme. It's used to adjust the border radius of components like buttons, cards, text inputs, and other UI elements. 
     * This property influences how "rounded" the corners of these elements appear. 
     * A low roundness value results in sharper corners, while a higher value makes the corners more rounded.
 * @property {IThemeColorTokens} colors - The set of color tokens associated with the theme.
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
