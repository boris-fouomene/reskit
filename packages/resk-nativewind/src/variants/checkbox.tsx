import { tv, VariantProps } from 'tailwind-variants';
import { VariantsFactory } from './variantsFactory';
import { VariantsColors } from './colors/generated';

const checkbox = tv({
    slots: {
        icon: "",
        label: "",
        checkedIconColor: "",
        uncheckedIconColor: "",
        checkedLabelColor: "",
        uncheckedLabelColor: ""
    },
    variants: {
        iconSize: VariantsFactory.createIconSizes<{ icon: string, label: string }>((value) => {
            return {
                icon: value,
                label: "",
            }
        }),
        labelSize: VariantsFactory.createIconSizes<{ icon: string, label: string }>((value) => {
            return {
                icon: "",
                label: value,
            }
        }),
        checkedColor: VariantsFactory.create<typeof VariantsColors.icon, { checkedIconColor: string, checkedLabelColor: string }>(VariantsColors.icon, (value, colorName) => {
            return {
                checkedIconColor: value,
                checkedLabelColor: value.split("!").join(""),
            }
        }),
        uncheckedColor: VariantsFactory.create<typeof VariantsColors.icon, { uncheckedIconColor: string, uncheckedLabelColor: string }>(VariantsColors.icon, (value, colorName) => {
            return {
                uncheckedIconColor: value,
                uncheckedLabelColor: value.split("!").join(""),
            }
        }),
    },
    defaultVariants: {
        iconSize: "25px",
        checkedColor: "primary",
    }
})

export type IVariantPropsCheckbox = VariantProps<typeof checkbox>;

export default checkbox;