import { IColorSheme, ITheme, IThemeColorTokenKey, IThemeColorTokens } from "./types";
import Colors from "./colors";
import { extendObj, IDict, IObservable, isObj, isObservable, observable } from "@resk/core";
import { packageName } from "@utils/index";
import session from "../session";
import { StatusBarProps } from "expo-status-bar";
import Color from "color";
import updateNative from "./updateNative";
import styles from "./styles";
import { useReskExpoProvider } from "@src/context/context";
import Elevations from "./Elevations";

export * from "./utils";

/**
 * @constant UPDATE_THEME
 * A constant string representing the action type for updating the theme.
 * This constant is used to trigger the update event, when the theme is updated 
 * a theme update across the application.
 * 
 * @constant {string}
 */
const UPDATE_THEME = "UPDATE_THEME";


const events: IObservable = {} as IObservable;
if (!isObservable(events)) {
    observable(events);
}


/**
 * Adds an event listener to track theme changes or updates.
 * 
 * This utility allows you to listen to theme updates, particularly useful for non-functional React components, 
 * such as class components, or any other part of the code that needs to react to theme changes.
 * 
 * @param {(theme: ITheme) => any} callstack - A callback function that will be triggered every time the theme is updated. 
 * The function receives the updated theme as its parameter.
 * 
 * @returns {{ remove: () => any }} - Returns an object containing a `remove` method. 
 * The `remove` method can be used to stop listening to the theme updates when it is no longer needed.
 * 
 * @example
 * ```ts
 * const listener = addEventListener((newTheme) => {
 *    console.log("The theme has been updated:", newTheme);
 *    // Update the UI or perform a specific action here
 * });
 * 
 * // To remove the listener when it's no longer needed
 * listener.remove();
 * ```
 * 
 * @remarks
 * Ensure that the `callstack` is a function that handles the updated theme properly.
 * The `remove` method is particularly useful when you want to avoid memory leaks or unnecessary event listeners.
 * 
 * @remarks
 * This function depends on the `events` object, which needs to be observable. 
 * If `events` is not observable, the function will make it so internally using the `observable` function.
 */
const addEventListener = (callstack: (theme: ITheme) => any): { remove: () => any } => {
    if (!isObservable(events)) {
        observable(events);
    }
    return events.on(UPDATE_THEME, callstack);
};

/**
 * create a theme object by adding utility functions such as `getColor` and `getColorScheme`.
 * 
 * The `createTheme` function extends the given `theme` object by adding useful methods 
 * that simplify working with colors in the theme. It includes methods to retrieve colors 
 * and to generate color schemes based on the theme configuration.
 *
 * @example
 * ```ts
 * const theme = {
 *   name : "MyTheme",
 *   dark : false,
 *   colors: {
 *     primary: "#6200ea",
 *     onPrimary: "#ffffff",
 *     surface: "#f5f5f5",
 *     onSurface: "#000000",
 *     secondary: "#03dac6",
 *   },
 * };
 * 
 * const newTheme = createTheme(theme);
 * 
 * // Get a color directly from the theme or provide default fallbacks.
 * const primaryColor = newTheme.getColor("primary"); // "#6200ea"
 * const unknownColor = newTheme.getColor("unknown", "secondary", "#ff0000"); // "#03dac6"
 * const fallbackColor = newTheme.getColor("invalidColor", "#ff0000"); // "#ff0000"
 * 
 * // Get a color scheme based on a theme color.
 * const primaryScheme = newTheme.getColorScheme("primary");
 * // Result: { color: "#ffffff", backgroundColor: "#6200ea" }
 * ```
 *
 * @param {ITheme} theme - The base theme object that contains color definitions.
 * @returns {ITheme} - The theme object extended with utility methods.
 */
