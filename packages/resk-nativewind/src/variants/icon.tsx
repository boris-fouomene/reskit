import { tv, type VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { iconVariants } from "./variantsFactory/text2icons";
export const iconVariant = tv({
    variants: {
        ...VariantsOptionsFactory.createAll(),
        ...iconVariants,
    },
});

export type IIconVariant = VariantProps<typeof iconVariant>;