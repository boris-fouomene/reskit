import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { fontWeightClasses } from "./variantsFactory/fontWeight";
import { textAlignClasses } from "./variantsFactory/textAlignClasses";
import { textVariants } from "./variantsFactory/text2icons";

const text = tv({
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

export default text;

const allT = VariantsFactory.createTextVariants();

export type IVariantPropsText = VariantProps<typeof text>
