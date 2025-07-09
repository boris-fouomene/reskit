import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsColors } from './colors/generated';
import { VariantsOptionsFactory } from './variantsFactory';

export const badgeVariant = tv({
    base: "inline-flex items-center rounded-md px-2 py-1 text-xs ring-inset",
    variants: {
        ...VariantsOptionsFactory.createAll(),
        ...VariantsOptionsFactory.createTextVariants(),
        colorScheme: VariantsColors.badge,
    },
    defaultVariants: {
        colorScheme: "surface",
        activeOpacity: 80,
    }
});

export type IBadgeVariant = VariantProps<typeof badgeVariant>;