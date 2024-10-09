
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
  
  /**
 * @interface
 * A base interface for defining a resource in the application.
 *
 * A **resource** is an entity that holds data and can be referenced, displayed, or manipulated
 * by the system. This interface provides the basic structure for a resource, defining key properties
 * such as `name`, `label`, `title`, and `tooltip`.
 *
 * @typeParam Datatype - An optional type representing the data that this resource holds. Defaults to `any`.
 */
  interface ResourceBase<DataType=any>{}
}

/**
   @interface The ResourceBase interface represents the base structure for a resource in the application. 
    A resource is a fundamental concept often used to describe an entity or object that can be managed, manipulated, or stored within 
    the system. It typically refers to data objects like database tables, API endpoints, or any entities (like users, posts, or products) that the application deals with. 
    Each resource usually has attributes such as a name, label, or title.
 * A **resource** can also be seen as an entity that contains data and can be referenced, displayed or manipulated
 * by the system.\n
 * this is a base interface for defining a resource in the application.
 * Common examples of resources are users, products, or database tables.
 * This interface provides the basic structure for a resource by defining key properties
 * such as `name`, `label`, and `title`, which are used for internal reference and UI display.
 *
 * @typeParam Datatype - An optional type representing the data that this resource holds. Defaults to `any`.
 */
  export class ResourceBase<Datatype = any> {
        /**
         * The internal name of the resource.
         *
         * This name is used within the system for referencing the resource programmatically.
         * It is often a short, unique identifier for the resource.
         * 
         * @example
         * ```typescript
         * const userResource: ResourceBase = { name: "user" };
         * ```
         */
        name?: string;
      
        /**
         * A user-friendly label for the resource.
         *
         * This is typically a shorter name intended for display in UI elements, such as dropdowns or buttons.
         * It helps users identify the resource within the user interface.
         *
         * @example
         * ```typescript
         * const productResource: ResourceBase = { label: "Product" };
         * ```
         */
        label?: string;
      
        /**
         * A descriptive title for the resource.
         *
         * The title provides a more detailed or contextual label for the resource, which is often displayed
         * in prominent places like headings or page titles. It helps users understand the purpose of the resource.
         *
         * @example
         * ```typescript
         * const orderResource: ResourceBase = { title: "Order Management" };
         * ```
         */
        title?: string;
        
      /**
       * A short text that appears when the user hovers over the resource.
       * The tooltip provides additional context or information about the resource.
       * 
       * Typically used in user interfaces to clarify what a particular resource represents or to give instructions.
       *
       * @example
       * ```typescript
       * const userResource: ResourceBase = { tooltip: "This resource manages user information." };
       * ```
       */
      tooltip?: string;
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



