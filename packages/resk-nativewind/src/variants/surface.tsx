import { tv, VariantProps } from "tailwind-variants";

const surface = tv({
    base: "bg-surface dark:bg-dark-surface text-surface-foreground dark:text-dark-surface-foreground",
});

export default surface;

export type IVariantPropsSurface = VariantProps<typeof surface>;
