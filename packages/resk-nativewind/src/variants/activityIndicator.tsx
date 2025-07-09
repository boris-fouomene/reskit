import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { borderClasses } from "./variantsFactory/border";
import { Platform } from "react-native";

export const activityIndicatorVariantOptions = {
    color: VariantsColors.activityIndicator,
    size: VariantsOptionsFactory.createSize(),
    thickness: Platform.select({
        web: borderClasses.borderWidth,
        native: {} as typeof borderClasses.borderWidth
    }) as typeof borderClasses.borderWidth,
}

export const activityIndicatorVariant = tv({
    variants: activityIndicatorVariantOptions,
    defaultVariants: {
        color: "primary",
    }
});

export type IActivityIndicatorVariant = VariantProps<typeof activityIndicatorVariant>;