import { IThemeColorSheme, ITheme, IThemeColorTokenKey, IThemeColorsTokens, IThemeFontSizes, IThemeSpaces, IThemeBorderRadius } from "./types";
import Colors from "./colors";
import { defaultStr, extendObj, IDict, IObservable, isNonNullString, isObj, isObservable, observable } from "@resk/core";
import { Session } from "@resk/core";
import Color from "color";
import updateNative from "./updateNative";
import styles from "./styles";
import { useReskExpo } from "@src/context/hooks";
import Elevations from "./Elevations";
import { useColorScheme } from "react-native";
import { useMaterial3Theme, isDynamicThemeSupported, getMaterial3Theme as _getMaterial3Theme, createMaterial3Theme as _createMaterial3Theme } from '@pchmn/expo-material3-theme';
import { IBreakpointName } from "@breakpoints/types";
import Breakpoints from "@breakpoints/index";
export * from "./utils";
export * from "./types";


/**
 * Retrieves a set of light and dark themes based on the Material Design 3 specification.
 * 
 * This function utilizes the Material 3 theme system to generate light and dark theme color palettes
 * based on an optional fallback source color. It also determines if dynamic theme support is available.
 * 
 * @param {string} [fallbackSourceColor] - An optional fallback color to use as the source for theme generation.
 * 
 * @returns {Object} An object containing:
 * - `light`: An object representing the light theme with color properties.
 * - `dark`: An object representing the dark theme with color properties.
 * - `isSupported`: A boolean indicating whether dynamic theme support is available.
 * 
 * @example
 * ```ts
 * const themes = getMaterial3Theme("#6200EE");
 * console.log(themes.light.colors.primary); // Outputs the primary color for the light theme
 * console.log(themes.dark.colors.primary); // Outputs the primary color for the dark theme
 * ```
 */

export const getMaterial3Theme = (fallbackSourceColor?: string) => {
    const { light, dark } = _getMaterial3Theme(fallbackSourceColor);
    const isSupported = isDynamicThemeSupported.valueOf();
    return {
        light: { colors: prepareMaterial3Theme(light, false), dark: false },
        dark: { colors: prepareMaterial3Theme(dark, true), dark: true },
        isSupported,
    }
}



/**
 * Creates a theme object with light and dark variants based on the given source color.
 * 
 * The method creates a Material 3 theme based on the given source color and then creates
 * a theme object with light and dark variants. The theme object also includes a boolean
 * property `isSupported` to indicate if the current platform supports dynamic theme
 * changes.
 * 
 * @param {string} sourceColor - The source color for theme generation.
 * 
 * @returns {Object} - An object containing light and dark themes with color properties and
 * a boolean property `isSupported` to indicate if dynamic theme support is available.
 * @returns {ITheme} returns.light - The light theme with color properties.
 * @returns {ITheme} returns.dark - The dark theme with color properties.
 * @returns {boolean} returns.isSupported - Whether dynamic theme support is available.
 * 
 * @example
 * const themes = createMaterial3Theme("#6200EE");
 * console.log(themes.light.colors.primary); // Outputs the primary color for the light theme
 * console.log(themes.dark.colors.primary); // Outputs the primary color for the dark theme
 */
