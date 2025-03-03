import { getTextContent, isReactClassComponent, ObservableComponent } from "@utils/index";
import { defaultStr, extendObj, IFieldType, IField, isEmpty, isNonNullString, isObj, IValidatorRule, stringify, Validator, Logger } from "@resk/core";
import { IForm, IFormData, IFormEvent, IFormField, IFormFieldOnChangeOptions, IFormFieldState, IFormFieldValidatorOptions } from "./types";
import React, { ReactNode } from "react";
import { Dimensions, View as RNView, TextInput as RNTextInput, NativeSyntheticEvent, TextInputFocusEventData, StyleSheet } from "react-native";
import areEquals from "@utils/areEquals";
import { FormsManager } from "./FormsManager";
import { IDimensions } from "@dimensions/types";
import Breakpoints from "@breakpoints/index";
import Label from "@components/Label";
import { ITextInputProps } from "@components/TextInput/types";
import Theme from "@theme/index";
import KeyboardEventHandler, { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { HelperText } from "@components/HelperText";
import { dimentionAddListener } from "@dimensions/index";
import TextInput from "@components/TextInput";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IStyle } from "@src/types";
import "./types/augmented";
import stableHash from 'stable-hash';
/**
 * Represents a form field component that can be used within a form.
 * The `Field` class extends `ObservableComponent` and implements the `IFormField` interface,
 * providing functionality for validation, state management, and rendering.
 *
 * @class Field
 * @extends ObservableComponent<IField<Type>>, IFormFieldState, IFormEvent>
 * 
 * @remarks
 * This class is designed to be flexible and reusable, allowing developers to create various types of fields
 * (e.g., text inputs, checkboxes) that can be integrated into forms. It handles validation, state management,
 * and rendering logic, making it easier to build complex forms with dynamic behavior.
 * @see {@link IFormField<Type>} for the `IFormField<Type>` interface.
 * @see {@link IField<Type>} for the `IField<Type>` interface.
 * @see {@link IFormFieldState} for the `IFormFieldState` interface.
 * @see {@link IFormEvent} for the `IFormEvent` type.
 * @see {@link IFormFieldValidatorOptions<Type>} for the `IFormFieldValidatorOptions<Type>` interface.
 */
export class Field<Type extends IFieldType = any> extends ObservableComponent<IField<Type>, IFormFieldState, IFormEvent> implements IFormField<Type> {
    /** 
     * The current state of the field.
     * 
     * @readonly
     * @type {IFormFieldState}
     */
    readonly state = {} as IFormFieldState;

    //readonly props: IField<Type> = {} as IField<Type>;

    /**
    * The component properties for the field.
    * 
    * @private
    * @type {IField}
    */
    private _componentProps: IField<Type> = {} as IField<Type>;

    /** 
     * Symbol used to indicate if the field is editable.
     * 
     * @readonly
     * @type {symbol}
     */
    readonly isEditableSymbol = Symbol("isEditableSymbol");

    /** 
     * Symbol used to indicate if the field is visible.
     * 
     * @readonly
     * @type {symbol}
     */
    readonly isVisibleSymbol = Symbol("isVisibleSymbol");

    /** 
    * Symbol used to indicate if the field is editable by another component.
    * 
    * @readonly
    * @type {symbol}
    */
    readonly isEditableBySymbol = Symbol("isEditableBySymbol");
    /** 
     * Reference to the wrapper view of the field.
     * 
     * @readonly
     * @type {React.Ref<RNView>}
     */
    readonly wrapperRef = React.createRef<RNView>();
    /** 
     * Reference to the field component.
     * 
     * @private
     * @type {any}
     */
    _fieldRef: any;
    /** 
     * Subscription for media query updates to handle responsive styles.
     * 
     * @readonly
     * @type {IDimensions}
     */
    readonly breakpointStyleSubscription = dimentionAddListener(this.doUpdateBreakpointStyle.bind(this));

