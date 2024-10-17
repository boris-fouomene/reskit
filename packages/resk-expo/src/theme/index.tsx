import { IColorSheme, ITheme, IThemeColors } from "./types";
import Colors from "./colors";
import { IDict } from "@resk/core";
import { packageName } from "@utils/index";
import session from "../session";
import { StatusBarProps } from "expo-status-bar";
import Color from "color";
import updateNative from "./updateNative";
import ThemeEvents from "./events";
import Grid from "./grid";

/**
 * @constant UPDATE_THEME
 * A constant string representing the action type for updating the theme.
 * This constant is used to trigger the update event, when the theme is updated 
 * a theme update across the application.
 * 
 * @constant {string}
 */
const UPDATE_THEME = "UPDATE_THEME";

/**
 * Prepares a theme object by adding utility functions such as `getColor` and `getColorScheme`.
 * 
 * The `prepareTheme` function extends the given `theme` object by adding useful methods 
 * that simplify working with colors in the theme. It includes methods to retrieve colors 
 * and to generate color schemes based on the theme configuration.
 *
 * @example
 * ```ts
 * const theme = {
 *   colors: {
 *     primary: "#6200ea",
 *     onPrimary: "#ffffff",
 *     surface: "#f5f5f5",
 *     onSurface: "#000000",
 *     secondary: "#03dac6",
 *   },
 * };
 * 
 * const preparedTheme = prepareTheme(theme);
 * 
 * // Get a color directly from the theme or provide default fallbacks.
 * const primaryColor = preparedTheme.getColor("primary"); // "#6200ea"
 * const unknownColor = preparedTheme.getColor("unknown", "secondary", "#ff0000"); // "#03dac6"
 * const fallbackColor = preparedTheme.getColor("invalidColor", "#ff0000"); // "#ff0000"
 * 
 * // Get a color scheme based on a theme color.
 * const primaryScheme = preparedTheme.getColorScheme("primary");
 * // Result: { color: "#ffffff", backgroundColor: "#6200ea" }
 * ```
 *
 * @param {ITheme} theme - The base theme object that contains color definitions.
 * @returns {ITheme} - The theme object extended with utility methods.
 */
