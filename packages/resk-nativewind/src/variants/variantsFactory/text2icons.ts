import { VariantsColors } from "@variants/colors/generated";
import { textAlignClasses } from "./textAlignClasses";
import { fontWeightClasses } from "./fontWeight";
import { textSizes } from "./textSizes";
import { iconSizes } from "./iconSizes";
import { sizesClasses } from "./sizes";
import { textDecorations } from "./textDecorations";

export const textVariants = {
  color: VariantsColors.text,
  hoverColor: VariantsColors.hoverText,
  activeColor: VariantsColors.activeText,

  align: textAlignClasses,
  weight: fontWeightClasses,
  ...textSizes,
  ...textDecorations,
  transform: {
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
    "normal-case": "normal-case",
  },
  overflow: {
    truncate: "truncate",
    ellipsis: "text-ellipsis",
    clip: "text-clip",
  }
} as const;

export const iconVariants = {
  color: VariantsColors.icon,
  hoverColor: VariantsColors.hoverIcon,
  activeColor: VariantsColors.activeIcon,
  ...iconSizes,
  imageSize: sizesClasses,
} as const;