export const createMaterial3Theme = (sourceColor: string): { light: ITheme, dark: ITheme, isSupported: boolean } => {
    const { light, dark } = _createMaterial3Theme(sourceColor);
    const isSupported = isDynamicThemeSupported.valueOf();
    return {
        light: { colors: prepareMaterial3Theme(light, false), dark: false },
        dark: { colors: prepareMaterial3Theme(dark, true), dark: true },
        isSupported,
    }
}
const prepareMaterial3Theme = (colors: IThemeColorsTokens, dark: boolean): IThemeColorsTokens => {
    const isSupported = isDynamicThemeSupported.valueOf();
    if (Colors.isValid(colors?.background) && colors?.background === colors?.surface) {
        colors.background = (dark ? Colors.lighten : Colors.darken)(colors.background, 0.4) as string;
    }
    return colors;
}

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
    const Material3Theme = getMaterial3Theme(theme?.colors?.primary);
    theme = extendObj({}, theme?.dark ? Material3Theme.dark : Material3Theme.light, theme);
    const context = theme;
    const spaces = Object.assign({}, {
        _2xs: 2,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        _2xl: 24,
        _3xl: 28,
        _4xl: 32,
        _5xl: 40,
    }, context.spaces), fontSizes = Object.assign({}, {
        _2xs: 10,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        _2xl: 22,
        _3xl: 26,
        _4xl: 32,
        _5xl: 40,
    }, context.fontSizes), borderRadius = Object.assign({}, {
        _2xs: 2,
        xs: 4,
        sm: 8,
        md: 12,
    }, context.borderRadius);
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
            if (color && color in context.colors) {
                return context.colors[color as keyof typeof context.colors] as string;
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
         * @returns {IThemeColorSheme} - An object containing `color` and `backgroundColor` properties.
         */
        getColorScheme(colorSheme?: IThemeColorTokenKey): IThemeColorSheme {
            if (!colorSheme || typeof colorSheme != "string" || !(colorSheme in context.colors)) {
                return {};
            }
            const result: { color?: string; backgroundColor?: string } = {};
            // Handle "on" prefixed colors (e.g., "onPrimary")
            if ((colorSheme as string).startsWith("on")) {
                (result as IDict).color = context.colors[colorSheme];
                let bgColorKey = colorSheme.slice(2);
                if (bgColorKey) {
                    bgColorKey = bgColorKey.charAt(0).toLowerCase() + bgColorKey.slice(1);
                    if (bgColorKey in context.colors) {
                        (result as IDict).backgroundColor = context.colors[bgColorKey as keyof typeof context.colors];
                    }
                }
            } else {
                (result as IDict).backgroundColor = context.colors[colorSheme];
                const bgColorKey = "on" + colorSheme.charAt(0).toUpperCase() + colorSheme.slice(1);
                if (bgColorKey in context.colors) {
                    (result as IDict).color = context.colors[bgColorKey as keyof typeof context.colors];
                }
            }
            if (!result.color || !result.backgroundColor) {
                return {};
            }
            return result;
        },
        get spaces() {
            return spaces;
        },
        get fontSizes() {
            return fontSizes;
        },
        get borderRadius() {
            return borderRadius;
        },
        space(breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`): number | undefined {
            return getBreakpointValue(spaces, breakpointName);
        },
        fontSize(breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`): number | undefined {
            return getBreakpointValue(fontSizes, breakpointName);
        },
        bRadius(breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`): number | undefined {
            return getBreakpointValue(borderRadius, breakpointName);
        },
        get addEventListener() {
            return addEventListener;
        },
    };
}

const getBreakpointValue = (values: Partial<Record<IBreakpointName | `_${number}${IBreakpointName}`, number>>, breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`): number | undefined => {
    if (isNonNullString(breakpointName) && typeof values[breakpointName] == "number") {
        return values[breakpointName];
    }
    let coef = 1;
    if (Breakpoints.isSmallPhoneMedia()) {
        const value = typeof values[Breakpoints.smallPhoneBreakpoint] == "number" ? values[Breakpoints.smallPhoneBreakpoint] :
            typeof values.smallPhone == "number" ? (values.smallPhone as number) :
                undefined;
        if (value) {
            return value * coef;
        }
        return undefined;
    }
    if (Breakpoints.isMediumPhoneMedia()) {
        const value = typeof values[Breakpoints.mediumPhoneBreakpoint] == "number" ? values[Breakpoints.mediumPhoneBreakpoint] :
            typeof values.mediumPhone == "number" ? values.mediumPhone :
                undefined;
        if (value) {
            return value * coef;
        }
        return undefined;
    }
    if (Breakpoints.isPhoneMedia()) {
        const value = typeof values[Breakpoints.phoneBreakpoint] == "number" ? values[Breakpoints.phoneBreakpoint] :
            typeof values.phone == "number" ? values.phone :
                undefined;
        if (value) {
            return value * coef;
        }
    }
    coef = Breakpoints.isTabletMedia() ? 1 : 0.7;
    const array = Breakpoints.isMobileMedia() ? Breakpoints.mobileBreakpoints : Breakpoints.isTabletMedia() ? Breakpoints.tabletBreakpoints : Breakpoints.desktopBreakpoints;
    for (const b of array) {
        if (typeof values[b] == "number") {
            return values[b] * coef;
        }
    }
    return undefined;
}


/***
 * Returns the default theme for the application based on the stored theme in session.
 * By default, the text color is set to the onSurface color because it offers high contrast on most backgrounds, and it aligns with MD3’s focus on adaptability across light and dark modes.
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
export const getDefaultTheme = (customTheme?: ITheme): ITheme => {
    // Retrieves the saved theme from the session (if available)
    const themeNameObj = extendObj({}, customTheme, Session.get("theme"));
    const { light: lightTheme, dark: darkTheme } = getMaterial3Theme(themeNameObj?.colors?.primary);
    const isDark = !!themeNameObj.dark;
    const theme = extendObj({}, (isDark ? darkTheme : lightTheme), themeNameObj);
    sanitizeTheme(theme);
    updateNative(theme);
    // Returns the fully prepared theme
    return theme;
};

const sanitizeTheme = (theme: IThemeManager) => {
    theme.name = defaultStr(theme.name, `theme-${theme.dark ? "dark" : "light"}`);
    theme.roundness = typeof theme.roundness == "number" ? theme.roundness : 8;
    theme.colors = Object.assign({}, theme.colors);
    const isDark = !!theme.dark;
    theme.colors.placeholder = theme.colors.placeholder || Colors.setAlpha(isDark ? "white" : "black", 0.5);
    theme.colors.text = theme.colors.text || theme.colors.onSurface;
    theme.colors.backdrop = (theme.colors.backdrop || Colors.setAlpha(isDark ? "black" : "white", 0.5)) as string;
    theme.colors.info = Colors.isValid(theme.colors.info) ? theme.colors.info : "#2B73B6";
    theme.colors.onInfo = Colors.isValid(theme.colors.onInfo) ? theme.colors.onInfo : "white";
    theme.colors.success = Colors.isValid(theme.colors.success) ? theme.colors.success : "#5EBA6A";
    theme.colors.onSuccess = Colors.isValid(theme.colors.onSuccess) ? theme.colors.onSuccess : "white";
    theme.colors.warning = Colors.isValid(theme.colors.warning) ? theme.colors.warning : (isDark ? "#FFB547" : "#BAAB5E");
    theme.colors.onWarning = Colors.isValid(theme.colors.onWarning) ? theme.colors.onWarning : "black";
    return theme;
}

class Theme {
    private static defaultTheme: IThemeManager = createTheme(getDefaultTheme());
    static setTheme(theme: IThemeManager) {
        this.defaultTheme = theme;
    }
    static get dark() {
        return this.defaultTheme?.dark; // Check if the theme is dark
    }
    static getName() {
        return this.defaultTheme?.name; // Get the theme name
    }
    static get colors() {
        return this.defaultTheme?.colors; // Access the color palette
    }
    static getColor(color?: IThemeColorTokenKey, ...defaultColors: any[]): string | undefined {
        return this.defaultTheme?.getColor(color, ...defaultColors);
    }
    static getColorScheme(colorSheme?: IThemeColorTokenKey): IThemeColorSheme {
        return this.defaultTheme?.getColorScheme(colorSheme);
    }
    static get styles() {
        return this.defaultTheme?.styles;
    }
    static get elevations() {
        return this.defaultTheme?.elevations;
    }
    static get customCSS() {
        return this.defaultTheme?.customCSS;
    }
    static get roundness() {
        return this.defaultTheme?.roundness;
    }
    static get get() {
        return this.defaultTheme;
    }
    static get addEventListener() {
        return addEventListener;
    }
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
export function updateTheme(theme: ITheme, trigger: boolean = false): IThemeManager {
    // Save the theme name in the session
    Session.set("theme", theme.name);
    // Update the theme reference
    const newTheme = sanitizeTheme(createTheme(theme));
    Theme.setTheme(newTheme);

    // Apply the theme to native elements (like the status bar)
    updateNative(newTheme);

    // Optionally trigger a global theme update event
    if (trigger) {
        triggerThemeUpdate(newTheme);
    }
    return newTheme;
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
 * @returns {animated?:boolean, backgroundColor?:string, style?:"light" | "dark"} - The status bar properties including the style and background color.
 * 
 * @example
 * ```ts
 * const statusBarProps = getStatusBarProps();
 * console.log(statusBarProps.style); // Logs "light" or "dark" based on the current theme's status bar color
 * ```
 */
export const getStatusBarProps = (): { animated?: boolean, backgroundColor?: string, style?: "light" | "dark" } => {
    // Initialize default status bar properties
    const statusBarStyle: { animated?: boolean, backgroundColor?: string, style?: "light" | "dark" } = {
        animated: true,
    };

    // If the current theme has a statusBar color, set the background color and style
    if (Theme.colors.statusBar) {
        const color = Color(Theme.colors.statusBar);
        statusBarStyle.backgroundColor = Theme.colors.statusBar;

        // Set the status bar style to 'light' or 'dark' based on the lightness of the color
        statusBarStyle.style = color.isLight() ? "dark" : "light";
    }

    return statusBarStyle;
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
 * @returns {IThemeColorSheme} An object containing `color` and `backgroundColor` properties.
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
    getColor(color?: IThemeColorTokenKey, ...defaultColors: any[]): string | undefined;
    getColorScheme(colorSheme?: IThemeColorTokenKey): IThemeColorSheme
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

    fontSizes: IThemeFontSizes;
    spaces: IThemeSpaces;
    borderRadius: IThemeBorderRadius;
    /***
     * Retrieves the spacing value for the given breakpoint.
     * 
     * @param {IBreakpointName} [breakpointName] - The name of the breakpoint to retrieve the spacing value for.
     * By default, the method returns the spacing value for the current breakpoint.
     * @returns {number} The spacing value for the given breakpoint.
     * 
     * @example
     * ```ts
     * const spacing = space("md");
     * console.log(spacing); // Outputs: 16
     * ```
     */
    space: (breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`) => number | undefined;
    /***
     * Retrieves the font size value for the given breakpoint.
     * 
     * @param {IBreakpointName} [breakpointName] - The name of the breakpoint to retrieve the font size value for.
     * By default, the method returns the font size value for the current breakpoint.
     * @returns {number} The font size value for the given breakpoint.
     * 
     * @example
     * ```ts
     * const fontSize = fontSize("md");
     * console.log(fontSize); // Outputs: 16
     * ```
     */
    fontSize: (breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`) => number | undefined;
    /***
     * Retrieves the border radius value for the given breakpoint.
     * 
     * @param {IBreakpointName} [breakpointName] - The name of the breakpoint to retrieve the border radius value for.
     * by default, the method returns the border radius value for the current breakpoint.
     * @returns {number} The border radius value for the given breakpoint.
     * 
     * @example
     * ```ts
     * const borderRadius = bRadius("md");
     * console.log(borderRadius); // Outputs: 12
     * ```
     */
    bRadius: (breakpointName?: IBreakpointName | `_${number}${IBreakpointName}`) => number | undefined;
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
export const useTheme = (): IThemeManager => {
    const { theme } = useReskExpo();
    /**
     * Returns the current theme from `ReskExpoProvider` context.
     * If no theme is found, it returns the default `Theme` from `@theme`.
     */
    return (theme || Theme) as IThemeManager;
};
/**
 * Retrieves the default theme based on the Material Design 3 theme and current color scheme.
 * 
 * This hook utilizes the Material Design 3 theme system to obtain the default theme.
 * It considers the dynamic theme support and the current platform's color scheme
 * to determine the dark mode setting.
 * 
 * @param {Object} [params] - Optional parameters to customize the theme.
 * @param {string} [params.fallbackSourceColor] - The fallback source color for the theme.
 * @param {string} [params.sourceColor] - The primary source color for the theme.
 * 
 * @returns {Object} - An object containing the default theme, whether dynamic theme support is available, and the current color scheme.
 * @returns {ITheme} returns.theme - The default theme object.
 * @returns {boolean} returns.isSupported - Whether dynamic theme support is available for the current platform.
 * @returns {string} returns.colorScheme - The current color scheme (dark or light).
 * @returns {ITheme | null} - The default theme object or null if not supported.
 * 
 * @example
 * 
 * ```tsx
 * const defaultTheme = useGetDefaultTheme();
 * console.log(defaultTheme?.dark); // Outputs true or false based on the current color scheme
 * ```
 */
export const useGetMaterial3Theme = (params?: { fallbackSourceColor?: string; sourceColor?: string; }) => {
    const { theme: cTheme } = useMaterial3Theme(params);
    const colorScheme = useColorScheme();
    const isSupported = isDynamicThemeSupported.valueOf();
    const colors = (colorScheme ? (cTheme as any)[colorScheme] ?? {} : {}) as IThemeColorsTokens;
    const theme = { colors } as ITheme;
    theme.dark = colorScheme === 'dark';
    theme.colors = prepareMaterial3Theme(theme.colors, !!theme.dark);
    return { theme: theme, isSupported, colorScheme };
}

