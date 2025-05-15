import { tv, VariantProps } from "tailwind-variants";

const surface = tv({
    base: "bg-surface dark:bg-dark-surface text-surface-foreground dark:text-dark-surface-foreground",
    variants: {
        color: {
            primary: "bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground",
            secondary: "bg-secondary text-secondary-foreground dark:bg-dark-secondary dark:text-dark-secondary-foreground",
            surface: "bg-surface text-surface-foreground dark:bg-dark-surface dark:text-dark-surface-foreground",
            accent: "bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground",
            neutral: "bg-neutral text-neutral-foreground dark:bg-dark-neutral dark:text-dark-neutral-foreground",
            info: "bg-info text-info-foreground dark:bg-dark-info dark:text-dark-info-foreground",
            success: "bg-success text-success-foreground dark:bg-dark-success dark:text-dark-success-foreground",
            warning: "bg-warning text-warning-foreground dark:bg-dark-warning dark:text-dark-warning-foreground",
            error: "bg-error text-error-foreground dark:bg-dark-error dark:text-dark-error-foreground",
        },
    },
    defaultVariants: {
        color: "surface",
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
