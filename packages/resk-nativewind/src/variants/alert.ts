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
    header: "",
    icon: "",
    iconContainer: "",
    closeIcon: "",
    closeIconContainer: "",
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
    closeIconSize: VariantsFactory.createIconSize((value) => {
      return {
        closeIcon: value,
      };
    }),
    closeIonColor: VariantsFactory.createIconColor((value) => {
      return {
        closeIcon: value,
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
    closeIconOpactiy: VariantsFactory.createOpacity((value) => {
      return {
        iconContainer: value,
      };
    }),
    iconContainerBackground: VariantsFactory.createBackgroundColor((value) => {
      return {
        iconContainer: value,
      };
    }),
    closeIconContainerBackground: VariantsFactory.createBackgroundColor((value) => {
      return {
        closeIconContainer: value,
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

    closeIconContainerPadding: VariantsFactory.createPadding((value) => {
      return {
        closeIconContainer: value,
      };
    }),
    closeIconContainerMargin: VariantsFactory.createMargin((value) => {
      return {
        closeIconContainer: value,
      };
    }),
    closeIconContainerMarginRight: VariantsFactory.createMarginRight((value) => {
      return {
        closeIconContainer: value,
      };
    }),
    closeIconContainerMarginLeft: VariantsFactory.createMarginLeft((value) => {
      return {
        closeIconContainer: value,
      };
    }),
    closeIconContainerMarginTop: VariantsFactory.createMarginTop((value) => {
      return {
        closeIconContainer: value,
      };
    }),
    closeIconContainerMarginBottom: VariantsFactory.createMarginBottom((value) => {
      return {
        closeIconContainer: value,
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
    messagePaddingTop: VariantsFactory.createPaddingTop((value) => {
      return {
        message: value,
      };
    }),
    messagePaddingBottom: VariantsFactory.createPaddingBottom((value) => {
      return {
        message: value,
      };
    }),
    messagePaddingLeft: VariantsFactory.createPaddingLeft((value) => {
      return {
        message: value,
      };
    }),
    messagePaddingRight: VariantsFactory.createPaddingRight((value) => {
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
    headerPadding: VariantsFactory.createPadding((value) => {
      return {
        header: value,
      };
    }),
    headerPaddingTop: VariantsFactory.createPaddingTop((value) => {
      return {
        header: value
      }
    }),
    headerPaddingBottom: VariantsFactory.createPaddingBottom((value) => {
      return {
        header: value
      }
    }),
    headerPaddingLeft: VariantsFactory.createPaddingLeft((value) => {
      return {
        header: value
      }
    }),
    headerPaddingRight: VariantsFactory.createPaddingRight((value) => {
      return {
        "header": value
      }
    }),
    headerMargin: VariantsFactory.createMargin((value) => {
      return {
        header: value,
      };
    }),
    headerMarginTop: VariantsFactory.createMarginTop((value) => {
      return {
        header: value,
      };
    }),
    headerMarginBottom: VariantsFactory.createMarginBottom((value) => {
      return {
        header: value,
      };
    }),
    headerMarginLeft: VariantsFactory.createMarginLeft((value) => {
      return {
        header: value,
      };
    }),
    headerMarginRight: VariantsFactory.createMarginRight((value) => {
      return {
        header: value,
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
  },
  defaultVariants: {
    shadow: "lg",
    padding: 2,
    iconContainerMargin: "5px",
    closeIconContainerMargin: "5px",
    titleMarginLeft: "5px",
    iconSize: "25px",
    closeIconSize: "25px",
    titleWeight: "bold",
    messageOpacity: 90,
  },
});

export type IVariantPropsAlert = VariantProps<typeof alert>;

export default alert;

type IAlertSlot = {
  title?: string;
  message?: string;
  base?: string;
  header?: string;
  icon?: string;
  iconContainer?: string;
  closeIcon?: string;
};
