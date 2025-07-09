import { tv, VariantProps } from 'tailwind-variants';
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from './variantsFactory';

export const buttonVariant = tv({
    slots: {
        base: "",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "mx-[5px]",
        activityIndicator: "",
        ripple: "",
        label: "",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        }),
        colorScheme: VariantsColors.button,
        outline: VariantsColors.buttonOutline,
        hoverColor: VariantsOptionsFactory.createHoverBackgroundColor<{ base: string }>((value, variantName) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {
        activeOpacity: 80
    }
});
export type IButtonVariant = VariantProps<typeof buttonVariant>;