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
 * @param {ReactNode} [props.checkedTitle] - Tooltip content to display when the toggleable component is in a checked state.
 * @param {ReactNode} [props.uncheckedTitle] -  Tooltip content to display when the toggleable component is in an unchecked state.
 * @param {ReactNode} [props.title] - Default tooltip to display.
 * @param {string} [props.title] - The title for the toggleable component, used in tooltips.
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
export function useToggleable({ disabled, className, checkedTitle, onValueChange, uncheckedTitle, title, readOnly, labelPosition, beforeToggle, onChange, label, checkedLabel, uncheckedLabel, labelClassName, containerClassName, ...rest }: IToggleableProps) {
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
  checkedTitle = getTextContent(checkedTitle) && checkedTitle || title;
  uncheckedTitle = getTextContent(uncheckedTitle) && uncheckedTitle || title;
  return {
    ...rest,
    className: cn(variants.all({ disabled, readOnly }), className),
    containerClassName: cn(variants.all({ disabled, readOnly }), "flex flex-row self-start items-center justify-start", containerClassName),
    labelClassName: cn(!disabled && "select-text", "mx-[7px]", className),
    checked,
    labelPosition,
    title: (checked ? checkedTitle : uncheckedTitle) || title || undefined,
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

/**
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
