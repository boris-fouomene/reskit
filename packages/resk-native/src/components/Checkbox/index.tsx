import { TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { ICheckboxProps } from "./types";
import { Tooltip } from "@components/Tooltip";
import Label from "@components/Label";
import { useToggleable } from "@components/Switch/utils";
import FontIcon from "@components/Icon/Font";
import { isNonNullString } from "@resk/core";
import { Colors, useTheme } from "@theme/index";

export * from "./types";

/**
 * A customizable Checkbox component that supports tooltip, labels, and toggle functionality.
 * user interface with optional tooltips and labels. It allows for easy integration into forms 
 * and other UI elements while supporting various states such as checked, unchecked, disabled, 
 * and read-only.
 *
 * @param {object} props - The properties for the Checkbox component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "resk-checkbox".
 * @param {string} [props.tooltip] - Optional tooltip text displayed when the user hovers over the checkbox.
 * @param {object} [props.labelProps] - Additional properties for the label component.
 * @param {string} [props.color] - The color of the checkbox when checked.
 * @param {string} [props.label] - The text label associated with the checkbox.
 * @param {any} [props.checkedValue] - The value representing the checked state.
 * @param {any} [props.uncheckedValue] - The value representing the unchecked state.
 * @param {any} [props.defaultValue] - The default value of the checkbox.
 * @param {boolean} [props.disabled] - Flag to indicate if the checkbox is disabled.
 * @param {boolean} [props.readOnly] - Flag to indicate if the checkbox is read-only.
 * @param {object} [rest] - Additional props passed to the RNCheckbox component.
 *
 * @returns {JSX.Element} - Returns a JSX element representing the Checkbox component.
 *
 * @example
 * // Usage example of the Checkbox component
 * import { Checkbox } from './path/to/Checkbox';
 *
 * const MyComponent = () => {
 *   return (
 *     <Checkbox
 *       defaultValue={"checked"}
 *       uncheckedValue="unchecked"
 *       checkedValue={"checked"}
 *       uncheckedValue={"unchecked"}
 *       label="Enable Notifications"
 *       tooltip="Toggle to receive notifications"
 *       color="#4CAF50"
 *       disabled={false}
 *       onChange={({value,event,checked})=>{
 *            console.log(value," is value");//display "checked" or "unchecked"
 *       }}
 *     />
 *   );
 * };
 *
 * for more information on the underlying RNCheckbox component.
 */
export const Checkbox = ({ testID, size, checkedIcon, uncheckedColor, uncheckedIcon, iconProps, style, ...props }: ICheckboxProps) => {
    const {
        checked,
        tooltip,
        labelProps,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        color,
        label,
        isLabelOnLeftSide,
        disabledStyle,
        readOnlyStyle,
        checkedValue,
        uncheckedValue,
        defaultValue,
        checkedColor,
        onTintColor,
        thumbTintColor,
        disabled,
        readOnly,
        containerProps,
        ...rest
    } = useToggleable<GestureResponderEvent>(props);
    const handleOnPress = (event: GestureResponderEvent) => {
        toggleStatus();
    };
    const theme = useTheme();
    checkedIcon = isNonNullString(checkedIcon) ? checkedIcon : FontIcon.CHECKED;
    uncheckedIcon = isNonNullString(uncheckedIcon) ? uncheckedIcon : FontIcon.UNCHECKED;
    size = typeof size === 'number' && size ? size : 25;
    iconProps = Object.assign({}, iconProps);
    const MTestID = typeof testID === 'string' && testID || "resk-checkbox";
    const labelContent = <Label testID={`${MTestID}-label`} {...labelProps} style={[styles.label, labelProps.style]} children={label} />;
    uncheckedColor = Colors.isValid(uncheckedColor) ? uncheckedColor : theme.colors.secondary;
    return <Tooltip
        as={TouchableOpacity} disabled={disabled || readOnly}
        tooltip={tooltip} testID={`${MTestID}`}
        accessibilityRole="checkbox"
        accessibilityState={{ disabled, checked }}
        {...rest}
        style={[styles.container, disabledStyle, readOnlyStyle, style]}
        onPress={handleOnPress}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <FontIcon
            disabled={disabled}
            accessibilityRole="checkbox"
            {...iconProps}
            name={(checked ? checkedIcon : uncheckedIcon as any)}
            size={size}
            color={checked ? color : uncheckedColor}
        />
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        alignSelf: "flex-start"
    },
    label: {
        userSelect: "text",
        marginHorizontal: 7,
    },
});

Checkbox.displayName = "Checkbox"