import { IButtonProps } from "@components/Button";
import { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { ITabItemProps, ITabProps } from "@components/Tab";
import { IViewProps } from "@components/View";
import { IDimensions } from "@dimensions/types";
import { IAuthPerm, IDict, IField, IFieldType, IResourceName, IValidatorRule, IValidatorValidateOptions } from "@resk/core";
import { IOnChangeOptions, IStyle } from "@src/types";
import { ObservableComponent } from "@utils/index";
import { ReactElement, ReactNode } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

/**
 * @interface IFormFieldsProp
 * Represents a mapping of form field properties in a form.
 * The `IFormFieldsProp` type is a record where each key is a string representing the name of the field,
 * and the value is the properties associated with that field, defined by the `IFormFieldProps` type.
 * 
 * @type IFormFieldsProp
 * 
 * @remarks
 * This type is useful for defining the structure of form fields in a form component,
 * allowing for dynamic rendering and management of multiple fields. Each field can have its own
 * set of properties, including validation rules, event handlers, and other configurations.
 * 
 * @example
 * // Example of using IFormFieldsProp to define form fields
 * const formFields: IFormFieldsProp = {
 *     username: {
 *         name: "username",
 *         type: "text",
 *         label: "Username",
 *         validationRules: ["required", { minLength: 3 }],
 *         onChange: (options) => {
 *             console.log("Username changed:", options.value);
 *         },
 *     },
 *     email: {
 *         name: "email",
 *         type: "email",
 *         label: "Email Address",
 *         validationRules: ["required", "email"],
 *         onChange: (options) => {
 *             console.log("Email changed:", options.value);
 *         },
 *     },
 * };
 */
export type IFormFieldsProp = Record<string, IFormFieldProps<any>>;

/**
 * Represents a collection of form fields in a form.
 * The `IFormFields` type is a record where each key is a string representing the name of the field,
 * and the value is an instance of `IFormField`. This structure allows for easy management and access
 * to multiple fields within a form.
 * 
 * @type IFormFields
 * 
 * @remarks
 * This type is useful for defining the structure of form fields in a form component,
 * enabling dynamic rendering and management of multiple fields. Each field can be accessed
 * by its name, allowing for straightforward validation, state management, and data retrieval.
 * 
 * @example
 * // Example of using IFormFields to define a form with multiple fields
 * const formFields: IFormFields = {
 *     username: new Field({ name: "username", type: "text", label: "Username" }),
 *     email: new Field({ name: "email", type: "email", label: "Email Address" }),
 *     password: new Field({ name: "password", type: "password", label: "Password" }),
 * };
 * 
 * // Accessing a specific field
 * const usernameField = formFields["username"]; // Retrieves the username field instance
 */
export type IFormFields = Record<string, IFormField>;

/**
 * Represents a mapping of event types for form-related events.
 * The `IFormEventMap` interface defines a set of string constants that represent
 * various events that can occur within a form, allowing for consistent event handling
 * and communication between form components.
 * 
 * @interface IFormEventMap
 * 
 * @property {string} mount - The event triggered when the form is mounted.
 * @property {string} unmount - The event triggered when the form is unmounted.
 * @property {string} submit - The event triggered when the form is submitted.
 * @property {string} beforeSubmit - The event triggered before the form submission occurs.
 * @property {string} afterSubmit - The event triggered after the form has been submitted.
 * @property {string} onValidate - The event triggered when the form field is validated.
 * @property {string} onNoValidate - The event triggered when the form field fails validation.
 * @property {string} beforeValidate - The event triggered before validation occurs.
 * @property {string} afterValidate - The event triggered after validation has completed.
 * @property {string} validate - The event triggered to perform validation on the form.
 * @property {string} noValidate - The event triggered to skip validation on the form.
 * @property {string} validationStatusChanged - The event triggered when the validation status changes.
 * 
 * @example
 * // Example of using IFormEventMap in a form component
 * const handleEvent = (event: keyof IFormEventMap) => {
 *     switch (event) {
 *         case "mount":
 *             console.log("Form has been mounted.");
 *             break;
 *         case "submit":
 *             console.log("Form submitted.");
 *             break;
 *         // Handle other events...
 *     }
 * };
 */
export interface IFormEventMap {
    mount: string;
    unmount: string;
    submit: string;
    beforeSubmit: string;
    afterSubmit: string;
    onValidate: string;
    onNoValidate: string;
    beforeValidate: string;
    afterValidate: string;
    validate: string;
    noValidate: string;
    validationStatusChanged: string;
}

/**
 * Represents the possible events that can occur within a form.
 * The `IFormEvent` type is a union of string literals derived from the keys of the `IFormEventMap` interface,
 * allowing for type-safe event handling in form components.
 * 
 * @type IFormEvent
 * 
 * @remarks
 * This type is useful for defining event handlers and ensuring that only valid event types
 * are used when working with form events. By using `IFormEvent`, developers can avoid
 * typos and ensure consistency in event handling throughout the application.
 * 
 * @example
 * // Example of using IFormEvent in an event handler
 * const handleFormEvent = (event: IFormEvent) => {
 *     switch (event) {
 *         case "mount":
 *             console.log("Form has been mounted.");
 *             break;
 *         case "submit":
 *             console.log("Form submitted.");
 *             break;
 *         case "onValidate":
 *             console.log("Field is being validated.");
 *             break;
 *         // Handle other events...
 *         default:
 *             console.warn("Unhandled event:", event);
 *     }
 * };
 */
export type IFormEvent = keyof IFormEventMap;
/**
 * Represents the events managed by the form manager.
 * The `IFormManagerEvent` type is a union of string literals that are constructed
 * from the base form events defined in `IFormEvent`, with additional suffixes
 * to indicate the context of the event (e.g., "Form", "Action", "Field").
 * 
 * @type IFormManagerEvent
 * 
 * @remarks
 * This type is useful for defining event names that are specific to the form manager,
 * allowing for clear and consistent event handling across the application. The inclusion
 * of the "formValidationStatusChanged" event provides a dedicated event for tracking
 * changes in the validation status of the form.
 * 
 * @example
 * // Example of using IFormManagerEvent in an event handler
 * const handleFormManagerEvent = (event: IFormManagerEvent) => {
 *     switch (event) {
 *         case "mountForm":
 *             console.log("A form has been mounted.");
 *             break;
 *         case "submitAction":
 *             console.log("A submit action has been triggered.");
 *             break;
 *         case "onValidateField":
 *             console.log("A field is being validated.");
 *             break;
 *         case "formValidationStatusChanged":
 *             console.log("The validation status of the form has changed.");
 *             break;
 *         // Handle other events...
 *         default:
 *             console.warn("Unhandled event:", event);
 *     }
 * };
 */
export type IFormManagerEvent = `${IFormEvent}Form` | `${IFormEvent}Action` | `${IFormEvent}Field` | "formValidationStatusChanged";


/**
 * Represents a form component that manages its state, fields, and validation.
 * The `IForm` interface extends `ObservableComponent` and defines the structure
 * and functionalities required for a form in a React application.
 * 
 * @interface IForm
 * @extends ObservableComponent<IFormProps, IFormState, IFormEvent>
 * 
 * @property {string} defaultName - The default name assigned to the form instance.
 * @property {IFormState} readonly state - The current state of the form.
 * @property {IFormProps} componentProps - The properties associated with the form component.
 * @property {IFormFieldsProp} primaryKeyFields - The fields that serve as primary keys in the form.
 * 
 * @remarks
 * This interface provides methods for managing form fields, validation, submission,
 * and rendering. It is designed to be implemented by form components that require
 * structured handling of user input and state management.
 * 
 * @example
 * // Example of implementing the IForm interface in a form component
 * class MyForm extends ObservableComponent<IFormProps, IFormState, IFormEvent> implements IForm {
 *     defaultName = "myForm";
 *     state = { isSubmitting: false, formFields: null, tabs: { mobile: false, items: [] }, children: null, header: null };
 *     componentProps: IFormProps = {};
 *     primaryKeyFields: IFormFieldsProp = {};
 *     
 *     init() {
 *         // Initialization logic
 *     }
 *     
 *     getName(): string {
 *         return this.defaultName;
 *     }
 *     
 *     // Other method implementations...
 * }
 */
export interface IForm extends ObservableComponent<IFormProps, IFormState, IFormEvent> {
    defaultName: string;
    readonly state: IFormState;
    componentProps: IFormProps;
    primaryKeyFields: IFormFieldsProp;
    /** Initializes the form component. */
    init(): void;
    /** Returns the name of the form. */
    getName(): string;
    /** Checks if the document is being edited. */
    isDataEditing(props?: IFormProps): boolean;
    /** Retrieves the data from the form. */
    getData(options?: IFormGetDataOptions): IFormData;
    /** Retrieves a specific field by name. */
    getField(fieldName: string): IFormField | null;
    /** Retrieves all fields in the form. */
    getFields(): IFormFields;
    /**
     * Checks if the form is valid.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    isValid(): boolean;
    /** Retrieves any validation errors. */
    getErrors(): string[];
    /** Renders a loading indicator for the form. */
    renderLoading(options?: IFormProps): ReactNode;
    /** Mounts a field from the form. */
    mountField(field: IFormField): void;
    /** Unmounts a field from the form. */
    unmountField(field: IFormField): void;
    /** Checks if the form is a resource type. */
    isResource(): boolean;
    /** Retrieves the resource name associated with the form. */
    getResourceName(): IResourceName | undefined;
    /** Determines the type of rendering for tabs. */
    getRenderTabType(options?: IFormProps): IFormRenderTabProp;
    /** Checks if the form is loading. */
    isLoading(options?: IFormProps): boolean;
    /** Renders child components of the form. */
    renderChildren(options?: IFormProps): ReactNode;
    /** Renders the header of the form. */
    renderHeader(options?: IFormProps): ReactNode;
    /** Prepares the state of the form based on props. */
    prepareState(props?: IFormProps): IFormState;
    /** Prepares the fields of the form based on props. */
    prepareFields(props?: IFormProps): IFormFieldsProp;
    /** Determines if a field can be rendered. */
    canRenderField(options: IFormProps & { field: IFormFieldProps; fieldName: string; isUpdate: boolean; }): boolean;
    /** Prepares a specific field for rendering. */
    prepareField(options: IFormProps & { field: IFormFieldProps; fieldName: string; isUpdate: boolean; }): IFormFieldProps | null;
    /** Checks if the form has fields. */
    hasFields(): boolean;
    /** Mounts the form instance. */
    mountMe(): void;
    /** Sets the submission status of the form. */
    setHasTriedTobeSubmitted(hasTriedTobeSubmitted: boolean): void;
    /** Checks if the form has attempted submission. */
    hasTriedTobeSubmitted(): boolean;
    /** Retrieves the error text from the form. */
    getErrorText(): string;
    /** Retrieves the actions associated with the form. */
    getActions(): Record<string, IFormAction>;
    /** Resets all fields in the form. */
    resetFields(): void;
    /** Toggles the submitting state of the form. */
    toggleIsSubmitting(isSubmitting: boolean, callback?: Function): void;
    /** Toggles the loading state of actions associated with the form. */
    toggleActionIsLoading(actionIsLoading: boolean): void;
    /** Handles the submission of the form. */
    onSubmit(options: IFormOnSubmitOptions): Promise<any>;
    /** Prepares data before submission. */
    beforeSubmit(options: IFormOnSubmitOptions): Promise<any>;
    /** Validates the form. */
    submit(): Promise<any>;
    /**
     * called when the form is validated
     */
    onValidate: (...rest: any[]) => void;

    /** Toggles the validation status of the form. */
    toggleValidationStatus(validationStatus?: boolean, trigger?: boolean): boolean;
    /** Handles cases where validation is not required. */
    onNoValidate(...rest: any[]): void;
    /** Handles keyboard events for the form. */
    handleKeyboardEvent(options: IFormKeyboardEventHandlerOptions): void;
};

/**
 * @group  Form
 * Represents a form field component that extends the `ObservableComponent`.
 * The `IFormField` interface defines the structure and behavior of a form field,
 * including methods for validation, state management, and rendering.
 *
 * @interface IFormField
 * @extends ObservableComponent<IFormFieldProps, IFormFieldState, IFormEvent>
 * @template  Type - The type of the field.
 * 
 * @remarks
 * This interface is designed to be implemented by various field components within a form,
 * providing a consistent API for managing field behavior and interactions. It includes methods
 * for validation, value management, and rendering, making it easier to create dynamic forms.
 */
export interface IFormField<Type extends IFieldType = any> extends ObservableComponent<IFormFieldProps<Type>, IFormFieldState, IFormEvent> {
    /**
     * Retrieves the name of the field.
     * 
     * @returns {string} - The name of the field.
     * 
     * @example
     * const fieldName = this.getName(); // Retrieves the field name
     */
    getName(): string;
    /**
     * Retrieves the valid value of the field based on the provided form data.
     * 
     * @param {IFormData} formData - The form data to use for validation.
     * @returns {any} - The valid value of the field.
     * 
     * @example
     * const validValue = this.getValidValue(formData); // Retrieves the valid value
     */
    getValidValue(formData: IFormData): any;
    /**
     * Checks if the field is valid.
     * 
     * @returns {boolean} - Returns true if the field is valid, otherwise false.
     * 
     * @example
     * const isValid = this.isValid(); // Checks if the field is valid
     */
    isValid(): boolean;
    /**
     * Retrieves the label to display for the field.
     * 
     * @returns {string} - The label for the field.
     * 
     * @example
     * const label = this.getLabel(); // Retrieves the field label
     */
    getLabel(): string;
    /**
     * Retrieves the error message associated with the field.
     * 
     * @returns {string} - The error message for the field.
     * 
     * @example
     * const errorMessage = this.getErrorText(); // Retrieves the error message
     */
    getErrorText(): string;
    /**
     * Compares two values for equality.
     * 
     * @param {any} a - The first value to compare.
     * @param {any} b - The second value to compare.
     * @returns {boolean} - Returns true if the values are equal, otherwise false.
     * 
     * @example
     * const areEqual = this.compareValues(5, 5); // true
     */
    compareValues(a: any, b: any): boolean;
    /**
     * The component properties for the field.
     * 
     * @readonly
     * @type {IFormFieldProps<Type>}
     */
    componentProps: IFormFieldProps<Type>;
    /**
     * Checks if validation has been performed on the field.
     * 
     * @returns {boolean} - Returns true if validation has been performed, otherwise false.
     * 
     * @example
     * const hasValidated = this.hasPerformedValidation(); // true or false
     */
    hasPerformedValidation(): boolean;
    /**
     * Determines if the field can display an error message.
     * 
     * @returns {boolean} - Returns true if the field can display an error, otherwise false.
     * 
     * @example
     * const canShowError = this.canDisplayError(); // true or false
     */
    canDisplayError(): boolean;
    /**
     * Sets the form's submission status for validation.
     * 
     * @param {boolean} [formTriedTobeSubmitted] - Indicates if the form has been submitted.
     * 
     * @example
     * this.setFormTriedTobeSubmitted(true); // Sets the submission status
     */
    setFormTriedTobeSubmitted(formTriedTobeSubmitted?: boolean): void;
    /**
     * Sets the value of the field and triggers validation.
     * 
     * @param {any} value - The new value for the field.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.setValue("new value"); // Sets the field value
     */
    setValue(value: any): Promise<IFormFieldValidatorOptions<Type>>;
    /**
     * Retrieves a field by its name /**
     * Retrieves a field by its name.
     * 
     * @param {string} fieldName - The name of the field to retrieve.
     * @returns {IFormField | null} - The field if found, otherwise null.
     * 
     * @example
     * const field = this.getField("username"); // Retrieves the username field
     */
    getField<T extends IFieldType = any>(fieldName: string): IFormField<T> | null;
    /**
     * Validates the field with the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @param {boolean} [force] - Whether to force validation.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.validate({ required: true }); // Validates the field
     */
    validate(options: IFormFieldValidatorOptions<Type>, force?: boolean): Promise<IFormFieldValidatorOptions<Type>>;
    /**
     * Validates the field on change with the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.validateOnChange({ required: true }); // Validates on change
     */
    validateOnChange(options: IFormFieldValidatorOptions<Type>): Promise<IFormFieldValidatorOptions<Type>>;
    /**
     * Determines if the field can validate on blur.
     * 
     * @returns {boolean} - Returns true if validation on blur is possible, otherwise false.
     * 
     * @example
     * const canValidateOnBlur = this.canValidateOnBlur(); // true or false
     */
    canValidateOnBlur(): boolean;
    /**
     * Determines if the field can validate on mount.
     * 
     * @returns {boolean} - Returns true if validation on mount is possible, otherwise false.
     * 
     * @example
     * const canValidateOnMount = this.canValidateOnMount(); // true or false
     */
    canValidateOnMount(): boolean;
    /**
     * Retrieves the validation rules for the field.
     * 
     * @returns {IValidatorRule[]} - An array of validation rules.
     * 
     * @example
     * const rules = this.getValidationRules(); // Retrieves validation rules
     */
    getValidationRules(): IValidatorRule[];
    /**
     * Retrieves the type of the field.
     * 
     * @returns {string} - The type of the field.
     * 
     * @example
     * const fieldType = this.getType(); // Retrieves the field type
     */
    getType(): string;
    /**
     * Sanitizes the value of the field.
     * 
     * @param {any} value - The value to sanitize.
     * @returns {any} - The sanitized value.
     * 
     * @example
     * const sanitizedValue = this.sanitizeValue(rawValue); // Sanitizes the value
     */
    sanitizeValue(value: any): any;
    /**
     * Prepares the field for validation with the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {any} - The prepared options for validation.
     * 
     * @example
     * const preparedOptions = this.beforeValidate(options); // Prepares for validation
     */
    beforeValidate(options: IFormFieldValidatorOptions<Type>): any;
    /**
     * Calls the onChange handler with the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The options to pass to the onChange handler.
     * 
     * @example
     * this.callOnChange(options); // Calls the onChange handler
     */
    callOnChange(options: IFormFieldValidatorOptions<Type>): void;
    /**
     * Handles validation for the field with the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {Promise<any>} - A promise that resolves with the validation result.
     * 
     * @example
     * this.onValidate(options); // Handles validation
     */
    onValidate(options: IFormFieldValidatorOptions<Type>): Promise<any>;
    /**
     * Handles the case where validation is not performed.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {Promise<any>} - A promise that resolves with the result of no validation.
     * 
     * @example
     * this.onNoValidate(options); // Handles no validation
     */
    onNoValidate(options: IFormFieldValidatorOptions<Type>): Promise<any>;
    /**
     * Checks if the field is in its raw state.
     * 
     * @returns {boolean} - Returns true if the field is raw, otherwise false.
     * 
     * @example
     * const isRaw = this.isRaw(); // true or false
     */
    isRaw(): boolean;
    /**
     * Retrieves the component properties for the field, optionally merging with provided props.
     * 
     * @param {IFormFieldProps} [props] - Optional additional properties to merge.
     * @returns {IFormFieldProps} - The merged component properties.
     * 
     * @example
     * const props = this.getComponentProps({ additionalProp: true }); // Retrieves component props
     */
    getComponentProps(props?: IFormFieldProps): IFormFieldProps;
    /**
     * Checks if the form is currently loading.
     * 
     * @returns {boolean} - Returns true if the form is loading, otherwise false.
     * 
     * @example
     * const isLoading = this.isFormLoading(); // true or false
     */
    isFormLoading(): boolean;
    /**
     * Checks if the form is currently submitting.
     * 
     * @returns {boolean} - Returns true if the form is submitting, otherwise false.
     * 
     * @example
     * const isSubmitting = this.isFormSubmitting(); // true or false
     */
    isFormSubmitting(): boolean;
    /**
     * Renders a loading state for the field.
     * 
     * @param {IFormFieldProps} props - The properties to use for rendering.
     * @returns {ReactNode} - The rendered loading component.
     * 
     * @example
     * const loadingComponent = this.renderLoading(props); // Renders loading state
     */
    renderLoading(props: IFormFieldProps): ReactNode;
    /**
     * Registers the field with the form.
     * 
     * @example
     * this.onRegister(); // Registers the field
     */
    onRegister(): void;
    /**
     * Unregisters the field from the form.
     * 
     * @example
     * this.onUnregister(); // Unregisters the field
     */
    onUnregister(): void;
    /**
     * Retrieves the current value of the field.
     * 
     * @returns {any} - The current value of the field.
     * 
     * @example
     * const value = this.getValue(); // Retrieves the field value
     */
    getValue(): any;
    /**
     * Checks if the field is a filter.
     * 
     * @returns {boolean} - Returns true if the field is a filter, otherwise false.
     * 
     * @example
     * const isFilter = this.isFilter(); // true or false
     */
    isFilter(): boolean;
    /**
     * Checks if the field is editable.
     * 
     * @returns {boolean} - Returns true if the field is editable, otherwise false.
     * 
     * @example
     * const isEditable = this.isEditable(); // true or false
     */
    isEditable(): boolean;
    /**
     * Checks if the field is disabled.
     * 
     * @returns {boolean} - Returns true if the field is disabled, otherwise false.
     * 
     * @example
     * const isDisabled = this.isDisabled(); // true or false
     */
    isDisabled(): boolean;
    /**
     * Disables the field.
     * 
     * @example
     * this.disable(); // Disables the field
     */
    disable(): void;
    /**
     * Enables the field.
     * 
     * @example
     * this.enable(); // Enables the field
     */
    enable(): void;
    /**
     * Checks if the field is a text field.
     * 
     * @returns {boolean} - Returns true if the field is a text field, otherwise false.
     * 
     * @example
     * const isTextField = this.isTextField(); // true or false
     */
    isTextField(): boolean;
    /**
     * Renders the field component.
     * 
     * @param {IFormFieldProps} props - The properties to use for rendering.
     * @param {any} [innerRef] - Optional reference to the inner component.
     * @returns {ReactNode} - The rendered field component.
     * 
     * @example
     * const renderedField = this._render(props); // Renders the field
     */
    _render(props: IFormFieldProps, innerRef?: any): ReactNode;
    /**
     * Determines if the field can accept decimal values.
     * 
     * @returns {boolean} - Returns true if the field can accept decimal values, otherwise false.
     * 
     * @example
     * const canBeDecimal = this.canValueBeDecimal(); // true or false
     */
    canValueBeDecimal(): boolean;
    /**
     * Sets a reference to the field element.
     * 
     * @param {any} el - The element to set as a reference.
     * 
     * @example
     * this.setRef(element); // Sets the reference to the element
     */
    setRef(el: any): void;
    /**
     * Retrieves keyboard event handlers for the field.
     * 
     * @param {IKeyboardEventHandlerProps} keyboardEventHandlerProps - The properties for keyboard event handling.
     * @returns {IKeyboardEventHandlerKey[]} - An array of keyboard event handler keys.
     * 
     * @example
     * const keyboardEvents = this.getKeyboardEvents(props); // Retrieves keyboard event handlers
     */
    getKeyboardEvents(keyboardEventHandlerProps: IKeyboardEventHandlerProps): IKeyboardEventHandlerKey[];
    /**
     * Retrieves the form associated with the field.
     * 
     * @returns {IForm | null} - The form if associated, otherwise null.
     * 
     * @example
     * const form = this.getForm(); // Retrieves the associated form
     */
    getForm(): IForm | null;
    /**
     * Focuses on the field.
     * 
     * @example
     * this.focus(); // Focuses on the field
     */
    focus(): void;
    /**
     * Focuses on the next field in the form.
     * 
     * @example
     * this.focusNextField(); // Focuses on the next field
     */
    focusNextField(): void;
    /**
     * Focuses on the previous field in the form.
     * 
     * @example
     * this.focusPrevField(); // Focuses on the previous field
     */
    focusPrevField(): void;
    /**
     * Handles keyboard events for the field.
     * 
     * @param {IKeyboardEventHandlerKey} key - The key event to handle.
     * @param {IKeyboardEventHandlerEvent} event - The keyboard event.
     * 
     * @example
     * this.onKeyEvent(key, event); // Handles the keyboard event
     */
    onKeyEvent(key: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent): void;
    /**
     * Updates the breakpoint style based on the provided dimensions.
     * 
     * @param {IDimensions} args - The dimensions to use for updating styles.
     * 
     * @example
     * this.doUpdateBreakpointStyle(dimensions); // Updates the breakpoint style
     */
    doUpdateBreakpointStyle(args: IDimensions): void;
    /**
     * Determines if the field can handle breakpoint styles.
     * 
     * @param {IFormFieldProps} [props] - Optional properties to check against.
     * @returns {boolean} - Returns true if the field can handle breakpoint styles, otherwise false.
     * 
     * @example
     * const canHandle = this.canHandleBreakpointStyle(props); // true or false
     */
    canHandleBreakpointStyle(props?: IFormFieldProps): boolean;
    /**
     * Retrieves the breakpoint style for the field.
     * 
     * @param {IFormFieldProps} [props] - Optional properties to use for retrieving styles.
     * @returns {IStyle} - The breakpoint style for the field.
     * 
     * @example
     * const style = this.getBreakpointStyle(props); // Retrieves the breakpoint style
     */
    getBreakpointStyle(props?: IFormFieldProps): IStyle;
    /**
     * Triggers the mount lifecycle for the field.
     * 
     * @example
     * this.triggerMount(); // Triggers the mount lifecycle
     */
    triggerMount(): void;
    /**
    * Triggers the unmount lifecycle for the field.
    * 
    * @example
    * this.triggerUnmount(); // Triggers the unmount lifecycle
    */
    triggerUnmount(): void;
}


/**
 * Interface representing the options available when submitting a form.
 * 
 * This interface extends the IFormContext and includes additional properties
 * that provide context about the form submission, such as the form data
 * being submitted and whether the submission is for an update or a new entry.
 * 
 * @interface IFormOnSubmitOptions
 * 
 * @example
 * const submitOptions: IFormOnSubmitOptions = {
 *     data: {
 *         name: 'John Doe',
 *         email: 'john.doe@example.com',
 *     },
 *     isUpdate: false,
 *     // Additional properties from IFormContext can be included here
 * };
 * 
 * // Function to handle form submission
 * function handleSubmit(options: IFormOnSubmitOptions) {
 *     if (options.isUpdate) {
 *         console.log('Updating user data:', options.data);
 *     } else {
 *         console.log('Creating new user with data:', options.data);
 *     }
 * }
 * @see {@link IFormContext} for additional properties available in the context.
 */
export interface IFormOnSubmitOptions extends IFormContext {
    /**
     * The data being submitted through the form.
     * 
     * This property contains the structured data that the user has filled out
     * in the form. It is essential for processing the submission, whether it
     * is for creating a new entry or updating an existing one.
     * 
     * @type {IFormData}
     * 
     * @example
     * const formData: IFormData = {
     *     name: 'Jane Doe',
     *     email: 'jane.doe@example.com',
     * };
     * 
     * const options: IFormOnSubmitOptions = {
     *     data: formData,
     *     isUpdate: true,
     *     // Other context properties
     * };
     */
    data: IFormData;

    /**
     * Indicates whether the form submission is for an update.
     * 
     * This boolean flag helps determine the context of the submission.
     * If true, the submission is intended to update an existing record;
     * if false, it is for creating a new record.
     * 
     * @type {boolean}
     * 
     * @example
     * const options: IFormOnSubmitOptions = {
     *     data: {
     *         name: 'Alice Smith',
     *         email: 'alice.smith@example.com',
     *     },
     *     isUpdate: false,
     * };
     * 
     * // Check if the submission is an update
     * if (options.isUpdate) {
     *     console.log('Updating existing record.');
     * } else {
     *     console.log('Creating a new record.');
     * }
     */
    isUpdate: boolean;
};

/**
 * Interface representing the options available for validating a form field.
 * 
 * This interface extends the IValidatorValidateOptions and includes additional properties
 * that provide context and information necessary for validating a specific form field.
 * It allows for the inclusion of previous values, validation messages, and field context.
 * 
 * @interface IFormFieldValidatorOptions
 * 
 * @example
 * const validatorOptions: IFormFieldValidatorOptions = {
 *     prevValue: 'oldValue',
 *     context: formFieldInstance,
 *     message: 'This field is required.',
 *     fieldName: 'username',
 * };
 * 
 * // Function to validate a form field
 * function validateField(options: IFormFieldValidatorOptions) {
 *     if (!options.context.value) {
 *         return options.message || 'Validation failed.';
 *     }
 *     return 'Validation passed.';
 * }
 */
export interface IFormFieldValidatorOptions<Type extends IFieldType = any> extends IValidatorValidateOptions {
    /**
     * The previously assigned value to the field.
     * 
     * This property can be used to compare the current value with the previous one,
     * which is useful in scenarios where the validation logic depends on changes
     * made to the field's value.
     * 
     * @type {any}
     * 
     * @example
     * const options: IFormFieldValidatorOptions = {
     *     prevValue: 'initialValue',
     *     context: formFieldInstance,
     * };
     * 
     * // Check if the value has changed
     * if (options.context.value !== options.prevValue) {
     *     console.log('Value has changed.');
     * }
     */
    prevValue?: any;
    /**
     * The context related to the form field.
     * 
     * This property provides access to the form field instance, allowing
     * validators to access the current value, state, and other relevant
     * information about the field being validated.
     * 
     * @type {IFormField<Type>}
     * 
     * @example
     * const options: IFormFieldValidatorOptions = {
     *     context: {
     *         value: 'currentValue',
     *         // Other properties of IFormField
     *     },
     * };
     * 
     * // Access the current value of the field
     * console.log('Current field value:', options.context.value);
     */
    context: IFormField<Type>;

    /**
     * The name of the field that is being validated.
     * 
     * This property can be useful for identifying the field in error messages
     * or logging, making it easier to track which field has failed validation.
     * 
     * @type {string}
     * 
     * @example
     * const options: IFormFieldValidatorOptions = {
     *     fieldName: 'email',
     * };
     * 
     * // Log the field name during validation
     * console.log(`Validating field: ${options.fieldName}`);
     */
    fieldName?: string;
};

/**
 * Interface representing the options available for form callbacks.
 * 
 * This interface extends both `IFormProps` and `IFormContext`, combining properties
 * that define the form's configuration and its current context. It is designed
 * to provide a comprehensive set of options for handling form-related callbacks,
 * such as submission, validation, and reset actions.
 * 
 * @interface IFormCallbackOptions
 * 
 * @example
 * const callbackOptions: IFormCallbackOptions = {
 *     // Properties from IFormProps
 *     onSubmit: (data) => {
 *         console.log('Form submitted with data:', data);
 *     },
 *     onReset: () => {
 *         console.log('Form has been reset.');
 *     },
 *     // Properties from IFormContext
 *     currentField: 'username',
 *     isValid: true,
 * };
 * 
 * // Function to handle form submission
 * function handleFormSubmission(options: IFormCallbackOptions) {
 *     if (options.isValid) {
 *         options.onSubmit({ username: 'user123' });
 *     } else {
 *         console.log('Form is not valid.');
 *     }
 * }
 */
export interface IFormCallbackOptions extends IFormProps, IFormContext { }

/**
 * Interface representing the options available for retrieving form data.
 * 
 * This interface provides configuration options for the `getData` function,
 * which is responsible for returning the current state of the form data.
 * The behavior of the data retrieval can be controlled using the `handleChange`
 * property, allowing for flexibility in how data is accessed.
 * 
 * @interface IFormGetDataOptions
 * 
 * @example
 * const getDataOptions: IFormGetDataOptions = {
 *     handleChange: true,
 * };
 * 
 * // Function to retrieve form data based on options
 * function retrieveFormData(options: IFormGetDataOptions) {
 *     if (options.handleChange) {
 *         // Logic to get both initial and current field data
 *         console.log('Retrieving all form data, including changes.');
 *     } else {
 *         // Logic to get only the initial data
 *         console.log('Retrieving only initial form data.');
 *     }
 * }
 * @remarks
*  When `handleChange` is set to false, the `getData` function will return
*  only the initial data, i.e., the data passed as a parameter to the
*  `Form` component by its parent.
* 
*  If `handleChange` is not set to false, in addition to the initial data
*  provided by the parent of the `Form` component, the data from the
*  various fields will also be retrieved.
 */
export interface IFormGetDataOptions {
    /**
     * When `handleChange` is set to false, the `getData` function will return
     * only the initial data, i.e., the data passed as a parameter to the
     * `Form` component by its parent.
     * 
     * If `handleChange` is not set to false, in addition to the initial data
     * provided by the parent of the `Form` component, the data from the
     * various fields will also be retrieved.
     * 
     * @type {boolean}
     * 
     * @default true
     * 
     * @example
     * const options: IFormGetDataOptions = {
     *     handleChange: false, // Only retrieve initial data
     * };
     * 
     * // Example usage in a function
     * const data = getData(options);
     * console.log(data); // Outputs only the initial data
     */
    handleChange?: boolean;
};

/**
 * Interface representing the properties for a form component.
 * 
 * This interface extends `IViewProps` (excluding the `children` property) and
 * includes various options for configuring the behavior and appearance of the form.
 * It provides hooks for handling form submission, validation, and rendering options,
 * making it a comprehensive interface for form management.
 * 
 * @interface IFormProps
 * 
 * @example
 * const formProps: IFormProps = {
 *     data: { username: 'user123', email: 'user@example.com' },
 *     beforeSubmit: (options) => {
 *         console.log('Preparing to submit:', options);
 *         return true; // or return a promise
 *     },
 *     onSubmit: (options) => {
 *         console.log('Form submitted with data:', options.data);
 *     },
 *     name: 'userForm',
 *     isLoading: false,
 *     disabled: false,
 * };
 */
export interface IFormProps extends Omit<IViewProps, "children"> {
    /**
     * The initial data for the form.
     * 
     * This property allows you to pass initial values to the form fields.
     * 
     * @type {IFormData}
     * 
     * @example
     * const formData: IFormData = {
     *     username: 'user123',
     *     email: 'user@example.com',
     * };
     */
    data?: IFormData;

    /**
     * Permissions associated with the form.
     * 
     * This property can be used to define access control for the form.
     * 
     * @type {IAuthPerm}
     */
    perm?: IAuthPerm;

    /**
     * Function called immediately before the form data is submitted.
     * 
     * This function can return a promise or throw an exception to prevent
     * the form from being submitted. It is recommended to mutate the data
     * in this function rather than in the `onSubmit` function.
     * 
     * @param options - Options for the submission process.
     * @returns {boolean | string | Promise} - Return true to proceed, or a string for an error message.
     * 
     * @example
     * beforeSubmit: (options) => {
     *     if (!options.data.username) {
     *         return 'Username is required.';
     *     }
     *     return true;
     * }
     */
    beforeSubmit?: (options: IFormOnSubmitOptions) => any;

    /**
     * Function called when the form data submission is triggered.
     * 
     * The submission process follows these steps:
     * 1. The `beforeSubmit` function is called. If the promise resolves, 
     * 2. The form status is updated to `isSubmitting`, and the `onSubmit` function is called.
     * 3. After success or failure of the `onSubmit` function, the `isSubmitting` status is reset to false.
     * 
     * This function can be called from the Field component when the form is valid
     * and the Enter key is pressed, or if an action (button or menu item) with the
     * `formName` prop equal to the form's name is clicked.
     * 
     * @param options - Options for the submission process.
     * @returns {boolean | string | Promise} - Return true to proceed, or a string for an error message.
     * 
     * @example
     * onSubmit: (options) => {
     *     console.log('Submitting form with data:', options.data);
     *     return true; // or return a promise
     * }
     */
    onSubmit?: (options: IFormOnSubmitOptions) => any;

    /**
     * The name of the form.
     * 
     * This property can be used to identify the form in various contexts.
     * 
     * @type {string}
     * 
     * @example
     * name: 'userForm',
     */
    name?: string;

    /**
     * Callback method called when all fields in the form are valid.
     * 
     * @param options - Options related to field validation.
     * @returns {any} - Return value can be used for further processing.
     * 
     * @example
     * onValidate: (options) => {
     *     console.log('All fields are valid:', options);
     * }
     */
    onValidate?: (options: IFormFieldValidatorOptions) => any;

    /**
     * Callback method called when at least one field in the form is not valid.
     * * This function takes parameters including:
     * - `name`: The name of the field.
     * - `value`: The value that failed validation for the field.
     * - `msg`: The corresponding error message.
     * - `validRule`: The validation rule.
     * - `validParams`: The validation parameters.
     * - `event`: The event that triggered the form validation.
     * 
     * @param options - Options related to field validation.
     * @returns {any} - Return value can be used for further processing.
     * 
     * @example
     * onNoValidate: (options) => {
     *     console.log('Field not valid:', options.name, options.msg);
     * }
     */
    onNoValidate?: (options: IFormFieldValidatorOptions) => any;

    /**
     * Callback method called when a field in the form is valid.
     * 
     * @param options - Options related to field validation.
     * @returns {any} - Return value can be used for further processing.
     * 
     * @example
     * onValidateField: (options) => {
     *     console.log('Field valid:', options.fieldName);
     * }
     */
    onValidateField?: (options: IFormFieldValidatorOptions) => any;

    /**
     * Callback method called when a field in the form is not valid.
     * 
     * @param options - Options related to field validation.
     * @returns {any} - Return value can be used for further processing.
     * 
     * @example
     * onNoValidateField: (options) => {
     *     console.log('Field not valid:', options.fieldName);
     * }
     */
    onNoValidateField?: (options: IFormFieldValidatorOptions) => any;

    /**
     * Object representing keyboard event handlers.
     * 
     * This property allows you to define custom handlers for keyboard events
     * associated with the form fields.
     * 
     * @type {IKeyboardEventHandlerKey[]}
     * 
     * @example
     * keyboardEvents: [
     *     { eventName: 'keydown', handler: (event) => console.log('Key down:', event) },
     * ]
     */
    keyboardEvents?: IKeyboardEventHandlerKey[];
    /**
     * Callback method called when the Enter key is pressed.
     * 
     * If this function returns false, the form's submit function will not be called.
     * 
     * @param options - Options related to keyboard events.
     * @returns {boolean | any} - Return false to prevent submission.
     * 
     * @example
     * onEnterKeyPress: (options) => {
     *     if (options.fieldName === 'username') {
     *         return false; // Prevent submission if username field is focused
     *     }
     * }
     */
    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;

    /**
     * Callback method called when a keyboard event is detected on any form field.
     * 
     * @param options - Options related to keyboard events.
     * @returns {any} - Return value can be used for further processing.
     * 
     * @example
     * onKeyboardEvent: (options) => {
     *     console.log('Keyboard event:', options.event);
     * }
     */
    onKeyboardEvent?: (options: IFormKeyboardEventHandlerOptions) => any;

    /**
     * The fields of the form.
     * 
     * This property allows you to define the fields that will be included in the form.
     * 
     * @type {IFormFieldsProp}
     * 
     * @example
     * fields: {
     *     username: { type: 'text', required: true },
     *     email: { type: 'email', required: true },
     * }
     */
    fields?: IFormFieldsProp;

    /**
     * Function to determine if the current data is being edited.
     * 
     * This property takes the data object as a parameter and returns a boolean
     * indicating whether the data is currently being edited.
     * 
     * @param options - Options related to data editing.
     * @returns {boolean} - Return true if data is being edited.
     * 
     * @example
     * isDataEditing: (options) => {
     *     return options.data.id !== undefined; // Check if editing existing data
     * }
     */
    isDataEditing?: (options: IFormCallbackOptions) => boolean;

    /**
     * Disable all fields in the form.
     * 
     * When this property is true, all fields in the form will be disabled.
     * 
     * @type ```typescript
     * @type {boolean}
     * 
     * @example
     * disabled: true, // All fields will be disabled
     */
    disabled?: boolean;

    /**
     * Make all fields in the form read-only.
     * 
     * When this property is true, all fields in the form will be read-only.
     * 
     * @type {boolean}
     * 
     * @example
     * readonly: true, // All fields will be read-only
     */
    readonly?: boolean;

    /**
     * Specify if the data is currently being updated.
     * 
     * By default, this is overwritten with the return value of the `isDataEditing` function.
     * 
     * @type {boolean}
     * 
     * @example
     * isUpdate: true, // Indicates that the form is in update mode
     */
    isUpdate?: boolean;

    /**
     * Specify if the form items will be responsive.
     * 
     * When this property is true, the form will adjust its layout based on the screen size.
     * 
     * @type {boolean}
     * 
     * @example
     * responsive: true, // Form items will be responsive
     */
    responsive?: boolean;

    /**
     * Names of the fields that will be rendered by the form.
     * 
     * This property allows you to specify which fields should be rendered by default.
     * 
     * @type {string[]}
     * 
     * @example
     * renderableFieldsNames: ['username', 'email'], // Only these fields will be rendered
     */
    renderableFieldsNames?: string[];

    /**
     * Function to determine if a field should be rendered by the form.
     * 
     * This property returns a boolean indicating whether the field will be rendered.
     * 
     * @param options - Options related to rendering fields.
     * @returns {boolean} - Return true if the field should be rendered.
     * 
     * @example
     * canRenderField: (options) => {
     *     return options.isUpdate; // Render field only if in update mode
     * }
     */
    canRenderField?(
        options: IFormProps & {
            field: IFormFieldProps;
            fieldName: string;
            isUpdate: boolean;
        }
    ): boolean;

    /**
     * Indicates the loading state of the form.
     * 
     * This property can be used to show a loading indicator while the form is being processed.
     * 
     * @type {boolean}
     * 
     * @example
     * isLoading: true, // Form is currently loading
     */
    isLoading?: boolean;

    /**
     * Indicates if the form is currently being submitted.
     * 
     * This property can be used to show a loading indicator or disable the form during submission.
     * 
     * @type {boolean}
     * 
     * @example
     * isSubmitting: true, // Form is currently submitting
     */
    isSubmitting?: boolean;

    /**
     * React node that serves as the header for the form.
     * 
     * This property allows you to customize the header of the form.
     * 
     * @type {((options: IFormProps) => ReactElement) | ReactElement}
     * 
     * @example
     * header: <h1>User Form</h1>, // Custom header for the form
     */
    header?: ((options: IFormProps) => ReactElement) | ReactElement;

    /**
     * Element node that will be rendered as children of the form.
     * 
     * This property allows you to pass additional content to be rendered within the form.
     * 
     * @type {((options: IFormProps) => ReactElement) | ReactElement}
     * 
     * @example
     * children: <p>Please fill out the form below:</p>, // Additional content
     */
    children?: ((options: IFormProps) => ReactElement) | ReactElement;

    /**
     * Props representing the components to render for displaying tab content in the form.
     * 
     * This property allows you to define tab items for the form.
     * 
     * @type {IFormTabItemsProp}
     * 
     * @example
     * tabItems: [{ title: 'Tab 1', content: <Tab1Content /> }, { title: 'Tab 2', content: <Tab2Content /> }],
     */
    tabItems?: IFormTabItemsProp;

    /**
     * Props representing the components to render for displaying tab content in the form.
     * 
     * This property allows you to define tab items for the form.
     * 
     * @type {IFormTabItemsProp}
     * 
     * @example
     * tabItems: [{ title: 'Tab 1', content: <Tab1Content /> }, { title: 'Tab 2', content: <Tab2Content /> }],
     */
    sessionName?: string;

    /**
     * Props to pass to the Tab component when tabItems are provided to the form.
     * 
     * This property allows you to customize the behavior and appearance of the tabs.
     * 
     * @type {ITabProps}
     * 
     * @example
     * tabsProps: { activeTab: 0, onTabChange: (index) => console.log('Tab changed to:', index) },
     */
    tabsProps?: ITabProps;

    /**
     * The width of the window, used to prevent fields from being responsive on small screens or dialog boxes.
     * 
     * @type {number}
     * 
     * @example
     * windowWidth: 768, // Width threshold for responsive behavior
     */
    windowWidth?: number;

    /**
    * Props to pass to the main TabItem when the renderTabType is set to mobile,
    * or when tabItems are rendered in a mobile environment.
    * 
    * @type {ITabItemProps}
    * 
    * @example
    * mainTabItemProps: { style: { padding: '10px' } },
    */
    mainTabItemProps?: ITabItemProps;

    /**
     * Specifies whether error messages will be displayed by the form fields.
     * 
     * @type {boolean}
     * 
     * @example
     * displayErrors: true, // Error messages will be displayed
     */
    displayErrors?: boolean;

    /**
     * Specifies the type of rendering for the tabs in the form.
     * 
     * @type {IFormRenderTabProp}
     * 
     * @example
     * renderTabType: 'desktop', // Render tabs for desktop view
     */
    renderTabType?: IFormRenderTabProp;
};

/**
 * Represents the rendering options for a form based on the device type.
 * The `IFormRenderTabProp` type is a union of string literals that specify
 * how the form should be rendered depending on the device context.
 * 
 * @type IFormRenderTabProp
 * 
 * @remarks
 * This type is useful for defining responsive behavior in forms, allowing developers
 * to specify whether the form should render specifically for mobile devices, desktop
 * devices, or automatically adjust based on the available space.
 * 
 * - `"mobile"`: Indicates that the form should be rendered in a mobile-friendly layout.
 * - `"desktop"`: Indicates that the form should be rendered in a desktop-friendly layout.
 * - `"auto"`: Indicates that the form should automatically determine the best layout
 *   based on the current device or viewport size.
 * 
 * @example
 * // Example of using IFormRenderTabProp in a form component
 * const renderForm = (renderTab: IFormRenderTabProp) => {
 *     switch (renderTab) {
 *         case "mobile":
 *             return <MobileForm />;
 *         case "desktop":
 *             return <DesktopForm />;
 *         case "auto":
 *             return <ResponsiveForm />;
 *         default:
 *             return null;
 *     }
 * };
 */
export type IFormRenderTabProp = "mobile" | "desktop" | "auto";

/**
 * Represents the items for tabs in a form.
 * The `IFormTabItemsProp` type can be an array of `IFormTabItemProp`, null, undefined,
 * or a function that returns an array of `IFormTabItemProp` based on the provided options.
 * 
 * @type IFormTabItemsProp
 * 
 * @remarks
 * This type is useful for defining the structure of tab items in a form, allowing for
 * flexibility in how tab items are provided. It can be used to statically define tab items
 * as an array, or dynamically generate them based on the form properties through a function.
 * 
 * - `IFormTabItemProp[]`: An array of tab item properties, where each item defines a tab.
 * - `null`: Indicates that there are no tab items.
 * - `undefined`: Indicates that the tab items are not defined.
 * - `((options: IFormProps) => IFormTabItemProp[])`: A function that takes form properties as an argument
 *   and returns an array of tab item properties, allowing for dynamic generation of tab items based on
 *   the current form state or configuration.
 * 
 * @example
 * // Example of using IFormTabItemsProp in a form component
 * const tabItems: IFormTabItemsProp = [
 *     { label: "Tab 1", content: <Tab1Content /> },
 *     { label: "Tab 2", content: <Tab2Content /> },
 * ];
 * 
 * const dynamicTabItems: IFormTabItemsProp = (options: IFormProps) => {
 *     return options.isAdvanced ? [{ label: "Advanced", content: <AdvancedTabContent /> }] : [];
 * };
 */
export type IFormTabItemsProp = IFormTabItemProp[] | null | undefined | ((options: IFormProps) => IFormTabItemProp[]);

/**
 * Represents a single tab item in a form.
 * The `IFormTabItemProp` type can be undefined, null, or an object that extends
 * the properties of `ITabItemProps`, with the exception of the `children` property.
 * The `children` property can either be a ReactNode or a function that returns a ReactNode
 * based on the provided form properties.
 * 
 * @type IFormTabItemProp
 * 
 * @remarks
 * This type is useful for defining the structure of individual tab items within a form,
 * allowing for both static and dynamic content rendering. The `children` property can be
 * a function that takes form properties as an argument, enabling the tab content to be
 * generated based on the current state or configuration of the form.
 * 
 * - `undefined`: Indicates that the tab item is not defined.
 * - `null`: Indicates that there is no tab item.
 * - `Omit<ITabItemProps, "children">`: An object that includes all properties of `ITabItemProps`
 *   except for `children`.
 * - `{ children: ((options: IFormProps) => ReactNode) | ReactNode; }`: The `children` property,
 *   which can be either a function that returns a ReactNode or a static ReactNode.
 * 
 * @example
 * // Example of using IFormTabItemProp in a form component
 * const tabItem: IFormTabItemProp = {
 *     label: "Tab 1",
 *     children: (options: IFormProps) => {
 *         return <div>{options.someProperty}</div>; // Dynamic content based on form props
 *     },
 * };
 * 
 * const staticTabItem: IFormTabItemProp = {
 *     label: "Tab 2",
 *     children: <div>This is static content for Tab 2.</div>, // Static content
 * };
 */
export type IFormTabItemProp = undefined | null | Omit<ITabItemProps, "children"> & { children: ((options: IFormProps) => ReactNode) | ReactNode; }

/**
 * Represents the state of a form component.
 * The `IFormState` interface defines the structure of the state used to manage
 * the form's submission status, fields, tabs, and other UI elements.
 * 
 * @interface IFormState
 * 
 * @property {boolean} isSubmitting - Indicates whether the form is currently being submitted.
 * @property {ReactNode} formFields - The rendered fields of the form, typically a collection of input components.
 * @property {Object} tabs - An object representing the tab configuration for the form.
 * @property {boolean} tabs.mobile - Indicates if the mobile tab is active or visible.
 * @property {ReactNode[]} tabs.items - An array of ReactNode representing the items in the tabs.
 * @property {ReactNode} children - The child components to be rendered within the form.
 * @property {ReactNode} header - The header content to be displayed at the top of the form.
 * 
 * @remarks
 * This interface is useful for managing the internal state of a form component,
 * allowing for dynamic updates based on user interactions, submission status, and
 * the rendering of various UI elements.
 * 
 * @example
 * // Example of using IFormState in a form component
 * const formState: IFormState = {
 *     isSubmitting: false,
 *     formFields: <InputField name="username" label="Username" />,
 *     tabs: {
 *         mobile: true,
 *         items: [
 *             <TabItem label="Tab 1" content={<Tab1Content />} />,
 *             <TabItem label="Tab 2" content={<Tab2Content />} />,
 *         ],
 *     },
 *     children: <div>Additional content goes here.</div>,
 *     header: <h1>Form Header</h1>,
 * };
 */
export interface IFormState {
    isSubmitting: boolean;
    formFields: ReactNode;
    tabs: { mobile: boolean; items: ReactNode[] };
    children: ReactNode;
    header: ReactNode;
}

/**
 * Represents the context for a form component.
 * The `IFormContext` interface defines the structure of the context object
 * that provides access to the form instance and its associated properties.
 * 
 * @interface IFormContext
 * 
 * @property {IForm | null} form - The form instance associated with the context.
 * If the form is not available, this property will be null.
 * 
 * @remarks
 * This interface is useful for providing a consistent way to access the form
 * instance within components that are part of the form's context. It allows
 * for easy interaction with the form's methods and properties, enabling
 * components to respond to form state changes and events.
 * 
 * @example
 * // Example of using IFormContext in a component
 * const MyComponent: React.FC = () => {
 *     const { form } = useContext(FormContext) as IFormContext;
 *     
 *     const handleSubmit = () => {
 *         if (form) {
 *             form.submit(); // Calls the submit method on the form instance
 *         }
 *     };
 *     
 *     return (
 *         <div>
 *             <button onClick={handleSubmit}>Submit</button>
 *         </div>
 *     );
 * };
 */
export interface IFormContext {
    form: IForm | null;
}


/**
 * Represents the data structure for a form.
 * The `IFormData` type is defined as a dictionary type, allowing for flexible
 * key-value pairs to represent the data associated with a form.
 * 
 * @type IFormData
 * 
 * @remarks
 * This type is useful for managing the state of form data, enabling easy access
 * and manipulation of the values entered by users. It can accommodate various
 * data types and structures, making it versatile for different form implementations.
 * 
 * The `IFormData` type is essentially an alias for `IDict`, which is a generic
 * dictionary type that can hold any key-value pairs.
 * 
 * @example
 * // Example of using IFormData to represent form data
 * const formData: IFormData = {
 *     username: "john_doe",
 *     email: "john@example.com",
 *     age: 30,
 *     isActive: true,
 * };
 * 
 * // Accessing form data
 * console.log(formData.username); // Outputs: "john_doe"
 * console.log(formData.email);    // Outputs: "john@example.com"
 */
export interface IFormData extends IDict {

}

/**
 * Represents the options for the onChange event of a form field.
 * The `IFormFieldOnChangeOptions` type extends the base `IOnChangeOptions` type
 * and includes additional context specific to the form field.
 * 
 * @type IFormFieldOnChangeOptions
 * @template onChangeEventType - The type of the change event, defaults to NativeSyntheticEvent<TextInputChangeEventData> | null.
 * @template ValueType - The type of the value for the field, defaults to any.
 * 
 * @property {IFormField} context - The form field instance associated with the change event.
 * 
 * @remarks
 * This type is useful for providing additional context when handling change events
 * for form fields, allowing developers to access the field instance and its properties
 * during the event handling process.
 * 
 * @example
 * // Example of using IFormFieldOnChangeOptions in an onChange handler
 * const handleFieldChange = (options: IFormFieldOnChangeOptions) => {
 *     const { value, context } = options;
 *     console.log("Field value changed:", value);
 *     console.log("Field name:", context.getName());
 * };
 */
export type IFormFieldOnChangeOptions<onChangeEventType = NativeSyntheticEvent<TextInputChangeEventData> | null, ValueType = any> = IOnChangeOptions<onChangeEventType, ValueType> & {
    context: IFormField;
};

/**
 * Represents the properties for a form field component.
 * This type extends the base field interface and includes additional properties
 * that control the behavior, validation, and rendering of the field within a form.
 *
 * @type IFormFieldProps
 * @template T - The type of the field, defaults to "text".
 * @template onChangeEventType - The type of the change event, defaults to NativeSyntheticEvent<TextInputChangeEventData> | null.
 * @template ValueType - The type of the value for the field, defaults to any.
 * 
 * @interface IFormFieldProps
 * 
 * @property {function} [getValidValue] - A function to retrieve the valid value of the field based on the provided options.
 * @property {boolean} [isFilter] - Indicates if the field is a filter component.
 * @property {boolean} [validateOnMount] - Specifies if the field should be validated on component mount.
 * @property {boolean} [validateOnBlur] - Specifies if the field should be validated when it loses focus.
 * @property {IValidatorRule[]} [validationRules] - An array of validation rules to apply to the field.
 * @property {IFormData} [data] - The form data associated with the field.
 * @property {boolean} [responsive] - Specifies if the field should render responsively, i.e., on multiple lines.
 * @property {function} [onValidate] - A function called when the field is validated. Can return a promise or a string error message.
 * @property {function} [onNoValidate] - A function called when the field fails validation.
 * @property {IKeyboardEventHandlerProps} [keyboardEventHandlerProps] - Props to pass to the KeyboardEventHandler component wrapping the field.
 * @property {string} [formName] - The name of the form to which the field belongs.
 * @property {function} [onChange] - A function called when the field value changes.
 * @property {string} [errorText] - The error message associated with the field.
 * @property {boolean} [error] - Indicates if the field contains an error.
 * @property {boolean} [isLoading] - Specifies if the field is currently loading.
 * @property {boolean} [isFormLoading] - Indicates if the entire form is in loading state.
 * @property {boolean} [isFormSubmitting] - Indicates if the form is currently being submitted.
 * @property {function} [renderLoading] - A function to render the loading element when the field is loading.
 * @property {any} [ref] - A reference to the field component.
 * @property {function} [onMount] - A function called when the field mounts.
 * @property {function} [onUnmount] - A function called when the field unmounts.
 * @property {boolean} [displayErrors] - Specifies whether to display error messages for the field.
 * @property {any} [defaultValue] - The default value of the field.
 * @property {boolean} [validateEmail] - Specifies whether to validate the email field, applicable only if the field type is email.
 * @property {number} [windowWidth] - The width of the window in which the field is rendered.
 * 
 * @example
 * // Example of using IFormFieldProps in a field component
 * const myFieldProps: IFormFieldProps = {
 *     name: "email",
 *     type: "email",
 *     label: "Email Address",
 *     validateOnBlur: true,
 *     validationRules: ["required", "email"],
 *     onChange: (options) => {
 *         console.log("Field value changed:", options.value);
 *     },
 *     onValidate: (options) => {
 *         if (!options.value.includes("@")) {
 *             return "Invalid email address.";
 *         }
 *         return true; // Validation passed
 *     },
 * };
 */
export type IFormFieldProps<T extends IFieldType = any, onChangeEventType = NativeSyntheticEvent<TextInputChangeEventData> | null, ValueType = any> = IField<T> & {
    getValidValue?: (options: { value: any; context: IFormField<T>; data: IFormData }) => any;
    isFilter?: boolean;

    validateOnMount?: boolean;

    validateOnBlur?: boolean;
    validationRules?: IValidatorRule[];

    data?: IFormData;

    responsive?: boolean;

    onValidate?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    onNoValidate?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    keyboardEventHandlerProps?: IKeyboardEventHandlerProps;

    formName?: string;

    onChange?: (options: IFormFieldOnChangeOptions<onChangeEventType, ValueType>) => any;

    errorText?: string;

    error?: boolean;

    isLoading?: boolean;
    isFormLoading?: boolean;

    isFormSubmitting?: boolean;
    renderLoading?: (
        options: IFormFieldProps<T> & {
            width: string | number; //la largeur occupée par le champ en cas de responsive design
        }
    ) => ReactNode;

    ref?: any;

    onMount?: (context: IFormField<T>) => any;

    onUnmount?: (context: IFormField<T>) => any;

    displayErrors?: boolean;

    defaultValue?: any;

    validateEmail?: boolean;

    windowWidth?: number;
}
/**
 * Represents the options for handling keyboard events in a form.
 * The `IFormKeyboardEventHandlerOptions` interface extends the `IFormContext`
 * to provide additional context and data related to keyboard events.
 * 
 * @interface IFormKeyboardEventHandlerOptions
 * @extends IFormContext
 * 
 * @property {IKeyboardEventHandlerKey} key - The key event that triggered the handler.
 * @property {IKeyboardEventHandlerEvent} event - The keyboard event data.
 * @property {IFormData} [formData] - Optional form data associated with the event.
 * @property {boolean} [isFormField] - Indicates if the event is related to a form field.
 * @property {any} [value] - The current value of the field associated with the event.
 * 
 * @remarks
 * This interface is useful for providing context when handling keyboard events
 * within form components, allowing developers to access relevant data and
 * determine the appropriate actions based on user input.
 * 
 * @example
 * // Example of using IFormKeyboardEventHandlerOptions in a keyboard event handler
 * const handleKeyboardEvent = (options: IFormKeyboardEventHandlerOptions) => {
 *     const { key, event, formData, isFormField, value } = options;
 *     console.log("Key pressed:", key);
 *     if (isFormField) {
 *         console.log("Field value:", value);
 *     }
 * };
 */
export interface IFormKeyboardEventHandlerOptions extends IFormContext {
    key: IKeyboardEventHandlerKey;
    event: IKeyboardEventHandlerEvent;
    formData?: IFormData;
    isFormField?: boolean;
    value?: any;
};

/**
 * Represents the state of a form field component.
 * The `IFormFieldState` type extends the base `IField` interface and includes additional properties
 * that manage the validation status, editability, and rendering of the field.
 * 
 * @type IFormFieldState
 * @template T - The type of the field, defaults to "text".
 * 
 * @property {boolean} error - Indicates if the field has an error.
 * @property {boolean} isFieldEditable - Indicates if the field is currently editable.
 * @property {boolean} isFieldDisabled - Indicates if the field is currently disabled.
 * @property {any} [validatedValue] - The value that has been validated.
 * @property {boolean} [hasPerformedValidation] - Indicates if validation has been performed on the field.
 * @property {any} value - The current value of the field.
 * @property {any} [prevValue] - The value previously assigned to the field.
 * @property {string} errorText - The error message associated with the field.
 * @property {boolean} [formTriedTobeSubmitted] - Indicates if the form has been submitted.
 * @property {IStyle} wrapperStyle - The style applied to the field's wrapper.
 * 
 * @remarks
 * This type is useful for managing the internal state of a form field component,
 * allowing for dynamic updates based on user interactions, validation status, and
 * the rendering of various UI elements.
 * 
 * @example
 * // Example of using IFormFieldState in a form field component
 * const fieldState: IFormFieldState = {
 *     error: false,
 *     isFieldEditable: true,
 *     isFieldDisabled: false,
 *     validatedValue: "Valid Value",
 *     hasPerformedValidation: true,
 *     value: "Current Value",
 *     prevValue: "Previous Value",
 *     errorText: "",
 *     formTriedTobeSubmitted: false,
 * };
 */
export type IFormFieldState = Partial<IField<any>> & {
    error: boolean;
    isFieldEditable: boolean;
    isFieldDisabled: boolean;
    validatedValue?: any;
    hasPerformedValidation?: boolean;
    value: any;
    prevValue?: any;
    errorText: string;
    formTriedTobeSubmitted?: boolean;
    wrapperStyle: IStyle;
}
/**
 * Represents a protected resource that can be associated with a button in the user interface.
 * The `IFormAction` interface extends the `IButtonProps` interface, allowing for the definition
 * of actions that can be performed within a form context.
 * 
 * @interface IFormAction
 * @extends IButtonProps<IFormContext>
 * 
 * @remarks
 * This interface is particularly useful in applications where user roles and permissions dictate
 * the visibility of UI elements. By extending `IButtonProps`, it inherits properties related to
 * button behavior and appearance, while also providing access to the form context.
 * 
 * @example
 * // Example of using IFormAction to define a submit action for a form
 * const submitAction: IFormAction = {
 *     label: "Submit",
 *     onClick: (context) => {
 *         const { form } = context;
 *         if (form) {
 *             form.submit(); // Calls the submit method on the form instance
 *         }
 *     },
 *     disabled: false,
 *     tooltip: "Submit the form",
 * };
 */
export interface IFormAction extends IButtonProps<IFormContext> { }