import { TextStyle } from "react-native";

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
 */
export interface IThemeColorsTokens {
  /**
   * The primary color of the theme, used for key components like buttons and app bars.
   * Typically represents the main brand color.
   *
   * @type {string}
   * @example '#6200EE' // A deep purple color
   */
  primary: string;

  /**
   * The color used for content (e.g., text, icons) displayed on top of the primary color.
   * Ensures proper contrast for readability.
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on a dark primary background
   */
  onPrimary: string;

  /**
   * A container variant of the primary color, often used for backgrounds or larger areas.
   *
   * @type {string}
   * @example '#EADDFF' // A light purple color
   */
  primaryContainer: string;

  /**
   * The color used for content displayed on top of the primary container.
   *
   * @type {string}
   * @example '#21005D' // Dark text/icons on a light primary container
   */
  onPrimaryContainer: string;

  /**
   * The secondary color of the theme, used for less prominent components.
   * Often complements the primary color.
   *
   * @type {string}
   * @example '#625B71' // A muted purple-gray color
   */
  secondary: string;

  /**
   * The color used for content displayed on top of the secondary color.
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on a dark secondary background
   */
  onSecondary: string;

  /**
   * A container variant of the secondary color, used for backgrounds or larger areas.
   *
   * @type {string}
   * @example '#E8DEF8' // A light purple-gray color
   */
  secondaryContainer: string;

  /**
   * The color used for content displayed on top of the secondary container.
   *
   * @type {string}
   * @example '#1D192B' // Dark text/icons on a light secondary container
   */
  onSecondaryContainer: string;

  /**
   * The tertiary color of the theme, used for accentuating specific elements.
   *
   * @type {string}
   * @example '#7D5260' // A muted pink-brown color
   */
  tertiary: string;

  /**
   * The color used for content displayed on top of the tertiary color.
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on a dark tertiary background
   */
  onTertiary: string;

  /**
   * A container variant of the tertiary color, used for backgrounds or larger areas.
   *
   * @type {string}
   * @example '#FFD8E4' // A light pink-brown color
   */
  tertiaryContainer: string;

  /**
   * The color used for content displayed on top of the tertiary container.
   *
   * @type {string}
   * @example '#31111D' // Dark text/icons on a light tertiary container
   */
  onTertiaryContainer: string;

  /**
   * The background color of the application, used for large areas like the main screen.
   *
   * @type {string}
   * @example '#FFFBFF' // A very light gray or white color
   */
  background: string;

  /**
   * The color used for content displayed on top of the background.
   *
   * @type {string}
   * @example '#000000' // Black text/icons on a light background
   */
  onBackground: string;

  /**
   * The surface color, used for components like cards, sheets, and menus.
   *
   * @type {string}
   * @example '#FFFFFF' // White surface color
   */
  surface: string;

  /**
   * The color used for content displayed on top of the surface.
   *
   * @type {string}
   * @example '#000000' // Black text/icons on a light surface
   */
  onSurface: string;

  /**
   * A variant of the surface color, used for components that need subtle differentiation.
   *
   * @type {string}
   * @example '#F4F4F4' // A slightly darker/lighter surface color
   */
  surfaceVariant: string;

  /**
   * The color used for content displayed on top of the surface variant.
   *
   * @type {string}
   * @example '#000000' // Black text/icons on a surface variant
   */
  onSurfaceVariant: string;

  /**
   * The outline color, used for borders or dividers to separate components.
   *
   * @type {string}
   * @example '#DADADA' // A light gray outline
   */
  outline: string;

  /**
   * A variant of the outline color, used for subtle borders or dividers.
   *
   * @type {string}
   * @example '#EAEAEA' // A lighter gray outline
   */
  outlineVariant: string;

  /**
   * The inverse surface color, used for components in inverted contexts (e.g., dark mode).
   *
   * @type {string}
   * @example '#1C1B1F' // A dark surface color
   */
  inverseSurface: string;

  /**
   * The color used for content displayed on top of the inverse surface.
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on a dark inverse surface
   */
  inverseOnSurface: string;

  /**
   * The inverse primary color, used for key components in inverted contexts.
   *
   * @type {string}
   * @example '#D0BCFF' // A light purple color
   */
  inversePrimary: string;

  /**
   * The error color, used for indicating errors or critical states.
   *
   * @type {string}
   * @example '#B00020' // A bright red color
   */
  error: string;

  /**
   * The color used for content displayed on top of the error color.
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on an error background
   */
  onError: string;

