import { tv, VariantProps } from "tailwind-variants";

const iconButton = tv({
    slots: {
        icon: "text-surface-foreground dark:text-dark-surface-foreground",
        iconContainer: "bg-surface dark:bg-dark-surface",
    },
    variants: {
        color: {
            primary: {
                iconContainer: "bg-primary dark:bg-dark-primary",
                icon: "text-primary-foreground dark:text-dark-primary-foreground"
            },
            secondary: {
                iconContainer: "bg-secondary dark:bg-dark-secondary",
                icon: "text-secondary-foreground dark:text-dark-secondary-foreground",
            },
            surface: {
                iconContainer: "bg-surface dark:bg-dark-surface",
                icon: "text-surface-foreground dark:text-dark-surface-foreground",
            },
            accent: {
                iconContainer: "bg-accent dark:bg-dark-accent",
                icon: "text-accent-foreground dark:text-dark-accent-foreground",
            },
            neutral: {
                iconContainer: "bg-neutral dark:bg-dark-neutral",
                icon: "text-neutral-foreground dark:text-dark-neutral-foreground",
            },
            info: {
                iconContainer: "bg-info dark:bg-dark-info",
                icon: "text-info-foreground dark:text-dark-info-foreground",
            },
            success: {
                iconContainer: "bg-success dark:bg-dark-success",
                icon: "text-success-foreground dark:text-dark-success-foreground",
            },
            warning: {
                iconContainer: "bg-warning dark:bg-dark-warning",
                icon: "text-warning-foreground dark:text-dark-warning-foreground",
            },
            error: {
                iconContainer: "bg-error dark:bg-dark-error",
                icon: "text-error-foreground dark:text-dark-error-foreground"
            }
        },
        rounded: {
            true: {
                iconContainer: "rounded-full",
            },
            false: {
                iconContainer: "rounded-none",
            }
        }
    },
    defaultVariants: {
        rounded: true,
    }
});

export default iconButton;

export type IVariantPropsIconButton = VariantProps<typeof iconButton>;
