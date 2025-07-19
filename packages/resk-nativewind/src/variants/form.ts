import { tv, VariantProps } from 'tailwind-variants';
import { VariantsOptionsFactory } from './variantsFactory';
export const formVariant = tv({
    slots: {
        base: "",
        field: "",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ base: string }>((value) => ({ base: value })),
        ...VariantsOptionsFactory.createAllWidth2Height<{ field: string }, "field">((value) => {
            return { field: value };
        }, "field"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ field: string }, "field">((value) => {
            return { field: value };
        }, "field"),
        ...VariantsOptionsFactory.createAllFlex<{ field: string }, "field">((value) => {
            return { field: value };
        }, "field"),
        ...VariantsOptionsFactory.createAllGaps<{ field: string }, "field">((value) => {
            return { field: value };
        }, "field"),
    },
    defaultVariants: {
        fieldMarginY: "10px",
        flexDirection: "row",
        gapX: 4,
        width: "full",
        "fieldLg:width": "third"
    }
});

export type IFormVariant = VariantProps<typeof formVariant>;