import { tv, type VariantProps } from "tailwind-variants";
const switchVariants = tv({
    base: "",
    slots: {
        container: "",
        track: "",
        thumb: "",
        label: "",
    },
    variants: {
        color: {
            primary: {
                base: "",
                track: "bg-primary",
                thumb: "bg-primary",
                label: "text-primary-foreground",
            }
        }
    }
})
export default switchVariants;
export type IVariantPropsSwitch = VariantProps<typeof switchVariants>;