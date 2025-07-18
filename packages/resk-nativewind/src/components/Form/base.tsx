"use client";
import { cn, Component, getTextContent, useMergeRefs, useStateCallback } from "@utils/index";
import { IFieldType, IField, IFields, IFieldBase } from "@resk/core/resources";
import { IValidatorRule, IValidatorValidateOptions, Validator, } from "@resk/core/validator";
import { InputFormatter } from "@resk/core/inputFormatter";
import { defaultStr, extendObj, areEquals, isEmpty, isNonNullString, isObj, stringify } from "@resk/core/utils";
import { ReactNode, isValidElement, useId, useRef, useMemo, useCallback, useEffect, ReactElement, createContext, useContext, Fragment, Ref } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, View, ViewProps, GestureResponderEvent } from 'react-native';
import KeyboardEventHandler, { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { HelperText } from "@components/HelperText";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IClassName, IOnChangeOptions } from "@src/types";
import stableHash from 'stable-hash';
import { ITextInputProps, TextInput } from "@components/TextInput";
import { Text } from "@html/Text";
import { commonVariant } from "@variants/common";
import { typedEntries } from "@resk/core/build/utils/object";
import { Auth, IAuthPerm } from "@resk/core/auth";
import { IObservable, observableFactory } from "@resk/core/observable";
import { useImperativeHandle } from "react";
import { IButtonInteractiveContext, IButtonInteractiveProps } from "@components/Button/types";
import { Button } from "@components/Button";


export class FormField<FieldType extends IFieldType = IFieldType, ValueType = any, TState extends IFormFieldState<FieldType, ValueType> = IFormFieldState<FieldType, ValueType>> extends Component<IField<FieldType, ValueType>, TState> {
    /** 
     * Reference to the field component.
     * 
     * @private
     * @type {any}
     */
    _fieldRef: any;

    constructor(props: IField<FieldType, ValueType>) {
        super(props);
        const value = this.sanitizeValue(props.defaultValue);
        this.state = {
            error: false,
            hasValidated: false,
            isEditable: false,
            value,
            prevValue: value,
            isDisabled: false,
        } as Readonly<TState>;
        this.validate({ value: this.state.value }).catch((e) => { });
    }
    componentDidUpdate(prevProps: IField<FieldType, ValueType>): void {
        if (!this.compareValues(prevProps.defaultValue, this.props.defaultValue && "defaultValue" in this.props)) {
            this.validate({ value: this.props.defaultValue }, true).catch((e) => { });
        }
    }

    /**
     * Compares two values to determine if they are equal.
     *
     * This method is used to check if the current value and the previous value of the field are considered equal.
     * It uses a utility function to handle deep equality and empty value checks.
     *
     * @param {any} a - The first value to compare.
     * @param {any} b - The second value to compare.
     * @returns {boolean} - Returns true if the values are equal or both are empty, otherwise false.
     *
     * @example
     * // Compare two numbers
     * const isEqual = this.compareValues(5, 5); // true
     *
     * // Compare two strings
     * const isEqual = this.compareValues("abc", "abc"); // true
     *
     * // Compare empty values
     * const isEqual = this.compareValues(undefined, null); // true
     *
     * // Compare objects
     * const isEqual = this.compareValues({ a: 1 }, { a: 1 }); // true
     */
    compareValues(a: any, b: any): boolean {
        return compareValues(a, b);
    }


    /**
     * Indicates whether the field has been validated.
     *
     * This method returns a boolean value representing whether the field has undergone validation.
     * It is useful for determining if validation logic has already been executed for this field.
     *
     * @returns {boolean} - Returns true if the field has been validated, otherwise false.
     *
     * @example
     * if (this.hasValidated()) {
     *   // Show validation feedback or error messages
     * }
     */
    hasValidated(): boolean {
        return !!this.state.hasValidated;
    }
    /**
     * Determines whether the error message for the form field should be displayed.
     *
     * This method checks several conditions to decide if an error should be shown:
     * - The field is not a filter field (`isFilter()` returns false).
     * - The component's state contains an error (`this.state.error` is truthy).
     * - The field has been validated (`hasValidated()` returns true).
     * - The form has at least one invalid submission (`form?.getInvalidSubmitCount() > 0`).
     *
     * @returns {boolean} Returns `true` if all conditions are met and the error message should be displayed; otherwise, returns `false`.
     *
     * @example
     * ```tsx
     * // Example usage within a form component
     * if (this.canDisplayError()) {
     *   return <span className="error">{this.state.error}</span>;
     * }
     * ```
     *
     * @remarks
     * This method is typically used to control the rendering of error messages in form components,
     * ensuring that errors are only shown after validation and failed submissions.
     */
    canDisplayError(): boolean {
        const form = this.getForm();
        return (
            !this.isFilter() &&
            this.state.error &&
            this.hasValidated() &&
            (form?.getInvalidSubmitCount() || 0) > 0
        );
    }

    /**
     * Sets the value of the field and triggers validation.
     * 
     * @param {any} value - The new value for the field.
     * @returns {Promise<IFormFieldValidatorOptions<FieldType,ValueType>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.setFieldValue("new value"); // Sets the field value
     */
    setFieldValue(value: any) {
        return this.validate({ value } as IFormFieldValidatorOptions<FieldType, ValueType>);
    }

    /**
     * Retrieves the instance of a specific field within the current form.
     *
     * This method allows you to access the FormField instance for a given field name,
     * enabling direct interaction with its state, validation, and methods.
     *
     * @template FieldType - The type of the field (default: IFieldType).
     * @template ValueType - The value type of the field (default: any).
     * @param {string} fieldName - The name of the field to retrieve.
     * @returns {FormField<FieldType, ValueType> | null} - The FormField instance if found, otherwise null.
     *
     * @example
     * ```tsx
     * // Access the "email" field instance and focus it
     * const emailField = form.getFieldInstance<"email">("email");
     * emailField?.focus();
     *
     * // Check if a field is valid
     * const phoneField = form.getFieldInstance<"phone">("phone");
     * if (phoneField?.isValid()) {
     *   // Do something with the valid phone field
     * }
     * ```
     *
     * @remarks
     * This is useful for advanced form logic, such as programmatically focusing fields,
     * reading their values, or triggering validation outside of the normal flow.
     */
    getFieldInstance<FieldType extends IFieldType = IFieldType, ValueType = any>(fieldName: string): FormField<FieldType, ValueType> | null {
        return FormsManager.getFieldInstance<FieldType>(this.getFormName(), fieldName) as any;
    }
    /**
     * Determines if the current field is of type "email".
     *
     * This method checks the field type and returns true if it matches "email".
     * Useful for applying email-specific validation rules or rendering logic.
     *
     * @returns {boolean} Returns true if the field type is "email", otherwise false.
     *
     * @example
     * // Example usage in a form field
     * if (this.isEmail()) {
     *   // Apply email validation or show email-specific UI
     * }
     *
     * @remarks
     * This method is typically used internally to conditionally add email validation rules
     * or to customize the rendering of email fields.
     */
    isEmail() {
        return defaultStr(this.getType()).toLowerCase().trim() === "email";
    }
    /**
     * Determines if the current field is of type "phone" or "tel".
     *
     * This method checks the field type and returns true if it matches either "phone" or "tel".
     * Useful for applying phone-specific validation rules or rendering logic.
     *
     * @returns {boolean} Returns true if the field type is "phone" or "tel", otherwise false.
     *
     * @example
     * // Example usage in a form field
     * if (this.isPhone()) {
     *   // Apply phone validation or show phone-specific UI
     * }
     *
     * @remarks
     * This method is typically used internally to conditionally add phone validation rules
     * or to customize the rendering of phone fields.
     */
    isPhone() {
        return ["tel", "phone"].includes(defaultStr(this.getType()).toLowerCase().trim());
    }

