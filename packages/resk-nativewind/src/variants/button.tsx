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
        activityIndicatorColor: VariantsOptionsFactory.create<typeof VariantsColors.activityIndicator, { activityIndicator: string }>(VariantsColors.activityIndicator, (value, colorName) => {
            return {
                activityIndicator: value,
            }
        }),
        ...VariantsOptionsFactory.createIconVariants<{ icon: string }, "icon">((value) => {
            return {
                icon: value,
            }
        }, "icon"),
        ...VariantsOptionsFactory.createTextVariants<{ label: string }, "label">((value) => {
            return {
                label: value,
            }
        }, "label"),
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