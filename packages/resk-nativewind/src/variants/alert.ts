import { tv, type VariantProps } from "tailwind-variants";
import { VariantsOptionsFactory } from "./variantsFactory";
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
    ...VariantsOptionsFactory.createAll((value) => {
      return {
        base: value,
      };
    }),
    colorScheme: VariantsOptionsFactory.createBackgroundColor((bgColor, colorName) => {
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
    ...VariantsOptionsFactory.createTextVariants<IAlertSlot, "title">((value, colorName) => {
      return { title: value };
    }),
    ...VariantsOptionsFactory.createTextVariants<IAlertSlot, "message">((value, colorName) => {
      return { message: value };
    }),
    ...VariantsOptionsFactory.createIconVariants<IAlertSlot, "icon">((value, colorName) => {
      return { icon: value };
    }),
    ...VariantsOptionsFactory.createIconVariants<IAlertSlot, "closeIcon">((value, colorName) => {
      return { closeIcon: value };
    }),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "iconContainer">((value, colorName) => {
      return { iconContainer: value };
    }),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "closeIconContainer">((value, colorName) => {
      return { closeIconContainer: value };
    }),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "actionsContainer">((value, colorName) => {
      return { actionsContainer: value };
    }),
    ...VariantsOptionsFactory.createAllFlex<IAlertSlot, "actionsContainer">((value, colorName) => {
      return { actionsContainer: value };
    }),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "header">((value, colorName) => {
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
