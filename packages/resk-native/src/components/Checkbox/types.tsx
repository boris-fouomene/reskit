import { IFontIconName, IFontIconProps } from '@components/Icon/types';
import { IToggleableProps } from '@components/Switch/types';
import { ITooltipBaseProps } from '@components/Tooltip';
import { SyntheticEvent } from 'react';
import { ColorValue, GestureResponderEvent, NativeSyntheticEvent, TouchableOpacityProps } from "react-native";

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
 * @extends {TouchableOpacityProps} - This extends the `TouchableOpacityProps` type, which includes 
 *                          additional properties and events specific to checkbox components.
 * @extends {ITooltipBaseProps} - This extends the `ITooltipBaseProps` type, which includes title,tootltip, props.
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
export type ICheckboxProps = IToggleableProps<GestureResponderEvent> & ITooltipBaseProps & TouchableOpacityProps & {
    /**
     * Value indicating if the checkbox should be rendered as checked or not.
     * @default false
     */
    value?: boolean;

    /**
     * The tint or color of the checkbox when it is checked. This overrides the disabled opaque style.
     */
    color?: ColorValue;
    /**
     * Callback that is invoked when the user presses the checkbox.
     * @param event A native event containing the checkbox change.
     */
    onChange?: (
        event: NativeSyntheticEvent<CheckboxEvent> | SyntheticEvent<HTMLInputElement, CheckboxEvent>
    ) => void;
    /**
     * Callback that is invoked when the user presses the checkbox.
     * @param value A boolean indicating the new checked state of the checkbox.
     */
    onValueChange?: (value: boolean) => void;

    /**
     * The size of the checkbox in pixels.
     * Default is to 25
     */
    size?: number;

    /**
     * The icon name to display when the checkbox is checked.
     */
    checkedIcon?: IFontIconName;
    /***
     * The icon name to display when the checkbox is unchecked.
     */
    uncheckedIcon?: IFontIconName;

    /***
     * The props of the icon to display as the checkbox.
     */
    iconProps?: Omit<IFontIconProps, "name" | "color" | "size">;

    /***
     * The color of the checkbox when it's unchecked.
     */
    uncheckedColor?: string;
}



export type CheckboxEvent = {
    /**
     * On native platforms, a `NodeHandle` for the element on which the event has occurred.
     * On web, a DOM node on which the event has occurred.
     */
    target: any;
    /**
     * A boolean representing checkbox current value.
     */
    value: boolean;
};
