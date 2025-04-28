import { IThemeColorSheme, ITheme, IThemeColorsTokenName, IThemeColorsTokens, IThemeFontsWithVariants } from "./types";
import Colors from "./colors";
import { defaultStr, extendObj, isNonNullString, isObj } from "@resk/core/utils";
import { IObservable, isObservable, observable } from "@resk/core/observable";
import { IDict } from "@resk/core/types";
import { Platform as RNPlatform, ViewStyle, StyleSheet } from "react-native";
import Session from "@resk/core/session";
import Color from "color";
import updateNative from "./updateNative";
import styles from "./styles";
import { useReskNative } from "@src/context/context"
import { defaultFontsConfig, defaultTextStylesVariants } from "./defaultFontsConfig";
import { generateElevations } from "./Elevations";
import lightColors from "./palettes/light";
import darkColors from "./palettes/dark";
import Logger from "@resk/core/logger";
import { IViewStyle } from "@src/types";

lightColors.backdrop = darkColors.backdrop = Colors.setAlpha("rgba(50, 47, 55, 1)", 0.4) as string;

const defaultElevations = generateElevations();

export * from "./types";


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
const isThemeManager = (theme: any) => {
    return isObj(theme) && theme && Array.isArray(theme.elevations) && isObj(theme.colors)
        && Colors.isValid(theme.colors.primary) && theme.colors.onPrimary
        && typeof theme.getColorScheme == 'function' && typeof theme.getColor == 'function'
        && typeof theme.addEventListener == 'function' && typeof theme.generateElevations == 'function'
        && isObj(theme.fonts)
}


class Theme {

    private static defaultTheme: IThemeManager = Theme.create(Theme.getDefaultTheme());
    /**
     * Retrieves the currently stored theme color scheme from session storage.
     * 
     * This method returns the color scheme stored in session storage, which is
     * used to determine the theme color scheme to apply to the application.
     * The color scheme is a string that can be either "light" or "dark".
     * 
     * @returns {string} The currently stored theme color scheme, either "light" or "dark".
     */
    static getColorSchemeFromSession() {
        return Session.get("theme-color-sheme");
    }

