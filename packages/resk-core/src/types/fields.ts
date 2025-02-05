import { IResourceActionName, IResourceActionTupleObject } from "./resources";

/**
 * Represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template FieldType - The type of the field, defaults to "text"
 * @extends IResourceActionTupleObject
 * 
 * @description
 * This interface serves as a base for all field types, providing common properties such as type, label, and name.
 * 
 * @example
 * ```typescript
 * const textField: IFieldBase = {
 *   type: 'text',
 *   label: 'Text Field',
 *   name: 'textField'
 * };
 * ```
 * @see {@link IResourceActionTupleObject} for the `IResourceActionTupleObject` type.
 * @see {@link IResourceActionName} for the `IResourceActionName` type.
 * @see {@link IResourceActionTupleObject} for the `IResourceActionTupleObject` type.
 */
export interface IFieldBase<FieldType extends IFieldType = any> extends Partial<IResourceActionTupleObject> {
    /**
     * The type of the field.
     * 
     * @description
     * This property specifies the type of the field, such as "text", "number", or "date".
     * 
     * @default "text"
     * 
     * @example
     * ```typescript
     * const textField: IFieldBase = {
     *   type: 'text'
     * };
     * ```
     */
    type: FieldType;

    /**
     * The name of the field.
     * 
     * @description
     * This property specifies the unique name or identifier for the field.
     * 
     * @example
     * ```typescript
     * const textField: IFieldBase = {
     *   name: 'textField'
     * };
     * ```
     */
    name?: string;

    /**
     * The name of the field in the database table.
     * 
     * @description
     * This property specifies the name of the field as it appears in the database table.
     * 
     * @example
     * ```typescript
     * const textField: IFieldBase = {
     *   databaseName: 'text_field'
     * };
     * ```
     */
    databaseName?: string;

    /**
     * The name of the field's table or collection in the database.
     * 
     * @description
     * This property specifies the name of the table or collection that contains the field in the database.
     * 
     * @example
     * ```typescript
     * const textField: IFieldBase = {
     *   databaseTableName: 'text_fields'
     * };
     * ```
     */
    databaseTableName?: string;

    /***
     * weatherr the field is a primary key or not
     */
    primaryKey?: boolean;

    /**
     * weatherr the field is rendable or not
     * It is used to determine if the field should be rendered or not.
     */
    rendable?: boolean;

    /***
     * weatherr the field is readonly or not
     */
    readOnly?: boolean;

    /**
     * weatherr the field is disabled or not
     */
    disabled?: boolean;

    /***
     * weatherr the field is unique for the resource or not
     */
    unique?: boolean;

    /**
     * weatherr the field is required or not
     */
    required?: boolean;

    /***
     * the min length of the field
     */
    minLength?: number;
    /**
     * the max length of the field
     */
    maxLength?: number;

    /**
     * the length of the field
     */
    length?: number;

    /***
     * whether the field is visible or not
     */
    visible?: boolean;

}




/**
 * Represents a map of field types to their corresponding IFieldBase instances.
 * 
 * @description
 * This interface serves as a mapping of field types to their respective IFieldBase instances, providing a way to access and manipulate fields of different types.
 * 
 * @example
 * ```typescript
 * const fieldMap: IFieldMap = {
 *   text: {
 *     type: 'text',
 *     label: 'Text Field',
 *     name: 'textField'
 *   },
 *   number: {
 *     type: 'number',
 *     label: 'Number Field',
 *     name: 'numberField'
 *   },
 *   // ...
 * };
 * ```
  @example 
  ```ts
      import "@resk/core";
      declare module "@resk/core" {
        interface IResources {
            users?:string;
        }
        interface IFieldMap {
            select : IFieldBase<"select"> & {
                items : string[]
            }
        }
    }
  ```
 */
export interface IFieldMap extends Record<string, IFieldBase> { }


/**
 * @type IField<T extends IFieldType = any>
 * @extends IFieldBase<T>
 * 
 * Represents a field with customizable properties in a form or data structure.
 * This type allows for flexible field definitions by leveraging TypeScript's conditional types.
 * 
 * ### Type Parameters
 * - **T**: The type of the field. Defaults to `"text"`. This parameter determines the specific field type 
 *   being defined, which can be one of the types specified in the `IFieldMap`.
 * 
 * ### Description
 * The `IField` type constructs a field definition by combining properties from the base field interface 
 * (`IFieldBase`) and the specific field type defined in the `IFieldMap`. It ensures that the `type` field 
 * is included and allows for additional properties such as `form` and `filter` to be specified.
 * 
 * ### Properties
 * - **form**: An optional property that allows nesting of fields, enabling complex data structures 
 *   that can represent forms with multiple layers of fields.
 *   - **Type**: `IField<any>`
 *   - **Example**:
 *     ```typescript
 *     const nestedField: IField<'text'> = {
 *         type: 'text',
 *         label: 'Nested Field',
 *         form: {
 *             type: 'number',
 *             label: 'Nested Number Field',
 *         }
 *     };
 *     ```
 * 
 * - **filter**: An optional property that allows for defining filter criteria for the field, 
 *   enabling dynamic filtering capabilities in data queries.
 *   - **Type**: `IField<any>`
 *   - **Example**:
 *     ```typescript
 *     const filterField: IField<'select'> = {
 *         type: 'select',
 *         label: 'Select Filter',
 *         filter: {
 *             type: 'text',
 *             label: 'Filter by Name',
 *         }
 *     };
 *     ```
 * 
 * ### Example Usage
 * Here’s how you might define a text field and a number field using the `IField` type:
 * 
 * ```typescript
 * const textField: IField<'text'> = {
 *     type: 'text',
 *     label: 'Username',
 *     required: true,
 *     minLength: 3,
 *     maxLength: 20,
 *     form: {
 *         type: 'text',
 *         label: 'Enter your username',
 *     }
 * };
 * 
 * const numberField: IField<'number'> = {
 *     type: 'number',
 *     label: 'Age',
 *     required: true,
 *     min: 0,
 *     max: 120,
 *     filter: {
 *         type: 'number',
 *         label: 'Filter by Age',
 *     }
 * };
 * ```
 * 
 * @remarks
 * - This type is particularly useful in applications that require dynamic form generation or 
 *   data structure definitions, allowing developers to create fields with varying properties 
 *   based on the context in which they are used.
 * - The `form` and `filter` properties allow for nesting of fields, enabling complex data 
 *   structures that can represent forms with multiple layers of fields or filters.
 * @see {@link IFieldBase} for the `IFieldBase` type.
 * @see {@link IFieldMap} for the `IFieldMap` type.
 */
