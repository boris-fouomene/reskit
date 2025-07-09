import { tv, type VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { iconVariants } from "./variantsFactory/text2icons";
export const iconVariant = tv({
    variants: {
        ...VariantsFactory.createAll(),

        ...iconVariants,

        error: {
            true: "",
        },
        waring: {
            true: ""
        },
        success: {
            true: "",
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

export type IVariantPropsIcon = VariantProps<typeof iconVariant>;