const fs = require("fs"),
    path = require("path");

const dir = path.resolve(process.cwd());
const { VariantsColors } = require("../build/variants/colors");
const cn = (...args) => {
    return args.filter((text) => text && typeof text == "string").join(" ");
}

function findRootDir() {
    let root = path.resolve(process.cwd());
    for (let i = 0; i < 4; i++) {
        const variantsDir = path.resolve(root, "node_modules", '@resk/nativewind');
        if (fs.existsSync(path.resolve(variantsDir, 'build', 'variants'))) {
            return variantsDir;
        }
        root = path.resolve(root, "..");
    }
    return null;
}

module.exports = (colors, options) => {
    const variantsRootDir = findRootDir();
    const isDev = variantsRootDir && fs.existsSync(path.resolve(variantsRootDir, "src", "variants"));
    const variantsDir = variantsRootDir ? path.resolve(variantsRootDir, isDev ? 'src' : 'build', 'variants') : dir;
    const cols = typeof colors == "string" && colors ? colors.split(",") : [];
    cols.map((col) => {
        VariantsColors.registerColor(col);
    });
    const outputPath = path.resolve(variantsDir ?? dir, "generated-variants-colors.js");
    const outputDeclarations = path.resolve(variantsDir ?? dir, "generated-variants-colors.d.ts")
    const content = JSON.stringify({
        button: VariantsColors.buildBackgroundColors(false, (colorNameWithPrefix, darkColorWithPrefix, color) => {
            return {
                base: `${colorNameWithPrefix} ${darkColorWithPrefix}`,
                label: `text-${color}-foreground dark:text-dark${color}-foreground`,
                icon: `!text-${color}-foreground dark:!text-dark${color}-foreground`,
            }
        }),
        icon: VariantsColors.buildTextColors(true),
        iconButton: VariantsColors.buildForegroundColors(true, (colorWithPrefix, darkColorWithPrefix, colorWithoutPrefix) => {
            return {
                container: `bg-${colorWithoutPrefix} dark:bg-dark${colorWithPrefix}`,
                icon: cn(colorWithPrefix, darkColorWithPrefix),
                text: `text-${colorWithPrefix}-foreground dark:text-dark-${colorWithoutPrefix}-foreground`
            }
        }),
        divider: VariantsColors.buildBackgroundColors(),
        heading: VariantsColors.buildTextColors(),
        surface: VariantsColors.buildBackgroundColors(false, (colorWithPrefix, darkColorWithPrefix, colorWithoutPrefix) => {
            return cn(colorWithPrefix, darkColorWithPrefix, `text-${colorWithoutPrefix}-foreground dark:text-dark-${colorWithoutPrefix}-foreground`)
        }),
        text: VariantsColors.buildTextColors()
    }, null, 2);

    fs.writeFileSync(outputPath, `
export const VariantsGeneratedColors = ${content}
    `, 'utf8');

    fs.writeFileSync(outputDeclarations, `
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon",string>>;
        icon : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        divider : Record<IName,string>;
        heading : Record<IName,string>;
        text : Record<IName,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any as IVariantsGeneratedColors;
    `, 'utf8');

    console.log("Variants colors file generated at ", outputPath, "\n");
    console.log("Variants colors file types generated at ", outputDeclarations);
}