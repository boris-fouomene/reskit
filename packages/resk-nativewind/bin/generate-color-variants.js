const fs = require("fs"),
  path = require("path");

const dir = path.resolve(process.cwd());
const cn = (...args) => {
  return args.filter((text) => text && typeof text == "string").join(" ");
};

module.exports = (colors, options) => {
  const variantJsFile = path.resolve(__dirname, "../build/variants/colors/index.js");
  if (!fs.existsSync(variantJsFile)) {
    return;
  }
  const { VariantsColors } = require(variantJsFile);
  if (!VariantsColors || typeof VariantsColors?.buildTextColors != "function") {
    return;
  }
  const variantsRootDir = require("./find-package-dir")("build", "variants");
  options = Object.assign({}, options);
  const isDev = options.isDev === true && variantsRootDir && fs.existsSync(path.resolve(variantsRootDir, "src", "variants"));
  const variantsDir = variantsRootDir ? path.resolve(variantsRootDir, isDev ? "src" : "build", "variants") : dir;
  const cols = typeof colors == "string" && colors ? colors.split(",") : [];
  VariantsColors.registerColor(...cols);
  const finalDir = variantsDir ?? dir;
  const outputPath = path.resolve(finalDir, "generated-variants-colors.js");
  const outputDeclarations = path.resolve(finalDir, "generated-variants-colors.d.ts");
  const textColors = VariantsColors.buildTextColors();
  const textForeground = Object.fromEntries(Object.entries(textColors).map(([key, value]) => [`${key}-foreground`, value]));
  const textColorsWithImportant = VariantsColors.buildTextColors(true);
  const textForegroundWithImportant = Object.fromEntries(Object.entries(textColorsWithImportant).map(([key, value]) => [`${key}-foreground`, value]))
  const textWithForeground = {
    ...textColors,
    ...textForeground
  },
    textWithForegroundWithImportant = {
      ...textColorsWithImportant,
      ...textForegroundWithImportant,
    };
  const content = JSON.stringify(
    {
      button: VariantsColors.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightColorWithPrefix, lightForegroundWithPrefix, darkColorWithPrefix, darkForegroundWithPrefix, }) => {
        return {
          base: `${lightColorWithPrefix} ${darkColorWithPrefix} focus-visible:outline-${lightColor} dark:focus-visible:outline-${darkColor}`,
          label: `text-${lightForeground} dark:text-${darkForeground}`,
          icon: `!text-${lightForeground} dark:!text-${darkForeground}`,
          activityIndicator: cn(`border-t-${lightForeground} dark:border-t-${darkForeground}`),
        };
      }),
      buttonOutline: VariantsColors.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightColorWithPrefix, lightForegroundWithPrefix, darkColorWithPrefix, darkForegroundWithPrefix, }) => {
        const groupClassName = {
          base: `group web:hover:bg-${lightColor} web:dark:hover:bg-${darkColor}`,
          label: `web:hover:text-${lightForeground} web:dark:hover:text-${darkForeground} web:group-hover:text-${lightForeground} web:dark:group-hover:text-${darkForeground}`,
          icon: `web:hover:!text-${lightForeground} web:dark:hover:!text-${darkForeground} web:group-hover:!text-${lightForeground} web:dark:group-hover:!text-${darkForeground}`,
          activityIndicator: `web:hover:border-t-${lightColor}-foregund web:dark:hover:border-t-${darkForeground} web:group-hover:border-t-${lightForeground} web:dark:group-hover:border-t-${darkForeground}`,
        };
        return {
          base: `${groupClassName.base} p-[5px] border-2 border-${lightColor} dark:border-${darkColor} bg-transparent web:transition-[transform,color,background-color,border-color,text-decoration-color,fill,stroke]`,
          label: `${groupClassName.label} text-${lightColor} dark:text-${darkColor}`,
          icon: `${groupClassName.icon} !text-${lightColor} dark:!text-${darkColor}`,
          activityIndicator: cn(groupClassName.activityIndicator, `border-t-${lightColor} dark:border-t-${darkColor}`),
        };
      }),
      icon: textWithForegroundWithImportant,
      iconForeground: textWithForegroundWithImportant,
      iconButton: Object.fromEntries(Object.entries(textWithForegroundWithImportant).map(([key, value]) => {
        return {
          container: value.split("!text-").join("bg-"),
          icon: value,
          text: value.split('!text-').join("text")
        };
      })),
      surface: VariantsColors.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightColorWithPrefix, lightForegroundWithPrefix, darkColorWithPrefix, darkForegroundWithPrefix }) => {
        return cn(lightColorWithPrefix, darkColorWithPrefix, `text-${lightForeground} dark:text-${darkForeground}`);
      }),
      shadow: VariantsColors.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightColorWithPrefix, lightForegroundWithPrefix, darkColorWithPrefix, darkForegroundWithPrefix }) => {
        return cn(`shadow-${lightColor}/20 dark:shadow-${darkColor}/30`);
      }),
      text: VariantsColors.buildTextColors(),
      textWithImportant: textColorsWithImportant,
      textForegroundWithImportant,
      textWithForeground,
      textWithForegroundWithImportant,
      background: VariantsColors.buildBackgroundColors(),
      textForeground,
      borderColor: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-")]
      })),
      borderTopColor: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-t-")]
      })),
      borderBottomColor: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-b-")]
      })),
      borderLeftColor: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-l-")]
      })),
      borderRightColor: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-r-")]
      })),
      activityIndicator: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("border-t-")]
      })),
      ringColors: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("ring-")]
      })),
      hoverRingColors: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("hover:ring-")]
      })),
      activeRingColors: Object.fromEntries(Object.entries(textWithForeground).map(([key, value]) => {
        return [key, value.split("text-").join("active:ring-")]
      })),
    },
    null,
    2
  );
  fs.writeFileSync(
    outputPath,
    `
export const VariantsGeneratedColors = ${content}
    `,
    "utf8"
  );

  fs.writeFileSync(
    outputDeclarations,
    `
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    type IName2Foreground = IVariantsColors.ColorName2Foreground;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconForeground : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        text : Record<IName,string>;
        textWithImportant : Record<IName,string>;
        textWithForegroundWithImportant : Record<IName2Foreground,string>;
        textForegroundWithImportant: Record<IName,string>;
        textWithForeground : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        textForeground : Record<IName,string>;
        shadow : Record<IName,string>;
        activityIndicator: Record<IName2Foreground,string>;
        borderColor : Record<IName2Foreground,string>;
        borderTopColor : Record<IName2Foreground,string>;
        borderBottomColor : Record<IName2Foreground,string>;
        borderLeftColor : Record<IName2Foreground,string>;
        borderRightColor : Record<IName2Foreground,string>;
        ringColors : Record<IName2Foreground,string>;
        hoverRingColors: Record<IName2Foreground,string>;
        activeRingColors: Record<IName2Foreground,string>;
    }
export const VariantsGeneratedColors : IVariantsGeneratedColors = {} as any;
    `,
    "utf8"
  );
  if (!isDev) {
    generateColorMapTypes(finalDir, cols);
  }
  console.log("Variants colors file generated at ", outputPath, "\n");
  console.log("Variants colors file types generated at ", outputDeclarations);
};

function generateColorMapTypes(variantRootDir, colors) {
  if (typeof variantRootDir == "string" && fs.existsSync(variantRootDir)) {
    colors = Array.isArray(colors) && colors.length > 0 ? colors : [];
    const colorMapTypesPath = path.resolve(variantRootDir, "colors/colorsMap.d.ts");
    console.log(colorMapTypesPath, " is color map types path");
    try {
      fs.writeFileSync(
        colorMapTypesPath,
        `
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
`,
        "utf8"
      );
    } catch (error) {
      console.log("Error generating color map types file at ", colorMapTypesPath, error);
    }
  }
}
