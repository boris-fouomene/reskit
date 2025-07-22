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
    navigation?: string;
    navigationContentContainer?: string;
    navigationItems?: string;
    navigationItem?: string;
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
        navigation: "resk-menu-navigation",
        navigationContentContainer: "resk-menu-navigation-content-container",
        navigationItems: "resk-menu-navigation-items",
        navigationItem: "resk-menu-navigation-item",
    },
    variants: {
        renderedAsNavigationMenu: {
            true: {
                navigation: `h-full`,
                navigationContentContainer: ``,
                navigationItems: ``,
                navigationItem: ``
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
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "navigationItems">((value) => {
            return {
                navigationItems: value,
            }
        }, "navigationItems"),

        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "item">((value) => {
            return {
                navigationItem: value,
            }
        }, "item"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "navigationItem">((value) => {
            return {
                navigationItem: value,
            }
        }, "navigationItem"),
        ...VariantsOptionsFactory.createAllBorders<IMenuVariantSlots, "navigationItem">((value) => {
            return {
                navigationItem: value,
            }
        }, "navigationItem"),
        ...VariantsOptionsFactory.createTextVariants<IMenuVariantSlots, "bottomSheetTitle">((value) => {
            return { bottomSheetTitle: value }
        }, "bottomSheetTitle"),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingBottom: 4,
        shadow: "xl",
        bottomSheetTitleWeight: "bold",
        navigationItemsPadding: 2,
        navigationItemPadding: 2,
    }
});

export type IMenuVariant = VariantProps<typeof menuVariant>;
