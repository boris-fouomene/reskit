import { tv, type VariantProps } from "tailwind-variants";
import surface from "./surface";
import text from "./text";
import ripple from "./ripple";
import iconButton from "./iconButton";
import heading from "./heading";
import divider from "./divider";
import icon from "./icon";
import badge from "./badge";
import switchVariants from "./switch";
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
    icon,
    heading,
    iconButton,
    switch: switchVariants,
    surface,
    badge,
    text,
    ripple,
    divider,
}
export type IVariantPropsAll = VariantProps<typeof variants.all>;