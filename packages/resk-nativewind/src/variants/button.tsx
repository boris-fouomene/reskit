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
        ...VariantsOptionsFactory.createActivityIndicatorVariants<{ activityIndicator: string }, "activityIndicator">((value) => {
            return { activityIndicator: value }
        }, "activityIndicator"),
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
        ...VariantsOptionsFactory.createAllPadding2Margin<{ label: string }, "label">((value) => {
            return { label: value }
        }, "label"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ icon: string }, "icon">((value) => {
            return { icon: value }
        }, "icon"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ leftContainer: string }, "leftContainer">((value) => {
            return { leftContainer: value }
        }, "leftContainer"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ rightContainer: string }, "rightContainer">((value) => {
            return { rightContainer: value }
        }, "rightContainer"),
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