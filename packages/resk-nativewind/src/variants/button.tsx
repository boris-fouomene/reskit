import { tv, VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from "./generated-variants-colors";

const buton = tv({
    slots: {
        base: "",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "",
        label: "",
    },
    variants: {
        color: VariantsGeneratedColors.button,
        rounded: {
            none: {
                base: "rounded-none",
            },
            xs: {
                base: "rounded-sx",
            },
            sm: {
                base: "rounded-sm"
            },
            md: {
                base: "rounded-md",
            },
            lg: {
                base: "rounded-lg",
            },
            xl: {
                base: "rounded-xl"
            },
            "2xl": {
                base: "rounded-2xl",
            },
            "3xl": {
                base: "rounded-3xl"
            },
            full: {
                base: "rounded-full"
            },
        },
        padding: {
            xs: {
                base: "p-sx",
            },
            sm: {
                base: "p-sm"
            },
            md: {
                base: "p-md",
            },
            lg: {
                base: "p-lg",
            },
            xl: {
                base: "p-xl"
            },
            "2xl": {
                base: "p-2xl",
            },
            "3xl": {
                base: "p-3xl"
            },
            "4xl": {
                base: "p-4xl"
            }
        }
    }
});

export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;