export type IField<T extends IFieldType = any> = IFieldMap[T] & {
    [key in ("create" | "update" | "delete" | "list" | "form" | "filter")]?: Partial<IField>;
}

/**
 * @type IFields<T extends IFieldMap = any>
 * 
 * Represents a mapping of field definitions to their corresponding field details.
 * This type allows for the extraction of field types from a given field map, ensuring 
 * that each field is correctly typed according to its definition.
 * 
 * ### Type Parameters
 * - **T**: The type of the field map. Defaults to `IFieldMap`. This parameter determines 
 *   the specific mapping of field types to their definitions.
 * 
 * ### Structure
 * The `IFields` type constructs a new type by iterating over the keys of the provided 
 * field map `T`. For each key, it extracts the corresponding field type from `IFieldMap` 
 * and ensures that it matches the expected field instance type.
 * 
 * ### Properties
 * - **`[K in keyof T]`**: Iterates over each key `K` in the field map `T`.
 * - **`Extract<IFieldMap[T[K]["type"]], IField<T[K]["type"]>>`**: This expression extracts 
 *   the field type from `IFieldMap` based on the type defined in `T[K]`, ensuring that 
 *   the resulting type is compatible with the `IField` type for that specific field.
 * 
 * ### Example Usage
 * Here’s an example of how to define a fields mapping using the `IFields` type:
 * 
 * ```typescript
 * // Example field map definition
 * const fieldMap: IFieldMap = {
 *     text: {
 *         type: 'text',
 *         label: 'Username',
 *         name: 'username',
 *         required: true,
 *     },
 *     number: {
 *         type: 'number',
 *         label: 'Age',
 *         name: 'age',
 *         required: true,
 *     }
 * };
 * 
 * // Using the IFields type to create a strongly typed fields mapping
 * type MyFields = IFields<typeof fieldMap>;
 * 
 * // Example of using the MyFields type
 * const fields: MyFields = {
 *     text: {
 *         type: 'text',
 *         label: 'Username',
 *         name: 'username',
 *         required: true,
 *     },
 *     number: {
 *         type: 'number',
 *         label: 'Age',
 *         name: 'age',
 *         required: true,
 *     }
 * };
 * ```
 * 
 * ### Notes
 * - The `IFields` type is particularly useful for ensuring type safety when working with 
 *   collections of fields, allowing developers to define and manipulate fields in a 
 *   structured manner.
 * - By leveraging TypeScript's utility types, `IFields` provides a way to enforce 
 *   consistency across field definitions and their corresponding instances.
 * 
 * ### Related Types
 * - **`IFieldMap`**: The mapping of field types to their corresponding field definitions.
 * - **`IField`**: Represents a field with customizable properties in a form or data structure.
 */
export interface IFields extends Record<string, IField<keyof IFieldMap>> { }



/**
 * Represents the type of field keys that can be used within the `IFieldMap`.
 * This type is derived from the keys of the `IFieldMap` interface, ensuring that 
 * only valid field types can be referenced when defining fields in forms or data structures.
 *
 * @type IFieldType
 * 
 * @description
 * The `IFieldType` type serves as a union of string literals that correspond to the 
 * defined field types in the `IFieldMap`. This provides type safety and consistency 
 * when working with field definitions, preventing errors that may arise from using 
 * invalid field types.
 * 
 * @example
 * // Example of using IFieldType to define a field
 * const textFieldType: IFieldType = 'text'; // Valid
 * const numberFieldType: IFieldType = 'number'; // Valid
 * 
 * // Attempting to assign an invalid field type will result in a TypeScript error
 * // const invalidFieldType: IFieldType = 'invalidType'; // Error: Type '"invalidType"' is not assignable to type 'IFieldType'.
 * 
 * @remarks
 * This type is particularly useful in scenarios where fields are dynamically defined 
 * or when implementing features that require strict adherence to defined field types.
 * By using `IFieldType`, developers can ensure that only valid field types are used 
 * throughout the application, enhancing type safety and reducing runtime errors.
 */
export type IFieldType = keyof IFieldMap;