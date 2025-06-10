import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const surface = tv({
    base: "bg-surface dark:bg-dark-surface text-surface-foreground dark:text-dark-surface-foreground",
    variants: {
        color: VariantsGeneratedColors.surface,
        ...VariantsFactory.createAll(),
    },
    defaultVariants: {
        color: "surface",
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