    /**
     * Sets the theme color scheme in session storage.
     *
     * This method updates the session storage with the given color scheme, which can
     * be either "light" or "dark". The input is validated to ensure it is a non-null
     * string matching one of the expected values. If the input is invalid, the method 
     * returns without making any changes.
     *
     * @param {"light" | "dark"} colorScheme - The color scheme to be set in session storage.
     */
    static setColorSchemeInSession(colorScheme: "light" | "dark") {
        colorScheme = defaultStr(colorScheme, "light").toLowerCase().trim() as any;
        if (!isNonNullString(colorScheme) || !["light", "dark"].includes(colorScheme)) return;
        Session.set("theme-color-sheme", colorScheme);
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
     * @returns {Partial<ITheme>} The active theme (light or dark) based on session storage or the default theme.
     */
    static getDefaultTheme(customTheme?: Partial<ITheme>): ITheme {
        // Retrieves the saved theme from the session (if available)
        const colorScheme = Theme.getColorSchemeFromSession();
        const isDarkFromSession = colorScheme === "dark";
        const themeNameObj = extendObj({}, { dark: isDarkFromSession }, customTheme);
        const lightTheme = { colors: lightColors }, darkTheme = { dark: true, colors: darkColors };
        const isDark = !!themeNameObj.dark;
        const theme = extendObj({}, (isDark ? darkTheme : lightTheme), themeNameObj);
        updateNative(theme);
        return theme;
    };


    private static setTheme(theme: IThemeManager) {
        Theme.defaultTheme = theme;
    }

    /**
     * Returns a boolean indicating whether the theme is currently in dark mode.
     * This value can be used to conditionally apply styles or logic based on the current theme.
     */
    static get dark() {
        return Theme.defaultTheme?.dark; // Check if the theme is dark
    }

    /**
     * Retrieves the name of the current theme.
     *
     * This function returns the name of the theme that is currently set as the default.
     * The theme name can be used to identify the active theme configuration.
     *
     * @returns {string | undefined} The name of the current theme, or `undefined` if no theme is set.
     */
    static getName() {
        return Theme.defaultTheme?.name; // Get the theme name
    }
    /**
     * Returns the color palette associated with the current theme.
     *
     * This property provides read-only access to the color palette of the current theme.
     * It is useful for accessing the individual colors of the theme, such as the primary color,
     * on-surface color, or background color.
     * @returns {IThemeColorsTokens} The color palette of the current theme.
     */
    static get colors(): IThemeColorsTokens {
        return Theme.defaultTheme?.colors; // Access the color palette
    }

    /**
     * Retrieves a color from the current theme based on a given color token.
     * If the color token is not found in the theme, it will return the first item in the defaultColors array if it exists.
     * If no defaultColors are provided, it will return undefined.
     * @param {IThemeColorsTokenName} [color] - The color token to retrieve from the theme.
     * @param {...any[]} defaultColors - An array of default colors to use if the color token is not found in the theme.
     * @returns {string | undefined} The color associated with the given color token, or the first item in the defaultColors array, or undefined.
     */
    static getColor(color?: IThemeColorsTokenName, ...defaultColors: any[]): string | undefined {
        return Theme.defaultTheme?.getColor(color, ...defaultColors);
    }
    /**
     * Retrieves a color scheme from the current theme based on a given color scheme token.
     *
     * This function returns an object containing the foreground and background colors
     * associated with the specified color scheme token. If the color scheme token is not
     * found in the theme, it will return a default color scheme as defined in the theme configuration.
     *
     * @param {IThemeColorsTokenName} [colorSheme] - The color scheme token to retrieve from the theme.
     * @returns {IThemeColorSheme} The color scheme object containing `color` and `backgroundColor`.
     */
    static getColorScheme(colorSheme?: IThemeColorsTokenName): IThemeColorSheme {
        return Theme.defaultTheme?.getColorScheme(colorSheme);
    }
    /**
     * Provides read-only access to the styles object of the current theme.
     * This object contains all the styles that can be used to style components.
     * It is useful for accessing the individual styles of the theme, such as the text style,
     * or the style for a specific component like a button or a card.
     * @returns {typeof styles} The styles object of the current theme.
     */
    static get styles(): typeof styles {
        return Theme.defaultTheme.styles;
    }

    /**
     * Provides read-only access to the elevation styles of the current theme.
     * 
     * This property returns the array of elevation styles that can be used to style 
     * components with different depth levels. It is useful for applying shadow 
     * effects according to the Material Design specifications.
     * 
     * @returns {Array} The array of elevation styles from the current theme.
     */
    static get elevations() {
        return Theme.defaultTheme.elevations;
    }

    /**
     * Provides read-only access to the custom CSS styles of the current theme.
     * This property returns the custom CSS styles that can be used to style
     * components with custom styles not provided by the theme out of the box.
     * It is useful for applying custom CSS styles to components that do not
     * have a corresponding style in the theme.
     * @returns {string | undefined} The custom CSS styles of the current theme.
     */
    static get customCSS() {
        return Theme.defaultTheme.customCSS;
    }

    /**
     * Retrieves the current roundness value from the theme.
     *
     * The roundness value is a number between 0 and 1 that determines the level of rounding
     * applied to various UI components, such as buttons, cards, and text fields.
     * A value of 0 results in sharp corners, while a value of 1 results in fully rounded corners.
     * The default value is 0.5.
     *
     * @returns {number} The current roundness value from the theme.
     */
    static get roundness() {
        return Theme.defaultTheme.roundness;
    }

    /**
     * Returns the current theme instance.
     *
     * This property returns the current theme instance used by the application.
     * The theme instance is an object that contains all the properties and
     * methods that are available on the Theme class.
     *
     * @returns {IThemeManager} The current theme instance.
     */
    static get current(): IThemeManager {
        return Theme.defaultTheme;
    }
    /**
     * Returns a function that can be used to add an event listener to the theme update event.
     *
     * The returned function takes a single callback function as an argument. The callback function
     * is called whenever the theme is updated, and it receives the updated theme as its argument.
     *
     * This function is useful if you want to react to theme changes in a custom component or
     * in a non-React context.
     *
     * @returns {(callback: (theme: ITheme) => any) => { remove: () => any }} A function that can be used to add an event listener to the theme update event.
     */
    static get addEventListener() {
        return addEventListener;
    }

    /**
     * Updates the application theme and triggers necessary UI updates.
     * 
     * This function allows you to change the application's theme dynamically. It saves the new theme in the session, 
     * updates the theme reference, applies the theme to native elements, and optionally triggers an event to notify 
     * other parts of the app that the theme has changed.
     * 
     * @param {Partial<ITheme>} theme - The new theme to be applied to the application.
     * @param {boolean} [trigger=false] - Whether to trigger the theme update event (default is `false`).
     * 
     * @returns {ITheme} - The updated theme that has been applied.
     */
    static update(theme: Partial<ITheme>, trigger: boolean = false): IThemeManager {
        // Update the theme reference
        const newTheme = Theme.create(theme);
        Theme.setTheme(newTheme);
        // Apply the theme to native elements (like the status bar)
        updateNative(newTheme);

        // Save the theme name in the session
        Theme.setColorSchemeInSession(newTheme.dark ? "dark" : "light");

        // Optionally trigger a global theme update event
        if (trigger) {
            Theme.triggerUpdate(newTheme);
        }
        return newTheme;
    }

    /**
     * create a theme object by adding utility functions such as `getColor` and `getColorScheme`.
     * 
     * The `create` function extends the given `theme` object by adding useful methods 
     * that simplify working with colors in the theme. It includes methods to retrieve colors 
     * and to generate color schemes based on the theme configuration.
     * import {Theme} from "@resk/native";
     * @example
     * ```ts
     * const theme = {
     *   name : "MyTheme",
     *   dark : false,
     *   colors: {
     *     primary: "#6200ea",
     *     onPrimary: "#ffffff",
     *     surface: "#f5f5f5",
     *     onSurface: "#272727",
     *     secondary: "#03dac6",
     *   },
     * };
     * 
     * const newTheme = Theme.create(theme);
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
     * @param {Object} options - Optional options for the theme creation.
     * @param {number} options.maxElevation - The maximum elevation level for the theme. Defaults to 24.
     * @returns {Partial<ITheme>} - The theme object extended with utility methods.
     */
    static create(theme: Partial<ITheme>, options?: { maxElevation?: number }): IThemeManager {
        if (isObj(theme) && isThemeManager(theme)) return theme as IThemeManager;
        theme = extendObj({}, theme?.dark ? { colors: lightColors } : { colors: darkColors }, theme);
        const context: ITheme = theme as ITheme;
        const elvs = typeof options?.maxElevation == "number" && options?.maxElevation > 10 ? generateElevations(options?.maxElevation) : defaultElevations;
        const elevations = Array.isArray((context as any).elevations) ? (context as any).elevations : elvs;
        const { variants, ...restFonts } = Object.assign({}, context.fontsConfig);
        const fontsConfig = extendObj({}, defaultFontsConfig, restFonts);
        const fonts: IThemeFontsWithVariants = fontsConfig[String(RNPlatform.OS).toLowerCase()] || fontsConfig.default;
        const textStylesVariants = extendObj({}, defaultTextStylesVariants, variants);
        Object.keys(textStylesVariants).map((key) => {
            const variant = textStylesVariants[key as any];
            if (variant) {
                const str = key.toLowerCase();
                let cFont = fonts.regular;
                if (str.startsWith("display") || str.startsWith("headline") || str.startsWith("title")) {
                    cFont = fonts.medium;
                }
                if (cFont) {
                    if (cFont.fontFamily && !variant.fontFamily) {
                        variant.fontFamily = cFont.fontFamily;
                    }
                    if (cFont.fontWeight && !variant.fontWeight) {
                        variant.fontWeight = cFont.fontWeight;
                    }
                }
                fonts[key as keyof typeof fonts] = extendObj({}, variant, fonts[key as keyof typeof fonts]);
            }
        });
        return {
            ...theme as ITheme,
            get styles() {
                return styles;
            },
            get elevations() {
                return elevations;
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
            getColor(color?: IThemeColorsTokenName, ...defaultColors: any[]): string | undefined {
                if (isNonNullString(color) && color in context.colors) {
                    return context.colors[color as keyof typeof context.colors] as string;
                }
                if (Colors.isValid(color)) return color as string;
                for (let i in defaultColors) {
                    if (typeof defaultColors[i] === "string") {
                        const col = this.getColor(defaultColors[i] as IThemeColorsTokenName);
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
             * // Returns: { color: "#272727", backgroundColor: "#f5f5f5" }
             * ```
             * 
             * @param {IThemeColorsTokenName} [colorSheme] - The color key to generate a scheme for.
             * @returns {IThemeColorSheme} - An object containing `color` and `backgroundColor` properties.
             */
            getColorScheme(colorSheme?: IThemeColorsTokenName): IThemeColorSheme {
                if (colorSheme === "transparent") {
                    return {}
                }
                if (!colorSheme || typeof colorSheme != "string" || !(colorSheme in context.colors)) {
                    return {};
                }
                const result: { color?: string; backgroundColor?: string } = {};
                // Handle "on" prefixed colors (e.g., "onPrimary")
                if ((colorSheme as string).startsWith("on")) {
                    (result as IDict).backgroundColor = context.colors[colorSheme];
                    let colorKey = colorSheme.slice(2);
                    if (colorKey) {
                        colorKey = colorKey.charAt(0).toLowerCase() + colorKey.slice(1);
                        if (colorKey in context.colors) {
                            (result as IDict).color = context.colors[colorKey as keyof typeof context.colors];
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
            get addEventListener() {
                return addEventListener;
            },
            /***
             * Returns the fonts object for the current platform.
             * 
             * @returns {IThemeFonts} The fonts object for the current platform.
             * 
             * @example
             * ```typescript
             * const fonts = theme.fonts;
             * console.log(fonts); // Output: The fonts object for the current Platform
             */
            get fonts() {
                return fonts;
            },
            generateElevations,
        };
    }

    /**
     * Triggers a theme update event with the provided theme object.
     * This function checks if the provided theme is a valid object before triggering the event.
     *
     * @param {ITheme} theme - The theme object to be used for the update event.
     * @returns {void} This function does not return a value.
     *
     * @example
     * import {Theme} from "@resk/native";
     * const newTheme = {
     *   primaryColor: '#6200ee',
     *   secondaryColor: '#03dac6',
     *   // other theme properties...
     * };
     *
     * Theme.triggerUpdate(newTheme);
     * // This will trigger the UPDATE_THEME event with the new theme.
     */
    static triggerUpdate(theme: ITheme): void {
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
     * 
     * @returns {animated?:boolean, backgroundColor?:string, style?:"light" | "dark"} - The status bar properties including the style and background color.
     * 
     * @example
     * ```ts
     * import {Theme} from "@resk/native";
     * const statusBarProps = Theme.getStatusBarProps();
     * console.log(statusBarProps.style); // Logs "light" or "dark" based on the current theme's status bar color
     * ```
     */
    static getStatusBarProps(): { animated?: boolean, backgroundColor?: string, style?: "light" | "dark" } {
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
     * This function is a copy of the implementation found in react-native-paper. 
     * @see : https://github.com/callstack/react-native-paper/blob/main/src/utils/splitStyles.ts
     * 
     * Utility function to split a style object into separate objects based on the provided filters. It splits a `ViewStyle` object into multiple parts based on filters provided.
     * 
     * The function iterates through the properties of a style object and splits them
     * into multiple groups, each corresponding to a provided filter function. The filters
     * determine which style properties belong to which group. A final "rest" group contains
     * all the styles that do not match any of the filters.
     * 
     * @template Tuple - A tuple of filter functions used to split the styles.
     * 
     * @param {IViewStyle} styles - The style object containing various style properties.
     * @param {...Tuple} filters - A set of filter functions. Each filter function takes
     * a style property name as a string and returns a boolean indicating whether the property
     * should belong to the corresponding group.
     * 
     * @returns {[ViewStyle, ...MappedTuple<Tuple>]} - An array of filtered style objects where each element is a `ViewStyle`.
     * - The first style object contains the properties that didn't match any filter.
     * - After that, there will be a style object for each filter you passed in the same order as the matching filters.
     * - A style property will exist in a single style object, the first filter it matched.
     * 
     * @example
     * ```typescript
     * const styles = {
     *   color: 'red',
     *   backgroundColor: 'blue',
     *   width: 100,
     *   height: 200,
     * };
     * 
     * // Filters to separate color-related properties and size-related properties.
     * const isColor = (prop: string) => prop === 'color' || prop === 'backgroundColor';
     * const isSize = (prop: string) => prop === 'width' || prop === 'height';
     * 
     * const [restStyles, colorStyles, sizeStyles] = splitStyles(styles, isColor, isSize);
     * 
     * console.log(restStyles); // Outputs: {}
     * console.log(colorStyles); // Outputs: { color: 'red', backgroundColor: 'blue' }
     * console.log(sizeStyles); // Outputs: { width: 100, height: 200 }
     * ```
     * @example
     * const styles = {
     *   color: 'red',
     *   fontSize: 16,
     *   fontWeight: 'bold',
     *   padding: 10,
     * };
     *
     * const filters = [
     *   (property) => property === 'color' || property === 'fontSize',
     *   (property) => property === 'fontWeight',
     * ];
     *
     * const split = splitStyles(styles, ...filters);
     * console.log(split);
     * // Output:
     * // [
     * //   { padding: 10 },
     * //   { color: 'red', fontSize: 16 },
     * //   { fontWeight: 'bold' },
     * // ]
     */
    static splitStyles<Tuple extends FiltersArray>(styles: IViewStyle, ...filters: Tuple): [ViewStyle, ...MappedTuple<Tuple>] {
        // Log an error in development mode if no filters are provided
        if (process.env.NODE_ENV !== 'production' && filters.length === 0) {
            Logger.error('No filters were passed when calling splitStyles');
        }
        const flattenStyles = StyleSheet.flatten([styles]);
        const newStyles = filters.map(() => [] as Entry[]);

        const rest: Entry[] = [];

        outer: for (const item of Object.entries(flattenStyles) as Entry[]) {
            for (let i = 0; i < filters.length; i++) {
                if (typeof filters[i] === "function" && filters[i](item[0])) {
                    // If a filter matches, add the style property to the corresponding filtered styles array
                    newStyles[i].push(item);
                    continue outer; // Skip to the next style property after a match is found
                }
            }
            rest.push(item);
        }

        newStyles.unshift(rest);
        return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
            ViewStyle,
            ...MappedTuple<Tuple>
        ];
    }
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
 * This is the result obtained by calling create on an `ITheme`
 * 
 * @method getColor
 * @description Retrieves a specific color from the theme based on the color key.
 * @param {string | IThemeColorsTokenName} [color] - The key of the color to retrieve (e.g., "primary", "warning").
 * @param {...any[]} defaultColors - Default colors to return if the requested color is not found.
 * @returns {string | undefined} The color string if found, otherwise one of the default colors.
 * 
 * @method getColorScheme
 * @description Retrieves a color scheme with `color` and `backgroundColor` based on the provided color scheme key.
 * @param {IThemeColorsTokenName} [colorSheme] - The key of the color scheme to retrieve (e.g., "primary", "error").
 * @returns {IThemeColorSheme} An object containing `color` and `backgroundColor` properties.
 * 
 * @example 
 * const theme: IThemeManager = create({
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
 * const primaryColor = theme.getColor("primary", "#272727"); // "#6200EE"
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
    getColor(color?: IThemeColorsTokenName, ...defaultColors: any[]): string | undefined;
    getColorScheme(colorSheme?: IThemeColorsTokenName): IThemeColorSheme
    styles: typeof styles;
    elevations: ReturnType<typeof generateElevations>;
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
    /***
     * The fonts value is used to customize the fonts used in the application.
     * This property allows you to define the font styles for different platforms and font weights.
     */
    fonts: IThemeFontsWithVariants;

    /**
     * Generates an array of elevation styles for a given depth.
     * 
     * @param depth The maximum elevation depth. Defaults to `maxElevation` if not provided.
     * @returns An array of elevation styles, where each style corresponds to an elevation depth from 0 to `depth`.
     * 
     * @example
     * const elevationStyles = generateElevations(5);
     * console.log(elevationStyles); // Output: An array of 5 elevation styles
     */
    generateElevations: typeof generateElevations;
};

export * from "./useColorScheme";

export { default as Colors } from "./colors";

/**
 * @group ReskNativeProvider
 * @function useTheme
 * `useTheme` is a custom hook that provides the current theme used in the application.
 * 
 * It fetches the theme from the `ReskNativeProvider` context. If no theme is provided 
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
    const { theme } = useReskNative();
    /**
     * Returns the current theme from `ReskNativeProvider` context.
     * If no theme is found, it returns the default `Theme` from `@theme`.
     */
    return (theme || Theme) as IThemeManager;
};




/**
 * @interface
 * A type representing an array of filter functions.
 * Each filter function takes a style property key and returns a boolean indicating
 * whether the property matches the filter criteria.
 */
type FiltersArray = readonly ((style: keyof ViewStyle) => boolean)[];

/**
 * @interface
 * A type representing the style of a ViewStyle object.
 * This type extracts the values of the ViewStyle properties.
 */
type Style = ViewStyle[keyof ViewStyle];

/**
 * @interface
 * A type representing a key-value pair of a style property.
 * The first element is the key (property name) of the style,
 * and the second element is the corresponding value of that property.
 */
type Entry = [keyof ViewStyle, Style];

/**
 * @interface
 * A mapped type that creates an array of ViewStyle objects based on the provided FiltersArray.
 * Each index in the mapped tuple corresponds to a filter, and the length of the tuple
 * matches the length of the FiltersArray.
 *
 * @template Tuple - A tuple type that extends FiltersArray.
 */
type MappedTuple<Tuple extends FiltersArray> = {
    [Index in keyof Tuple]: ViewStyle; // Maps each index to a ViewStyle object.
} & { length: Tuple['length'] }; // Ensures the length property matches the original tuple length.