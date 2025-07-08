import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { fontWeightClasses } from "./variantsFactory/fontWeight";
import { textAlignClasses } from "./variantsFactory/textAlignClasses";

const text = tv({
    base: "",
    variants: {
        ...VariantsFactory.createAll(),

        color: VariantsColors.text,
        hoverColor: VariantsFactory.createHoverTextColor(),
        activeColor: VariantsFactory.createActiveTextColor(),

        align: textAlignClasses,
        weight: fontWeightClasses,
        size: VariantsFactory.createTextSize(),
        nativeSize: VariantsFactory.createNativeTextSize(),

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

export default text;

export type IVariantPropsText = VariantProps<typeof text>
