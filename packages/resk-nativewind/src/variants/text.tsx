import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const text = tv({
    base: "",
    variants: {
        color: VariantsGeneratedColors.color2foreground,
        error: {
            true: "text-error dark:text-dark-error",
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        weight: {
            light: 'font-light',
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            "400": 'font-400',
            "500": 'font-500',
            "600": 'font-600',
            "700": 'font-700',
        },
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
