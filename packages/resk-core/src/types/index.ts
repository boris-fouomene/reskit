/**
 * Represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template FieldType - The type of the field, defaults to "text"
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
 */
export interface IFieldBase<FieldType = "text"> {
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
  type?: FieldType;

  /**
   * The label of the field.
   * 
   * @description
   * This property specifies the label or display text for the field.
   * 
   * @example
   * ```typescript
   * const textField: IFieldBase = {
   *   label: 'Text Field'
   * };
   * ```
   */
  label?: string;

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
      declare module "@resk/core" {
      interface IResourcesNamesMap {
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
export interface IFieldMap {
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
  text: IFieldBase<"text">;

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
  number: IFieldBase<"number">;

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
  email: IFieldBase<"email">;
}

/**
 * @interface 
 The `IField` type represents a field with customizable properties.
 * 
 * It uses a conditional type to define the structure based on the generic type `T`.
 * 
 * @template T - The type of the field. Defaults to `any`.
 * 
 * @description
 * This type allows for flexible field definitions by leveraging TypeScript's conditional types.
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
export type IField<T extends IFieldMapKeys = "text"> = T extends keyof IFieldMap ? (Omit<IFieldBase, keyof IFieldMap[T] | "type"> & Omit<IFieldMap[T], 'type'> & { type: T }) : (Omit<IFieldBase, keyof T> & T);
      
      
/**
   @interface
 * Represents the keys of the `IFieldMap` or `IFieldBase`.
 * 
 * @description
 * This type is a union of all possible keys that can be used to define fields,
 * allowing for a flexible and extensible field mapping.
 */
export type IFieldMapKeys = keyof IFieldMap | object;

/**
* @interface
  Merges two object types, excluding properties from the first type 
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


/**
 * @interface
   Represents a generic dictionary type.
 *
 * @typedef {Object} IDict
 *
 * @template K - The type of the dictionary keys (defaults to `keyof any`).
 * @template T - The type of the dictionary values (defaults to `any`).
 *
 * @description
 * A generic dictionary type that can be used to represent a collection of key-value pairs.
 * The key type `K` defaults to `keyof any`, which means it can be any type that can be used as a key in an object.
 * The value type `T` defaults to `any`, which means it can be any type.
 *
 * @example
 * // Create a dictionary with string keys and number values
 * const dict: IDict<string, number> = {
 *   'one': 1,
 *   'two': 2,
 *   'three': 3
 * }
 *
 * @example
 * // Create a dictionary with number keys and string values
 * const dict: IDict<number, string> = {
 *   1: 'one',
 *   2: 'two',
 *   3: 'three'
 * }
 */
export type IDict<K extends keyof any = any, T = any> = Record<K, T>;


/**
 * @interface
  Represents a type for all resource names.
  The IResourcesNames type is defined as the union of all keys in the IResourcesNamesMap object. 
  This means that IResourcesNames can only take on values that are present as keys in IResourcesNamesMap.
 * Here are some examples of using this type:
 *```ts
  import "@resk/core";
  declare module "@resk/core"{
      interface IResourcesNamesMap {
        resource1: any;
        resource2: any;
        resource3: any;
      }
  }
 * let resourceName: IResourcesNames = 'resource1'; // valid
 * let anotherResourceName: IResourcesNames = 'resource2'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 ```
 */
export type IResourcesNames = keyof IResourcesNamesMap;

/**
 * A global declaration for all resource names. This is the exported name of the IResourcesNames type.
 * Represents a type for all resource names.
 * This type is a union of all possible resource names.
 * 
 * @description
 * This interface serves as a map for all resource names.
 * 
 * @example
 * ```typescript
  import "@resk/core";
 * declare module "@resk/core" {
 *   interface IResourcesNamesMap {
 *     users?: string;
       roles?:any;
       sales?:any;
 *   }
 * }
 * ```
 * This means that any variable or property with type `IResourcesNames` can only hold 
 * one of the values 'users', 'roles', or 'sales'.
 * 
 * @example
 * ```typescript
 * let resourceName: IResourcesNames = 'users'; // valid
 * let anotherResourceName: IResourcesNames = 'roles'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 * ```
 */
export interface IResourcesNamesMap {}

/**
   @interface The IResource interface represents the base structure for a resource in the application. 
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
  export interface IResource<Datatype = any> {
      /**
       * The internal name of the resource.
       *
       * This name is used within the system for referencing the resource programmatically.
       * It is often a short, unique identifier for the resource.
       * 
       * @example
       * ```typescript
       * const userResource: IResource = { name: "user" };
       * ```
       */
      name?: IResourcesNames;
    
      /**
       * A user-friendly label for the resource.
       *
       * This is typically a shorter name intended for display in UI elements, such as dropdowns or buttons.
       * It helps users identify the resource within the user interface.
       *
       * @example
       * ```typescript
       * const productResource: IResource = { label: "Product" };
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
       * const orderResource: IResource = { title: "Order Management" };
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
     * const userResource: IResource = { tooltip: "This resource manages user information." };
     * ```
     */
    tooltip?: string;
}

/**
 * A type representing an instance of a class that extends `IResource`.\n
 * This allows us to dynamically handle resource instances with generic types.
 *
 * @typedef {Object} IResourceInstance
 *
 * @template DataType - The specific data's type of `IResource` being instantiated (defaults to `IResource`).
 * @example
 * const userResourceInstance: IResourceInstance<UserDataType> = new UserResource({name:"users",label:"List of users"});
 *
 * @description
 * A type that represents a resource instance, which is a constructor function that returns an object.
 * The constructor function take  an options object as an argument, which is used to configure the resource instance.
 * If `DataType` is not specified, it defaults to `any`.
 *
 * @example
 * // Create a resource instance type that extends a custom resource base
 * class CustomIResource implement IResourceInstance<CustomIResource<CustomerDataType>> {
 *   // ...
 * }
 */
export interface IResourceInstance<DataType=any> extends IResource<DataType> {
   /**
   * A type that represents a map of field names to their corresponding IField instances.
     @description this is the list of fields that are part of the resource.  Fields are created using the @Field decorator when resources are defined.
   */
     fields ?: Record<string,IField>;
    
   /**
   * Returns the list of fields for the resource.
   *
   * @returns {Record<string, IField>} An object mapping property names to their corresponding field declaration
   * @example
   * ```typescript
   * class MyClass extends ResourceBase<DataType> {
   *   @Field({ type: 'string' }) myField: string;
   * }
   * const fields = new MyClass().getFields();
   * console.log(fields); // Output: { myField: { name: 'myField', type: 'string' } }
   * ```
   */
    getFields : ()=>Record<string,IField>;
    
    /**
     * Returns the field label for the resource.
       @returns  {string} The label of the resource.
    */
    getLabel : ()=> string;
    
    /**
     * Returns the field title for the resource;
     * @returns {string} The title of the resource
     */
    getTitle : ()=> string;

    /***
      Returns the field tooltip for the resource;
      @returns {string} The tooltip of the resource
    */
    getTooltip : ()=> string;
};

/**
 * A type that represents a constructor function that can be instantiated with any number of arguments.
 */
export type IConstructor = new (...args: any[]) => {};