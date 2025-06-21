import { tv, VariantProps } from 'tailwind-variants';
import { iconSizes } from './variantsFactory/iconSizes';
import { VariantsFactory } from './variantsFactory';
import { VariantsGeneratedColors } from './generated-variants-colors';

const checkbox = tv({
    slots: {
        icon: "",
        label: "",
        checkedColor: "",
        uncheckedColor: "",
    },
    variants: {
        size: VariantsFactory.create<typeof iconSizes, { icon: string, label: string }>(iconSizes, (value) => {
            return {
                icon: value,
                label: value.split("!")[1],
            }
        }),
        checkedColor: VariantsFactory.create<typeof VariantsGeneratedColors.icon, { icon: string, label: string }>(VariantsGeneratedColors.icon, (value, colorName) => {
            return {
                icon: value,
                label: VariantsGeneratedColors.color[colorName],
            }
        }),
        uncheckedColor: VariantsFactory.create<typeof VariantsGeneratedColors.icon, { icon: string, label: string }>(VariantsGeneratedColors.icon, (value, colorName) => {
            return {
                icon: value,
                label: VariantsGeneratedColors.color[colorName],
            }
        }),
    },
    defaultVariants: {
        size: "25px",
        checkedColor: "primary",
    }
})

export type IVariantPropsCheckbox = VariantProps<typeof checkbox>;

export default checkbox;