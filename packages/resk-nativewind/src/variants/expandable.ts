import { tv, type VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";

export const expandableVariant = tv({
    slots: {
        base: "",
        content: "",
        icon: "",
        label: "",
        headerContainer: "",
        header: ""
    },
    variants: {
        ...VariantsOptionsFactory.createAll<IExpandableVariantSlot>((value) => {
            return { base: value }
        }),
        ...VariantsOptionsFactory.createAllFlex<IExpandableVariantSlot, "header">((value) => {
            return { header: value };
        }, "header"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IExpandableVariantSlot, "header">((value) => {
            return { header: value };
        }, "header"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IExpandableVariantSlot, "content">((value) => {
            return { content: value };
        }, "content"),
    },
    defaultVariants: {
        contentPaddingX: "20px"
    }
});


export type IExpandableVariant = VariantProps<typeof expandableVariant>;

type IExpandableVariantSlot = {
    base?: string;
    content?: string;
    icon?: string;
    label?: string;
    header?: string;
    headerContainer?: string;
}