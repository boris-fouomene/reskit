import { IAuthPerm } from "@/auth/types";
import { IResourceActionName, IResourceActionTupleObject } from "./resources";
import { IMergeWithoutDuplicates } from "./merge";

/**
 * Represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template IFieldType - The type of the field, defaults to "text"
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
export interface IFieldBase<FieldType extends IFieldType = IFieldType> extends Partial<IResourceActionTupleObject> {
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

    /***
     * The permission associated with the field. This permission is used to determine if the field will be rendered or not.
     */
    perm?: IAuthPerm;
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
export interface IFieldMap { }

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
 * @see {@link IFieldMap} for the `IFieldMap` type.
 */
export type IField<T extends IFieldType = IFieldType> = IFieldMap[T] & {
    [key in ("create" | "update" | "delete" | "list" | "form" | "filter")]?: Partial<IFieldMap[IFieldType]>;
};

/**
 * Record type representing a collection of fields, where each value
 * is a field of any type from the FullFieldMap.
 * 
 * @example
 * ```typescript
 * // Create a collection of fields with different types
 * const formFields: IFields = {
 *   username: {
 *     type: 'text',
 *     label: 'Username'
 *   },
 *   age: {
 *     type: 'number',
 *     label: 'Age',
 *     min: 18
 *   }
 * };
 * 
 * // TypeScript knows these are valid operations
 * console.log(formFields.username.type); // 'text'
 * console.log(formFields.age.min);       // 18
 * ```
 */
export type IFields = Record<string, IField>;

/**
 * Type guard to check if a field matches a specific type.
 * Helps with type narrowing when working with fields dynamically.
 * 
 * @example
 * ```typescript
 * // Using the type guard to narrow types
 * function renderField(field: IFieldBase) {
 *   if (isFieldType(field, 'select')) {
 *     // TypeScript knows field is a select field here
 *     return <SelectInput items={field.items} multiple={field.multiple} />;
 *   }
 *   if (isFieldType(field, 'number')) {
 *     // TypeScript knows field is a number field here
 *     return <NumberInput min={field.min} max={field.max} />;
 *   }
 * }
 * ```
 */
export function isFieldType<T extends IFieldType>(field: IFieldBase, type: T): field is IField<T> {
    return field.type === type;
}

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


/**
 * Helper function to create a type-safe field instance.
 * Provides autocomplete for properties based on the specified field type.
 * 
 * @example
 * ```typescript
 * // Create a text field with autocompletion for text-specific properties
 * const textField = createField('text', {
 *   label: 'Full Name',
 *   placeholder: 'Enter your name', // TypeScript suggests text field properties
 *   maxLength: 100
 * });
 * 
 * // Create a select field with autocompletion for select-specific properties
 * const countryField = createField('select', {
 *   label: 'Country',
 *   items: [  // TypeScript knows this is required for select fields
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ],
 *   multiple: true  // TypeScript suggests select field properties
 * });
 * 
 * // TypeScript would error on invalid properties
 * const invalidField = createField('text', {
 *   items: [] // Error: Property 'items' does not exist on text field
 * });
 * ```
 */
export function createField<T extends IFieldType>(type: T, props: Omit<IField<T>, 'type'>): IField<T> {
    return {
        type,
        ...props
    } as IField<T>;
}