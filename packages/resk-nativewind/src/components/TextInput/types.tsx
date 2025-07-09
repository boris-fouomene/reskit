import { IClassName, IOnChangeOptions } from "../../types";
import { InputModeOptions, NativeSyntheticEvent, TextInputProps, TextInput, TextInputChangeEventData } from "react-native";
import React, { ReactNode } from "react";
import { IInputFormatterMask, IInputFormatterMaskOptions, IInputFormatterResult } from "@resk/core/inputFormatter";
import { IFieldBase } from "@resk/core/types";
import { ICountryCode } from "@resk/core/countries";
import { IVariantPropsTextInput } from "@variants/textInput";
import { textInputVariant } from "@variants/textInput";
import { IFontIconName } from "@components/Icon";
import { IInputFormatterOptions } from "@resk/core/inputFormatter";
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

/**
 * Call options and context provided to custom renderers and affix/decoration functions in {@link TextInput}.
 *
 * This interface extends {@link IInputFormatterResult} and provides a comprehensive set of properties
 * describing the current state, styling, and context of the input field. It is passed to custom renderers,
 * affix functions, and decorators to enable advanced UI logic and dynamic rendering.
 *
 * @property isFocused - `true` if the input is currently focused.
 * @property editable - `true` if the input is editable (not disabled or read-only).
 * @property disabled - `true` if the input is disabled.
 * @property error - `true` if the input is in an error state.
 * @property computedVariant - The computed variant object for the input, as returned by {@link textInputVariant}.
 * @property labelEmbeded - `true` if the label is embedded inside the input field.
 * @property focus - Function to imperatively focus the input.
 * @property labelClassName - The computed class name for the label.
 * @property inputClassName - The computed class name for the input element.
 * @property iconClassName - The computed class name for the icon element.
 * @property isPhone - `true` if the input type is a phone number.
 * @property labelTextClassName - Extracted text classes for the label (for advanced styling).
 * @property iconTextClassName - Extracted text classes for the icon (for advanced styling).
 * @property inputTextClassName - Extracted text classes for the input (for advanced styling).
 * @property phoneDialCodeText - The phone dial code text (e.g., "+33 ").
 * @property sanitizeValue - Function to format/transform the input value before it's stored in state. (e.g., uppercase, phone formatting).
 *
 * @example
 * ```tsx
 * import { TextInput, ITextInputCallOptions } from "@resk/nativewind/components/TextInput";
 *
 * // Example: Custom affix showing character count and error state
 * const charCountAffix = (options: ITextInputCallOptions) => (
 *   <Text style={{ color: options.error ? "red" : "gray" }}>
 *     {String(options.value).length}/20
 *   </Text>
 * );
 *
 * // Example: Custom render function using call options
 * const customRender = (inputProps, callOptions: ITextInputCallOptions) => (
 *   <View style={{ borderColor: callOptions.error ? "red" : "gray", borderWidth: 1 }}>
 *     <RNTextInput {...inputProps} ref={inputProps.ref} />
 *   </View>
 * );
 *
 * <TextInput
 *   maxLength={20}
 *   affix={charCountAffix}
 *   renderTextInput={customRender}
 * />
 * ```
 *
 * @remarks
 * - This interface is passed to all custom renderers, affix, left, and right decorators.
 * - Use these properties to implement advanced UI logic, dynamic styling, or context-aware rendering.
 * - The `sanitizeValue` function can be used to format or transform the value before display or validation.
 *
 * @see {@link ITextInputProps.renderTextInput}
 * @see {@link ITextInputRenderOptions}
 * @see {@link IInputFormatterResult}
 * @see {@link textInputVariant}
 * @see {@link ICountryCode}
 *
 * @public
 */
export interface ITextInputCallOptions extends IInputFormatterResult {
    /**
     * Indicates if the input is currently focused.
     */
    isFocused: boolean;
    /**
     * Indicates if the input is currently editable.
     */
    editable: boolean;
    /**
     * Indicates if the input is currently disabled.
     */
    disabled: boolean;
    /***
     * Indicates if the input is in an error state.
     */
    error: boolean;

    /**
     * The computed variant object for the input, as returned by {@link textInputVariant}.
     */
    computedVariant: ITextInputComputedVariant;

    /*** The label to be displayed alongside the input. */
    label?: ReactNode;
    /***
        Whether the label is embeded in the input.
    */
    labelEmbeded: boolean;

    /*** The function to be called when the input field is focused. */
    focus: () => void;
    /***
        The class name of the label.
    */
    labelClassName: string;
    /***
        The class name of the icon.
    */
    inputClassName: string;

