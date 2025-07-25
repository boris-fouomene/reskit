import { tv, VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import "@resk/core/utils";
import { Platform } from "@platform";

const isWeb = Platform.isWeb();

export const textInputVariant = tv({
    slots: {
        input: "",
        container: "",
        leftContainer: "",
        rightContainer: "",
        contentContainer: "",
        focusedContentContainer: "",
        focusedLabelEmbeded: "",
        focusedInput: "",
        focusedLabel: "",
        focusedIcon: "",
        errorContentContainer: "",
        errorInput: "",
        errorLabel: "",
        errorIcon: "",
        errorLabelEmbeded: "",
        labelEmbeded: "self-center",
        icon: "",
        label: "self-start",
        placeholder: ""
    },
    variants: {
        ...VariantsOptionsFactory.createAll<{ contentContainer: string }>((value, colorName) => {
            return { contentContainer: value }
        }),
        colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.background, ITextInputSlots>(VariantsColors.background, (value, colorName) => {
            const textColor = VariantsColors.textForeground[`${colorName}-foreground`];
            return {
                contentContainer: value,
                labelEmbeded: textColor,
                input: textColor,
                icon: VariantsColors.iconForeground[`${colorName}-foreground`],
            }
        }),
        ...VariantsOptionsFactory.createIconVariants<ITextInputSlots, "icon">((value, colorName) => {
            return { icon: value }
        }, "icon"),
        ...VariantsOptionsFactory.createTextVariants<ITextInputSlots, "label">((value, colorName) => {
            return { label: value }
        }, "label"),
        ...VariantsOptionsFactory.createTextVariants<ITextInputSlots, "input">((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }, "input"),
        focusedColor: VariantsOptionsFactory.create<typeof VariantsColors.text, ITextInputSlots>(VariantsColors.text, (value, colorName) => {
            return {
                focusedLabel: value,
                focusedInput: value,
                focusedLabelEmbeded: value,
                focusedIcon: value.replaceAll("text-", "!text-")
            }
        }),
        errorColor: VariantsOptionsFactory.create<typeof VariantsColors.text, ITextInputSlots>(VariantsColors.text, (value, colorName) => {
            return {
                errorLabel: value,
                errorInput: value,
                errorLabelEmbeded: value,
                errorIcon: value.replaceAll("text-", "!text-")
            }
        }),
        focusedRingColor: VariantsOptionsFactory.create<typeof VariantsColors.ringColors, ITextInputSlots>(VariantsColors.ringColors, (value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorRingColor: VariantsOptionsFactory.create<typeof VariantsColors.ringColors, ITextInputSlots>(VariantsColors.ringColors, (value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedBorderWidth: VariantsOptionsFactory.createBorderWidth<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorBorderWidth: VariantsOptionsFactory.createBorderWidth<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedRingWidth: VariantsOptionsFactory.createRingWidth<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorRingWidth: VariantsOptionsFactory.createRingWidth<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedBorderColor: VariantsOptionsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorBorderColor: VariantsOptionsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        webFocusedShadow: VariantsOptionsFactory.createShadow<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: isWeb ? value : "",
            }
        }),
        webErrorShadow: VariantsOptionsFactory.createShadow<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: isWeb ? value : "",
            }
        }),
        focusedShadowColor: VariantsOptionsFactory.createShadowColor<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorShadowColor: VariantsOptionsFactory.createShadowColor<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: isWeb ? value : "",
            }
        }),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingX: "5px",
        iconSize: "20px",
        errorColor: "error",
        inputTextSize: "base",
        labelTextSize: "base",
        focusedColor: "primary",
    },
});

export type ITextInputVariant = VariantProps<typeof textInputVariant>;

type ITextInputSlots = {
    input?: string;
    container?: string;
    leftContainer?: string;
    rightContainer?: string;
    contentContainer?: string;
    icon?: string;
    label?: string;
    labelEmbeded?: string;
    placeholder?: string;
    focusedContentContainer?: string;
    focusedInput?: string;
    focusedLabel?: string;
    errorContentContainer?: string;
    errorInput?: string;
    errorLabel?: string;
}