import { ReactNode } from "react";
import { SwitchProps } from "react-native";
import { ITooltipBaseProps } from "@components/Tooltip/types";
import { IClassName, IOnChangeOptions } from "@src/types";


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
    checkedTitle?: ReactNode;
    /**
     * The tooltip content to display 
    * when the toggleable component is in an unchecked state. This can be any 
    * type of React node.
     */
    uncheckedTitle?: ReactNode;

    /**
     *  The position of the label 
     * relative to the toggleable component. Can be either "left" or "right".
     */
    labelPosition?: "left" | "right";

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

    /**
     * The class name of the Toggleable component.
     */
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
 *     checkedTitle: 'Feature is enabled',
 *     uncheckedTitle: 'Feature is disabled',
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
export interface ISwitchProps extends IToggleableProps, Omit<SwitchProps, "className" | "onChange" | "onValueChange"> {
    /***
     * The class name of the thumb color.
     * The thum color is the color of the foreground switch grip. If this is set on iOS, the switch grip will lose its drop shadow.
     */
    thumbColorClassName?: IClassName;
}