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
    item?: string;
    scrollView?: string;
    scrollViewContentContainer?: string;
    bottomSheetTitle?: string;
    navigationMenu?: string;
    navigationMenuContentContainer?: string;
    navigationMenuItems?: string;
    navigationMenuItem?: string;
}
export const menuVariant = tv({
    slots: {
        modalBackdrop: "",
        anchorContainer: "",
        base: "",
        contentContainer: "",
        items: "",
        item: "",
        scrollView: "",
        scrollViewContentContainer: "",
        bottomSheetTitle: "",
        navigationMenu: "resk-menu-navigation",
        navigationMenuContentContainer: "resk-menu-navigation-content-container",
        navigationMenuItems: "resk-menu-navigation-items",
        navigationMenuItem: "resk-menu-navigation-item",
    },
    variants: {
        renderedAsNavigationMenu: {
            true: {

            }
        },
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
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "items">((value) => {
            return {
                items: value,
            }
        }, "items"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "item">((value) => {
            return {
                item: value,
            }
        }, "item"),
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