    /**
     * Creates an instance of the Field component.
     * 
     * @param {IField} props - The properties for the field component.
     * 
     * @example
     * const myField = new Field({ name: "username", type: "text", label: "Username" });
     */
    constructor(props: IField) {
        super(props);
        const value = this.sanitizeValue(props.defaultValue);
        this.state = {
            error: false,
            hasPerformedValidation: false,
            wrapperStyle: this.getBreakpointStyle(),
            isFieldEditable: false,
            value,
            prevValue: value,
            isFieldDisabled: false,
        } as IFormFieldState;
        this.validate({ value: this.state.value, context: this });
    }
    componentDidUpdate(prevProps: IField<Type>): void {
        const wrapperStyle = this.getBreakpointStyle(this.props);
        if (stableHash(wrapperStyle) == stableHash(this.state.wrapperStyle)) return;
        this.setState({ wrapperStyle: this.getBreakpointStyle(this.props) }, () => {
            if ("defaultValue" in this.props) {
                this.validate({ value: this.props.defaultValue } as IFormFieldValidatorOptions<Type>, true);
            } else {
                this.validate({ value: this.state.value, context: this }, true);
            }
        });
    }
    /**
     * Compares two values for equality.
     * 
     * @param {any} a - The first value to compare.
     * @param {any} b - The second value to compare.
     * @returns {boolean} - Returns true if the values are equal, otherwise false.
     * 
     * @example
     * const areEqual = compareValues(5, 5); // true
     */
    compareValues(a: any, b: any): boolean {
        return compareValues(a, b);
    }
    /**
     * Gets the component properties for the field.
     * 
     * @ returns {IField} - The properties for the field component.
     * 
     * @example
     * const props = this.componentProps; // Accessing the component properties
     */
    get componentProps(): IField<Type> {
        if (!Object.getSize(this._componentProps, true)) {
            this._componentProps = this.getComponentProps(this.props as IField<Type>);
        }
        return this._componentProps;
    }
    /**
     * Checks if validation has been performed on the field.
     * 
     * @returns {boolean} - Returns true if validation has been performed, otherwise false.
     * 
     * @example
     * const hasValidated = this.hasPerformedValidation(); // true or false
     */
    hasPerformedValidation(): boolean {
        return !!this.state.hasPerformedValidation;
    }
    /**
     * Determines if the field can display an error message.
     * 
     * @returns {boolean} - Returns true if the field can display an error, otherwise false.
     * 
     * @example
     * const canShowError = this.canDisplayError(); // true or false
     */
    canDisplayError(): boolean {
        return (
            !this.isFilter() &&
            this.state.error &&
            this.hasPerformedValidation() &&
            (this.state.formTriedTobeSubmitted || !!this.getForm()?.hasTriedTobeSubmitted())
        );
    }
    /**
     * Sets the form's submission status for validation.
     * 
     * @param {boolean} [formTriedTobeSubmitted] - Indicates if the form has been submitted.
     * 
     * @example
     * this.setFormTriedTobeSubmitted(true); // Sets the submission status
     */
    setFormTriedTobeSubmitted(formTriedTobeSubmitted?: boolean) {
        formTriedTobeSubmitted = formTriedTobeSubmitted || this.getForm()?.hasTriedTobeSubmitted();
        if (!formTriedTobeSubmitted) return;
        this.setState({ formTriedTobeSubmitted: true } as IFormFieldState);
    }
    /**
     * Sets the value of the field and triggers validation.
     * 
     * @param {any} value - The new value for the field.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.setValue("new value"); // Sets the field value
     */
    setValue(value: any) {
        return this.validate({ value } as IFormFieldValidatorOptions<Type>);
    }
    /**
     * Retrieves a field by its name from the form.
     * 
     * @param {string} fieldName - The name of the field to retrieve.
     * @returns {IFormField<Type> | null} - The field if found, otherwise null.
     * 
     * @example
     * const field = this.getField("username"); // Retrieves the username field
     */
    getField<T extends IFieldType = any>(fieldName: string): IFormField<T> | null {
        return FormsManager.getField<T>(this.getFormName(), fieldName);
    }
    /**
     * Validates the field based on the provided options.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @param {boolean} [force=false] - Whether to force validation.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.validate({ value: "test" }); // Validates the field with the value "test"
     */
    validate(options: IFormFieldValidatorOptions<Type>, force: boolean = false): Promise<IFormFieldValidatorOptions<Type>> {
        options = Object.assign({}, options);
        options.fieldName = defaultStr(options.fieldName, this.getName());
        options.context = this;
        options.value = this.sanitizeValue(options.value);
        options.prevValue = "prevValue" in options ? options.prevValue : this.state.prevValue;
        const areValueEquals = this.compareValues(options.value, this.state.validatedValue);
        if (this.hasPerformedValidation() && force !== true && areValueEquals) {
            return Promise.resolve(options);
        }
        const { value } = options;
        if (!this.canValidate()) {
            return Promise.resolve(options).then((options) => {
                this.setState(
                    {
                        error: false,
                        validatedValue: value,
                        hasPerformedValidation: true,
                        prevValue: this.state.value,
                        value,
                        errorText: "",
                    },
                    () => {
                        if (!areValueEquals) {
                            this.callOnChange(options as IFormFieldOnChangeOptions<Type>);
                        }
                    }
                );
                return options;
            });
        }
        options.rules = Array.isArray(options.rules) && options.rules.length ? options.rules : this.getValidationRules();
        if (this.getType() == "email" && this.componentProps.validateEmail !== false && isNonNullString(options.value) && !options.rules.includes("email")) {
            options.rules.push("email");
        }
        if (this.getType() == "tel" && this.componentProps.validatePhoneNumber !== false && isNonNullString(options.value) && options.value.length > 4 && !options.rules.includes("phoneNumber")) {
            options.rules.push("phoneNumber");
        }
        if (this.getType() == "url" && options.value && !options.rules.includes("url")) {
            options.rules.push("url");
        }
        const hasPerformedValidation = true;
        return Promise.resolve(this.beforeValidate(options)).then(() => {
            return new Promise((resolve, reject) => {
                return Validator.validate(options).then(() => {
                    return Promise.resolve(this.onValidate(options)).then(() => {
                        this.setState(
                            {
                                error: false,
                                hasPerformedValidation,
                                validatedValue: value,
                                value,
                                prevValue: this.state.value,
                                errorText: "",
                            },
                            () => {
                                this.getForm()?.toggleValidationStatus();
                                this.callOnChange(options as IFormFieldOnChangeOptions<Type>);
                            }
                        );
                        resolve(options);
                        return options;
                    });
                }).catch((error) => {
                    this.setState(
                        {
                            error: true,
                            hasPerformedValidation,
                            validatedValue: value,
                            value,
                            errorText: error?.message || stringify(error),
                        },
                        () => {
                            this.getForm()?.toggleValidationStatus(false);
                        }
                    );
                    reject(error);
                });
            })
        });
    }
    /**
     * Determines if validation should occur on blur.
     * 
     * @returns {boolean} - Returns true if validation should occur on blur, otherwise false.
     * 
     * @example
     * const shouldValidateOnBlur = this.canValidateOnBlur(); // true or false
     */
    canValidateOnBlur(): boolean {
        return this.componentProps.validateOnBlur !== false && this.props.validateOnBlur !== false;
    }
    /**
     * Checks if validation should occur on mount.
     * 
     * @returns {boolean} - Returns true if validation should occur on mount, otherwise false.
     * 
     * @example
     * const canValidateOnMount = this.canValidateOnMount(); // true or false
     */
    canValidateOnMount() {
        return !!this.componentProps.validateOnMount;
    }
    /**
     * Retrieves the validation rules for the field.
     * 
     * @returns {IValidatorRule[]} - An array of validation rules.
     * 
     * @example
     * const rules = this.getValidationRules(); // Retrieves the validation rules
     */
    getValidationRules(): IValidatorRule[] {
        const rules: IValidatorRule[] = Array.isArray(this.componentProps.validationRules) ? this.componentProps.validationRules : [];
        if (this.componentProps?.required) {
            rules.unshift("required");
        }
        ["minLength", "length", "maxLength"].map((r: string) => {
            const k: keyof IField<Type> = r as keyof IField<Type>;
            const rValue = typeof this.componentProps[k] === "number" ? this.componentProps[k] : undefined;
            if (rValue !== undefined) {
                rules.push(`${r}[${rValue}]` as IValidatorRule);
            }
        });
        return rules;
    }
    /**
     * Retrieves the type of the field.
     * 
     * @returns {string} - The type of the field.
     * 
     * @example
     * const fieldType = this.getType(); // Retrieves the field type
     */
    getType(): string {
        return defaultStr(
            (this.isFilter() && this.componentProps?.filter?.type) || undefined,
            this.componentProps.type,
            this.props.type,
            "text"
        );
    }

