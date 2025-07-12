import { tv, type VariantProps } from 'tailwind-variants';

export const drawerVariant = tv({
    slots: {},
    variants: {},
    defaultVariants: {}
})

export type IDrawerVariant = VariantProps<typeof drawerVariant>;