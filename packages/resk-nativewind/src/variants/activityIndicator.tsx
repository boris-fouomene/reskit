import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const activityIndicator = tv({
    variants: {
        color: VariantsGeneratedColors.activityIndicator,
        size: {
            sm: "h-sm w-sm",
            md: "h-md w-md",
            lg: "h-lg w-lg",
            xl: "h-xl w-xl",
            "2xl": "h-2xl w-2xl",
            "3xl": "h-3xl w-3xl",
            "4xl": "h-4xl w-4xl",
            "5xl": "h-5xl w-5xl",
            "6xl": "h-6xl w-6xl",
            "7xl": "h-7xl w-7xl",
            "8xl": "h-8xl w-8xl",
            "9xl": "h-9xl w-9xl",
        }
    },
    defaultVariants: {
        color: "primary"
    }
});

export default activityIndicator;

export type IVariantPropsActivityIndicator = VariantProps<typeof activityIndicator>;