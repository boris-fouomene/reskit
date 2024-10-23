import { getTextContent, usePrevious, useStateCallback } from "@utils";
import Theme, { useTheme } from "@theme";
import React, { useEffect } from "react";
import { GestureResponderEvent } from "react-native";
import { IToggleableProps } from "./types";
import { getToggleableColor } from "./colors";

export * from "./types";


/**
 * Custom hook that manages the state and behavior of a toggleable component.
 * It provides the functionality to toggle between checked and unchecked states,
 * handle events, and manage tooltips and labels.
 *
 * @param {IToggleableProps} props - The properties for the toggleable component.
 * 
 * @property {boolean} [props.disabled] - Indicates whether the toggleable 
 * component is disabled. If true, the component will be non-interactive.
 * 
 * @property {ReactNode} [props.checkedTooltip] - Tooltip content to display 
 * when the toggleable component is in a checked state.
 * 
 * @property {ReactNode} [props.uncheckedTooltip] - Tooltip content to display 
 * when the toggleable component is in an unchecked state.
 * 
 * @property {ReactNode} [props.tooltip] - Default tooltip content.
 * 
 * @property {string} [props.title] - The title for the toggleable component, 
 * used in tooltips.
 * 
 * @property {"left" | "right"} [props.labelPosition] - The position of the label 
 * relative to the toggleable component.
 * 
 * @property {boolean} [props.readOnly] - Indicates whether the toggleable 
 * component is read-only. If true, the component's state cannot be changed by 
 * the user.
 * 
 * @property {(event: GestureResponderEvent, options: IToggleableOnChangeOptions) => boolean | void} [props.onPress] 
 * - Callback function invoked when the toggleable component is pressed. 
 * It receives the gesture event and the current options.
 * 
 * @property {(options: IToggleableOnChangeOptions) => void} [props.onChange] 
 * - Callback function invoked when the toggleable component's state changes. 
 * It receives the current options.
 * 
 * @property {ReactNode} [props.label] - The label content for the toggleable 
 * component.
 * 
 * @property {ReactNode} [props.checkedLabel] - The label content to display 
 * when the component is checked.
 * 
 * @property {ReactNode} [props.uncheckedLabel] - The label content to display 
 * when the component is unchecked.
 * 
 * @property {ILabelProps} [props.labelProps] - Optional props for the label 
 * associated with the toggleable component.
 * 
 * @returns {object} - An object containing the following properties:
 * 
 * @returns {boolean} checked - The current checked state of the toggleable component.
 * 
 * @returns {ReactNode} tooltip - The tooltip content to display based on the 
 * current checked state.
 * 
 * @returns {function} setChecked - Function to update the checked state.
 * 
 * @returns {function} toggleStatus - Function to toggle the current state 
 * of the toggleable component.
 * 
 * @returns {function} getValue - Function to get the current value based 
 * on the checked state.
 * 
 * @returns {function} setValue - Function to set the value based on the 
 * provided default value.
 * 
 * @returns {ReactNode} label - The label content to display based on 
 * the current checked state.
 * 
 * @returns {boolean} isLabelOnLeftSide - Boolean indicating if the label 
 * is positioned to the left.
 * 
 * @returns {object} disabledStyle - Style object for disabled state.
 * 
 * @returns {object} readOnlyStyle - Style object for read-only state.
 * 
 * @example
 * const { checked, toggleStatus, tooltip } = useToggleable({
 *     disabled: false,
 *     checkedTooltip: 'Enabled',
 *     uncheckedTooltip: 'Disabled',
 *     title: 'Toggle Feature',
 *     labelPosition: 'left',
 *     onPress: (event, options) => {
 *         console.log('Toggle pressed:', options);
 *     },
 *     onChange: (options) => {
 *         console.log('Toggle state changed:', options);
 *     },
 *     label: 'Feature',
 *     checkedLabel: 'On',
 *     uncheckedLabel: 'Off',
 * });
 * 
 * This example demonstrates how to use the useToggleable hook to manage 
 * the state and behavior of a toggleable component, including event handling 
 * and tooltip management.
 */
