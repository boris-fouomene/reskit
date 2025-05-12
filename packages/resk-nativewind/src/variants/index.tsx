import { tv, type VariantProps } from "tailwind-variants";

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
        },
        compoundVariants: []
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
            /* size: {
                "sm": "web:!text-sm",
                "md": "web:!text-md",
                "lg": "web:!text-lg",
                "xl": "web:!text-xl",
                "2xl": "web:!text-2xl",
                "3xl": "web:!text-3xl",
                "4xl": "web:!text-4xl",
                "5xl": "web:!text-5xl",
                "6xl": "web:!text-6xl",
            } */
        },
    })
}
export type IVariantPropsAll = VariantProps<typeof variants.all>;
export type IVariantPropsIcon = Omit<VariantProps<typeof variants.icon>, "size"> & {
    size?: number;//| VariantProps<typeof variants.icon>["size"];
};