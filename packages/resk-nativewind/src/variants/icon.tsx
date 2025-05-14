import { tv, type VariantProps } from "tailwind-variants"

const icon = tv({
    variants: {
        color: {
            primary: "text-primary dark:text-dark-primary",
            secondary: "text-secondary dark:text-dark-secondary",
            accent: "text-accent dark:text-dark-accent",
            success: "text-susccess dark:text-dark-success",
            error: "text-error dark:text-dark-error",
            warning: "text-warning dark-text-dark-warning",
            info: "text-info dark-text-dark-info"
        }
    }
});

export type IVariantPropsIcon = VariantProps<typeof icon>;

export default icon;