    /***
        The class name of the icon.
    */
    iconClassName: string;

    /**
     * Whether the input is a phone number.
     */
    isPhone: boolean;

    /***
     * The extracted text classes of the label.
     */
    labelTextClassName: string;

    /***
     * The extracted text classes of the icon.
     */
    iconTextClassName: string;

    /***
     * The extracted text classes of the input.
     */
    inputTextClassName: string;

    /**
     * The phone dial code text. It can be use to display the dial code in the input.
     */
    phoneDialCodeText: string;


    /**
     * The country code for phone number formatting.
     */
    phoneCountryCode?: ICountryCode;

    /**
     * The input state, including the value, formatted value, and other properties.
     */
    inputState: IInputFormatterResult;

    /***
     * A function to set the input state, allowing for updating the value or other properties.
     */
    updateInputState: (newInputState: IInputFormatterResult) => void;


    /***
        A function to format the input value, allowing for transformation 
        of the text (e.g., converting to uppercase, converting to number).
        
    */
    formatValue: (options: IInputFormatterOptions) => IInputFormatterResult;

    /**
     * Whether the label is embeded in the input.
     */
    renderedWithLabel: boolean;
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
 * @template ValueType - The type of the value associated with the text input.
 *
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
export interface ITextInputOnChangeOptions<ValueType = any> extends Omit<IOnChangeOptions<ITextInputOnChangeEvent>, "event" | "value"> {
    event?: ITextInputOnChangeEvent;
    value: ValueType;
    previousValue?: any;
    isFocused?: boolean;
    fieldName?: string;
    computedVariant: ITextInputComputedVariant;
    labelEmbeded: boolean;
}

/**
 * Props for the custom render function of the {@link TextInput} component.
 *
 * This interface extends the standard React Native {@link TextInputProps} and adds a required `ref` property,
 * allowing you to fully control and customize the rendering of the underlying TextInput element.
 *
 * Use this interface when implementing the `renderTextInput` prop of {@link ITextInputProps} to provide
 * advanced rendering logic, custom wrappers, or additional behaviors.
 *
 * @property ref - A React ref to the underlying {@link TextInput} element. This allows for imperative focus, blur, or value access.
 *
 * @example
 * ```tsx
 * import { TextInput, ITextInputRenderOptions, ITextInputCallOptions } from "@resk/nativewind/components/TextInput";
 *
 * // Custom render function for TextInput
 * const customRender = (inputProps: ITextInputRenderOptions, callOptions: ITextInputCallOptions) => (
 *   <View style={{ borderColor: callOptions.error ? 'red' : 'gray', borderWidth: 1 }}>
 *     <RNTextInput {...inputProps} ref={inputProps.ref} />
 *     {callOptions.error && <Text style={{ color: 'red' }}>Invalid input</Text>}
 *   </View>
 * );
 *
 * // Usage in the TextInput component
 * <TextInput
 *   label="Custom"
 *   renderTextInput={customRender}
 * />
 * ```
 *
 * @see {@link ITextInputProps.renderTextInput}
 * @see {@link TextInputProps}
 * @see {@link TextInput}
 * @see {@link ITextInputCallOptions}
 *
 * @public
 */
export interface ITextInputRenderOptions extends TextInputProps {
    ref: React.Ref<TextInput>;
}

/**
 * @interface ITextInputProps
 * Props for the universal, highly-configurable {@link TextInput} component.
 *
 * This interface defines all configuration options, event handlers, and styling overrides for the TextInput component,
 * supporting advanced features such as input masking, phone/date formatting, validation, affixes, password visibility toggling,
 * keyboard avoidance, custom rendering, accessibility, and seamless integration with Tailwind CSS utility classes.
 *
 * @extends Partial<TextInputProps>
 * @extends Omit<IFieldBase, "type" | "value" | "label">
 * @template ValueType - The type of the value associated with the text input.
 *
 * @property type - {@link ITextInputType} The input type (e.g., "text", "password", "number", "tel", "date", "datetime", "email", etc.).  
 *   Determines keyboard type and formatting logic.  
 *   @default "text"
 *
 * @property phoneCountryCode - {@link ICountryCode} The country code for phone number formatting (used when `type="tel"`).
 *
 * @property length - The maximum length of text allowed in the input field. Useful for fixed-length inputs.
 *
 * @property defaultValue - The initial value of the text input field.  
 *   @default ''
 *
 * @property containerClassName - {@link IClassName} Class name for the outermost container.
 * @property contentContainerClassName - {@link IClassName} Class name for the container wrapping left/right fields and the input.
 * @property inputContainerClassName - {@link IClassName} Class name for the closest parent of the input.
 * @property rightContainerClassName - {@link IClassName} Class name for the right element's parent.
 * @property leftContainerClassName - {@link IClassName} Class name for the left element's parent.
 * @property labelClassName - {@link IClassName} Class name for the label.
 * @property iconClassName - {@link IClassName} Class name for the input icon.
 *
 * @property withLabel - If `true`, displays a label with the input.
 *
 * @property affix - Function or node to display fixed text/values alongside the input (e.g., character count).  
 *   If set to `false`, no affix is displayed.  
 *   @default false  
 *   @example
 *   ```tsx
 *   <TextInput maxLength={10} affix={({ value }) => `${value.length}/10`} />
 *   ```
 *
 * @property onChange - Callback fired when the input value changes. Receives {@link ITextInputOnChangeOptions}.
 *
 * @property valueFormatter - Function to transform the input value (e.g., uppercase, number conversion).
 *
 * @property emptyValue - The value considered as null or empty.  
 *   @default null | ''
 *
 * @property debounceTimeout - Debounce interval (ms) for value changes.  
 *   If set, `onChange` is called after the specified delay.  
 *   @min 0
 *
 * @property disabled - If `true`, disables the input.
 * @property error - If `true`, marks the input as having an error.
 * @property opacity - Opacity of the input.
 * @property isDropdownAnchor - If `true`, marks the input as an anchor for a dropdown.
 *
 * @property renderTextInput - Custom render function for the TextInput.  
 *   Receives {@link ITextInputRenderOptions} and {@link ITextInputCallOptions}.  
 *   @example
 *   ```tsx
 *   <TextInput renderTextInput={(inputProps, callOptions) => (
 *     <CustomInput {...inputProps} icon={callOptions.isPhone ? <PhoneIcon /> : null} />
 *   )} />
 *   ```
 *
 * @property mask - Input mask for formatting (array of RegExp/string or function).  
 *   @example
 *   ```typescript
 *   const zipCodeMask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
 *   ```
 *
 * @property labelEmbeded - If `true`, embeds the label inside the input field.
 * @property suffixLabelWithMaskPlaceholder - If `true`, appends the mask placeholder to the label (when mask is provided and not embedded).
 * @property maskOptions - Additional options for {@link IInputFormatterMaskOptions} (when mask is provided).
 * @property handleMaskValidationErrors - If `true`, handles and displays mask validation errors, overriding `error` if mask is invalid.
 * @property withKeyboardAvoidingView - If `true`, wraps the input in a KeyboardAvoidingView (mobile only).  
 *   @default false
 *
 * @property variant - {@link IVariantPropsTextInput} The visual variant of the input.
 * @property minHeight - Minimum height (for multiline).
 * @property maxHeight - Maximum height (for multiline).
 * @property ref - Ref to the underlying TextInput.
 * @property left - Node or function for left adornment.
 * @property right - Node or function for right adornment.
 * @property label - Label text or element.
 *
 * @property passwordHiddenIconName - Icon name for "show password" (when hidden).  
 *   @example "eye", "visibility", "show"
 * @property passwordVisibleIconName - Icon name for "hide password" (when visible).  
 *   @example "eye-off", "visibility-off", "hide"
 *
 * @property displayPhoneDialCode - If `true`, displays the phone dial code label.  
 *   @default true
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput label="Name" placeholder="Enter your name" />
 *
 * // Password input with visibility toggle
 * <TextInput type="password" label="Password" />
 *
 * // Phone input with mask and country code
 * <TextInput type="tel" mask="+9 (999) 999-9999" phoneCountryCode="US" />
 *
 * // Date input with custom format and calendar icon
 * <TextInput type="date" dateFormat="YYYY-MM-DD" right={<CalendarIcon />} />
 *
 * // Multiline input with character counter
 * <TextInput multiline maxLength={200} affix={({ value }) => `${value.length}/200`} />
 *
 * // Custom rendering
 * <TextInput renderTextInput={(inputProps, callOptions) => (
 *   <CustomInput {...inputProps} icon={callOptions.isPhone ? <PhoneIcon /> : null} />
 * )} />
 * ```
 *
 * @see {@link TextInput}
 * @see {@link ITextInputType}
 * @see {@link ITextInputCallOptions}
 * @see {@link ITextInputRenderOptions}
 * @see {@link IInputFormatterMask}
 * @see {@link InputFormatter}
 * @see {@link ICountryCode}
 * @see {@link IVariantPropsTextInput}
 * @see {@link InputFormatter.formatWithMask}
 * @see {@link ITextInputOnChangeOptions}
 * @see {@link IFieldBase}
 * @see {@link IClassName}
 * @see {@link IFontIconName}
 * @see {@link KeyboardAvoidingView}
 * @see {@link textInputVariant}
 * @see {@link allVariants}
 * @see {@link extractTextClasses}
 * @see {@link areCasesEquals}
 * @see {@link isDecimalType}
 *
 * @public
 */
export interface ITextInputProps<ValueType = any> extends Omit<Partial<TextInputProps>, 'onChange' | 'defaultValue' | "label" | "ref">, Omit<IFieldBase, "type" | "value" | "label"> {
    /**
     * @type  {ITextInputType}
     * An optional property that specifies the type of input, 
     * which can be one of the predefined input modes defined by 
     * `ITextInputType`.
     * @default "text"
     */
    type?: ITextInputType;

