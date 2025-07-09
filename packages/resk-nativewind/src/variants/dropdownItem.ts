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
    ...VariantsOptionsFactory.createIconVariants<IDropdownIconSlots, "selectedIcon">((value, colorName) => {
      return { selectedIcon: value };
    }, "selectedIcon"),
    ...VariantsOptionsFactory.createTextVariants<IDropdownIconSlots, "text">((value, colorName) => {
      return { label: value };
    }, "text"),
    ...VariantsOptionsFactory.createTextVariants<IDropdownIconSlots, "selectedText">((value, colorName) => {
      return { label: value };
    }, "selectedText"),
  },
  defaultVariants: {
    selectedTextColor: "primary",
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
