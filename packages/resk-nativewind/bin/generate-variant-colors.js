import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import _colors from "./colors.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const outputDir = path.join(__dirname, "../src/variants/colors");
const colors = [...new Set(_colors)];
const light = colors.filter((color) => !color.startsWith("dark-"));
const dark = colors.filter((color) => color.startsWith("dark-"));
let IColorName = "";
light.map((color) => {
  IColorName += (IColorName ? " | " : "") + `"${color}"`;
});
const colorPrefixes = [
  // text
  "text-",
  "active:text-",
  "hover:text-",
  "dark:text-",
  "dark:hover:text-",
  "focus:text-",
  "dark:focus:text-",
  // ring
  "ring-",
  "dark:ring-",
  "hover:ring-",
  "active:ring-",
  "dark:hover:ring-",
  "dark:active:ring-",
  "focus:ring-",
  "dark:focus:ring-",
  // shadow
  "shadow-",
  "dark:shadow-",
  "hover:shadow-",
  "active:shadow-",
  "dark:hover:shadow-",
  "dark:active:shadow-",
  "focus:shadow-",
  "dark:focus:shadow-",
  // border
  "border-",
  "border-l-",
  "border-r-",
  "border-t-",
  "border-b-",
  "border-x-",
  "border-y-",
  "dark:border-",
  "hover:border-",
  "hover:border-t-",
  "hover:border-b-",
  "hover:border-l-",
  "hover:border-r-",
  "active:border-",
  "dark:hover:border-",
  "dark:active:border-",
  "focus:border-",
  "dark:focus:border-",
  // bg
  "bg-",
  "dark:bg-",
  "hover:bg-",
  "active:bg-",
  "dark:hover:bg-",
  "dark:active:bg-",
  "focus:bg-",
  "dark:focus:bg-",
  // fill
  "fill-",
  "dark:fill-",
  "hover:fill-",
  "active:fill-",
  "dark:hover:fill-",
  "dark:active:fill-",
  "focus:fill-",
  "dark:focus:fill-",
  // outline
  "outline-",
  "dark:outline-",
  "hover:outline-",
  "dark:hover:outline-",
  "active:outline-",
  "dark:active:outline-",
  "focus:outline-",
  "dark:focus:outline-",
  // decoration
  "decoration-",
  "dark:decoration-",
  "hover:decoration-",
  "active:decoration-",
  "dark:hover:decoration-",
  "dark:active:decoration-",
  "focus:decoration-",
  "dark:focus:decoration-",
  "placeholder-",
];
let IColorClassPrefixes = "";
colorPrefixes.map((prefix) => {
  IColorClassPrefixes += (IColorClassPrefixes ? " | " : "") + `"${prefix}"`;
});
const text = {
  textColor: "text-",
  "active:textColor": "active:text-",
  "hover:textColor": "hover:text-",
  "dark:textColor": "dark:text-",
  "dark:hover:textColor": "dark:hover:text-",
  "focus:textColor": "focus:text-",
  "dark:focus:textColor": "dark:focus:text-",
};
const ring = {
  ringColor: "ring-",
  "dark:ringColor": "dark:ring-",
  "hover:ringColor": "hover:ring-",
  "active:ringColor": "active:ring-",
  "dark:hover:ringColor": "dark:hover:ring-",
  "dark:active:ringColor": "dark:active:ring-",
  "focus:ringColor": "focus:ring-",
  "dark:focus:ringColor": "dark:focus:ring-",
};
const shadow = {
  shadowColor: "shadow-",
  "dark:shadowColor": "dark:shadow-",
  "hover:shadowColor": "hover:shadow-",
  "active:shadowColor": "active:shadow-",
  "dark:hover:shadowColor": "dark:hover:shadow-",
  "dark:active:shadowColor": "dark:active:shadow-",
  "focus:shadowColor": "focus:shadow-",
  "dark:focus:shadowColor": "dark:focus:shadow-",
};
const border = {
  borderColor: "border-",
  borderTopColor: "border-t-",
  borderBottomColor: "border-b-",
  borderLeftColor: "border-l-",
  borderRightColor: "border-r-",
  borderInlineColor: "border-x-",
  borderBlockColor: "border-y-" /* 
  'dark:borderColor': 'dark:border-', */,
  "hover:borderColor": "hover:border-",
  "hover:borderTopColor": "hover:border-t-",
  "hover:borderBottomColor": "hover:border-b-",
  "hover:borderLeftColor": "hover:border-l-",
  "hover:borderRightColor": "hover:border-r-",
  "active:borderColor": "active:border-",
  "dark:hover:borderColor": "dark:hover:border-",
  "dark:active:borderColor": "dark:active:border-",
  "focus:borderColor": "focus:border-",
  "dark:focus:borderColor": "dark:focus:border-",
};
const bg = {
  bgColor: "bg-",
  "dark:bgColor": "dark:bg-",
  "hover:bgColor": "hover:bg-",
  "active:bgColor": "active:bg-",
  "dark:hover:bgColor": "dark:hover:bg-",
  "dark:active:bgColor": "dark:active:bg-",
  "dark:hover:bgColor": "dark:hover:bg-",
  "focus:bgColor": "focus:bg-",
  "dark:focus:bgColor": "dark:focus:bg-",
};
const fill = {
  fillColor: "fill-",
  "dark:fillColor": "dark:fill-",
  "hover:fillColor": "hover:fill-",
  "active:fillColor": "active:fill-",
  "dark:hover:fillColor": "dark:hover:fill-",
  "dark:active:fillColor": "dark:active:fill-",
  "focus:fillColor": "focus:fill-",
  "dark:focus:fillColor": "dark:focus:fill-",
};
const decoration = {
  decorationColor: "decoration-",
  "dark:decorationColor": "dark:decoration-",
  "hover:decorationColor": "hover:decoration-",
  "active:decorationColor": "active:decoration-",
  "dark:hover:decorationColor": "dark:hover:decoration-",
  "dark:active:decorationColor": "dark:active:decoration-",
  "focus:decorationColor": "focus:decoration-",
  "dark:focus:decorationColor": "dark:focus:decoration-",
};
const outline = {
  outlineColor: "outline-",
  "dark:outlineColor": "dark:outline-",
  "hover:outlineColor": "hover:outline-",
  "active:outlineColor": "active:outline-",
  "dark:hover:outlineColor": "dark:hover:outline-",
  "dark:active:outlineColor": "dark:active:outline-",
  "focus:outlineColor": "focus:outline-",
  "dark:focus:outlineColor": "dark:focus:outline-",
};
const input = {
  "placeholder-": "Placeholder Color",
};
const all = {
  text,
  ring,
  shadow,
  border,
  bg,
  fill,
  outline,
  decoration,
  input,
};
Object.entries(all).forEach(([colorType, colorMap]) => {
  const filePath = path.join(outputDir, `${colorType}.ts`);
  const content = `export const ${colorType} = `;
  const jsonContent = {};
  const isDark = colorType.startsWith("dark:");
  if (isDark) {
    return;
  }
  Object.entries(colorMap).forEach(([color, prefix]) => {
    //content.push(`\t"${color}": "${prefix}${color}",`)
    if (!prefix.startsWith("dark:")) {
      jsonContent[color] = {};
      (isDark ? dark : light).forEach((colorName) => {
        jsonContent[color][colorName] = `${prefix}${colorName}`;
      });
    }
  });
  fs.writeFileSync(
    filePath,
    `${content}${JSON.stringify(jsonContent, null, 2)} as const;\n`,
    "utf8"
  );
});
const filePath = path.join(outputDir, `index.ts`);
let finalImports = [];
const finalContent = ["export const variantColorsOptions = {"];
Object.keys(all).forEach((colorType) => {
  finalImports.push(`import { ${colorType} } from './${colorType}'`);
  finalContent.push(`  ${colorType},`);
});
finalContent.push("} as const;");
fs.writeFileSync(
  filePath,
  `
${finalImports.join("\n")}\n\n
export * from './types';\n\n
${finalContent.join("\n")}\n\n

`,
  "utf8"
);

const typesFilePath = path.join(outputDir, `types.ts`);
fs.writeFileSync(
  typesFilePath,
  `
export const COLOR_CLASS_PREFIXES : IColorClassPrefix[] = ${JSON.stringify(colorPrefixes)} as const;\n\n
export type IColorClassWithPrefix<ColorClassPrefix extends IColorClassPrefix = IColorClassPrefix> =  \`\${ColorClassPrefix}\${IColorName}\`;\n\n
export type IColorClassPrefix =${IColorClassPrefixes};\n\n
export type IColorName =${IColorName};\n\n
  `,
  "utf8"
);
console.log("variant colors generated successfully at", filePath);
