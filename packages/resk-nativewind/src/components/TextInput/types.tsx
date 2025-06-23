import { IClassName, IOnChangeOptions } from "../../types";
import { InputModeOptions, NativeSyntheticEvent, TextInputChangeEventData, TextInputProps, TextInput } from "react-native";
import React, { ReactNode } from "react";
import { IInputFormatterMask, IInputFormatterMaskOptions, IInputFormatterResult } from "@resk/core/types";
import { IFieldBase } from "@resk/core/types";
import { ICountryCode } from "@resk/core/countries";
import { IVariantPropsTextInput } from "@variants/textInput";
import textInputVariant from "@variants/textInput";
/**
 * @interface ITextInputType
 * @description
 * Defines the various types of input modes for text input fields in React Native.
 *
 * The `ITextInputType` type specifies the options available for the `type` 
 * property, which is passed as a parameter to the `TextInput` component. This 
 * property determines which keyboard layout is presented to the user when 
 * interacting with the input field.
 *
 * The type can include:
 * 
 * - `InputModeOptions`: A set of predefined keyboard options provided by 
 *   React Native, allowing for a variety of input modes.
 * - `"number"`: Opens a numeric keyboard, suitable for inputs that require 
 *   numerical values only.
 * - `"password"`: Opens a keyboard optimized for password entry, typically 
 *   obscuring the input for security purposes.
 *
 * Example usage:
 * 
 * ```typescript
 * <TextInput 
 *   type="number" 
 *   placeholder="Enter a number" 
 * />
 * 
 * <TextInput 
 *   type="password" 
 *   placeholder="Enter your password" 
 * />
 * ```
 *
 * In the examples above, the first `TextInput` component will display a 
 * numeric TextInput, while the second will display a password TextInput, 
 * enhancing the user experience by providing the appropriate input method 
 * based on the expected input type.
 *
 * This type is particularly useful for developers to ensure that the correct 
 * keyboard is presented based on the context of the input, thereby improving 
 * usability and accessibility in mobile applications.
 */
export type ITextInputType = InputModeOptions | "number" | "password" | "time" | "date" | "datetime";

type ITextInputComputedVariant = ReturnType<typeof textInputVariant>;

export interface ITextInputCallbackOptions extends IInputFormatterResult {
    isFocused: boolean;
    editable: boolean;
    disabled: boolean;
    error: boolean;
    computedVariant: ITextInputComputedVariant;
};


/**
 * @interface ITextInputOnChangeEvent
 * Represents the event type for text input changes in React Native.
 * 
 * This type is a NativeSyntheticEvent<TextInputChangeEventData>,
 * allowing for both the native event object and the absence of an event.
 * 
 * @example
 * // Using ITextInputOnChangeEvent in a component
 * const handleChange = (event: ITextInputOnChangeEvent) => {
 *   if (event) {
 *     console.log('New text:', event.nativeEvent.text);
 *   }
 * };
 * 
 * @typedef {NativeSyntheticEvent<TextInputChangeEventData>} ITextInputOnChangeEvent
 */
export interface ITextInputOnChangeEvent extends NativeSyntheticEvent<TextInputChangeEventData> { };

/**
 * @interface ITextInputOnChangeOptions
 * Represents the options passed to the onChange handler of a TextInput component.
 * This interface combines multiple other interfaces and includes additional properties
 * specific to text field changes.
 * 
 * @interface ITextInputOnChangeOptions
 * @extends {IInputFormatterResult} Represents the result of a formatted value obtained via the `formatValue` function in the @resk/core package.
 * @extends {IOnChangeOptions<any, ITextInputOnChangeEvent>}
 * 
 * @example
 * // Using ITextInputOnChangeOptions in a component
 * const handleTextInputChange = (options: ITextInputOnChangeOptions) => {
 *   console.log('New value:', options.value);
 *   console.log('Previous value:', options.previousValue);
 *   console.log('Field name:', options.fieldName);
 * };
 * 
 * @property {ITextInputOnChangeEvent} [event] - The event that triggered the change.
 * @property {any} [value] - The new value of the text field after the change.
 * @property {any} [previousValue] - The value of the text field before the change.
 * @property {boolean} [isFocused] - Indicates whether the text field is isFocused at the time of the change.
 * @property {string} [fieldName] - The name of the field if it's part of a form.
 */
export interface ITextInputOnChangeOptions extends Omit<IOnChangeOptions<ITextInputOnChangeEvent>, "event"> {
    event?: ITextInputOnChangeEvent;
    value?: any;
    previousValue?: any;
    isFocused?: boolean;
    fieldName?: string;
    computedVariant: ITextInputComputedVariant;
}

export interface ITextInputRenderOptions extends TextInputProps {
    ref: React.Ref<TextInput>;
    focus: () => void;
    computedVariant: ITextInputComputedVariant;
    error: boolean;
    isFocused: boolean;
}

export interface ITextInputProps extends Omit<Partial<TextInputProps>, 'onChange' | 'defaultValue' | "label" | "ref">, Omit<IFieldBase, "type" | "value" | "label"> {
    /**
     * @type  {ITextInputType}
     * An optional property that specifies the type of input, 
     * which can be one of the predefined input modes defined by 
     * `ITextInputType`.
     * @default "text"
     */
    type?: ITextInputType;

