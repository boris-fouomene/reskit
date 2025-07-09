import { VariantsColors } from "@variants/colors/generated";
import { textAlignClasses } from "./textAlignClasses";
import { fontWeightClasses } from "./fontWeight";
import { textSizes } from "./textSizes";
import { iconSizes } from "./iconSizes";

export const textVariants = {
    color: VariantsColors.text,
    hoverColor: VariantsColors.hoverText,
    activeColor: VariantsColors.activeText,

    align: textAlignClasses,
    weight: fontWeightClasses,
    ...textSizes,
} as const;

export const iconVariants = {
    color: VariantsColors.icon,
    hoverColor: VariantsColors.hoverIcon,
    activeColor: VariantsColors.activeIcon,
    ...iconSizes,
} as const;