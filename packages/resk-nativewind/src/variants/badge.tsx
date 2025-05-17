import { tv, type VariantProps } from 'tailwind-variants';
import surface from "./surface";

const badge = tv({
    base: "inline-flex items-center rounded-md px-2 py-1 text-xs ring-inset",
    extend: surface,
    variants: {
        size: {
            xs: "text-xs",
            sm: "text-sm",
            md: "text-md",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-3xl",
            "4xl": "text-4xl",
            "5xl": "text-5xl",
            "6xl": "text-6xl",
            "7xl": "text-7xl",
            "8xl": "text-8xl",
            "9xl": "text-9xl",
        },
        rounded: {
            none: "rounded-none",
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            xl: "rounded-xl",
            "2xl": "rounded-2xl",
            "3xl": "rounded-3xl",
            full: "rounded-full",
        },
    },
});

export type IVariantPropsBadge = VariantProps<typeof badge>;

export default badge;