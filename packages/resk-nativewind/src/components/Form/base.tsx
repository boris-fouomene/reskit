"use client";
import { cn, Component, getTextContent, useMergeRefs, useStateCallback } from "@utils/index";
import { IFieldType, IField, IFields, IFieldBase } from "@resk/core/resources";
import { IValidatorRule, IValidatorValidateOptions, Validator, } from "@resk/core/validator";
import { InputFormatter } from "@resk/core/inputFormatter";
import { defaultStr, defaultObj, typedEntries, areEquals, isEmpty, isNonNullString, isObj, stringify, extendObj } from "@resk/core/utils";
import { ReactNode, isValidElement, useId, useRef, useMemo, useCallback, useEffect, createContext, useContext, Fragment, Ref } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData, View, GestureResponderEvent } from 'react-native';
import KeyboardEventHandler, { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { HelperText } from "@components/HelperText";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IClassName, IOnChangeOptions } from "@src/types";
import stableHash from 'stable-hash';
import { ITextInputProps, TextInput } from "@components/TextInput";
import { Text } from "@html/Text";
import { commonVariant } from "@variants/common";
import { Auth, IAuthPerm } from "@resk/core/auth";
import { IObservable, observableFactory } from "@resk/core/observable";
import { useImperativeHandle } from "react";
import { IButtonInteractiveContext, IButtonInteractiveProps } from "@components/Button/types";
import { Button } from "@components/Button";
import { Div } from "@html/Div";
import { IHtmlDivProps } from "@html/types";
import { formVariant, IFormVariant } from "@variants/form";


