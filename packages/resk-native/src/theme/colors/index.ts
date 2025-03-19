import { defaultStr, isNonNullString } from "@resk/core";
import Color from "color";

/**
 * Sets the alpha (transparency) level for a given color.
 * 
 * This function takes a color string and applies an alpha value to it, returning the color with the new transparency. 
 * If no alpha value is provided, it defaults to  `0.6`.
 * 
 * @param {string} color - The base color to modify. This should be a valid CSS color string (e.g., `"#ff0000"`, `"rgb(255, 0, 0)"`).
 * @param {number} [alpha=0.6] - The alpha (transparency) value to apply. Should be a value between `0` (completely transparent) and `1` (completely opaque). 
 * Defaults to `0.6` if not provided.
 * 
 * @returns {(string | undefined)} The color string with the new alpha value if successful, or `undefined` if the input is invalid.
 * 
 * @example
 * ```ts
 * // Applying 50% transparency to a red color
 * const transparentRed = setAlpha("#ff0000", 0.5); 
 * console.log(transparentRed); // "rgba(255, 0, 0, 0.5)"
 * 
 * // Using the default alpha value
 * const defaultAlphaRed = setAlpha("#ff0000");
 * console.log(defaultAlphaRed); // "rgba(255, 0, 0, 0.6)"
 * ```
 * 
 * @remarks
 * This function depends on the `Color` library, which should be available in your project for it to work.
 */
const setAlpha = (color?: string, alpha: number = 0.6): string | undefined => {
    return Color(color)?.alpha(alpha)?.toString();
};


/**
 * Checks if the given color is a valid hexadecimal color.
 * 
 * This function validates whether the input string is in a valid hexadecimal color format 
 * (e.g., `#fff`, `#ffffff`).
 * 
 * @param {string | null} color - The color string to validate. It can be `null` or a string.
 * 
 * @returns {boolean} Returns `true` if the color is a valid hex code, otherwise returns `false`.
 * 
 * @example
 * ```ts
 * const isValidHex = isHex("#ff0000"); 
 * console.log(isValidHex); // true
 * 
 * const isInvalidHex = isHex("rgb(255, 0, 0)"); 
 * console.log(isInvalidHex); // false
 * ```
 */
const isHex = (color: string | null): boolean => {
    return color && typeof color == 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(color) ? true : false;
};


/**
* Validates whether the given color is in a recognized format (hex or other).
* 
* This function checks if the color is either a valid hex color or a valid color string 
* that can be parsed by the `Color` library.
* 
* @param {any} color - The color to validate. Expected to be a string, but any type can be passed.
* 
* @returns {boolean} Returns `true` if the color is valid, otherwise returns `false`.
* 
* @example
* ```ts
* const validHex = isValid("#ff0000"); 
* console.log(validHex); // true
* 
* const validColorName = isValid("red"); 
* console.log(validColorName); // true
* 
* const invalidColor = isValid("notacolor"); 
* console.log(invalidColor); // false
* ```
*/
const isValid = (color: any): color is string => {
    if (!color || typeof color !== 'string') return false;
    if (["transparent"].includes(color)) return true;
    try {
        return isHex(color) || isHex(Color(color)?.hex()?.toString());
    } catch (err) {
        return false;
    }
};



/**
* Darkens a given color by a specified ratio.
* 
* This function takes a valid color string and darkens it by the specified ratio. 
* If no ratio is provided, the default value is `10`.
* 
* @param {string} color - The base color to darken. This should be a valid color string.
* @param {number} [ratio=10] - The ratio by which to darken the color. Should be a positive number.
* 
* @returns {string | undefined} Returns the darkened color string, or `undefined` if the color is invalid.
* 
* @example
* ```ts
* const darkRed = darken("#ff0000", 20); 
* console.log(darkRed); // A darker shade of red
* 
* const defaultDarkRed = darken("#ff0000"); 
* console.log(defaultDarkRed); // A slightly darker shade of red (with ratio 10)
* ```
*/
const darken = (color: string, ratio: number = 10): string | undefined => {
    return isValid(color) ? Color(color)?.darken(ratio)?.toString() : undefined;
};


/**
* Lightens a given color by a specified ratio.
* 
* This function takes a valid color string and lightens it by the specified ratio. 
* If no ratio is provided, the default value is `10`.
* 
* @param {string} color - The base color to lighten. This should be a valid color string.
* @param {number} [ratio=10] - The ratio by which to lighten the color. Should be a positive number.
* 
* @returns {string | undefined} Returns the lightened color string, or `undefined` if the color is invalid.
* 
* @example
* ```ts
* const lightRed = lighten("#ff0000", 20); 
* console.log(lightRed); // A lighter shade of red
* 
* const defaultLightRed = lighten("#ff0000"); 
* console.log(defaultLightRed); // A slightly lighter shade of red (with ratio 10)
* ```
*/
const lighten = (color: string, ratio: number = 10): string | undefined => {
    return isValid(color) ? Color(color)?.lighten(ratio)?.toString() : undefined;
};



