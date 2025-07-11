import { VariantsColors } from "@variants/colors/generated";
import { textVariants } from "./text2icons";
import { Platform } from "react-native";
import { borderClasses } from "./border";
import { marginClasses } from "./padding2margin";

export const activityIndicatorVariantOptions = {
  ...marginClasses,
  color: VariantsColors.activityIndicator,
  size: textVariants.size,
  thickness: Platform.select({
    web: borderClasses.borderWidth,
    native: {} as typeof borderClasses.borderWidth,
  }) as typeof borderClasses.borderWidth,
};
