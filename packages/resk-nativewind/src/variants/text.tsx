import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";
import { fontWeightClasses } from "./variantsFactory/fontWeight";
import { textAlignClasses } from "./variantsFactory/textAlignClasses";

const text = tv({
    base: "",
    variants: {
        color: VariantsGeneratedColors.textWithForeground,
        error: {
            true: "text-error dark:text-dark-error",
        },
        waring: {
            true: "text-warning dark:text-dark-warning"
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