    /**
     * Mutates the options object before validation or change events.
     *
     * This protected method allows you to customize or transform the validation options
     * before they are used in validation or change handlers. Override this method in a subclass
     * to inject additional properties, modify values, or apply business logic.
     *
     * @param {IFormFieldValidatorOptions<FieldType, ValueType>} options - The options object to mutate.
     * @returns {IFormFieldValidatorOptions<FieldType, ValueType>} - The mutated options object.
     *
     * @example
     * // Example: Add a custom property before validation
     * protected onChangeOptionsMutator(options) {
     *   options.customFlag = true;
     *   return options;
     * }
     *
     * @remarks
     * This method is called internally before validation and change events.
     * It is useful for advanced scenarios where you need to inject context, flags,
     * or transform values before validation logic runs.
     */
    protected onChangeOptionsMutator(options: IFormFieldValidatorOptions<FieldType, ValueType>) {
        return options;
    }
    /**
     * Returns a copy of the provided options object, attaching the current FormField instance as the `context` property.
     *
     * This utility method is used internally to ensure that validation and change handlers receive a reference
     * to the current field instance, enabling advanced logic and access to field methods.
     *
     * @template T - The type of the options object.
     * @param {T} options - The options object to augment.
     * @returns {T & { context: FormField<FieldType, ValueType> }} - The augmented options object with the `context` property.
     *
     * @example
     * // Attach context to validation options
     * const optionsWithContext = this.getCallOptions({ value: "abc" });
     * // optionsWithContext.context === this
     *
     * @remarks
     * This method is typically used before calling validation or change handlers to ensure
     * the field instance is available in the options.
     */
    getCallOptions<T>(options: T): T & { context: FormField<FieldType, ValueType> } {
        return Object.assign({}, options, { context: this });
    }

