import { Platform, Pressable, StyleSheet, Switch as RNSwitch, SwitchChangeEvent, GestureResponderEvent } from "react-native";
import { ISwitchProps } from "./types";
import { useToggleable } from "./utils";
import { useTheme } from "@theme/index";
import { Tooltip } from "@components/Tooltip";
import Label from "@components/Label";

export * from "./types";
export * from "./utils";

/**
 * A customizable Switch component that supports tooltip, labels, and toggle functionality.
 *
 * This component wraps the `Switch` from React Native and enhances its usability by providing 
 * optional tooltips and labels. It allows users to toggle between checked and unchecked states 
 * easily, making it suitable for various applications such as settings, forms, and toggle controls.
 *
 * @param {object} props - The properties for the Switch component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "RNSwitchComponent".
 * @param {boolean} props.checked - Indicates whether the switch is in the checked state.
 * @param {string} [props.tooltip] - Optional tooltip text displayed when the user hovers over the switch.
 * @param {object} [props.labelProps] - Additional properties for the label component.
 * @param {string} [props.color] - The color of the switch when checked.
 * @param {string} [props.label] - The text label associated with the switch.
 * @param {any} [props.checkedValue] - The value representing the checked state.
 * @param {any} [props.uncheckedValue] - The value representing the unchecked state.
 * @param {any} [props.defaultValue] - The default value of the switch.
 * @param {string} [props.color] - The color of the switch when checked.
 * @param {boolean} [props.disabled] - Flag to indicate if the switch is disabled.
 * @param {boolean} [props.readOnly] - Flag to indicate if the switch is read-only.
 * @param {object} [props.containerProps] - Additional properties for the container component.
 * @param {object} [rest] - Additional props passed to the React Native Switch component.
 *
 * @returns {JSX.Element} - Returns a JSX element representing the Switch component.
 *
 * @example
 * // Usage example of the Switch component
 * import { Switch } from './path/to/Switch';
 *
 * const MyComponent = () => {*
 *   return (
 *     <Switch
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
 * @see [React Native Switch Documentation](https://reactnative.dev/docs/switch) 
 * for more information on the underlying RNSwitch component.
 */
export const Switch = ({ testID, ...props }: ISwitchProps) => {
    const theme = useTheme();
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
    } = useToggleable<SwitchChangeEvent>(props);
    const switchProps = Platform.OS === 'web'
        ? {
            activeTrackColor: onTintColor,
            thumbColor: thumbTintColor,
            activeThumbColor: checkedColor,
        }
        : {
            thumbColor: thumbTintColor,
            trackColor: {
                true: onTintColor,
                false: onTintColor,
            },
        };
    const MTestID = typeof testID === 'string' && testID || "RNSwitchComponent";
    const labelContent = <Label testID={`${MTestID}_Label`} {...labelProps} style={[styles.label, labelProps.style]} children={label} />;
    return <Tooltip as={Pressable} disabled={disabled || readOnly} tooltip={tooltip} testID={`${MTestID}_Container`} {...containerProps} style={[styles.container, disabledStyle, readOnlyStyle, containerProps.style]}
        onPress={(event: GestureResponderEvent) => {
            if (typeof containerProps.onPress == "function") {
                containerProps.onPress(event);
            }
            toggleStatus();
        }}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <RNSwitch
            {...rest}
            value={checked}
            onValueChange={toggleStatus}
            {...switchProps}
            testID={MTestID}
            disabled={disabled || readOnly}
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
    }
});

Switch.displayName = "Switch"