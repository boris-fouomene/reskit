import { tv, VariantProps } from 'tailwind-variants';

const buton = tv({
    slots: {
        base: "",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "",
        label: "",
        ripple: "",
    },
    variants: {
        color: {
            primary: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
            secondary: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
            danger: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
            warning: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
            success: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
            info: {
                base: "",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "",
            },
        }
    }
});

export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;