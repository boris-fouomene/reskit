const fs = require("fs"),
  path = require("path");

const dir = path.resolve(process.cwd());
const cn = (...args) => {
  return args.filter((text) => text && typeof text == "string").join(" ");
};
const isNonNullString = (x) => x && typeof x == "string";
module.exports = (options) => {
  const buildDir = path.resolve(__dirname, "../build/variants/colors");
  if (!fs.existsSync(buildDir)) {
    return;
  }
  const vPath = path.resolve(__dirname, "color-variants", "colors.js");
  if (!fs.existsSync(vPath)) {
    return;
  }
  const variantsRootDir = require("./find-package-dir")("build", "variants");
  options = Object.assign({}, options);
  const isDev = options.isDev === true && variantsRootDir && fs.existsSync(path.resolve(variantsRootDir, "src", "variants"));
  const inputPath = isNonNullString(options.input) && options.input.trim().endsWith(".json") ? path.resolve(options.input) : path.resolve(dir, "variants.json");
  if (!fs.existsSync(inputPath)) {
    console.log("variants.json file not found at ", inputPath);
    return;
  }
  const variants = require(inputPath);
  if (!variants || typeof variants != "object") {
    console.log("variants.json file is not a valid json object");
    return;
  }
  const variantsDir = variantsRootDir ? path.resolve(variantsRootDir, isDev ? "src" : "build", "variants") : dir;
  const vOptions = { variantsRootDir, isDev, inputPath, variantsDir, outputRootDir: variantsDir ?? dir };
  const { colors } = Object.assign({}, variants);
  generateColorVariants(colors, vOptions);
};

