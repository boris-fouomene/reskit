import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";

export const activityIndicatorVariant = tv({
    variants: {
        color: VariantsColors.activityIndicator,
    },
    defaultVariants: {
        color: "primary"
    }
});

export type IVariantPropsActivityIndicator = VariantProps<typeof activityIndicatorVariant>;