  /**
   * A container variant of the error color, used for backgrounds or larger areas.
   *
   * @type {string}
   * @example '#F9DEDC' // A light red color
   */
  errorContainer: string;

  /**
   * The color used for content displayed on top of the error container.
   *
   * @type {string}
   * @example '#410002' // Dark text/icons on a light error container
   */
  onErrorContainer: string;

  /**
   * The shadow color, used for drop shadows to indicate elevation.
   *
   * @type {string}
   * @example '#000000' // Black shadow
   */
  shadow: string;

  /**
   * The scrim color, used for overlays or dimming effects.
   *
   * @type {string}
   * @example 'rgba(0, 0, 0, 0.5)' // Semi-transparent black scrim
   */
  scrim: string;

  /**
   * The color used for disabled surfaces, such as inactive buttons or cards.
   *
   * @type {string}
   * @example '#E0E0E0' // A light gray color
   */
  surfaceDisabled: string;

  /**
   * The color used for content displayed on top of disabled surfaces.
   *
   * @type {string}
   * @example '#A3A3A3' // Gray text/icons on a disabled surface
   */
  onSurfaceDisabled: string;

  /**
   * The backdrop color, used for modal overlays or blurred backgrounds.
   *
   * @type {string}
   * @example 'rgba(0, 0, 0, 0.4)' // Semi-transparent black backdrop
   */
  backdrop: string;

  /**
   * The default surface container color, used for grouping content.
   *
   * @type {string}
   * @example '#FFFFFF' // White container
   */
  surfaceContainer: string;

  /**
   * A low-contrast variant of the surface container color.
   *
   * @type {string}
   * @example '#FAFAFA' // Very light gray
   */
  surfaceContainerLow: string;

  /**
   * The lowest-contrast variant of the surface container color.
   *
   * @type {string}
   * @example '#FCFCFC' // Almost white
   */
  surfaceContainerLowest: string;

  /**
   * A high-contrast variant of the surface container color.
   *
   * @type {string}
   * @example '#F5F5F5' // Light gray
   */
  surfaceContainerHigh: string;

  /**
   * The highest-contrast variant of the surface container color.
   *
   * @type {string}
   * @example '#E0E0E0' // Medium gray
   */
  surfaceContainerHighest: string;

  /**
   * A brighter variant of the surface color, used for highlighting.
   *
   * @type {string}
   * @example '#FFFFFF' // White highlight
   */
  surfaceBright: string;

  /**
   * A dimmer variant of the surface color, used for de-emphasizing.
   *
   * @type {string}
   * @example '#F0F0F0' // Light gray dim
   */
  surfaceDim: string;

  /**
   * The tint color applied to surfaces for subtle branding effects.
   *
   * @type {string}
   * @example '#6200EE' // Primary color as a tint
   */
  surfaceTint: string;

  /**
   * Elevation levels for components, used to indicate depth via shadows.
   *
   * @type {{ level0: string; level1: string; level2: string; level3: string; level4: string; level5: string }}
   * @example
   * elevation: {
   *   level0: 'none',          // No shadow
   *   level1: '0px 1px 2px rgba(0, 0, 0, 0.3)', // Subtle shadow
   *   level2: '0px 1px 3px rgba(0, 0, 0, 0.3)',
   *   level3: '0px 4px 5px rgba(0, 0, 0, 0.3)',
   *   level4: '0px 6px 10px rgba(0, 0, 0, 0.3)',
   *   level5: '0px 8px 12px rgba(0, 0, 0, 0.3)'
   * }
   */
  elevation?: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };

  /**
   * The color of the status bar, used for system-level UI.
   *
   * @type {string}
   * @example '#000000' // Black status bar
   */
  statusBar?: string;

  /**
   * The color of text and icon elements in the application.
   *
   * @type {string}
   * @example '#000000' // Black text/icons
   */
  text?: string;

  /**
   * The color applied to placeholder text, used for input fields or labels.
   *
   * @type {string}
   * @example '#A3A3A3' // Gray placeholder text
   */
  placeholder?: string;

  /**
   * The color used for informational messages or notifications.
   *
   * @type {string}
   * @example '#2196F3' // Blue info color
   */
  info?: string;

  /**
   * The color applied on top of the info background (e.g., text or icons).
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on an info background
   */
  onInfo?: string;

  /**
   * The color used for success states, such as confirmation messages.
   *
   * @type {string}
   * @example '#4CAF50' // Green success color
   */
  success?: string;

  /**
   * The color applied on top of the success background (e.g., text or icons).
   *
   * @type {string}
   * @example '#FFFFFF' // White text/icons on a success background
   */
  onSuccess?: string;

  /**
   * The color used for warning states, such as alerts or cautions.
   *
   * @type {string}
   * @example '#FF9800' // Orange warning color
   */
  warning?: string;

  /**
   * The color applied on top of the warning background (e.g., text or icons).
   *
   * @type {string}
   * @example '#000000' // Black text/icons on a warning background
   */
  onWarning?: string;
}

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
   * The fonts value is used to customize the fonts used in the application.
   * This property allows you to define the font styles for different platforms and font weights.
   * By default, the fonts are set to the default font styles for each platform.
   */
  fontsConfig?: IThemeFontsConfig & {
    variants?: Partial<IThemeFontsWithVariants>;
  };
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
export interface IThemeColorSheme { color?: string; backgroundColor?: string };