    /***
        Whether the input is required or not
    */
    required?: boolean;

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
     * @type (options: ITextInputCallOptions) => ReactNode | false
     * Allows for displaying fixed text or values alongside the input, 
     * such as character counts. This can be a function returning a node 
     * or a simple value. If set to `false`, no affix will be displayed.
     * @default false
     */
    affix?: ((options: ITextInputCallOptions) => ReactNode) | false;

    /**
     * @description
     * A callback function that is triggered when the value 
     * of the input changes. The function receives an object of type 
     * `ITextInputOnChangeOptions` as an argument.
     */
    onChange?: (options: ITextInputOnChangeOptions<ValueType>) => any;

    /**
     * Optional function to sanitize and transform the input value before it's stored in state.
     * 
     * This function is called whenever the user types or the input value changes, allowing you
     * to clean, validate, or transform the raw input before it becomes the component's value.
     * The sanitized result will be passed to the onChange handler and stored as the component state.
     * 
     * @param {IInputFormatterOptions} options  - The options object containing the current value, type, and other properties
     * @returns The sanitized/transformed value that will be stored in state
     * 
     * @example
     * ```tsx
     * // Convert to uppercase and remove whitespace
     * <TextInput 
     *   value={code} 
     *   sanitizeValue={({value:input}) => String(input).toUpperCase().trim()} 
     * />
     * 
     * // Extract only numeric characters for phone input
     * <TextInput 
     *   value={phone} 
     *   sanitizeValue={({value:input}) => String(input).replace(/\D/g, '')} 
     * />
     * 
     * // Convert to number for numeric inputs
     * <TextInput 
     *   value={amount} 
     *   sanitizeValue={({value:input}) => {
     *     const num = parseFloat(String(input).replace(/[^\d.-]/g, ''));
     *     return isNaN(num) ? '' : num;
     *   }} 
     * />
     * ```
     * 
     * @remarks
     * - This function runs on every input change, so keep it lightweight
     * - Return the same type that your component's `value` prop expects
     * - If sanitization fails, consider returning the original input or an empty value
     * - This is different from display formatting - it affects the actual stored value
     */
    sanitizeValue?: (options: IInputFormatterOptions) => string | number;

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
    renderTextInput?: (props: ITextInputRenderOptions, options: ITextInputCallOptions) => React.ReactNode;

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
        If true, the label will be embeded in the input field
    */
    labelEmbeded?: boolean;

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

    left?: ReactNode | ((options: ITextInputCallOptions) => ReactNode);

    right?: ReactNode | ((options: ITextInputCallOptions) => ReactNode);


    /**
        The label to be displayed alongside the text input.
    */
    label?: ReactNode;

    /**
     * Name of the icon to display when the password is currently hidden (secureTextEntry = true).
     * This icon represents the action that will be performed when tapped (show password).
     * Typically an "eye" icon to indicate "click to reveal password".
     * Only rendered when `secureTextEntry` is true.
     * 
     * @example "eye", "visibility", "show"
     */
    passwordHiddenIconName?: IFontIconName;
    /**
     * Name of the icon to display when the password is currently visible (secureTextEntry = false).
     * This icon represents the action that will be performed when tapped (hide password).
     * Typically an "eye-off" or "eye-slash" icon to indicate "click to hide password".
     * Only rendered when `secureTextEntry` is false.
     * 
     * @example "eye-off", "visibility-off", "hide"
     */
    passwordVisibleIconName?: IFontIconName;


    /***
        Whether to display the phone dial code label.
        @default true
    */
    displayPhoneDialCode?: boolean;
};