import { ClassValue } from "clsx";
import { IVariantsColorsMap } from "./colorsMap";
import { IVariantColor } from "./types";

type IClassName = ClassValue;
export namespace IVariantsColors {
    export type ColorName = keyof IVariantsColorsMap & string;

    export type ColorName2Foreground = ColorName | `${ColorName}-foreground`;

    export interface Color extends IVariantColor { }
    export type ColorClassSuffix = "-foreground" | "";

    export interface ClassNameBuilderOptions<TailwindClassPrefix extends string = any> extends IVariantsColors.Color {
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

const isNonNullString = (x: any) => typeof x === "string" && x;
export class VariantsColors {
    private static _colors: Record<string, IVariantsColors.Color> = {} as any;

    static registerColor(colors: IVariantsColorsMap) {
        Object.entries(Object.assign({}, colors)).map(([color, value]) => {
            if (!value || typeof value !== "object" || !isNonNullString(value?.lightColor) || !isNonNullString(value?.lightForeground) || !isNonNullString(value?.darkColor) || !isNonNullString(value?.darkForeground)) return;
            this._colors[color] = value;
        });
    }
    static get colors() {
        return this._colors;
    }

    public static buildColors<TailwindClassPrefix extends string = any, ClassNameBuilderResult = IClassName>(tailwindClassPrefix: TailwindClassPrefix, withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<TailwindClassPrefix, ClassNameBuilderResult>, colorSuffix?: IVariantsColors.ColorClassSuffix): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        const r = Object.create({}) as Record<IVariantsColors.ColorName, ClassNameBuilderResult>;
        const importantPrefix = withImportantAttribute ? "!" : "";
        const suffix = colorSuffix && typeof colorSuffix == "string" ? colorSuffix : "";
        const colorBuilder: IVariantsColors.ClassNameBuilder<TailwindClassPrefix> = typeof colorClassNameBuilder == "function" ? colorClassNameBuilder : ({ lightColorWithPrefix, darkColorWithPrefix }) => `${lightColorWithPrefix} ${darkColorWithPrefix}` as any;
        const isForeground = String(colorSuffix).toLowerCase().split("-")[1] === "foreground";
        Object.entries(VariantsColors.colors).map(([color, value]) => {
            const { lightColor: light, lightForeground: _lightForeground, darkColor: dark, darkForeground: _darkForeground, ...rest } = Object.assign({}, value);
            const lightColor = isForeground ? _lightForeground : light;
            const darkColor = isForeground ? _darkForeground : dark;
            const lightForeground = isForeground ? light : _lightForeground;
            const darkForeground = isForeground ? dark : _darkForeground;
            (r as any)[color] = colorBuilder({
                ...rest,
                lightColor,
                darkColor,
                lightColorWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightColor}${suffix}`,
                darkColorWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkColor}${suffix}`,
                darkForeground,
                lightForeground,
                lightForegroundWithPrefix: `${importantPrefix}${tailwindClassPrefix}-${lightForeground}${suffix}`,
                darkForegroundWithPrefix: `dark:${importantPrefix}${tailwindClassPrefix}-${darkForeground}${suffix}`,
            });
        });
        return r;
    }
    static buildTextColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"text", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildColors<"text", ClassNameBuilderResult>("text", withImportantAttribute, colorClassNameBuilder);
    }

    static buildBackgroundColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"bg", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildColors<"bg", ClassNameBuilderResult>("bg", withImportantAttribute, colorClassNameBuilder);
    }

    static buildBorderColors<ClassNameBuilderResult = IClassName>(withImportantAttribute?: boolean, colorClassNameBuilder?: IVariantsColors.ClassNameBuilder<"border", ClassNameBuilderResult>): Record<IVariantsColors.ColorName, ClassNameBuilderResult> {
        return VariantsColors.buildColors<"border", ClassNameBuilderResult>("border", withImportantAttribute, colorClassNameBuilder);
    }
    static generateColorsMapTypes() {
        const generateText = [
            "import { IVariantColor } from './types';",
            "import { IVariantsColorsMapBase } from './types';",
            "export interface IVariantsColorsMap extends IVariantsColorsMapBase {",
        ];
        Object.entries(VariantsColors.colors).forEach(([color, value]) => {
            if (["primary", "secondary", "surface", "background", "text"].includes(color)) return;
            generateText.push(`\t${color}: IVariantColor;`);
        });
        generateText.push("}");
        return generateText.join("\n");
    }
}

