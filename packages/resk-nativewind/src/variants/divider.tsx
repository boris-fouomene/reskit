import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const divider = tv({
    base: "bg-outline dark:bg-dark-outline w-full",
    variants: {
        color: VariantsGeneratedColors.background
    }
});
export default divider;

export type IVariantPropsDivider = VariantProps<typeof divider>;