    /**
     * Sanitizes the value for the field to ensure it is in the correct format.
     * 
     * @param {any} value - The value to sanitize.
     * @returns {any} - The sanitized value.
     * 
     * @example
     * const sanitizedValue = this.sanitizeValue("123.45"); // Sanitizes the value
     */
    sanitizeValue(value: any): any {
        const type = String(this.getType()).toLowerCase();
        if (this.canValueBeDecimal() || ["number"].includes(type)) {
            if (["number"].includes(typeof value)) {
                return value;
            }
            const v = parseFloat(value === undefined ? "0" : value);
            return !isNaN(v) ? v : 0;
        }
        switch (type) {
            case "phone":
                return String(value).replace(/[^\d]/g, "");
            default:
                break;
        }
        return value;
    }
    /**
     * Executes any logic before validation occurs.
     * 
     ```typescript
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {IFormFieldValidatorOptions<Type>} - The options after any pre-validation logic.
     * 
     * @example
     * const preValidatedOptions = this.beforeValidate(options); // Executes pre-validation logic
     */
    beforeValidate(options: IFormFieldValidatorOptions<Type>) {
        return options;
    }
    /**
    * Calls the onChange handler for the field.
    * 
    * @param {IFormFieldOnChangeOptions<Type>} options - The validation options.
    * 
    * @example
    * this.callOnChange(options); // Calls the onChange handler
    */
    callOnChange(options: IFormFieldOnChangeOptions<Type>) {
        if (this.compareValues(this.state.value, this.state.prevValue)) {
            return;
        }
        options.prevValue = this.state.prevValue;
        options.value = this.state.value;
        options.context = this;
        options.fieldName = this.getName();
        if (this.componentProps.onChange) {
            this.componentProps.onChange(options);
        }
    }
    /**
     * This function is called when the field is validated.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {boolean} - Returns true if validation is successful, otherwise throws an error.
     * 
     * @example
     * this.onValidate(options); // Validates the field
     * 
     */
    onValidate(options: IFormFieldValidatorOptions<Type>) {
        options.context = this;
        const cb = () => {
            if (!this.isFilter()) {
                const form = this.getForm();
                if (form && form?.props?.onValidateField) {
                    form.props.onValidateField(options);
                }
            }
        };
        if (typeof this.componentProps.onValidate == "function") {
            const r = this.componentProps.onValidate(options);
            if (typeof r == "string") {
                throw {
                    ...Object.assign({}, options),
                    message: r,
                };
            }
            if (r === false) {
                throw {
                    ...Object.assign({}, options),
                    message:
                        options?.message ||
                        "Validation échouée; la raison n'a pas été spécifiée dans le message d'erreur associé au champ [" +
                        this.getLabel() +
                        "]:\n la fonction de validation a rétourné faux pour la valeur [" +
                        stringify(options?.value) +
                        "]",
                };
            }
            cb();
            return r;
        } else if (this.componentProps.onValidate) {
            Logger.error(
                this.componentProps.onValidate,
                " is not valid onValidate props (fonction) for form field  component ",
                this.getName(),
                " formName = ",
                this.getFormName()
            );
        }
        cb();
        return true;
    }
    /**
     * Handles the case where validation does not occur.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {boolean} - Returns false if no validation occurred.
     * 
     * @example
     * this.onNoValidate(options); // Handles no validation case
     * this function is called when the field is not validated
     */
    onNoValidate(options: IFormFieldValidatorOptions<Type>) {
        options.context = this;
        if (!this.isFilter()) {
            const form = this.getForm();
            if (form && form?.props?.onNoValidateField) {
                form.props.onNoValidateField(options);
            }
        }
        if (this.componentProps.onNoValidate) {
            return this.componentProps.onNoValidate(options);
        }
        return false;
    }
    /**
     * Retrieves the label to display for the field.
     * 
     * @returns {string} - The label for the field.
     * 
     * @example
     * const label = this.getLabel(); // Retrieves the field label
     */
    getLabel(): string {
        return getTextContent(this.componentProps.label || this.props.label || this.getName());
    }
    /**
     * Called when a field is registered by its form.
     * 
     * @example
     * this.onRegister(); // Registers the field
     */
    onRegister(): void { }
    /**
     * Called when a field is unregistered from its form.
     * 
     * @example
     * this.onUnregister(); // Unregisters the field
     */
    onUnregister(): void { }
    /**
     * Checks if the form field is valid.
     * 
     * @returns {boolean} - Returns true if the field is valid, otherwise false.
     * 
     * @example
     * const isValid = this.isValid(); // Checks if the field is valid
     */
    isValid(): boolean {
        return (this.hasPerformedValidation() && !this.state.error) || false;
    }
    /**
     * Retrieves the name of the field.
     * 
     * @returns {string} - The name of the field.
     * 
     * @example
     * const fieldName = this.getName(); // Retrieves the field name
     */
    getName(): string {
        return this.props.name as string;
    }
    /**
     * Retrieves the valid value of the field based on the form data.
     * 
     * @param {IFormData} formData - The form data to use for validation.
     * @returns {any} - The valid value of the field.
     * 
     * @example
     * const validValue = this.getValidValue(formData); // Retrieves the valid value
     */
    getValidValue(formData: IFormData): any {
        if (this.componentProps.getValidValue) {
            return this.componentProps.getValidValue({
                data: formData,
                value: this.state.value,
                context: this,
            });
        }
        return this.state.value;
    }
    /**
     * Retrieves the current value of the field.
     * 
     * @returns {any} - The current value of the field.
     * 
     * @example
     * const value = this.getValue(); // Retrieves the current value
     */
    getValue(): any {
        return this.state.value;
    }
    /**
     * Checks if the field is a raw input type.
     * 
     * @returns {boolean} - Returns true if the field is raw, otherwise false.
     * 
     * @example
     * const isRawField = this.isRaw(); // Checks if the field is raw
     */
    isRaw(): boolean {
        return false;
    }
    /**
     * Retrieves the error message associated with the field.
     * 
     * @returns {string} - The error message for the field.
     * 
     * @example
     * const errorMessage = this.getErrorText(); // Retrieves the error message
     */
    getErrorText(): string {
        return defaultStr(this.state.errorText);
    }
    /**
     * Retrieves the specific properties for the field.
     * 
     * @param {IField<Type>} [props] - Optional properties to use for rendering.
     * @returns {IField<Type>} - The properties to use for rendering the field.
     * 
     * @example
     * const fieldProps = this.getComponentProps(); // Retrieves the component properties
     */
    getComponentProps(props?: IField<Type>): IField<Type> {
        this._componentProps = { ...Object.assign({}, props || this.props), name: this.getName() } as unknown as IField<Type>;
        if (this.isFilter() && isObj(this.componentProps.filter)) {
            extendObj(this.componentProps, this.componentProps.filter);
        }
        return this.componentProps;
    }
    /**
     * Checks if the field is a filter.
     * 
     * @returns {boolean} - Returns true if the field is a filter, otherwise false.
     * 
     * @example
     * const isFilterField = this.isFilter(); // Checks if the field is a filter
     */
    isFilter(): boolean {
        return !!this.componentProps?.isFilter || !!this.props?.isFilter;
    }
    /**
     * Checks if the field is editable.
     * 
     * @returns {boolean} - Returns true if the field is editable, otherwise false.
     * 
     * @example
     * const isEditable = this.isEditable(); // Checks if the field is editable
     */
    isEditable(): boolean {
        return this.state.isFieldEditable;
    }
    /**
     * Checks if the field is disabled.
     * 
     * @returns {boolean} - Returns true if the field is disabled, otherwise false.
     * 
     * @example
     * const isDisabled = this.isDisabled(); // Checks if the field is disabled
     */
    isDisabled(): boolean {
        return this.state.isFieldDisabled;
    }
    /**
    * Disables the field.
    * 
    * @example
    * this.disable(); // Disables the field
    */
    disable() {
        this.setState({ isFieldDisabled: true } as IFormFieldState);
    }
    /**
     * Enables the field.
     * 
     * @example
     * this.enable(); // Enables the field
     */
    enable() {
        this.setState({ isFieldDisabled: false } as IFormFieldState);
    }
    /**
     * Checks if the field is a text field.
     * 
     * @returns {boolean} - Returns true if the field is a text field, otherwise false.
     * 
     * @example
     * const is textField = this.isTextField(); // Checks if the field is a text field
     */
    isTextField(): boolean {
        return !this.isRaw();
    }
    /**
     * Validates the field on change.
     * 
     * @param {IFormFieldValidatorOptions<Type>} options - The validation options.
     * @returns {Promise<IFormFieldValidatorOptions<Type>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.validateOnChange({ value: "new value" }); // Validates the field on change
     */
    validateOnChange(options: IFormFieldValidatorOptions<Type>) {
        return this.validate(options);
    }
    /**
     * Renders the field component.
     * 
     * @param {IField<Type>} props - The properties for the field component.
     * @param {any} innerRef - A reference to the inner component.
     * @returns {ReactNode} - The rendered field component.
     * 
     * @example
     * const renderedField = this._render(props, innerRef); // Renders the field component
     * @see {@link IField<Type>} for the `IField<Type>` type.
     * @see {@link ITextInputProps} for the `ITextInputProps` type.
     * @see {@link React.LegacyRef} for the `React.LegacyRef` type.
     */
    _render(props: IField<Type>, innerRef?: any): ReactNode {
        return (<TextInput ref={innerRef as React.LegacyRef<RNTextInput>} {...(props as ITextInputProps)} />);
    }
    /**
    * Checks if the field can accept decimal values.
    * 
    * @returns {boolean} - Returns true if the field can accept decimal values, otherwise false.
    * 
    * @example
    * const canBeDecimal = this.canValueBeDecimal(); // Checks if the field can accept decimal values
    */
    canValueBeDecimal(): boolean {
        return this.isTextField() && ["number"].includes(String(this.getType()).toLowerCase());
    }
    /**
     * Sets a reference to the field component.
     * 
     * @param {any} el - The element to set as a reference.
     * 
     * @example
     * this.setRef(element); // Sets the reference to the field component
     */
    setRef(el: any) {
        if (el) this._fieldRef = el;
    }
    /**
     * Retrieves the keyboard events for the field.
     * 
     * @param {IKeyboardEventHandlerProps} keyboardEventHandlerProps - The keyboard event handler properties.
     * @returns {IKeyboardEventHandlerKey[]} - An array of keyboard event keys.
     * 
     * @example
     * const keyboardEvents = this.getKeyboardEvents(props); // Retrieves the keyboard events
     */
    getKeyboardEvents(keyboardEventHandlerProps: IKeyboardEventHandlerProps): IKeyboardEventHandlerKey[] {
        const sanitizeKeyEvent = "ctrl+m";
        const events = [sanitizeKeyEvent, "enter", "up", "down", "left", "right"];
        if (Array.isArray(keyboardEventHandlerProps?.handleKeys)) {
            keyboardEventHandlerProps?.handleKeys.map((key) => {
                if (!events.includes(key)) {
                    events.push(key);
                }
            });
        }
        return events;
    }
    /**
    * Retrieves the form associated with the field.
    * 
    * @returns {IForm | null} - The form if found, otherwise null.
    * 
    * @example
    * const form = this.getForm(); // Retrieves the associated form
    */
    getForm(): IForm | null {
        return FormsManager.getForm(this.getFormName()) || null;
    }
    /**
     * Checks if the field can be validated.
     * 
     * @returns {boolean} - Returns true if the field can be validated, otherwise false.
     * 
     * @example
     * const canValidate = this.canValidate(); // Checks if the field can be validated
     */
    canValidate(): boolean {
        return !this.isFilter();
    }
    /**
     * Focuses the field.
     * 
     * @example
     * this.focus(); // Focuses the field
     */
    focus() {
        return;
    }
    /**
     * Focuses the next field in the form.
     * 
     * @example
     * this.focusNextField(); // Focuses the next field
     */
    focusNextField() { }
    /**
     * Retrieves the name of the form associated with the field.
     * 
     * @returns {string} - The name of the form.
     * 
     * @example
     * const formName = this.getFormName(); // Retrieves the form name
     */
    getFormName(): string {
        return this.componentProps.formName || this.props.formName || "";
    }

