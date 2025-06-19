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
                ripple: "",
                activityIndicator: cn(`border-t-${color}-foreground dark:border-t-dark-${color}-foreground`),
            }
        }),
        buttonOutline: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            /***
             *  base: `p-[5px] border-2 border-${color} bg-transparent transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke] dark:hover:bg-dark-${color} hover:bg-${color} focus-visible:outline-${color}`,
                label: `text-${color} dark:text-dark${color} hover:text-${color}-foreground btn-hover:text-${color}-foreground dark:hover:text-dark-${color}-foreground dark:btn-hover:text-dark-${color}-foreground active:text-${color}-foreground dark:active:text-dark-${color}-foreground`,
                icon: `!text-${color} dark:!text-dark${color} hover:!text-${color}-foreground btn-hover:!text-${color}-foreground dark:hover:!text-dark-${color}-foreground dark:btn-hover:!text-dark-${color}-foreground active:!text-${color}-foreground dark:active:!text-dark-${color}-foreground`,
                ripple: ""
             */
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
        color:VariantsColors.buildTextColors(),
        background:VariantsColors.buildBackgroundColors(),
        borderColor : VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-${color} dark:border-dark-${color}`);
        }),
        borderTopColor : VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-t-${color} dark:border-t-dark-${color}`);
        }),
        borderBottomColor : VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-b-${color} dark:border-b-dark-${color}`);
        }),
        borderLeftColor : VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
            return cn(`border-l-${color} dark:border-l-dark-${color}`);
        }),
        borderRightColor : VariantsColors.buildTextColors(false, (colorWithPrefix, darkColorWithPrefix, color) => {
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
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "ripple" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        color : Record<IName,string>;
        background : Record<IName,string>;
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

    console.log("Variants colors file generated at ", outputPath, "\n");
    console.log("Variants colors file types generated at ", outputDeclarations);
}