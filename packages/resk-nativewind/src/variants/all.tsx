import { tv, VariantProps } from "tailwind-variants";
import { classes } from "./classes";
const all = tv({
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
export default all;


export type IVariantPropsAll = VariantProps<typeof all>;