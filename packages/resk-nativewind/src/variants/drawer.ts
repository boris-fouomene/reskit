import { tv, type VariantProps } from 'tailwind-variants';
import { VariantsOptionsFactory } from './variantsFactory';

export const drawerVariant = tv({
    slots: {
        base: "",
        permanent: "",
        tempBackdrop: "",
        container: "",
        backdrop: "",
        items: "",
        item: "",
    },
    variants: {
        permanent: {
            true: {

            },
            false: {

            }
        },
        ...VariantsOptionsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        }),
        background: VariantsOptionsFactory.createBackgroundColor((value, variantName) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {
        background: "surface",
        shadow: "lg",
    }
})

export type IDrawerVariant = VariantProps<typeof drawerVariant>;