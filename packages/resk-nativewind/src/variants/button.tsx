import { tv, VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from './variantsFactory';

const buton = tv({
    slots: {
        base: "",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "mx-[5px]",
        activityIndicator: "",
        ripple: "",
        label: "",
    },
    variants: {
        color: VariantsGeneratedColors.button,
        outline: VariantsGeneratedColors.buttonOutline,
        border: VariantsFactory.createBorderVariants((value) => {
            return { base: value }
        }),
        rounded: VariantsFactory.createRoundedVariants<{ base: string }>((variantValue) => {
            return {
                base: variantValue
            }
        }),
        padding: VariantsFactory.createPaddingVariants<{ base: string }>((value) => {
            return { base: value }
        }),
        paddingX: VariantsFactory.createPaddingXVariants<{ base: string }>((value) => {
            return { base: value }
        }),
        paddingY: VariantsFactory.createPaddingYVariants<{ base: string }>((value) => {
            return { base: value }
        }),
        margin: VariantsFactory.createMarginVariants<{ base: string }>((value) => {
            return { base: value }
        }),
        marginX: VariantsFactory.createMarginXVariants<{ base: string }>((value) => {
            return { base: value }
        }),
        marginY: VariantsFactory.createMarginYVariants<{ base: string }>((value) => {
            return { base: value }
        })
    }
});
export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;