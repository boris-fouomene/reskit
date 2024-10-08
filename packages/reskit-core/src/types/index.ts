
declare global {
  /**
   * IFieldBase interface represents a base field with optional type, label, and name properties.
   * The type property defaults to "text" if not specified.
   * 
   * @template FieldType - The type of the field, defaults to "text"
   */
  interface IFieldBase<FieldType = "text"> {}

  /**
     * IFieldMap interface represents a map of field types to their corresponding IFieldBase instances.
  */
  interface IFieldMap {}
}

/**
 * IFieldBase interface represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template FieldType - The type of the field, defaults to "text"
 */
export interface IFieldBase<FieldType = "text"> {
    /**
     * The type of the field
     */
    type?: FieldType;
    /**
     * The label of the field
     */
    label?: string;
    /**
     * The name of the field
     */
    name?: string;
    
    /***
    * The name of the field in datatable
    */
    databaseName ?: string;
    
    /*** the name of the field in her table or collection in datatabse */
    databaseTableName?: string;
}

/**
     * IFieldMap interface represents a map of field types to their corresponding IFieldBase instances.
     */
  export interface IFieldMap {
      /**
       * A text field
       */
      text: IFieldBase<string>;
      /**
       * A number field
       */
      number: IFieldBase<number>;
      /**
       * A date field
       */
      date: IFieldBase<"date">;
      /**
       * A datetime field
       */
      datetime: IFieldBase<"datetime">;
      
      /***
      * A time field
      */
      time : IFieldBase<"time">;
}

/**
 * The `IField` type represents a field with customizable properties.
 * 
 * It uses a conditional type to define the structure based on the generic type `T`.
 * 
 * @template T - The type of the field. Defaults to `any`.
 * 
 * - If `T` is a key of `IFieldMap`, it constructs a type by omitting keys from `IFieldBase` 
 *   and merging with the mapped type from `IFieldMap`, ensuring the `type` field is included.
 * 
 * - If `T` is an object, it omits overlapping keys from `IFieldBase` and merges the object type `T`.
 * 
 * - If none of the above conditions apply, it defaults to `IFieldBase<T>`.
 * 
 * @example
 * // For a field type 'text', it uses the mapped type in `IFieldMap`:
 * const textField: IField<'text'> = { type: 'text', label: 'Name' };
 * 
 * // For custom field types, it can accept objects:
 * const customField: IField<{ label: string; required: boolean }> = { label: 'Name', required: true };
 */
export type IField<T = any> = T extends keyof IFieldMap 
    ? (Omit<IFieldBase, keyof IFieldMap[T] | "type"> & Omit<IFieldMap[T], 'type'> & { type: T })
    : T extends object 
        ? (Omit<IFieldBase, keyof T> & T) 
        : IFieldBase<T>;

/**
* Merges two object types, excluding properties from the first type 
* that are also present in the second type.
* 
* This type will include all properties of the first type `T` 
* except those keys that are present in the second type `U`, 
* and it will include all properties from `U`.
* 
* If there are overlapping properties, the properties from `U` 
* will override those in `T`.
* 
* @typeParam T - The first object type, from which properties are 
* omitted.
* @typeParam U - The second object type, whose properties are included 
* and may override properties in `T`.
* 
* @returns A new type that is a combination of `T` and `U`, with 
* properties from `U` taking precedence over those from `T`.
*/
export type IMerge<T extends object, U = any> = Omit<T, keyof U> & U;



export type IDict<K extends keyof any = any, T = any> = Record<K, T>;