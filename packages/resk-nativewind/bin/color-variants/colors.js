"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantsColorsFactory = void 0;
const isNonNullString = (x) => typeof x === "string" && x;
class VariantsColorsFactory {
    /**
     * Registers a set of color variants in the design system.
     *
     * @param colors - An object with color names as keys and their variant properties as values.
     * Each variant property must contain the following:
     * - lightColor: The color name or foreground for light mode.
     * - lightForeground: The foreground color for light mode.
     * - darkColor: The color name or foreground for dark mode.
     * - darkForeground: The foreground color for dark mode.
     *
     * @returns The updated IVariantsColorsMap of registered color variants.
     */
    static registerColor(colors) {
        Object.entries(Object.assign({}, colors)).map(([color, value]) => {
            if (!value || typeof value !== "object" || !isNonNullString(value === null || value === void 0 ? void 0 : value.lightColor) || !isNonNullString(value === null || value === void 0 ? void 0 : value.darkColor))
                return;
            this._colors[color] = value;
        });
        return VariantsColorsFactory._colors;
    }
    /**
     * Returns the registered color variants in the design system.
     *
     * @returns The registered IVariantsColorsMap of color variants.
     */
    static get colors() {
        return this._colors;
    }
    /**
     * Generates a map of Tailwind CSS class names for all registered color variants.
     *
     * This static method builds a record of color variant class names, supporting both light and dark modes,
     * as well as optional foreground suffixes and important modifiers. It is highly customizable via a builder function,
     * allowing you to generate class names for backgrounds, text, borders, or any other Tailwind color utility.
     *
     * @typeParam TailwindClassPrefix - The prefix for the Tailwind class (e.g., `"bg"`, `"text"`, `"border"`).
     * @typeParam ClassNameBuilderResult - The result type returned by the class name builder (usually a string or object).
     *
     * @param tailwindClassPrefix - The Tailwind class prefix to use (e.g., `"bg"`, `"text"`, `"border"`).
     * @param withImportantAttribute - If `true`, prepends `!` to each class name to mark it as important.
     * @param colorClassNameBuilder - (Optional) A custom builder function to generate the class name(s) for each color variant.
       @param withHover2ActiveState - If `true`, appends `hover:active:bg-hover-active-color` to each class name to mark it as hover2active state.
     *   If not provided, the default builder returns a string combining the light and dark class names.
     * @param isForeground - (Optional) Specify if we are building a foreground color or not.
     *
     * @returns A record mapping each registered color name to the generated class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate background color classes for all variants
     * const bgClasses = VariantsColorsFactory.buildColors("bg");
     * // bgClasses.primary => "bg-primary dark:bg-dark-primary"
     *
     * // Generate text color classes with important modifier
     * const textClasses = VariantsColorsFactory.buildColors("text", true);
     * // textClasses.error => "!text-red-500 dark:!text-red-600"
     *
     * // Generate only foreground color classes for backgrounds
     * const fgClasses = VariantsColorsFactory.buildColors("bg", false, undefined, "-foreground");
     * // fgClasses.primary => "bg-primary-foreground dark:bg-dark-primary-foreground"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customClasses = VariantsColorsFactory.buildColors("border", false, (opts) => ({
     *   light: opts.lightComputedColor,
     *   dark: opts.darkComputedColor
     * }));
     * // customClasses.success => { light: "border-green-500", dark: "dark:border-green-600" }
     * ```
     *
     * @remarks
     * - The method iterates over all registered colors in the design system.
     * - The builder function receives a detailed options object for each color, allowing for advanced customization.
     * - This method is the foundation for `buildTextColors`, `buildBackgroundColors`, and `buildBorderColors`.
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link IVariantsColors.ClassNameBuilderOptions}
     * @see {@link VariantsColorsFactory.buildTextColors}
     * @see {@link VariantsColorsFactory.buildBackgroundColors}
     * @see {@link VariantsColorsFactory.buildBorderColors}
     */
    static buildColors(tailwindClassPrefix, withImportantAttribute, colorClassNameBuilder, isForeground = false, withHover2ActiveState = false) {
        const r = Object.create({});
        const importantPrefix = withImportantAttribute ? "!" : "";
        const colorBuilder = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightComputedColor, darkComputedColor, activeDarkComputedColor, activeLightComputedColor, hoverDarkComputedColor, hoverLightComputedColor }) => `${lightComputedColor} ${darkComputedColor} ${withHover2ActiveState ? `${hoverLightComputedColor} ${hoverDarkComputedColor} ${activeLightComputedColor} ${activeDarkComputedColor}` : ""}`;
        Object.entries(VariantsColorsFactory.colors).map(([color, value]) => {
            const _a = Object.assign({}, value), { lightColor: light, lightForeground: _lightForeground, darkColor: dark, darkForeground: _darkForeground, hoverLightColor: _hoverLightColor, hoverDarkColor: _hoverDarkColor, hoverLightForeground: _hoverLightForeground, hoverDarkForeground: _hoverDarkForeground, activeLightColor: _activeLightColor, activeDarkColor: _activeDarkColor, activeLightForeground: _activeLightForeground, activeDarkForeground: _activeDarkForeground } = _a, rest = __rest(_a, ["lightColor", "lightForeground", "darkColor", "darkForeground", "hoverLightColor", "hoverDarkColor", "hoverLightForeground", "hoverDarkForeground", "activeLightColor", "activeDarkColor", "activeLightForeground", "activeDarkForeground"]);
            const lightColor = defaultStr(isForeground ? _lightForeground : light);
            const darkColor = defaultStr(isForeground ? _darkForeground : dark);
            const lightForeground = defaultStr(isForeground ? light : _lightForeground);
            const darkForeground = defaultStr(isForeground ? dark : _darkForeground);
            const hoverLightColor = defaultStr(isForeground ? _hoverLightForeground : _hoverLightColor);
            const hoverDarkColor = defaultStr(isForeground ? _hoverDarkForeground : _hoverDarkColor);
            const activeLightColor = defaultStr(isForeground ? _activeLightForeground : _activeLightColor);
            const activeDarkColor = defaultStr(isForeground ? _activeDarkForeground : _activeDarkColor);
            const hoverLightForeground = defaultStr(isForeground ? _hoverLightColor : _hoverLightForeground);
            const hoverDarkForeground = defaultStr(isForeground ? _hoverDarkColor : _hoverDarkForeground);
            const activeLightForeground = defaultStr(isForeground ? _activeLightColor : _activeLightForeground);
            const activeDarkForeground = defaultStr(isForeground ? _activeDarkColor : _activeDarkForeground);
            r[color] = colorBuilder(Object.assign(Object.assign({}, rest), { hoverLightColor,
                hoverDarkColor,
                activeLightColor,
                activeDarkColor,
                hoverLightForeground,
                hoverDarkForeground,
                activeLightForeground,
                activeDarkForeground, isForeground: !!isForeground, lightColor,
                darkColor, lightComputedColor: `${importantPrefix}${tailwindClassPrefix}-${lightColor}`, darkComputedColor: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}`, darkForeground,
                lightForeground, lightComputedForeground: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}`, darkComputedForeground: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}`, hoverLightComputedColor: hoverLightColor ? `hover:${importantPrefix}${tailwindClassPrefix}-${hoverLightColor}` : "", hoverDarkComputedColor: hoverDarkColor ? `dark:hover:${importantPrefix}${tailwindClassPrefix}-${hoverDarkColor}` : "", hoverLightComputedForeground: hoverLightForeground ? `hover:${importantPrefix}${tailwindClassPrefix}-${hoverLightForeground}` : "", hoverDarkComputedForeground: hoverDarkForeground ? `dark:hover:${importantPrefix}${tailwindClassPrefix}-${hoverDarkForeground}` : "", activeLightComputedColor: activeLightColor ? `active:${importantPrefix}${tailwindClassPrefix}-${activeLightColor}` : "", activeDarkComputedColor: activeDarkColor ? `dark:active:${importantPrefix}${tailwindClassPrefix}-${activeDarkColor}` : "", activeLightComputedForeground: activeLightForeground ? `active:${importantPrefix}${tailwindClassPrefix}-${activeLightForeground}` : "", activeDarkComputedForeground: activeDarkForeground ? `dark:active:${importantPrefix}${tailwindClassPrefix}-${activeDarkForeground}` : "" }));
        });
        return r;
    }
    static buildTextForegroundColors(withImportantAttribute, colorClassNameBuilder, withHover2ActiveState = false) {
        return VariantsColorsFactory.buildColors("text", withImportantAttribute, colorClassNameBuilder, true, withHover2ActiveState);
    }
    /**
     * Generates a record of Tailwind CSS class names for all registered text color variants.
     *
     * This static method is a shortcut for generating text color classes using the `"text"` Tailwind prefix.
     * It supports both light and dark modes, as well as the important modifier and custom class name builders.
     *
     * @typeParam ClassNameBuilderResult - The result type returned by the class name builder (usually a string or object).
     *
     * @param withImportantAttribute - If `true`, prepends `!` to each class name to mark it as important.
     * @param colorClassNameBuilder - (Optional) A custom builder function to generate the class name(s) for each color variant.
         If not provided, the default builder returns a string combining the light and dark class names.
      @param withHover2ActiveState - If `true`, appends `hover:active:bg-hover-active-color` to each class name to mark it as hover2active state.
     *
     * @returns A record mapping each registered color name to the generated text class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate text color classes for all variants
     * const textClasses = VariantsColorsFactory.buildTextColors();
     * // textClasses.primary => "text-primary dark:text-dark-primary"
     *
     * // Generate text color classes with important modifier
     * const importantTextClasses = VariantsColorsFactory.buildTextColors(true);
     * // importantTextClasses.error => "!text-red-500 dark:!text-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customTextClasses = VariantsColorsFactory.buildTextColors(false, (opts) => ({
     *   light: opts.lightComputedColor,
     *   dark: opts.darkComputedColor
     * }));
     * // customTextClasses.success => { light: "text-green-500", dark: "dark:text-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColorsFactory.buildColors}
     */
    static buildTextColors(withImportantAttribute, colorClassNameBuilder, withHover2ActiveState = false) {
        return VariantsColorsFactory.buildColors("text", withImportantAttribute, colorClassNameBuilder, withHover2ActiveState);
    }
    /**
     * Generates a record of Tailwind CSS class names for all registered background color variants.
     *
     * This static method is a shortcut for generating background color classes using the `"bg"` Tailwind prefix.
     * It supports both light and dark modes, as well as the important modifier and custom class name builders.
     *
     * @typeParam ClassNameBuilderResult - The result type returned by the class name builder (usually a string or object).
     *
     * @param withImportantAttribute - If `true`, prepends `!` to each class name to mark it as important.
     * @param colorClassNameBuilder - (Optional) A custom builder function to generate the class name(s) for each color variant.
     *   If not provided, the default builder returns a string combining the light and dark class names.
       @param withHover2ActiveState - If `true`, appends `hover:active:bg-hover-active-color` to each class name to mark it as hover2active state.
     *
     * @returns A record mapping each registered color name to the generated background class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate background color classes for all variants
     * const bgClasses = VariantsColorsFactory.buildBackgroundColors();
     * // bgClasses.primary => "bg-primary dark:bg-dark-primary"
     *
     * // Generate background color classes with important modifier
     * const importantBgClasses = VariantsColorsFactory.buildBackgroundColors(true);
     * // importantBgClasses.error => "!bg-red-500 dark:!bg-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customBgClasses = VariantsColorsFactory.buildBackgroundColors(false, (opts) => ({
     *   light: opts.lightComputedColor,
     *   dark: opts.darkComputedColor
     * }));
     * // customBgClasses.success => { light: "bg-green-500", dark: "dark:bg-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColorsFactory.buildColors}
     */
    static buildBackgroundColors(withImportantAttribute, colorClassNameBuilder, withHover2ActiveState = false) {
        return VariantsColorsFactory.buildColors("bg", withImportantAttribute, colorClassNameBuilder, withHover2ActiveState);
    }
    /**
     * Generates a record of Tailwind CSS class names for all registered border color variants.
     *
     * This static method is a shortcut for generating border color classes using the `"border"` Tailwind prefix.
     * It supports both light and dark modes, as well as the important modifier and custom class name builders.
     *
     * @typeParam ClassNameBuilderResult - The result type returned by the class name builder (usually a string or object).
     *
     * @param withImportantAttribute - If `true`, prepends `!` to each class name to mark it as important.
     * @param colorClassNameBuilder - (Optional) A custom builder function to generate the class name(s) for each color variant.
     *   If not provided, the default builder returns a string combining the light and dark class names.
     * @param withHover2ActiveState - If `true`, appends `hover:active:bg-hover-active-color` to each class name to mark it as hover2active state.
     * @returns A record mapping each registered color name to the generated border class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate border color classes for all variants
     * const borderClasses = VariantsColorsFactory.buildBorderColors();
     * // borderClasses.primary => "border-primary dark:border-dark-primary"
     *
     * // Generate border color classes with important modifier
     * const importantBorderClasses = VariantsColorsFactory.buildBorderColors(true);
     * // importantBorderClasses.error => "!border-red-500 dark:!border-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customBorderClasses = VariantsColorsFactory.buildBorderColors(false, (opts) => ({
     *   light: opts.lightComputedColor,
     *   dark: opts.darkComputedColor
     * }));
     * // customBorderClasses.success => { light: "border-green-500", dark: "dark:border-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColorsFactory.buildColors}
     */
    static buildBorderColors(withImportantAttribute, colorClassNameBuilder, withHover2ActiveState = false) {
        return VariantsColorsFactory.buildColors("border", withImportantAttribute, colorClassNameBuilder, withHover2ActiveState);
    }
    /**
     * Generates a TypeScript interface definition string for the current color map.
     *
     * This static utility method creates a TypeScript interface (`IVariantsColorsMap`) based on the currently registered colors,
     * excluding the default semantic colors (primary, secondary, surface, background, text, neutral, error, info, warning, success).
     * This is useful for code generation or for extending the color system with custom colors.
     *
     * @returns A string containing the TypeScript interface definition for the current color map.
     *
     * @example
     * ```typescript
     * // Generate the interface definition for custom colors
     * const interfaceString = VariantsColorsFactory.generateColorsMapTypes();
     * console.log(interfaceString);
     * // Output:
     * // import { IVariantsColorsMapBase } from './types';
  import { col } from '../../../../../../frontend-dash/src/theme/grid';
     * // export interface IVariantsColorsMap extends IVariantsColorsMapBase {
     * //   customColor: IVariantColor;
     * //   ...
     * // }
     * ```
     *
     * @remarks
     * - Only non-semantic, custom colors are included in the generated interface.
     * - The output is a string and can be written to a file or used for documentation/codegen.
     *
     * @see {@link IVariantColor}
     */
    static generateColorsMapTypes() {
        const generateText = ["import { IVariantsColorsMapBase } from './types';", "export interface IVariantsColorsMap extends IVariantsColorsMapBase {"];
        Object.entries(VariantsColorsFactory.colors).forEach(([color, value]) => {
            if (VariantsColorsFactory.defaultColorsNames.includes(color))
                return;
            generateText.push(`\t${color}: IVariantColor;`);
        });
        generateText.push("}");
        return generateText.join("\n");
    }
}
exports.VariantsColorsFactory = VariantsColorsFactory;
VariantsColorsFactory.defaultColors = {
    primary: {
        lightColor: "primary",
        darkColor: "dark-primary",
        lightForeground: "primary-foreground",
        darkForeground: "dark-primary-foreground",
    },
    secondary: {
        lightColor: "secondary",
        darkColor: "dark-secondary",
        lightForeground: "secondary-foreground",
        darkForeground: "dark-secondary-foreground",
    },
    surface: {
        lightColor: "gray-100",
        lightForeground: "gray-900",
        darkColor: "gray-800",
        darkForeground: "gray-100",
    },
    background: {
        lightColor: "white",
        lightForeground: "gray-900",
        darkColor: "gray-900",
        darkForeground: "gray-100",
    },
    neutral: {
        lightColor: "gray-500",
        lightForeground: "white",
        darkColor: "gray-600",
        darkForeground: "gray-50",
    },
    error: {
        lightColor: "red-500",
        lightForeground: "white",
        darkColor: "red-600",
        darkForeground: "red-50",
    },
    info: {
        lightColor: "blue-500",
        lightForeground: "white",
        darkColor: "blue-600",
        darkForeground: "blue-50",
    },
    warning: {
        lightColor: "yellow-500",
        lightForeground: "yellow-900",
        darkColor: "yellow-600",
        darkForeground: "yellow-50",
    },
    success: {
        lightColor: "green-500",
        lightForeground: "white",
        darkColor: "green-600",
        darkForeground: "green-50",
    },
    text: {
        lightColor: "gray-900",
        lightForeground: "gray-100",
        darkColor: "gray-100",
        darkForeground: "gray-900",
    },
};
VariantsColorsFactory.defaultColorsNames = Object.keys(VariantsColorsFactory.defaultColors);
VariantsColorsFactory._colors = Object.assign({}, VariantsColorsFactory.defaultColors);
const defaultStr = (...args) => {
    for (const arg of args) {
        if (arg && typeof arg === "string")
            return arg;
    }
    return "";
};
