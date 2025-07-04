import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
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
        ...VariantsFactory.createAll<{ container: string }>((value) => {
            return {
                container: value,
            }
        }),
        visible: {
            true: {
                container: "opacity-100",
            },
            false: {
                container: "opacity-0",
            }
        },
        colorScheme: VariantsFactory.create<typeof VariantsColors.surface, { container: string }>(VariantsColors.surface, (value) => {
            return {
                container: value,
                contentContainer: value,
            }
        }),
        ...VariantsFactory.createTransitions<{ container: string }>((value) => {
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
        colorScheme: "surface",
        paddingBottom: "4",
        shadow: "md",
        shadowColor: "surface",
        transitionDuration: 300,
        transitionEasing: "ease-in-out",
    }
});

export default menu;

export type IVariantPropsMenu = VariantProps<typeof menu>;
