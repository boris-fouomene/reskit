import { tv, type VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { iconVariants } from "./variantsFactory/text2icons";
const icon = tv({
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

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;