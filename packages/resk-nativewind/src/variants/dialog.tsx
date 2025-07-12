import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { classes } from "./classes";

const fullScreen = "flex-1 flex flex-col max-w-full min-h-full max-h-full w-full h-full sm:w-full items-start justify-start "

export const dialogVariant = tv({
    slots: {
        modalbackdrop: "",
        title: "",
        modal: "",
        action: "",
        appBar: "",
        subtitle: "",
        scrollView: "flex-1 grow",
        scrollViewContentContainer: "",
        fullScreen: fullScreen,
        base: "flex flex-col",
        container: "absolute left-0 top-0 right-0 bottom-0 w-full h-full flex flex-1 flex-col overflow-hidden",
        modalTitle: "",
    },
    variants: {
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
        ...VariantsOptionsFactory.createTextVariants<IDialogVariantSlot, "title">((value, colorName) => {
            return { title: value }
        }, "title"),
        ...VariantsOptionsFactory.createTextVariants<IDialogVariantSlot, "subtitle">((value, colorName) => {
            return { subtitle: value }
        }, "subtitle"),
        ...VariantsOptionsFactory.createTextVariants<IDialogVariantSlot, "action">((value, colorName) => {
            return { action: value }
        }, "action"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IDialogVariantSlot, "appBar">((value, colorName) => {
            return { title: value }
        }, "appBar"),
        ...VariantsOptionsFactory.createAllOpacity<IDialogVariantSlot, "title">((value, colorName) => {
            return { title: value }
        }, "title"),
        ...VariantsOptionsFactory.createAllOpacity<IDialogVariantSlot, "subtitle">((value, colorName) => {
            return { subtitle: value }
        }, "subtitle"),
        ...VariantsOptionsFactory.createTextVariants<IDialogVariantSlot, "modalTitle">((value, colorName) => {
            return { modalTitle: value }
        }, "modalTitle"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IDialogVariantSlot, "modalTitle">((value, colorName) => {
            return { modalTitle: value }
        }, "modalTitle"),
        fullScreen: {
            true: {
                base: fullScreen,
                container: fullScreen,
                fullScreen: fullScreen,
            },
            false: {
                base: "max-w-[80%] sm:max-w-[600px]",
                container: "items-center justify-center",
            }
        },
        withBackdrop: {
            true: {
                modalbackdrop: classes.backdrop
            }
        },
        colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.surface, { base: string }>(VariantsColors.surface, (value) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {
        withBackdrop: true,
        background: "surface",
        shadow: "lg",
        modalTitleWeight: "bold",
        modalTitleSize: "lg",
        modalTitleMargin: 4,
        minHeight: "twoFifths",
        maxHeight: "half",
    }
});

export type IDialogVariant = VariantProps<typeof dialogVariant>;


type IDialogVariantSlot = {
    title?: string;
    subtitle?: string;
    base?: string;
    modalbackdrop?: string,
    modal?: string,
    action?: string,
    appBar?: string,
    scrollView?: string,
    scrollViewContentContainer?: string,
    container?: string,
    modalTitle?: string;
}