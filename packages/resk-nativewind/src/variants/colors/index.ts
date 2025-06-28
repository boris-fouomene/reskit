import { IClassName } from "@src/types";
import { ITailwindColorsMap, IVariantsColorsMap } from "../types";

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
 * // Example: Using ClassNameBuilder to generate Tailwind class names
 * const builder: IVariantsColors.ClassNameBuilder<"bg"> = (color, darkColor, colorName) =>
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

    export type ColorClassSuffix = "-foreground" | "";
    export interface ClassNameBuilderOptions<TailwindClassPrefix extends string = any> {
        lightColor: IVariantsColors.ColorName2Foreground | string;
        darkColor: IVariantsColors.ColorName2Foreground | string;
        lightForeground: IVariantsColors.ColorName2Foreground | string;

        darkForeground: IVariantsColors.ColorName2Foreground | string;
        lightColorWithPrefix: `${"!" | ""}${TailwindClassPrefix}-${string}`,
        lightForegroundWithPrefix: `${"!" | ""}${TailwindClassPrefix}-${string}`,
        darkColorWithPrefix: `dark:${"!" | ""}${TailwindClassPrefix}-${string}`,
        darkForegroundWithPrefix: `dark:${"!" | ""}${TailwindClassPrefix}-${string}`,
    }
    export type ClassNameBuilder<TailwindClassPrefix extends string = any, ClassNameBuilderResult = IClassName> = (options: IVariantsColors.ClassNameBuilderOptions<TailwindClassPrefix>) => ClassNameBuilderResult;
}

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
    static get tailwindColors() {
        return tailwindColors;
    }

    public static buildVariantsColors<TailwindClassPrefix extends string = any, ClassNameBuilderResult = IClassName>(tailwindClassPrefix: TailwindClassPrefix, withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<TailwindClassPrefix, ClassNameBuilderResult>, colorSuffix?: IVariantsColors.ColorClassSuffix): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        const r = Object.create({}) as Record<IVariantsColors.ColorName, ClassNameBuilderResult>;
        const importantPrefix = withImportantAttribute ? "!" : "";
        const suffix = colorSuffix && typeof colorSuffix == "string" ? colorSuffix : "";
        const colorBuilder: IVariantsColors.ClassNameBuilder<TailwindClassPrefix> = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightColorWithPrefix, darkColorWithPrefix }) => `${lightColorWithPrefix} ${darkColorWithPrefix}` as any;
        const isForeground = String(colorSuffix).toLowerCase().split("-")[1] === "foreground";
        for (const color in tailwindColors) {
            const { light, lightForeground: _lightForeground, dark, darkForeground: _darkForeground } = (tailwindColors)[color as keyof ITailwindColorsMap];
            const lightColor = isForeground ? _lightForeground : light;
            const darkColor = isForeground ? _darkForeground : dark;
            const lightForeground = isForeground ? light : _lightForeground;
            const darkForeground = isForeground ? dark : _darkForeground;
            (r as any)[color] = colorBuilder({
                lightColor,
                darkColor,
                lightColorWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightColor}${suffix}`,
                darkColorWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}${suffix}`,
                darkForeground,
                lightForeground,
                lightForegroundWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}${suffix}`,
                darkForegroundWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}${suffix}`,
            });
        }

        VariantsColors.colors.map((color: IVariantsColors.ColorName) => {
            const lightColor = color, darkColor = `dark-${color}`, lightForeground = `${color}-foreground`, darkForeground = `dark-${color}-foreground`;
            (r as any)[color] = colorBuilder({
                lightColor,
                darkColor,
                lightColorWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightColor}${suffix}`,
                darkColorWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-dark-${color}${suffix}`,
                darkForeground,
                lightForeground,
                lightForegroundWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}${suffix}`,
                darkForegroundWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}${suffix}`,
            });
        });
        return r;
    }
    static buildTextColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"text", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"text", ClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder);
    }

    static buildBackgroundColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"bg", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"bg", ClassNameBuilderResult>("bg", withImportantAttribute, colorClassNameBuilder);
    }

    static buildBorderColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"border", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildVariantsColors<"border", ClassNameBuilderResult>("border", withImportantAttribute, colorClassNameBuilder);
    }
}


