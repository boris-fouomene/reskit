import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

const surface = tv({
    base: "",
    variants: {
        ...VariantsFactory.createAll(),
        colorScheme: VariantsColors.surface,
    },
    defaultVariants: {
        colorScheme: "surface",
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
