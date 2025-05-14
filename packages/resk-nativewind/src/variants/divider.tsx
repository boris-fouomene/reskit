import { tv, VariantProps } from "tailwind-variants";

const divider = tv({
    base: "bg-outline dark:bg-dark-outline w-full",
    variants: {
        color: {
            primary: "bg-primary dark:bg-primary-foreground",
            secondary: "bg-secondary dark:bg-secondary-foreground",
            tertiary: "bg-tertiary dark:bg-tertiary-foreground",
            info: "bg-info dark:bg-info-foreground",
            success: "bg-success dark:bg-success-foreground",
            warning: "bg-warning dark:bg-warning-foreground",
            error: "bg-error dark:bg-error-foreground",
        },
    }
});
export default divider;

export type IVariantPropsDivider = VariantProps<typeof divider>;