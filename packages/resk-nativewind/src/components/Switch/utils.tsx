"use client";
import { getTextContent, useStateCallback } from "@utils";
import { useEffect, useRef } from "react";
import { IToggleableProps } from "./types";
import { cn } from "@utils/cn";
import { variants } from "@variants/index";

export * from "./types";


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
    containerClassName: cn(variants.all({ disabled }), containerClassName),
    labelClassName: cn(className),
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
