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
    actions: "items-center",
    action: "",
  },
  variants: {
    ...VariantsOptionsFactory.createAll((value) => {
      return {
        base: value,
      };
    }),
    centered: {
      true: {
        base: "justify-center items-center text-center",
        header: "",
        title: "text-center",
        message: "text-center",
        actions: "justify-center"
      },
      false: {
        base: "justify-start items-start text-start",
        header: "flex flex-row justify-between items-center",
        title: "text-start",
        message: "text-start",
        actions: "justify-start"
      }
    },
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
    }, "title"),
    ...VariantsOptionsFactory.createTextVariants<IAlertSlot, "message">((value, colorName) => {
      return { message: value };
    }, "message"),
    ...VariantsOptionsFactory.createIconVariants<IAlertSlot, "icon">((value, colorName) => {
      return { icon: value };
    }, "icon"),
    ...VariantsOptionsFactory.createIconVariants<IAlertSlot, "closeIcon">((value, colorName) => {
      return { closeIcon: value };
    }, "closeIcon"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "iconContainer">((value, colorName) => {
      return { iconContainer: value };
    }, "iconContainer"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "closeIconContainer">((value, colorName) => {
      return { closeIconContainer: value };
    }, "closeIconContainer"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "actions">((value, colorName) => {
      return { actions: value };
    }, "actions"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "header">((value, colorName) => {
      return { header: value };
    }, "header"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "message">((value, colorName) => {
      return { message: value };
    }, "message"),
    ...VariantsOptionsFactory.createAllPadding2Margin<IAlertSlot, "title">((value, colorName) => {
      return { title: value };
    }, "title"),
    ...VariantsOptionsFactory.createAllFlex<IAlertSlot, "actions">((value, colorName) => {
      return { actions: value };
    }, "actions"),
    ...VariantsOptionsFactory.createAllGaps<IAlertSlot, "actions">((value, colorName) => {
      return { actions: value };
    }, "actions"),
    ...VariantsOptionsFactory.createAllRounded<IAlertSlot, "iconContainer">((value, colorName) => {
      return { iconContainer: value };
    }, "iconContainer"),
    ...VariantsOptionsFactory.createAllRounded<IAlertSlot, "closeIconContainer">((value, colorName) => {
      return { closeIconContainer: value };
    }, "closeIconContainer"),
    ...VariantsOptionsFactory.createAllFlex<IAlertSlot, "header">((value, colorName) => {
      return { header: value };
    }, "header"),
    ...VariantsOptionsFactory.createAllOpacity<IAlertSlot, "message">((value, colorName) => {
      return { message: value };
    }, "message"),
    ...VariantsOptionsFactory.createAllOpacity<IAlertSlot, "title">((value, colorName) => {
      return { title: value };
    }, "title"),
    iconContainerBackground: VariantsOptionsFactory.createBackgroundColor((value, colorName) => {
      return { iconContainer: value };
    }),
    closeIconContainerBackground: VariantsOptionsFactory.createBackgroundColor((value, colorName) => {
      return { closeIconContainer: value };
    }),
  },
  defaultVariants: {
    shadow: "lg",
    padding: 2,
    iconSize: "25px",
    closeIconSize: "25px",
    iconContainerMarginX: 2,
    closeIconContainerMarginX: 2,
    titleSize: "lg",
    titleWeight: "bold",
    messageSize: "sm",
    messageWeight: "thin",
    actionsGap: 2,
    actionsPaddingX: 2,
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
  actions?: string;
  action?: string;
};
