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
        content: "flex flex-col",
        contentContainer: "absolute left-0 top-0 right-0 bottom-0 w-full h-full flex flex-1 flex-col overflow-hidden",
        fullScreenContent: fullScreen,
        modalTitle: "",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ content: string }>((value) => {
            return {
                content: value,
            }
        }),
        background: VariantsOptionsFactory.createBackgroundColor((value, variantName) => {
            return {
                content: value,
                fullScreenContent: value,
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
        ...VariantsOptionsFactory.createAllPadding2Margin<IDialogVariantSlot, "fullScreen">((value, colorName) => {
            return { fullScreenContent: value }
        }, "fullScreen"),
        ...VariantsOptionsFactory.createTextVariants<IDialogVariantSlot, "modalTitle">((value, colorName) => {
            return { modalTitle: value }
        }, "modalTitle"),
        ...VariantsOptionsFactory.createAllPadding2Margin<IDialogVariantSlot, "modalTitle">((value, colorName) => {
            return { modalTitle: value }
        }, "modalTitle"),
        fullScreen: {
            true: {
                content: fullScreen,
                contentContainer: fullScreen,
            },
            false: {
                content: "max-w-[80%] sm:max-w-[600px] min-h-[250px] max-h-[50%]",
                contentContainer: "items-center justify-center"
            }
        },
        withBackdrop: {
            true: {
                modalbackdrop: classes.backdrop
            }
        },
        colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.surface, { content: string }>(VariantsColors.surface, (value) => {
            return {
                content: value,
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
    }
});

export type IDialogVariant = VariantProps<typeof dialogVariant>;


type IDialogVariantSlot = {
    title?: string;
    subtitle?: string;
    content?: string;
    modalbackdrop?: string,
    modal?: string,
    action?: string,
    appBar?: string,
    scrollView?: string,
    scrollViewContentContainer?: string,
    fullScreenContent?: string,
    contentcontainerFullScreen?: string;
    contentContainer?: string,
    modalTitle?: string;
}