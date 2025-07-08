import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import "@resk/core/utils";
import Platform from "@platform";

const isWeb = Platform.isWeb();

const textInput = tv({
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
        ...VariantsFactory.createAll<{ contentContainer: string }>((value, colorName) => {
            return { contentContainer: value }
        }),
        colorScheme: VariantsFactory.create<typeof VariantsColors.background, ITextInputSlots>(VariantsColors.background, (value, colorName) => {
            const textColor = VariantsColors.textForeground[`${colorName}-foreground`];
            return {
                contentContainer: value,
                labelEmbeded: textColor,
                input: textColor,
                icon: VariantsColors.iconForeground[`${colorName}-foreground`],
            }
        }),
        ...VariantsFactory.createPaddings<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        ...VariantsFactory.createMargins<ITextInputSlots>((value, colorName) => {
            return { container: value }
        }),
        ...VariantsFactory.createBorders<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        rounded: VariantsFactory.createRounded<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        iconSize: VariantsFactory.createIconSize<ITextInputSlots>((value, colorName) => {
            return { icon: value }
        }),
        nativeIconSize: VariantsFactory.createNativeIconSize<ITextInputSlots>((value, colorName) => {
            return { icon: value }
        }),
        iconColor: VariantsFactory.create<typeof VariantsColors.icon, ITextInputSlots>(VariantsColors.icon, (value, colorName) => {
            return { icon: value }
        }),
        labelTextSize: VariantsFactory.createTextSize<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        nativeLabelTextSize: VariantsFactory.createNativeTextSize<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputTextSize: VariantsFactory.createTextSize<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        nativeInputTextSize: VariantsFactory.createNativeTextSize<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        labelWeight: VariantsFactory.createTextWeight<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputWeight: VariantsFactory.createTextWeight<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        labelTextAlign: VariantsFactory.createTextAlign<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputTextAlign: VariantsFactory.createTextAlign<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        borderStyle: VariantsFactory.createBorderStyle<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        borderColor: VariantsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return { contentContainer: value }
        }),
        focusedColor: VariantsFactory.create<typeof VariantsColors.text, ITextInputSlots>(VariantsColors.text, (value, colorName) => {
            return {
                focusedLabel: value,
                focusedInput: value,
                focusedLabelEmbeded: value,
                focusedIcon: value.replaceAll("text-", "!text-")
            }
        }),
        errorColor: VariantsFactory.create<typeof VariantsColors.text, ITextInputSlots>(VariantsColors.text, (value, colorName) => {
            return {
                errorLabel: value,
                errorInput: value,
                errorLabelEmbeded: value,
                errorIcon: value.replaceAll("text-", "!text-")
            }
        }),
        focusedRingColor: VariantsFactory.create<typeof VariantsColors.ringColors, ITextInputSlots>(VariantsColors.ringColors, (value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorRingColor: VariantsFactory.create<typeof VariantsColors.ringColors, ITextInputSlots>(VariantsColors.ringColors, (value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedBorderWidth: VariantsFactory.createBorderWidth<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorBorderWidth: VariantsFactory.createBorderWidth<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedRingWidth: VariantsFactory.createRingWidth<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorRingWidth: VariantsFactory.createRingWidth<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        focusedBorderColor: VariantsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorBorderColor: VariantsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return {
                errorContentContainer: value,
            }
        }),
        webFocusedShadow: VariantsFactory.createShadow<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: isWeb ? value : "",
            }
        }),
        webErrorShadow: VariantsFactory.createShadow<ITextInputSlots>((value, colorName) => {
            return {
                errorContentContainer: isWeb ? value : "",
            }
        }),
        focusedShadowColor: VariantsFactory.createShadowColor<ITextInputSlots>((value, colorName) => {
            return {
                focusedContentContainer: value,
            }
        }),
        errorShadowColor: VariantsFactory.createShadowColor<ITextInputSlots>((value, colorName) => {
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

export type IVariantPropsTextInput = VariantProps<typeof textInput>;

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

export default textInput;