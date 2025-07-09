import { tv, VariantProps } from "tailwind-variants";
import { classes } from "./classes";
export const commonVariant = tv({
    base: "",
    variants: {
        disabled: {
            true: classes.disabled,
        },
        readOnly: {
            true: classes.readOnly,
        },
        hidden: {
            true: classes.hidden,
        },
        backdrop: {
            true: classes.backdrop,
        }
    },
});


export type ICommonVariant = VariantProps<typeof commonVariant>;