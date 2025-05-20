import { tv, VariantProps } from "tailwind-variants";
const all = tv({
    base: "",
    variants: {
        disabled: {
            true: "pointers-events-none opacity-70 web:cursor-not-allowed",
        },
        readOnly: {
            true: "pointer-events-none opacity-80 web:cursor-not-allowed",
        },
        hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
        hidden: {
            true: "hidden opacity-0",
        }
    },
});
export default all;


export type IVariantPropsAll = VariantProps<typeof all>;