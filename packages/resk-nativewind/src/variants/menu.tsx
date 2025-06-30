import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

const menu = tv({
    slots: {
        container: "duration-300 ease-out transition-opacity",
        anchorContainer: "",
        portal: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
    },
    variants: {
        animation: {
            scale: {},
        },
        visible: {
            true: {
                container: "animate-fade-in",
            },
            false: {
                container: "animate-fade-out",
            }
        },
        background: VariantsFactory.create<typeof VariantsGeneratedColors.surface, { container: string }>(VariantsGeneratedColors.surface, (value) => {
            return {
                container: value,
            }
        }),
        ...VariantsFactory.createAll<{ container: string }>((value) => {
            return {
                container: value,
            }
        })
    },
    compoundVariants: [
        {
            animation: "scale",
            visible: false,
            class: {
                container: "animate-scale-out",
            }
        },
        {
            animation: "scale",
            visible: true,
            class: {
                container: "animate-scale-in",
            }
        }
    ],
    defaultVariants: {
        background: "surface",
        paddingBottom: "4",
        shadow: "md",
        shadowColor: "surface",
    }
});

export default menu;

export type IVariantPropsMenu = VariantProps<typeof menu>;
