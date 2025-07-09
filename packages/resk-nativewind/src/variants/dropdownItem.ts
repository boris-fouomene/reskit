import { tv, VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";

export const dropdownItemVariant = tv({
  slots: {
    base: "",
    container: "",
    selectedIcon: "",
    label: "",
    selectedLabel: "",
  },
  variants: {
    ...VariantsOptionsFactory.createAll<IDropdownIconSlots>((value, variantName, varantGroupName) => {
      return {
        base: value,
      };
    }),
    colorScheme: VariantsOptionsFactory.create<typeof VariantsColors.background, IDropdownIconSlots>(VariantsColors.background, (value, colorName) => {
      return {
        base: value,
        label: VariantsColors.textForeground[`${colorName}-foreground`],
      };
    }),
    selectedColor: VariantsOptionsFactory.create<typeof VariantsColors.icon, IDropdownIconSlots>(VariantsColors.icon, (value, colorName) => {
      return {
        selectedLabel: value.split("!text-").join("text-"),
        selectedIcon: value,
      };
    }),
    selectedIconSize: VariantsOptionsFactory.createIconSize<IDropdownIconSlots>((value, colorName) => {
      return {
        selectedIcon: value,
      };
    }),
    textSize: VariantsOptionsFactory.createTextSize<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    textAlign: VariantsOptionsFactory.createTextAlign<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    textWeight: VariantsOptionsFactory.createTextWeight<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    selectedTextSize: VariantsOptionsFactory.createTextSize<IDropdownIconSlots>((value, colorName) => {
      return {
        selectedLabel: value,
      };
    }),
    selectedTextWeight: VariantsOptionsFactory.createTextWeight<IDropdownIconSlots>((value, colorName) => {
      return {
        selectedLabel: value,
      };
    }),
  },
  defaultVariants: {
    selectedColor: "primary",
    selectedIconSize: "20px",
  },
});

type IDropdownIconSlots = {
  base?: string;
  container?: string;
  selectedIcon?: string;
  selectedLabel?: string;
  label?: string;
};
export type IDropdownItemVariant = VariantProps<typeof dropdownItemVariant>;
