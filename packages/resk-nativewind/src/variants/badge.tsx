import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsColors } from './colors/generated';
import { VariantsFactory } from './variantsFactory';
import { surfaceVariant } from "./surface";

export const badgeVariant = tv({
    base: "inline-flex items-center rounded-md px-2 py-1 text-xs ring-inset",
    extend: surfaceVariant,
    variants: {
        ...VariantsFactory.createAll(),
        colorScheme: VariantsColors.badge,
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
    },
    defaultVariants: {
        colorScheme: "surface",
        activeOpacity: 80,
    }
});

export type IBadgeVariant = VariantProps<typeof badgeVariant>;