export function createTheme(theme: ITheme): IThemeManager {
    return {
        ...Object.assign({}, theme),
        get styles() {
            return styles;
        },
        get elevations() {
            return Elevations;
        },
        /**
         * Retrieves the color associated with the given color key or value.
         *
         * If `color` is a valid key within the theme's colors object, the corresponding 
         * color is returned. If `color` is a valid color string, it is returned as-is.
         * Otherwise, the method checks any provided default colors in `defaultColors`.
         *
         * @example
         * ```ts
         * const primaryColor = newTheme.getColor("primary"); // "#6200ea"
         * const fallbackColor = newTheme.getColor("invalidColor", "#ff0000"); // "#ff0000"
         * const secondaryOrDefault = newTheme.getColor("unknown", "secondary", "#ff0000"); // "#03dac6"
         * ```
         * 
         * @param {string} [color] - The color key or color value to retrieve.
         * @param {...string[]} [defaultColors] - Fallback color values if the provided color is invalid.
         * @returns {string | undefined} - The resolved color value or undefined if none is found.
         */
        getColor(color?: IThemeColorTokenKey, ...defaultColors: any[]): string | undefined {
            if (color && color in this.colors) {
                return this.colors[color as keyof typeof this.colors] as string;
            }
            if (Colors.isValid(color)) return color as string;
            for (let i in defaultColors) {
                if (typeof defaultColors[i] === "string") {
                    const col = this.getColor(defaultColors[i] as IThemeColorTokenKey);
                    if (col) return col as string;
                }
            }
            return undefined;
        },

        /**
         * Returns the color scheme associated with the given color key.
         *
         * The method generates a color scheme where `color` represents the text color 
         * and `backgroundColor` represents the background color. If the color key starts 
         * with "on" (e.g., "onPrimary"), the background is the color without the "on" prefix.
         *
         * @example
         * ```ts
         * const scheme = newTheme.getColorScheme("primary");
         * // Returns: { color: "#ffffff", backgroundColor: "#6200ea" }
         * 
         * const onSurfaceScheme = newTheme.getColorScheme("onSurface");
         * // Returns: { color: "#000000", backgroundColor: "#f5f5f5" }
         * ```
         * 
         * @param {IThemeColorTokenKey} [colorSheme] - The color key to generate a scheme for.
         * @returns {IColorSheme} - An object containing `color` and `backgroundColor` properties.
         */
        getColorScheme(colorSheme?: IThemeColorTokenKey): IColorSheme {
            if (
                !colorSheme ||
                typeof colorSheme != "string" ||
                !(colorSheme in this.colors)
            )
                return {};
            const result: { color?: string; backgroundColor?: string } = {};
            // Handle "on" prefixed colors (e.g., "onPrimary")
            if ((colorSheme as string).startsWith("on")) {
                (result as IDict).color = this.colors[colorSheme];
                let bgColorKey = colorSheme.slice(2);
                if (bgColorKey) {
                    bgColorKey = bgColorKey.charAt(0).toLowerCase() + bgColorKey.slice(1);
                    if (bgColorKey in this.colors) {
                        (result as IDict).backgroundColor = this.colors[bgColorKey as keyof typeof this.colors];
                    }
                }
            } else {
                (result as IDict).backgroundColor = this.colors[colorSheme];
                const bgColorKey =
                    "on" + colorSheme.charAt(0).toUpperCase() + colorSheme.slice(1);
                if (bgColorKey in this.colors) {
                    (result as IDict).color = this.colors[bgColorKey as keyof typeof this.colors];
                }
            }
            return result;
        },
        get addEventListener() {
            return addEventListener;
        }
    };
}

const white = "white", black = "black";
/*
    Default Light Theme Tokens
*/
export const lightColors: IThemeColorTokens = {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    background: '#FFFBFE',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    inverseOnSurface: '#F4EFF4',
    inverseSurface: '#313033',
    inversePrimary: '#D0BCFF',
    shadow: '#000000',
    surfaceTint: '#6750A4',

    text: "#11181C", // Main text color for light mode
    placeholder: Colors.setAlpha(black), // Placeholder text color
    backdrop: Colors.setAlpha(black, 0.5), // Backdrop overlay with semi-transparent black
    onInfo: "white", // Text color for info messages
    onSuccess: "white", // Text color for success messages
    success: "#5EBA6A", // Success message color
    warning: "#BAAB5E", // Warning message color
    disabled: Colors.setAlpha(black, 0.5), // Semi
};

