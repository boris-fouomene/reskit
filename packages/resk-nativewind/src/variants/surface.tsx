import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";

export const surfaceVariant = tv({
    base: "",
    variants: {
        ...VariantsOptionsFactory.createAll(),
        colorScheme: VariantsColors.surface,
    },
    defaultVariants: {
        colorScheme: "surface",
    }
});

export type ISurfaceVariant = VariantProps<typeof surfaceVariant>;
