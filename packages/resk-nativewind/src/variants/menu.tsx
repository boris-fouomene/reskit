import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

const menu = tv({
    slots: {
        container: "transition-opacity transform",
        anchorContainer: "",
        portal: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
    },
    variants: {
        animation: {
            scale: {}
        },
        visible: {
            true: {
                container: "opacity-100",
            },
            false: {
                container: "opacity-0",
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
        }),
        ...VariantsFactory.createTransitionsVariants<{ container: string }>((value) => {
            return { container: value };
        }),
        transitionEasing: VariantsFactory.createTransitionEasing<{ container: string }>((value) => {
            return { container: value };
        }),
    },
    compoundVariants: [
        { animation: "scale", visible: false, class: { container: "scale-75 opacity-0" } },
        { animation: "scale", visible: true, class: { container: "scale-100 opacity-100" } },
    ],
    defaultVariants: {
        background: "surface",
        paddingBottom: "4",
        shadow: "md",
        shadowColor: "surface",
        transitionDuration: 300,
        transitionEasing: "ease-in-out",
    }
});

export default menu;

export type IVariantPropsMenu = VariantProps<typeof menu>;
