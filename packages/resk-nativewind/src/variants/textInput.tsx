import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { borderWidthClasses } from "./variantsFactory/border";
import { ringWidthClasses } from "./variantsFactory/ring";
import "@resk/core/utils";
import { typedEntries } from "@resk/core/utils";

const textInput = tv({
    slots: {
        input: "",
        container: "",
        leftContainer: "",
        rightContainer: "",
        contentContainer: "",
        labelEmbeded: "",
        icon: "",
        label: "",
        placeholder: ""
    },
    variants: {
        ...VariantsFactory.createAll<{ contentContainer: string }>((value, colorName) => {
            return { contentContainer: value }
        }),
        background: VariantsFactory.create<typeof VariantsColors.background, ITextInputSlots>(VariantsColors.background, (value, colorName) => {
            const textColor = VariantsColors.textForeground[colorName];
            return {
                contentContainer: value,
                labelEmbeded: textColor,
                input: textColor,
                icon: VariantsColors.iconForeground[colorName],
            }
        }),
        ...VariantsFactory.createPaddingsVariants<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        ...VariantsFactory.createMarginsVariants<ITextInputSlots>((value, colorName) => {
            return { container: value }
        }),
        rounded: VariantsFactory.createRoundedVariants<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        iconSize: VariantsFactory.createIconSizes<ITextInputSlots>((value, colorName) => {
            return { icon: value }
        }),
        iconColor: VariantsFactory.create<typeof VariantsColors.icon, ITextInputSlots>(VariantsColors.icon, (value, colorName) => {
            return { icon: value }
        }),
        labelTextSize: VariantsFactory.createTextSizes<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputTextSize: VariantsFactory.createTextSizes<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        labelWeight: VariantsFactory.createFontWeightVariants<ITextInputSlots>((value, colorName) => {
            return { label: value, labelEmbeded: value }
        }),
        inputWeight: VariantsFactory.createFontWeightVariants<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        labelTextAlign: VariantsFactory.createTextAlignVariants<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputTextAlign: VariantsFactory.createTextAlignVariants<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        borderStyle: VariantsFactory.createBorderStyleVariants<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        borderColor: VariantsFactory.create<typeof VariantsColors.borderColor, ITextInputSlots>(VariantsColors.borderColor, (value, colorName) => {
            return { contentContainer: value }
        }),
        ...VariantsFactory.createAllBorderWidthVariants<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        focusedColor: {} as Record<keyof typeof VariantsColors.textWithForeground, ITextInputSlots>,
        focusedRingColor: {} as Record<keyof typeof VariantsColors.ringColors, ITextInputSlots>,
        focusedBorderWidth: {} as Record<keyof typeof borderWidthClasses, ITextInputSlots>,
        focusedRingWidth: {} as Record<keyof typeof ringWidthClasses, ITextInputSlots>,
        errorColor: {} as Record<keyof typeof VariantsColors.background, ITextInputSlots>,
        focusedBorderColor: {} as Record<keyof typeof VariantsColors.borderColor, ITextInputSlots>,
        focused: {
            true: {}
        },
        error: {
            true: {}
        }
    },
    compoundVariants: [
        ...typedEntries(VariantsColors.borderColor).map(([borderColor, value]) => {
            return {
                focused: true,
                focusedBorderColor: borderColor,
                class: {
                    contentContainer: value,
                }
            }
        }),
        ...typedEntries(borderWidthClasses).map(([borderWidth, value]) => {
            return {
                focused: true,
                focusedBorderWidth: borderWidth,
                class: {
                    contentContainer: value,
                }
            }
        }),
        ...typedEntries(VariantsColors.ringColors).map(([ringColor, value]) => {
            return {
                focused: true,
                focusedRingColor: ringColor,
                class: {
                    contentContainer: value,
                }
            }
        }),
        ...typedEntries(VariantsColors.textWithForeground).map(([textColor, value]) => {
            return {
                focused: true,
                focusedColor: textColor,
                class: {
                    labelEmbeded: value,
                    label: value,
                    input: value,
                    icon: value.replaceAll("text-", "!text-")
                }
            }
        }),
        // error color
        ...typedEntries(VariantsColors.background).map(([textColor, value]) => {
            return {
                error: true,
                errorColor: textColor,
                class: {
                    labelEmbeded: value,
                    label: value,
                    input: value,
                    icon: value.replaceAll("text-", "!text-")
                }
            }
        }),
        ...typedEntries(ringWidthClasses).map(([ringWidth, value]) => {
            return {
                focused: true,
                focusedRingWidth: ringWidth,
                class: {
                    contentContainer: value,
                }
            }
        })
    ],
    defaultVariants: {
        background: "surface",
        paddingX: "5px",
        iconSize: "20px",
        focusedRingColor: "primary",
        focusedRingWidth: 2,
        errorColor: "error",
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
}

export default textInput;