    /***
     * The country code for phone number
     * when type is telephone
     */
    phoneCountryCode?: ICountryCode;

    /**
     * @type {number}
     * Specifies the maximum length of text allowed in the input field. 
     * Useful for fixed-length inputs.
     */
    length?: number;

    /**
     * @type any 
     * The initial value of the text input field. 
     * @default ''
     */
    defaultValue?: any; // The default value of the input field.

    containerClassName?: IClassName;

    /**
     * @type IClassName
     * class name for the parent container, the container that wraps both the left and right fields and react-native TextInput itself
     * component.
     */
    contentContainerClassName?: IClassName;

    /***
     * The class name of the closet parent of input component
     */
    inputContainerClassName?: IClassName;

    /**
     * class name for the parent container of the right element in the 
     * component.
     */
    rightContainerClassName?: IClassName;
    /**
     * class name for the parent container of the left element in the 
     * component.
     */
    leftContainerClassName?: IClassName;

    /*** 
     * the class name used to render the label
     */
    labelClassName?: IClassName;

    /***
     * The class name for the text input icon
     */
    iconClassName?: IClassName;

    /*** A flag indicating whether to display a label with the input. */
    withLabel?: boolean;

    /**
     * @type (options: ITextInputCallbackOptions) => ReactNode | false
     * Allows for displaying fixed text or values alongside the input, 
     * such as character counts. This can be a function returning a node 
     * or a simple value. If set to `false`, no affix will be displayed.
     * @default false
     */
    affix?: ((options: ITextInputCallbackOptions) => ReactNode) | false;

    /**
     * @description
     * A callback function that is triggered when the value 
     * of the input changes. The function receives an object of type 
     * `ITextInputOnChangeOptions` as an argument.
     */
    onChange?: (options: ITextInputOnChangeOptions) => any;

    /**
     * A function to format the input value, allowing for transformation 
     * of the text (e.g., converting to uppercase, converting to number).
     */
    toCase?: (value: any) => any;

    /**
     * The value considered as null or empty. 
     * @default null | ''
     */
    emptyValue?: any; // The value considered as null or empty.
    /**
     * @type {number}
     * @description
     * Specifies the debounce interval for listening to value changes. 
     * If defined, the `onChange` handler will be called after the 
     * specified timeout following a value change, which can help reduce 
     * the frequency of updates and improve performance.
     * @min 0
     */
    debounceTimeout?: number;

    /***
     * The disabled status of the text input.
     */
    disabled?: boolean;

    /***
     * Specifies whether the text input has erroneous values
     */
    error?: boolean;

    /***
     * The opacity of the text input.
     */
    opacity?: number;

    /***
     * A flag indicating whether the text input is an anchor for a dropdown.
     */
    isDropdownAnchor?: boolean;

    /***
     * A function that allows for rendering the TextInput component.
     * This can be useful for conditionally rendering the component based on certain conditions.
     * @param {TextInputProps} props - The props passed to the TextInput component.
     * @returns {React.ReactNode} The rendered component.
     */
    render?: (props: ITextInputRenderOptions) => React.ReactNode;

    /***
     * Input mask, use to format input value to a given format, based on mask
     * It can be a function or An array where each item defines one character of the value. If the item is a string, that string will be used, if it is an RegExp, it will validate the input on it.
        To be clear: All the characters you want to be inputed by the user must be a RegExp in your mask.
        @example 
        ```typescript
            const zipCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
        ```
     */
    mask?: IInputFormatterMask;

    /***
        Suffix the label with the mask placeholder, when mask is provided and the variant is not labelEmbeded
    */
    suffixLabelWithMaskPlaceholder?: boolean;

    /***
     * Additionnal options to pass to the InputFormatter.formatWithMask method, when mask prop is provided to input field
     */
    maskOptions?: Omit<IInputFormatterMaskOptions, "mask">;

    /***
        A boolean that determines whether to handle validation errors for the mask, when mask is provided.
        If set to true, the component will handle validation errors for the mask and display them to the user.
        This is useful for handling errors related to the mask and providing feedback to the user.
        When set to true, the component will override the `error` to true if the mask has validation errors.
    */
    handleMaskValidationErrors?: boolean;

    /***
     * A boolean that determines whether to wrap the TextInput with a KeyboardAvoidingView.
     * This is useful for handling the keyboard behavior when the input is focused.
     * When set to true, the component will wrap the TextInput with a KeyboardAvoidingView.
     * Default is false.
     */
    withKeyboardAvoidingView?: boolean;


    /**
     * The variant of the text input
     */
    variant?: IVariantPropsTextInput;

    /**
     * The minimum height of the text input in case of multiline.
     */
    minHeight?: number;

    /***
     * The maximum height of the text input in case of multiline.
     */
    maxHeight?: number;

    /***
     * The ref of the TextInput.
     */
    ref?: React.Ref<TextInput>;

    left?: ReactNode | ((options: ITextInputCallbackOptions) => ReactNode);

    right?: ReactNode | ((options: ITextInputCallbackOptions) => ReactNode);

    label?: ReactNode;
};