class FormField<FieldType extends IFieldType = IFieldType, ValueType = any> extends Component<IField<FieldType, ValueType>, IFormFieldState<FieldType, ValueType>> {
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
        } as any;
        if (this.shouldValidateOnMount()) {
            this.validate({ value: this.state.value }).catch((e) => { });
        }
    }
    componentDidUpdate(prevProps: IField<FieldType, ValueType>): void {
        if (!this.compareValues(prevProps.defaultValue, this.props.defaultValue)) {
            this.validate({ value: this.props.defaultValue }, true).catch((e) => { });
        }
    }

    compareValues(a: ValueType | undefined, b: ValueType | undefined): boolean {
        if (typeof this.props.compareValues === "function") {
            return this.props.compareValues(a, b, this as any);
        }
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
     * @returns {Promise<IFormFieldValidateOptions<FieldType,ValueType>>} - A promise that resolves with validation options.
     * 
     * @example
     * this.setFieldValue("new value"); // Sets the field value
     */
    setFieldValue(value: any) {
        return this.validate({ value } as IFormFieldValidateOptions<FieldType, ValueType>);
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
        return FormsManager.getFieldInstance<FieldType>(this.getFormName(), fieldName);
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

    protected onChangeOptionsMutator(options: IFormFieldValidateOptions<FieldType, ValueType>) {
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

    validate(validateOptions: Omit<IFormFieldValidateOptions<FieldType, ValueType>, "context">, force: boolean = false): Promise<IFormFieldValidateOptions<FieldType, ValueType>> {
        const options = this.getCallOptions(validateOptions);
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
                            this.callOnChange(options);
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
                        }, () => {
                            this.onInvalid(options);
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
        return this.props.validateOnMount !== false;
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

    beforeValidate(options: IFormFieldValidateOptions<FieldType, ValueType>) {
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
        options.prevValue = this.state.prevValue;
        options.value = this.state.value;
        options.context = this;
        options.fieldName = this.getName();
        if (typeof this.props.onChange === "function") {
            this.props.onChange(options as any);
        }
    }
    private validateOtherFields() {
        const fields = FormsManager.getFieldInstances(this.getFormName());
        if (!isObj(fields) || !fields) return;
        let canEnable = true;
        typedEntries(fields).map(([name, field]) => {
            if (!(field instanceof FormField) || name === this.getName()) return;
            /* const matchF = field.getMatchField();
            if (matchF && matchF.getName() === this.getName()) {
                field.validate({ value: fK.getValue() });
            } */
            if (!field.isValid()) {
                canEnable = false;
                return;
            }
        });
    }
    onValid(options: IFormFieldValidateOptions<FieldType, ValueType>) {
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
    onInvalid(options: IFormFieldValidateOptions<FieldType, ValueType>) {
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

    validateOnChange(options: IFormFieldValidateOptions<FieldType, ValueType>) {
        return this.validate(options);
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

    getKeyboardEvents(fieldContainerOptions?: IKeyboardEventHandlerProps): IKeyboardEventHandlerKey[] {
        const sanitizeKeyEvent = "ctrl+m";
        const events = [sanitizeKeyEvent, "enter", "up", "down", "left", "right"];
        if (Array.isArray(fieldContainerOptions?.handleKeys)) {
            fieldContainerOptions?.handleKeys.map((key) => {
                if (!events.includes(key)) {
                    events.push(key);
                }
            });
        }
        return events;
    }

    getForm<Fields extends IFields = IFields>(): IForm<Fields> | null {
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
            fieldContainerProps,
            formName,
            isFilter: cIsFilter,
            visible,
            isRendable,
            disabled: customDisabled,
            readOnly: customReadOnly,
            displayErrors,
            fieldContainerClassName,
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
                {...fieldContainerProps}
                testID={"resk-form-field-container-" + this.getName()}
                handleKeys={this.isFilter() ? [] : this.getKeyboardEvents(fieldContainerProps)}
                onKeyEvent={this.onKeyEvent.bind(this)}
                disabled={disabled || readOnly}
                className={cn("resk-form-field-container", visibleClassName, commonVariant({ disabled, readOnly }), fieldContainerProps?.className, fieldContainerClassName)}
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
                                                        } as IFormFieldValidateOptions<FieldType, ValueType>);
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
                                    className={cn("resk-form-field-helper-text duration-300 transition-opacity", (isLoading || !canShowErrors) ? "opacity-0 z-0 text-transparent" : "opacity-100")}
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

    static registerComponent<FieldType extends IFieldType = IFieldType, ValueType = any>(type: IFieldType, component: IFormFieldComponent<FieldType, ValueType>) {
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
        if (!components || !components[type]) return FormField<FieldType, ValueType>;
        return components[type];
    }
}

/**
 * 🚀 **Advanced Universal Form Component** - The ultimate cross-platform form solution
 * 
 * A comprehensive, feature-rich form component that provides enterprise-grade form management
 * with advanced validation, state management, accessibility, and customization capabilities.
 * Built for React Native and Web with full TypeScript support and maximum flexibility.
 * 
 * ## ✨ **Key Features**
 * 
 * - 🎯 **Cross-Platform**: Works seamlessly on React Native and Web
 * - 🔥 **Type-Safe**: Full TypeScript support with intelligent field type inference
 * - ⚡ **Performance Optimized**: Smart memoization and efficient re-rendering
 * - 🎨 **Highly Customizable**: Flexible rendering with `renderFields` and `renderField` props
 * - 🛡️ **Robust Validation**: Built-in validation with custom rules support
 * - ♿ **Accessible**: WCAG compliant with screen reader support
 * - 🎭 **Fragment Support**: Render as fragments for table rows and custom layouts
 * - 🔄 **State Management**: Advanced form state with submission tracking
 * - ⌨️ **Keyboard Navigation**: Full keyboard support with custom key handlers
 * 
 * ## 🎯 **Use Cases**
 * 
 * - User registration and login forms
 * - Data entry and editing interfaces
 * - Survey and questionnaire systems
 * - Settings and configuration panels
 * - Inline table editing
 * - Multi-step form wizards
 * - Dynamic form generation
 * 
 * @template Fields - The fields type definition extending IFields for type-safe field access
 * 
 * @param {IFormProps<Fields>} props - Comprehensive form configuration object
 * @param {string} [props.name] - Unique form identifier for state management and testing
 * @param {React.CSSProperties} [props.style] - Custom CSS styles for the form container
 * @param {IFormVariant} [props.variant] - Pre-defined styling variant (compact, spacious, minimal)
 * @param {boolean} [props.validateBeforeFirstSubmit=false] - Enable validation before first submission attempt
 * @param {string} [props.testID="resk-form"] - Test identifier for automated testing
 * @param {string} [props.asHtmlTag] - HTML tag for web rendering (div, form, section, etc.)
 * @param {boolean} [props.asFragment=false] - Render as React Fragment for table rows and custom layouts
 * @param {IClassName} [props.className] - Additional CSS classes for form container
 * @param {boolean} [props.isLoading=false] - Loading state for showing skeleton UI
 * @param {boolean} [props.disabled=false] - Disable all form fields
 * @param {boolean} [props.readOnly=false] - Make all form fields read-only
 * @param {Fields} [props.fields] - Field definitions object with type-safe field configurations
 * @param {React.Ref<IFormContext<Fields>>} [props.ref] - Ref for accessing form context and methods
 * @param {boolean} [props.isUpdate] - Override update mode detection
 * @param {ReactNode | ((context: IFormContext<Fields>) => ReactNode)} [props.header] - Form header content
 * @param {ReactNode | ((context: IFormContext<Fields>) => ReactNode)} [props.children] - Form footer content
 * @param {(options: {data: IFormData<Fields>, primaryKeys: IFormFieldName<Fields>[]}) => boolean} [props.isEditingData] - Custom update mode detection
 * @param {IFormData} [props.data] - Initial form data
 * @param {(options: IFormSubmitOptions<Fields>) => any} [props.onSubmit] - Form submission handler
 * @param {(context: IFormContext<Fields>) => ReactNode} [props.renderSkeleton] - Custom loading skeleton renderer
 * @param {(options: IFormSubmitOptions<Fields>) => any} [props.beforeSubmit] - Pre-submission hook
 * @param {(field: IField, options: IFormRenderFieldOptions<Fields>) => ReactNode} [props.renderField] - Custom field renderer
 * @param {(options: IFormRenderFieldOptions<Fields>) => ReactNode} [props.renderFields] - Custom complete form renderer
 * @param {(options: IFormFieldValidateOptions<IFieldType>) => any} [props.onFormValid] - Form validation success callback
 * @param {(options: IFormFieldValidateOptions<IFieldType>) => any} [props.onFormInvalid] - Form validation failure callback
 * @param {(options: IFormFieldValidateOptions<IFieldType>) => any} [props.onValidateField] - Individual field validation success callback
 * @param {(options: IFormFieldValidateOptions<IFieldType>) => any} [props.onInvalidateField] - Individual field validation failure callback
 * @param {(options: IFormKeyboardEventHandlerOptions) => any} [props.onFormKeyEvent] - Form-level keyboard event handler
 * @param {(options: IFormKeyboardEventHandlerOptions) => any} [props.onEnterKeyPress] - Enter key press handler with auto-submit
 * @param {(formContext: IFormContext<Fields> & {field: IField}) => IField | null} [props.prepareFormField] - Field preparation hook
 * @param {IClassName} [props.fieldContainerClassName] - CSS classes for all field containers
 * 
 * @returns {JSX.Element} The rendered form component with full functionality
 * 
 * @example
 * **🎯 Basic User Registration Form**
 * ```tsx
 * const UserRegistrationForm = () => {
 *   const fields = {
 *     firstName: { type: 'text', name: 'firstName', label: 'First Name', required: true },
 *     lastName: { type: 'text', name: 'lastName', label: 'Last Name', required: true },
 *     email: { type: 'email', name: 'email', label: 'Email Address', required: true },
 *     password: { type: 'password', name: 'password', label: 'Password', required: true },
 *     confirmPassword: { type: 'password', name: 'confirmPassword', label: 'Confirm Password', required: true }
 *   } as const;
 * 
 *   return (
 *     <Form
 *       name="user-registration"
 *       fields={fields}
 *       validateBeforeFirstSubmit={true}
 *       onSubmit={async ({ data, isUpdate }) => {
 *         console.log('Submitting user registration:', data);
 *         await registerUser(data);
 *       }}
 *       header={({ isSubmitting }) => (
 *         <h2 className="text-2xl font-bold mb-6">
 *           {isSubmitting ? 'Creating Account...' : 'Create Your Account'}
 *         </h2>
 *       )}
 *     >
 *       {({ form, isSubmitting }) => (
 *         <div className="flex gap-4 mt-6">
 *           <Form.Action
 *             formName="user-registration"
 *             variant="primary"
 *             disabled={!form.isValid() || isSubmitting}
 *           >
 *             {isSubmitting ? 'Creating...' : 'Create Account'}
 *           </Form.Action>
 *           <Button variant="secondary">Cancel</Button>
 *         </div>
 *       )}
 *     </Form>
 *   );
 * };
 * ```
 * 
 * @example
 * **🎨 Advanced Form with Custom Layout**
 * ```tsx
 * const ProfileEditForm = () => (
 *   <Form
 *     name="profile-edit"
 *     variant="spacious"
 *     fields={profileFields}
 *     data={currentUser}
 *     isUpdate={true}
 *     renderFields={({ fields, isUpdate, form }) => (
 *       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 *         <div className="space-y-6">
 *           <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
 *           <Form.FieldRenderer {...fields.firstName} />
 *           <Form.FieldRenderer {...fields.lastName} />
 *           <Form.FieldRenderer {...fields.email} />
 *           <Form.FieldRenderer {...fields.phone} />
 *         </div>
 *         
 *         <div className="space-y-6">
 *           <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
 *           <Form.FieldRenderer {...fields.company} />
 *           <Form.FieldRenderer {...fields.position} />
 *           <Form.FieldRenderer {...fields.bio} />
 *           
 *           {form.isValid() && (
 *             <div className="p-4 bg-green-50 rounded-lg">
 *               <p className="text-green-700">✓ Profile information is valid</p>
 *             </div>
 *           )}
 *         </div>
 *       </div>
 *     )}
 *     onSubmit={async ({ data }) => {
 *       await updateUserProfile(data);
 *       showNotification('Profile updated successfully!');
 *     }}
 *   />
 * );
 * ```
 * 
 * @example
 * **📊 Table Row Editing with Fragment Support**
 * ```tsx
 * const UserTableRow = ({ user, onSave }) => (
 *   <tr>
 *     <Form
 *       asFragment={true}
 *       name={`user-row-${user.id}`}
 *       data={user}
 *       isUpdate={true}
 *       renderFields={({ fields }) => (
 *         <React.Fragment>
 *           <td className="px-4 py-2">
 *             <Form.FieldRenderer {...fields.name} />
 *           </td>
 *           <td className="px-4 py-2">
 *             <Form.FieldRenderer {...fields.email} />
 *           </td>
 *           <td className="px-4 py-2">
 *             <Form.FieldRenderer {...fields.role} />
 *           </td>
 *           <td className="px-4 py-2">
 *             <Form.Action
 *               formName={`user-row-${user.id}`}
 *               size="sm"
 *               variant="primary"
 *             >
 *               Save
 *             </Form.Action>
 *           </td>
 *         </React.Fragment>
 *       )}
 *       onSubmit={({ data }) => onSave(user.id, data)}
 *     />
 *   </tr>
 * );
 * ```
 * 
 * @example
 * **⚡ Dynamic Form with Conditional Fields**
 * ```tsx
 * const DynamicSettingsForm = () => (
 *   <Form
 *     name="dynamic-settings"
 *     fields={settingsFields}
 *     renderField={(field, { form, data }) => {
 *       // Conditional rendering based on other field values
 *       if (field.name === 'advancedOptions' && !data.enableAdvanced) {
 *         return null;
 *       }
 *       
 *       // Enhanced field rendering with validation indicators
 *       const fieldInstance = form.getFieldInstances()[field.name];
 *       const isValid = fieldInstance?.isValid();
 *       
 *       return (
 *         <div className={`field-wrapper ${isValid ? 'valid' : 'pending'}`}>
 *           <div className="flex items-center gap-2">
 *             <Form.FieldRenderer {...field} />
 *             {isValid && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
 *             {field.helpText && <InfoIcon className="w-4 h-4 text-gray-400" />}
 *           </div>
 *           {field.helpText && (
 *             <p className="text-sm text-gray-600 mt-1">{field.helpText}</p>
 *           )}
 *         </div>
 *       );
 *     }}
 *     onFormKeyEvent={({ key, form }) => {
 *       if (key === 'ctrl+s') {
 *         form.submit();
 *       }
 *     }}
 *   />
 * );
 * ```
 * 
 * @remarks
 * ### 🔧 **Technical Architecture**
 * 
 * - **State Management**: Uses React hooks with optimized memoization for performance
 * - **Validation Engine**: Built-in validation with extensible rule system
 * - **Event System**: Observable pattern for form events and lifecycle management
 * - **Type Safety**: Full TypeScript support with intelligent field type inference
 * - **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
 * - **Performance**: Smart re-rendering with React.memo and useMemo optimizations
 * - **Extensibility**: Plugin-based architecture for custom field types and validators
 * 
 * ### ⚠️ **Important Considerations**
 * 
 * - When using `asFragment={true}`, container props like `style`, `className` are ignored
 * - The `renderFields` prop takes precedence over `renderField` when both are provided
 * - Form validation state is preserved across re-renders for optimal user experience
 * - Field instances are automatically managed and cleaned up on unmount
 * - Keyboard navigation follows ARIA best practices for accessibility
 * 
 * ### 🚀 **Performance Tips**
 * 
 * - Use `React.memo()` for custom field components to prevent unnecessary re-renders
 * - Implement field-level validation instead of form-level for better performance
 * - Use the `prepareFormField` prop for dynamic field configuration
 * - Leverage the built-in memoization by keeping field definitions stable
 * - Consider using `renderFields` for complex layouts to avoid multiple re-renders
 * 
 * @see {@link IFormProps} - Complete props interface documentation
 * @see {@link IFormContext} - Form context interface for accessing form state
 * @see {@link FormField} - Base field component for creating custom field types
 * @see {@link FormsManager} - Global form management utilities
 * @see {@link IField} - Field definition interface
 * @see {@link Form.FieldRenderer} - Default field renderer component
 * 
 * @since 1.0.0
 * @author Resk Development Team
 * @version 2.1.0
 * 
 * @public
 */
export function Form<Fields extends IFields = IFields>({ name, style, variant, validateBeforeFirstSubmit, testID, asHtmlTag, asFragment, className, isLoading, disabled, readOnly, fields, ref, isUpdate: customIsUpdate, isSubmitting: customIsSubmitting, header, children, isEditingData, data: customData, onSubmit, renderSkeleton, beforeSubmit: customBeforeSubmit, renderField, renderFields, onFormValid, onFormInvalid, onValidateField, onInvalidateField, onFormKeyEvent, onEnterKeyPress, prepareFormField, fieldContainerClassName }: IFormProps<Fields>) {
    const generatedFormName = useId();
    testID = defaultStr(testID, "resk-form");
    isLoading = !!isLoading;
    const computedVariant = formVariant(variant);
    fieldContainerClassName = cn(computedVariant.fieldContainer(), fieldContainerClassName);
    const [isSubmitting, setIsSubmitting] = useStateCallback<boolean>(!!customIsSubmitting);
    useEffect(() => {
        if (typeof customIsSubmitting === "boolean" && customIsSubmitting !== isSubmitting) {
            setIsSubmitting(customIsSubmitting);
        }
    }, [customIsSubmitting, isSubmitting]);
    const formName = useMemo(() => {
        return defaultStr(name, "form-" + generatedFormName);
    }, [name, generatedFormName]);
    const data = useMemo(() => {
        return isObj(customData) ? Object.clone(customData) : {};
    }, [customData]);
    const { fields: preparedFields, primaryKeys } = useMemo(() => {
        const preparedFields: Fields = {} as Fields;
        const primaryKeys: IFormFieldName<Fields>[] = [];
        if (fields && isObj(fields)) {
            typedEntries(fields as Fields).map(([name, _field]) => {
                if (!_field || !isObj(_field) || _field.isRendable === false) return;
                if (_field.perm !== undefined && !Auth.isAllowed(_field.perm)) return;
                const field = Object.clone(_field);
                delete field.isRendable;
                field.name = defaultStr(field.name, name);
                (field as any)._formFieldName = name;
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
    const fieldsInstancesRef = useRef<Record<IFormFieldName<Fields>, FormField>>({} as Record<IFormFieldName<Fields>, FormField>);
    const formRef = useRef<IForm | null>(null);
    const contextRef = useRef<{
        isSubmitting: boolean,
        isLoading: boolean, primaryKeys: IFormFieldName<Fields>[], data: IFormData<Fields>,
        isUpdate: boolean, submitCount: number, invalidSubmitCount: number, errors: string[],
        validateBeforeFirstSubmit: boolean;
    }>({ primaryKeys, isSubmitting, isLoading, isUpdate, data, submitCount: 0, invalidSubmitCount: 0, errors: [], validateBeforeFirstSubmit: !!validateBeforeFirstSubmit });
    contextRef.current.isSubmitting = isSubmitting;
    contextRef.current.isLoading = isLoading;
    contextRef.current.primaryKeys = primaryKeys;
    contextRef.current.isUpdate = isUpdate;
    contextRef.current.data = data;
    contextRef.current.validateBeforeFirstSubmit = !!validateBeforeFirstSubmit;

    const onSubmitRef = useRef(onSubmit);
    onSubmitRef.current = onSubmit;

    const beforeSubmit = useCallback(async (options: IFormSubmitOptions): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            const callback = typeof customBeforeSubmit == "function" ? customBeforeSubmit : undefined;
            try {
                resolve(callback ? callback(options) : options);
            } catch (err) {
                //Notify.error(err as INotifyMessage);
                reject(err);
            }
        });
    }, [customBeforeSubmit]);
    const beforeSubmitRef = useRef(beforeSubmit);
    beforeSubmitRef.current = beforeSubmit;
    const form = useMemo<IForm<Fields>>(() => {
        contextRef.current.submitCount = 0;
        contextRef.current.invalidSubmitCount = 0;
        const isValid = () => {
            const fields = fieldsInstancesRef.current;
            contextRef.current.errors = [];
            if (isObj(fields)) {
                typedEntries(fields).map(([name, field]) => {
                    if (!FormsManager.isField(field)) return;
                    if (!field.isValid()) {
                        contextRef.current.errors.push(`[${field.getLabel()}] : ${defaultStr(field.getErrorText())}`);
                    }
                });
            }
            return contextRef.current.errors.length === 0;
        }
        const getData = () => {
            const data = defaultObj(contextRef.current.data);
            const fields = fieldsInstancesRef.current;
            if (!isObj(fields)) return data;
            for (let i in fields) {
                const field = fields[i];
                if (!(field instanceof FormField)) continue;
                const fName: IFormFieldName<Fields> = field.getName(), fValue = field.isValid() ? field.getValidValue(data) : field.getValue();
                data[fName] = fValue;
                if (fValue === undefined) {
                    delete data[fName];
                }
            }
            return data;
        }
        const getErrors = () => Array.isArray(contextRef.current.errors) ? contextRef.current.errors : [];
        const getErrorText = () => getErrors().join("\n") || "";
        const form = observableFactory<IFormEvent, Omit<IForm<Fields>, keyof IObservable>>({
            shouldValidateBeforeFirstSubmit: () => contextRef.current.validateBeforeFirstSubmit,
            getSubmitCount: () => contextRef.current.submitCount,
            getInvalidSubmitCount: () => contextRef.current.invalidSubmitCount,
            isValid,
            getData,
            getName: () => formName,
            getErrors,
            getErrorText,
            isEditing: () => contextRef.current.isUpdate,
            isSubmitting: () => contextRef.current.isSubmitting,
            getPrimaryKeys: () => contextRef.current.primaryKeys,
            getFieldInstances: () => fieldsInstancesRef.current,
            isLoading: () => contextRef.current.isLoading,

            submit: () => {
                const prevSubmitCount = contextRef.current.submitCount;
                contextRef.current.submitCount++;
                if (!isValid()) {
                    contextRef.current.invalidSubmitCount++;
                    if (!prevSubmitCount) {
                        typedEntries(fieldsInstancesRef.current).map(([name, field]) => {
                            if (field instanceof FormField) {
                                field.validate({ value: field.getValue() });
                            }
                        });
                    }
                    const message = getErrorText();
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
    const hasRenderFields = typeof renderFields == "function";
    disabled = !!disabled; readOnly = !!readOnly;
    const formFields = useMemo(() => {
        const options: IFormRenderFieldOptions<Fields> = { form, data, isUpdate, primaryKeys, fields: preparedFields, disabled, readOnly, formName };
        if (typeof renderFields == "function") {
            return renderFields(options);
        }
        const _renderField: IFormProps<Fields>["renderField"] = typeof renderField == "function" ? renderField : (field, options, name) => <FormFieldRenderer {...field} name={name} key={name} />;
        return typedEntries(preparedFields).map(([name, _field]) => {
            return <Fragment key={String(name)}>
                {_renderField(_field, options, name as IFormFieldName<Fields>)}
            </Fragment>
        });
    }, [stableHash(renderFields), stableHash(renderField), preparedFields, primaryKeys, form, formName, data, isUpdate, disabled, readOnly]);
    const formContext: IFormContext<Fields> = {
        get isUpdate() {
            return isUpdate;
        },
        get isSubmitting() {
            return isSubmitting;
        },
        get data() {
            return data;
        },
        get isLoading() {
            return isLoading;
        },
        get primaryKeys() {
            return primaryKeys;
        },
        get fields() {
            return preparedFields;
        },
        get fieldsInstances() {
            return fieldsInstancesRef.current;
        }, get errors() {
            return contextRef.current.errors;
        },
        get submitCount() {
            return contextRef.current.submitCount;
        },
        get invalidSubmitCount() {
            return contextRef.current.invalidSubmitCount;
        },
        get isDisabled() { return !!disabled; },
        get isReadOnly() { return !!readOnly; },
        get formName() {
            return formName;
        },
        get testID() {
            return testID;
        },
        get fieldContainerClassName() {
            return fieldContainerClassName;
        },
        onFormValid,
        onFormInvalid,
        onValidateField,
        onInvalidateField,
        onFormKeyEvent,
        onEnterKeyPress,
        prepareFormField,
        form
    };
    useImperativeHandle(ref, () => (formContext));
    const skeleton = isLoading && typeof renderSkeleton == "function" ? renderSkeleton(formContext) : null

    // Determine the form content based on fragment rendering preference
    const formContent = skeleton ?? !hasRenderFields ? (
        asFragment ? (
            <>{formFields}</>
        ) : (
            <Div style={style} asHtmlTag={asHtmlTag} id={formName} testID={testID} role="form" accessibilityState={{ disabled: !!disabled }} className={cn("resk-form", `resk-form-${formName}`, computedVariant.base(), className)}>
                {formFields}
            </Div>
        )
    ) : formFields;

    return <FormContext.Provider value={formContext}>
        {typeof header == "function" ? header(formContext) : header}
        {formContent}
        {typeof children == "function" ? children(formContext) : children}
    </FormContext.Provider>;
}


function FormFieldRenderer<FieldType extends IFieldType = IFieldType, ValueType = any>(props: Omit<IField<FieldType, ValueType>, "ref" | "name"> & { name: string; type: FieldType, ref?: Ref<FormField<FieldType, ValueType>> }) {
    const formContext = useForm();
    const { form, fieldContainerClassName, isSubmitting, isLoading, prepareFormField, onFormValid, onFormKeyEvent, onEnterKeyPress, onFormInvalid, fieldsInstances, onValidateField, onInvalidateField, formName, isDisabled, isReadOnly, isUpdate, data } = (isObj(formContext) ? formContext : {}) as IFormContext<IFields>;
    const isFormField = FormsManager.isForm(form);
    const { ref, ...fieldProps } = props;
    const isFilter = !!fieldProps.isFilter;
    const preparedField = useMemo(() => {
        const field = Object.assign({}, fieldProps);
        if (isFormField) {
            if (isObj(fieldProps.forCreateOrUpdate)) {
                extendObj(field, fieldProps.forCreateOrUpdate);
            }
            if (isObj(fieldProps.forUpdate) && isUpdate) {
                extendObj(field, fieldProps.forUpdate);
            } else if (isObj(fieldProps.forCreate) && !isUpdate) {
                extendObj(field, fieldProps.forCreate);
            }
            if (isUpdate && fieldProps.primaryKey == true) {
                field.readOnly = true;
            }
            field.formName = formName;
        } else if (isFilter) {
            if (isObj(fieldProps.forFilter)) {
                extendObj(field, fieldProps.forFilter);
            }
        }
        delete field.forCreate;
        delete field.forCreateOrUpdate;
        delete field.forUpdate;
        delete field.forFilter;
        return field;
    }, [isFormField, isFilter, props, formName, isUpdate]);
    const field = isFormField && typeof prepareFormField === "function" ? prepareFormField({ ...formContext, field: preparedField } as any) : fieldProps;
    const unmountField = useCallback((fieldName: string) => {
        if (!isNonNullString(fieldName)) return;
        if (isObj(fieldsInstances)) {
            delete fieldsInstances[fieldName];
        }
    }, [fieldsInstances]);
    useEffect(() => {
        if (!isFormField || !isObj(field) || !isNonNullString(field?.name)) return;
        return () => {
            unmountField(field?.name as string);
        }
    }, [field?.name, isFormField, unmountField]);
    if (!field) return null;
    const { onMount, onUnmount, onFieldValid, onKeyEvent, onFieldInvalid, onKeyEvent: onFieldKeyboardEvent } = field;
    const Component = FormField.getRegisteredComponent<FieldType, ValueType>(field.type);
    return <Component
        {...field as any}
        disabled={isDisabled || !!field.disabled}
        readOnly={isReadOnly || !!field.readOnly || isSubmitting || isLoading}
        fieldContainerClassName={cn("resk-form-field-renderer-container", field.fieldContainerClassName)}
        className={cn("resk-form-field-renderer", field.className)}
        formName={formName}
        ref={ref}
        key={field.name}
        onMount={isFormField ? (field) => {
            fieldsInstances[field.getName()] = field;
        } : onMount}
        onUnmount={isFormField ? (context) => {
            unmountField(field.name as string);
        } : onUnmount}
        onFieldValid={(options: IFormFieldValidateOptions<IFieldType, ValueType>) => {
            const r = typeof onFieldValid === "function" ? onFieldValid(options as any) : undefined;
            if (typeof onValidateField == "function") {
                onValidateField(options as any);
            }
            if (isFormField) {
                FormsManager.toggleFormStatus(formName, ({ isValid, form }) => {
                    form.trigger(isValid ? "onValid" : "onInvalid", form);
                    if (isValid) {
                        if (typeof onFormValid === "function") {
                            onFormValid(options);
                        }
                    } else if (typeof onFormInvalid === "function") {
                        onFormInvalid(options);
                    }
                })
            }
            return r;
        }}
        onFieldInvalid={(options: IFormFieldValidateOptions<IFieldType, ValueType>) => {
            const r = typeof onFieldInvalid === "function" ? onFieldInvalid(options as any) : undefined;
            if (isFormField) {
                if (typeof onInvalidateField == "function") {
                    onInvalidateField(options);
                }
                if (typeof onFormInvalid === "function") {
                    onFormInvalid(options);
                }
                FormsManager.toggleFormStatus(formName, ({ isValid, form }) => {
                    form.trigger(isValid ? "onValid" : "onInvalid", form);
                });
            }
            return r;
        }}
        onKeyEvent={(options) => {
            const r = typeof onFieldKeyboardEvent === "function" ? onFieldKeyboardEvent(options) : undefined;
            if (typeof onKeyEvent === "function") {
                onKeyEvent(options);
            }
            if (typeof onFormKeyEvent === "function") {
                onFormKeyEvent(options);
            }
            if (typeof onEnterKeyPress == "function" && options?.key === "enter" && (form?.isValid?.())) {
                if (onEnterKeyPress(options) === false) {
                    return;
                }
                if (typeof form?.submit === "function") {
                    form.submit();
                    form.trigger("submit", form);
                }
            }
            return r;
        }}
    />;
}
FormFieldRenderer.displayName = "Form.FieldRenderer";

class FormsManager {

    private static forms: { [fommName: string]: IForm } = {};

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

    static isField<FieldType extends IFieldType = IFieldType, ValueType = any>(field: any): field is FormField<FieldType, ValueType> {
        return field instanceof FormField;
    }

    static isForm<Fields extends IFields = IFields>(form: any): form is IForm<Fields> {
        if (!form) return false;
        return isObj(form) && typeof form.getData === "function" && typeof form.isValid === "function" && typeof form.getName === "function" && typeof form.getFieldInstances === "function";
    }
    static mountForm(formInstance?: IForm) {
        if (!formInstance || this.isForm(this.forms[formInstance.getName()])) return;
        this.forms[formInstance.getName()] = formInstance;
    }

    static unmountForm(formName?: string): void {
        if (!formName) return;
        delete this.forms[formName];
    }
    static getForm<Fields extends IFields = IFields>(formName?: string): IForm<Fields> | null {
        if (!formName) return null;
        return this.forms[formName] as any || null;
    }

    static getFieldInstances<Fields extends IFields = IFields>(formName: string): Record<IFormFieldName<Fields>, FormField> {
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
        if (!action || !formName || !isNonNullString(action?.id) || typeof action?.enable !== "function" || typeof action?.disable !== "function") return;
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
    static toggleFormStatus(formName: string, callback?: (options: { isValid: boolean, form: IForm }) => void) {
        if (!isNonNullString(formName)) return;
        const form = FormsManager.getForm(formName);
        if (!form) return;
        const isValid = form.isValid();
        if (form.shouldValidateBeforeFirstSubmit() || (form.getSubmitCount() > 0)) {
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
        if (typeof callback === "function") {
            callback({ isValid, form });
        }
    }
}

function FormAction<FormFields extends IFields = IFields, Context = unknown>({ formName, submitFormOnPress, id, className, ref, onPress, context, ...props }: IFormActionProps<FormFields, Context>) {
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
    }, [innerRef.current, formName, id]);
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
        onPress={async (event, context) => {
            const form = FormsManager.getForm<FormFields>(formName);
            const isFormField = form && form?.isValid() || false;
            const options = Object.assign({}, context, { isFormField }, form ? { form, formData: form?.getData?.() } : {});
            if (typeof onPress == "function" && await onPress(event, options) === false) {
                return;
            }
            if (form) {
                const cb = !isFormField ? innerRef.current?.disable : undefined;
                if (submitFormOnPress !== false) {
                    const submitForm = () => {
                        if (isFormField && context && typeof context?.setIsLoading == "function") {
                            context.setIsLoading(true, async () => {
                                try {
                                    await form.submit();
                                    context?.setIsLoading(false);
                                } catch (err) {
                                    context?.setIsLoading(false);
                                    throw err;
                                }
                            })
                        } else {
                            form.submit();
                        }
                    }
                    if (typeof cb == "function") {
                        cb(submitForm);
                    } else {
                        submitForm();
                    }
                } else {
                    cb?.();
                }
            }
        }}
    />
}
FormAction.displayName = "Form.Action";

const FormContext = createContext<IFormContext<any> | null>(null);

export function useForm<Fields extends IFields = IFields>() {
    const context = useContext(FormContext);
    if (!context || !context?.form) return null;
    return context as IFormContext<Fields>;
}

Form.Field = FormField;
Form.Manager = FormsManager;
Form.Action = FormAction;
Form.FieldRenderer = FormFieldRenderer;

export type IFormActionContext<Context = unknown> = IButtonInteractiveContext<Context> & {}



export interface IFormActionProps<FormFields extends IFields = IFields, Context = unknown> extends Omit<IButtonInteractiveProps<Context>, "onPress"> {

    onPress?: (event: GestureResponderEvent, context: Context & { form?: IForm<FormFields>, isFormValid?: boolean, formData?: IFormData<FormFields> }) => any;

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

export interface IForm<Fields extends IFields = IFields> extends IObservable<IFormEvent> {
    getName(): IFormFieldName<Fields>;
    isValid(): boolean;
    isEditing(): boolean;
    getData(): IFormData;
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
    getFieldInstances(): Record<IFormFieldName<Fields>, FormField>;

    isSubmitting(): boolean;
    getPrimaryKeys(): IFormFieldName<Fields>[];
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

    shouldValidateBeforeFirstSubmit(): boolean;
}

export interface IFormContext<Fields extends IFields = IFields> extends IFormContextProps<Fields> {
    form: IForm<Fields>;
    readonly testID: string;
    readonly formName: string;
    readonly fields: Fields;
    readonly data: IFormData<Fields>;
    readonly isSubmitting: boolean;
    readonly fieldsInstances: Record<IFormFieldName<Fields>, FormField>;
    readonly isLoading: boolean;
    readonly primaryKeys: IFormFieldName<Fields>[];
    readonly isUpdate: boolean;
    readonly isDisabled: boolean;
    readonly isReadOnly: boolean;
    readonly errors: string[];
    readonly submitCount: number;
    readonly invalidSubmitCount: number;
    readonly fieldContainerClassName?: IClassName;
}

export interface IFormKeyboardEventHandlerOptions {
    key: IKeyboardEventHandlerKey;
    event: IKeyboardEventHandlerEvent;
    formData: IFormData;
    form: IForm;
    isFormField?: boolean;
    value?: any;
};


type IFormFieldName<Fields extends IFields = IFields> = keyof Fields & string;
export type IFormData<Fields extends IFields = IFields> = {
    [K in (keyof Fields | string | number | symbol)]: any;
};

export interface IFormFieldProps<FieldType extends IFieldType = IFieldType, ValueType = any, TOnChangeOptions = unknown> extends IFieldBase<FieldType, ValueType> {
    testID?: string;
    className?: IClassName;
    /***
     * Additional CSS class name for the form field's container wrapper component.
     * 
     * This className is applied to the KeyboardEventHandler container that wraps
     * each form field, allowing for custom styling of the field container.
     * It is merged with other container-related classes and the className from fieldContainerProps.
     * 
     * @type {IClassName}
     * 
     * @example
     * ```tsx
     * // Apply custom field container styling
     * <FormField
     *   fieldContainerClassName="my-custom-field-container"
     *   fieldContainerProps={{
     *     className: "keyboard-specific-styles" // Also applied
     *   }}
     * />
     * ```
     * 
     * @remarks
     * - Applied to the KeyboardEventHandler container, not the input element
     * - Merged with fieldContainerProps.className and other internal container classes
     * - Useful for consistent field container styling across forms
     * - This is separate from any containerClassName that the underlying input component might have
     * 
     * @see {@link fieldContainerProps} for additional container configuration
     * 
     * @since v1.0.0
     */
    fieldContainerClassName?: IClassName;
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
    onFieldValid?: (options: IFormFieldValidateOptions<IFieldType, ValueType>) => any;

    /**
     * ❌ Called when **this specific field becomes invalid** after validation.
     *
     * Useful for showing local error messages or triggering a visual error state.
     *
     * @param error - The validation error message or object
     */
    onFieldInvalid?: (options: IFormFieldValidateOptions<IFieldType, ValueType>) => any;

    /**
     * Configuration options for the form field's container wrapper component.
     * 
     * This prop allows you to customize the KeyboardEventHandler component that wraps
     * each form field, including keyboard event handling, styling, and container behavior.
     * The field container handles keyboard navigation, event processing, and provides the
     * structural wrapper around the actual input element.
     * 
     * @type {IKeyboardEventHandlerProps}
     * 
     * @example
     * ```tsx
     * // Configure field container keyboard handling and styling
     * <FormField
     *   fieldContainerProps={{
     *     handleKeys: ['enter', 'tab', 'escape'],
     *     className: 'custom-field-container',
     *     handleEventType: 'keydown'
     *   }}
     * />
     * 
     * // Advanced field container configuration with keyboard shortcuts
     * <FormField
     *   fieldContainerProps={{
     *     handleKeys: ['ctrl+s', 'ctrl+enter'],
     *     disabled: false,
     *     isExclusive: true
     *   }}
     * />
     * 
     * // Field-specific container behavior
     * <FormField
     *   type="number"
     *   fieldContainerProps={{
     *     handleKeys: ['up', 'down'], // Only allow arrow keys
     *     handleEventType: 'keypress'
     *   }}
     * />
     * ```
     * 
     * @remarks
     * - Configures the KeyboardEventHandler container that wraps each form field
     * - Handles both keyboard event processing and container styling/behavior
     * - Key combinations follow the format: 'ctrl+key', 'alt+key', 'shift+key'
     * - Filter fields (isFilter: true) automatically disable keyboard event handling
     * - The className from fieldContainerProps is merged with fieldContainerClassName and field styles
     * - Disabled or read-only fields automatically disable keyboard event handling
     * - This is separate from any containerProps that the underlying input component might have
     * 
     * @see {@link IKeyboardEventHandlerProps} for complete configuration options
     * @see {@link KeyboardEventHandler} for the underlying container component
     * @see {@link fieldContainerClassName} for additional container styling
     * 
     * @since v1.0.0
     */
    fieldContainerProps?: IKeyboardEventHandlerProps;

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

    compareValues?: (a: ValueType | undefined, b: ValueType | undefined, context: FormField<FieldType, ValueType>) => boolean;
}

export interface IFormFieldTextProps<FieldType extends IFieldType = IFieldType, ValueType = any>
    extends IFormFieldProps<FieldType, ValueType>, Omit<ITextInputProps<ValueType>, "onChange" | "ref" | "type"> {
}

interface IFormRenderFieldOptions<Fields extends IFields = IFields> extends IFormSubmitOptions<Fields> {
    fields: Fields;
    disabled: boolean;
    readOnly: boolean;
    formName: string;
    primaryKeys: IFormFieldName<Fields>[];
}

export interface IFormContextProps<Fields extends IFields = IFields> {

    prepareFormField?: <FieldType extends IFieldType, ValueType = any>(formContext: IFormContext<Fields> & { field: Omit<IField<FieldType, ValueType>, "ref"> }) => Omit<IField<FieldType, ValueType>, "ref"> | null | undefined;
    /**
     * Called when the entire form is validated and determined to be **valid**.
     *
     * You can use this to trigger final preparation before submission,
     * enable the submit button, or track success state.
     */
    onFormValid?: (options: IFormFieldValidateOptions<IFieldType>) => any;

    /**
     * Called when the form is validated and determined to be **invalid**,
     * meaning **one or more fields** have validation errors.
     *
     * Useful for displaying a global error banner, scrolling to the first error,
     * or disabling further interactions.
     */
    onFormInvalid?: (options: IFormFieldValidateOptions<IFieldType>) => any;

    /**
     * 🔁 Called **every time a field becomes valid** after validation,
     * no matter which field it is. Can be used to track global form health.
     *
     * @param {IFormFieldValidateOptions<IFieldType>} options - The options for the field validator
     */
    onValidateField?: (options: IFormFieldValidateOptions<IFieldType>) => any;

    /**
     * ⚠️ Called **every time a field becomes invalid** after validation.
     * Useful for triggering centralized error handling, summaries, etc.
     *
     * @param {IFormFieldValidateOptions} options - The options for the field validator
     */
    onInvalidateField?: (options: IFormFieldValidateOptions<IFieldType>) => any;

    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;

    onFormKeyEvent?: (options: IFormKeyboardEventHandlerOptions) => any;
}

export interface IFormProps<Fields extends IFields = IFields> extends IFormContextProps<Fields> {
    testID?: string;
    variant?: IFormVariant;
    style?: IHtmlDivProps["style"];
    className?: IClassName;
    asHtmlTag?: IHtmlDivProps["asHtmlTag"];

    /**
     * Renders the form content as a React Fragment instead of a wrapper element.
     * 
     * When true, the form fields will be rendered without any surrounding container
     * element, which is particularly useful for table rows where you need the form
     * fields to be direct children of a table row element.
     * 
     * @type {boolean}
     * @default false
     * 
     * @example
     * ```tsx
     * // Render form as fragment for table row usage
     * <table>
     *   <tbody>
     *     <tr>
     *       <Form
     *         asFragment={true}
     *         fields={{
     *           name: { type: 'text', name: 'name' },
     *           email: { type: 'email', name: 'email' }
     *         }}
     *       />
     *     </tr>
     *   </tbody>
     * </table>
     * 
     * // Normal form with wrapper element
     * <Form
     *   asFragment={false} // or omit (default)
     *   fields={myFields}
     * />
     * ```
     * 
     * @remarks
     * - When asFragment is true, style, className, asHtmlTag, testID, and id props are ignored
     * - The form context and field functionality remain fully intact
     * - Header and children elements are still rendered normally
     * - Useful for integration with table structures, grid layouts, or custom containers
     * - Cannot be used together with custom renderFields that expect a container
     * 
     * @see {@link React.Fragment} for more information about fragments
     * @see {@link renderFields} for custom field rendering
     * 
     * @since v1.0.0
     */
    asFragment?: boolean;

    /**
     * Additional CSS class name applied to all form field container wrappers.
     * 
     * This className is applied to the KeyboardEventHandler container that wraps
     * each form field in the entire form, providing a consistent way to style
     * all field containers at the form level. It is merged with individual field
     * container classes and other styling options.
     * 
     * @type {IClassName}
     * 
     * @example
     * ```tsx
     * // Apply consistent styling to all field containers in the form
     * <Form
     *   fieldContainerClassName="form-field-spacing border-gray-200"
     *   fields={{
     *     email: { type: 'email', name: 'email' },
     *     password: { type: 'password', name: 'password' }
     *   }}
     * />
     * 
     * // Combine with individual field container styling
     * <Form
     *   fieldContainerClassName="mb-4" // Applied to all fields
     *   fields={{
     *     email: { 
     *       type: 'email', 
     *       name: 'email',
     *       fieldContainerClassName: "border-blue-500" // Additional styling for this field
     *     }
     *   }}
     * />
     * 
     * // Use with form variants for consistent theming
     * <Form
     *   variant="compact"
     *   fieldContainerClassName="compact-field-spacing"
     *   fields={myFields}
     * />
     * ```
     * 
     * @remarks
     * - Applied to every KeyboardEventHandler container in the form
     * - Merged with form variant fieldContainer styles and individual field styling
     * - Useful for consistent spacing, borders, and layout across all form fields
     * - Takes precedence over form variant styles but can be overridden by individual field styles
     * - This affects the field container wrapper, not the underlying input components
     * - Different from individual field `fieldContainerClassName` which applies to specific fields
     * 
     * @see {@link IFormFieldProps.fieldContainerClassName} for individual field container styling
     * @see {@link IFormVariant} for form-wide theming options
     * @see {@link KeyboardEventHandler} for the container component being styled
     * 
     * @since v1.0.0
     */
    fieldContainerClassName?: IClassName;

    renderSkeleton?: (context: IFormContext<Fields>) => ReactNode;

    data?: IFormData;

    perm?: IAuthPerm;

    /**
     * Custom function to render all form fields with complete control over the layout and structure.
     * 
     * When provided, this function takes full responsibility for rendering all form fields,
     * bypassing the default field rendering logic. This gives you maximum flexibility to create
     * custom layouts, groupings, conditional rendering, and complex field arrangements.
     * 
     * @param {IFormRenderFieldOptions<Fields>} options - Comprehensive context object containing form state, field definitions, and rendering options
     * @returns {ReactNode} - The complete rendered form fields structure
     * 
     * @example
     * ```tsx
     * // Custom two-column layout with grouped fields
     * const MyForm = () => (
     *   <Form
     *     renderFields={({ fields, isUpdate, data, disabled }) => (
     *       <div className="grid grid-cols-2 gap-6">
     *         <div className="space-y-4">
     *           <h3 className="text-lg font-semibold">Personal Information</h3>
     *           <Form.FieldRenderer {...fields.firstName} />
     *           <Form.FieldRenderer {...fields.lastName} />
     *           <Form.FieldRenderer {...fields.email} />
     *         </div>
     *         <div className="space-y-4">
     *           <h3 className="text-lg font-semibold">Account Settings</h3>
     *           <Form.FieldRenderer {...fields.username} />
     *           {!isUpdate && <Form.FieldRenderer {...fields.password} />}
     *           <Form.FieldRenderer {...fields.role} disabled={disabled} />
     *         </div>
     *         {data.role === 'admin' && (
     *           <div className="col-span-2">
     *             <Form.FieldRenderer {...fields.permissions} />
     *           </div>
     *         )}
     *       </div>
     *     )}
     *   />
     * );
     * 
     * // Table row rendering for inline editing
     * const TableRowForm = () => (
     *   <Form
     *     asFragment={true}
     *     renderFields={({ fields }) => (
     *       <React.Fragment>
     *         <td><Form.FieldRenderer {...fields.name} /></td>
     *         <td><Form.FieldRenderer {...fields.email} /></td>
     *         <td><Form.FieldRenderer {...fields.status} /></td>
     *       </React.Fragment>
     *     )}
     *   />
     * );
     * ```
     * 
     * @remarks
     * - When renderFields is provided, the renderField prop is completely ignored
     * - You must manually render each field using Form.FieldRenderer or your custom field components
     * - The function receives all necessary context including form state, field definitions, and validation status
     * - Use this for complex layouts, conditional field rendering, or when you need complete control over the form structure
     * - Works seamlessly with asFragment prop for table/grid rendering scenarios
     * - All form functionality (validation, submission, state management) remains intact regardless of custom rendering
     * 
     * @see {@link IFormRenderFieldOptions} for complete options interface
     * @see {@link Form.FieldRenderer} for the recommended component to render individual fields
     * @see {@link renderField} for individual field customization when you don't need complete layout control
     * 
     * @since v1.0.0
     */
    renderFields?: (options: IFormRenderFieldOptions<Fields>) => ReactNode;

    /**
     * Custom function to render individual form fields while maintaining the default form layout structure.
     * 
     * This function is called for each field when renderFields is not provided, allowing you to customize
     * how individual fields are rendered while keeping the overall form structure intact. Perfect for
     * adding consistent field decorations, conditional rendering, or field-specific enhancements.
     * 
     * @param {IField} field - The field definition object containing all field properties and configuration
     * @param {IFormRenderFieldOptions<Fields>} options - Form context and rendering options including form state, validation status, and field collection
     * @param {IFormFieldName<Fields>} fieldName - The name of the field being rendered, useful for identifying fields in the context. It represents the key in the fields object.
     * @returns {ReactNode} - The rendered field component
     * 
     * @example
     * ```tsx
     * // Add icons and validation indicators to fields
     * const EnhancedForm = () => (
     *   <Form
     *     renderField={(field, { form, isUpdate }) => (
     *       <div className="field-wrapper">
     *         {field.type === 'email' && <EmailIcon />}
     *         {field.type === 'password' && <LockIcon />}
     *         {field.type === 'tel' && <PhoneIcon />}
     *         
     *         <label className="field-label">
     *           {field.label}
     *           {field.required && <span className="text-red-500">*</span>}
     *         </label>
     *         
     *         <Form.FieldRenderer {...field} />
     *         
     *         {form.getFieldInstances()[field.name]?.isValid() && (
     *           <CheckIcon className="text-green-500" />
     *         )}
     *         
     *         {field.helpText && (
     *           <span className="text-sm text-gray-500">{field.helpText}</span>
     *         )}
     *       </div>
     *     )}
     *   />
     * );
     * 
     * // Conditional field rendering based on form mode
     * const ConditionalForm = () => (
     *   <Form
     *     renderField={(field, { isUpdate, disabled }) => {
     *       if (isUpdate && field.createOnly) return null;
     *       
     *       const fieldClassName = field.type === 'password' 
     *         ? 'password-field-container' 
     *         : 'standard-field-container';
     *       
     *       return (
     *         <div className={fieldClassName}>
     *           <Form.FieldRenderer 
     *             {...field} 
     *             disabled={disabled || (field.readOnlyInUpdate && isUpdate)}
     *           />
     *         </div>
     *       );
     *     }}
     *   />
     * );
     * ```
     * 
     * @remarks
     * - Only called when renderFields prop is not provided
     * - Maintains the default form container structure while customizing individual field rendering
     * - Called once for each field in the form fields object
     * - Use Form.FieldRenderer component to render the actual field to maintain all field functionality
     * - Perfect for adding consistent field decorations, validation indicators, or help text
     * - The field parameter contains all original field properties plus computed form context
     * - Field order follows the order defined in the fields object
     * 
     * @see {@link IField} for complete field definition interface
     * @see {@link IFormRenderFieldOptions} for complete options interface
     * @see {@link Form.FieldRenderer} for the recommended component to render the actual field
     * @see {@link renderFields} for complete form layout customization
     * 
     * @since v1.0.0
     */
    renderField?: (field: IField, options: IFormRenderFieldOptions<Fields>, fieldName: IFormFieldName<Fields>) => ReactNode;

    beforeSubmit?: (options: IFormSubmitOptions<Fields>) => any;

    onSubmit?: (options: IFormSubmitOptions<Fields>) => any;

    name?: string;

    fields?: Fields;

    isEditingData?: (options: {
        data: IFormData<Fields>;
        primaryKeys: IFormFieldName<Fields>[];
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


    header?: ((options: IFormContext<Fields>) => ReactNode) | ReactNode;

    children?: ((context: IFormContext<Fields>) => ReactNode) | ReactNode;

    /**
     * Controls whether form validation should toggle action statuses before the first submission.
     * 
     * When true, form actions will be enabled/disabled based on validation state
     * even when the form hasn't been submitted yet (submitCount = 0).
     * When false, actions will only be toggled after the first submission attempt.
     * 
     * @default false
     * 
     * @example
     * validateBeforeFirstSubmit: true, // Actions will be disabled if form is invalid from the start
     */
    validateBeforeFirstSubmit?: boolean;

    ref?: Ref<IFormContext<Fields>>;
};

export interface IFormFieldValidateOptions<FieldType extends IFieldType = IFieldType, ValueType = any> extends IValidatorValidateOptions<Array<any>, FormField<FieldType, ValueType>> {
    prevValue?: ValueType;
    fieldName?: string;
    context: FormField<FieldType, ValueType>
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


export type IFormFieldComponent<FieldType extends IFieldType = IFieldType, ValueType = any> = new (
    props: IField<FieldType, ValueType>
) => FormField<FieldType, ValueType>;

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

    form: IForm<Fields>;
};

export type IFormFieldOnChangeOptions<FieldType extends IFieldType = IFieldType, ValueType = any, TOnChangeOptions = unknown> = IOnChangeOptions & {
    context: FormField<FieldType, ValueType>;
    prevValue?: ValueType;
} & (TOnChangeOptions extends Record<string, any> ? TOnChangeOptions : {});


export function AttachFormField<FieldType extends IFieldType = IFieldType, ValueType = any>(type: FieldType) {
    return (target: IFormFieldComponent<FieldType, ValueType>) => {
        FormField.registerComponent<FieldType, ValueType>(type, target as typeof FormField);
    };
}

function compareValues(a: any, b: any) {
    if (isEmpty(a) && isEmpty(b)) return true;
    return areEquals(a, b);
}


export type IFormEvent =
    'mount'
    | 'unmount'
    | 'submit'
    | 'onValid'
    | 'onInvalid'
    | 'noValidate'
    | 'validationStatusChanged';

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