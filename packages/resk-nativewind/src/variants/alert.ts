import { tv, type VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { typedEntries } from "@resk/core/utils";
import { IVariantsColors } from "./colors";

export const alertVariant = tv({
  slots: {
    title: "",
    message: "",
    base: "",
    header: "",
    icon: "",
    iconContainer: "",
    closeIcon: "",
    closeIconContainer: "",
    actionsContainer: "",
    action: "",
  },
  variants: {
    ...VariantsFactory.createAll((value) => {
      return {
        base: value,
      };
    }),
    colorScheme: VariantsFactory.createBackgroundColor((bgColor, colorName) => {
      const textColor = VariantsColors.textForeground[`${colorName}-foreground`],
        iconColor = VariantsColors.iconForeground[`${colorName}-foreground`];
      return {
        base: bgColor,
        title: textColor,
        message: textColor,
        icon: iconColor,
        closeIcon: iconColor,
      };
    }),
    outline: Object.fromEntries(
      typedEntries(VariantsColors.buttonOutline).map(([colorName, { icon, activityIndicator, label, base }]) => {
        return [
          colorName,
          {
            base,
            icon,
            title: label,
            message: label,
            closeIcon: icon,
          },
        ];
      })
    ) as Record<IVariantsColors.ColorName, IAlertSlot>,
    ...VariantsFactory.createTextVariants<IAlertSlot, "title">((value, colorName) => {
      return { title: value };
    }),
    ...VariantsFactory.createTextVariants<IAlertSlot, "message">((value, colorName) => {
      return { message: value };
    }),
    ...VariantsFactory.createIconVariants<IAlertSlot, "icon">((value, colorName) => {
      return { icon: value };
    }),
    ...VariantsFactory.createIconVariants<IAlertSlot, "closeIcon">((value, colorName) => {
      return { closeIcon: value };
    }),
    ...VariantsFactory.createAllPadding2Margin<IAlertSlot, "iconContainer">((value, colorName) => {
      return { iconContainer: value };
    }),
    ...VariantsFactory.createAllPadding2Margin<IAlertSlot, "closeIconContainer">((value, colorName) => {
      return { closeIconContainer: value };
    }),
    ...VariantsFactory.createAllPadding2Margin<IAlertSlot, "actionsContainer">((value, colorName) => {
      return { actionsContainer: value };
    }),
    ...VariantsFactory.createAllFlex<IAlertSlot, "actionsContainer">((value, colorName) => {
      return { actionsContainer: value };
    }),
    ...VariantsFactory.createAllPadding2Margin<IAlertSlot, "header">((value, colorName) => {
      return { header: value };
    }),
  },
  defaultVariants: {
    shadow: "lg",
    padding: 2,
    iconContainerMargin: "5px",
    closeIconContainerMargin: "5px",
    titleMarginLeft: "5px",
    iconSize: "25px",
    closeIconSize: "25px",
    titleSize: "lg",
    titleWeight: "bold",
    messageSize: "base",
    messageWeight: "normal",
    messageOpacity: 90,
  },
});

export type IAlertVariant = VariantProps<typeof alertVariant>;

type IAlertSlot = {
  title?: string;
  message?: string;
  base?: string;
  header?: string;
  icon?: string;
  iconContainer?: string;
  closeIcon?: string;
  closeIconContainer?: string;
  actionsContainer?: string;
  action?: string;
};
