import { tv, VariantProps } from 'tailwind-variants';
import { VariantsOptionsFactory } from './variantsFactory';
export const formVariant = tv({
    slots: {
        base: "",
        fieldContainer: "",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ base: string }>((value) => ({ base: value })),
        ...VariantsOptionsFactory.createAllWidth2Height<{ fieldContainer: string }, "fieldContainer">((value) => {
            return { fieldContainer: value };
        }, "fieldContainer"),
        ...VariantsOptionsFactory.createAllPadding2Margin<{ fieldContainer: string }, "fieldContainer">((value) => {
            return { fieldContainer: value };
        }, "fieldContainer"),
        ...VariantsOptionsFactory.createAllFlex<{ fieldContainer: string }, "fieldContainer">((value) => {
            return { fieldContainer: value };
        }, "fieldContainer"),
        ...VariantsOptionsFactory.createAllGaps<{ fieldContainer: string }, "fieldContainer">((value) => {
            return { fieldContainer: value };
        }, "fieldContainer"),
    },
    defaultVariants: {
        flexDirection: "row",
        gapX: 2,
        gapY: 2,
        width: "full",
        "fieldContainer:lg:width": "third",
    }
});

export type IFormVariant = VariantProps<typeof formVariant>;