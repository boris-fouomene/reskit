import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

const surface = tv({
    base: "",
    variants: {
        color: VariantsColors.surface,
        ...VariantsFactory.createAll(),
    },
    defaultVariants: {
        color: "surface",
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
