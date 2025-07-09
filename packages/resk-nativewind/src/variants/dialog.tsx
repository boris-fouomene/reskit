import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { classes } from "./classes";

const fullScreenContent = "flex-1 max-w-full min-h-full max-h-full w-full h-full sm:w-full items-start justify-start "

export const dialogVariant = tv({
    slots: {
        modalbackdrop: "",
        title: "",
        modal: "",
        action: "",
        appBar: "",
        subtitle: "",
        scrollView: "",
        scrollViewContentContainer: "",
        content: "flex flex-col flex-1 items-center justify-center max-w-[80%] sm:max-w-[600px] min-h-[250px] max-h-[50%]",
        contentFullScreen: fullScreenContent,
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
            return { contentFullScreen: value }
        }, "fullScreen"),
        fullScreen: {
            true: {
                content: fullScreenContent
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
    contentFullScreen?: string,
}