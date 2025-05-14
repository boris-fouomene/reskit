import { tv, VariantProps } from "tailwind-variants";

const surface = tv({
    base: "bg-surface dark:bg-dark-surface text-surface-foreground dark:text-dark-surface-foreground",
    variants: {
        color: {
            primary: "bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground",
            secondary: "bg-secondary text-secondary-foreground dark:bg-dark-secondary dark:text-dark-secondary-foreground",
        }
    }
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