/**
 * Converts a hex color string to an RGB tuple.
 * 
 * This function takes a hex color string and converts it to a tuple of red, green, and blue values. 
 * It handles both 3-digit (shorthand) and 6-digit hex formats. If the input is invalid, it returns `null`.
 * 
 * @param {string} hex - The hex color string. It can start with or without a `#` (e.g., `"#03f"` or `"03f"`).
 * 
 * @returns {[number, number, number] | null} A tuple containing the red, green, and blue values as numbers, or `null` if the input is not a valid hex string.
 * 
 * @example
 * ```ts
 * const rgb = hexToRgb("#03f"); 
 * console.log(rgb); // [0, 51, 255]
 * 
 * const fullHexRgb = hexToRgb("#0033ff"); 
 * console.log(fullHexRgb); // [0, 51, 255]
 * 
 * const invalidHex = hexToRgb("#xyz");
 * console.log(invalidHex); // null
 * ```
 */
const hexToRgb = (hex: string): [number, number, number] | null => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse shorthand hex (e.g. "03F") to full hex (e.g. "0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Check if the hex code is valid
    if (hex.length !== 6) {
        return null;
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return [r, g, b];
};


/**
* Extracts RGB values from an RGB color string.
* 
* This function takes an RGB color string in the format `"rgb(r, g, b)"` or `"r, g, b"` and extracts 
* the red, green, and blue values, returning them as a tuple. If the input string is invalid, it returns `null`.
* 
* @param {string} rgb - The RGB color string in the format `"r, g, b"` or `"rgb(r, g, b)"`.
* 
* @returns {[number, number, number] | null} A tuple containing the red, green, and blue values as numbers, or `null` if the input is not a valid RGB string.
* 
* @example
* ```ts
* const rgbTuple = rgbStringToRgb("rgb(255, 0, 0)"); 
* console.log(rgbTuple); // [255, 0, 0]
* 
* const rgbValuesOnly = rgbStringToRgb("255, 0, 0");
* console.log(rgbValuesOnly); // [255, 0, 0]
* 
* const invalidRgb = rgbStringToRgb("not-a-color");
* console.log(invalidRgb); // null
* ```
*/
const rgbStringToRgb = (rgb: string): [number, number, number] | null => {
    const result = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (!result) {
        return null;
    }

    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);

    return [r, g, b];
};


/**
* Calculates the brightness of a color string.
* 
* This function computes the brightness of a given color in either hex or RGB format. 
* It applies the formula `0.299 * r + 0.587 * g + 0.114 * b` to determine the brightness based on the RGB values.
* 
* @param {string} color - The color string in hex (e.g., `"#03f"`, `"#0033ff"`) or RGB (e.g., `"rgb(0, 51, 255)"`) format.
* 
* @returns {number | null} The calculated brightness value (a number between 0 and 255) or `null` if the color format is invalid.
* 
* @example
* ```ts
* const brightnessHex = getBrightness("#03f"); 
* console.log(brightnessHex); // 74.717
* 
* const brightnessRgb = getBrightness("rgb(0, 51, 255)"); 
* console.log(brightnessRgb); // 74.717
* 
* const invalidBrightness = getBrightness("not-a-color");
* console.log(invalidBrightness); // null
* ```
*/
const getBrightness = (color: string): number | null => {
    if (!isNonNullString(color)) return null;
    if (!color.startsWith("#")) {
        color = Color(color).hex();
    }
    let rgb: [number, number, number] | null;
    if (color.startsWith('#')) {
        rgb = hexToRgb(color);
    } else if (color.startsWith('rgb')) {
        rgb = rgbStringToRgb(color);
    } else {
        return null;
    }

    if (!rgb) {
        return null;
    }

    const [r, g, b] = rgb;
    return 0.299 * r + 0.587 * g + 0.114 * b;
};


