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
        ...VariantsOptionsFactory.createAllWidth2Height<{ item: string }, "item">((value) => {
            return {
                item: value,
            }
        }, "item"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ items: string }, "items">((value) => {
            return {
                items: value,
            }
        }, "items"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ item: string }, "item">((value) => {
            return {
                item: value,
            }
        }, "item"),
        background: VariantsOptionsFactory.createBackgroundColor((value, variantName) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {
        background: "surface",
        shadow: "lg",
        itemWidth: "full",
        itemsPadding: 2,
    }
})

export type IDrawerVariant = VariantProps<typeof drawerVariant>;