    /**
     * Focuses the previous field in the form.

     * @example
     * this.focusPrevField(); // Focuses the previous field
     */
    focusPrevField() { }

    /**
     * Handles keyboard events for the field.
     * 
     * @param {IKeyboardEventHandlerKey} key - The key event.
     * @param {IKeyboardEventHandlerEvent} event - The keyboard event data.
     * 
     * @example
     * this.onKeyEvent("enter", event); // Handles the enter key event
     */
    onKeyEvent(key: IKeyboardEventHandlerKey, event: IKeyboardEventHandlerEvent) {
        const form = this.getForm();
        if (!this.canValidate()) return;
        const data = form?.getData() || ({} as IFormData);
        const arg = {
            key,
            event,
            form,
            formName: this.getFormName(),
            value: this.getValue(),
            validValue: this.getValidValue(data),
            formData: data,
            context: this,
            isFormField: true,
        };
        if (form) {
            arg.form = form;
            form.handleKeyboardEvent(arg);
        }
        switch (key) {
            case "down":
                this.focusNextField();
                break;
            case "left":
                this.focusPrevField();
                break;
            case "right":
                this.focusNextField();
                break;
            case "up":
                this.focusPrevField();
                break;
            case "enter":
                break;
            default:
                break;
        }
    }
    /**
     * Checks if the field can handle responsive styles.
     * 
     * @param {IField<Type>} [props] - Optional properties to check.
     * @returns {boolean} - Returns true if the field can handle responsive styles, otherwise false.
     * 
     * @example
     * const canHandleResponsive = this.canHandleBreakpointStyle(); // Checks for responsive styles
     */
    canHandleBreakpointStyle(props?: IField<Type>): boolean {
        const responsive = (props || this.props).responsive;
        return !!responsive || (!this.isFilter() && responsive !== false);
    }
    /**
     * Updates the breakpoint style based on dimensions.
     * 
     * @param {IDimensions} args - The dimensions to update the style.
     * 
     * @example
     * this.doUpdateBreakpointStyle(args); // Updates the breakpoint style
     */
    doUpdateBreakpointStyle(args: IDimensions) {
        if (!this.canHandleBreakpointStyle()) return;
        const wrapperStyle = this.getBreakpointStyle();
        this.setState({ wrapperStyle });
    }
    /**
     * Retrieves the breakpoint style for the field.
     * 
     * @param {IField<Type>} [props] - Optional properties to use for style calculation.
     * @returns {IStyle} - The calculated style for the field.
     * 
     * @example
     * const style = this.getBreakpointStyle(); // Retrieves the breakpoint style
     */
    getBreakpointStyle(props?: IField<Type>): IStyle {
        if (!this.canHandleBreakpointStyle(props)) return null;
        const windowWidth = (props || this.props).windowWidth;
        const b = Breakpoints.col(undefined, windowWidth);
        return StyleSheet.flatten([b]);
    }
    /**
     * Triggers the mount lifecycle for the field.
     * 
     * @example
     * this.triggerMount(); // Triggers the mount lifecycle
     */
    triggerMount() {
        this.onRegister();
    }
    /**
     * Triggers the unmount lifecycle for the field.
     * 
     * @example
     * this.triggerUnmount(); // Triggers the unmount lifecycle
     */
    triggerUnmount() {
        this.onUnregister();
    }
    /**
     * Lifecycle method called when the component mounts.
     * 
     * @example
     * componentDidMount() {
     *     super.componentDidMount();
     *     this.triggerMount();
     * }
     */
    componentDidMount(): void {
        super.componentDidMount();
        this.triggerMount();
        if (this.componentProps.onMount) {
            this.componentProps.onMount(this);
        }
    }
    componentWillUnmount(): void {
        super.componentWillUnmount();
        this.triggerUnmount();
        this.breakpointStyleSubscription?.remove();
        if (this.componentProps.onUnmount) {
            this.componentProps.onUnmount(this);
        }
    }
    /**
     * Checks if the form is currently loading.
     * 
     * @returns {boolean} - Returns true if the form is loading, otherwise false.

     * @example
     * const isLoading = this.isFormLoading(); // Checks if the form is loading
     */
    isFormLoading(): boolean {
        return !!this.componentProps.isFormLoading;
    }
    /**
     * Checks if the form is currently submitting.
     * 
     * @returns {boolean} - Returns true if the form is submitting, otherwise false.
     * 
     * @example
     * const isSubmitting = this.isFormSubmitting(); // Checks if the form is submitting
     */
    isFormSubmitting(): boolean {
        return !!this.componentProps.isFormSubmitting;
    }
    /**
     * Renders a loading state for the field.
     * 
     * @param {IField<Type>} props - The properties for the field component.
     * @returns {ReactNode} - The rendered loading state.
     * 
     * @example
     * const loadingState = this.renderLoading(props); // Renders the loading state
     */
    renderLoading(props: IField<Type>): ReactNode {
        let width: number | string = "100%";
        const wrapStyle = isObj(this.state.wrapperStyle) && this.state.wrapperStyle && "width" in this.state.wrapperStyle
            ? this.state.wrapperStyle
            : { width: "100%" };
        if (wrapStyle) {
            const w = parseFloat(String(wrapStyle.width)?.replace("%", ""));
            if (!isNaN(w) && w) {
                width = (Dimensions.get("window").width * w) / 100;
            }
        }
        const ret = this.componentProps.renderLoading
            ? this.componentProps.renderLoading({
                ...props,
                width,
            })
            : null;
        return React.isValidElement(ret) ? (
            ret
        ) : (
            <>
                <Label children={this.componentProps.label} style={[styles.labelLoading]} />
                {/* <ContentLoader height={59} speed={3}>
          <Rect x="15" y="15" rx="4" ry="4" width={width} height="59" />
        </ContentLoader> */}
            </>
        );
    }
    /**
     * Renders the field component.
     * 
     * @returns {ReactNode} - The rendered field component.
     * 
     * @example
     * const renderedField = this.render(); // Renders the field component
     */
    render() {
        this._componentProps = {} as IField<Type>;
        let {
            data,
            keyboardEventHandlerProps,
            formName,
            form,
            responsive,
            isFilter: cIsFilter,
            visible,
            ...rest
        } = this.getComponentProps(this.props as IField<Type>);
        const isFilter = this.isFilter() || cIsFilter;
        if (isFilter) {
            if (rest.rendable === false) return null;
        }
        const wrapperProps = Object.assign({}, keyboardEventHandlerProps);
        const visibleStyle = !this.isFilter() && visible === false && styles.hidden;
        const disabled = rest.disabled || this.isDisabled();
        const readOnly = rest.readOnly || this.isFormSubmitting();
        const errorText = this.getErrorText();
        const onBlur = (rest as ITextInputProps).onBlur;
        const isLoading = this.isFormLoading();
        const readOnlyStyle = readOnly ? Theme.styles.readOnly : null;
        const disabledStyle = disabled ? Theme.styles.disabled : null;
        const canValidate = this.canValidate() && rest.displayErrors !== false;
        const canShowErrors = this.canDisplayError();
        return (
            <KeyboardEventHandler
                testID={"resk-form-field-container-" + this.getName()}
                innerRef={this.wrapperRef}
                {...wrapperProps}
                handleKeys={this.isFilter() ? [] : this.getKeyboardEvents(wrapperProps)}
                onKeyEvent={this.onKeyEvent.bind(this)}
                disabled={disabled || readOnly}
                style={[
                    responsive !== false && this.state.wrapperStyle,
                    wrapperProps.style,
                    visibleStyle,
                    disabledStyle,
                    readOnlyStyle,
                ]}
            >
                {(kProps) => {
                    return (
                        <>
                            {isLoading
                                ? this.renderLoading({
                                    ...rest,
                                    data,
                                    responsive,
                                    visible: this.isFilter() ? true : visible,
                                    disabled,
                                    readOnly,
                                } as IField<Type>)
                                : null}
                            {!isLoading
                                ? this._render(
                                    {
                                        ...rest,
                                        isFilter: cIsFilter,
                                        onChange: (options) => {
                                            this.validateOnChange({
                                                ...options,
                                                value: options.value,
                                                context: this,
                                            });
                                        },
                                        onBlur:
                                            disabled || readOnly ? undefined
                                                : (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
                                                    if (onBlur) {
                                                        onBlur(event);
                                                    }
                                                    if (this.canValidateOnBlur()) {
                                                        this.validateOnChange({
                                                            value: this.getValue(),
                                                        } as IFormFieldValidatorOptions<Type>);
                                                    }
                                                },
                                        disabled,
                                        errorText,
                                        error: canShowErrors,
                                        handleMaskValidationErrors: canShowErrors,
                                        ...kProps,
                                        defaultValue: this.state.value,
                                    } as IField<Type>,
                                    this.setRef.bind(this)
                                )
                                : null}
                            {canValidate && !this.isFilter() ? (
                                <HelperText
                                    error={canShowErrors}
                                    style={[(isLoading || !canShowErrors) && styles.helperTextHidden]}
                                >
                                    {errorText || `the field ${this.getName()} has not error`}
                                </HelperText>
                            ) : null}
                        </>
                    );
                }}
            </KeyboardEventHandler>
        );
    }

