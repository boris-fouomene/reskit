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
        colorScheme: VariantsColors.button,
        outline: VariantsColors.buttonOutline,
        ...VariantsFactory.createAll<{ base: string }>((value) => {
            return {
                base: value,
            }
        })
    },
    defaultVariants: {
        hoverOpacity: 90,
        activeOpacity: 80,
    }
});
export default buton;
export type IVariantPropsButton = VariantProps<typeof buton>;