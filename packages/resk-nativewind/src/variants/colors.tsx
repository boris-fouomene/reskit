import { IClassName } from "@src/types";
import { IVariantsColorsMap } from "./types/colorsMap";

/**
 * Namespace containing utility types for color variant naming and class name generation.
 *
 * This namespace provides advanced type utilities for working with color names, foreground/background/dark variants,
 * and for building Tailwind-compatible class names for color variants in a type-safe manner.
 *
 * @example
 * ```typescript
 * // Example: Using ColorName and ForegroundColors types
 * type MyColor = IVariantsColors.ColorName; // "primary" | "secondary" | ...
 * type MyForeground = IVariantsColors.ForegroundColors; // "primary-foreground" | "dark-primary-foreground" | ...
 *
 * // Example: Using ColorClassNameBuilder to generate Tailwind class names
 * const builder: IVariantsColors.ColorClassNameBuilder<"bg"> = (color, darkColor, colorName) =>
 *   `${color} ${darkColor}`;
 * const className = builder("bg-primary", "dark:bg-dark-primary", "primary");
 * // className: "bg-primary dark:bg-dark-primary"
 * ```
 *
 * @remarks
 * These types are intended for use in design systems, component libraries, or utility libraries that need to
 * generate or validate color variant class names in a type-safe and extensible way.
 */
export namespace IVariantsColors {
    /**
     * Represents the set of valid color names defined in {@link IVariantsColorsMap}.
     *
     * @example
     * ```typescript
     * const color: IVariantsColors.ColorName = "primary";
     * ```
     */
    export type ColorName = keyof IVariantsColorsMap & string;

    export type ColorName2Foreground = ColorName | `${ColorName}-foreground`;
    /**
     * Represents all possible foreground color variant names, including dark mode.
     *
     * This type generates strings like `"primary-foreground"`, `"dark-primary-foreground"`, etc.
     *
     * @example
     * ```typescript
     * const fg: IVariantsColors.ForegroundColors = "secondary-foreground";
     * const darkFg: IVariantsColors.ForegroundColors = "dark-error-foreground";
     * ```
     */
    export type ForegroundColors = `${ColorName}-foreground` | `dark-${ColorName}-foreground`;

    /**
     * Represents all main color variant names, including dark mode.
     *
     * This type generates strings like `"primary"`, `"dark-primary"`, etc.
     *
     * @example
     * ```typescript
     * const main: IVariantsColors.MainColors = "success";
     * const darkMain: IVariantsColors.MainColors = "dark-warning";
     * ```
     */
    export type MainColors = ColorName | `dark-${ColorName}`;
    /**
     * Represents all possible color variant names, including main, foreground, outline, and dark mode variants.
     *
     * This type generates strings like `"primary"`, `"dark-primary"`, `"primary-foreground"`, `"dark-primary-foreground"`, `"outline"`, `"dark-outline"`, etc.
     *
     * @example
     * ```typescript
     * const all: IVariantsColors.AllColors = "error-foreground";
     * const outline: IVariantsColors.AllColors = "outline";
     * ```
     */
    export type AllColors = ColorName | `dark-${ColorName}` | `${ColorName}-foreground` | `dark-${ColorName}-foreground` | `outline` | `dark-outline`;
    /**
     * A function type for building Tailwind-compatible class names for color variants.
     *
     * This type allows you to define a function that receives the color class name with prefix (e.g., `"bg-primary"`),
     * the dark mode color class name with prefix (e.g., `"dark:bg-dark-primary"`), and the color name without prefix (e.g., `"primary"`),
     * and returns a result of your choosing (typically a string or a custom class name type).
     *
     * @typeParam TailwindClassPrefix - The prefix for the Tailwind class (e.g., `"bg"`, `"text"`, `"border"`).
     * @typeParam ColorClassNameBuilderResult - The result type returned by the builder (defaults to {@link IClassName}).
     * @typeParam ColorSuffix - An optional suffix to append to the class name (e.g., `"-foreground"`).
     *
     * @param colorWithPrefix - The Tailwind class name for the color variant, with optional `!` and suffix.
     * @param darkColorWithPrefix - The Tailwind class name for the dark mode color variant, with optional `!` and suffix.
     * @param colorWithoutPrefix - The color name without any prefix or suffix.
     * @returns The constructed class name or value, as defined by the builder.
     *
     * @example
     * ```typescript
     * // Example: Build a class name string for a background color variant
     * const builder: IVariantsColors.ColorClassNameBuilder<"bg"> = (color, darkColor, colorName) =>
     *   `${color} ${darkColor}`;
     * const className = builder("bg-success", "dark:bg-dark-success", "success");
     * // className: "bg-success dark:bg-dark-success"
     *
     * // Example: Build a custom object for each color variant
     * const customBuilder: IVariantsColors.ColorClassNameBuilder<"text", { light: string; dark: string }> =
     *   (color, darkColor, colorName) => ({ light: color, dark: darkColor });
     * const obj = customBuilder("text-info", "dark:text-dark-info", "info");
     * // obj: { light: "text-info", dark: "dark:text-dark-info" }
     * ```
     */
    export type ColorClassNameBuilder<TailwindClassPrefix extends string = any, ColorClassNameBuilderResult = IClassName, ColorSuffix extends string = ''> = (colorWithPrefix: `${"!" | ""}${TailwindClassPrefix}-${IVariantsColors.ColorName}${ColorSuffix}`, darkColorWithPrefix: `dark:${"!" | ""}${TailwindClassPrefix}-dark-${IVariantsColors.ColorName}${ColorSuffix}`, colorWithoutPrefix: IVariantsColors.ColorName) => ColorClassNameBuilderResult;
}

