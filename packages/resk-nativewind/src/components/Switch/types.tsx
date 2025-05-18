import { ReactNode } from "react";
import { SwitchProps } from "react-native";
import { ITooltipBaseProps } from "@components/Tooltip/types";
import { IClassName, IOnChangeOptions } from "@src/types";


/**
 * Represents the options for the onChange function in a toggleable component.
 * This type extends the generic IOnChangeOptions interface and includes
 * specific properties relevant to toggleable components.
 * This type is specifically designed for scenarios where an input can be toggled
 * between two states (e.g., checked/unchecked) and includes methods for managing
 * the state of the input.
 *
 * @template EventType - The type of the event that triggered the change. 
 *                       Defaults to `GestureResponderEvent`, which is commonly used
 *                       in touch interactions in React Native.
 * 
 * @property {EventType} [event] - An optional event object 
 * that represents the event that triggered the onChange action. 
 * This can be useful for handling touch events in mobile applications.
 * 
 * @property {boolean} checked - A boolean value indicating whether the 
 * toggleable component is currently checked (true) or unchecked (false).
 * This property is crucial for determining the current state of the 
 * toggleable component.
 *
 * @extends {IOnChangeOptions} 
* This type extends the `IOnChangeOptions` with specific properties for toggleable inputs.
*
* @example
* // Example usage of IToggleableOnChangeOptions
* const handleToggleChange = (options: IToggleableOnChangeOptions) => {
*   console.log(`Checked: ${options.checked}`);
*   options.setChecked(!options.checked); // Toggle the checked state
*   console.log(`New Checked State: ${options.checked}`);
*   options.setValue('New Value'); // Update the associated value
* };
*
* // Simulating a toggle change event
* handleToggleChange({
*   checked: false,
*   fieldName: 'toggleSwitch',
*   focused: true,
*   previousValue: 'Previous Value',
*   value: 'New Value'
* });
* 
*  * @example
 * const handleToggleChange: IToggleableOnChangeOptions<someGestureEvent> = {
 *     event?: someGestureEvent, // Optional gesture event
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
*
* @returns {void} - This type does not return any value, as it is typically used 
*                   as an argument for an event handler function.
*/
export interface IToggleableOnChangeOptions extends IOnChangeOptions {
    checked: boolean;
    checkedValue?: any;
    uncheckedValue?: any;
};


export interface IToggleableProps extends ITooltipBaseProps {
    /**
     * @type
     * The value assigned to the toggleable 
     * component when it is in a checked state. This can be any type of value.
     */
    checkedValue?: any;
    /**
     * The value assigned to the toggleable 
     * component when it is in an unchecked state. This can be any type of value.
     */
    uncheckedValue?: any;
    /***
     * The default value of the toggleable 
    * component. This can be any type of value.
     */
    defaultValue?: any;

    labelClassName?: IClassName;

    /***
     * The label content for the toggleable component. This can be any type of React node.
     */
    label?: ReactNode;
    /***
     * A boolean indicating whether the 
    * toggleable component is disabled. If true, the component will be 
    * non-interactive.
     */
    disabled?: boolean;

    /**
     * A boolean indicating whether the 
    * toggleable component is read-only. If true, the component's state 
    * cannot be changed by the user.
     */
    readOnly?: boolean;

    /**
     * The label content to display when 
    * the toggleable component is in a checked state. This can be any type of 
    * React node.
     */
    checkedLabel?: ReactNode;
    /**
    * The label content to display 
    * when the toggleable component is in an unchecked state. This can be any 
    * type of React node.
     */
    uncheckedLabel?: ReactNode;
    /**
     * The tooltip content to display 
    * when the toggleable component is in a checked state. This can be any type 
    * of React node.
     */
    checkedTooltip?: ReactNode;
    /**
     * The tooltip content to display 
    * when the toggleable component is in an unchecked state. This can be any 
    * type of React node.
     */
    uncheckedTooltip?: ReactNode;

    /**
     *  The position of the label 
     * relative to the toggleable component. Can be either "left" or "right".
     */
    labelPosition?: "left" | "right";
    /**
     * Custom color for the toggleable component. This can be used to match the component with the application's theme.
     */
    color?: string;

    /**
     * A boolean indicating whether the 
    * toggleable component is in an error state. If true, the component may 
    * display an error message or visual cue.
     */
    error?: boolean;
    /**
     * A callback function invoked before the toggleable component is pressed. the IToggleableOnChangeOptions 
     * as parameters. It can return a boolean value or void. if the function returns false, then the status of the toggleable component will not be modified
     * 
     * @param options {IToggleableOnChangeOptions}
     * @returns {boolean|void}, if false, then the status of the toggleable component will not be modified
     */
    beforeToggle?: (options: IToggleableOnChangeOptions) => boolean | void;

    /**
     * A callback function invoked when the toggleable component's state 
     * changes. This function receives the IToggleableOnChangeOptions as a 
     * parameter.
     * @param options {IToggleableOnChangeOptions}
     * @returns {void}
     */
    onChange?: (options: IToggleableOnChangeOptions) => void;

    containerClassName?: IClassName;

    /***
     * 
    * Callback function called when the value of the toggle changes.
     */
    onValueChange?: (value: boolean) => void;

    className?: IClassName;
};


/**
 * @interface ISwitchProps
 * Represents the props for the Switch component, extending from 
 * IToggleableProps. This type encompasses all properties required 
 * for configuring a Switch, including toggle behavior, labels, 
 * tooltips, and event handling.
 *
 * @extends {SwitchProps} - This extends the React Native `SwitchProps` type, which includes 
 *                          additional properties and events specific to switch components.
 *
 * @example
 * // Example usage of ISwitchProps
 * const MySwitchComponent = (props: ISwitchProps) => {
 *   const handleSwitchChange = (options: IToggleableOnChangeOptions) => {
 *     console.log(`Switch is now: ${options.checked ? 'ON' : 'OFF'}`);
 *   };
 *
 *   return (
 *     <Switch
 *       checkedValue={true}
 *       uncheckedValue={false}
 *       defaultValue={false}
 *       label="Enable Feature"
 *       onChange={handleSwitchChange}
 *       color="green"
 *       disabled={false}
 *       readOnly={false}
     />
 *   );
 * };
 *  
 * @example
 * const switchProps: ISwitchProps = {
 *     checkedValue: true,
 *     uncheckedValue: false,
 *     defaultValue: false,
 *     label: 'Enable Feature',
 *     readOnly: false,
 *     checkedLabel: 'On',
 *     uncheckedLabel: 'Off',
 *     checkedTooltip: 'Feature is enabled',
 *     uncheckedTooltip: 'Feature is disabled',
 *     labelPosition: 'left',
 *     error: false,
 *     beforeToggle: (event, options) => {
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
 * @returns {void} - This type does not return any value, as it is typically used 
 *                   as a set of properties for a switch component.
 */
export type ISwitchProps = IToggleableProps & SwitchProps;