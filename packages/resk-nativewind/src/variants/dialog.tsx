import { tv, VariantProps } from "tailwind-variants";
import { VariantsColors } from "./colors/generated";
import { VariantsFactory } from "./variantsFactory";
import { classes } from "./classes";

const dialog = tv({
    slots: {
        backdrop: "",
        content: "",//"max-w-[80%] sm:max-w-[600px] min-h-[250px] max-h-[50%]",
    },
    variants: {
        ...VariantsFactory.createAll<{ content: string }>((value) => {
            return {
                content: value,
            }
        }),
        withBackdrop: {
            true: {
                backdrop: classes.backdrop
            }
        },
        colorScheme: VariantsFactory.create<typeof VariantsColors.surface, { content: string }>(VariantsColors.surface, (value) => {
            return {
                content: value,
            }
        }),
        /*  responsive: {
             true: {
                 content: "max-w-full sm:max-w-full w-screen h-screen max-w-full max-h-full lg:max-h[50%] lg:max-w-[600%]",
             }
         }, */
    },
    defaultVariants: {}
});

export type IVariantPropsModal = VariantProps<typeof dialog>;

export default dialog;