/**
 * Utility class for managing and generating color variant class names for design systems.
 *
 * The `VariantsColors` class provides static methods to register custom color names,
 * retrieve registered colors, and generate Tailwind-compatible class names for various color roles
 * (such as background, text, border, and foreground) in both light and dark modes.
 *
 * This class is designed to help you build scalable, type-safe color variant systems for
 * component libraries, design systems, or utility libraries that use Tailwind or similar frameworks.
 *
 * @example
 * ```typescript
 * // Register a custom color
 * VariantsColors.registerColor("brand");
 *
 * // Get all registered color names
 * const colors = VariantsColors.colors; // ["primary", "secondary", ..., "brand"]
 *
 * // Generate Tailwind class names for background colors
 * const bgClasses = VariantsColors.buildBackgroundColors();
 * // bgClasses.primary === "bg-primary dark:bg-dark-primary"
 *
 * // Generate text color classes with !important
 * const textClasses = VariantsColors.buildTextColors(true);
 * // textClasses.success === "!text-success dark:!text-dark-success"
 *
 * // Use a custom builder to return an object for each color
 * const custom = VariantsColors.buildBorderColors(false, (color, darkColor, name) => ({
 *   light: color,
 *   dark: darkColor,
 *   name,
 * }));
 * // custom.error === { light: "border-error", dark: "dark:border-dark-error", name: "error" }
 * ```
 *
 * @remarks
 * - All methods are static; you do not need to instantiate this class.
 * - The class is extensible: you can register new color names at runtime.
 * - Useful for building consistent, themeable, and type-safe color systems.
 */
