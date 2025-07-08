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
    iconContainerSize: VariantsFactory.createSize((value) => {
      return {
        iconContainer: value,
      };
    }),
    titleAlign: VariantsFactory.createTextAlign((value) => {
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
      typedEntries(VariantsColors.iconForeground).map(([key, value]) => {
        const colorName = key.split("-foreground")[0];
        return [
          colorName,
          {
            base: `${(VariantsColors.background as any)[colorName]} border-${colorName}`,
            icon: value,
            title: value.split("!text-").join("text-"),
            message: value.split("!text-").join("text-"),
          },
        ];
      })
    ) as Record<IVariantsColors.ColorName, IAlertSlot>,
  },
  defaultVariants: {
    shadow: "lg",
    padding: 2,
    titleContainerMargin: "5px",
    iconContainerMargin: "5px",
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
