import { tv, VariantProps } from 'tailwind-variants';
import { VariantsColors } from "./colors/generated";
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
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        }),
        colorScheme: VariantsColors.button,
        outline: VariantsColors.buttonOutline,
        hoverColor: VariantsFactory.createHoverBackgroundColor<{ base: string }>((value, variantName) => {
            return {
                base: value,
            }
        }),
    },
    defaultVariants: {}
});
export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;