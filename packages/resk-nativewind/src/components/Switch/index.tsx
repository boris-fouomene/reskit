"use client";
import { TouchableOpacityProps, Switch as RNSwitch, GestureResponderEvent } from "react-native";
import { ISwitchProps } from "./types";
import { useToggleable, getToggleableDefaultValues } from "./utils";
import { Tooltip } from "@components/Tooltip";
import { Text } from "@html/Text";
import { cn } from "@utils/cn";
import { pickTouchableProps } from "@utils/touchHandler";
import { cssInterop } from "nativewind";

export { useToggleable };
export * from "./types";



const SwitchInterop = cssInterop(RNSwitch, {
    thumbColorClassName: {
        target: false,
        nativeStyleToProp: {
            color: "thumbColor",
            backgroundColor: "thumbColor",
        }
    },
});

/**
 * A customizable Switch component that supports tooltip, labels, and toggle functionality.
 *
 * This component wraps the `Switch` from React Native and enhances its usability by providing
 * optional tooltips and labels. It allows users to toggle between checked and unchecked states
 * easily, making it suitable for various applications such as settings, forms, and toggle controls.
 *
 * @param {object} props - The properties for the Switch component.
 * @param {string} [props.testID] - Optional test identifier for testing purposes. Defaults to "resk-switch".
 * @param {boolean} props.checked - Indicates whether the switch is in the checked state.
 * @param {string} [props.title] - Optional tooltip text displayed when the user hovers over the switch.
 * @param {JSX.Element} [props.label] - The text label associated with the switch.
 * @param {boolean} [props.isLabelOnLeftSide] - Indicates whether the label should be on the left side of the switch.
 * @param {any} [props.checkedValue] - The value representing the checked state.
 * @param {any} [props.uncheckedValue] - The value representing the unchecked state.
 * @param {any} [props.defaultValue] - The default value of the switch.
 * @param {boolean} [props.disabled] - Flag to indicate if the switch is disabled.
 * @param {boolean} [props.readOnly] - Flag to indicate if the switch is read-only.
 * @param {string} [props.className] - The tailwind CSS class names for the switch component.
 * @param {string} [props.containerClassName] - The tailwind CSS class names for the container component.
 * @param {string} [props.labelClassName] - The tailwind CSS class names for the label component.
 * @param {any} [rest] - Additional props passed to the React Native Switch component.
 *
 * @returns {JSX.Element} - Returns a JSX element representing the Switch component.
 *
 * @example
 * // Usage example of the Switch component
 * import { Switch } from './path/to/Switch';
 *
 * const MyComponent = () => {
 *   return (
 *     <Switch
 *       defaultValue={true}
 *       title="Toggle to receive notifications"
 *       label="Enable Notifications"
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
 * @example
 * import { Switch } from '@resk/nativewind';
 * <Switch 
 *     {...{
 *   title: "Toggle to receive notifications",
 *   label: "Enable Notifications",
 *   color: "#4CAF50",
 *   disabled: false,
 *   readOnly: false,
 *   defaultValue: true,
 *   onChange: (options) => {
 *     console.log(options);
 *   }}
 * />
 */
export function Switch({ testID, ...props }: ISwitchProps) {
    const {
        checked,
        title,
        setChecked,
        toggleStatus,
        getValue,
        setValue,
        label,
        isLabelOnLeftSide,
        checkedValue,
        uncheckedValue,
        defaultValue,
        disabled,
        className,
        readOnly,
        containerClassName,
        labelClassName,
        ...rest
    } = useToggleable(props);
    const { touchableProps, ...nonTouchableProps } = pickTouchableProps(rest as any);
    const MTestID = typeof testID === 'string' && testID || "resk-switch";
    const labelContent = <Text testID={`${MTestID}-label`} children={label} className={labelClassName} />;
    return <Tooltip<TouchableOpacityProps> disabled={disabled || readOnly} title={title} testID={`${MTestID}-container`}
        {...touchableProps as any}
        onPress={(event: GestureResponderEvent) => {
            toggleStatus();
        }}
        className={cn(containerClassName)}
    >
        {isLabelOnLeftSide ? labelContent : null}
        <SwitchInterop
            {...nonTouchableProps}
            className={cn(className)}
            value={checked}
            onValueChange={toggleStatus}
            testID={MTestID}
            disabled={disabled || readOnly}
        />
        {!isLabelOnLeftSide ? labelContent : null}
    </Tooltip>
}
Switch.getToogleableDefaultValues = getToggleableDefaultValues;
Switch.displayName = "Switch"