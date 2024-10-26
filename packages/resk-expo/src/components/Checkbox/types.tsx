import { IToggleableProps } from '@components/Switch/types';
import Checkbox, { CheckboxProps, CheckboxEvent } from 'expo-checkbox';
import { SyntheticEvent } from 'react';
import { NativeSyntheticEvent } from "react-native";




/**
 * @interface ICheckboxProps
 * Represents the props for the Checkbox component, extending from 
 * IToggleableProps. This type encompasses all properties required 
 * for configuring a Checkbox, including toggle behavior, labels, 
 * tooltips, and event handling.
 *
 * @extends {IToggleableProps<CheckboxChangeEvent>} - This extends the `IToggleableProps` 
 *                                                type, which provides the base properties 
 *                                                for toggleable inputs, specifically for 
 *                                                switch components. It inherits all properties from IToggleableProps, ensuring that the Checkbox component has access to all toggleable functionality.
 * 
 *
 * @extends {CheckboxProps} - This extends the expo-checkbox `CheckboxProps` type, which includes 
 *                          additional properties and events specific to switch components.
 *
 * @example
 * // Example usage of ICheckboxProps
 * const MyCheckboxComponent = (props: ICheckboxProps) => {
 *   const handleCheckboxChange = (options: IToggleableOnChangeOptions<CheckboxChangeEvent>) => {
 *     console.log(`Checkbox is now: ${options.checked ? 'ON' : 'OFF'}`);
 *   };
 *
 *   return (
 *     <Checkbox
 *       checkedValue={true}
 *       uncheckedValue={false}
 *       defaultValue={false}
 *       label="Enable Feature"
 *       onChange={handleCheckboxChange}
 *       color="green"
 *       disabled={false}
 *       readOnly={false}
     />
 *   );
 * };
 *  
 * @example
 * const switchProps: ICheckboxProps = {
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
 *         console.log('Checkbox pressed:', event, options);
 *     },
 *     onChange: (options) => {
 *         console.log('Checkbox state changed:', options);
 *     }
 * };
 * 
 * This example demonstrates how to implement the ICheckboxProps type, 
 * providing a clear structure for configuring a Checkbox component 
 * with toggleable properties.
 * @returns {void} - This type does not return any value, as it is typically used 
 *                   as a set of properties for a switch component.
 */
export type ICheckboxProps = IToggleableProps<ICheckboxEvent> & CheckboxProps;

export type ICheckboxEvent = NativeSyntheticEvent<CheckboxEvent> | SyntheticEvent<HTMLInputElement, CheckboxEvent>;