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
        hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
        hidden: {
            true: classes.hidden,
        },
        backdrop: {
            true: "bg-backdrop flex flex-1 flex-col h-full w-full dark:bg-dark-backdrop opacity-75",
        }
    },
});
export default all;


export type IVariantPropsAll = VariantProps<typeof all>;