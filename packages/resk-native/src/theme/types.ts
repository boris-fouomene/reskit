import { IBreakpointName } from "@breakpoints/types";


/**
 * @interface IThemeColorsTokens
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
 * @typedef {Object} IThemeColorsTokens
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
 * const themeColors: IThemeColorsTokens = {
 *    primary: "#6200EE",
 *    onPrimary: "#FFFFFF",
 *    warning: "#FFA726",
 *    onWarning: "#FFFFFF",
 *    statusBar: "#000000"
 * };
 * ```
 */
export interface IThemeColorsTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  background: string;
  onBackground: string;

  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  outline: string;
  outlineVariant: string;

  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;


  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  shadow: string;
  scrim: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;

  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceDim: string;
  surfaceTint: string;

  elevation?: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };

  statusBar?: string;
  /*** colors of text and icons elements */
  text?: string;

  /**
   * The color applied on placeholder text.
   */
  placeholder?: string;

  /**
   * The color used for informational messages.
   */
  info?: string;

  /***
   * The color applied on top of the info background.
   */
  onInfo?: string;

  /**
   * The color used for success states.
   */
  success?: string;

  /**
   * The color applied on top of the success background.
   */
  onSuccess?: string;
  /***
   * The color used for warnings.
   */
  warning?: string;

  /**
   * The color applied on top of the warning background (e.g., text or icons).
   */
  onWarning?: string;
};

/**
 * @interface IThemeColorsTokenName
 * Represents the keys of the `IThemeColorsTokens` interface.
 * 
 * This type is a union of string literals that correspond to the property names 
 * defined in the `IThemeColorsTokens` interface. It is useful for ensuring that 
 * only valid theme color token keys can be used in contexts where theme colors 
 * are referenced or manipulated.
 * 
 * ## Usage Example
 * 
 * For instance, if `IThemeColorsTokens` has properties like `primary`, `secondary`, 
 * and `background`, then `IThemeColorsTokenName` will be equivalent to the union type 
 * `"primary" | "secondary" | "background"`. This allows developers to use these 
 * keys safely in their code without the risk of typos or invalid property names.
 * 
 * ### Example of Valid Usage
 * 
 * ```typescript
 * const themeColor: IThemeColorsTokenName = 'primary'; // Valid
 * const anotherColor: IThemeColorsTokenName = 'background'; // Valid
 * 
 * // The following would cause a TypeScript error:
 * const invalidColor: IThemeColorsTokenName = 'invalidColor'; // Error: Type '"invalidColor"' is not assignable to type 'IThemeColorsTokenName'.
 * ```
 * 
 * ## Notes
 * 
 * - This type is particularly useful in scenarios where theme customization 
 *   is required, allowing for dynamic access to theme properties.
 * - It helps in maintaining type safety and reducing runtime errors by leveraging 
 *   TypeScript's type system.
 */
export type IThemeColorsTokenName = keyof IThemeColorsTokens;


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
 * @property {IThemeColorsTokens} colors - The set of color tokens associated with the theme.
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
  colors: IThemeColorsTokens;

  /***
   * The spacing value is used to adjust the spacing of components like buttons, cards, text inputs, and other UI elements.
   * This property influences how much space is reserved around the edges of these elements.
   * A low spacing value results in more space between the element and its surroundings, while a higher value makes the element more compact.
   */
  spaces?: IThemeSpaces;

  /***
   * The font sizes value is used to adjust the font sizes of components like buttons, cards, text inputs, and other UI elements.
   * This property influences the size of the text within these elements.
   * A low font size value results in smaller text, while a higher value makes the text more readable.
   */
  fontSizes?: IThemeFontSizes;

  /***
   * The border radius value is used to adjust the border radius of components like buttons, cards, text inputs, and other UI elements.
   * This property influences the roundedness of the corners of these elements.
   * A low border radius value results in sharper corners, while a higher value makes the corners more rounded.
   */
  borderRadius?: IThemeBorderRadius;
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


/**
 * Represents the theme's spacing configuration.
 * 
 * @remarks
 * This interface defines the spacing values for different breakpoints and custom sizes.
 * It uses a record type to allow for flexible key-value pairs, where keys are either breakpoint names or custom size breakpoints (e.g., `_12sm`).
 * The interface also includes predefined spacing values for common breakpoints.
 * 
 * @example
 * ```typescript
 * const themeSpaces: IThemeSpaces = {
 *   _2xs: 4,
 *   xs: 8,
 *   sm: 12,
 *   md: 16,
 *   lg: 20,
 *   xl: 24,
 *   _2xl: 28,
 *   _3xl: 32,
 *   _4xl: 36,
 *   _5xl: 40,
 *   '12sm': 20,
 * };
 * ```
 */
export interface IThemeSpaces extends Partial<Record<IBreakpointName | `_${number}${IBreakpointName}`, number>> {
  /**
   * The spacing value for the `_2xs` breakpoint.
   * 
   * @remarks
   * This value is used for the smallest spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   _2xs: 4,
   * };
   * ```
   */
  _2xs: number,

  /**
   * The spacing value for the `xs` breakpoint.
   * 
   * @remarks
   * This value is used for the extra small spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   xs: 8,
   * };
   * ```
   */
  xs: number,

  /**
   * The spacing value for the `sm` breakpoint.
   * 
   * @remarks
   * This value is used for the small spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   sm: 12,
   * };
   * ```
   */
  sm: number,

  /**
   * The spacing value for the `md` breakpoint.
   * 
   * @remarks
   * This value is used for the medium spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   md: 16,
   * };
   * ```
   */
  md: number,

  /**
   * The spacing value for the `lg` breakpoint.
   * 
   * @remarks
   * This value is used for the large spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   lg: 20,
   * };
   * ```
   */
  lg: number,

