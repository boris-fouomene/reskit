import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const modal = tv({
    slots: {
        backkdrop: "",
        container: "justify-center align-center flex flex-1 flex-col",
        content: "md:max-w-md sm:max-w-sm",
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
                container: "md:block sm:block",
                content: "md:w-screen md:h-screen md:max-w-full md:max-h-full sm:w-screen sm:h-screen sm:max-w-full sm:max-h-full",
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
    }
});

export type IVariantPropsModal = VariantProps<typeof modal>;

export default modal;