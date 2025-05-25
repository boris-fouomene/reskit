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
    const outputPath = path.resolve(variantsDir ?? dir, "generated-variants-colors.js");
    const outputDeclarations = path.resolve(variantsDir ?? dir, "generated-variants-colors.d.ts")
    const content = JSON.stringify({
        button: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            return {
                base: `${colorNameWithPrefix} ${darkColorWithPrefix} focus-visible:outline-${color} dark:focus-visible:outline-dark-${color}`,
                label: `text-${color}-foreground dark:text-dark${color}-foreground`,
                icon: `!text-${color}-foreground dark:!text-dark${color}-foreground`,
                ripple: ""
            }
        }),
        buttonOutline: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            /***
             *  base: `p-[5px] border-2 border-${color} bg-transparent transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke] dark:hover:bg-dark-${color} hover:bg-${color} focus-visible:outline-${color}`,
                label: `text-${color} dark:text-dark${color} hover:text-${color}-foreground btn-hover:text-${color}-foreground dark:hover:text-dark-${color}-foreground dark:btn-hover:text-dark-${color}-foreground active:text-${color}-foreground dark:active:text-dark-${color}-foreground`,
                icon: `!text-${color} dark:!text-dark${color} hover:!text-${color}-foreground btn-hover:!text-${color}-foreground dark:hover:!text-dark-${color}-foreground dark:btn-hover:!text-dark-${color}-foreground active:!text-${color}-foreground dark:active:!text-dark-${color}-foreground`,
                ripple: ""
             */
            return {
                base: `p-[5px] border-2 border-${color} bg-transparent transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke]  focus-visible:outline-${color}`,
                label: `text-${color} dark:text-dark${color}`,
                icon: `!text-${color} dark:!text-dark${color}`,
                ripple: ""
            }
        }),
        icon: VariantsColors.buildTextColors(true),
        iconButton: VariantsColors.buildForegroundColors(true, (colorWithPrefix, darkColorWithPrefix, colorWithoutPrefix) => {
            return {
                container: `bg-${colorWithoutPrefix} dark:bg-dark${colorWithPrefix}`,
                icon: cn(colorWithPrefix, darkColorWithPrefix),
                text: `text-${colorWithoutPrefix}-foreground dark:text-dark-${colorWithoutPrefix}-foreground`
            }
        }),
        divider: VariantsColors.buildBackgroundColors(),
        heading: VariantsColors.buildTextColors(),
        surface: VariantsColors.buildBackgroundColors(false, (colorWithPrefix, darkColorWithPrefix, colorWithoutPrefix) => {
            return cn(colorWithPrefix, darkColorWithPrefix, `text-${colorWithoutPrefix}-foreground dark:text-dark-${colorWithoutPrefix}-foreground`)
        }),
        text: VariantsColors.buildTextColors(),
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
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "ripple",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "ripple",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        divider : Record<IName,string>;
        heading : Record<IName,string>;
        text : Record<IName,string>;
        activityIndicator: Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    `, 'utf8');

    console.log("Variants colors file generated at ", outputPath, "\n");
    console.log("Variants colors file types generated at ", outputDeclarations);
}