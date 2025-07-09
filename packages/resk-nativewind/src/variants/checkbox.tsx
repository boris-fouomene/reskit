import { tv, VariantProps } from 'tailwind-variants';
import { VariantsOptionsFactory } from './variantsFactory';
import { VariantsColors } from './colors/generated';

export const checkboxVariant = tv({
    slots: {
        icon: "",
        label: "",
        checkedIconColor: "",
        uncheckedIconColor: "",
        checkedLabelColor: "",
        uncheckedLabelColor: ""
    },
    variants: {
        iconSize: VariantsOptionsFactory.createIconSize<{ icon: string, label: string }>((value) => {
            return {
                icon: value,
                label: "",
            }
        }),
        labelSize: VariantsOptionsFactory.createTextSize<{ icon: string, label: string }>((value) => {
            return {
                icon: "",
                label: value,
            }
        }),
        checkedColor: VariantsOptionsFactory.create<typeof VariantsColors.icon, { checkedIconColor: string, checkedLabelColor: string }>(VariantsColors.icon, (value, colorName) => {
            return {
                checkedIconColor: value,
                checkedLabelColor: value.split("!").join(""),
            }
        }),
        uncheckedColor: VariantsOptionsFactory.create<typeof VariantsColors.icon, { uncheckedIconColor: string, uncheckedLabelColor: string }>(VariantsColors.icon, (value, colorName) => {
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

export type ICheckboxVariant = VariantProps<typeof checkboxVariant>;