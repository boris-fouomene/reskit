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
exports.VariantsColors = void 0;
const isNonNullString = (x) => typeof x === "string" && x;
class VariantsColors {
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
            if (!value || typeof value !== "object" || !isNonNullString(value === null || value === void 0 ? void 0 : value.lightColor) || !isNonNullString(value === null || value === void 0 ? void 0 : value.lightForeground) || !isNonNullString(value === null || value === void 0 ? void 0 : value.darkColor) || !isNonNullString(value === null || value === void 0 ? void 0 : value.darkForeground))
                return;
            this._colors[color] = value;
        });
        return VariantsColors._colors;
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
     *   If not provided, the default builder returns a string combining the light and dark class names.
     * @param colorSuffix - (Optional) Suffix for the color class, such as `"-foreground"` to generate foreground color classes.
     *
     * @returns A record mapping each registered color name to the generated class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate background color classes for all variants
     * const bgClasses = VariantsColors.buildColors("bg");
     * // bgClasses.primary => "bg-primary dark:bg-dark-primary"
     *
     * // Generate text color classes with important modifier
     * const textClasses = VariantsColors.buildColors("text", true);
     * // textClasses.error => "!text-red-500 dark:!text-red-600"
     *
     * // Generate only foreground color classes for backgrounds
     * const fgClasses = VariantsColors.buildColors("bg", false, undefined, "-foreground");
     * // fgClasses.primary => "bg-primary-foreground dark:bg-dark-primary-foreground"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customClasses = VariantsColors.buildColors("border", false, (opts) => ({
     *   light: opts.lightColorWithPrefix,
     *   dark: opts.darkColorWithPrefix
     * }));
     * // customClasses.success => { light: "border-green-500", dark: "dark:border-green-600" }
     * ```
     *
     * @remarks
     * - The method iterates over all registered colors in the design system.
     * - If `colorSuffix` is set to `"-foreground"`, the foreground color values are used instead of the base color.
     * - The builder function receives a detailed options object for each color, allowing for advanced customization.
     * - This method is the foundation for `buildTextColors`, `buildBackgroundColors`, and `buildBorderColors`.
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link IVariantsColors.ClassNameBuilderOptions}
     * @see {@link VariantsColors.buildTextColors}
     * @see {@link VariantsColors.buildBackgroundColors}
     * @see {@link VariantsColors.buildBorderColors}
     */
    static buildColors(tailwindClassPrefix, withImportantAttribute, colorClassNameBuilder, colorSuffix) {
        const r = Object.create({});
        const importantPrefix = withImportantAttribute ? "!" : "";
        const suffix = colorSuffix && typeof colorSuffix == "string" ? colorSuffix : "";
        const colorBuilder = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightColorWithPrefix, darkColorWithPrefix }) => `${lightColorWithPrefix} ${darkColorWithPrefix}`;
        const isForeground = String(colorSuffix).toLowerCase().split("-")[1] === "foreground";
        Object.entries(VariantsColors.colors).map(([color, value]) => {
            const _a = Object.assign({}, value), { lightColor: light, lightForeground: _lightForeground, darkColor: dark, darkForeground: _darkForeground } = _a, rest = __rest(_a, ["lightColor", "lightForeground", "darkColor", "darkForeground"]);
            const lightColor = isForeground ? _lightForeground : light;
            const darkColor = isForeground ? _darkForeground : dark;
            const lightForeground = isForeground ? light : _lightForeground;
            const darkForeground = isForeground ? dark : _darkForeground;
            r[color] = colorBuilder(Object.assign(Object.assign({}, rest), { lightColor,
                darkColor, lightColorWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightColor}${suffix}`, darkColorWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}${suffix}`, darkForeground,
                lightForeground, lightForegroundWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}${suffix}`, darkForegroundWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}${suffix}` }));
        });
        return r;
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
     *   If not provided, the default builder returns a string combining the light and dark class names.
     *
     * @returns A record mapping each registered color name to the generated text class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate text color classes for all variants
     * const textClasses = VariantsColors.buildTextColors();
     * // textClasses.primary => "text-primary dark:text-dark-primary"
     *
     * // Generate text color classes with important modifier
     * const importantTextClasses = VariantsColors.buildTextColors(true);
     * // importantTextClasses.error => "!text-red-500 dark:!text-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customTextClasses = VariantsColors.buildTextColors(false, (opts) => ({
     *   light: opts.lightColorWithPrefix,
     *   dark: opts.darkColorWithPrefix
     * }));
     * // customTextClasses.success => { light: "text-green-500", dark: "dark:text-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColors.buildColors}
     */
    static buildTextColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("text", withImportantAttribute, colorClassNameBuilder);
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
     *
     * @returns A record mapping each registered color name to the generated background class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate background color classes for all variants
     * const bgClasses = VariantsColors.buildBackgroundColors();
     * // bgClasses.primary => "bg-primary dark:bg-dark-primary"
     *
     * // Generate background color classes with important modifier
     * const importantBgClasses = VariantsColors.buildBackgroundColors(true);
     * // importantBgClasses.error => "!bg-red-500 dark:!bg-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customBgClasses = VariantsColors.buildBackgroundColors(false, (opts) => ({
     *   light: opts.lightColorWithPrefix,
     *   dark: opts.darkColorWithPrefix
     * }));
     * // customBgClasses.success => { light: "bg-green-500", dark: "dark:bg-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColors.buildColors}
     */
    static buildBackgroundColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("bg", withImportantAttribute, colorClassNameBuilder);
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
     *
     * @returns A record mapping each registered color name to the generated border class name or object, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Generate border color classes for all variants
     * const borderClasses = VariantsColors.buildBorderColors();
     * // borderClasses.primary => "border-primary dark:border-dark-primary"
     *
     * // Generate border color classes with important modifier
     * const importantBorderClasses = VariantsColors.buildBorderColors(true);
     * // importantBorderClasses.error => "!border-red-500 dark:!border-red-600"
     *
     * // Use a custom builder to return an object with both light and dark classes
     * const customBorderClasses = VariantsColors.buildBorderColors(false, (opts) => ({
     *   light: opts.lightColorWithPrefix,
     *   dark: opts.darkColorWithPrefix
     * }));
     * // customBorderClasses.success => { light: "border-green-500", dark: "dark:border-green-600" }
     * ```
     *
     * @see {@link IVariantsColors.ClassNameBuilder}
     * @see {@link VariantsColors.buildColors}
     */
    static buildBorderColors(withImportantAttribute, colorClassNameBuilder) {
        return VariantsColors.buildColors("border", withImportantAttribute, colorClassNameBuilder);
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
     * const interfaceString = VariantsColors.generateColorsMapTypes();
     * console.log(interfaceString);
     * // Output:
     * // import { IVariantsColorsMapBase } from './types';
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
        const generateText = [
            "import { IVariantsColorsMapBase } from './types';",
            "export interface IVariantsColorsMap extends IVariantsColorsMapBase {",
        ];
        Object.entries(VariantsColors.colors).forEach(([color, value]) => {
            if (VariantsColors.defaultColorsNames.includes(color))
                return;
            generateText.push(`\t${color}: IVariantColor;`);
        });
        generateText.push("}");
        return generateText.join("\n");
    }
}
exports.VariantsColors = VariantsColors;
VariantsColors.defaultColors = {
    primary: {
        lightColor: "primary",
        darkColor: "dark-primary",
        lightForeground: "primary-foreground",
        darkForeground: "dark-primary-foreground"
    },
    secondary: {
        lightColor: "secondary",
        darkColor: "dark-secondary",
        lightForeground: "secondary-foreground",
        darkForeground: "dark-secondary-foreground"
    },
    surface: {
        lightColor: "gray-100",
        lightForeground: "gray-900",
        darkColor: "gray-800",
        darkForeground: "gray-100"
    },
    background: {
        lightColor: "white",
        lightForeground: "gray-900",
        darkColor: "gray-900",
        darkForeground: "gray-100"
    },
    neutral: {
        lightColor: "gray-500",
        lightForeground: "white",
        darkColor: "gray-600",
        darkForeground: "gray-50"
    },
    error: {
        lightColor: "red-500",
        lightForeground: "white",
        darkColor: "red-600",
        darkForeground: "red-50"
    },
    info: {
        lightColor: "blue-500",
        lightForeground: "white",
        darkColor: "blue-600",
        darkForeground: "blue-50"
    },
    warning: {
        lightColor: "yellow-500",
        lightForeground: "yellow-900",
        darkColor: "yellow-600",
        darkForeground: "yellow-50"
    },
    success: {
        lightColor: "green-500",
        lightForeground: "white",
        darkColor: "green-600",
        darkForeground: "green-50"
    },
    text: {
        lightColor: "gray-900",
        lightForeground: "gray-100",
        darkColor: "gray-100",
        darkForeground: "gray-900"
    }
};
VariantsColors.defaultColorsNames = Object.keys(VariantsColors.defaultColors);
VariantsColors._colors = Object.assign({}, VariantsColors.defaultColors);
