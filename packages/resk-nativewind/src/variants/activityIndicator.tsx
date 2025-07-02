import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";

const activityIndicator = tv({
    variants: {
        color: VariantsColors.activityIndicator,
    },
    defaultVariants: {
        color: "primary"
    }
});

export default activityIndicator;

export type IVariantPropsActivityIndicator = VariantProps<typeof activityIndicator>;