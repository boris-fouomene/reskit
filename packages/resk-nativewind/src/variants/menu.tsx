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
    nav?: string;
    navContentContainer?: string;
    navItems?: string;
    navItem?: string;
    navModalBackdrop?: string;
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
        navModalBackdrop: "resk-nav-menu-modal-backdrop",
        nav: "resk-menu-nav",
        navContentContainer: "resk-menu-nav-content-container",
        navItems: "resk-menu-nav-items",
        navItem: "resk-menu-nav-item",
    },
    variants: {
        renderedAsNavigationMenu: {
            true: {
                nav: `h-full`,
                navContentContainer: ``,
                navItems: ``,
                navItem: ``
            }
        },
        navWithBackdrop: {
            true: {
                navModalBackdrop: classes.backdrop,
            },
            false: {}
        },
        withBackdrop: {
            true: {
                modalBackdrop: classes.backdrop,
            },
            false: {}
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
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "navItems">((value) => {
            return {
                navItems: value,
            }
        }, "navItems"),

        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "item">((value) => {
            return {
                item: value,
            }
        }, "item"),
        ...VariantsOptionsFactory.createAllBorders<IMenuVariantSlots, "item">((value) => {
            return {
                navItem: value,
            }
        }, "item"),
        ...VariantsOptionsFactory.createAllRounded<IMenuVariantSlots, "item">((value) => {
            return { item: value }
        }, "item"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IMenuVariantSlots, "navItem">((value) => {
            return {
                navItem: value,
            }
        }, "navItem"),
        ...VariantsOptionsFactory.createAllBorders<IMenuVariantSlots, "navItem">((value) => {
            return {
                navItem: value,
            }
        }, "navItem"),
        ...VariantsOptionsFactory.createAllRounded<IMenuVariantSlots, "navItem">((value) => {
            return { item: value }
        }, "navItem"),
        ...VariantsOptionsFactory.createTextVariants<IMenuVariantSlots, "bottomSheetTitle">((value) => {
            return { bottomSheetTitle: value }
        }, "bottomSheetTitle"),
        ...VariantsOptionsFactory.createAllShadow<IMenuVariantSlots, "item">((value) => {
            return { item: value }
        }, "item"),
        itemShadowColor: VariantsOptionsFactory.createShadowColor<IMenuVariantSlots>((value) => {
            return { item: value }
        }),
        ...VariantsOptionsFactory.createAllShadow<IMenuVariantSlots, "navItem">((value) => {
            return { navItem: value }
        }, "navItem"),
        ...VariantsOptionsFactory.createAllOutline<IMenuVariantSlots, "item">((value) => {
            return { item: value }
        }, "item"),
        ...VariantsOptionsFactory.createAllOutline<IMenuVariantSlots, "navItem">((value) => {
            return { navItem: value }
        }, "navItem"),
        ...VariantsOptionsFactory.createAllOpacity<IMenuVariantSlots, "item">((value) => {
            return { item: value }
        }, "item"),
        ...VariantsOptionsFactory.createAllOpacity<IMenuVariantSlots, "navItem">((value) => {
            return { navItem: value }
        }, "navItem"),
        navItemShadowColor: VariantsOptionsFactory.createShadowColor<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
        itemRingWidth: VariantsOptionsFactory.createRingWidth<IMenuVariantSlots>((value) => {
            return { item: value }
        }),
        navItemRingWidth: VariantsOptionsFactory.createRingWidth<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
        itemHoverRingWidth: VariantsOptionsFactory.createHoverRingWidth<IMenuVariantSlots>((value) => {
            return { item: value }
        }),
        navItemHoverRingWidth: VariantsOptionsFactory.createHoverRingWidth<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
        itemBackground: VariantsOptionsFactory.createBackgroundColor<IMenuVariantSlots>((value) => {
            return { item: value }
        }),
        navItemBackground: VariantsOptionsFactory.createBackgroundColor<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
        itemHoverBackground: VariantsOptionsFactory.createHoverBackgroundColor<IMenuVariantSlots>((value) => {
            return {
                item: value,
            }
        }),
        itemActiveColor: VariantsOptionsFactory.createActiveBackgroundColor<IMenuVariantSlots>((value) => {
            return { item: value }
        }),
        navItemHoverBackground: VariantsOptionsFactory.createHoverBackgroundColor<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
        navItemActiveColor: VariantsOptionsFactory.createActiveBackgroundColor<IMenuVariantSlots>((value) => {
            return { navItem: value }
        }),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingBottom: 4,
        shadow: "xl",
        bottomSheetTitleWeight: "bold",
        navItemsPadding: 2,
        navItemPadding: 2,
        navWithBackdrop: true,
    }
});

export type IMenuVariant = VariantProps<typeof menuVariant>;