export function useToggleable<EventType = GestureResponderEvent>({ disabled, checkedTooltip, uncheckedTooltip, tooltip, title, color, readOnly, labelPosition, onPress, onChange, label, checkedLabel, uncheckedLabel, labelProps, ...rest }: IToggleableProps<EventType>) {
  const { checkedValue, uncheckedValue, defaultValue } = getToggleableDefaultValues(rest);
  const theme = useTheme();
  const [checked, setChecked] = useStateCallback(defaultValue === checkedValue ? true : false);
  const getValue = () => {
    return checked ? checkedValue : uncheckedValue;
  };
  /**
   * fonction pour basculer l'etat de la case a cocher
   */
  const toggleStatus = (event: EventType) => {
    if (disabled || readOnly) return;
    if (typeof onPress === "function" && onPress(event as GestureResponderEvent, { checked, setChecked, setValue, value: getValue() }) === false) {
      return;
    }
    const isChecked = !checked;
    const value = checked ? uncheckedValue : checkedValue;
    setChecked(!checked, () => {
      if (onChange) {
        onChange({ checked: isChecked, event, setValue, setChecked, value });
      }
    });
  };
  const setValue = (defaultValue?: any) => {
    const isChecked = defaultValue === checkedValue;
    if (isChecked === checked) return;
    setChecked(isChecked);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  labelProps = Object.assign({}, labelProps);
  const isLabelOnLeftSide = labelPosition !== "right";
  const disabledStyle = disabled && Theme.styles.disabled;
  const readOnlyStyle = readOnly ? Theme.styles.readOnly : undefined;
  checkedTooltip = getTextContent(checkedTooltip) && checkedTooltip || title;
  uncheckedTooltip = getTextContent(uncheckedTooltip) && uncheckedTooltip || title;
  return {
    ...rest,
    ...getToggleableColor({ ...rest, theme, value: defaultValue, color, disabled: !!(disabled || readOnly) }),
    checked,
    tooltip: (checked ? checkedTooltip : uncheckedTooltip) || tooltip || title,
    setChecked,
    toggleStatus,
    getValue,
    setValue,
    label: checked ? checkedLabel || label : uncheckedLabel || label || null,
    isLabelOnLeftSide,
    disabledStyle,
    readOnlyStyle,
    checkedValue,
    uncheckedValue,
    defaultValue,
    disabled: !!(disabled || readOnly)
  };
};

/***
 * Retrieves the default values for a toggleable component based on the provided props.
 * This function ensures that the checked and unchecked values are set to sensible defaults 
 * if they are not explicitly provided in the props.
 *
 * @param {IToggleableProps} props - The properties for the toggleable component.
 * 
 * @property {any} [props.checkedValue] - The value assigned to the toggleable 
 * component when it is in a checked state. Defaults to 1 if not provided.
 * 
 * @property {any} [props.uncheckedValue] - The value assigned to the toggleable 
 * component when it is in an unchecked state. Defaults to 0 if not provided.
 * 
 * @property {any} [props.defaultValue] - The default value of the toggleable 
 * component. If this value is not one of the checked or unchecked values, 
 * it will default to the unchecked value.
 * 
 * @returns {object} - An object containing the following properties:
 * 
 * @returns {any} checkedValue - The checked value for the toggleable component.
 * 
 * @returns {any} uncheckedValue - The unchecked value for the toggleable component.
 * 
 * @returns {any} defaultValue - The default value for the toggleable component, 
 * which is either the provided default value or the unchecked value if the 
 * provided default is not valid.
 * @returns {string} onTintColor the color that the toggle will display when it is in the "on" state (i.e., when the toggle is activated or checked). It is typically used to visually indicate that the toggle is active.
 * Usage: it's often applied to the track of the toggle switch, providing a clear visual cue to the user that the toggle is in the "on" position.
   The color can vary based on the application's theme (light or dark) and the toggle's state (enabled or disabled).
  
 * @returns {string} thumbTintColor - It's defines the color of the thumb (the draggable part) of the toggle switch. It is the visual element that the user interacts with to change the toggle's state.
    Usage: The thumb color can change based on whether the toggle is enabled or disabled and whether it is in the "on" or "off" state. A clear distinction in color helps users identify the current state of the toggle easily.
 * @returns {string} checkedColor - It specifies the color to use when the toggle is in the "checked" state. It serves as a reference for what color should be displayed when the toggle is activated.
    Usage : It can be customized by the developer or designer, allowing for flexibility in the appearance of the toggle.
    It is particularly useful in themes where the default colors may not fit the desired aesthetic.
  @example
 * const props: IToggleableProps = {
 *     checkedValue: true,
 *     uncheckedValue: false,
 *     defaultValue: true,
 * };
 * 
 * const { checkedValue, uncheckedValue, defaultValue } = getToggleableDefaultValues(props);
 * console.log(checkedValue); // true
 * console.log(uncheckedValue); // false
 * console.log(defaultValue); // true
 */
export const getToggleableDefaultValues = (props: IToggleableProps) => {
  const checkedValue = props?.checkedValue !== undefined ? props?.checkedValue : 1;
  const uncheckedValue = props?.uncheckedValue !== undefined ? props?.uncheckedValue : 0;
  return {
    checkedValue,
    uncheckedValue,
    defaultValue: [checkedValue, uncheckedValue].includes(props?.defaultValue) ? props?.defaultValue : uncheckedValue,
  };
};