const tailwindColors: ITailwindColorsMap = {
    /**
  * Cool gray color palette with blue undertones
  * @description A sophisticated gray that works well for modern interfaces
  */
    slate: {
        light: 'slate-500',
        lightForeground: 'white',
        dark: 'slate-400',
        darkForeground: 'slate-900'
    },
    /**
     * True gray color palette without color undertones
     * @description A neutral gray that's perfectly balanced
     */
    gray: {
        light: 'gray-500',
        lightForeground: 'white',
        dark: 'gray-400',
        darkForeground: 'gray-900'
    },
    /**
     * Cool gray color palette with subtle blue undertones
     * @description A modern gray with slightly cooler tones than neutral
     */
    zinc: {
        light: 'zinc-500',
        lightForeground: 'white',
        dark: 'zinc-400',
        darkForeground: 'zinc-900'
    },
    /**
     * True gray color palette without color undertones
     * @description A pure gray that's completely neutral
     */
    neutral: {
        light: 'neutral-500',
        lightForeground: 'white',
        dark: 'neutral-400',
        darkForeground: 'neutral-900'
    },
    /**
     * Warm gray color palette with brown undertones
     * @description A natural gray that feels warmer and more organic
     */
    stone: {
        light: 'stone-500',
        lightForeground: 'white',
        dark: 'stone-400',
        darkForeground: 'stone-900'
    },
    /**
     * Red color palette
     * @description Classic red for errors, warnings, and emphasis
     */
    red: {
        light: 'red-500',
        lightForeground: 'white',
        dark: 'red-400',
        darkForeground: 'red-900'
    },
    /**
     * Orange color palette
     * @description Vibrant orange for warnings and energetic elements
     */
    orange: {
        light: 'orange-500',
        lightForeground: 'white',
        dark: 'orange-400',
        darkForeground: 'orange-900'
    },
    /**
     * Amber color palette
     * @description Warm golden orange for highlights and warnings
     */
    amber: {
        light: 'amber-500',
        lightForeground: 'amber-900',
        dark: 'amber-400',
        darkForeground: 'amber-900'
    },
    /**
     * Yellow color palette
     * @description Bright yellow for attention and highlights
     */
    yellow: {
        light: 'yellow-500',
        lightForeground: 'yellow-900',
        dark: 'yellow-400',
        darkForeground: 'yellow-900'
    },
    /**
     * Lime color palette
     * @description Bright yellow-green for vibrant accents
     */
    lime: {
        light: 'lime-500',
        lightForeground: 'lime-900',
        dark: 'lime-400',
        darkForeground: 'lime-900'
    },
    /**
     * Green color palette
     * @description Classic green for success states and nature themes
     */
    green: {
        light: 'green-500',
        lightForeground: 'white',
        dark: 'green-400',
        darkForeground: 'green-900'
    },
    /**
     * Emerald color palette
     * @description Rich blue-green for sophisticated success states
     */
    emerald: {
        light: 'emerald-500',
        lightForeground: 'white',
        dark: 'emerald-400',
        darkForeground: 'emerald-900'
    },
    /**
     * Teal color palette
     * @description Blue-green for calming and professional interfaces
     */
    teal: {
        light: 'teal-500',
        lightForeground: 'white',
        dark: 'teal-400',
        darkForeground: 'teal-900'
    },
    /**
     * Cyan color palette
     * @description Bright blue-green for modern and tech-focused designs
     */
    cyan: {
        light: 'cyan-500',
        lightForeground: 'cyan-900',
        dark: 'cyan-400',
        darkForeground: 'cyan-900'
    },
    /**
     * Sky color palette
     * @description Light blue reminiscent of clear skies
     */
    sky: {
        light: 'sky-500',
        lightForeground: 'white',
        dark: 'sky-400',
        darkForeground: 'sky-900'
    },
    /**
     * Blue color palette
     * @description Classic blue for primary actions and links
     */
    blue: {
        light: 'blue-500',
        lightForeground: 'white',
        dark: 'blue-400',
        darkForeground: 'blue-900'
    },
    /**
     * Indigo color palette
     * @description Deep blue-purple for sophisticated interfaces
     */
    indigo: {
        light: 'indigo-500',
        lightForeground: 'white',
        dark: 'indigo-400',
        darkForeground: 'indigo-900'
    },
    /**
     * Violet color palette
     * @description Rich purple for creative and artistic designs
     */
    violet: {
        light: 'violet-500',
        lightForeground: 'white',
        dark: 'violet-400',
        darkForeground: 'violet-900'
    },
    /**
     * Purple color palette
     * @description Classic purple for luxury and creativity
     */
    purple: {
        light: 'purple-500',
        lightForeground: 'white',
        dark: 'purple-400',
        darkForeground: 'purple-900'
    },
    /**
     * Fuchsia color palette
     * @description Vibrant pink-purple for bold and energetic designs
     */
    fuchsia: {
        light: 'fuchsia-500',
        lightForeground: 'white',
        dark: 'fuchsia-400',
        darkForeground: 'fuchsia-900'
    },
    /**
     * Pink color palette
     * @description Soft to vibrant pink for feminine and playful designs
     */
    pink: {
        light: 'pink-500',
        lightForeground: 'white',
        dark: 'pink-400',
        darkForeground: 'pink-900'
    },
    /**
     * Rose color palette
     * @description Warm pink with red undertones for romantic themes
     */
    rose: {
        light: 'rose-500',
        lightForeground: 'white',
        dark: 'rose-400',
        darkForeground: 'rose-900'
    },
    /**
     * Pure black color
     * @description Absolute black, inverts to white in dark mode
     */
    black: {
        light: 'black',
        lightForeground: 'white',
        dark: 'white',
        darkForeground: 'black'
    },
    /**
     * Pure white color
     * @description Absolute white, inverts to black in dark mode
     */
    white: {
        light: 'white',
        lightForeground: 'black',
        dark: 'black',
        darkForeground: 'white'
    },
    // /**
    //  * Transparent color
    //  * @description Completely transparent, useful for overlays and hiding elements
    //  */
    // transparent: {
    //     light: 'transparent',
    //     lightForeground: 'transparent',
    //     dark: 'transparent',
    //     darkForeground: 'transparent'
    // },
    /**
     * Current color
     * @description Uses the current text color as the light/border color
     */
    current: {
        light: 'current',
        lightForeground: 'current',
        dark: 'current',
        darkForeground: 'current'
    },
    /**
     * Inherit color
     * @description Inherits color from parent element
     */
    inherit: {
        light: 'inherit',
        lightForeground: 'inherit',
        dark: 'inherit',
        darkForeground: 'inherit'
    }
};