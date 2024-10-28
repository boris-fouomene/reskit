import { IViewProps } from "@components/View";
import { ILabelOrLeftOrRightOptions } from "@hooks/index";
import { IFieldFormatValueResult, IFormatValueFormat } from "@resk/core";
import { IOnChangeOptions } from "../../types";
import { InputModeOptions, NativeSyntheticEvent, TextInputChangeEventData, TextInputProps } from "react-native";
import { ReactNode } from "react";
import { ILabelProps } from "@components/Label";


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
export type ITextInputType = InputModeOptions | "number" | "password";


/**
 * @interface ITextInputCallbackOptions
 * @description
 * Defines the options for callback functions related to text input fields. like functions used to render left, right component in text input
 * The `ITextInputCallbackOptions` type extends the `IFieldFormatValueResult` 
 * type and includes additional properties that provide context about the 
 * state of the text input component. This type is particularly useful for 
 * handling various input scenarios and customizing the behavior of text 
 * inputs based on their state.
 *
 * Properties included:
 * 
 * - `color?`: An optional string that specifies the color of the text input. 
 *   This can be used to customize the appearance of the input field based on 
 *   its state (e.g., isFocused, error).
 * 
 * - `isFocused?`: An optional boolean that indicates whether the text input 
 *   component is currently isFocused. This can be useful for triggering 
 *   specific behaviors or styles when the input is active.
 * 
 * - `editable?`: An optional boolean that specifies whether the text input 
 *   is editable. This allows developers to control whether users can modify 
 *   the input value.
 * 
 * - `disabled?`: An optional boolean that indicates whether the text input 
 *   is disabled. When true, the input will be non-interactive and visually 
 *   indicate that it is not available for user input.
 *
 * Example usage:
 * 
 * ```typescript
 * const inputOptions: ITextInputCallbackOptions = {
 *   color: 'blue',
 *   isFocused: true,
 *   editable: true,
 *   disabled: false,
 * };
 * 
 * function handleInputChange(options: ITextInputCallbackOptions) {
 *   if (options.isFocused) {
 *     console.log("Input is isFocused");
 *   }
 *   if (options.disabled) {
 *     console.log("Input is disabled");
 *   }
 * }
 * 
 * handleInputChange(inputOptions);
 * ```
 *
 * In the example above, `inputOptions` defines the state of a text input, 
 * and the `handleInputChange` function uses these options to perform 
 * conditional logic based on the input's state.
 *
 * This type is beneficial for managing complex interactions with text input 
 * components, allowing for a more dynamic and responsive user interface.
 */