  /**
   * The spacing value for the `xl` breakpoint.
   * 
   * @remarks
   * This value is used for the extra large spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   xl: 24,
   * };
   * ```
   */
  xl: number,

  /**
   * The spacing value for the `_2xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 2xl spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   _2xl: 28,
   * };
   * ```
   */
  _2xl: number,

  /**
   * The spacing value for the `_3xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 3xl spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   _3xl: 32,
   * };
   * ```
   */
  _3xl: number,

  /**
   * The spacing value for the `_4xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 4xl spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   _4xl: 36,
   * };
   * ```
   */
  _4xl: number,

  /**
   * The spacing value for the `_5xl` breakpoint.
   * 
   * @ remarks
   * This value is used for the 5xl spacing size.
   * 
   * @example
   * ```typescript
   * const themeSpaces: IThemeSpaces = {
   *   _5xl: 40,
   * };
   * ```
   */
  _5xl: number,
}

/**
 * @interface IThemeFontSizes
 * Represents the theme's font size configuration.
 * 
 * @remarks
 * This interface defines the font sizes for different breakpoints and custom sizes.
 * It uses a record type to allow for flexible key-value pairs, where keys are either breakpoint names or custom size breakpoints (e.g., `_12_sm`).
 * The interface also includes predefined font sizes for common breakpoints.
 * 
 * @example
 * ```typescript
 * const themeFontSizes: IThemeFontSizes = {
 *   _2xs: 10,
 *   xs: 12,
 *   sm: 14,
 *   md: 16,
 *   lg: 18,
 *   xl: 20,
 *   _2xl: 22,
 *   _3xl: 24,
 *   _4xl: 26,
 *   _5xl: 28,
 *   '12_sm': 15,
 * };
 * ```
 */
export interface IThemeFontSizes extends Partial<Record<IBreakpointName | `_${number}${IBreakpointName}`, number>> {
  /**
   * The font size for the `_2xs` breakpoint.
   * 
   * @remarks
   * This value is used for the smallest font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   _2xs: 10,
   * };
   * ```
   */
  _2xs: number,

  /**
   * The font size for the `xs` breakpoint.
   * 
   * @remarks
   * This value is used for the extra small font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   xs: 12,
   * };
   * ```
   */
  xs: number,

  /**
   * The font size for the `sm` breakpoint.
   * 
   * @remarks
   * This value is used for the small font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   sm: 14,
   * };
   * ```
   */
  sm: number,

  /**
   * The font size for the `md` breakpoint.
   * 
   * @remarks
   * This value is used for the medium font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   md: 16,
   * };
   * ```
   */
  md: number,

  /**
   * The font size for the `lg` breakpoint.
   * 
   * @remarks
   * This value is used for the large font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   lg: 18,
   * };
   * ```
   */
  lg: number,

  /**
   * The font size for the `xl` breakpoint.
   * 
   * @remarks
   * This value is used for the extra large font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   xl: 20,
   * };
   * ```
   */
  xl: number,

  /**
   * The font size for the `_2xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 2xl font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   _2xl: 22,
   * };
   * ```
   */
  _2xl: number,

  /**
   * The font size for the `_3xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 3xl font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   _3xl: 24,
   * };
   * ```
   */
  _3xl: number,

  /**
   * The font size for the `_4xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 4xl font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   _4xl: 26,
   * };
   * ```
   */
  _4xl: number,

  /**
   * The font size for the `_5xl` breakpoint.
   * 
   * @remarks
   * This value is used for the 5xl font size.
   * 
   * @example
   * ```typescript
   * const themeFontSizes: IThemeFontSizes = {
   *   _5xl: 28,
   * };
   * ```
   */
  _5xl: number,
}
/**
 * @interface IThemeBorderRadius
 * Represents the theme's border radius configuration.
 * 
 * @remarks
 * This interface defines the border radius values for different breakpoints and custom sizes.
 * It uses a record type to allow for flexible key-value pairs, where keys are either breakpoint names or custom size breakpoints (e.g., `_12_sm`).
 * The interface also includes predefined border radius values for common breakpoints.
 * 
 * @example
 * ```typescript
 * const themeBorderRadius: IThemeBorderRadius = {
 *   _2xs: 2,
 *   xs: 4,
 *   sm: 8,
 *   md: 12,
 *   '12_sm': 10,
 * };
 * ```
 */
export interface IThemeBorderRadius extends Partial<Record<IBreakpointName | `_${number}${IBreakpointName}`, number>> {
  /**
   * The border radius for the `_2xs` breakpoint.
   * 
   * @remarks
   * This value is used for the smallest border radius.
   * 
   * @example
   * ```typescript
   * const themeBorderRadius: IThemeBorderRadius = {
   *   _2xs: 2,
   * };
   * ```
   */
  _2xs: 2,

  /**
   * The border radius for the `xs` breakpoint.
   * 
   * @remarks
   * This value is used for the extra small border radius.
   * 
   * @example
   * ```typescript
   * const themeBorderRadius: IThemeBorderRadius = {
   *   xs: 4,
   * };
   * ```
   */
  xs: 4,

  /**
   * The border radius for the `sm` breakpoint.
   * 
   * @remarks
   * This value is used for the small border radius.
   * 
   * @example
   * ```typescript
   * const themeBorderRadius: IThemeBorderRadius = {
   *   sm: 8,
   * };
   * ```
   */
  sm: 8,

  /**
   * The border radius for the `md` breakpoint.
   * 
   * @remarks
   * This value is used for the medium border radius.
   * 
   * @example
   * ```typescript
   * const themeBorderRadius: IThemeBorderRadius = {
   *   md: 12,
   * };
   * ```
   */
  md: 12,
}