import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { classes } from "./classes";

type IMenuVariantSlots = {
    container?: string;
    modalBackdrop?: string;
    anchorContainer?: string;
    contentContainer?: string;
    items?: string;
    scrollView?: string;
    scrollViewContentContainer?: string;
}
const menu = tv({
    slots: {
        modalBackdrop: "",
        anchorContainer: "",
        base: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
    },
    variants: {
        withBackdrop: {
            true: {
                modalBackdrop: classes.backdrop,
            }
        },
        ...VariantsFactory.createAll<IMenuVariantSlots>((value) => {
            return {
                contentContainer: value,
            }
        }),
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
