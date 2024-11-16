import { Text } from "react-native";
import { StyleSheet, TextProps, Role } from "react-native";
import Theme, { useTheme, Colors } from "@theme";
import React, { ReactNode } from "react";
import { isValidElement } from "@utils";
import { IStyle } from "../../types";
import { IDict } from "@resk/core";
import { IThemeColorTokenKey } from "@theme/types";

/**
 * 
 * The Label component is a wrapper around the React Native Text component.
 * It renders the text content using the active theme properties, including
 * the current text color and other styling options.
 * 
 * It inherits properties from the React Native Text component and defines
 * additional properties specified in the ILabelProps interface.
 * 
 * @see https://reactnative.dev/docs/text for the React Native Text component documentation.
 * 
 * Usage:
 * ```jsx
 * import Label from "$components/Label";
 * <Label children={'An example of children'} textBold {...otherProperties} />
 * ```
 */
const Label = React.forwardRef(({
  children,
  userSelect,
  role,
  color,
  textBold,
  upperCase,
  fontSize,
  testID,
  id,
  wrapText,
  underlined,
  splitText,
  disabled,
  style,
  colorScheme: customColorScheme,
  ...rest
}: ILabelProps, ref: React.ForwardedRef<Text>) => {
  const theme = useTheme();
  const colorScheme = Theme.getColorScheme(customColorScheme);

  // Return null if no valid children are provided
  if (!children || !isValidElement(children, true)) return null;

  const r1: IDict = {}, r2: IDict = {};

  // Set color based on the provided or default color scheme
  color = Colors.isValid(color) ? color : colorScheme.backgroundColor || theme.colors.onSurfaceVariant;

  // Apply underlined style if specified
  if (underlined) {
    r1.textDecorationLine = "underline";
  }

  r1.color = color;
  style = StyleSheet.flatten([style]);
  testID = testID || "rn-label";

  const restProps: ILabelProps = { id };

  // Handle split text properties
  if (splitText) {
    restProps.numberOfLines = rest.numberOfLines || 1;
    restProps.ellipsizeMode = rest.ellipsizeMode || "tail";
    if (restProps.numberOfLines > 1 && typeof wrapText !== undefined) {
      wrapText = true;
    }
  }

  // Wrap text if specified
  if (wrapText) {
    r1.flexWrap = "wrap";
  }

  // Disable pointer events if the label is disabled
  if (disabled) {
    r1.pointerEvents = "none";
  }

  // Handle user select property
  if (typeof userSelect === "boolean") {
    userSelect = userSelect === false ? false : true;
  }

  r2.userSelect = typeof userSelect === "boolean" ? (!userSelect ? "none" : "all") : userSelect;

  // Convert children to string if necessary and apply upper case transformation
  if ((children && typeof children === "string") || typeof children === "number" || typeof children === "boolean") {
    children = String(children);
    if (upperCase) {
      children = (children as string).toUpperCase();
    }
  }

  return (
    <Text
      allowFontScaling={true}
      ref={ref}
      {...rest}
      {...restProps}
      testID={testID}
      disabled={disabled}
      style={[
        Theme.styles.webFontFamily,
        splitText ? Theme.styles.flexWrap : null,
        splitText ? Theme.styles.w100 : null,
        textBold ? Theme.styles.fontBold : null,
        r2,
        r1,
        disabled && Theme.styles.disabled,
        style,
      ]}
    >
      {children}
    </Text>
  );
});

Label.displayName = "Label";

/**
 * @interface
 * Props for the Label component.
 * This interface extends the TextProps from React Native
 * and includes additional properties for customization.
 */
export type ILabelProps = Omit<TextProps, "role" | "children" | "style"> & {
  /***
   * @type Role
   * Role of the label, for accessibility
   */
  role?: Role | undefined;
  /***
  * @type boolean, If true, transforms the text to upper case
  */
  upperCase?: boolean;
  /**
   * @type number, Font size of the text
   */
  fontSize?: number;
  /***
   * @type : boolean
   * If true, wraps the text to the next line
   */
  wrapText?: boolean;

  /***
   * @type : string,  Text color, defaults to the theme's text color
   */
  color?: string;
  /***
   * @type : IThemeColorTokenKey, Color scheme for the label, one of the theme's tokens keys
   */
  colorScheme?: IThemeColorTokenKey;

  /***
   * @type string,  Background color of the text
   */
  backgroundColor?: string;

  /***
   *  User select behavior
   */
  userSelect?: boolean | "auto" | "text" | "none" | "contain" | "all";

  /***
   * @type boolean If true, applies an underline style to the text
   */
  underlined?: boolean;

  /***
   * @type boolean
   * If true, splits the text into multiple lines
   */
  splitText?: boolean;
  /***
   * @type boolean
   * If true, applies a bold font style to the text
   */
  textBold?: boolean;
  /***
   * @type IStyle
   * Additional styles for the label
   */
  style?: IStyle;
  /***
   * @type ReactNode, Children elements or text content
   */
  children?: ReactNode;
};

export default Label;