import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const surface = tv({
    base: "bg-surface dark:bg-dark-surface text-surface-foreground dark:text-dark-surface-foreground",
    variants: {
        color: VariantsGeneratedColors.surface
    },
    defaultVariants: {
        color: "surface",
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
