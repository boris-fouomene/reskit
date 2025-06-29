import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";

const activityIndicator = tv({
    variants: {
        color: VariantsGeneratedColors.activityIndicator,
    },
    defaultVariants: {
        color: "primary"
    }
});

export default activityIndicator;

export type IVariantPropsActivityIndicator = VariantProps<typeof activityIndicator>;