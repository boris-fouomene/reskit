"use client";
import "./types";
import { cn, getTextContent, ObservableComponent, useStateCallback } from "@utils/index";
import { IFieldType, IField, IFields, } from "@resk/core/resources";
import { IValidatorRule, IValidatorValidateOptions, Validator, } from "@resk/core/validator";
import { InputFormatter } from "@resk/core/inputFormatter";
import { defaultStr, extendObj, areEquals, isEmpty, isNonNullString, isObj, stringify } from "@resk/core/utils";
import { Logger } from "@resk/core/logger";
import { IFormEvent } from "./types";
import { createRef, ReactNode, isValidElement, useId, useRef, useMemo, useCallback, useEffect } from 'react';
import { View as RNView, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { FormsManager } from "./FormsManager";
import { ITextInputProps } from "@components/TextInput/types";
import KeyboardEventHandler, { IKeyboardEventHandlerEvent, IKeyboardEventHandlerProps } from "@components/KeyboardEventHandler";
import { HelperText } from "@components/HelperText";
import { IKeyboardEventHandlerKey } from "@components/KeyboardEventHandler/keyEvents";
import { IClassName, IOnChangeOptions } from "@src/types";
import stableHash from 'stable-hash';
import { TextInput } from "@components/TextInput";
import { Text } from "@html/Text";
import { commonVariant } from "@variants/common";
import { typedEntries } from "@resk/core/build/utils/object";
import { Auth, IAuthPerm } from "@resk/core/auth";
import { IObservable, observableFactory } from "@resk/core/observable";
import { IHtmlDivProps } from "@html/types";


export class Field<Type extends IFieldType = IFieldType, ValueType = any> extends ObservableComponent<IField<Type>, IFormFieldState<Type, ValueType>, IFormEvent> {

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
    readonly wrapperRef = createRef<RNView>();
    /** 
     * Reference to the field component.
     * 
     * @private
     * @type {any}
     */
    _fieldRef: any;

    constructor(props: IField<Type>) {
        super(props);
        const value = this.sanitizeValue(props.defaultValue);
        this.state = {
            error: false,
            hasPerformedValidation: false,
            isEditable: false,
            value,
            prevValue: value,
            isDisabled: false,
        } as Readonly<IFormFieldState<Type, ValueType>>;
        this.validate({ value: this.state.value }).catch((e) => { });
    }
    componentDidUpdate(prevProps: IField<Type>): void {
        if (!this.compareValues(prevProps.defaultValue, this.props.defaultValue)) {
            this.validate({ value: "defaultValue" in this.props ? this.props.defaultValue : this.state.value }, true).catch((e) => { });
        }
    }

    compareValues(a: any, b: any): boolean {
        return compareValues(a, b);
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

    getField<Type extends IFieldType = IFieldType, ValueType = any>(fieldName: string): Field<Type, ValueType> | null {
        return FormsManager.getField<Type>(this.getFormName(), fieldName) as any;
    }
    isEmail() {
        return defaultStr(this.getType()).toLowerCase().trim() === "email";
    }
    isPhone() {
        return ["tel", "phone"].includes(defaultStr(this.getType()).toLowerCase().trim());
    }
    /***
        A mutator function that is called to mutate the options to use in the validation process.
        @param {IFormFieldValidatorOptions<Type>} options - The validation options.
    */
    protected onChangeOptionsMutator(options: IFormFieldValidatorOptions<Type, ValueType>) {
        return options;
    }
    getCallOptions<T>(options: T): T & { context: Field<Type, ValueType> } {
        return Object.assign({}, options, { context: this });
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
    validate(options: IFormFieldValidatorOptions<Type, ValueType>, force: boolean = false): Promise<IFormFieldValidatorOptions<Type>> {
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
                    } as any,
                    () => {
                        if (!areValueEquals) {
                            this.callOnChange(options as IFormFieldOnChangeOptions);
                        }
                    }
                );
                return options;
            });
        }
        options.rules = Array.isArray(options.rules) && options.rules.length ? options.rules : this.getValidationRules();
        if (this.isEmail() && this.props.validateEmail !== false && isNonNullString(options.value) && !options.rules.includes("email")) {
            options.rules.push("email");
        }
        if (this.props.validatePhoneNumber !== false && this.isPhone() && isNonNullString(options.value) && options.value.length > 4 && !options.rules.includes("phoneNumber")) {
            options.rules.push("phoneNumber");
        }
        if (this.getType() == "url" && options.value && !options.rules.includes("url")) {
            options.rules.push("url");
        }
        const hasPerformedValidation = true;
        return Promise.resolve(this.beforeValidate(options)).then(() => {
            return new Promise((resolve, reject) => {
                return Validator.validate<Field<Type, ValueType>>(options).then(() => {
                    return Promise.resolve(this.onValidate(options)).then(() => {
                        this.setState(
                            {
                                error: false,
                                hasPerformedValidation,
                                validatedValue: value,
                                value,
                                prevValue: this.state.value,
                                errorText: "",
                            } as any,
                            () => {
                                this.getForm()?.toggleValidationStatus();
                                this.callOnChange(options as IFormFieldOnChangeOptions);
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
                        } as any,
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
        return this.props.validateOnBlur !== false;
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
            rules.unshift("required");
        }
        ["minLength", "length", "maxLength"].map((r: string) => {
            const k: keyof IField<Type> = r as keyof IField<Type>;
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
    getType(): string {
        return defaultStr(
            (this.isFilter() && (this.props as any)?.filter?.type) || undefined,
            this.props.type,
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
    callOnChange(options: IFormFieldOnChangeOptions) {
        if (this.compareValues(this.state.value, this.state.prevValue)) {
            return;
        }
        options.prevValue = this.state.prevValue;
        options.value = this.state.value;
        options.context = this;
        options.fieldName = this.getName();
        if (this.props.onChange) {
            this.props.onChange(options as any);
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
                    form.props.onValidateField(options as any);
                }
            }
        };
        if (typeof this.props.onValidate == "function") {
            const r = this.props.onValidate(options as any);
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
        } else if (this.props.onValidate) {
            Logger.error(
                this.props.onValidate,
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
                form.props.onNoValidateField(options as any);
            }
        }
        if (this.props.onNoValidate) {
            return this.props.onNoValidate(options as any);
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
        return getTextContent(this.props.label || this.props.label || this.getName());
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
        return !!this.props?.isFilter || !!this.props?.isFilter;
    }
    /**
     * Checks if the field is a filter group item.
     * 
     * @returns {boolean} - Returns true if the field is a filter group item, otherwise false.
     * 
     * @example
     * const isFilterGroupItem = this.isFilterGroupItem(); // Checks if the field is a filter group item
     */
    isFilterGroupItem(): boolean {
        return this.props?.isFilterGroupItem || !!this.props?.isFilterGroupItem;
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
        this.setState({ isDisabled: true } as IFormFieldState);
    }
    /**
     * Enables the field.
     * 
     * @example
     * this.enable(); // Enables the field
     */
    enable() {
        this.setState({ isDisabled: false } as IFormFieldState);
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
        return this.validate(options).then((r) => {
            return r;
        }).catch((e) => {
            return e;
        });
    }

    _render(props: IField<Type>, innerRef?: any): ReactNode {
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

    getForm<Context>(): IFormContext<Context> | null {
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
        if (this.props.onMount) {
            this.props.onMount(this as any);
        }
    }
    componentWillUnmount(): void {
        super.componentWillUnmount();
        this.triggerUnmount();
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
            ? this.props.renderSkeleton(this)
            : null;
        return isValidElement(ret) ? (ret) : (
            <>
                <Text children={this.props.label} />
            </>
        );
    }
    protected overrideProps(props: IField<Type, ValueType>): IField<Type, ValueType> {
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
            containerProps,
            formName,
            responsive,
            isFilter: cIsFilter,
            visible,
            ...rest
        } = this.overrideProps(this.props as IField<Type, ValueType>);
        const isFilter = this.isFilter() || cIsFilter;
        if (isFilter) {
            if ((rest as any).rendable === false) return null;
        }
        const visibleClassName = !this.isFilter() && visible === false ? commonVariant({ hidden: true }) : "";
        const disabled = rest.disabled || this.isDisabled();
        const readOnly = rest.readOnly || this.isFormSubmitting();
        const errorText = this.getErrorText();
        const onBlur = (rest as ITextInputProps).onBlur;
        const isLoading = this.isFormLoading();
        const canValidate = this.canValidate() && rest.displayErrors !== false;
        const canShowErrors = this.canDisplayError();
        return (
            <KeyboardEventHandler
                {...containerProps}
                testID={"resk-form-field-container-" + this.getName()}
                innerRef={this.wrapperRef}
                handleKeys={this.isFilter() ? [] : this.getKeyboardEvents(containerProps)}
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
                                        onChange: (options: IFormFieldOnChangeOptions) => {
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

    static registerComponent(type: IFieldType, component: typeof Field) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = Field.getRegisteredComponents();
        (components as any)[type] = component;
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
        return isObj(components) ? components : {} as any;
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




/******************* Form Implementation  ******************/

export function Form<Context = unknown>({ name, fields, context, onSubmit, renderSkeleton, isLoading, disabled, beforeSubmit: customBeforeSubmit, onKeyboardEvent, onEnterKeyPress, prepareField, readOnly, header, isEditingData, data: customData, ...props }: IFormProps<Context>) {
    const generatedId = useId();
    isLoading = !!isLoading;
    const [isSubmitting, setIsSubmitting] = useStateCallback<boolean>(false);
    const formName = useMemo(() => {
        return defaultStr(name, "form-" + generatedId);
    }, [name, generatedId]);
    const data = useMemo(() => {
        return isObj(customData) ? customData : {};
    }, [customData]);
    const { fields: prePreparedFields, primaryKeys } = useMemo(() => {
        const preparedFields: IFields = {} as IFields;
        const primaryKeys: string[] = [];
        if (fields && isObj(fields)) {
            typedEntries(fields).map(([name, _field]) => {
                if (!_field || !isObj(_field) || _field.rendable === false) return;
                if (_field.perm !== undefined && !Auth.isAllowed(_field.perm)) return;
                const field = Object.clone(_field);
                delete field.rendable;
                field.name = defaultStr(field.name, name);
                if (field.primaryKey === true) {
                    primaryKeys.push(name);
                }
                preparedFields[field.name] = field;
            })
        }
        return { fields: preparedFields, primaryKeys };
    }, [formName, fields]);
    const isUpdate = useMemo(() => {
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
    }, [data, isEditingData, primaryKeys]);
    const { preparedFields, renderableFields } = useMemo(() => {
        const preparedFields: IFields = {} as IFields;
        const renderableFields: IField[] = [];
        typedEntries(prePreparedFields).map(([name, field]) => {
            if (isObj(field.createOrUpdate)) {
                extendObj(field, field.createOrUpdate);
            }
            if (isUpdate && isObj(field.update)) {
                extendObj(field, field.update);
            } else if (!isUpdate && isObj(field.create)) {
                extendObj(field, field.create);
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
            if (typeof prepareField == "function") {
                const prepared = prepareField({
                    fields: preparedFields,
                    isUpdate,
                    field,
                    data,
                });
                if (!isObj(prepared)) return;
                preparedFields[name] = prepared;
                renderableFields.push(prepared);
            }
        });
        return { preparedFields, renderableFields };
    }, [disabled, readOnly, isUpdate, data, stableHash(prepareField)]);
    const contextRef = useRef<{
        isSubmitting: boolean, fieldsInstances: Record<string, Field>, data: IFormData,
        isLoading: boolean, primaryKeys: string[], isUpdate: boolean, errors: string[],
    }>({
        isSubmitting,
        fieldsInstances: {},
        data,
        isLoading,
        primaryKeys,
        isUpdate,
        errors: [],
    });
    contextRef.current.isSubmitting = isSubmitting;
    contextRef.current.data = data;
    contextRef.current.isLoading = isLoading;
    contextRef.current.primaryKeys = primaryKeys;
    contextRef.current.isUpdate = isUpdate;
    const formRef = useRef<IFormContext | null>(null);
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
    const form = useMemo<IFormContext<Context>>(() => {
        const isValid = () => {
            const fields = contextRef.current.fieldsInstances;
            contextRef.current.errors = [];
            if (isObj(fields)) {
                for (let j in fields) {
                    const f = fields[j];
                    if (f instanceof Field && !f.isValid()) {
                        contextRef.current.errors.push(`[${getTextContent(f.getLabel())}] : ${defaultStr(f.getErrorText())}`);
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
                if (!FormsManager.isField(field)) continue;
                const fName: string = field.getName(), fValue = field.isValid() ? field.getValidValue(data) : field.getValue();
                data[fName] = fValue;
                if (fValue === undefined) {
                    delete data[fName];
                }
            }
            return data;
        }
        const getErrors = () => Array.isArray(contextRef.current.errors) ? contextRef.current.errors : [];
        const getErrorText = () => getErrors().join("\n") || "";
        const form = observableFactory<IFormEvent, IForm & Context>(Object.assign({}, context, {
            isValid,
            getData,
            getName: () => formName,
            getErrors,
            getErrorText,
            isEditing: () => contextRef.current.isUpdate,
            isSubmitting: () => contextRef.current.isSubmitting,
            getPrimaryKeys: () => contextRef.current.primaryKeys,
            getFields: () => contextRef.current.fieldsInstances,
            isLoading: () => contextRef.current.isLoading,

            submit: () => {
                if (!isValid()) {
                    const message = getErrorText();
                    const fields = contextRef.current.fieldsInstances;
                    return Promise.reject(new Error(message));
                }
                return new Promise((resolve, reject) => {
                    const data = getData();
                    const { isUpdate, primaryKeys } = contextRef.current;
                    const options: IFormSubmitOptions<Context> = {
                        data,
                        isUpdate,
                        form: formRef.current as any,
                    };
                    const onSubmit = typeof onSubmitRef.current == "function" ? onSubmitRef.current : (options: IFormSubmitOptions<Context>) => options;
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
        }));
        formRef.current = form;
        return form;
    }, [formName, context]);
    useEffect(() => {
        return () => {
            form?.offAll?.();
        }
    }, [form]);
    const handleKeyboardEvent = useCallback(function (options: IFormKeyboardEventHandlerOptions) {
        options = Object.assign({}, options);
        options.formData = form.getData();
        options.form = form;
        if (typeof onKeyboardEvent == "function") {
            onKeyboardEvent(options);
        }
        if (options?.key === "enter" && form.isValid()) {
            if (typeof onEnterKeyPress == "function" && onEnterKeyPress(options) === false) {
                return;
            }
            form.submit();
        }
    }, [onKeyboardEvent, onEnterKeyPress]);
    const skeleton = useMemo(() => {
        return isLoading && typeof renderSkeleton == "function" ? renderSkeleton(form) : null;
    }, [form, isLoading])
    const headerContent = useMemo(() => {
        if (isLoading) return null;
        const h = typeof header == "function" ? header() : header;;
        return isValidElement(h) ? h : null;
    }, [header, isLoading]);
}

interface IForm {
    getName(): string;
    isValid(): boolean;
    isEditing(): boolean;
    getData(): IFormData;
    getFields(): Record<string, Field>;
    isSubmitting(): boolean;
    getPrimaryKeys(): string[];
    isLoading(): boolean;
    submit(): Promise<any>;
    isValid(): boolean;
    getErrors(): string[];
    getErrorText(): string;
}

export type IFormContext<Context = unknown> = IObservable<IFormEvent, IForm & Context>;

export interface IFormKeyboardEventHandlerOptions {
    key: IKeyboardEventHandlerKey;
    event: IKeyboardEventHandlerEvent;
    formData: IFormData;
    form: IFormContext;
    isFormField?: boolean;
    value?: any;
};




export interface IFormProps<Context = unknown> extends Omit<IHtmlDivProps, "children" | "ref"> {

    context?: Context;

    renderSkeleton?: (context: IFormContext<Context>) => ReactNode;

    prepareField?: (options: {
        field: IField;
        isUpdate: boolean;
        fields: IFields;
        data: IFormData;
    }) => IField;
    data?: IFormData;

    perm?: IAuthPerm;

    beforeSubmit?: (options: IFormSubmitOptions<Context>) => any;

    onSubmit?: (options: IFormSubmitOptions<Context>) => any;

    name?: string;

    onValidate?: (options: IFormFieldValidatorOptions) => any;

    onNoValidate?: (options: IFormFieldValidatorOptions) => any;

    onValidateField?: (options: IFormFieldValidatorOptions) => any;


    onNoValidateField?: (options: IFormFieldValidatorOptions) => any;


    keyboardEvents?: IKeyboardEventHandlerKey[];

    onEnterKeyPress?: (options: IFormKeyboardEventHandlerOptions) => any;

    onKeyboardEvent?: (options: IFormKeyboardEventHandlerOptions) => any;

    fields?: IFields;


    isEditingData?: (options: {
        data: IFormData;
        primaryKeys: string[];
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
};

export interface IFormFieldValidatorOptions<Type extends IFieldType = IFieldType, ValueType = any> extends IValidatorValidateOptions<Array<any>, Field<Type, ValueType>> {
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

export type IFormFieldState<FielType extends IFieldType = IFieldType, ValueType = any> = Partial<IField<FielType, ValueType>> & {
    error: boolean;
    isEditable: boolean;
    isDisabled: boolean;
    validatedValue?: ValueType;
    hasPerformedValidation?: boolean;
    value: ValueType;
    prevValue?: ValueType;
    errorText: string;
    formTriedTobeSubmitted?: boolean;
}


export interface IFormData extends Record<any, any> { }

export interface IFormSubmitOptions<Context = unknown> {
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
     * const options: IFormSubmitOptions = {
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

    form: IFormContext<Context
};

export interface IFormFieldOnChangeOptions<FieldType extends IFieldType = IFieldType, ValueType = any> extends IOnChangeOptions {

    context: Field<FieldType>;

    prevValue: ValueType;
};



export function AttachFormField<Type extends IFieldType = IFieldType>(type: Type) {
    return (target: typeof Field<Type>) => {
        Field.registerComponent(type, target as typeof Field);
    };
}

function compareValues(a: any, b: any) {
    if (isEmpty(a) && isEmpty(b)) return true;
    return areEquals(a, b);
}

FormsManager.isFieldInstance = (field: any) => {
    return field instanceof Field;
}


declare module "@resk/core/resources" {
    export interface IFieldBase<FieldType extends IFieldType = IFieldType, ValueType = any> {
        getValidValue?: (options: { value: any; context: Field<FieldType, ValueType>; data: IFormData }) => any;
        isFilter?: boolean;
        isFilterGroupItem?: boolean;

        validateOnMount?: boolean;

        validateOnBlur?: boolean;
        validationRules?: IValidatorRule[];

        data?: IFormData;

        responsive?: boolean;

        onValidate?: (options: IFormFieldValidatorOptions<FieldType>) => any;

        onNoValidate?: (options: IFormFieldValidatorOptions<FieldType>) => any;

        containerProps?: IKeyboardEventHandlerProps;

        formName?: string;

        onChange?: (options: IFormFieldOnChangeOptions<FieldType>) => void;

        errorText?: string;

        error?: boolean;

        isLoading?: boolean;
        isFormLoading?: boolean;

        isFormSubmitting?: boolean;
        renderSkeleton?: (context: Field<FieldType, ValueType>) => ReactNode;

        onMount?: (context: Field<FieldType, ValueType>) => any;

        onUnmount?: (context: Field<FieldType, ValueType>) => any;

        displayErrors?: boolean;

        validateEmail?: boolean;

        validatePhoneNumber?: boolean;

        windowWidth?: number;

        label?: ReactNode;
    }
}