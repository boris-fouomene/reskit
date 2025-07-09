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
        bottomSheetTitleWeight: VariantsOptionsFactory.createTextWeight<IMenuVariantSlots>((value) => {
            return {
                bottomSheetTitle: value,
            }
        }),
        bottomSheetTitleSize: VariantsOptionsFactory.createTextSize<IMenuVariantSlots>((value) => {
            return {
                bottomSheetTitle: value,
            }
        }),
        bottomSheetTitleColor: VariantsOptionsFactory.createTextColor<IMenuVariantSlots>(value => {
            return {
                bottomSheetTitle: value,
            }
        }),
        bottomSheetTitleAlign: VariantsOptionsFactory.createTextAlign<IMenuVariantSlots>(value => {
            return {
                bottomSheetTitle: value,
            }
        }),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingBottom: 4,
        transitionDuration: 300,
        shadow: "xl",
        transitionEasing: "ease-out",
        bottomSheetTitleWeight: "bold"
    }
});

export type IMenuVariant = VariantProps<typeof menuVariant>;
