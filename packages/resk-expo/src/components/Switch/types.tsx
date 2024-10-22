import { ILabelProps } from "@components/Label";
import { ReactNode } from "react";
import { GestureResponderEvent, PressableProps, SwitchProps } from "react-native";
import { ITooltipProps } from "@components/Tooltip/types";
import { IOnChangeOptions } from "@src/types";
import { ILabelOrLeftOrRightProps } from "@hooks/index";


/***
 * Represents the options for the onChange function in a toggleable component.
 * This type extends the generic IOnChangeOptions interface and includes
 * specific properties relevant to toggleable components.
 *
 * @template T - The type of additional options that can be specified.
 * 
 * @property {GestureResponderEvent} [event] - An optional event object 
 * that represents the gesture event that triggered the onChange action. 
 * This can be useful for handling touch events in mobile applications.
 * 
 * @property {boolean} checked - A boolean value indicating whether the 
 * toggleable component is currently checked (true) or unchecked (false).
 * This property is crucial for determining the current state of the 
 * toggleable component.
 * 
 * @property {(value: boolean) => void} setChecked - A callback function 
 * that updates the checked state of the toggleable component. It takes 
 * a boolean value as a parameter, where `true` sets the component to 
 * checked, and `false` sets it to unchecked.
 * 
 * @property {(value: any) => any} setValue - A callback function that 
 * allows for updating the value of the toggleable component. This function 
 * can accept any type of value, making it versatile for various use cases.
 * 
 * @example
 * const handleToggleChange: IToggleableOnChangeOptions = {
 *     event: someGestureEvent, // Optional gesture event
 *     checked: true,            // The toggle is currently checked
 *     setChecked: (value: boolean) => {
 *         console.log(`Checked state set to: ${value}`);
 *     },
 *     setValue: (value: any) => {
 *         console.log(`Value updated to: ${value}`);
 *         return value; // Return the updated value
 *     }
 * };
 * 
 * This example demonstrates how to implement the IToggleableOnChangeOptions 
 * type, providing a clear structure for handling changes in a toggleable 
 * component's state.
 */
export type IToggleableOnChangeOptions = IOnChangeOptions<{
    event?: GestureResponderEvent;
    checked: boolean;
    setChecked: (value: boolean) => void;
    setValue: (value: any) => any;
}>;