    /**
     * A unique symbol used as a key for storing and retrieving metadata related to registered field components.
     * This symbol is used to maintain a registry of field components that can be dynamically associated with
     * specific field types within the form management system.
     * 
     * @private
     * @static
     * @readonly
     * @type {symbol}
     * 
     * @remarks
     * The `FIELDS_COMPONENTS_METADATA_KEY` is essential for the dynamic registration and retrieval of field
     * components. By using a symbol, we ensure that the key is unique and avoids potential naming conflicts
     * with other properties or metadata keys in the application.
     * 
     * This key is utilized in conjunction with the Reflect API to define and access metadata for field components,
     * allowing for a flexible and extensible form architecture.
     * 
     * @example
     * // Registering a field component
     * Field.registerComponent("text", MyTextField);
     * 
     * // Retrieving registered components
     * const registeredComponents = Field.getRegisteredComponents();
     * const textFieldComponent = Field.getRegisteredComponent("text");
     */
    private static readonly FIELDS_COMPONENTS_METADATA_KEY = Symbol("formFieldsComponent");
    /**
     * Registers a field component with a specified type.
     * This method allows developers to associate a field component with a specific field type,
     * enabling dynamic rendering of different field types within forms.
     * 
     * @static
     * @param {IFieldType} type - The type of the field to register the component for.
     * @param {typeof Field} component - The field component class to register.
     * 
     * @example
     * // Registering a text field component
     * Field.registerComponent("text", MyTextField);
     */
    static registerComponent(type: IFieldType, component: typeof Field) {
        if (!isNonNullString(type) || !isReactClassComponent(component)) return;
        const components = Field.getRegisteredComponents();
        components[type] = component;
        Reflect.defineMetadata(Field.FIELDS_COMPONENTS_METADATA_KEY, components, Field);
    }
    /**
     * Retrieves all registered field components.
     * This method returns an object containing all field components that have been registered
     * with their corresponding field types.
     * 
     * @static
     * @returns {Record<IFieldType, typeof Field>} - An object mapping field types to their registered components.
     * 
     * @example
     * const registeredComponents = Field.getRegisteredComponents();
     * console.log(registeredComponents); // Logs all registered field components
     */
    static getRegisteredComponents(): Record<IFieldType, typeof Field> {
        const components = Reflect.getMetadata(Field.FIELDS_COMPONENTS_METADATA_KEY, Field);
        return isObj(components) ? components : {};
    }
    /**
     * Retrieves a registered field component by its name.
     * This method allows developers to access a specific field component based on its type.
     * 
     * @static
     * @param {IFieldType} type - The name of the field type to retrieve the component for.
     * @returns {typeof Field | null} - The registered field component if found, otherwise null.
     * 
     * @example
     * const textFieldComponent = Field.getRegisteredComponent("text");
     * if (textFieldComponent) {
     *     // Use the retrieved text field component
     * }
     */
    static getRegisteredComponent(type: IFieldType): typeof Field | null {
        if (!isNonNullString(type)) return null;
        const components = Field.getRegisteredComponents();
        if (!components) return null;
        return components[type];
    }
}

