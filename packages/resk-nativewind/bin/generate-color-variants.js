const fs = require("fs"),
    path = require("path");

const dir = path.resolve(process.cwd());
const cn = (...args) => {
    return args.filter((text) => text && typeof text == "string").join(" ");
}



module.exports = (colors, options) => {
    const variantJsFile = path.resolve(__dirname, "../build/variants/colors.js");
    if (!fs.existsSync(variantJsFile)) {
        return;
    }
    const { VariantsColors } = require(variantJsFile);
    const variantsRootDir = require("./find-package-dir")('build', 'variants');
    options = Object.assign({}, options);
    const isDev = options.isDev === true && variantsRootDir && fs.existsSync(path.resolve(variantsRootDir, "src", "variants"));
    const variantsDir = variantsRootDir ? path.resolve(variantsRootDir, isDev ? 'src' : 'build', 'variants') : dir;
    const cols = typeof colors == "string" && colors ? colors.split(",") : [];
    VariantsColors.registerColor(...cols);
    const finalDir = variantsDir ?? dir;
    const outputPath = path.resolve(finalDir, "generated-variants-colors.js");
    const outputDeclarations = path.resolve(finalDir, "generated-variants-colors.d.ts");
    const color2foreground = {
        ...VariantsColors.buildTextColors(),
        ...Object.fromEntries(Object.entries(VariantsColors.buildForegroundColors()).map(([key, value]) => [`${key}-foreground`, value])),
    }, color2foregroundWithImportant = {
        ...VariantsColors.buildTextColors(true),
        ...Object.fromEntries(Object.entries(VariantsColors.buildForegroundColors(true)).map(([key, value]) => [`${key}-foreground`, value])),
    }
    const content = JSON.stringify({
        button: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            return {
                base: `${colorNameWithPrefix} ${darkColorWithPrefix} focus-visible:outline-${color} dark:focus-visible:outline-dark-${color}`,
                label: `text-${color}-foreground dark:text-dark${color}-foreground`,
                icon: `!text-${color}-foreground dark:!text-dark${color}-foreground`,
                ripple: "",
                activityIndicator: cn(`border-t-${color}-foreground dark:border-t-dark-${color}-foreground`),
            }
        }),
        buttonOutline: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            const groupClassName = {
                base: `group hover:bg-${color} dark:hover:bg-dark-${color}`,
                label: `hover:text-${color}-foreground dark:hover:text-dark-${color}-foreground group-hover:text-${color}-foreground dark:group-hover:text-dark-${color}-foreground`,
                icon: `hover:!text-${color}-foreground dark:hover:!text-dark-${color}-foreground group-hover:!text-${color}-foreground dark:group-hover:!text-dark-${color}-foreground`,
                activityIndicator: `hover:border-t-${color}-foreground dark:hover:border-t-dark-${color}-foreground group-hover:border-t-${color}-foreground dark:group-hover:border-t-dark-${color}-foreground`,
            }
            return {
                base: `${groupClassName.base} p-[5px] border-2 border-${color} bg-transparent transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke]  focus-visible:outline-${color}`,
                label: `${groupClassName.label} text-${color} dark:text-dark${color}`,
                icon: `${groupClassName.icon} !text-${color} dark:!text-dark${color}`,
                ripple: "",
                activityIndicator: cn(groupClassName.activityIndicator, `border-t-${color} dark:border-t-dark-${color}`),
            }
        }),
        icon: VariantsColors.buildTextColors(true),
        iconForeground: VariantsColors.buildForegroundColors(true),
        iconButton: VariantsColors.buildForegroundColors(true, (colorWithPrefix, darkColorWithPrefix, color) => {
            return {
                container: `bg-${color} dark:bg-dark${color}`,
                icon: cn(colorWithPrefix, darkColorWithPrefix),
                text: `text-${color}-foreground dark:text-dark-${color}-foreground`
            }
        }),
        surface: VariantsColors.buildBackgroundColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(colorWithPrefix, darkColorWithPrefix, `text-${color}-foreground dark:text-dark-${color}-foreground`)
        }),
        shadow: VariantsColors.buildBackgroundColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`shadow-${color}/20 dark:shadow-${color}/30`)
        }),
        color: VariantsColors.buildTextColors(),
        colorWithImportant: VariantsColors.buildTextColors(true),
        foregroundWithImportant: VariantsColors.buildForegroundColors(true),
        color2foreground,
        color2foregroundWithImportant,
        background: VariantsColors.buildBackgroundColors(),
        foreground: VariantsColors.buildForegroundColors(),
        borderColor: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-${color} dark:border-dark-${color}`);
        }),
        borderTopColor: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-t-${color} dark:border-t-dark-${color}`);
        }),
        borderBottomColor: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-b-${color} dark:border-b-dark-${color}`);
        }),
        borderLeftColor: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-l-${color} dark:border-l-dark-${color}`);
        }),
        borderRightColor: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-r-${color} dark:border-r-dark-${color}`);
        }),
        activityIndicator: VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-t-${color} dark:border-t-dark-${color}`);
        }),
    }, null, 2);
    fs.writeFileSync(outputPath, `
export const VariantsGeneratedColors = ${content}
    `, 'utf8');

    fs.writeFileSync(outputDeclarations, `
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    type IName2Foreground = IVariantsColors.ColorName2Foreground;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconForeground : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        color : Record<IName,string>;
        colorWithImportant : Record<IName,string>;
        color2foregroundWithImportant : Record<IName2Foreground,string>;
        foregroundWithImportant: Record<IName,string>;
        color2foreground : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        foreground : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName,string>;
        borderColor : Record<IName,string>;
        borderTopColor : Record<IName,string>;
        borderBottomColor : Record<IName,string>;
        borderLeftColor : Record<IName,string>;
        borderRightColor : Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    `, 'utf8');
    if (!isDev) {
        generateColorMapTypes(finalDir, cols);
    }
    console.log("Variants colors file generated at ", outputPath, "\n");
    console.log("Variants colors file types generated at ", outputDeclarations);
}