/**
 * Represents the props for a toggleable component, combining properties from 
 * ILabelOrLeftOrRightProps and additional specific properties for toggleable 
 * components. This type also extends ITooltipProps for tooltip functionality.
 *
 * @template T - The type of additional options that can be specified.
 * 
 * @property {any} [checkedValue] - The value assigned to the toggleable 
 * component when it is in a checked state. This can be any type of value.
 * 
 * @property {any} [uncheckedValue] - The value assigned to the toggleable 
 * component when it is in an unchecked state. This can be any type of value.
 * 
 * @property {any} [defaultValue] - The default value of the toggleable 
 * component. This can be any type of value.
 * 
 * @property {ILabelProps} [labelProps] - Optional props for the label 
 * associated with the toggleable component.
 * 
 * @property {ReactNode} [label] - The label content for the toggleable 
 * component. This can be any type of React node.
 * 
 * @property {boolean} [disabled] - A boolean indicating whether the 
 * toggleable component is disabled. If true, the component will be 
 * non-interactive.
 * 
 * @property {boolean} [readOnly] - A boolean indicating whether the 
 * toggleable component is read-only. If true, the component's state 
 * cannot be changed by the user.
 * 
 * @property {ReactNode} [checkedLabel] - The label content to display when 
 * the toggleable component is in a checked state. This can be any type of 
 * React node.
 * 
 * @property {ReactNode} [uncheckedLabel] - The label content to display 
 * when the toggleable component is in an unchecked state. This can be any 
 * type of React node.
 * 
 * @property {ReactNode} [checkedTooltip] - The tooltip content to display 
 * when the toggleable component is in a checked state. This can be any type 
 * of React node.
 * 
 * @property {ReactNode} [uncheckedTooltip] - The tooltip content to display 
 * when the toggleable component is in an unchecked state. This can be any 
 * type of React node.
 * 
 * @property {"left" | "right"} [labelPosition] - The position of the label 
 * relative to the toggleable component. Can be either "left" or "right".
 * 
 * @property {boolean} [error] - A boolean indicating whether the 
 * toggleable component is in an error state. If true, the component may 
 * display an error message or visual cue.
 * 
 * @property {(event: GestureResponderEvent, options: IToggleableOnChangeOptions) => boolean | void} [onPress] 
 * - A callback function invoked when the toggleable component is pressed. 
 * This function receives the gesture event and the IToggleableOnChangeOptions 
 * as parameters. It can return a boolean value or void.
 * 
 * @property {(options: IToggleableOnChangeOptions) => void} [onChange] 
 * - A callback function invoked when the toggleable component's state 
 * changes. This function receives the IToggleableOnChangeOptions as a 
 * parameter.
 * 
 * @example
 * const toggleableProps: IToggleableProps = {
 *     checkedValue: true,
 *     uncheckedValue: false,
 *     defaultValue: true,
 *     label: 'Toggle me',
 *     disabled: false,
 *     readOnly: false,
 *     checkedLabel: 'Checked',
 *     uncheckedLabel: 'Unchecked',
 *     checkedTooltip: 'This is checked',
 *     uncheckedTooltip: 'This is unchecked',
 *     labelPosition: 'right',
 *     error: false,
 *     onPress: (event, options) => {
 *         console.log('Pressed:', event, options);
 *     },
 *     onChange: (options) => {
 *         console.log('Changed:', options);
 *     }
 * };
 * 
 * This example demonstrates how to implement the IToggleableProps type, 
 * providing a clear structure for configuring a toggleable component.
 */
export type IToggleableProps = {
    checkedValue?: any;
    uncheckedValue?: any;
    defaultValue?: any;
    labelProps?: ILabelProps;
    label?: ReactNode;
    disabled?: boolean;
    readOnly?: boolean;
    checkedLabel?: ReactNode;
    uncheckedLabel?: ReactNode;
    checkedTooltip?: ReactNode;
    uncheckedTooltip?: ReactNode;
    labelPosition?: "left " | "right";
    error?: boolean;
    onPress?: (event: GestureResponderEvent, options: IToggleableOnChangeOptions) => boolean | void;
    onChange?: (options: IToggleableOnChangeOptions) => void;
} & ITooltipProps;


/***
 * @interface ISwitchProps
 * Represents the props for the Switch component, extending from 
 * IToggleableProps. This type encompasses all properties required 
 * for configuring a Switch, including toggle behavior, labels, 
 * tooltips, and event handling.
 *
 * @extends IToggleableProps - This type inherits all properties 
 * from IToggleableProps, ensuring that the Switch component 
 * has access to all toggleable functionality.
 * 
 * @example
 * const switchProps: ISwitchProps = {
 *     checkedValue: true,
 *     uncheckedValue: false,
 *     defaultValue: false,
 *     label: 'Enable Feature',
 *     disabled: false,
 *     readOnly: false,
 *     checkedLabel: 'On',
 *     uncheckedLabel: 'Off',
 *     checkedTooltip: 'Feature is enabled',
 *     uncheckedTooltip: 'Feature is disabled',
 *     labelPosition: 'left',
 *     error: false,
 *     onPress: (event, options) => {
 *         console.log('Switch pressed:', event, options);
 *     },
 *     onChange: (options) => {
 *         console.log('Switch state changed:', options);
 *     }
 * };
 * 
 * This example demonstrates how to implement the ISwitchProps type, 
 * providing a clear structure for configuring a Switch component 
 * with toggleable properties.
 */
export type ISwitchProps = IToggleableProps;