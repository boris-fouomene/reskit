import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";

const divider = tv({
    base: "bg-outline dark:bg-dark-outline w-full",
    variants: {
        color: VariantsColors.background
    }
});
export default divider;

export type IVariantPropsDivider = VariantProps<typeof divider>;