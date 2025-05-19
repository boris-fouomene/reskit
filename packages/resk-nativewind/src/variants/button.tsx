import { tv, VariantProps } from 'tailwind-variants';

const buton = tv({
    slots: {
        base: "ring",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "",
        label: "",
        ripple: "",
    },
    variants: {
        color: {
            primary: {
                base: "bg-primary dark:bg-dark-primary",
                content: "",
                leftContainer: "",
                rightContainer: "",
                icon: "",
                label: "text-primary-foreground bg-dark:text-dark-primary-foreground",
            },
            secondary: {
                base: "bg-secondary dark:bg-dark-secondary",
                label: "text-secondary-foreground dark:text-dark-secondary-foreground"
            },
            surface: {
                base: "bg-surface  dark:bg-dark-surface",
                label: "text-surface-foreground dark:text-dark-surface-foreground"
            },
            accent: {
                base: "bg-accent dark:bg-dark-accent",
                label: "text-accent-foreground  dark:text-dark-accent-foreground"
            },
            neutral: {
                base: "bg-neutral dark:bg-dark-neutral",
                label: "text-neutral-foreground dark:text-dark-neutral-foreground"
            },
            info: {
                base: "bg-info dark:bg-dark-info ",
                label: "text-info-foreground dark:text-dark-info-foreground"
            },
            success: {
                base: "bg-success dark:bg-dark-success",
                label: "text-success-foreground dark:text-dark-success-foreground"
            },
            warning: {
                base: "bg-warning  dark:bg-dark-warning",
                label: "text-warning-foreground dark:text-dark-warning-foreground"
            },
            error: {
                base: "bg-error dark:bg-dark-error",
                label: "text-error-foreground dark:text-dark-error-foreground"
            },
        },
        rounded: {
            none: {
                base: "rounded-none",
            },
            xs: {
                base: "rounded-sx",
            },
            sm: {
                base: "rounded-sm"
            },
            md: {
                base: "rounded-md",
            },
            lg: {
                base: "rounded-lg",
            },
            xl: {
                base: "rounded-xl"
            },
            "2xl": {
                base: "rounded-2xl",
            },
            "3xl": {
                base: "rounded-3xl"
            },
            full: {
                base: "rounded-full"
            },
        },
        padding: {
            xs: {
                base: "p-sx",
            },
            sm: {
                base: "p-sm"
            },
            md: {
                base: "p-md",
            },
            lg: {
                base: "p-lg",
            },
            xl: {
                base: "p-xl"
            },
            "2xl": {
                base: "p-2xl",
            },
            "3xl": {
                base: "p-3xl"
            },
            "4xl": {
                base: "p-4xl"
            }
        }
    }
});

export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;