import { tv, type VariantProps } from "tailwind-variants";
import surface from "./surface";
import text from "./text";
import ripple from "./ripple";
import iconButton from "./iconButton";
import heading from "./heading";
export const variants = {
    all: tv({
        base: "",
        variants: {
            disabled: {
                true: "pointers-events-none opacity-70 web:cursor-not-allowed",
            },
            readonly: {
                true: "pointer-events-none opacity-80 web:cursor-not-allowed",
            },
            hover: "hover:bg-gray-100 dark:hover:bg-gray-800",
            hidden: {
                true: "hidden opacity-0",
            }
        },
    }),
    icon: tv({
        base: "",
        variants: {
            color: {
                primary: "text-primary dark:text-dark-primary",
                secondary: "text-secondary dark:text-dark-secondary",
                accent: "text-accent dark:text-dark-accent",
                neutral: "text-neutral dark:text-dark-neutral",
                info: "text-info dark:text-dark-info",
                success: "text-success dark:text-dark-success",
                warning: "text-warning dark:text-dark-warning",
                error: "text-error dark:text-dark-error",
            },
        },
    }),
    heading,
    iconButton,
    surface,
    text,
    ripple,
}
export type IVariantPropsAll = VariantProps<typeof variants.all>;