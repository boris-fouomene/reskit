import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";

type IMenuVariantSlots = {
    container?: string;
    portalBackdrop?: string;
    anchorContainer?: string;
    portal?: string;
    contentContainer?: string;
    items?: string;
    scrollView?: string;
    scrollViewContentContainer?: string;
}
const menu = tv({
    slots: {
        container: "",
        portalBackdrop: "",
        anchorContainer: "",
        portal: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
    },
    variants: {
        ...VariantsFactory.createAll<IMenuVariantSlots>((value) => {
            return {
                contentContainer: value,
            }
        }),
        visible: {
            true: {
                //container: "opacity-100",
            },
            false: {
                //container: "opacity-0",
            }
        },
        colorScheme: VariantsFactory.create<typeof VariantsColors.surface, IMenuVariantSlots>(VariantsColors.surface, (value) => {
            return {
                contentContainer: value,
            }
        }),
    },
    defaultVariants: {
        colorScheme: "surface",
        paddingBottom: "4",
        transitionDuration: 300,
        transitionEasing: "ease-out",
    }
});

export default menu;

export type IVariantPropsMenu = VariantProps<typeof menu>;
