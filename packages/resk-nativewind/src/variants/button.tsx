import { tv, VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from "./generated-variants-colors";
import activityIndicator from './activityIndicator';

const buton = tv({
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
        color: VariantsGeneratedColors.button,
        outline: VariantsGeneratedColors.buttonOutline,
        border: {
            none: {
                base: "border-none"
            },
            solid: {
                base: "border-solid"
            },
            dashed: {
                base: "border-dashed"
            },
            dotted: {
                base: "border-dotted"
            },
            double: {
                base: "border-double"
            },
        },
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
            "5px": {
                base: "p-[5px]",
            },
            "10px": {
                base: "p-[10px]",
            },
            "15px": {
                base: "p-[15px]",
            },
            "20px": {
                base: "p-[20px]",
            },
            "25px": {
                base: "p-[25px]",
            },
            "30px": {
                base: "p-[30px]",
            },
            "35px": {
                base: "p-[35px]",
            },
            "40px": {
                base: "p-[40px]",
            },
            "45px": {
                base: "p-[45px]",
            },
            "50px": {
                base: "p-[50px]",
            },
            "55px": {
                base: "p-[55px]",
            },
            "60px": {
                base: "p-[60px]",
            },
            "65px": {
                base: "p-[65px]",
            },
            "70px": {
                base: "p-[70px]",
            },
            "75px": {
                base: "p-[75px]",
            },
            "80px": {
                base: "p-[80px]",
            },
            "85px": {
                base: "p-[85px]",
            },
            "90px": {
                base: "p-[90px]",
            },
            "95px": {
                base: "p-[95px]",
            },
            "100px": {
                base: "p-[100px]",
            },
        },
        margin: {
            "5px": {
                base: "m-[5px]",
            },
            "10px": {
                base: "m-[10px]",
            },
            "15px": {
                base: "m-[15px]",
            },
            "20px": {
                base: "m-[20px]",
            },
            "25px": {
                base: "m-[25px]",
            },
            "30px": {
                base: "m-[30px]",
            },
            "35px": {
                base: "m-[35px]",
            },
            "40px": {
                base: "m-[40px]",
            },
            "45px": {
                base: "m-[45px]",
            },
            "50px": {
                base: "m-[50px]",
            },
            "55px": {
                base: "m-[55px]",
            },
            "60px": {
                base: "m-[60px]",
            },
            "65px": {
                base: "m-[65px]",
            },
            "70px": {
                base: "m-[70px]",
            },
            "75px": {
                base: "m-[75px]",
            },
            "80px": {
                base: "m-[80px]",
            },
            "85px": {
                base: "m-[85px]",
            },
            "90px": {
                base: "m-[90px]",
            },
            "95px": {
                base: "m-[95px]",
            },
            "100px": {
                base: "m-[100px]",
            },
        }
    }
});

export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;