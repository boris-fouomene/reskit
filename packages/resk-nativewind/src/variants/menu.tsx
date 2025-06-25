import { tv, VariantProps } from "tailwind-variants";
import { VariantsGeneratedColors } from "./generated-variants-colors";
import { VariantsFactory } from "./variantsFactory";

const menu = tv({
    slots: {
        base: "",
        anchorContainer: "",
        portal: "",
        contentContainer: "",
        items: "",
        scrollView: "",
        scrollViewContentContainer: "",
    },
    variants: {
        background: VariantsFactory.create<typeof VariantsGeneratedColors.surface, { base: string }>(VariantsGeneratedColors.surface, (value) => {
            return {
                base: value,
            }
        }),
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        })
    },
    defaultVariants: {
        background: "surface",
        paddingBottom: "4",
        shadow: "md",
        shadowColor: "surface",
    }
});

export default menu;

export type IVariantPropsMenu = VariantProps<typeof menu>;