export function prepareTheme(theme: ITheme): ITheme {
    return {
        ...Object.assign({}, theme),

        /**
         * Retrieves the color associated with the given color key or value.
         *
         * If `color` is a valid key within the theme's colors object, the corresponding 
         * color is returned. If `color` is a valid color string, it is returned as-is.
         * Otherwise, the method checks any provided default colors in `defaultColors`.
         *
         * @example
         * ```ts
         * const primaryColor = preparedTheme.getColor("primary"); // "#6200ea"
         * const fallbackColor = preparedTheme.getColor("invalidColor", "#ff0000"); // "#ff0000"
         * const secondaryOrDefault = preparedTheme.getColor("unknown", "secondary", "#ff0000"); // "#03dac6"
         * ```
         * 
         * @param {string} [color] - The color key or color value to retrieve.
         * @param {...string[]} [defaultColors] - Fallback color values if the provided color is invalid.
         * @returns {string | undefined} - The resolved color value or undefined if none is found.
         */
        getColor(
            color?: string | keyof IThemeColors,
            ...defaultColors: any[]
        ): string | undefined {
            if (color && color in this.colors) {
                return this.colors[color as keyof typeof this.colors] as string;
            }
            if (Colors.isValid(color)) return color as string;
            for (let i in defaultColors) {
                if (typeof defaultColors[i] === "string") {
                    const col = this.getColor(defaultColors[i] as string);
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
         * const scheme = preparedTheme.getColorScheme("primary");
         * // Returns: { color: "#ffffff", backgroundColor: "#6200ea" }
         * 
         * const onSurfaceScheme = preparedTheme.getColorScheme("onSurface");
         * // Returns: { color: "#000000", backgroundColor: "#f5f5f5" }
         * ```
         * 
         * @param {keyof IThemeColors} [colorSheme] - The color key to generate a scheme for.
         * @returns {IColorSheme} - An object containing `color` and `backgroundColor` properties.
         */
        getColorScheme(colorSheme?: keyof IThemeColors): IColorSheme {
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
    };
}

const white = "white", black = "black";
/***
 * Default dark theme configuration for the application.
 * 
 * This theme is used to define color schemes for dark mode. It contains properties like `background`, 
 * `surface`, and `primary` which are specific to dark themes. The `prepareTheme` function is used to 
 * enhance the theme with useful methods such as `getColor` and `getColorScheme`.
 * 
 * @example
 * ```ts
 * import { defaultDarkTheme } from './themes';
 * 
 * const backgroundColor = defaultDarkTheme.colors.background; // "#111b21"
 * const primaryColor = defaultDarkTheme.getColor("primary"); // "#5EBA6A"
 * ```
 */
export const defaultDarkTheme: ITheme = prepareTheme({
    name: `${packageName}-dark`,
    dark: true,
    colors: {
        background: "#111b21", // Dark background color for the app
        surface: "#202c33", // Surface color for cards and other components
        disabled: Colors.setAlpha(white, 0.5), // Semi-transparent white for disabled elements
        placeholder: Colors.setAlpha(white, 0.5), // Placeholder text color
        backdrop: Colors.setAlpha(black, 0.5), // Backdrop overlay with semi-transparent black
        divider: Colors.setAlpha(white, 0.18), // Divider color between elements
        primary: "#5EBA6A", // Main action color for dark mode (used in buttons, etc.)
        primaryLight: "#D3F0D9", // Lighter shade of the primary color
        surfaceDown: "#1E282E", // Color for lower surfaces or layers
        surfaceTop: "#202c33", // Color for the top surfaces
        success: "#5EBA6A", // Success message color
        warning: "#FFB547" // Warning message color
    },
} as unknown as ITheme);

/***
 * Default light theme configuration for the application.
 * 
 * This theme is used to define color schemes for light mode. It contains properties like `background`, 
 * `surface`, and `primary` which are specific to light themes. The `prepareTheme` function is used to 
 * enhance the theme with useful methods such as `getColor` and `getColorScheme`.
 * 
 * @example
 * ```ts
 * import { defaultLightTheme } from './themes';
 * 
 * const backgroundColor = defaultLightTheme.colors.background; // "#F0F0F0"
 * const primaryColor = defaultLightTheme.getColor("primary"); // "#5EBA6A"
 * ```
 */
export const defaultLightTheme: ITheme = prepareTheme({
    name: `${packageName}-light`,
    colors: {
        background: "#F0F0F0", // Light background color for the app
        placeholder: Colors.setAlpha(black), // Placeholder text color
        backdrop: Colors.setAlpha(black, 0.5), // Backdrop overlay with semi-transparent black
        divider: Colors.setAlpha(black, 0.18), // Divider color between elements
        onInfo: "white", // Text color for info messages
        onError: "white", // Text color for error messages
        onSuccess: "white", // Text color for success messages
        success: "#5EBA6A", // Success message color
        warning: "#BAAB5E", // Warning message color
        neutral: "#606A71", // Neutral text color
        text: "black", // Main text color for light mode
        primary: "#5EBA6A", // Main action color for light mode
        primaryLight: "#D3F0D9", // Lighter shade of the primary color
        active: "#afddb5", // Color for active elements
        surfaceDown: "#ebebeb", // Color for lower surfaces or layers
        surfaceTop: "#d5d5d5", // Color for the top surfaces
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
 * 
 * @returns {ITheme} The active theme (light or dark) based on session storage or the default theme.
 */
export const getDefaultTheme = (): ITheme => {
    // Retrieves the saved theme from the session (if available)
    const themeName = session.get("theme");

    // Determines the active theme based on the saved theme name
    const theme = themeName === defaultLightTheme.name ? defaultLightTheme : (defaultDarkTheme as ITheme);

    // Ensures essential color properties are defined based on whether the theme is dark or light
    theme.colors.onSuccess = theme.colors.onSuccess || (theme.dark ? "black" : "white");
    theme.colors.onInfo = theme.colors.onInfo || (theme.dark ? "black" : "white");
    theme.colors.onWarning = theme.colors.onWarning || (theme.dark ? "black" : "black");
    theme.colors.onError = theme.colors.onError || (theme.dark ? "black" : "white");
    theme.colors.text = theme.colors.text || (theme.dark ? "white" : "black");
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
const themeRef: { current: ITheme } = {
    current: getDefaultTheme(),
};

/**
 * Updates the application theme and triggers necessary UI updates.
 * 
 * This function allows you to change the application's theme dynamically. It saves the new theme in the session, 
 * updates the theme reference, applies the theme to native elements, and optionally triggers an event to notify 
 * other parts of the app that the theme has changed.
 * 
 * @param {ITheme} theme - The new theme to be applied to the application.
 * @param {boolean} [trigger=true] - Whether to trigger the theme update event (default is `true`).
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
export function updateTheme(theme: ITheme, trigger: boolean = true): ITheme {
    // Save the theme name in the session
    session.set("theme", theme.name);

    // Update the theme reference
    themeRef.current = theme;

    // Apply the theme to native elements (like the status bar)
    updateNative(theme);
    // Optionally trigger a global theme update event
    if (trigger) {
        ThemeEvents.trigger(UPDATE_THEME, theme);
    }
    return theme;
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

/****
 * Ajoute un évènement qui écoute les changements ou mises à jour du thème.
 * 
 * Cette utilité permet d'écouter les mises à jour du thème pour les composants React non fonctionnels, 
 * comme les composants de classe, ou pour toute autre partie du code qui nécessite de réagir aux changements de thème.
 * 
 * @param {(theme: ITheme) => any} callstack - Une fonction de rappel qui sera exécutée à chaque mise à jour du thème.
 * La fonction recevra le nouveau thème comme paramètre.
 * 
 * @returns {{ remove: () => any }} - Un objet contenant une méthode `remove` qui permet de désactiver l'écouteur.
 * 
 * @example
 * ```ts
 * const listener = addOnChangeListener((newTheme) => {
 *    console.log("Le thème a été mis à jour:", newTheme);
 *    // Mettre à jour l'UI ou effectuer une action spécifique ici
 * });
 * 
 * // Pour supprimer l'écouteur quand il n'est plus nécessaire
 * listener.remove();
 * ```
 */
export const addOnThemeChangeListener = (
    callstack: (theme: ITheme) => any
): { remove: () => any } => {
    return ThemeEvents.on(UPDATE_THEME, callstack);
};

/**
 * The default export for the theme object, providing direct access to theme properties.
 *
 * This object exposes various properties of the current theme, including 
 * animation settings, color palette, font styles, and other configurations.
 *
 * @type {ITheme}
 * @returns {ITheme & { grid: typeof Grid } } The current theme object.
 */
const defaultExport: ITheme = {
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
    get grid() {
        return Grid;
    }
} as unknown as ITheme;

export default defaultExport;

export * from "./types";
