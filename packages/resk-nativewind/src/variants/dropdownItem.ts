import { tv, VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";

const dropdownItem = tv({
  slots: {
    base: "",
    container: "",
    selectedIcon: "",
    label: "",
    selectedLabel: "",
  },
  variants: {
    ...VariantsFactory.createAll<IDropdownIconSlots>((value, variantName, varantGroupName) => {
      return {
        base: value,
      };
    }),
    colorScheme: VariantsFactory.create<typeof VariantsColors.background, IDropdownIconSlots>(VariantsColors.background, (value, colorName) => {
      return {
        base: value,
        label: VariantsColors.textForeground[`${colorName}-foreground`],
      };
    }),
    selectedColor: VariantsFactory.create<typeof VariantsColors.icon, IDropdownIconSlots>(VariantsColors.icon, (value, colorName) => {
      return {
        selectedLabel: value.split("!text-").join("text-"),
        selectedIcon: value,
      };
    }),
    selectedIconSize: VariantsFactory.createIconSizes<IDropdownIconSlots>((value, colorName) => {
      return {
        selectedIcon: value,
      };
    }),
    textSize: VariantsFactory.createTextSizes<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    textAlign: VariantsFactory.createTextAlign<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    textWeight: VariantsFactory.createFontWeight<IDropdownIconSlots>((value, colorName) => {
      return {
        label: value,
      };
    }),
    selectedTextSize: VariantsFactory.createTextSizes<IDropdownIconSlots>((value, colorName) => {
      return {
        selectedLabel: value,
      };
    }),
    selectedTextWeight: VariantsFactory.createFontWeight<IDropdownIconSlots>((value, colorName) => {
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
export type IVariantPropsDropdownItem = VariantProps<typeof dropdownItem>;

export default dropdownItem;
