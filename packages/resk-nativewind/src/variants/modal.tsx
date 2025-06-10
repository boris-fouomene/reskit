import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const modal = tv({
    slots: {
        backkdrop: "",
        container: "justify-center items-center flex flex-1 flex-col",
        content: "max-w-[40%] lg:max-w-[30%] 2xs:max-w-[20%] m-auto",
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
                content: "w-screen h-screen max-w-full lg:max-w-[30%]",
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