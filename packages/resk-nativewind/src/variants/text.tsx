import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { textVariants } from "./variantsFactory/text2icons";

export const textVariant = tv({
    base: "",
    variants: {
        ...VariantsFactory.createAll(),
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