    /**
     * Validates the current field value according to its rules and updates the field state.
     *
     * This method performs validation using the provided options and the field's own rules.
     * It supports asynchronous validation and updates the field's error state, validated value,
     * and triggers change events as needed.
     *
     * @param {IFormFieldValidatorOptions<FieldType, ValueType>} options - The validation options, including value, rules, and context.
     * @param {boolean} [force=false] - If true, forces validation even if the value hasn't changed.
     * @returns {Promise<IFormFieldValidatorOptions<FieldType, ValueType>>} - Resolves with the validation options after validation.
     *
     * @example
     * // Basic usage: validate a field value
     * field.validate({ value: "user@example.com" }).then((result) => {
     *   if (!result.error) {
     *     console.log("Field is valid!");
     *   }
     * });
     *
     * @example
     * // Force validation even if value hasn't changed
     * field.validate({ value: "12345" }, true);
     *
     * @remarks
     * - Automatically adds rules for email, phone, and URL fields if needed.
     * - Calls `onValid` or `onInvalid` handlers based on validation result.
     * - Updates field state and triggers `onChange` if the value changes.
     * - Returns a promise that resolves with the validation options or rejects with an error.
     */
    validate(options: IFormFieldValidatorOptions<FieldType, ValueType>, force: boolean = false): Promise<IFormFieldValidatorOptions<FieldType, ValueType>> {
        options = this.getCallOptions(options);
        options.fieldName = defaultStr(options.fieldName, this.getName());
        if (this.isPhone() && isNonNullString(options.phoneNumber) && InputFormatter.isValidPhoneNumber(options.phoneNumber)) {
            (options as any).rawPhoneNumber = options.value;
            options.value = options.phoneNumber;
        }
        options.prevValue = "prevValue" in options ? options.prevValue : this.state.prevValue;
        this.onChangeOptionsMutator(options);
        options.value = this.sanitizeValue(options.value);
        const areValueEquals = this.compareValues(options.value, this.state.validatedValue);
        if (this.hasValidated() && force !== true && areValueEquals) {
            return Promise.resolve(options);
        }
        const { value } = options;
        if (!this.canValidate()) {
            return Promise.resolve(options).then((options) => {
                this.setState(
                    {
                        error: false,
                        validatedValue: value,
                        hasValidated: true,
                        prevValue: this.state.value,
                        value,
                        errorText: "",
                    } as any,
                    () => {
                        if (!areValueEquals) {
                            this.callOnChange(options as any);
                        }
                    }
                );
                return options;
            });
        }
        options.rules = Array.isArray(options.rules) && options.rules.length ? options.rules : this.getValidationRules();
        if (this.isEmail() && (this.props as any).validateEmail !== false && isNonNullString(options.value) && !options.rules.includes("Email")) {
            options.rules.push("Email");
        }
        if ((this.props as any).validatePhoneNumber !== false && this.isPhone() && isNonNullString(options.value) && options.value.length > 4 && !options.rules.includes("PhoneNumber")) {
            options.rules.push("PhoneNumber");
        }
        if ((this.getType() as any) == "url" && options.value && !options.rules.includes("Url")) {
            options.rules.push("Url");
        }
        const hasValidated = true;
        return Promise.resolve(this.beforeValidate(options)).then(() => {
            return new Promise((resolve, reject) => {
                return Validator.validate<FormField<FieldType, ValueType>>(options).then(() => {
                    return Promise.resolve(this.onValid(options)).then(() => {
                        this.setState(
                            {
                                error: false,
                                hasValidated,
                                validatedValue: value,
                                value,
                                prevValue: this.state.value,
                                errorText: "",
                            } as any,
                            () => {
                                this.callOnChange(options as any);
                            }
                        );
                        resolve(options);
                        return options;
                    });
                }).catch((error) => {
                    this.setState(
                        {
                            error: true,
                            hasValidated,
                            validatedValue: value,
                            value,
                            errorText: error?.message || stringify(error),
                        });
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
     * const shouldValidateOnBlur = this.shouldValidateOnBlur(); // true or false
     */
    shouldValidateOnBlur(): boolean {
        return this.props.validateOnBlur !== false;
    }
    /**
     * Checks if validation should occur on mount.
     * 
     * @returns {boolean} - Returns true if validation should occur on mount, otherwise false.
     * 
     * @example
     * const shouldValidateOnMount = this.shouldValidateOnMount(); // true or false
     */
    shouldValidateOnMount() {
        return !!this.props.validateOnMount;
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
        const rules: IValidatorRule[] = Array.isArray(this.props.validationRules) ? this.props.validationRules : [];
        if (this.props?.required) {
            rules.unshift("Required");
        }
        ["minLength", "length", "maxLength"].map((r: string) => {
            const k: keyof IField<FieldType, ValueType> = r as keyof IField<FieldType, ValueType>;
            const rValue = typeof this.props[k] === "number" ? (this.props as any)[k] : undefined;
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
    getType(): FieldType | IFieldType {
        return defaultStr(
            (this.isFilter() && (this.props as any)?.filter?.type) || undefined,
            this.props.type,
            this.props.type,
            "text"
        ) as FieldType;
    }


    /**
     * Sanitizes the input value based on the field type.
     *
     * This method transforms the provided value according to the field's type.
     * - For numeric fields, it parses the value as a float and returns 0 if parsing fails.
     * - For phone fields, it strips all non-digit characters.
     * - For other types, it returns the value as-is.
     *
     * @param {any} value - The value to sanitize.
     * @returns {any} - The sanitized value, formatted according to the field type.
     *
     * @example
     * // For a number field:
     * const sanitized = this.sanitizeValue("42.5"); // returns 42.5
     *
     * // For a phone field:
     * const sanitized = this.sanitizeValue("(555) 123-4567"); // returns "5551234567"
     *
     * // For a text field:
     * const sanitized = this.sanitizeValue("Hello World"); // returns "Hello World"
     *
     * @remarks
     * This method is useful for ensuring consistent value formatting before validation or submission.
     * It is called internally during value changes and validation.
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
     * Hook called before field validation.
     *
     * This method allows you to perform custom logic or transformations on the validation options
     * before the actual validation process begins. Override this method in a subclass to inject
     * additional properties, modify values, or apply business rules.
     *
     * @param {IFormFieldValidatorOptions<FieldType, ValueType>} options - The validation options for the field.
     * @returns {IFormFieldValidatorOptions<FieldType, ValueType>} - The (possibly mutated) validation options.
     *
     * @example
     * // Example: Add a timestamp before validation
     * beforeValidate(options) {
     *   options.timestamp = Date.now();
     *   return options;
     * }
     *
     * @remarks
     * This method is called internally before validation rules are applied.
     * It is useful for advanced scenarios such as logging, analytics, or dynamic rule injection.
     */
    beforeValidate(options: IFormFieldValidatorOptions<FieldType, ValueType>) {
        return options;
    }

    /**
     * Triggers the `onChange` event for the field when its value changes.
     *
     * This method checks if the current value differs from the previous value.
     * If so, it prepares the change options and calls the `onChange` handler provided in the field's props.
     *
     * @param {IFormFieldOnChangeOptions<FieldType, ValueType>} options - The options for the change event, including context, previous value, and field name.
     * @returns {void}
     *
     * @example
     * // Example usage: manually trigger change event after updating value
     * this.callOnChange({
     *   value: "new value",
     *   prevValue: "old value",
     *   context: this,
     *   fieldName: this.getName(),
     * });
     *
     * @remarks
     * - The method will not trigger the event if the value has not changed.
     * - Useful for custom field implementations or advanced form logic.
     */
    callOnChange(options: IFormFieldOnChangeOptions<FieldType, ValueType>) {
        if (this.compareValues(this.state.value, this.state.prevValue)) {
            return;
        }
        (options as any).prevValue = this.state.prevValue;
        options.value = this.state.value;
        options.context = this;
        options.fieldName = this.getName();
        if ((this.props as any).onChange) {
            (this.props as any).onChange(options as any);
        }
    }
    /**
     * This function is called when the field is validated.
     * 
     * @param {IFormFieldValidatorOptions<FieldType,ValueType>} options - The validation options.
     * @returns {boolean} - Returns true if validation is successful, otherwise throws an error.
     * 
     * @example
     * this.onValid(options); // Validates the field
     * 
     */
    onValid(options: IFormFieldValidatorOptions<FieldType, ValueType>) {
        options.context = this;
        if (typeof this.props.onFieldValid == "function") {
            const r = this.props.onFieldValid(options as any);
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
            return r;
        }
        return true;
    }
    /**
     * Handles the case where validation does not occur.
     * 
     * @param {IFormFieldValidatorOptions<FieldType,ValueType>} options - The validation options.
     * @returns {boolean} - Returns false if no validation occurred.
     * 
     * @example
     * this.onInvalid(options); // Handles no validation case
     * this function is called when the field is not validated
     */
    onInvalid(options: IFormFieldValidatorOptions<FieldType, ValueType>) {
        options.context = this;
        if (typeof this.props.onFieldInvalid === "function") {
            return this.props.onFieldInvalid(options as any);
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
        return getTextContent(this.props.label || this.getName());
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
        return (this.hasValidated() && !this.state.error) || false;
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
        if (this.props.getValidValue) {
            return this.props.getValidValue({
                data: formData,
                value: this.state.value,
                context: this as any,
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
     * Checks if the field is a filter.
     * 
     * @returns {boolean} - Returns true if the field is a filter, otherwise false.
     * 
     * @example
     * const isFilterField = this.isFilter(); // Checks if the field is a filter
     */
    isFilter(): boolean {
        return !!this.props.isFilter;
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
        return this.state.isEditable;
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
        return this.state.isDisabled;
    }
    /**
    * Disables the field.
    * 
    * @example
    * this.disable(); // Disables the field
    */
    disable() {
        this.setState({ isDisabled: true });
    }
    /**
     * Enables the field.
     * 
     * @example
     * this.enable(); // Enables the field
     */
    enable() {
        this.setState({ isDisabled: false });
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
     * @param {IFormFieldValidatorOptions<FieldType,ValueType>} options - The validation options.
     * @returns {Promise<IFormFieldValidatorOptions<FieldType,ValueType>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.validateOnChange({ value: "new value" }); // Validates the field on change
     */
    validateOnChange(options: IFormFieldValidatorOptions<FieldType, ValueType>) {
        return this.validate(options).then((r) => {
            return r;
        }).catch((e) => {
            return e;
        });
    }

    _render(props: IField<FieldType, ValueType>, innerRef?: any): ReactNode {
        return (<TextInput ref={innerRef as any} {...(props as any)} />);
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

    getKeyboardEvents(keyboardEventHandlerOptions?: IKeyboardEventHandlerProps): IKeyboardEventHandlerKey[] {
        const sanitizeKeyEvent = "ctrl+m";
        const events = [sanitizeKeyEvent, "enter", "up", "down", "left", "right"];
        if (Array.isArray(keyboardEventHandlerOptions?.handleKeys)) {
            keyboardEventHandlerOptions?.handleKeys.map((key) => {
                if (!events.includes(key)) {
                    events.push(key);
                }
            });
        }
        return events;
    }

    getForm<Fields extends IFields = IFields>(): IFormContext<Fields> | null {
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
        return this.props.formName || this.props.formName || "";
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
        if (!this.canValidate()) return;
        const form = this.getForm();
        if (form && typeof this.props.onKeyEvent === "function") {
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
            this.props.onKeyEvent(arg);
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
     * Lifecycle method called when the component mounts.
     * 
     * @example
     * componentDidMount() {
     *     super.componentDidMount();
     *     this.onRegister();
     * }
     */
    componentDidMount(): void {
        super.componentDidMount();
        this.onRegister();
        if (this.props.onMount) {
            this.props.onMount(this as any);
        }
    }
    componentWillUnmount(): void {
        super.componentWillUnmount();
        this.onUnregister();
        if (this.props.onUnmount) {
            this.props.onUnmount(this as any);
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
        return !!this.props.isFormLoading;
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
        return !!this.props.isFormSubmitting;
    }

    renderSkeleton(): ReactNode {
        const ret = typeof this.props.renderSkeleton === "function"
            ? this.props.renderSkeleton(this as any)
            : null;
        return isValidElement(ret) ? (ret) : (
            <>
                <Text children={this.props.label} />
            </>
        );
    }
    protected overrideProps(props: IField<FieldType, ValueType>): IField<FieldType, ValueType> {
        return props;
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
        let {
            data,
            keyEventHandlerProps,
            formName,
            isFilter: cIsFilter,
            visible,
            isRendable,
            disabled: customDisabled,
            readOnly: customReadOnly,
            displayErrors,
            ...rest
        } = this.overrideProps(this.props as IField<FieldType, ValueType>);
        const isFilter = this.isFilter() || cIsFilter;
        if (isFilter) {
            if (isRendable === false) return null;
        }
        const visibleClassName = !this.isFilter() && visible === false ? commonVariant({ hidden: true }) : "";
        const disabled = !!customDisabled || this.isDisabled();
        const readOnly = !!customReadOnly || this.isFormSubmitting();
        const errorText = this.getErrorText();
        const onBlur = (rest as any).onBlur;
        const isLoading = this.isFormLoading();
        const canValidate = this.canValidate() && displayErrors !== false;
        const canShowErrors = this.canDisplayError();
        return (
            <KeyboardEventHandler
                {...keyEventHandlerProps}
                testID={"resk-form-field-container-" + this.getName()}
                handleKeys={this.isFilter() ? [] : this.getKeyboardEvents(keyEventHandlerProps)}
                onKeyEvent={this.onKeyEvent.bind(this)}
                disabled={disabled || readOnly}
                className={cn("resk-form-field-container", visibleClassName, commonVariant({ disabled, readOnly }))}
            >
                {(kProps) => {
                    return (
                        <>
                            {isLoading
                                ? this.renderSkeleton()
                                : null}
                            {!isLoading
                                ? this._render(
                                    {
                                        ...rest,
                                        isFilter: cIsFilter,
                                        onChange: (options: IFormFieldOnChangeOptions<FieldType, ValueType>) => {
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
                                                    if (this.shouldValidateOnBlur()) {
                                                        this.validateOnChange({
                                                            value: this.getValue(),
                                                        } as IFormFieldValidatorOptions<FieldType, ValueType>);
                                                    }
                                                },
                                        disabled,
                                        errorText,
                                        error: canShowErrors,
                                        handleMaskValidationErrors: canShowErrors,
                                        ...kProps,
                                        defaultValue: this.state.value,
                                    } as any,
                                    this.setRef.bind(this)
                                )
                                : null}
                            {canValidate && !this.isFilter() ? (
                                <HelperText
                                    error={canShowErrors}
                                    className={cn("resk-form-field-helper-text", isLoading || !canShowErrors && "opacity-0")}
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

    private static readonly FIELDS_COMPONENTS_METADATA_KEY = Symbol("formFieldsComponent");

    static registerComponent<FieldType extends IFieldType = IFieldType, ValueType = any, TState extends IFormFieldState<FieldType, any> = IFormFieldState<FieldType, any>>(type: IFieldType, component: IFormFieldComponent<FieldType, ValueType, TState>) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = FormField.getRegisteredComponents();
        (components as any)[type] = component;
        Reflect.defineMetadata(FormField.FIELDS_COMPONENTS_METADATA_KEY, components, FormField);
    }
    /**
     * Retrieves all registered field components.
     * This method returns an object containing all field components that have been registered
     * with their corresponding field types.
     * 
     * @static
     * @returns {Record<IFieldType, typeof FormField>} - An object mapping field types to their registered components.
     * 
     * @example
     * const registeredComponents = FormField.getRegisteredComponents();
     * console.log(registeredComponents); // Logs all registered field components
     */
    static getRegisteredComponents(): Record<IFieldType, typeof FormField> {
        const components = Reflect.getMetadata(FormField.FIELDS_COMPONENTS_METADATA_KEY, FormField);
        return isObj(components) ? components : {} as any;
    }
    /**
     * Retrieves a registered field component by its name.
     * This method allows developers to access a specific field component based on its type.
     * 
     * @static
     * @param {IFieldType} type - The name of the field type to retrieve the component for.
     * @returns {typeof FormField | null} - The registered field component if found, otherwise null.
     * 
     * @example
     * const textFieldComponent = FormField.getRegisteredComponent("text");
     * if (textFieldComponent) {
     *     // Use the retrieved text field component
     * }
     */
    static getRegisteredComponent<FieldType extends IFieldType = IFieldType, ValueType = any>(type: IFieldType): IFormFieldComponent<FieldType, ValueType> {
        if (!isNonNullString(type)) return FormField<FieldType, ValueType>;
        const components = FormField.getRegisteredComponents();
        if (!components) return FormField<FieldType, ValueType>;
        return components[type];
    }
}




/******************* Form Implementation  ******************/

export function Form<Fields extends IFields = IFields>({ name, testID, onFormValid, onFormInvalid, fields, ref, isUpdate: customIsUpdate, renderField, renderFields, children, onValidateField, onInvalidateField, onSubmit, renderSkeleton, isLoading, disabled, beforeSubmit: customBeforeSubmit, onKeyEvent, onEnterKeyPress, prepareField, readOnly, header, isEditingData, data: customData, ...props }: IFormProps<Fields>) {
    const generatedFormName = useId();
    testID = defaultStr(testID, "resk-form");
    isLoading = !!isLoading;
    const formRef = useRef<IFormContext | null>(null);
    const submitCountRef = useRef<number>(0);
    const invalidSubmitCount = useRef<number>(0);
    const [isSubmitting, setIsSubmitting] = useStateCallback<boolean>(false);
    const formName = useMemo(() => {
        return defaultStr(name, "form-" + generatedFormName);
    }, [name, generatedFormName]);
    const data = useMemo(() => {
        return isObj(customData) ? customData : {};
    }, [customData]);
    const { fields: prePreparedFields, primaryKeys } = useMemo(() => {
        const preparedFields: Fields = {} as Fields;
        const primaryKeys: IFieldName<Fields>[] = [];
        if (fields && isObj(fields)) {
            typedEntries(fields as Fields).map(([name, _field]) => {
                if (!_field || !isObj(_field) || _field.isRendable === false) return;
                if (_field.perm !== undefined && !Auth.isAllowed(_field.perm)) return;
                const field = Object.clone(_field);
                delete field.isRendable;
                field.name = defaultStr(field.name, name);
                if (field.primaryKey === true) {
                    primaryKeys.push(name as string);
                }
                preparedFields[name] = field;
            })
        }
        return { fields: preparedFields, primaryKeys };
    }, [formName, fields]);
    const isUpdate = useMemo(() => {
        if (typeof customIsUpdate === "boolean") return customIsUpdate;
        if (typeof isEditingData === "function") {
            return isEditingData({
                data,
                primaryKeys,
            });
        }
        if (!primaryKeys.length) return false;
        for (const key of primaryKeys) {
            if (!isEmpty((data as any)[key])) return true;
        }
        return false;
    }, [data, isEditingData, primaryKeys, customIsUpdate]);
    const preparedFields = useMemo(() => {
        const preparedFields: Fields = {} as Fields;
        typedEntries(prePreparedFields).map(([name, field]) => {
            if (isObj(field.forCreateOrUpdate)) {
                extendObj(field, field.forCreateOrUpdate);
            }
            if (isUpdate && isObj(field.forUpdate)) {
                extendObj(field, field.forUpdate);
            } else if (!isUpdate && isObj(field.forCreate)) {
                extendObj(field, field.forCreate);
            }
            if (field.primaryKey === true && isUpdate) {
                field.readOnly = true;
            }
            if (disabled) {
                field.disabled = true;
            }
            if (readOnly) {
                field.readOnly = true;
            }
            field.formName = formName;
            field.testID = defaultStr(field.testID, `resk-form-field-${String(name)}`);
            const { onFieldValid, onFieldInvalid, onKeyEvent: onFieldKeyboardEvent } = field;

            field.onFieldValid = (options: IFormFieldValidatorOptions) => {
                const r = typeof onFieldValid === "function" ? onFieldValid(options as any) : undefined;
                if (typeof onValidateField == "function") {
                    onValidateField(options);
                }
                if (formRef.current) {
                    let isValid = true;
                    const fields = formRef.current?.getFieldInstances?.();
                    if (isObj(fields)) {
                        for (const name in fields) {
                            const f = fields[name];
                            if (f instanceof FormField && !f.isValid()) {
                                isValid = false;
                            }
                        }
                    }
                    formRef.current?.trigger?.(isValid ? "onValid" : "onInvalid", formRef.current);
                    if (isValid) {
                        if (typeof onFormValid === "function") {
                            onFormValid(options as any);
                        }
                    } else if (typeof onFormInvalid === "function") {
                        onFormInvalid(options as any);
                    }
                    //enable and disable form actions
                    const actions = FormsManager.getActions(formName);
                    for (var k in actions) {
                        const action = actions[k];
                        if (action) {
                            if (isValid) {
                                if (typeof action?.enable === "function") {
                                    action.enable();
                                }
                            } else if (typeof action?.disable === "function") {
                                action.disable();
                            }
                        }
                    }
                }
                return r;
            };
            field.onFieldInvalid = (options: IFormFieldValidatorOptions) => {
                const r = typeof onFormInvalid === "function" ? onFormInvalid(options) : undefined;
                if (typeof onInvalidateField == "function") {
                    onInvalidateField(options as any);
                }
                formRef.current?.trigger("onInvalid", formRef.current);
                return r;
            };

            if (typeof onKeyEvent === "function" || typeof onEnterKeyPress === "function") {
                field.onKeyEvent = (options: IFormKeyboardEventHandlerOptions) => {
                    const r = typeof onFieldKeyboardEvent === "function" ? onFieldKeyboardEvent(options) : undefined;
                    if (typeof onKeyEvent === "function") {
                        onKeyEvent(options);
                    }
                    if (typeof onEnterKeyPress == "function" && options?.key === "enter" && (formRef?.current?.isValid?.() || options?.form?.isValid?.())) {
                        if (onEnterKeyPress(options) === false) {
                            return;
                        }
                        const func = typeof formRef?.current?.submit === "function" ? formRef?.current?.submit : options?.form?.submit;
                        if (typeof func === "function") {
                            func();
                        }
                    }
                    return r;
                };
            }
            if (typeof prepareField == "function") {
                const prepared = prepareField({
                    fields: preparedFields,
                    isUpdate,
                    field,
                    data,
                });
                if (!isObj(prepared)) return;
                preparedFields[name] = prepared as any;
            }
        });
        return prePreparedFields;
    }, [testID, formName, prePreparedFields, stableHash(onFormValid), stableHash(onFormInvalid), disabled, readOnly, isUpdate, data, stableHash(prepareField), stableHash(onKeyEvent), stableHash(onValidateField), stableHash(onInvalidateField)]);
    const contextRef = useRef<{
        isSubmitting: boolean, fieldsInstances: Record<IFieldName<Fields>, FormField>, data: IFormData,
        isLoading: boolean, primaryKeys: IFieldName<Fields>[], isUpdate: boolean, errors: string[],
        preparedFields: Fields,
    }>({
        isSubmitting,
        fieldsInstances: {} as Record<IFieldName<Fields>, FormField>,
        data,
        isLoading,
        primaryKeys,
        isUpdate,
        errors: [],
        preparedFields,
    });
    contextRef.current.isSubmitting = isSubmitting;
    contextRef.current.data = data;
    contextRef.current.isLoading = isLoading;
    contextRef.current.primaryKeys = primaryKeys;
    contextRef.current.isUpdate = isUpdate;
    contextRef.current.preparedFields = preparedFields;
    const onSubmitRef = useRef(onSubmit);
    onSubmitRef.current = onSubmit;


    const beforeSubmit = useCallback(async (options: IFormSubmitOptions): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            const callback = typeof customBeforeSubmit == "function" ? customBeforeSubmit : undefined;
            try {
                resolve(callback ? callback(options as any) : options);
            } catch (err) {
                //Notify.error(err as INotifyMessage);
                reject(err);
            }
        });
    }, [customBeforeSubmit]);
    const beforeSubmitRef = useRef(beforeSubmit);
    beforeSubmitRef.current = beforeSubmit;
    const form = useMemo<IFormContext<Fields>>(() => {
        submitCountRef.current = 0;
        invalidSubmitCount.current = 0;
        const isValid = () => {
            const fields = contextRef.current.fieldsInstances;
            contextRef.current.errors = [];
            if (isObj(fields)) {
                for (let j in fields) {
                    const f = fields[j];
                    if (f instanceof FormField && !f.isValid()) {
                        contextRef.current.errors.push(`[${f.getLabel()}] : ${defaultStr(f.getErrorText())}`);
                    }
                }
            }
            return contextRef.current.errors.length === 0;
        }
        const getData = () => {
            const data = Object.clone(isObj(contextRef.current.data) ? contextRef.current.data : {});
            const fields = contextRef.current.fieldsInstances;
            if (!isObj(fields)) return data;
            for (let i in fields) {
                const field = fields[i];
                if (!(field instanceof FormField)) continue;
                const fName: IFieldName<Fields> = field.getName(), fValue = field.isValid() ? field.getValidValue(data) : field.getValue();
                data[fName] = fValue;
                if (fValue === undefined) {
                    delete data[fName];
                }
            }
            return data;
        }
        const getErrors = () => Array.isArray(contextRef.current.errors) ? contextRef.current.errors : [];
        const getErrorText = () => getErrors().join("\n") || "";
        const form = observableFactory<IFormEvent, Omit<IFormContext<Fields>, keyof IObservable>>({
            getSubmitCount: () => submitCountRef.current,
            mountField: (field) => {
                const fieldName = field?.getName();
                if (!fieldName) return;
                contextRef.current.fieldsInstances[name as IFieldName<Fields>] = field;
            },
            unmountField: (fieldName, field) => {
                if (!isNonNullString(fieldName)) return;
                if (!contextRef.current.fieldsInstances[fieldName]) {
                    return;
                }
                delete contextRef.current.fieldsInstances[fieldName];
            },
            getInvalidSubmitCount: () => invalidSubmitCount.current,
            getFields: () => contextRef.current.preparedFields,
            isValid,
            getData,
            getName: () => formName,
            getErrors,
            getErrorText,
            isEditing: () => contextRef.current.isUpdate,
            isSubmitting: () => contextRef.current.isSubmitting,
            getPrimaryKeys: () => contextRef.current.primaryKeys,
            getFieldInstances: () => contextRef.current.fieldsInstances,
            isLoading: () => contextRef.current.isLoading,

            submit: () => {
                submitCountRef.current++;
                if (!isValid()) {
                    const message = getErrorText();
                    invalidSubmitCount.current++;
                    return Promise.reject(new Error(message));
                }
                return new Promise((resolve, reject) => {
                    const data = getData();
                    const { isUpdate, primaryKeys } = contextRef.current;
                    const options: IFormSubmitOptions<Fields> = {
                        data,
                        isUpdate,
                        form: formRef.current as any,
                    };
                    const onSubmit = typeof onSubmitRef.current == "function" ? onSubmitRef.current : (options: IFormSubmitOptions<Fields>) => options;
                    return beforeSubmitRef.current(options).then(() => {
                        setIsSubmitting(true, () => {
                            () => {
                                return Promise.resolve(onSubmit(options))
                                    .then(resolve)
                                    .catch(reject)
                                    .finally(() => { setIsSubmitting(false) });
                            }
                        })
                    });
                });
            },
        });
        formRef.current = form;
        return form;
    }, [formName]);
    useEffect(() => {
        form?.trigger?.("mount", form);
        FormsManager.mountForm(form);
        return () => {
            form?.trigger?.("unmount", form);
            FormsManager.unmountForm(formName);
            form?.offAll?.();
        }
    }, [form]);
    const skeleton = useMemo(() => {
        return isLoading && typeof renderSkeleton == "function" ? renderSkeleton(form) : null;
    }, [form, isLoading])
    const headerContent = useMemo(() => {
        const h = typeof header == "function" ? header(form) : header;
        return isValidElement(h) ? h : null;
    }, [header, form]);
    const childrenContent = useMemo(() => {
        if (isLoading) return null;
        const c = typeof children == "function" ? children(form) : children;
        return isValidElement(c) ? c : null;
    }, [children, form]);
    const hasRenderFields = typeof renderFields == "function";
    const formFields = useMemo(() => {
        const options = { form, data, isUpdate, fields: preparedFields };
        if (typeof renderFields == "function") {
            return renderFields(options);
        }
        const _renderField = typeof renderField == "function" ? renderField : (field: IField, options: IFormSubmitOptions<Fields>) => <FieldRenderer {...field} key={field.name} />;
        return typedEntries(preparedFields).map(([name, _field]) => {
            return <Fragment key={String(name)}>
                {_renderField(_field, options)}
            </Fragment>
        })
    }, [stableHash(renderFields), form, data, isUpdate, stableHash(renderField)]);
    useImperativeHandle(ref, () => (form));
    return <FormContext.Provider value={{ form }}>
        {headerContent}
        {skeleton ?? !hasRenderFields ? <View testID={testID} role="form"  {...props} className={cn("resk-form", `resk-form-${formName}`, props.className)}>{formFields}</View> : formFields}
        {childrenContent}
    </FormContext.Provider>;
}

export type IFormFieldComponent<FieldType extends IFieldType = IFieldType, ValueType = any, TState extends IFormFieldState<FieldType, ValueType> = IFormFieldState<FieldType, ValueType>> = new (
    props: IField<FieldType, ValueType>
) => FormField<FieldType, ValueType, TState>;


export function FieldRenderer<FieldType extends IFieldType = IFieldType, ValueType = any>({ onMount, onUnmount, ...field }: Omit<IField, "ref"> & { ref?: Ref<FormField<FieldType, ValueType>> }) {
    const formContext = useForm();
    const { form } = formContext ?? {};
    const isFormField = !!form;
    const Component = FormField.getRegisteredComponent<FieldType, ValueType>(field.type);
    useEffect(() => {
        if (!form) return;
        return () => {
            form?.unmountField?.(field.name as string);
        }
    }, [field.name, form])
    return <Component
        {...field as any}
        key={field.name}
        onMount={isFormField ? (context) => {
            form?.mountField?.(context);
        } : onMount}
        onUnmount={isFormField ? (context) => {
            form?.unmountField?.(field.name as string, context);
        } : onUnmount}
    />;
}

export class FormsManager {

    private static forms: { [fommName: string]: IFormContext } = {};

    /**
     * A collection of actions associated with forms, indexed by form names and action IDs.
     * 
     * @private
     * @type { { [formName: string]: { [actionId: string]: IFormActionProps } } }
     */
    private static actions: {
        [fommName: string]: {
            [actionId: string]: IFormActionContext;
        };
    } = {};

    static isField(field: any): field is FormField {
        return field instanceof FormField;
    }

    static isForm(form: any): boolean {
        if (!form) return false;
        return isObj(form) && typeof form.getData === "function" && typeof form.getFields === "function" && typeof form.isValid === "function" && typeof form.getName === "function";
    }
    static mountForm(formInstance?: IFormContext) {
        if (!formInstance || this.isForm(this.forms[formInstance.getName()])) return;
        this.forms[formInstance.getName()] = formInstance;
    }

    static unmountForm(formName?: string): void {
        if (!formName) return;
        delete this.forms[formName];
    }
    static mountField(field: FormField) {
        if (!field || this.isField(field)) return;
    }
    static unmountField(field: FormField) {
        if (!field || this.isField(field)) return;
    }

    static getForm<Fields extends IFields = IFields>(formName?: string): IFormContext<Fields> | null {
        if (!formName) return null;
        return this.forms[formName] as any || null;
    }

    static getFieldInstances<Fields extends IFields = IFields>(formName: string): Record<IFieldName<Fields>, FormField> {
        return this.getForm<Fields>(formName)?.getFieldInstances?.() || {} as any;
    }

    static getFieldInstance<T extends IFieldType = IFieldType, ValueType = any>(formName?: string, fieldName?: string): FormField<T, ValueType> | null {
        if (!isNonNullString(formName) || !isNonNullString(fieldName)) return null;
        const fields = this.getFieldInstances(formName);
        if (isObj(fields) && fieldName) {
            return fields[fieldName as string] as any || null;
        }
        return null;
    }
    /**
     * Mounts an action associated with a specified form.
     * 
     * @param action - The action to mount.
     * @param formName - The name of the form to associate the action with.
     * 
     * @example
     * const action = { id: "submit", handler: () => { } };
     * FormsManager.mountAction(action, "myForm"); // Mounts the action to "myForm"
     */
    static mountAction<Context = unknown>(action: IFormActionContext<Context>, formName: string) {
        if (!action || !formName || !isNonNullString(action?.id)) return;
        this.actions[formName] = this.actions[formName] || {};
        this.actions[formName][action?.id] = action;
    }
    /**
     * Unmounts an action from a specified form.
     * 
     * @param actionId - The ID of the action to unmount.
     * @param formName - The name of the form to disassociate the action from.
     * 
     * @example
     * FormsManager.unmountAction("submit", "myForm"); // Unmounts the action from "myForm"
     */
    static unmountAction(actionId: string, formName?: string) {
        if (!formName || !isNonNullString(actionId)) return;
        if (!isObj(this.actions[formName])) return;
        delete this.actions[formName][actionId];
    }

    static getActions(formName: string) {
        if (!isNonNullString(formName)) return {};
        return this.actions[formName] || {};
    }
}

export function FormAction<FormFields extends IFields = IFields, Context = unknown>({ formName, submitFormOnPress, id, className, ref, onPress, context, ...props }: IFormActionProps<FormFields, Context>) {
    const innerRef = useRef<IButtonInteractiveContext<Context> & View>(null);
    const mergedRef = useMergeRefs(innerRef, ref);
    const generatedId = useId();
    id = defaultStr(id, generatedId);
    useEffect(() => {
        if (isNonNullString(formName) && innerRef.current) {
            FormsManager.mountAction({ ...innerRef.current, formName }, formName);
        }
        return () => {
            FormsManager.unmountAction(id, formName);
        };
    }, [innerRef, formName, id]);
    useEffect(() => {
        return () => {
            FormsManager.unmountAction(id, formName);
        };
    }, [formName, id]);
    return <Button.Interactive<Context>
        testID={"resk-form-action-" + String(formName)}
        {...props}
        context={context}
        id={id}
        className={cn(className, "resk-form-action ", "resk-form-action-" + String(formName))}
        ref={mergedRef}
        onPress={(event, context) => {
            const form = FormsManager.getForm<FormFields>(formName);
            if (!form?.isValid?.()) {
                innerRef?.current?.disable();
                return;
            }
            const options = Object.assign({}, context, form ? { form, formData: form.getData() } : {});
            if (typeof onPress == "function" && onPress(event, options) === false) {
                return;
            }
            if (form && submitFormOnPress !== false) {
                form.submit();
            }
        }}
    />
}

const FormContext = createContext<{ form: IFormContext } | null>(null);

export const useForm = () => useContext(FormContext);

FormAction.displayName = "Form.Action";
FieldRenderer.displayName = "Form.FieldRenderer";

Form.Field = FormField;
Form.Manager = FormsManager;
Form.Action = FormAction;
Form.FieldRenderer = FieldRenderer;



export type IFormActionContext<Context = unknown> = IButtonInteractiveContext<Context> & {
}



export interface IFormActionProps<FormFields extends IFields = IFields, Context = unknown> extends Omit<IButtonInteractiveProps<Context>, "onPress"> {

    onPress?: (event: GestureResponderEvent, context: Context & { form?: IFormContext<FormFields>, formData?: IFormData<FormFields> }) => any;

    /***
     * The name of the form associated.
     * The form action uses this property to dynamically listen to the state of the form and is activated or deactivated according to the validated state or name of the form. 
     */
    formName: string;

    /***
     * If true, the button action will submit the form when pressed in case the formName is set.
     * This can be useful for creating buttons that submit the form when pressed if the form is valid.
     */
    submitFormOnPress?: boolean;
};

export interface IFormContext<Fields extends IFields = IFields> extends IObservable<IFormEvent> {
    getName(): IFieldName<Fields>;
    isValid(): boolean;
    isEditing(): boolean;
    getData(): IFormData;
    mountField(field: FormField): void;
    unmountField(fieldName: string, field?: FormField): void;
    /**
     * Returns an object containing **field instances** keyed by field name.
     *
     * Each instance may include internal methods, refs, focus control, etc.
     *
     * Example:
     * ```ts
     * const instances = getFieldInstances();
     * instances?.email.isValid(); // manually focus email input
     * ```
     */
    getFieldInstances(): Record<IFieldName<Fields>, FormField>;

    /**
     * Returns an object containing **field state/properties** keyed by field name.
     *
     * Each entry typically includes value, touched, error, isValid, etc.
     *
     * Example:
     * ```ts
     * const props = getFieldProps();
     * console.log(props.email.error); // shows error for email field
     * ```
     */
    getFields(): Fields;
    isSubmitting(): boolean;
    getPrimaryKeys(): IFieldName<Fields>[];
    isLoading(): boolean;
    submit(): Promise<any>;
    isValid(): boolean;
    getErrors(): string[];
    getErrorText(): string;
    /**
  * ✅ Returns the number of **successful form submission attempts**.
  *
  * This function should be called to get the **current count** of
  * valid submissions — i.e., times the form was submitted
  * successfully (passed validation and triggered submit logic).
  *
  * ---
  * ### Example:
  * ```tsx
  * const count = formContext.getSubmitCount();
  * console.log(`The form was submitted ${count} times.`);
  * ```
  *
  * ---
  * 💡 Use cases:
  * - Show confirmation message after first submit
  * - Disable submit button after N submissions
  * - Track analytics around valid user interaction
  */
    getSubmitCount(): number;

    /**
     * ⚠️ Returns the number of **blocked form submission attempts** due to invalid fields.
     *
     * Call this function to get the count of times the user **tried** to submit
     * the form, but the submission was prevented because **validation failed**.
     *
     * ---
     * ### Example:
     * ```tsx
     * const invalidAttempts = formContext.getInvalidSubmitCount();
     * if (invalidAttempts > 0) {
     *   showErrorToast("Please correct the highlighted fields before submitting.");
     * }
     * ```
     *
     * ---
     * 💡 Use cases:
     * - Highlight invalid fields after repeated attempts
     * - Show a banner or toast encouraging field correction
     * - Log or report user frustration in analytics
     */
    getInvalidSubmitCount(): number;
}

export interface IFormKeyboardEventHandlerOptions {
    key: IKeyboardEventHandlerKey;
    event: IKeyboardEventHandlerEvent;
    formData: IFormData;
    form: IFormContext;
    isFormField?: boolean;
    value?: any;
};


type IFieldName<Fields extends IFields = IFields> = keyof Fields & string;
export type IFormData<Fields extends IFields = IFields> = {
    [K in (keyof Fields | string | number | symbol)]: any;
};

export interface IFormFieldProps<FieldType extends IFieldType = IFieldType, ValueType = any, TOnChangeOptions = unknown> extends IFieldBase<FieldType, ValueType> {
    testID?: string;
    className?: IClassName;
    onKeyEvent?: (options: IFormKeyboardEventHandlerOptions) => any;
    getValidValue?: (options: { value: any; context: FormField<FieldType, ValueType>; data: IFormData }) => any;
    isFilter?: boolean;
    validateOnMount?: boolean;

    validateOnBlur?: boolean;
    validationRules?: IValidatorRule[];

    data?: IFormData;

    /**
     * ✅ Called when **this specific field becomes valid**.
     *
     * Useful for triggering success UI feedback, enabling submit button, etc.
     *
     * @param value - The current valid value of the field
     */
    onFieldValid?: (options: IFormFieldValidatorOptions) => any;

    /**
     * ❌ Called when **this specific field becomes invalid** after validation.
     *
     * Useful for showing local error messages or triggering a visual error state.
     *
     * @param error - The validation error message or object
     */
    onFieldInvalid?: (options: IFormFieldValidatorOptions) => any;

    keyEventHandlerProps?: IKeyboardEventHandlerProps;

    formName?: string;

    errorText?: string;

    error?: boolean;

    isLoading?: boolean;
    isFormLoading?: boolean;

    isFormSubmitting?: boolean;
    renderSkeleton?: (context: FormField<FieldType, ValueType>) => ReactNode;

    onMount?: (context: FormField) => any;

    onUnmount?: (context: FormField) => any;

    displayErrors?: boolean;

    label?: ReactNode;

    isRendable?: boolean;

    ref?: any;

    onChange?: (options: IFormFieldOnChangeOptions<FieldType, ValueType, TOnChangeOptions>) => void;
}

export interface IFormFieldTextProps<FieldType extends IFieldType = IFieldType, ValueType = any>
    extends IFormFieldProps<FieldType, ValueType>, Omit<ITextInputProps<ValueType>, "onChange" | "ref" | "type"> {

}

export interface IFormProps<Fields extends IFields = IFields> extends Omit<ViewProps, "children" | "ref"> {

    renderSkeleton?: (context: IFormContext<Fields>) => ReactNode;

    prepareField?: (options: {
        field: IField;
        isUpdate: boolean;
        fields: Fields;
        data: IFormData<Fields>;
    }) => IField | null | undefined;

    data?: IFormData;

    perm?: IAuthPerm;

    renderFields?: (options: IFormSubmitOptions<Fields> & {
        fields: Fields;
    }) => ReactNode;

    /***
        A function used to render a specific field
        @param {IField} field - The field to render
        @param {IFormSubmitOptions<Fields>} options - The options for the form submission
        @returns {ReactNode} - The rendered field
        @remarks
            This function is used to render a specific field in the form.
            It's only used when the `renderFields` prop is not provided.
            It allows for customization of the rendering process for individual fields.
            The function takes two parameters: the field to render and the options for the form submission.
            It returns a ReactNode, which is the rendered field.
    */
    renderField?: (field: IField, options: IFormSubmitOptions<Fields>) => ReactNode;

    beforeSubmit?: (options: IFormSubmitOptions<Fields>) => any;

    onSubmit?: (options: IFormSubmitOptions<Fields>) => any;

    name?: string;

    /**
     * Called when the entire form is validated and determined to be **valid**.
     *
     * You can use this to trigger final preparation before submission,
     * enable the submit button, or track success state.
     */
    onFormValid?: (options: IFormFieldValidatorOptions) => any;

    /**
     * Called when the form is validated and determined to be **invalid**,
     * meaning **one or more fields** have validation errors.
     *
     * Useful for displaying a global error banner, scrolling to the first error,
     * or disabling further interactions.
     */
    onFormInvalid?: (options: IFormFieldValidatorOptions) => any;

    /**
     * 🔁 Called **every time a field becomes valid** after validation,
     * no matter which field it is. Can be used to track global form health.
     *
     * @param {IFormFieldValidatorOptions} options - The options for the field validator
     */
    onValidateField?: (options: IFormFieldValidatorOptions) => any;

    /**
     * ⚠️ Called **every time a field becomes invalid** after validation.
     * Useful for triggering centralized error handling, summaries, etc.
     *
     * @param {IFormFieldValidatorOptions} options - The options for the field validator
     */
    onInvalidateField?: (options: IFormFieldValidatorOptions) => any;

    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;

    onKeyEvent?: (options: IFormKeyboardEventHandlerOptions) => any;

    fields?: Fields;

    isEditingData?: (options: {
        data: IFormData<Fields>;
        primaryKeys: IFieldName<Fields>[];
    }) => boolean;

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
    readOnly?: boolean;

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
            field: IField;
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


    header?: ((options: IFormContext<Fields>) => ReactElement) | ReactElement;

    children?: ((context: IFormContext<Fields>) => ReactElement) | ReactElement;


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
     * Specifies whether error messages will be displayed by the form fields.
     * 
     * @type {boolean}
     * 
     * @example
     * displayErrors: true, // Error messages will be displayed
     */
    displayErrors?: boolean;

    /***
     * Specifies whether errors should be displayed when the form is submitting.
     * When form is submitting, the form check if it's valid, if not, it display the errors in the form 
     * if this property is set to true
     * @default false
     */
    displayErrorsWhenSubmitting?: boolean;

    /**
     * If true, the form will be wrapped in a ScrollView
     * Default is false
     */
    withScrollView?: boolean;

    scrollViewClassName?: IClassName;

    scrollViewContainerClassName?: IClassName;

    /***
     * If true, the form will be rendered as a table
     * Default is false
     */
    renderAsTable?: boolean;

    ref?: Ref<IFormContext<Fields>>;
};

export interface IFormFieldValidatorOptions<FieldType extends IFieldType = IFieldType, ValueType = any> extends IValidatorValidateOptions<Array<any>, FormField<FieldType, ValueType>> {
    prevValue?: ValueType;

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

export interface IFormFieldState<FielType extends IFieldType = IFieldType, ValueType = any> {
    error: boolean;
    isEditable: boolean;
    isDisabled: boolean;
    validatedValue?: ValueType;
    hasValidated?: boolean;
    value: ValueType;
    prevValue?: ValueType;
    errorText: string;
}


export interface IFormSubmitOptions<Fields extends IFields = IFields> {

    data: IFormData<Fields>;

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
     * const options: IFormSubmitOptions = {
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

    form: IFormContext<Fields>;
};

export type IFormFieldOnChangeOptions<FieldType extends IFieldType = IFieldType, ValueType = any, TOnChangeOptions = unknown> = IOnChangeOptions & {

    context: FormField<FieldType>;

    prevValue: ValueType;
} & TOnChangeOptions;


function compareValues(a: any, b: any) {
    if (isEmpty(a) && isEmpty(b)) return true;
    return areEquals(a, b);
}


export interface IFormEventMap {
    mount: string;
    unmount: string;
    submit: string;
    beforeSubmit: string;
    afterSubmit: string;
    onValid: string;
    onInvalid: string;
    beforeValidate: string;
    afterValidate: string;
    validate: string;
    noValidate: string;
    validationStatusChanged: string;
}

export type IFormEvent = keyof IFormEventMap;

declare module "@resk/core/resources" {

    /**
     * Maps form field types to their respective properties.
     * @interface IFieldMap
     */
    export interface IFieldMap {
        text: IFormFieldTextProps<"text">;

        number: IFormFieldProps<"number", "number">;

        date: IFormFieldTextProps<"date">;

        datetime: IFormFieldTextProps<"datetime">;


        time: IFormFieldTextProps<"time">;


        tel: IFormFieldTextProps<"tel"> & { validatePhoneNumber?: boolean };


        password: IFormFieldTextProps<"password">;


        email: IFormFieldTextProps<"email"> & { validateEmail?: boolean };


        url: IFormFieldTextProps<"url">;
    }
}