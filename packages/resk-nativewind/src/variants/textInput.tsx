import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsGeneratedColors } from "./generated-variants-colors";

const textInput = tv({
    slots: {
        input: "",
        container: "",
        leftContainer: "",
        rightContainer: "",
        contentContainer: "",
        labelEmbeded: "",
        icon: "",
        label: ""
    },
    variants: {
        background: VariantsFactory.create<typeof VariantsGeneratedColors.background, ITextInputSlots>(VariantsGeneratedColors.background, (value, colorName) => {
            const textColor = VariantsGeneratedColors.textForeground[colorName];
            return {
                contentContainer: value,
                labelEmbeded: textColor,
                input: textColor,
                icon: VariantsGeneratedColors.iconForeground[colorName],
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
        iconColor: VariantsFactory.create<typeof VariantsGeneratedColors.icon, ITextInputSlots>(VariantsGeneratedColors.icon, (value, colorName) => {
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
        borderColor: VariantsFactory.create<typeof VariantsGeneratedColors.borderColor, ITextInputSlots>(VariantsGeneratedColors.borderColor, (value, colorName) => {
            return { contentContainer: value }
        }),
        ...VariantsFactory.createAllBorderWidthVariants<ITextInputSlots>((value, colorName) => {
            return { contentContainer: value }
        }),
        focusedColor: VariantsFactory.create<typeof VariantsGeneratedColors.textWithForeground, ITextInputSlots>(VariantsGeneratedColors.textWithForeground, (value, colorName) => {
            return {}
        }),
        errorColor: VariantsFactory.create<typeof VariantsGeneratedColors.background, ITextInputSlots>(VariantsGeneratedColors.background, (value, colorName) => {
            return {}
        }),
        focusedBorderColor: VariantsFactory.create<typeof VariantsGeneratedColors.borderColor, ITextInputSlots>(VariantsGeneratedColors.borderColor, (value, colorName) => {
            return { contentContainer: "" }
        }),
        focused: {
            true: {}
        },
        error: {
            true: {}
        }
    },
    defaultVariants: {
        background: "surface",
        paddingX: "5px",
        iconSize: "20px",
        focusedColor: "primary",
        focusedBorderColor: "primary",
        errorColor: "error",
        marginY: "10px",
    },
    compoundVariants: [
        //focused border color
        ...Object.entries(VariantsGeneratedColors.borderColor).map(([borderColor, value]) => {
            return {
                focused: true,
                focusedBorderColor: borderColor,
                class: {
                    contentContainer: value,
                }
            }
        }) as Array<{}>,
        //focused color
        ...Object.entries(VariantsGeneratedColors.textWithForeground).map(([textColor, value]) => {
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
        }) as Array<{}>,
        // error color
        ...Object.entries(VariantsGeneratedColors.textWithForeground).map(([textColor, value]) => {
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
        }) as Array<{}>,
    ]
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
}

export default textInput;