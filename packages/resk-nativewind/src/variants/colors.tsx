import { IClassName } from "@src/types";

export interface IVariantsColorsMap {
    primary: string;
    secondary: string;
    surface: string;
    info: string;
    success: string;
    warning: string;
    error: string;
}


// Merge a namespace with the class
export namespace IVariantsColors {
    export type ColorName = keyof IVariantsColorsMap & string;
    export type ForegroundColors = `${ColorName}-foreground` | `dark-${ColorName}-foreground`;
    export type MainColors = ColorName | `dark-${ColorName}`;
    export type AllColors = ColorName | `dark-${ColorName}` | `${ColorName}-foreground` | `dark-${ColorName}-foreground` | `outline` | `dark-outline`;
    export type ColorClassNameBuilder<TailwindClassPrefix extends string = any, ColorClassNameBuilderResult = IClassName, ColorSuffix extends string = ''> = (colorWithPrefix: `${"!" | ""}${TailwindClassPrefix}-${IVariantsColors.ColorName}${ColorSuffix}`, darkColorWithPrefix: `dark:${"!" | ""}${TailwindClassPrefix}-dark-${IVariantsColors.ColorName}${ColorSuffix}`, colorWithoutPrefix: IVariantsColors.ColorName) => ColorClassNameBuilderResult;
}

export class VariantsColors {
    private static _colors: IVariantsColors.ColorName[] = ["primary", "secondary", "info", "success", "warning", "error", "surface"];
    static registerColor(color: IVariantsColors.ColorName) {
        if (!color || typeof (color as any) !== "string" || this._colors.includes(color)) return;
        this._colors.push(color);
    }
    static get colors(): IVariantsColors.ColorName[] {
        return this._colors;
    }
    /**
     * Returns an array of the two outline colors available in the theme.
     * These colors can be used as class names to apply the corresponding outline color to a component.
     * The colors are in the format of `[color name]-[variant name]`, where [color name] is the name of the color and [variant name] is the name of the variant.
     * For example, `outline` is the light outline color and `dark-outline` is the dark outline color.
     * @returns {IVariantsColors.AllColors[]} An array of the two outline colors available in the theme.
     */
    static get outlineColors(): Partial<IVariantsColors.AllColors>[] {
        return ["outline", "dark-outline"]
    }

    public static get foregroundColors(): IVariantsColors.ForegroundColors[] {
        const r: IVariantsColors.ForegroundColors[] = [];
        VariantsColors.colors.map(color => {
            r.push(`${color}-foreground`, `dark-${color}-foreground`);
        });
        return r;
    }
    /**
     * Builds a record of tailwind class names for color variants.
     *
     * This function generates a set of tailwind class names for different color variants,
     * using a specified prefix and suffix. Optionally, the class names can be generated with
     * an "!important" attribute. A custom color class name builder function can be provided
     * to define how the class names should be constructed for both light and dark color modes.
     *
     * @template TailwindClassPrefix - The prefix for the tailwind class names, defaulting to any string.
     * @template ColorClassNameBuilderResult - The result type of the color class name builder, defaulting to IClassName.
     * @template ColorSuffix - The suffix for the tailwind class names, defaulting to an empty string.
     *
     * @param {TailwindClassPrefix} tailwindClassPrefix - The prefix to use for the tailwind class names.
     * @param {boolean} [withImportantAttribute] - Whether to add an "!important" attribute to the class names.
     * @param {IVariantsColors.ColorClassNameBuilder<TailwindClassPrefix, ColorClassNameBuilderResult, ColorSuffix>} [colorClassNameBuilder] - A custom builder function for constructing class names.
     * @param {ColorSuffix} [colorSuffix] - An optional suffix to append to the class names.
     * @returns {Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>} A record of color variant class names.
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
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder, defaulting to IClassName.
     *
     * @param {boolean} [withImportantAttribute] - Whether to add an "!important" attribute to the class names.
     * @param {IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult>} [colorClassNameBuilder] - A custom builder function for constructing class names.
     * @returns {Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>} A record of text color variant class names.
     */
    static buildTextColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"text", ColorClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder);
    }

    /**
     * Builds a record of background color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder, defaulting to IClassName.
     *
     * @param {boolean} [withImportantAttribute] - Whether to add an "!important" attribute to the class names.
     * @param {IVariantsColors.ColorClassNameBuilder<"bg", ColorClassNameBuilderResult>} [colorClassNameBuilder] - A custom builder function for constructing class names.
     * @returns {Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>} A record of background color variant class names.
     */
    static buildBackgroundColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"bg", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"bg", ColorClassNameBuilderResult>("bg", withImportantAttribute, colorClassNameBuilder);
    }

    /**
     * Builds a record of foreground color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder, defaulting to IClassName.
     *
     * @param {boolean} [withImportantAttribute] - Whether to add an "!important" attribute to the class names.
     * @param {IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult, "-foreground">} [colorClassNameBuilder] - A custom builder function for constructing class names.
     * @returns {Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>} A record of foreground color variant class names.
     */
    static buildForegroundColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"text", ColorClassNameBuilderResult, "-foreground">): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"text", ColorClassNameBuilderResult, "-foreground">("text", withImportantAttribute, colorClassNameBuilder, "-foreground");
    }

    /**
     * Builds a record of border color variant class names.
     *
     * @typeParam ColorClassNameBuilderResult - The result type of the color class name builder, defaulting to IClassName.
     *
     * @param {boolean} [withImportantAttribute] - Whether to add an "!important" attribute to the class names.
     * @param {IVariantsColors.ColorClassNameBuilder<"border", ColorClassNameBuilderResult>} [colorClassNameBuilder] - A custom builder function for constructing class names.
     * @returns {Record<IVariantsColors.ColorName, ColorClassNameBuilderResult>} A record of border color variant class names.
     */
    static buildBorderColors<ColorClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ColorClassNameBuilder<"border", ColorClassNameBuilderResult>): Record<IVariantsColors.ColorName, ColorClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"border", ColorClassNameBuilderResult>("border", withImportantAttribute, colorClassNameBuilder);
    }
}
