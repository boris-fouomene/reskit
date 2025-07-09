import { tv, VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { textVariants } from "./variantsFactory/text2icons";

export const textVariant = tv({
    base: "",
    variants: {
        ...VariantsOptionsFactory.createAll(),
        ...textVariants,
        error: {
            true: "",
        },
        waring: {
            true: ""
        },
        success: {
            true: ""
        },
    },
    compoundVariants: [
        {
            color: "error",
            error: true,
        },
        {
            color: "warning",
            warning: true,
        },
        {
            color: "success",
            success: true,
        }
    ]
});

export type ITextVariant = VariantProps<typeof textVariant>
