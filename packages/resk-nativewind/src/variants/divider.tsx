import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";

export const dividerVariant = tv({
    base: "bg-outline dark:bg-dark-outline w-full",
    variants: {
        color: VariantsColors.background
    }
});
export type IDividerVariant = VariantProps<typeof dividerVariant>;