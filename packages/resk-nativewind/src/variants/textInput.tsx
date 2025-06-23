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
        routed: VariantsFactory.createRoundedVariants<ITextInputSlots>((value, colorName) => {
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
            return { input: value }
        }),
        labelWeight: VariantsFactory.createFontWeightVariants<ITextInputSlots>((value, colorName) => {
            return { label: value }
        }),
        inputWeight: VariantsFactory.createFontWeightVariants<ITextInputSlots>((value, colorName) => {
            return { input: value, labelEmbeded: value }
        }),
        focus: {
            true: {
                input: "text-primary",
                label: "text-primary",
                labelEmbeded: "text-primary",
                icon: "!text-primary",
            }
        },
        error: {
            true: {
                input: "text-error",
                label: "text-error",
                icon: "!text-error",
                labelEmbeded: "text-primary",
            }
        }
    },
    defaultVariants: {
        background: "surface",
        paddingX: "5px",
        iconSize: "25px"
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
}

export default textInput;