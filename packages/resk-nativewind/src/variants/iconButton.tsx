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

            }
        }
    }
});

export default iconButton;

export type IVariantPropsIconButton = VariantProps<typeof iconButton>;