/*
  Default Dark Theme Tokens
*/
export const darkColors: IThemeColorTokens = {
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',
    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',
    background: '#1C1B1F',
    onBackground: '#E6E1E5',
    surface: '#1C1B1F',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    inverseOnSurface: '#1C1B1F',
    inverseSurface: '#E6E1E5',
    inversePrimary: '#6750A4',
    shadow: '#000000',
    surfaceTint: '#D0BCFF',
    placeholder: Colors.setAlpha(white, 0.5), // Placeholder text color
    backdrop: Colors.setAlpha(black, 0.5), // Backdrop overlay with semi-transparent black
    success: "#5EBA6A", // Success message color
    warning: "#FFB547", // Warning message color
    text: '#ECEDEE',
    disabled: Colors.setAlpha(white, 0.5), // Semi
};
/***
 * Default dark theme configuration for the application.
 * 
 * This theme is used to define color schemes for dark mode. It contains properties like `background`, 
 * `surface`, and `primary` which are specific to dark themes. The `createTheme` function is used to 
 * enhance the theme with useful methods such as `getColor` and `getColorScheme`.
 * 
 * @example
 * ```ts
 * import { DefaultDarkTheme } from './themes';
 * 
 * const backgroundColor = DefaultDarkTheme.colors.background; // "#111b21"
 * const primaryColor = DefaultDarkTheme.getColor("primary"); // "#5EBA6A"
 * ```
 */
export const DefaultDarkTheme: ITheme = createTheme({
    name: `${packageName}-dark`,
    dark: true,
    roundness: 10,
    colors: {
        ...darkColors,
    },
});
/***
 * Default light theme configuration for the application.
 * 
 * This theme is used to define color schemes for light mode. It contains properties like `background`, 
 * `surface`, and `primary` which are specific to light themes. The `createTheme` function is used to 
 * enhance the theme with useful methods such as `getColor` and `getColorScheme`.
 * 
 * @example
 * ```ts
 * import { DefaultLightTheme } from './themes';
 * 
 * const backgroundColor = DefaultLightTheme.colors.background; // "#F0F0F0"
 * const primaryColor = DefaultLightTheme.getColor("primary"); // "#5EBA6A"
 * ```
 */
export const DefaultLightTheme: ITheme = createTheme({
    name: `${packageName}-light`,
    roundness: 10,
    colors: {
        ...lightColors
    },
} as unknown as ITheme);


/***
 * Returns the default theme for the application based on the stored theme in session.
 * 
 * This function retrieves the currently saved theme from session storage and returns the corresponding theme object.
 * If no theme is stored, it defaults to the dark theme. Additionally, this function ensures that certain key color
 * properties (`onSuccess`, `onInfo`, `onWarning`, `onError`, and `text`) are defined based on whether the theme is dark or light.
 * 
 * @example
 * ```ts
 * import { getDefaultTheme } from './theme';
 * 
 * const currentTheme = getDefaultTheme();
 * console.log(currentTheme.colors.background); // Outputs the background color of the current theme
 * ```
 * @param {boolean} isColorShemeDark - Optional parameter to specify if the color scheme is dark.
 * @returns {ITheme} The active theme (light or dark) based on session storage or the default theme.
 */
export const getDefaultTheme = (isColorShemeDark?: boolean): ITheme => {
    // Retrieves the saved theme from the session (if available)
    const themeNameObj = Object.assign({}, session.get("theme"));
    themeNameObj.dark = !!(themeNameObj.dark !== undefined ? themeNameObj.dark : isColorShemeDark);
    const theme = extendObj({}, (themeNameObj?.dark ? DefaultDarkTheme : DefaultLightTheme), themeNameObj);
    // Ensures essential color properties are defined based on whether the theme is dark or light
    theme.colors.onSuccess = theme.colors.onSuccess || (theme.dark ? "black" : "white");
    theme.colors.onInfo = theme.colors.onInfo || (theme.dark ? "black" : "white");
    theme.colors.onWarning = theme.colors.onWarning || (theme.dark ? "black" : "black");
    theme.colors.onError = theme.colors.onError || (theme.dark ? "black" : "white");
    theme.colors.text = theme.colors.text || (theme.dark ? "white" : "black");
    updateNative(theme);
    // Returns the fully prepared theme
    return theme;
};

/** 
 * An object that holds a reference to the current application theme.
 * 
 * This reference is updated dynamically whenever the theme changes.
 * @example
 * ```ts
 * console.log(themeRef.current.name); // Logs the name of the current theme
 * ```
 */
const themeRef: { current: IThemeManager } = {
    current: createTheme(getDefaultTheme()),
};

/**
 * Updates the application theme and triggers necessary UI updates.
 * 
 * This function allows you to change the application's theme dynamically. It saves the new theme in the session, 
 * updates the theme reference, applies the theme to native elements, and optionally triggers an event to notify 
 * other parts of the app that the theme has changed.
 * 
 * @param {ITheme} theme - The new theme to be applied to the application.
 * @param {boolean} [trigger=false] - Whether to trigger the theme update event (default is `false`).
 * 
 * @returns {ITheme} - The updated theme that has been applied.
 * 
 * @example
 * ```ts
 * const newTheme = getDefaultTheme(); // Or any custom theme
 * updateTheme(newTheme);
 * console.log(themeRef.current.name); // Logs the name of the updated theme
 * ```
 */
