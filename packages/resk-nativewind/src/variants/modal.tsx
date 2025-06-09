import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const modal = tv({
    slots: {
        backkdrop: "",
        container: "justify-center align-center flex flex-1 flex-col",
        content: "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto",
    },
    variants: {
        background: VariantsFactory.create<typeof VariantsGeneratedColors.surface, { content: string, container: string }>(VariantsGeneratedColors.surface, (value) => {
            return {
                content: value,
                container: "",
            }
        }),
        border: VariantsFactory.createBorderVariants((value) => {
            return { content: value }
        }),
        rounded: VariantsFactory.createRoundedVariants<{ content: string }>((variantValue) => {
            return {
                content: variantValue
            }
        }),
        padding: VariantsFactory.createPaddingVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        paddingX: VariantsFactory.createPaddingXVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        paddingY: VariantsFactory.createPaddingYVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        margin: VariantsFactory.createMarginVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        marginX: VariantsFactory.createMarginXVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        marginY: VariantsFactory.createMarginYVariants<{ content: string }>((value) => {
            return { content: value }
        }),
        responsive: {
            true: {
                container: "block",
                content: "md:w-full md:max-w-md sm:w-full sm:max-w-sm",
            }
        }
    },
    defaultVariants: {
        background: "surface",
        rounded: true,
    }
});

export type IVariantPropsModal = VariantProps<typeof modal>;

export default modal;