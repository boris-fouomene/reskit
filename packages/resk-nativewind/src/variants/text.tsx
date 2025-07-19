import { tv, VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { textVariants } from "./variantsFactory/text2icons";

export const textVariant = tv({
    base: "",
    variants: {
        ...VariantsOptionsFactory.createAll(),
        ...textVariants,
    },
});

export type ITextVariant = VariantProps<typeof textVariant>