/**
 * @interface IThemeFonts
 * Interface representing a theme font configuration object.
 * 
 * This interface defines a record of theme fonts, where each key is a font style and the value is an TextStyle object.
 * 
 * @example
 * ```typescript
 * const themeFontConfig: IThemeFonts = {
 *   regular: {
 *     fontSize: 16,
 *     fontFamily: 'Arial',
 *     fontWeight: 'normal',
 *   },
 *   medium: {
 *     fontSize: 16,
 *     fontFamily: 'Arial',
 *     fontWeight: 'bold',
 *   },
 *   light: {
 *     fontSize: 16,
 *     fontFamily: 'Arial',
 *     fontWeight: 'light',
 *   },
 *   thin: {
 *     fontSize: 16,
 *     fontFamily: 'Arial',
 *     fontWeight: 'thin',
 *   },
 * };
 * ```
 */
export interface IThemeFonts {
  /**
   * The regular font style configuration.
   * 
   * @example
   * ```typescript
   * const themeFontConfig: IThemeFonts = {
   *   regular: {
   *     fontFamily: 'Arial',
   *     fontWeight: 'normal',
   *   },
   * };
   * ```
   */
  regular: TextStyle;

  /**
   * The medium font style configuration.
   * 
   * @example
   * ```typescript
   * const themeFontConfig: IThemeFonts = {
   *   medium: {
   *     fontFamily: 'Arial',
   *     fontWeight: 'bold',
   *   },
   * };
   * ```
   */
  medium: TextStyle;

  /**
   * The light font style configuration.
   * 
   * @example
   * ```typescript
   * const themeFontConfig: IThemeFonts = {
   *   light: {
   *     fontFamily: 'Arial',
   *     fontWeight: 'light',
   *   },
   * };
   * ```
   */
  light: TextStyle;

  /**
   * The thin font style configuration.
   * 
   * @example
   * ```typescript
   * const themeFontConfig: IThemeFonts = {
   *   thin: {
   *     fontFamily: 'Arial',
   *     fontWeight: 'thin',
   *   },
   * };
   * ```
   */
  thin: TextStyle;
}

/**
 * Interface representing a theme fonts configuration object for different platforms.
 * 
 * This interface defines a record of theme font configurations, where each key is a platform and the value is an IThemeFonts object.
 * @extends {Record<string, IThemeFonts>}
 * @see {@link IThemeFonts} for the `IThemeFonts` interface.
 * @example
 * ```typescript
 * const themeFontsConfig: IThemeFontsConfig = {
 *   web: {
 *     regular: {
 *       fontSize: 16,
 *       fontFamily: 'Arial',
 *       fontWeight: 'normal',
 *     },
 *     medium: {
 *       fontSize: 16,
 *       fontFamily: 'Arial',
 *       fontWeight: 'bold',
 *     },
 *     light: {
 *       fontSize: 16,
 *       fontFamily: 'Arial',
 *       fontWeight: 'light',
 *     },
 *     thin: {
 *       fontSize: 16,
 *       fontFamily: 'Arial',
 *       fontWeight: 'thin',
 *     },
 *   },
 *   android: {
 *     regular: {
 *       fontSize: 16,
 *       fontFamily: 'Roboto',
 *       fontWeight: 'normal',
 *     },
 *     medium: {
 *       fontSize: 16,
 *       fontFamily: 'Roboto',
 *       fontWeight: 'bold',
 *     },
 *     light: {
 *       fontSize: 16,
 *       fontFamily: 'Roboto',
 *       fontWeight: 'light',
 *     },
 *     thin: {
 *       fontSize: 16,
 *       fontFamily: 'Roboto',
 *       fontWeight: 'thin',
 *     },
 *   },
 *   ios: {
 *     regular: {
 *       fontSize: 16,
 *       fontFamily: 'San Francisco',
 *       fontWeight: 'normal',
 *     },
 *     medium: {
 *       fontSize: 16,
 *       fontFamily: 'San Francisco',
 *       fontWeight: 'bold',
 *     },
 *     light: {
 *       fontSize: 16,
 *       fontFamily: 'San Francisco',
 *       fontWeight: 'light',
 *     },
 *     thin: {
 *       fontSize: 16,
 *       fontFamily: 'San Francisco',
 *       fontWeight: 'thin',
 *     },
 *   },
 * };
 * ```
 */