export class VariantsColors {
    private static _colors: IVariantsColors.ColorName[] = ["primary", "secondary", "info", "success", "warning", "error", "surface"];
    /**
    * Registers one or more color names to the internal list of color variants.
    *
    * This method takes a list of color names and adds them to the internal `_colors` array,
    * ensuring each color name is a non-empty string and not already present in the array.
    * Duplicate or invalid entries are ignored.
    *
    * @param colors - The color names to register.
    *
    * @example
    * ```typescript
    * VariantsColors.registerColor("brand", "accent");
    * // Now "brand" and "accent" are available as color variants.
    * ```
    */
    static registerColor(...colors: IVariantsColors.ColorName[]) {
        colors.map((color) => {
            if (!color || typeof (color as any) !== "string" || !color.trim() || this._colors.includes((color as any).trim())) return;
            this._colors.push((color as any).trim());
        });
    }
    /**
     * Retrieves the list of registered color names.
     *
     * This method returns an array of color names that have been registered 
     * within the `VariantsColors` class. These color names can be used to 
     * generate or validate color variant class names in a type-safe manner.
     *
     * @returns An array of registered color names.
     *
     * @example
     * ```typescript
     * const allColors = VariantsColors.colors;
     * // ["primary", "secondary", "info", ...]
     * ```
     */
    static get colors(): IVariantsColors.ColorName[] {
        return this._colors;
    }
    /**
     * Returns an array of the two outline colors available in the theme.
     *
     * These colors can be used as class names to apply the corresponding outline color to a component.
     * The colors are in the format of `"outline"` and `"dark-outline"`.
     *
     * @returns An array of the two outline color variant names.
     *
     * @example
     * ```typescript
     * const outlines = VariantsColors.outlineColors;
     * // ["outline", "dark-outline"]
     * ```
     */
    static get outlineColors(): Partial<IVariantsColors.AllColors>[] {
        return ["outline", "dark-outline"]
    }
    /**
     * Retrieves all registered foreground color variant names, including dark mode.
     *
     * @returns An array of foreground color variant names (e.g., `"primary-foreground"`, `"dark-primary-foreground"`).
     *
     * @example
     * ```typescript
     * const fgColors = VariantsColors.foregroundColors;
     * // ["primary-foreground", "dark-primary-foreground", ...]
     * ```
     */
    public static get foregroundColors(): IVariantsColors.ForegroundColors[] {
        const r: IVariantsColors.ForegroundColors[] = [];
        VariantsColors.colors.map(color => {
            r.push(`${color}-foreground`, `dark-${color}-foreground`);
        });
        return r;
    }
    /**
     * Builds a record of Tailwind class names for color variants.
     *
     * This function generates a set of Tailwind class names for different color variants,
     * using a specified prefix and suffix. Optionally, the class names can be generated with
     * an "!important" attribute. A custom color class name builder function can be provided
     * to define how the class names should be constructed for both light and dark color modes.
     *
     * @typeParam TailwindClassPrefix - The prefix for the Tailwind class names (e.g., `"bg"`, `"text"`).
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder (defaults to `IClassName`).
     * @typeParam ColorSuffix - The suffix for the Tailwind class names (defaults to an empty string).
     *
     * @param tailwindClassPrefix - The prefix to use for the Tailwind class names.
     * @param withImportantAttribute - Whether to add an "!important" attribute to the class names.
     * @param colorClassNameBuilder - A custom builder function for constructing class names.
     * @param colorSuffix - An optional suffix to append to the class names.
     * @returns A record mapping each color name to its generated class name or value.
     *
     * @example
     * ```typescript
     * // Generate background color classes with !important
     * const bg = VariantsColors.buildVariantsColors("bg", true);
     * // bg.primary === "!bg-primary dark:!bg-dark-primary"
     *
     * // Use a custom builder to return an object for each color
     * const custom = VariantsColors.buildVariantsColors("border", false, (color, darkColor, name) => ({
     *   light: color,
     *   dark: darkColor,
     *   name,
     * }));
     * // custom.error === { light: "border-error", dark: "dark:border-dark-error", name: "error" }
     * ```
     */
    public static buildVariantsColors<TailwindClassPrefix extends string = any, ColorClassNameBuilderResult = IClassName, ColorSuffix extends string = ''>(tailwindClassPrefix: TailwindClassPrefix, withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<TailwindClassPrefix, ColorClassNameBuilderResult, ColorSuffix>, colorSuffix?: ColorSuffix): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        const r = Object.create({}) as Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>;
        const importantPrefix = withImportantAttribute ? "!" : "";
        const suffix = colorSuffix && typeof colorSuffix == "string" ? colorSuffix : "";
        const colorBuilder = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : (colorWithPrefix: any, darkColorWithPrefix: any) => `${colorWithPrefix} ${darkColorWithPrefix}`;
        VariantsColors.colors.map((color) => {
            (r as any)[color] = colorBuilder(`${importantPrefix}${tailwindClassPrefix}-${color}${suffix}` as any, `dark:${importantPrefix}${tailwindClassPrefix}-dark-${color}${suffix}` as any, color);
        });
        return r;

    }
    /**
     * Builds a record of text color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder (defaults to `IClassName`).
     * @param withImportantAttribute - Whether to add an "!important" attribute to the class names.
     * @param colorClassNameBuilder - A custom builder function for constructing class names.
     * @returns A record mapping each color name to its generated text color class name or value.
     *
     * @example
     * ```typescript
     * const text = VariantsColors.buildTextColors();
     * // text.success === "text-success dark:text-dark-success"
     * ```
     */
    static buildTextColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"text", ColorClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder);
    }

    /**
     * Builds a record of background color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder (defaults to `IClassName`).
     * @param withImportantAttribute - Whether to add an "!important" attribute to the class names.
     * @param colorClassNameBuilder - A custom builder function for constructing class names.
     * @returns A record mapping each color name to its generated background color class name or value.
     *
     * @example
     * ```typescript
     * const bg = VariantsColors.buildBackgroundColors();
     * // bg.primary === "bg-primary dark:bg-dark-primary"
     * ```
     */
    static buildBackgroundColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"bg", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"bg", ColorClassNameBuilderResult>("bg", withImportantAttribute, colorClassNameBuilder);
    }

    /**
     * Builds a record of foreground color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder (defaults to `IClassName`).
     * @param withImportantAttribute - Whether to add an "!important" attribute to the class names.
     * @param colorClassNameBuilder - A custom builder function for constructing class names.
     * @returns A record mapping each color name to its generated foreground color class name or value.
     *
     * @example
     * ```typescript
     * const fg = VariantsColors.buildForegroundColors();
     * // fg.primary === "text-primary-foreground dark:text-dark-primary-foreground"
     * ```
     */
    static buildForegroundColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult, "-foreground">): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"text", ColorClassNameBuilderResult, "-foreground">("text", withImportantAttribute, colorClassNameBuilder, "-foreground");
    }

    /**
     * Builds a record of border color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder (defaults to `IClassName`).
     * @param withImportantAttribute - Whether to add an "!important" attribute to the class names.
     * @param colorClassNameBuilder - A custom builder function for constructing class names.
     * @returns A record mapping each color name to its generated border color class name or value.
     *
     * @example
     * ```typescript
     * const border = VariantsColors.buildBorderColors();
     * // border.error === "border-error dark:border-dark-error"
     * ```
     */
    static buildBorderColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"border", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"border", ColorClassNameBuilderResult>("border", withImportantAttribute, colorClassNameBuilder);
    }
}
