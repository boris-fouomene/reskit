import { ISwitchProps, IToggleableOnChangeOptions } from "@components/Switch/types";
import { IFormFieldOnChangeOptions } from "./index";
import { IDropdownOnChangeOptions, IDropdownProps } from "@components/Dropdown";
import { ITextInputProps } from "@components/TextInput/types";
import { IMergeWithoutDuplicates, IFieldBase } from "@resk/core/types";
import { ICheckboxProps } from "@components/Checkbox";


/**
 * @interface IFormFieldTextProps
 * Represents the properties for a text-based form field.
 * @template Type - The type of the form field.
 * @example
 * ```tsx
 * const textFieldProps: IFormFieldTextProps<"text"> = {
 *   type: "text",
 *   placeholder: "Enter your name",
 *   value: "John Doe"
 * };
 * ```
 */
export type IFormFieldTextProps<Type> = IFormFieldProps<Type, ITextInputProps>;

/**
 * Augments the `@resk/core` module with additional form field types and properties.
 * @module @resk/core
 */
declare module "@resk/core" {

    /**
     * Maps form field types to their respective properties.
     * @interface IFieldMap
     */
    export interface IFieldMap {
        /**
        * Properties for a switch form field.
        * @example
        * ```tsx
        * const switchField: IFieldMap["switch"] = {
        *   type: "switch",
        *   checked: true,
        *   onChange: (options) => console.log(options)
        * };
        * ```
        */
        switch: Omit<IFormFieldProps<"switch", ISwitchProps>, "onChange"> & { onChange?: (options: IFormFieldOnChangeOptions<"switch"> & Partial<IToggleableOnChangeOptions>) => void };

        /**
         * Properties for a checkbox form field.
         * @example
         * ```tsx
         * const checkboxField: IFieldMap["checkbox"] = {
         *   type: "checkbox",
         *   checked: false,
         *   onChange: (options) => console.log(options)
         * };
         * ```
         */
        checkbox: Omit<IFormFieldProps<"checkbox", ICheckboxProps>, "onChange"> & { onChange?: (options: IFormFieldOnChangeOptions<"checkbox"> & Partial<IToggleableOnChangeOptions>) => void };

        /**
         * Properties for a select dropdown form field.
         * @example
         * ```tsx
         * const selectField: IFieldMap["select"] = {
         *   type: "select",
         *   items : [{ label: "Option 1", value: "1" }, { label: "Option 2", value: "2" }],
         *   onChange: (options) => console.log(options)
         * };
         * ```
         */
        select: Omit<IFormFieldProps<"select", IDropdownProps>, "onChange"> & { onChange?: (options: IFormFieldOnChangeOptions<"select"> & Partial<IDropdownOnChangeOptions>) => void; };

        /**
         * Properties for a country select dropdown form field.
         * @example
         * ```tsx
         * const selectCountryField: IFieldMap["selectCountry"] = {
         *   type: "selectCountry",
         *   items : [{ label: "USA", value: "us" }, { label: "Canada", value: "ca" }],
         *   onChange: (options) => console.log(options)
         * };
         * ```
         */
        selectCountry: Omit<IFormFieldProps<"selectCountry", IDropdownProps>, "onChange"> & { onChange?: (options: IFormFieldOnChangeOptions<"select"> & Partial<IDropdownOnChangeOptions>) => void; };

        /**
         * Properties for a text input form field.
         * @type {IFormFieldTextProps<"text">}
         * @example
         * ```tsx
         * const textField: IFieldMap["text"] = {
         *   type: "text",
         *   placeholder: "Enter text",
         *   value: "Sample text"
         * };
         * ```
         */
        text: IFormFieldTextProps<"text">;

        /**
         * Properties for a number input form field.
         * @type {IFormFieldTextProps<"number">}
         * @example
         * ```tsx
         * const numberField: IFieldMap["number"] = {
         *   type: "number",
         *   placeholder: "Enter number",
         *   value: 123
         * };
         * ```
         */
        number: IFormFieldTextProps<"number">;

        /**
         * Properties for a date input form field.
         * @type {IFormFieldTextProps<"date">}
         * @example
         * ```tsx
         * const dateField: IFieldMap["date"] = {
         *   type: "date",
         *   placeholder: "Select date",
         *   value: "2025-03-15"
         * };
         * ```
         */
        date: IFormFieldTextProps<"date">;

        /**
         * Properties for a datetime input form field.
         * @type {IFormFieldTextProps<"datetime">}
         * @example
         * ```tsx
         * const datetimeField: IFieldMap["datetime"] = {
         *   type: "datetime",
         *   placeholder: "Select date and time",
         *   value: "2025-03-15T10:00"
         * };
         * ```
         */
        datetime: IFormFieldTextProps<"datetime">;

        /**
         * Properties for a time input form field.
         * @type {IFormFieldTextProps<"time">}
         * @example
         * ```tsx
         * const timeField: IFieldMap["time"] = {
         *   type: "time",
         *   placeholder: "Select time",
         *   value: "10:00"
         * };
         * ```
         */
        time: IFormFieldTextProps<"time">;

        /**
         * Properties for a telephone input form field.
         * @type {IFormFieldTextProps<"tel">}
         * @example
         * ```tsx
         * const telField: IFieldMap["tel"] = {
         *   type: "tel",
         *   placeholder: "Enter phone number",
         *   value: "+1234567890"
         * };
         * ```
         */
        tel: IFormFieldTextProps<"tel">;

        /**
         * Properties for a password input form field.
         * @type {IFormFieldTextProps<"password">}
         * @example
         * ```tsx
         * const passwordField: IFieldMap["password"] = {
         *   type: "password",
         *   placeholder: "Enter password",
         *   value: "password123"
         * };
         * ```
         */
        password: IFormFieldTextProps<"password">;

        /**
         * Properties for a email input form field.
         * @type {IFormFieldTextProps<"email">}
         * @example
         * ```tsx
         * const emailField: IFieldMap["email"] = {
         *   type: "email",
         *   placeholder: "Enter email",
         *   value: "john.doe@example"
         * };
         * ```
         */
        email: IFormFieldTextProps<"email">;

        /**
         * Properties for a url input form field.
         * @type {IFormFieldTextProps<"url">}
         * @example
         * ```tsx
         * const urlField: IFieldMap["url"] = {
         *   type: "url",
         *   placeholder: "Enter url",
         *   value: "https://example.com"
         * };
         * ```
         */
        url: IFormFieldTextProps<"url">;
    }
}

/**
* @interface IFormFieldProps
* Represents the properties for a form field component.
* @template FieldType - The type of the form field.
* @template ComponentProps - The properties of the component that is wrapped by the form field.
* @see {@link IFieldBase} for common form field properties.
* @see {@link IMergeWithoutDuplicates} for merging properties without duplicates.
* @example
* ```tsx
* const switchFieldProps: IFormFieldProps<"switch", ISwitchProps> = {
*   type: "switch",
*   checked: true,
*   onChange: (options) => console.log(options)
* };
* ```
*/
export type IFormFieldProps<FieldType, ComponentProps> = Omit<IMergeWithoutDuplicates<IFieldBase, ComponentProps>, "type"> & { type: FieldType; };


