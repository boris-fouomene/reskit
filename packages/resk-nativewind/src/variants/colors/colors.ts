import { ClassValue } from "clsx";
import { IVariantsColorsMap } from "./colorsMap";
import { IVariantColor } from "./types";

const isNonNullString = (x: any) => typeof x === "string" && x;
export class VariantsColorsFactory {
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
  static registerColor(colors: IVariantsColorsMap) {
    Object.entries(Object.assign({}, colors)).map(([color, value]) => {
      if (!value || typeof value !== "object" || !isNonNullString(value?.lightColor) || !isNonNullString(value?.darkColor)) return;
      (this._colors as any)[color] = Object.assign({}, (this.defaultColors as any)[color], value);
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
  public static buildColors<TailwindClassPrefix extends string = any, ClassNameBuilderResult = IClassName>(tailwindClassPrefix: TailwindClassPrefix, withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<TailwindClassPrefix, ClassNameBuilderResult>, isForeground: boolean = false): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
    const r = Object.create({}) as Record<IVariantsColors.ColorName, ClassNameBuilderResult>;
    const importantPrefix = withImportantAttribute ? "!" : "";
    tailwindClassPrefix = defaultStr(tailwindClassPrefix) as any;
    const colorBuilder: IVariantsColors.ClassNameBuilder<TailwindClassPrefix> = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightComputedColor, darkComputedColor }) => `${lightComputedColor} ${darkComputedColor}` as any;
    Object.entries(VariantsColorsFactory.colors).map(([color, value]) => {
      const { lightColor: light, lightForeground: _lightForeground, darkColor: dark, darkForeground: _darkForeground, ...rest } = Object.assign({}, value);
      const lightColor = defaultStr(isForeground ? _lightForeground : light);
      const darkColor = defaultStr(isForeground ? _darkForeground : dark);
      const lightForeground = defaultStr(isForeground ? light : _lightForeground);
      const darkForeground = defaultStr(isForeground ? dark : _darkForeground);
      (r as any)[color] = colorBuilder({
        ...rest,
        isForeground: !!isForeground,
        lightColor,
        darkColor,
        lightComputedColor: `${importantPrefix}${tailwindClassPrefix}-${lightColor}`,
        darkComputedColor: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}`,
        darkForeground,
        lightForeground,
        lightComputedForeground: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}`,
        darkComputedForeground: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}`,
        colorName: color as any,
      });
    });
    return r;
  }

  static buildTextForegroundColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"text", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
    return VariantsColorsFactory.buildColors<"text", ClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder, true);
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
  static buildTextColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"text", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
    return VariantsColorsFactory.buildColors<"text", ClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder);
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
  static buildBackgroundColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"bg", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
    return VariantsColorsFactory.buildColors<"bg", ClassNameBuilderResult>("bg", withImportantAttribute, colorClassNameBuilder);
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
  static buildBorderColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"border", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
    return VariantsColorsFactory.buildColors<"border", ClassNameBuilderResult>("border", withImportantAttribute, colorClassNameBuilder);
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
    const generateText = ["import {IVariantsColorsMapBase,IVariantColor} from './types';", "export interface IVariantsColorsMap extends IVariantsColorsMapBase {"];
    Object.entries(VariantsColorsFactory.colors).forEach(([color, value]) => {
      if (VariantsColorsFactory.defaultColorsNames.includes(color as any)) return;
      generateText.push(`\t"${color}": IVariantColor;`);
    });
    generateText.push("}");
    return generateText.join("\n");
  }
  private static defaultColors: Record<IVariantsColors.ColorName, IVariantsColors.Color> = {
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
    outline: {
      lightColor: "gray-300",
      lightForeground: "gray-900",
      darkColor: "gray-700",
      darkForeground: "gray-100",
    },
    backdrop: {
      lightColor: "gray-900/50",
      darkColor: "gray-900/80",
      lightForeground: "white",
      darkForeground: "white",
    }
  };
  private static defaultColorsNames: IVariantsColors.ColorName[] = Object.keys(VariantsColorsFactory.defaultColors) as any;
  private static _colors: Record<IVariantsColors.ColorName, IVariantsColors.Color> = Object.assign({}, VariantsColorsFactory.defaultColors);
}
const defaultStr = (...args: any[]) => {
  for (const arg of args) {
    if (arg && typeof arg === "string") return arg;
  }
  return "";
};
type IClassName = ClassValue;
export namespace IVariantsColors {
  /**
   * Represents the name of a color defined in the {@link IVariantsColorsMap}.
   *
   * This type is used to reference a color by its key as a string.
   *
   * @example
   * ```typescript
   * const colorName: IVariantsColors.ColorName = "primary";
   * ```
   *
   * @see {@link IVariantsColorsMap}
   */
  export type ColorName = keyof IVariantsColorsMap & string;

  /***
   * Represents the foreground color variant of a color.
   *
   * This type is used to reference a color with a foreground variant (e.g., "primary-foreground").
   *
   * @example
   * ```typescript
   * const foreground: IVariantsColors.ForegroundColorName = "primary-foreground";
   * ```
   */
  export type ForegroundColorName = `${ColorName}-foreground`;
  /**
   * Represents either a color name or its corresponding foreground variant.
   *
   * This type is useful for referencing both the base color and its foreground (e.g., for text on colored backgrounds).
   *
   * @example
   * ```typescript
   * const color: IVariantsColors.ColorName2Foreground = "primary";
   * const foreground: IVariantsColors.ColorName2Foreground = "primary-foreground";
   * ```
   */
  export type ColorName2Foreground = ColorName | ForegroundColorName;

  /**
   * Represents a color object with variant properties.
   *
   * This interface extends {@link IVariantColor} and is used to describe a color and its variants (light, dark, foreground, etc.).
   *
   * @see {@link IVariantColor}
   */
  export interface Color extends IVariantColor { }

  /**
   * Options for building Tailwind CSS class names for color variants.
   *
   * This interface provides all the necessary color and class name information for generating
   * Tailwind-compatible class names, including support for dark mode and important modifiers.
   *
   * @typeParam TailwindClassPrefix - The prefix for the Tailwind class (e.g., "bg", "text", "border").
   *
   * @property lightColor - The color name or foreground for light mode.
   * @property darkColor - The color name or foreground for dark mode.
   * @property lightForeground - The foreground color for light mode.
   * @property darkForeground - The foreground color for dark mode.
   * @property lightComputedColor - The full Tailwind class for the light color, with optional important modifier.
   * @property lightComputedForeground - The full Tailwind class for the light foreground color, with optional important modifier.
   * @property darkComputedColor - The full Tailwind class for the dark color, with dark mode and optional important modifier.
   * @property darkComputedForeground - The full Tailwind class for the dark foreground color, with dark mode and optional important modifier.
   *
   * @example
   * ```typescript
   * const options: IVariantsColors.ClassNameBuilderOptions<"bg"> = {
   *   lightColor: "primary",
   *   darkColor: "dark-primary",
   *   lightForeground: "primary-foreground",
   *   darkForeground: "dark-primary-foreground",
   *   lightComputedColor: "!bg-primary",
   *   lightComputedForeground: "!bg-primary-foreground",
   *   darkComputedColor: "dark:!bg-dark-primary",
   *   darkComputedForeground: "dark:!bg-dark-primary-foreground"
   * };
   * ```
   */
  export interface ClassNameBuilderOptions<TailwindClassPrefix extends string = any> extends IVariantsColors.Color {
    lightColor: IVariantsColors.ColorName2Foreground | string;
    darkColor: IVariantsColors.ColorName2Foreground | string;
    lightForeground: IVariantsColors.ColorName2Foreground | string;
    darkForeground: IVariantsColors.ColorName2Foreground | string;
    lightComputedColor: `${"!" | ""}${TailwindClassPrefix}-${string}`;
    lightComputedForeground: `${"!" | ""}${TailwindClassPrefix}-${string}`;
    darkComputedColor: `dark:${"!" | ""}${TailwindClassPrefix}-${string}`;
    darkComputedForeground: `dark:${"!" | ""}${TailwindClassPrefix}-${string}`;

    /***
     * Whether the class name that is being generated is a foreground class name or not
     */
    isForeground: boolean;

    /**
     * The color name of the current color variant.
     */
    colorName: IVariantsColors.ColorName;
  }
  /**
   * Function type for building a class name string or object from color options.
   *
   * This type defines a function that takes {@link ClassNameBuilderOptions} and returns a class name or object,
   * allowing for custom logic in generating Tailwind-compatible class names for color variants.
   *
   * @typeParam TailwindClassPrefix - The prefix for the Tailwind class (e.g., "bg", "text", "border").
   * @typeParam ClassNameBuilderResult - The result type, typically a string or class name object.
   *
   * @param options - The options containing color and class name details for building the class name.
   * @returns The generated class name or object.
   *
   * @example
   * ```typescript
   * const builder: IVariantsColors.ClassNameBuilder<"text"> = (options) =>
   *   `${options.lightComputedColor} ${options.darkComputedColor}`;
   *
   * // Usage:
   * const className = builder({
   *   lightColor: "primary",
   *   darkColor: "dark-primary",
   *   lightForeground: "primary-foreground",
   *   darkForeground: "dark-primary-foreground",
   *   lightComputedColor: "text-primary",
   *   lightComputedForeground: "text-primary-foreground",
   *   darkComputedColor: "dark:text-dark-primary",
   *   darkComputedForeground: "dark:text-dark-primary-foreground"
   * });
   * // Result: "text-primary dark:text-dark-primary"
   * ```
   */
  export type ClassNameBuilder<TailwindClassPrefix extends string = any, ClassNameBuilderResult = IClassName> = (options: IVariantsColors.ClassNameBuilderOptions<TailwindClassPrefix>) => ClassNameBuilderResult;
}
