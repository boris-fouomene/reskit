import { Text } from "react-native";
import { StyleSheet } from "react-native";
import Theme, { useTheme, Colors } from "@theme";
import { IDict, isNonNullString } from "@resk/core";
import { ILabelProps } from "./types";
import isValidElement from "@utils/isValidElement";

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
export function Label({
  children,
  userSelect,
  role,
  color,
  textBold,
  uppercase,
  fontSize,
  testID,
  wrapText,
  underlined,
  splitText,
  disabled,
  style,
  fontVariant,
  colorScheme: customColorScheme,
  ...rest
}: ILabelProps){
  const theme = useTheme();
  const colorScheme = theme.getColorScheme(customColorScheme);

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
  testID = testID || "resk-label";

  const restProps: ILabelProps = {};

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

  return (
    <Text
      allowFontScaling={true}
      {...rest}
      {...restProps}
      testID={testID}
      disabled={disabled}
      style={[
        theme.fonts.regular,
        isNonNullString(fontVariant) && theme.fonts[fontVariant as keyof typeof theme.fonts],
        splitText ? Theme.styles.flexWrap : null,
        splitText ? Theme.styles.w100 : null,
        textBold ? Theme.styles.fontBold : null,
        uppercase ? Theme.styles.uppercase : null,
        r2,
        r1,
        disabled && Theme.styles.disabled,
        style,
        fontSize && typeof fontSize === "number" && fontSize > 0 ? { fontSize } : null,
      ]}
    >
      {children}
    </Text>
  );
}

export * from "./types";

Label.displayName = "Label";