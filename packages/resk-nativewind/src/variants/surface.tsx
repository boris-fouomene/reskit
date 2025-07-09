import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

export const surfaceVariant = tv({
    base: "",
    variants: {
        ...VariantsFactory.createAll(),
        colorScheme: VariantsColors.surface,
    },
    defaultVariants: {
        colorScheme: "surface",
    }
});

export type ISurfaceVariant = VariantProps<typeof surfaceVariant>;
