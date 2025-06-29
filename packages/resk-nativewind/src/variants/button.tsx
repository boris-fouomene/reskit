import { tv, VariantProps } from 'tailwind-variants';
import { VariantsGeneratedColors } from "./colors/generated";
import { VariantsFactory } from './variantsFactory';

const buton = tv({
    slots: {
        base: "",
        content: "",
        leftContainer: "",
        rightContainer: "",
        icon: "mx-[5px]",
        activityIndicator: "",
        ripple: "",
        label: "",
    },
    variants: {
        colorScheme: VariantsGeneratedColors.button,
        outline: VariantsGeneratedColors.buttonOutline,
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        })
    },
    defaultVariants: {}
});
export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;