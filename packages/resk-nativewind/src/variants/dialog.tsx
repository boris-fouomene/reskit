import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsOptionsFactory } from "./variantsFactory";
import { classes } from "./classes";

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
        content: "flex flex-col flex-1 max-w-[80%] sm:max-w-[600px] min-h-[250px] max-h-[50%]",
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ content: string }>((value) => {
            return {
                content: value,
            }
        }),
        fullScreen: {
            true: {
                content: "flex-1 max-w-full min-h-full max-h-full w-full h-full sm:w-full"
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
    }
});

export type IDialogVariant = VariantProps<typeof dialogVariant>;