import { IFieldBase } from "@resk/core";
import { ITextInputProps } from "@components/TextInput/types";
import { IDropdownOnChangeOptions, IDropdownProps } from "@components/Dropdown/types";
import { ISwitchProps } from "@components/Switch/types";
import { ICheckboxProps } from "@components/Checkbox/types";
import { IFormFieldOnChangeOptions, IFormFieldProps } from "../types";

declare module "@resk/core" {
    interface IFieldMap {
        switch: IFormFieldProps<any, ISwitchProps> & { type: "switch" };
        checkbox: IFormFieldProps<any, ICheckboxProps> & { type: "checkbox" };
        select: Omit<IDropdownProps, "onChange"> & IFormFieldProps<any, IDropdownOnChangeOptions>;
        /**
         * A text field.
         * 
         * @description
         * This property represents a text field, with a type of "text".
         * 
         * @example
         * ```typescript
         * const textField: IFieldBase<"text"> = {
         *   type: 'text',
         *   label: 'Text Field',
         *   name: 'textField'
         * };
         * ```
         */
        text: Omit<ITextInputProps, "type"> & { type: "text" };
        /**
         * A number field.
         * 
         * @description
         * This property represents a number field, with a type of "number".
         * 
         * @example
         * ```typescript
         * const numberField: IFieldBase<"number"> = {
         *   type: 'number',
         *   label: 'Number Field',
         *   name: 'numberField'
         * };
         * ```
         */
        number: Omit<ITextInputProps, "type"> & { type: "number" };

        /**
         * A date field.
         * 
         * @description
         * This property represents a date field, with a type of "date".
         * 
         * @example
         * ```typescript
         * const dateField: IFieldBase<"date"> = {
         *   type: 'date',
         *   label: 'Date Field',
         *   name: 'dateField'
         * };
         * ```
         */
        date: IFieldBase<"date">;

        /**
         * A datetime field.
         * 
         * @description
         * This property represents a datetime field, with a type of "datetime".
         * 
         * @example
         * ```typescript
         * const datetimeField: IFieldBase<"datetime"> = {
         *   type: 'datetime',
         *   label: 'Datetime Field',
         *   name: 'datetimeField'
         * };
         * ```
         */
        datetime: IFieldBase<"datetime">;

        /**
         * A time field.
         * 
         * @description
         * This property represents a time field, with a type of "time".
         * 
         * @example
         * ```typescript
         * const timeField: IFieldBase<"time"> = {
         *   type: 'time',
         *   label: 'Time Field',
         *   name: 'timeField'
         * };
         * ```
         */
        time: IFieldBase<"time">;

        /**
         * An email field.
         * 
         * @description
         * This property represents an email field, with a type of "email".
         * 
         * @example
         * ```typescript
         * const emailField: IFieldBase<"email"> = {
         *   type: 'email',
         *   label: 'Email Field',
         *   name: 'emailField'
         * };
         * ```
         */
        email: Omit<ITextInputProps, "type"> & { type: "email" };
    }
}