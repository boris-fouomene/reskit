"use client";
import { TouchableOpacity, GestureResponderEvent, TouchableWithoutFeedback } from "react-native";
import { ICheckboxProps } from "./types";
import { Tooltip } from "@components/Tooltip";
import { Text } from "@html/Text";
import { useToggleable } from "@components/Switch/utils";
import FontIcon from "@components/Icon/Font";
import { FONT_ICONS } from "@components/Icon/Font/icons";
import { isNonNullString } from "@resk/core/utils";
import { cn } from "@utils/cn";
import getTextContent from "@utils/getTextContent";
import { pickTouchableProps } from "@utils/touchHandler";
import { checkboxVariant } from "@variants/checkbox";

export * from "./types";


/**
 * A customizable Checkbox component that supports title, labels, and toggle functionality.
 *
 * This component wraps the `TouchableOpacity` from React Native and enhances its usability by providing
 * optional tooltips and labels. It allows users to toggle between checked and unchecked states
 * easily, making it suitable for various applications such as settings, forms, and toggle controls.
 *
 * @param {object} props - The properties for the Checkbox component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "resk-checkbox".
 * @param {string} [props.checkedIconName] - The icon name of the checked icon.
 * @param {number} [props.size] - The size of the checkbox.
 * @param {string} [props.uncheckedIconName] - The icon name of the unchecked icon.
 * @param {string} [props.checkedClassName] - The class name for the checked icon.
 * @param {string} [props.uncheckedClassName] - The class name for the unchecked icon.
 * @param {string} [props.checkedVariant] - The variant name for the checked icon.
 * @param {string} [props.uncheckedVariant] - The variant name for the unchecked icon.
 * @param {object} [props.style] - Additional styles for the checkbox container.
 * @param {object} [props.containerClassName] - The tailwind CSS class names for the container component.
 * @param {boolean} [props.disabled] - Flag to indicate if the checkbox is disabled.
 * @param {boolean} [props.readOnly] - Flag to indicate if the checkbox is read-only.
 * @param {string} [props.label] - The text label associated with the checkbox.
 * @param {boolean} [props.isLabelOnLeftSide] - Indicates whether the label should be on the left side of the checkbox.
 * @param {any} [props.checkedValue] - The value representing the checked state.
 * @param {any} [props.uncheckedValue] - The value representing the unchecked state.
 * @param {any} [props.defaultValue] - The default value of the checkbox.
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
 *       title="Toggle to receive notifications"
 *       color="#4CAF50"
 *       disabled={false}
 *       readOnly={false}
 *       onChange={({value,event,checked})=>{
 *            console.log(value," is value");//display "checked" or "unchecked"
 *       }}
 *     />
 *   );
 * };
 *
 * for more information on the underlying RNCheckbox component.
 */
export function Checkbox({ testID, variant, checkedIconName, uncheckedIconName, checkedClassName, uncheckedClassName, checkedVariant, uncheckedVariant, style, ...props }: ICheckboxProps) {
    const {
        checked,
        title,
        labelClassName,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        label,
        className,
        isLabelOnLeftSide,
        checkedValue,
        uncheckedValue,
        defaultValue,
        disabled,
        readOnly,
        containerClassName,
        ...rest
    } = useToggleable(props);
    const computedVariant = checkboxVariant(variant);
    const iconClx = checked ? computedVariant.checkedIconColor() : computedVariant.uncheckedIconColor();
    const labelClx = checked ? computedVariant.checkedLabelColor() : computedVariant.uncheckedLabelColor();
    const { touchableProps, ...nonTouchableProps } = pickTouchableProps(rest as any);
    const handleOnPress = disabled ? undefined : (event: GestureResponderEvent) => {
        toggleStatus();
    };
    const iconChecked = isNonNullString(checkedIconName) ? checkedIconName : FONT_ICONS.CHECKED;
    const iconUnchecked = isNonNullString(uncheckedIconName) ? uncheckedIconName : FONT_ICONS.UNCHECKED;
    const checkboxTestID = typeof testID === 'string' && testID || "resk-checkbox";
    const labelContent = <Text testID={`${checkboxTestID}-label`} className={cn(labelClx, computedVariant.label(), labelClassName)} children={label} />;
    return <Tooltip
        disabled={disabled || readOnly}
        title={title}
        testID={`${checkboxTestID}-container`}
        accessibilityRole="checkbox"
        accessibilityState={{ disabled, checked }}
        accessibilityLabel={getTextContent(label)}
        {...touchableProps as any}
        onPress={handleOnPress}
        className={cn(containerClassName)}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <TouchableWithoutFeedback disabled={disabled} onPress={handleOnPress} testID={testID + "-checkbox-container"}>
            <FontIcon
                {...nonTouchableProps}
                disabled={disabled}
                accessibilityRole="checkbox"
                className={cn(iconClx, computedVariant.icon(), checked ? checkedClassName : uncheckedClassName)}
                variant={checked ? checkedVariant : uncheckedVariant}
                name={(checked ? iconChecked as never : iconUnchecked as never)}
                testID={checkboxTestID}
                title={undefined}
            />
        </TouchableWithoutFeedback>
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}

Checkbox.displayName = "Checkbox"