export function updateTheme(theme: ITheme, trigger: boolean = false): ITheme {
    // Save the theme name in the session
    session.set("theme", theme.name);

    // Update the theme reference
    themeRef.current = createTheme(theme);

    // Apply the theme to native elements (like the status bar)
    updateNative(theme);

    // Optionally trigger a global theme update event
    if (trigger) {
        triggerThemeUpdate(theme);
    }
    return theme;
}

/**
 * Triggers a theme update event with the provided theme object.
 * This function checks if the provided theme is a valid object before triggering the event.
 *
 * @param {ITheme} theme - The theme object to be used for the update event.
 * @returns {void} This function does not return a value.
 *
 * @example
 * const newTheme = {
 *   primaryColor: '#6200ee',
 *   secondaryColor: '#03dac6',
 *   // other theme properties...
 * };
 *
 * triggerThemeUpdate(newTheme);
 * // This will trigger the UPDATE_THEME event with the new theme.
 */
export const triggerThemeUpdate = (theme: ITheme): void => {
    if (isObj(theme)) {
        events?.trigger(UPDATE_THEME, theme);
    }
}

/**
 * Retrieves the status bar properties based on the current theme.
 * 
 * This function calculates the status bar style and background color based on the current theme's colors.
 * If the theme includes a `statusBar` color, it uses that color to set the background and adjusts the 
 * status bar's style (light or dark) based on the lightness of the color.
 * 
 * @see https://docs.expo.dev/versions/latest/sdk/status-bar/#statusbarstyle
 * 
 * @returns {StatusBarProps} - The status bar properties including the style and background color.
 * 
 * @example
 * ```ts
 * const statusBarProps = getStatusBarProps();
 * console.log(statusBarProps.style); // Logs "light" or "dark" based on the current theme's status bar color
 * ```
 */
export const getStatusBarProps = (): StatusBarProps => {
    // Initialize default status bar properties
    const statusBarStyle: StatusBarProps = {
        animated: true,
    };

    // If the current theme has a statusBar color, set the background color and style
    if (themeRef.current.colors.statusBar) {
        const color = Color(themeRef.current.colors.statusBar);
        statusBarStyle.backgroundColor = themeRef.current.colors.statusBar;

        // Set the status bar style to 'light' or 'dark' based on the lightness of the color
        statusBarStyle.style = color.isLight() ? "dark" : "light";
    }

    return statusBarStyle;
};



const Theme = {
    ...themeRef.current, // Spread the properties of the current theme
    get dark() {
        return themeRef.current.dark; // Check if the theme is dark
    },
    get name() {
        return themeRef.current?.name; // Get the theme name
    },
    get colors() {
        return themeRef.current.colors; // Access the color palette
    },
};

/**
 * The default export for the theme object, providing direct access to theme properties.
 *
 * This object exposes various properties of the current theme, including 
 * animation settings, color palette, font styles, and other configurations.
 *
 * @type {ITheme}
 * @returns {ITheme } The current theme object.
 */
export default Theme;