export interface IThemeFontsConfig extends Partial<Record<string, IThemeFonts>> {
  /**
   * The theme font configuration for web platforms.
   * 
   * @example
   * ```typescript
   * const themeFontsConfig: IThemeFontsConfig = {
   *   web: {
   *     regular: {
   *       fontSize: 16,
   *       fontFamily: 'Arial',
   *       fontWeight: 'normal',
   *     },
   *     // ... other font styles
   *   },
   * };
   * ```
   */
  web?: IThemeFonts;

  /**
   * The theme font configuration for Android platforms.
   * 
   * @example
   * ```typescript
   * const themeFontsConfig: IThemeFontsConfig = {
   *   android: {
   *     regular: {
   *       fontSize: 16,
   *       fontFamily: 'Roboto',
   *       fontWeight: 'normal',
   *     },
   *     // ... other font styles
   *   },
   * };
   * ```
   */
  android?: IThemeFonts;

  /**
   * The theme font configuration for iOS platforms.
   * 
   * @example
   * ```typescript
   * const themeFontsConfig: IThemeFontsConfig = {
   *   ios: {
   *     regular: {
   *       fontSize: 16,
   *       fontFamily: 'San Francisco',
   *       fontWeight: 'normal',
   *     },
   *     // ... other font styles
   *   },
   * };
   * ```
   */
  ios?: IThemeFonts;
}

/**
 * Interface representing a theme font configuration with variants.
 * 
 * This interface defines a record of theme font configurations, where each key is a text style variant and the value is an IThemeFonts object.
 */
export interface IThemeFontsWithVariants extends IThemeFonts {
  /**
  * The display large text style variant.
  * 
  * @example
  * ```typescript
  * const fontVariant: IThemeFontVariant = 'displayLarge';
  * ```
  */
  displayLarge: TextStyle;

  /**
   * The display medium text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'displayMedium';
   * ```
   */
  displayMedium: TextStyle;
  /**
 * The display small text style variant.
 * 
 * @example
 * ```typescript
 * const fontVariant: IThemeFontVariant = 'displaySmall';
 * ```
 */
  displaySmall: TextStyle;


  /**
   * The headline large text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'headlineLarge';
   * ```
   */
  headlineLarge: TextStyle;

  /**
   * The headline medium text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'headlineMedium';
   * ```
   */
  headlineMedium: TextStyle;

  /**
   * The headline small text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'headlineSmall';
   * ```
   */
  headlineSmall: TextStyle;

  /**
   * The title large text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'titleLarge';
   * ```
   */
  titleLarge: TextStyle;



  /**
   * The title medium text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'titleMedium';
   * ```
   */
  titleMedium: TextStyle;

  /**
   * The title small text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'titleSmall';
   * ```
   */
  titleSmall: TextStyle;

  /**
  * The label large text style variant.
  * 
  * @example
  * ```typescript
  * const fontVariant: IThemeFontVariant = 'labelLarge';
  * ```
  */
  labelLarge: TextStyle;

  /**
   * The label medium text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'labelMedium';
   * ```
   */
  labelMedium: TextStyle;

  /**
   * The label small text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'labelSmall';
   * ```
   */
  labelSmall: TextStyle;


  /**
   * The body large text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'bodyLarge';
   * ```
   */
  bodyLarge: TextStyle;

  /**
   * The body medium text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'bodyMedium';
   * ```
   */
  bodyMedium: TextStyle;

  /**
   * The body small text style variant.
   * 
   * @example
   * ```typescript
   * const fontVariant: IThemeFontVariant = 'bodySmall';
   * ```
   */
  bodySmall: TextStyle;
}


/**
 * @typedef {string} IThemeFontVariant
 * Type representing a theme text style variant.
 * 
 * This type defines a set of predefined text style variants that can be used to style text in a theme.
 * 
 * @example
 * ```typescript
 * const fontVariant: IThemeFontVariant = 'headlineLarge';
 * ```
 */
export type IThemeFontVariant = keyof IThemeFontsWithVariants;