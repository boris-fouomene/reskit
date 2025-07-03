import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { fontWeightClasses } from "./variantsFactory/fontWeight";
import { textAlignClasses } from "./variantsFactory/textAlignClasses";

const text = tv({
    base: "",
    variants: {
        color: VariantsColors.text,
        error: {
            true: "",
        },
        waring: {
            true: ""
        },
        align: textAlignClasses,
        weight: fontWeightClasses,
        size: VariantsFactory.createTextSizes(),
    },
    compoundVariants: [
        {
            color: "error",
            error: true,
        },
        {
            color: "warning",
            warning: true,
        }
    ]
});

export default text;

export type IVariantPropsText = VariantProps<typeof text>