/**
* Determines the appropriate contrast color for text based on the brightness of a given background color.
* 
* This function calculates the brightness of the input hex color and returns either "black" or "white" 
* as the contrast color. The result ensures good contrast between the foreground and background colors. 
* The optional `comparator` allows for customizing the brightness threshold.
* 
* @param {string} hexcolor - The background color in hex format (e.g., `"#03f"`, `"#0033ff"`).
* @param {number} [comparator=170] - (Optional) The brightness threshold for deciding the contrast color. Default is 170.
* 
* @returns {string} The contrast color, either `"black"` or `"white"`, based on the brightness of the input color.
* If the input color is invalid, it returns `"black"` by default.
* 
* @example
* ```ts
* const contrastBlack = getContrast("#ffffff");
* console.log(contrastBlack); // "black"
* 
* const contrastWhite = getContrast("#000000");
* console.log(contrastWhite); // "white"
* 
* const customThresholdContrast = getContrast("#888888", 200);
* console.log(customThresholdContrast); // "white"
* 
* const invalidColorContrast = getContrast("not-a-color");
* console.log(invalidColorContrast); // "black"
* ```
*/
const getContrast = function (hexcolor: string, comparator?: number): string | undefined {
    if (comparator === undefined && isNonNullString(hexcolor)) {
        try {
            return Color(hexcolor).isLight() ? "black" : "white";
        } catch (e) { }
    }
    try {
        const contrastColor = getBrightness(hexcolor);
        if (!contrastColor) return 'black'; // return black if invalid color

        comparator = typeof comparator === 'number' && comparator > 10 ? comparator : 170;
        return contrastColor >= comparator ? 'black' : 'white';
    } catch (error) {
        return undefined;
    }
};

/**
 * Returns the contrast color of the given input color.
 * 
 * @param inputColor The color to calculate the contrast for.
 * @param options An object containing the dark and light colors to use for contrast.
 * @param options.darkColor The dark color to use for contrast. Defaults to "black".
 * @param options.lightColor The light color to use for contrast. Defaults to "white".
 * 
 * @returns The contrast color of the input color.
 * 
 * @example
 * const contrastColor = getContrastingColor("#ffffff", { darkColor: "#000000", lightColor: "#ffffff" });
 * console.log(contrastColor); // Output: "#000000"
 */
const getContrastingColor = (inputColor: string, { darkColor, lightColor }: { darkColor: string, lightColor: string }) => {
    darkColor = defaultStr(darkColor, "black");
    lightColor = defaultStr(lightColor, "white");
    const contrastColor = getContrast(inputColor);
    if (contrastColor === "black") {
        return darkColor;
    }
    return lightColor;
}

/**
 * Fades a color by the specified amount.
 * This function takes a color string (hex or rgba) and a fade value between 0 and 1.
 * 
 * @param {string} color - The color to fade, provided as a hex (e.g., "#3498db") or rgba string.
 * @param {number} fade - The fade value where 0 is fully transparent and 1 is fully opaque.
 * @returns {string} The color with the adjusted opacity in rgba format.
 * 
 * @example
 * ```
 * fade("#3498db", 0.5); // "rgba(52, 152, 219, 0.5)"
 * ```
 */
function fade(color: string, fade?: number): string | undefined {
    if (typeof fade !== 'number') {
        fade = 0.5;
    }
    if (!isValid(color)) return undefined;
    return Color(color).fade(fade).rgb().string();
}
/***
 * Checks if the given color is considered light.
 * 
 * @param {string} color - The color to check.
 * @returns {boolean} Returns `true` if the color is considered light, otherwise returns `false`.
 * 
 * @example
 * ```ts
 * const isLightColor = isLight("#ffffff"); 
 * console.log(isLightColor); // true
 * 
 * const isDarkColor = isLight("#000000"); 
 * console.log(isDarkColor); // false
 * ```
 */
function isLight(color: string): boolean {
    return Color(color).isLight();
}

/***
 * Checks if the given color is considered dark.
 * 
 * @param {string} color - The color to check.
 * @returns {boolean} Returns `true` if the color is considered dark, otherwise returns `false`.
 * 
 * @example
 * ```ts
 * const isDarkColor = isDark("#ffffff"); 
 * console.log(isDarkColor); // false
 * 
 * const isLightColor = isDark("#000000"); 
 * console.log(isLightColor); // true
 * ```
 */
function isDark(color: string): boolean {
    try {
        return Color(color).isDark();
    } catch (e) {
        return false;
    }
}
/***
 * Mixes two colors together using a specified weight.
 * 
 * @param {string} color1 - The first color to mix.
 * @param {string} color2 - The second color to mix.
 * @param {number} weight - The weight of the second color in the mix. Should be a value between 0 and 1.
 * @returns {string | undefined} The mixed color in rgba format, or `undefined` if the input is invalid.
 * 
 * @example
 * ```ts
 * const mixedColor = mix("#3498db", "#f00", 0.5); // "rgba(52, 152, 219, 0.5)"
 * ```  
 */
function mix(color1: string, color2: string, weight: number): string | undefined {
    try {
        return Color(color1).mix(Color(color2), weight).rgb().string();
    } catch (e) {
        return undefined;
    }
}

export default { setAlpha, isLight, mix, isDark, fade, isHex, isValid, getContrastingColor, darken, lighten, hexToRgb, rgbStringToRgb, getBrightness, getContrast };