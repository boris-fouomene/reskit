import { tv, type VariantProps } from "tailwind-variants";
import { VariantsFactory } from "./variantsFactory";
import { VariantsColors } from "./colors/generated";
import { typedEntries } from "@resk/core/utils";
import { IVariantsColors } from "./colors";

const alert = tv({
  slots: {
    title: "",
    message: "",
    base: "",
    titleContainer: "",
    icon: "",
    iconContainer: "",
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
      };
    }),
    titleSize: VariantsFactory.createTextSize((value) => {
      return {
        title: value,
      };
    }),
    iconSize: VariantsFactory.createIconSize((value) => {
      return {
        icon: value,
      };
    }),
    iconColor: VariantsFactory.createIconColor((value) => {
      return {
        icon: value,
      };
    }),
    titleColor: VariantsFactory.createTextColor((value) => {
      return {
        title: value,
      };
    }),
    titleWeight: VariantsFactory.createTextWeight((value) => {
      return {
        title: value,
      };
    }),
    messageColor: VariantsFactory.createTextColor((value) => {
      return {
        message: value,
      };
    }),
    messageWeight: VariantsFactory.createTextWeight((value) => {
      return {
        message: value,
      };
    }),
    messageSize: VariantsFactory.createTextSize((value) => {
      return {
        message: value,
      };
    }),
    titleOpacity: VariantsFactory.createOpacity((value) => {
      return {
        title: value,
      };
    }),
    messageOpacity: VariantsFactory.createOpacity((value) => {
      return {
        message: value,
      };
    }),
    iconOpactiy: VariantsFactory.createOpacity((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerPadding: VariantsFactory.createPadding((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerMargin: VariantsFactory.createMargin((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerMarginRight: VariantsFactory.createMarginRight((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerMarginLeft: VariantsFactory.createMarginLeft((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerMarginTop: VariantsFactory.createMarginTop((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerMarginBottom: VariantsFactory.createMarginBottom((value) => {
      return {
        iconContainer: value,
      };
    }),
    messageMargin: VariantsFactory.createMargin((value) => {
      return {
        message: value,
      };
    }),
    messagePadding: VariantsFactory.createPadding((value) => {
      return {
        message: value,
      };
    }),
    messageMarginTop: VariantsFactory.createMarginTop((value) => {
      return {
        message: value,
      };
    }),
    messageMarginBottom: VariantsFactory.createMarginBottom((value) => {
      return {
        message: value,
      };
    }),
    messageMarginLeft: VariantsFactory.createMarginLeft((value) => {
      return {
        message: value,
      };
    }),
    messageMarginRigth: VariantsFactory.createMarginRight((value) => {
      return {
        message: value,
      };
    }),
    titleAlign: VariantsFactory.createTextAlign((value) => {
      return {
        title: value,
      };
    }),
    titleMargin: VariantsFactory.createMargin((value) => {
      return {
        title: value,
      };
    }),
    titlePadding: VariantsFactory.createPadding((value) => {
      return {
        title: value,
      };
    }),
    titleMarginTop: VariantsFactory.createMarginTop((value) => {
      return {
        title: value,
      };
    }),
    titleMarginBottom: VariantsFactory.createMarginBottom((value) => {
      return {
        title: value,
      };
    }),
    titleMarginLeft: VariantsFactory.createMarginLeft((value) => {
      return {
        title: value,
      };
    }),
    titleMarginRight: VariantsFactory.createMarginRight((value) => {
      return {
        title: value,
      };
    }),
    messageAlign: VariantsFactory.createTextAlign((value) => {
      return {
        message: value,
      };
    }),
    titleContainerPadding: VariantsFactory.createPadding((value) => {
      return {
        titleContainer: value,
      };
    }),
    titleContainerMargin: VariantsFactory.createMargin((value) => {
      return {
        titleContainer: value,
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
          },
        ];
      })
    ) as Record<IVariantsColors.ColorName, IAlertSlot>,
  },
  defaultVariants: {
    shadow: "lg",
    padding: 2,
    messagePadding: "10px",
    titleContainerMargin: "5px",
    iconContainerMargin: "5px",
    titleMarginLeft: "5px",
    iconSize: "25px",
    titleWeight: "bold",
    messageOpacity: 80,
  },
});

export type IVariantPropsAlert = VariantProps<typeof alert>;

export default alert;

type IAlertSlot = {
  title?: string;
  message?: string;
  base?: string;
  titleContainer?: string;
  icon?: string;
  iconContainer?: string;
};
