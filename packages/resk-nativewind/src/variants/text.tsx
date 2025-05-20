import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const text = tv({
    base: "",
    variants: {
        color: VariantsGeneratedColors.text,
        error: {
            true: "text-error dark:text-dark-error",
        }
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

export type IVariantPropsText = Omit<VariantProps<typeof text>, "color"> & {
    color?: VariantProps<typeof text>["color"] | string;
};
