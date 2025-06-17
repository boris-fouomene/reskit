import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const modal = tv({
    slots: {
        backkdrop: "",
        container: "justify-center items-center flex flex-1 flex-col",
        content: "max-w-[80%] sm:max-w-[600px] min-h-[250px] max-h-[50%]",
    },
    variants: {
        background: VariantsFactory.create<typeof VariantsGeneratedColors.surface, { content: string, container: string }>(VariantsGeneratedColors.surface, (value) => {
            return {
                content: value,
                container: "",
            }
        }),
        responsive: {
            true: {
                container: "block md:flex",
                content: "max-w-full sm:max-w-full w-screen h-screen max-w-full max-h-full lg:max-h[50%] lg:max-w-[600%]",
            }
        },
        ...VariantsFactory.createAll<{ content: string, container: string }>((value) => {
            return {
                content: value,
                container: ""
            }
        }),
    },
    defaultVariants: {
        background: "surface",
        rounded: true,
        shadow:"md",
        shadowColor:"surface"
    }
});

export type IVariantPropsModal = VariantProps<typeof modal>;

export default modal;