function generateColorVariants(colors, { outputRootDir, isDev }) {
  if (!colors || typeof colors != "object") return;
  const { VariantsColorsFactory } = require("./color-variants/colors");
  if (!VariantsColorsFactory || typeof VariantsColorsFactory.buildColors !== "function" || typeof VariantsColorsFactory.buildTextColors !== "function") {
    return;
  }
  VariantsColorsFactory.registerColor(colors);
  const ouputFolder = path.resolve(outputRootDir, "colors");
  const outputPath = path.resolve(ouputFolder, "generated.js");
  const outputDeclarations = path.resolve(ouputFolder, "generated.d.ts");
  const textForeground = Object.fromEntries(Object.entries(VariantsColorsFactory.buildTextForegroundColors()).map(([key, value]) => [`${key}-foreground`, value]));
  const textColorsWithImportant = VariantsColorsFactory.buildTextColors(true);
  const iconForeground = Object.fromEntries(Object.entries(VariantsColorsFactory.buildTextForegroundColors(true)).map(([key, value]) => [`${key}-foreground`, value]));
  const textColors = {
    ...VariantsColorsFactory.buildTextColors(),
    ...textForeground,
  },
    icon = {
      ...textColorsWithImportant,
      ...iconForeground,
    },
    background = VariantsColorsFactory.buildBackgroundColors();
  const allColors = {};
  const content = JSON.stringify(
    {
      button: VariantsColorsFactory.buildBackgroundColors(
        false,
        ({
          lightColor,
          darkColor,
          lightForeground,
          darkForeground,
          lightComputedColor,
          lightComputedForeground,
          darkComputedColor,
        }) => {
          return {
            base: `${lightComputedColor} ${darkComputedColor} focus-visible:outline-${lightColor} dark:focus-visible:outline-${darkColor}`,
            label: `text-${lightForeground} dark:text-${darkForeground}`,
            icon: `!text-${lightForeground} dark:!text-${darkForeground}`,
            activityIndicator: cn(`border-t-${lightForeground} dark:border-t-${darkForeground}`),
          };
        }
      ),
      buttonOutline: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
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
      surface: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(lightComputedColor, darkComputedColor, `text-${lightForeground} dark:text-${darkForeground}`);
      }),
      hoverBackground: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`hover:bg-${lightColor} dark:bg-${darkColor}`);
      }),
      activeBackground: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`active:bg-${lightColor} dark:active:bg-${darkColor}`);
      }),
      shadow: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`shadow-${lightColor} dark:shadow-${darkColor}`);
      }),
      hoverShadow: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`hover:shadow-${lightColor} dark:hover:shadow-${darkColor}`);
      }),
      activeShadow: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`active:shadow-${lightColor} dark:active:shadow-${darkColor}`);
      }),
      hoverText: VariantsColorsFactory.buildTextColors(false, ({ lightColor, darkColor }) => {
        return cn(`hover:text-${lightColor} dark:hover:text-${darkColor}`);
      }),
      activeText: VariantsColorsFactory.buildTextColors(false, ({ lightColor, darkColor }) => {
        return cn(`active:text-${lightColor} dark:active:text-${darkColor}`);
      }),
      text: textColors,
      hoverText: Object.fromEntries(Object.entries(textColors).map(([key, value]) => [key, value.split("text-").join("hover:text-")])),
      activeText: Object.fromEntries(Object.entries(textColors).map(([key, value]) => [key, value.split("text-").join("active:text-")])),
      icon,
      hoverIcon: Object.fromEntries(Object.entries(icon).map(([key, value]) => [key, value.split("!text-").join("hover:!text-")])),
      activeIcon: Object.fromEntries(Object.entries(icon).map(([key, value]) => [key, value.split("!text-").join("active:!text-")])),
      background,
      textForeground,
      hoverTextForeground: Object.fromEntries(Object.entries(textForeground).map(([key, value]) => [key, value.split("text-").join("hover:text-")])),
      activeTextForeground: Object.fromEntries(Object.entries(textForeground).map(([key, value]) => [key, value.split("text-").join("active:text-")])),
      iconForeground,
      hoverIconForeground: Object.fromEntries(Object.entries(iconForeground).map(([key, value]) => [key, value.split("!text-").join("hover:!text-")])),
      activeIconForeground: Object.fromEntries(Object.entries(iconForeground).map(([key, value]) => [key, value.split("!text-").join("active:!text-")])),
      borderColor: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-")];
        })
      ),
      borderTopColor: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-t-")];
        })
      ),
      borderBottomColor: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-b-")];
        })
      ),
      borderLeftColor: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-l-")];
        })
      ),
      borderRightColor: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-r-")];
        })
      ),
      activityIndicator: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("border-t-")];
        })
      ),
      ringColors: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("ring-")];
        })
      ),
      hoverRingColors: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("hover:ring-")];
        })
      ),
      activeRingColors: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("active:ring-")];
        })
      ),
      focusRingColors: Object.fromEntries(
        Object.entries(textColors).map(([key, value]) => {
          return [key, value.split("text-").join("focus:ring-")];
        })
      ),
      allColors,
    },
    null,
    2
  );
  fs.writeFileSync(
    outputPath,
    `
export const VariantsColors = ${content}
    `,
    "utf8"
  );

  fs.writeFileSync(
    outputDeclarations,
    `
    import { IVariantsColors } from "./colors";
    type IName = IVariantsColors.ColorName;
    type IName2Foreground = IVariantsColors.ColorName2Foreground;
    type IForegroundName = IVariantsColors.ForegroundColorName;
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        surface : Record<IName,string>;
        badge : Record<IName,string>;
        icon : Record<IName2Foreground,string>;
        hoverIcon : Record<IName2Foreground,string>;
        activeIcon : Record<IName2Foreground,string>;
        text : Record<IName2Foreground ,string>;
        hoverText : Record<IName2Foreground ,string>;
        activeText : Record<IName2Foreground ,string>;
        background : Record<IName,string>;
        hoverBackground : Record<IName,string>;
        activeBackground : Record<IName,string>;
        textForeground : Record<IForegroundName,string>;
        hoverTextForeground : Record<IForegroundName,string>;
        activeTextForeground : Record<IForegroundName,string>;
        iconForeground : Record<IForegroundName,string>;
        hoverIconForeground : Record<IForegroundName,string>;
        activeIconForeground : Record<IForegroundName,string>;
        shadow : Record<IName,string>;
        hoverShadow : Record<IName,string>;
        activeShadow : Record<IName,string>;
        activityIndicator: Record<IName2Foreground,string>;
        borderColor : Record<IName2Foreground,string>;
        borderTopColor : Record<IName2Foreground,string>;
        borderBottomColor : Record<IName2Foreground,string>;
        borderLeftColor : Record<IName2Foreground,string>;
        borderRightColor : Record<IName2Foreground,string>;
        ringColors : Record<IName2Foreground,string>;
        hoverRingColors: Record<IName2Foreground,string>;
        activeRingColors: Record<IName2Foreground,string>;
        focusRingColors: Record<IName2Foreground,string>;
    }
export const VariantsColors : IVariantsGeneratedColors = {} as any;
    `,
    "utf8"
  );
  console.log("Variants colors file generated at ", outputPath, "\n");
  console.log("Variants colors file types generated at ", outputDeclarations);
  if (!isDev && fs.existsSync(ouputFolder)) {
    const colorMapTypesPath = path.resolve(ouputFolder, "colorsMap.d.ts");
    try {
      fs.writeFileSync(colorMapTypesPath, VariantsColorsFactory.generateColorsMapTypes(), "utf8");
      console.log("Variants colors map types generated at ", colorMapTypesPath);
    } catch (error) {
      console.log("Error generating color map types file at ", colorMapTypesPath, error);
    }
  }
}
