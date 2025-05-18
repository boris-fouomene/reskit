"use client";
import { getTextContent, useStateCallback } from "@utils";
import { useEffect, useRef } from "react";
import { IToggleableProps } from "./types";
import { cn } from "@utils/cn";
import { variants } from "@variants/index";

export * from "./types";


/**
 * A custom hook for managing the state and behavior of a toggleable component.
 * This hook provides functionality for toggling between checked and unchecked states,
 * handling events, and managing tooltip display.
 *
 * @param {IToggleableProps} props - The properties for the toggleable component.
 * @param {boolean} [props.disabled] - whether the toggleable component is disabled. If true, the component will be non-interactive.
 * @param {ReactNode} [props.checkedTooltip] - Tooltip content to display when the toggleable component is in a checked state.
 * @param {ReactNode} [props.uncheckedTooltip] -  Tooltip content to display when the toggleable component is in an unchecked state.
 * @param {ReactNode} [props.tooltip] - Default tooltip to display.
 * @param {string} [props.title] - The title for the toggleable component, used in tooltips.
 * @param {string} [props.color] - Custom color for the toggleable component.
 * @param {boolean} [props.readOnly] - Indicates whether the toggle is read-only.
 * @param {"left" | "right"} [props.labelPosition] - The position of the label relative to the toggleable component.
 * @param {(options: IToggleableOnChangeOptions) => boolean | void} [props.beforeToggle] - Callback function called when the toggle is pressed.
 * @param {(options: IToggleableOnChangeOptions<EventType>) => void} [props.onChange] - 
 * Callback function called when the toggle value changes.
 * @param {ReactNode} [props.label] - The label displayed next to the toggle.
 * @param {ReactNode} [props.checkedLabel] - The label displayed when the toggle is checked.
 * @param {ReactNode} [props.uncheckedLabel] - The label displayed when the toggle is unchecked.
 * @param {ILabelProps} [props.labelProps] - Optional props for the label associated with the toggleable component.
 * @param {(value:boolean)=>void} [onValueChange] - Callback function called when the value of the toggle changes.
 * 
 * @returns {object} An object containing the state and methods for managing the toggleable component.
 * 
 * @returns {boolean} checked - Indicates whether the toggle is currently checked
 * @returns {() => void} toggleStatus - A function for toggling the toggleable component
 * @returns {() => boolean} getValue - A function for getting the current value of the toggleable component
 * @returns {() => boolean} setValue - A function for setting the value of the toggleable component
 * @returns {() => void} onChange - A function for setting the callback function for changes in the toggleable component
 * @returns {ReactNode} label - The label displayed next to the toggle
 * @returns {boolean} isLabelOnLeftSide - A boolean indicating whether the label is on the left side of the toggleable component
 * @returns {any} checkedValue - The value of the toggleable component when it is checked
 * @returns {any} uncheckedValue - The value of the toggleable component when it is unchecked
 * @returns {any} defaultValue - The default value of the toggleable component
 * @returns {boolean} disabled - A boolean indicating whether the toggleable component is disabled.
 */
export function useToggleable({ disabled, className, checkedTooltip, onValueChange, uncheckedTooltip, tooltip, title, color, readOnly, labelPosition, beforeToggle, onChange, label, checkedLabel, uncheckedLabel, labelClassName, containerClassName, ...rest }: IToggleableProps) {
  const { checkedValue, uncheckedValue, defaultValue } = getToggleableDefaultValues(rest);
  const eventRef = useRef(null);
  const [checked, setChecked] = useStateCallback(defaultValue === checkedValue ? true : false);
  const getValue = () => {
    return checked ? checkedValue : uncheckedValue;
  };
  const toggleStatus = () => {
    if (disabled || readOnly) return;
    if (typeof beforeToggle === "function" && beforeToggle({ checked, checkedValue, uncheckedValue, value: getValue() }) === false) {
      return;
    }
    const isChecked = !checked;
    const value = checked ? uncheckedValue : checkedValue;
    setChecked(!checked, () => {
      if (typeof onValueChange === "function") {
        onValueChange(isChecked);
      }
      if (typeof onChange === "function" && eventRef.current) {
        onChange({ checked: isChecked, checkedValue, uncheckedValue, event: eventRef.current, value });
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
  const isLabelOnLeftSide = labelPosition === "left";
  checkedTooltip = getTextContent(checkedTooltip) && checkedTooltip || title;
  uncheckedTooltip = getTextContent(uncheckedTooltip) && uncheckedTooltip || title;
  return {
    ...rest,
    className: cn(variants.all({ disabled }), className),
    containerClassName: cn(variants.all({ disabled }), "flex flex-row self-start items-center justify-start", containerClassName),
    labelClassName: cn(!disabled && "select-text mx-[7px]", className),
    checked,
    labelPosition,
    tooltip: (checked ? checkedTooltip : uncheckedTooltip) || tooltip || title,
    setChecked,
    toggleStatus,
    getValue,
    readOnly,
    setValue,
    onChange: (event: any) => {
      eventRef.current = event;
    },
    label: checked ? checkedLabel || label : uncheckedLabel || label || null,
    isLabelOnLeftSide,
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
  let checkedValue = props?.checkedValue, uncheckedValue = props?.uncheckedValue, defaultValue = props?.defaultValue;
  if (checkedValue === undefined) {
    checkedValue = typeof defaultValue === 'boolean' ? true : 1;
  }
  if (uncheckedValue === undefined) {
    uncheckedValue = typeof defaultValue === 'boolean' ? false : 0;
  }
  return {
    checkedValue,
    uncheckedValue,
    defaultValue: [checkedValue, uncheckedValue].includes(props?.defaultValue) ? props?.defaultValue : uncheckedValue,
  };
};
