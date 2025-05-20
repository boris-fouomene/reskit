import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const divider = tv({
    base: "bg-outline dark:bg-dark-outline w-full",
    variants: {
        color: VariantsGeneratedColors.divider
    }
});
export default divider;

export type IVariantPropsDivider = VariantProps<typeof divider>;