export type ITextInputCallbackOptions = IFieldFormatValueResult & {
    textColor: string;
    /**
     * Indicates if the component is isFocused.
     */
    isFocused: boolean;
    editable: boolean;
    disabled: boolean;
    /** if label is embedded in the text input */
    variant: ITextInputProps["variant"];
    error: boolean;
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
export type ITextInputOnChangeEvent = NativeSyntheticEvent<TextInputChangeEventData>;

/**
 * @interface ITextInputOnChangeOptions
 * Represents the options passed to the onChange handler of a TextInput component.
 * This interface combines multiple other interfaces and includes additional properties
 * specific to text field changes.
 * 
 * @interface ITextInputOnChangeOptions
 * @extends {IFieldFormatValueResult} Represents the result of a formatted value obtained via the `formatValue` function in the @resk/core package.
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
export type ITextInputOnChangeOptions = IFieldFormatValueResult & IOnChangeOptions<any, ITextInputOnChangeEvent> & {
    event?: ITextInputOnChangeEvent;
    value?: any;
    previousValue?: any;
    isFocused?: boolean;
    fieldName?: string;
}

/**
 * Extends the TextInput component properties from react-native.
 *
 * The `ITextInputProps` type is an extension of the `TextInputProps` 
 * interface, omitting specific properties while adding additional 
 * functionalities tailored for enhanced text input components. 
 * This type is particularly useful for developers looking to customize 
 * text input behavior and appearance in React Native applications.
 *
 * Properties included:
 * 
 * - `type?`: An optional property that specifies the type of input, 
 *   which can be one of the predefined input modes defined by 
 *   `ITextInputType` (e.g., numeric, password).
 * 
 * - `left?`: Optional properties for a left component, allowing for 
 *   additional UI elements (like icons) next to the left side of the 
 *   text input, defined by `ILabelOrLeftOrRightOptions<ITextInputCallbackOptions>`.
 * 
 * - `right?`: Similar to `left`, but for components on the right side 
 *   of the text input.
 * 
 * - `length?`: An optional number that specifies the maximum length 
 *   of text allowed in the input field. This is useful for fixed-length 
 *   fields.
 * 
 * - `defaultValue?`: The initial value of the text input field. This 
 *   can be any type, allowing for flexibility in input initialization.
 * 
 * - `rightContainerProps?`: Properties for the parent container of 
 *   the right component, allowing for customization of layout and 
 *   styling.
 * 
 * - `leftContainerProps?`: Similar to `rightContainerProps`, but for 
 *   the left component.
 * 
 * - `affix?`: An optional property that allows displaying fixed text 
 *   or values alongside the input, such as character counts. This can 
 *   be a function returning a node or a simple value. If set to `false`, 
 *   no affix will be displayed.
 * 
 * - `onChange?`: A callback function that is triggered when the value 
 *   of the input changes. The function receives an object of type 
 *   `ITextInputOnChangeOptions` as an argument.
 * 
 * - `toCase?`: A function that formats the input value, allowing for 
 *   transformation of the text (e.g., converting to uppercase, converting to number, ...etc).
 * 
 * - `format?`: A function or a string to format the value displayed in the input 
 *   field, enhancing the user experience by providing formatted output.
 * 
 * - `emptyValue?`: The value considered as null or empty, which can 
 *   be customized as needed.
 * 
 * - `debounceTimeout?`: An optional number specifying the debounce 
 *   interval for listening to value changes. If defined, the `onChange` 
 *   handler will be called after the specified timeout following a value 
 *   change, which can help reduce the frequency of updates and improve 
 *   performance.
 *
 * Example usage:
 * 
 * ```typescript
 * const textInputProps: ITextInputProps = {
 *   type: "number",
 *   length: 10,
 *   defaultValue: '',
 *   onChange: (options) => {
 *     console.log("Input changed:", options);
 *   },
 *   affix: { 
 *     left: { text: 'Chars left: 10' } 
 *   },
 *   debounceTimeout: 300,
 * };
 * ```
 *
 * In the example above, `textInputProps` defines the properties for a 
 * text input component, allowing for customization of its behavior, 
 * appearance, and interaction. The `onChange` function demonstrates 
 * how to handle input changes effectively.
 *
 * This type is beneficial for creating flexible and customizable text 
 * input components that enhance user interaction and maintainability 
 * in React Native applications.
 */
export type ITextInputProps = Omit<TextInputProps, 'onChange' | 'defaultValue'> & ILabelOrLeftOrRightOptions<ITextInputCallbackOptions> & {
    /**
     * @type  {ITextInputType}
     * An optional property that specifies the type of input, 
     * which can be one of the predefined input modes defined by 
     * `ITextInputType`.
     * @default "text"
     */
    type?: ITextInputType;

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

    /**
     * @type IViewProps
     * Properties for the parent container of the contentContainer View, displayed as a vertical flex box.
     * It is also the direct parent of the Label component for the default variant
     * Note that in the labelEmbeded variant, the label's parent component is the view parent direct to the left component.
     */
    containerProps?: IViewProps;

    /**
     * @type IViewProps
     * Properties for the parent container, the container that wraps both the left and right fields and react-native TextInput itself
     * component.
     * They are the properties of the parent container that directly wrap the react native TextInput component, the component to be rendered on the left and the component to be rendered on the right. 
       the content container is displayed in a horizontal flex box, so that all its children are displayed on the same line. 
     */
    contentContainerProps?: IViewProps;

    /**
     * @type IViewProps
     * Properties for the parent container of the right element in the 
     * component.
     */
    rightContainerProps?: IViewProps;
    /**
     * @type IViewProps
     * Properties for the parent container of the left element in the 
     * component.
     */
    leftContainerProps?: IViewProps;

    /*** 
     * @type ILabelProps
     * the props used to render the label
     */
    labelProps?: ILabelProps;

    /***
     * the text input variant
     */
    variant?: "labelEmbeded" | "default", // | "outlined" | "flat"

    /*** A flag indicating whether to display a label with the input. */
    withLabel?: boolean;

    /**
     * @type (options: ITextInputCallbackOptions) => ReactNode | false
     * Allows for displaying fixed text or values alongside the input, 
     * such as character counts. This can be a function returning a node 
     * or a simple value. If set to `false`, no affix will be displayed.
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
     * A function or a string used to format the value displayed in the input field.
     * ```ts
     *   format : "moneay", //will format the value to money format
     *   format : ({value:any,type:ITextInputType,format?:"custom"}) => any; //will format the value to any format
     * ```
     */
    format?: IFormatValueFormat;

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
};

/**
 * @interface IUseTextInputProps
 * Represents the properties for a customizable text input component.
 * This type extends the `ITextInputProps` interface by omitting the `left`, `right`, 
 * and `label` properties and adding additional properties that enhance the 
 * functionality of the text input.
 * 
 * @type ITextInputProps
 * @extends Omit<ITextInputProps, "left" | "right" | "label">
 * 
 * @property {ReactNode} left - A React node that can be rendered to the left of the text input. 
 * This can be used for icons, labels, or any other custom component.
 * 
 * @example
 * // Example usage of the `left` property
 * const inputWithIcon = (
 *   <TextInput left={<Icon name="search" />} />
 * );
 * 
 * @property {ReactNode} right - A React node that can be rendered to the right of the text input. 
 * Similar to `left`, this can be used for additional icons, buttons, or any other custom components.
 * 
 * @example
 * // Example usage of the `right` property
 * const inputWithButton = (
 *   <TextInput right={<Button title="Submit" />} />
 * );
 * 
 * @property {ReactNode} label - A React node that serves as the label for the text input. 
 * This can be a string or any other React component that provides context to the user about 
 * what to enter in the text field.
 * 
 * @example
 * // Example usage of the `label` property
 * const labeledInput = (
 *   <TextInput label={<span>Email:</span>} />
 * );
 * 
 * @property {boolean} isFocused - A boolean that indicates whether the text input is currently focused. 
 * This can be used to apply specific styles or behaviors when the input is active.
 * 
 * @example
 * // Example usage of the `isFocused` property
 * const [isFocused, setIsFocused] = useState(false);
 * const handleFocus = () => setIsFocused(true);
 * const handleBlur = () => setIsFocused(false);
 * 
 * <TextInput
 *   isFocused={isFocused}
 *   onFocus={handleFocus}
 *   onBlur={handleBlur}
 * />
 * 
 * @property {boolean} canRenderLabel - A boolean that determines whether the label should be rendered. 
 * This can be useful for conditionally displaying the label based on certain criteria.
 * 
 * @example
 * // Example usage of the `canRenderLabel` property
 * const shouldRenderLabel = true;
 * 
 * <TextInput
 *   canRenderLabel={shouldRenderLabel}
 *   label={<span>Username:</span>}
 * />
 */
export type IUseTextInputProps = Omit<ITextInputProps, "left" | "right" | "label"> & {
    /**
     * The content to render on the left side of the text input.
     * Typically used for icons or buttons.
     * 
     * @example
     * ```ts
     * left: <Icon name="search" />
     * ```
     */
    left: ReactNode,

    /**
     * The content to render on the right side of the text input.
     * Often used for actions such as clearing text or submitting.
     * 
     * @example
     * ```ts
     * right: <Icon name="clear" />
     * ```
     */
    right: ReactNode,

    /**
     * The label to be displayed alongside the text input.
     * This could be a React element, such as a `Text` component, or any other custom label.
     * 
     * @example
     * ```ts
     * label: <Text>Username</Text>
     * ```
     */
    label: ReactNode,

    /**
    * Indicates whether the input field is currently focused.
    * Use this property to customize the styling or behavior when the input is active.
    * 
    * @example
    * ```ts
    * isFocused: true
    * ```
   */
    isFocused: boolean,

    /**
     * Determines if the label should be rendered.
     * This property can be helpful for conditionally showing or hiding the label 
     * based on the input's state or any other logic.
     * 
     * @example
     * ```ts
     * canRenderLabel: true
     * ```
     */
    canRenderLabel: boolean,
}