function generateColorMapTypes(variantRootDir, colors) {
    if (typeof variantRootDir == "string" && fs.existsSync(variantRootDir)) {
        colors = Array.isArray(colors) && colors.length > 0 ? colors : [];
        const colorMapTypesPath = path.resolve(variantRootDir, "types/colorsMap.d.ts");
        console.log(colorMapTypesPath, " is color map types path");
        try {
            fs.writeFileSync(colorMapTypesPath, `
/**
 * Represents the color roles available for variant-based styling.
 *
 * This interface defines the standard color names used throughout the design system for consistent theming.
 * Each property corresponds to a semantic color role, and its value is a string representing a color class or value.
 *
 * @property primary - The primary color, typically used for main actions or highlights.
 * @property secondary - The secondary color, used for secondary actions or accents.
 * @property surface - The surface color, used for backgrounds or surfaces.
 * @property info - The informational color, used for info messages or highlights.
 * @property success - The success color, used for positive or successful actions.
 * @property warning - The warning color, used for caution or warning messages.
 * @property error - The error color, used for errors or destructive actions.
 * @property background - The background color, used for backgrounds or surfaces.
 *
 * @example
 * // Example usage in a component or theme definition
 * const myColors: IVariantsColorsMap = {
 *   primary: "bg-blue-600",
 *   secondary: "bg-gray-500",
 *   surface: "bg-white",
 *   info: "bg-cyan-500",
 *   success: "bg-green-500",
 *   warning: "bg-yellow-500",
 *   error: "bg-red-600",
 *   background: "bg-gray-500",
 * };
 *
 * @remarks
 * This interface is intended to be used as a base for color variant mapping in design systems,
 * utility libraries, or component libraries that support theming and variant-based styling.
 */
export interface IVariantsColorsMap {
    /**
     * The primary color, typically used for main actions or highlights.
     */
    primary: string;
    /**
     * The secondary color, used for secondary actions or accents.
     */
    secondary: string;
    /**
     * The surface color, used for backgrounds or surfaces.
     */
    surface: string;
    /**
     * The informational color, used for info messages or highlights.
     */
    info: string;
    /**
     * The success color, used for positive or successful actions.
     */
    success: string;
    /**
     * The warning color, used for caution or warning messages.
     */
    warning: string;
    /**
     * The error color, used for errors or destructive actions.
     */
    error: string;
    /***
     * The background color, used for backgrounds or surfaces.
     */
    background: string;
    
${colors.map((color) => `\t${color}: string;`).join("\n\n")}
}        
`, 'utf8');
        }
        catch (error) {
            console.log("Error generating color map types file at ", colorMapTypesPath, error);
        }
    }
}