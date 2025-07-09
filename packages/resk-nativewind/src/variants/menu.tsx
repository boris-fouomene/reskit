import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { classes } from "./classes";

type IMenuVariantSlots = {
    container?: string;
    modalBackdrop?: string;
    anchorContainer?: string;
    contentContainer?: string;
    items?: string;
    scrollView?: string;
    scrollViewContentContainer?: string;
    bottomSheetTitle?: string;
}
export const menuVariant = tv({
    slots: {
        modalBackdrop: "",
        anchorContainer: "",
        base: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
        bottomSheetTitle: "",
    },
    variants: {
        withBackdrop: {
            true: {
                modalBackdrop: classes.backdrop,
            }
        },
        ...VariantsOptionsFactory.createAll<IMenuVariantSlots>((value) => {
            return {
                contentContainer: value,
            }
        }),
        colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.surface, IMenuVariantSlots>(VariantsColors.surface, (value) => {
            return {
                contentContainer: value,
            }
        }),
        ...VariantsOptionsFactory.createTextVariants<IMenuVariantSlots, "bottomSheetTitle">((value) => {
            return { bottomSheetTitle: value }
        }, "bottomSheetTitle"),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingBottom: 4,
        shadow: "xl",
        bottomSheetTitleWeight: "bold"
    }
});

export type IMenuVariant = VariantProps<typeof menuVariant>;
