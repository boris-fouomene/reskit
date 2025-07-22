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
        rippleColor: VariantsOptionsFactory.createTextColor<{ ripple: string }>((value, variantName) => {
            return {
                ripple: value.replaceAll("text-", "bg-"),
            }
        }),
        /**
         * Controls whether the ripple effect is contained within the element boundaries.
         * 
         * When `true`, adds `overflow-hidden` to clip the ripple effect within the element's bounds.
         * This is typically used for buttons, cards, and other UI elements with defined shapes.
         * 
         * When `false`, allows the ripple effect to extend beyond the element boundaries.
         * This is useful for icon buttons or when you want a more organic ripple effect.
         * 
         * @default true
         * @example
         * ```tsx
         * // Contained ripple (default) - good for buttons with rounded corners
         * <Button rippleContained={true}>Click me</Button>
         * 
         * // Borderless ripple - good for icon buttons
         * <Button rippleContained={false}>
         *   <Icon name="heart" />
         * </Button>
         * ```
         */
        rippleContained: {
            true: {
                base: "overflow-hidden",
            },
            false: {

            }
        },
        colorScheme: VariantsColors.button,
        outline: VariantsColors.buttonOutline,
        hoverBackgroundColor: VariantsOptionsFactory.createHoverBackgroundColor<{ base: string }>((value, variantName) => {
            return {
                base: value,
            }
        }),
        activeBackgroundColor: VariantsOptionsFactory.createActiveBackgroundColor<{ base: string }>((value, variantName) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {
        activeOpacity: 80,
        rippleContained: true
    }
});
export type IButtonVariant = VariantProps<typeof buttonVariant>;