/***
 * @interface IThemeManager
 * 
 * This is the result obtained by calling createTheme on an `ITheme`
 * 
 * @method getColor
 * @description Retrieves a specific color from the theme based on the color key.
 * @param {string | IThemeColorTokenKey} [color] - The key of the color to retrieve (e.g., "primary", "warning").
 * @param {...any[]} defaultColors - Default colors to return if the requested color is not found.
 * @returns {string | undefined} The color string if found, otherwise one of the default colors.
 * 
 * @method getColorScheme
 * @description Retrieves a color scheme with `color` and `backgroundColor` based on the provided color scheme key.
 * @param {IThemeColorTokenKey} [colorSheme] - The key of the color scheme to retrieve (e.g., "primary", "error").
 * @returns {IColorSheme} An object containing `color` and `backgroundColor` properties.
 * 
 * @example 
 * const theme: IThemeManager = createTheme({
 *    name: "DarkTheme",
 *    dark: true,
 *    colors: {
 *      primary: "#6200EE",
 *      onPrimary: "#FFFFFF",
 *      error: "#B00020",
 *      onError: "#FFFFFF"
 *    )
 * });
 * const primaryColorScheme = theme.getColorScheme("primary"); // { color: "#FFFFFF", backgroundColor: "#6200EE" }
 * const primaryColor = theme.getColor("primary", "#000000"); // "#6200EE"
 * const errorScheme = theme.getColorScheme("error"); // { color: "#B00020", backgroundColor: "#FFFFFF" }
 * 
* @method addEventListener
* Adds an event listener to track theme changes or updates.
* 
* This utility allows you to listen to theme updates, particularly useful for non-functional React components, 
* such as class components, or any other part of the code that needs to react to theme changes.
* 
* @param {(theme: ITheme) => any} callstack - A callback function that will be triggered every time the theme is updated. 
* The function receives the updated theme as its parameter.
* 
* @returns {{ remove: () => any }} - Returns an object containing a `remove` method. 
* The `remove` method can be used to stop listening to the theme updates when it is no longer needed.
* 
* @example
* ```ts
* const listener = addEventListener((newTheme) => {
*    console.log("The theme has been updated:", newTheme);
*    // Update the UI or perform a specific action here
* });
* 
* // To remove the listener when it's no longer needed
* listener.remove();
* ```
* 
* @remarks
* Ensure that the `callstack` is a function that handles the updated theme properly.
* The `remove` method is particularly useful when you want to avoid memory leaks or unnecessary event listeners.
* 
* @remarks
* This function depends on the `events` object, which needs to be observable. 
* If `events` is not observable, the function will make it so internally using the `observable` function.
 * ```
 */
export interface IThemeManager extends ITheme {
    colors: IThemeColorTokens;
    getColor(color?: IThemeColorTokenKey, ...defaultColors: any[]): string | undefined;
    getColorScheme(colorSheme?: IThemeColorTokenKey): IColorSheme
    styles: typeof styles;
    elevations: typeof Elevations;
    /**
     * @method addEventListener
     * Adds an event listener to track theme changes or updates.
     * 
     * This utility allows you to listen to theme updates, particularly useful for non-functional React components, 
     * such as class components, or any other part of the code that needs to react to theme changes.
     * 
     * @param {(theme: ITheme) => any} callstack - A callback function that will be triggered every time the theme is updated. 
     * The function receives the updated theme as its parameter.
     * 
     * @returns {{ remove: () => any }} - Returns an object containing a `remove` method. 
     * The `remove` method can be used to stop listening to the theme updates when it is no longer needed.
     * 
     * @example
     * ```ts
     * const listener = addEventListener((newTheme) => {
     *    console.log("The theme has been updated:", newTheme);
     *    // Update the UI or perform a specific action here
     * });
     * 
     * // To remove the listener when it's no longer needed
     * listener.remove();
     * ```
     * 
     * @remarks
     * Ensure that the `callstack` is a function that handles the updated theme properly.
     * The `remove` method is particularly useful when you want to avoid memory leaks or unnecessary event listeners.
     * 
     * @remarks
     * This function depends on the `events` object, which needs to be observable. 
     * If `events` is not observable, the function will make it so internally using the `observable` function.
     */
    addEventListener: (callstack: (theme: ITheme) => any) => { remove: () => any };
};

export * from "./useColorScheme";

export { default as Colors } from "./colors";


/**
 * @group ReskExpoProvider
 * @function useTheme
 * `useTheme` is a custom hook that provides the current theme used in the application.
 * 
 * It fetches the theme from the `ReskExpoProvider` context. If no theme is provided 
 * via the provider, it defaults to the base theme imported from `@theme`.
 * 
 * @returns {ITheme} The current theme object. If no theme is set in the context, it returns the default theme.
 * 
 * @example
 * ```tsx
 * import { useTheme } from './hooks/useTheme';
 * 
 * const MyComponent = () => {
 *   const theme = useTheme();
 *   
 *   return (
 *     <div style={{ backgroundColor: theme.colors.primary }}>
 *       This component uses the primary color from the current theme.
 *     </div>
 *   );
 * };
 * ```
 * 
 * @remarks
 * This hook is particularly useful in functional components that need access to the theme
 * without directly passing it as a prop. It ensures that if no theme is provided through 
 * the context, the default theme is always returned, making it safe to use throughout 
 * the application.
 */
export const useTheme = (): ITheme => {
    const { theme } = useReskExpoProvider();
    /**
     * Returns the current theme from `ReskExpoProvider` context.
     * If no theme is found, it returns the default `Theme` from `@theme`.
     */
    return theme || Theme;
};
