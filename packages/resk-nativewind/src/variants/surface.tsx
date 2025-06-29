import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

const surface = tv({
    base: "",
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
