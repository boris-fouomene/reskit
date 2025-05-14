import { tv, type VariantProps } from "tailwind-variants";
const ripple = tv({
    base: "",
    variants: {
        disabled: {
            true: ""
        }
    },
    defaultVariants: {

    },
    compoundVariants: [
        {
            disabled: true,
            class: "",
        }
    ]
});

export default ripple;

export type IVariantPropsRipple = VariantProps<typeof ripple>;