/**
 * A decorator function that registers a field component with a specified field type.
 * This decorator can be applied to class properties or methods to associate them with
 * a specific field type, enabling dynamic rendering of different field types within forms.
 * 
 * @param {IFieldType} type - The type of the field to register the component for.
 * @returns {PropertyDecorator & MethodDecorator} - A decorator that registers the field component.
 * 
 * @example
 * // Using the FormField decorator to register a custom text field component
 * import {Form} from "@resk/native"
import stableHash from 'stable-hash';
 * @FormField("text")
 * class MyForm extends Form.Field {
 *     
 * }
 * 
 * // The above code registers the MyForm class's myTextField property as a text field component.
 * @see {@link IForm} for the `IForm` type.
 * @see {@link IField<Type>} for the `IField` type.
 * @see {@link IFormFieldState} for the `IFormFieldState` type.
 */
export function FormField<Type extends IFieldType = any>(type: Type) {
    return (target: typeof Field<Type>) => {
        Field.registerComponent(type, target as typeof Field);
    };
}

function compareValues(a: any, b: any) {
    if (isEmpty(a) && isEmpty(b)) return true;
    return areEquals(a, b);
}

const styles = StyleSheet.create({
    hidden: { display: "none", opacity: 0 },
    helperTextHidden: { opacity: 0 },
    labelLoading: {
        marginHorizontal: 15,
        marginBottom: -5,
    },
    loadingContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        padding: 10,
    },
});


FormsManager.isFieldInstance = (field: any) => {
    return field instanceof Field;
}