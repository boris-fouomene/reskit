import { tv, VariantProps } from "tailwind-variants";
import { borderClasses } from "./variantsFactory/border";
import { activityIndicatorVariantOptions } from "./variantsFactory/activityIndicator";


export const activityIndicatorVariant = tv({
    variants: activityIndicatorVariantOptions,
    defaultVariants: {
        color: "primary",
    }
});

export type IActivityIndicatorVariant = VariantProps<typeof activityIndicatorVariant>;