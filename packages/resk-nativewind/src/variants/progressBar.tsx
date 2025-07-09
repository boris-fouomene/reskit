import { tv, VariantProps } from 'tailwind-variants';
import { VariantsOptionsFactory } from './variantsFactory';
import { VariantsColors } from './colors/generated';

export const progressBarVariant = tv({
    slots: {
        base: "",
        track: "",
        fillBar: "",
        text: "",
    },
    variants: {
        indeterminate: {
            true: {}
        },
        height: {
            0.5: {
                track: "h-0.5"
            },
            1: {
                track: "h-1"
            },
            1.5: {
                track: "h-1.5"
            },
            2: {
                track: "h-2"
            },
            2.5: {
                track: "h-2.5"
            },
            3: {
                track: "h-3"
            },
            3.5: {
                track: "h-3.5"
            },
            4: {
                track: "h-4"
            },
            4.5: {
                track: "h-4.5"
            },
            5: {
                track: "h-5"
            },
            5.5: {
                track: "h-5.5"
            },
            6: {
                track: "h-6"
            },
            6.5: {
                track: "h-6.5"
            },
            7: {
                track: "h-7"
            },
            7.5: {
                track: "h-7.5"
            },
            8: {
                track: "h-8"
            },
            8.5: {
                track: "h-8.5"
            },
            9: {
                track: "h-9"
            },
            9.5: {
                track: "h-9.5"
            },
            10: {
                track: "h-10"
            },
            10.5: {
                track: "h-10.5"
            },
            11: {
                track: "h-11"
            },
            11.5: {
                track: "h-11.5"
            },
            12: {
                track: "h-12"
            },
        },
        trackColor: VariantsOptionsFactory.create<typeof VariantsColors.background, { track: string }>(VariantsColors.background, (value, colorName) => {
            return {
                track: value,
            }
        }),
        fillColor: VariantsOptionsFactory.create<typeof VariantsColors.background, { fillBar: string }>(VariantsColors.background, (value, colorName) => {
            return {
                fillBar: value,
            }
        }),
        textColor: VariantsOptionsFactory.create<typeof VariantsColors.text, { text: string }>(VariantsColors.text, (value, colorName) => {
            return {
                text: value,
            }
        }),
        ...VariantsOptionsFactory.createAllRounded<{ track: string, fillBar: string }>((value) => {
            return {
                track: "",
                fillBar: value,
            }
        }),
        /***
         *  * Enable smooth animation transitions.
            * 
            * When enabled, the progress bar will smoothly animate when the value changes.
            * This is particularly useful for dynamic progress updates to provide better UX.
         */
        animated: {
            true: {
                track: "transition-all duration-300 ease-out"
            }
        }
    },
    defaultVariants: {
        height: 1.5,
        trackColor: "surface",
        fillColor: "primary",
    }
})

export type IProgressBarVariant = VariantProps<typeof progressBarVariant>;