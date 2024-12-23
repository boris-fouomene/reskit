import { ILabelProps } from "@components/Label";
import { ReactNode } from "react";
import { GestureResponderEvent, PressableProps, SwitchChangeEvent, SwitchProps } from "react-native";
import { ITooltipBaseProps } from "@components/Tooltip/types";
import { IOnChangeOptions } from "@src/types";



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
*   setChecked: (value: boolean) => console.log(`Checked state set to: ${value}`),
*   setValue: (value: any) => console.log(`Value set to: ${value}`),
*   event: { type: 'gesture', target: { value: 'Toggle' } },
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
export type IToggleableOnChangeOptions<EventType = GestureResponderEvent> = IOnChangeOptions<EventType> & {
    checked: boolean;
    setChecked: (value: boolean) => void;
    setValue: (value: any) => any;
    event?: EventType
};


/**
 * @interface IToggleableProps
 * 
 * Represents the properties for a toggleable component.
 * This type defines the configuration options for a toggleable input,
 * allowing for customization of its appearance, behavior, and event handling.
 * This type also extends ITooltipBaseProps for tooltip functionality.
 *
 * @template EventType - The type of the event that triggers the toggle action.
 *                       Defaults to `GestureResponderEvent`, which is commonly used
 *                       in touch interactions in React Native.
 *
 * @property {any} [checkedValue] - The value assigned to the toggle when it is checked.
 *                                    This can be any type, allowing for flexible usage.
 *
 * @property {any} [uncheckedValue] - The value assigned to the toggle when it is unchecked.
 *                                      This can also be any type, providing flexibility.
 *
 * @property {any} [defaultValue] - The initial value of the toggle when it is rendered.
 *                                   This can be set to either the checked or unchecked value.
 *
 * @property {ILabelProps} [labelProps] - Additional properties for customizing the label.
 *                                          This can include styling and accessibility options.
 *
 * @property {ReactNode} [label] - The label displayed next to the toggle. This can be 
 *                                  a string or any React node.
 *
 * @property {boolean} [disabled] - Indicates whether the toggle is disabled. If true,
 *                                   the toggle cannot be interacted with.
 *
 * @property {boolean} [readOnly] - Indicates whether the toggle is read-only. If true,
 *                                   the toggle can be displayed but not changed.
 *
 * @property {ReactNode} [checkedLabel] - The label displayed when the toggle is checked.
 *                                         This can be a string or any React node.
 *
 * @property {ReactNode} [uncheckedLabel] - The label displayed when the toggle is unchecked.
 *                                           This can be a string or any React node.
 *
 * @property {ReactNode} [checkedTooltip] - A tooltip displayed when hovering over the 
 *                                           checked state. This can provide additional 
 *                                           information about the toggle's function.
 *
 * @property {ReactNode} [uncheckedTooltip] - A tooltip displayed when hovering over the 
 *                                             unchecked state. This can also provide 
 *                                             additional information.
 *
 * @property {"left" | "right"} [labelPosition] - Specifies the position of the label 
 *                                                  relative to the toggle. Can be set 
 *                                                  to "left" or "right".
 *
 * @property {string} [color] - Custom color for the toggleable component. This can 
 *                              be used to match the component with the application's theme.
 *
 * @property {boolean} [error] - Indicates whether there is an error state associated 
 *                                with the toggle. If true, this can trigger error 
 *                                styling or behavior.
 * 
 * @property {(value:boolean)=>void} [onValueChange] - Callback function called when the value of the toggle changes.
 *
 * @property {(options: IToggleableOnChangeOptions) => boolean | void} [beforeToggle] - 
 * - A callback function invoked before the toggleable component is pressed. the IToggleableOnChangeOptions 
 * as parameters. It can return a boolean value or void.  the boolean value indicate whether the event should be further processed.
 * if the function returns false, then the status of the toggleable component will not be modified
 *
 * @property {(options: IToggleableOnChangeOptions<EventType>) => void} [onChange] - 
 * Callback function that is called when the toggle value changes. It receives the 
 * current options as a parameter, allowing the parent component to respond to the change.
 *
 * @extends {ITooltipBaseProps} - This type extends the `ITooltipBaseProps`, allowing 
 *                                 for tooltip functionality in the toggleable component.
 *
 * @example
 * // Example usage of IToggleableProps
 * const MyToggleableComponent = (props: IToggleableProps) => {
 *   const handleToggleChange = (options: IToggleableOnChangeOptions) => {
 *     console.log(`New Checked State: ${options.checked}`);
 *   };
 *
 *   return (
 *     <Toggleable
 *       checkedValue={true}
 *       uncheckedValue={false}
 *       defaultValue={false}
 *       label="Toggle Me"
 *       onChange={handleToggleChange}
 *       beforeToggle={(event, options) => {
 *         console.log('Toggle pressed', options);
 *         return true; // Allows further processing
 *       }}
 *       color="blue"
 *       labelPosition="right"
 *     />
 *   );
 * };
 *  * @example
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
 *     beforeToggle: (event, options) => {
 *         console.log('Pressed:', event, options);
 *         //the toggleable value won't modify
 *         return false;
 *     },
 * };
 * 
 * This example demonstrates how to implement the IToggleableProps type, 
 * providing a clear structure for configuring a toggleable component.
 * 
 * @returns {void} - This type does not return any value, as it is typically used 
 *                   as a set of properties for a toggleable component.
 */
export type IToggleableProps<EventType = GestureResponderEvent> = {
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

    /**
     * Optional props for the label associated with the toggleable component.
     */
    labelProps?: ILabelProps;
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
    onChange?: (options: IToggleableOnChangeOptions<EventType>) => void;

    /**
     * The container props that wrap the toggleable component. This is the parent view of both the toggleable component and the label.
     */
    containerProps?: PressableProps;

    /***
     * 
    * Callback function called when the value of the toggle changes.
     */
    onValueChange?: (value: boolean) => void;
} & ITooltipBaseProps;


/**
 * @interface ISwitchProps
 * Represents the props for the Switch component, extending from 
 * IToggleableProps. This type encompasses all properties required 
 * for configuring a Switch, including toggle behavior, labels, 
 * tooltips, and event handling.
 *
 * @extends {IToggleableProps<SwitchChangeEvent>} - This extends the `IToggleableProps` 
 *                                                type, which provides the base properties 
 *                                                for toggleable inputs, specifically for 
 *                                                switch components. It inherits all properties from IToggleableProps, ensuring that the Switch component has access to all toggleable functionality.
 * 
 *
 * @extends {SwitchProps} - This extends the React Native `SwitchProps` type, which includes 
 *                          additional properties and events specific to switch components.
 *
 * @example
 * // Example usage of ISwitchProps
 * const MySwitchComponent = (props: ISwitchProps) => {
 *   const handleSwitchChange = (options: IToggleableOnChangeOptions<SwitchChangeEvent>) => {
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
export type ISwitchProps = IToggleableProps<SwitchChangeEvent> & SwitchProps;