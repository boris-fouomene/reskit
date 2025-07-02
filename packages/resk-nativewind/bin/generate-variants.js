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
  const textColors = VariantsColorsFactory.buildTextColors();
  const textForeground = Object.fromEntries(Object.entries(VariantsColorsFactory.buildTextForegroundColors()).map(([key, value]) => [`${key}-foreground`, value]));
  const textColorsWithImportant = VariantsColorsFactory.buildTextColors(true);
  const textForegroundWithImportant = Object.fromEntries(Object.entries(VariantsColorsFactory.buildTextForegroundColors(true)).map(([key, value]) => [`${key}-foreground`, value]));
  const textWithForeground = {
      ...textColors,
      ...textForeground,
    },
    textWithForegroundWithImportant = {
      ...textColorsWithImportant,
      ...textForegroundWithImportant,
    },
    background = VariantsColorsFactory.buildBackgroundColors();
  const allColors = {};
  if (false) {
    Object.entries(VariantsColorsFactory.colors).map(([key, value]) => {
      const { lightColor, darkColor, lightForeground, darkForeground, areTailwindClasses } = value;
      const hasLight = isNonNullString(lightColor);
      const hasDark = isNonNullString(darkColor);
      const hasLightForeground = isNonNullString(lightForeground);
      const hasDarkForeground = isNonNullString(darkForeground);
      if (areTailwindClasses) {
        ["bg", "border", "border-t", "border-b", "border-l", "border-r", "ring", "shadow"].map((prefix) => {
          const classPrefix = `${prefix}-${key}`;
          if (hasLight) {
            allColors[classPrefix] = `${prefix}-${lightColor}`;
          }
          if (hasDark) {
            allColors[`dark:${classPrefix}`] = `${prefix}-${darkColor}`;
          }
          if (hasLightForeground) {
            allColors[`${classPrefix}-foreground`] = `${prefix}-${lightForeground}`;
          }
          if (hasDarkForeground) {
            allColors[`dark:${classPrefix}-foreground`] = `${prefix}-${darkForeground}`;
          }
        });
      }
    });
  }
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

          hoverLightColor,
          hoverDarkColor,
          activeLightColor,
          activeDarkColor,
          hoverLightForeground,
          hoverDarkForeground,
          activeLightForeground,
          activeDarkForeground,

          hoverLightComputedColor,
          hoverDarkComputedColor,
          hoverLightComputedForeground,
          hoverDarkComputedForeground,
          activeLightComputedColor,
          activeDarkComputedColor,
          activeLightComputedForeground,
          activeDarkComputedForeground,
        }) => {
          const textColor = [hoverLightComputedForeground.split("bg-").join("text-"), hoverDarkComputedForeground.split("bg-").join("text-"), activeLightComputedForeground.split("bg-").join("text-"), activeDarkComputedForeground.split("bg-").join("text-")].filter((c) => !!c).join(" "),
            iconColor = [hoverLightComputedForeground.split("bg-").join("!text-"), hoverDarkComputedForeground.split("bg-").join("!text-"), activeLightComputedForeground.split("bg-").join("!text-"), activeDarkComputedForeground.split("bg-").join("!text-")].filter((c) => !!c).join(" ");
          const borderTColor = [hoverLightComputedForeground.split("bg-").join("text-"), hoverDarkComputedForeground.split("bg-").join("text-"), activeLightComputedForeground.split("bg-").join("text-"), activeDarkComputedForeground.split("bg-").join("border-t-")].filter((c) => !!c).join(" ");

          return {
            base: `${lightComputedColor} ${darkComputedColor} focus-visible:outline-${lightColor} dark:focus-visible:outline-${darkColor} ${hoverLightComputedColor} ${hoverDarkComputedColor} ${activeLightComputedColor} ${activeDarkComputedColor}`,
            label: `text-${lightForeground} dark:text-${darkForeground} ${textColor}`,
            icon: `!text-${lightForeground} dark:!text-${darkForeground} ${iconColor}`,
            activityIndicator: cn(`border-t-${lightForeground} dark:border-t-${darkForeground} ${borderTColor}`),
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
      icon: textWithForegroundWithImportant,
      iconForeground: textWithForegroundWithImportant,
      iconButton: Object.fromEntries(
        Object.entries(textForegroundWithImportant).map(([key, value]) => {
          const colorName = key.split("-foreground")[0];
          return [
            colorName,
            {
              container: background[colorName],
              icon: value,
              text: value.split("!text-").join("text-"),
            },
          ];
        })
      ),
      surface: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(lightComputedColor, darkComputedColor, `text-${lightForeground} dark:text-${darkForeground}`);
      }),
      badge: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground, activeDarkComputedColor, activeLightComputedColor, hoverDarkComputedColor, hoverLightComputedColor }) => {
        return cn(lightComputedColor, darkComputedColor, `text-${lightForeground} dark:text-${darkForeground}`, activeDarkComputedColor, activeLightComputedColor, hoverDarkComputedColor, hoverLightComputedColor);
      }),
      shadow: VariantsColorsFactory.buildBackgroundColors(false, ({ lightColor, darkColor, lightForeground, darkForeground, lightComputedColor, lightComputedForeground, darkComputedColor, darkComputedForeground }) => {
        return cn(`shadow-${lightColor}/20 dark:shadow-${darkColor}/30`);
      }),
      text: VariantsColorsFactory.buildTextColors(),
      textWithImportant: textColorsWithImportant,
      textForegroundWithImportant,
      textWithForeground,
      textWithForegroundWithImportant,
      background,
      textForeground,
      borderColor: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-")];
        })
      ),
      borderTopColor: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-t-")];
        })
      ),
      borderBottomColor: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-b-")];
        })
      ),
      borderLeftColor: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-l-")];
        })
      ),
      borderRightColor: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-r-")];
        })
      ),
      activityIndicator: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("border-t-")];
        })
      ),
      ringColors: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("ring-")];
        })
      ),
      hoverRingColors: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("hover:ring-")];
        })
      ),
      activeRingColors: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
          return [key, value.split("text-").join("active:ring-")];
        })
      ),
      focusRingColors: Object.fromEntries(
        Object.entries(textWithForeground).map(([key, value]) => {
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
    export declare interface IVariantsGeneratedColors {
        button : Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        buttonOutline: Record<IName,Record<"base"|"label"|"icon" | "activityIndicator",string>>;
        icon : Record<IName,string>;
        iconForeground : Record<IName,string>;
        iconButton : Record<IName,Record<"container"|"text"|"icon",string>>;
        surface : Record<IName,string>;
        badge : Record<IName,string>;
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
