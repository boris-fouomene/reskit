import { tv, VariantProps } from "tailwind-variants";

const text = tv({
    base: "",
    variants: {
        color: {
            normal: "",
            primary: "text-primary dark:text-dark-primary",
            secondary: "text-secondary dark:text-dark-secondary",
            accent: "text-accent dark:text-dark-accent",
            neutral: "text-neutral dark:text-dark-neutral",
            info: "text-info dark:text-dark-info",
            success: "text-success dark:text-dark-success",
            warning: "text-warning dark:text-dark-warning",
            error: "text-error dark:text-dark-error",
            surface: "text-surface dark:text-dark-surface",
        },
        error: {
            true: "text-error dark:text-dark-error",
        }
    },
    compoundVariants: [
        {
            color: "error",
            error: true,
        },
        {
            color: "warning",
            warning: true,
        }
    ]
});

export default text;

export type IVariantPropsText = Omit<VariantProps<typeof text>, "color"> & {
    color?: VariantProps<typeof text>["color"] | string;
};
