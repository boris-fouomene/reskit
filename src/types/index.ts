
      

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

type IFieldMapBase = {
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
};
/**
     * IFieldMap interface represents a map of field types to their corresponding IFieldBase instances.
     */
  export type IFieldMap = Omit<IFieldMapBase,keyof IFieldMapExport> & IFieldMapExport;

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
export type IField<T extends (keyof IFieldMap | object)  = keyof IFieldMap | object> = T extends keyof IFieldMap 
    ? (Omit<IFieldBase, keyof IFieldMap[T] | "type"> & Omit<IFieldMap[T], 'type'> & { type: T })
    : (Omit<IFieldBase, keyof T> & T);
    

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


/**
 * Represents a generic dictionary type.
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
 * Represents a type for all resource names.
 *  This type is a union of all possible resource names.
 * ```typescript
   declare module "@restkit/reskit-core"{
      type IResourcesNames = 'resource1' | 'resource2' | 'resource3';
   }
 * ```
 * This means that any variable or property with type `IResourcesNames` can only hold 
 * one of the values 'resource1', 'resource2', or 'resource3'.
 * Here are some examples of using this type:
 * 
 * ```typescript
 * let resourceName: IResourcesNames = 'resource1'; // valid
 * let anotherResourceName: IResourcesNames = 'resource2'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 * ```
 */
export type IResourcesNames = IAllResourcesNames;


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
export type fields = Record<string,IField>;

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
export type IResourceInstance<DataType=any> = IResource<DataType> & {
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
  type IFieldMapExport = {}
  
  
  /**
   A global declaration for all resource names. this is the exported name of the IResourcesNames type.
 * Represents a type for all resource names.
 *  This type is a union of all possible resource names.
 * ```typescript
     declare module "@restkit/reskit-core"{
        type IAllResourcesNames = 'resource1' | 'resource2' | 'resource3';
     }
 * ```
 * This means that any variable or property with type `IResourcesNames` can only hold 
 * one of the values 'resource1', 'resource2', or 'resource3'.
 * Here are some examples of using this type:
 * 
 * ```typescript
 * let resourceName: IResourcesNames = 'resource1'; // valid
 * let anotherResourceName: IResourcesNames = 'resource2'; // valid
 * let invalidResourceName: IResourcesNames = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourcesNames'.
 * ```
 */
  type IAllResourcesNames = "";
  
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
 interface IResource<Datatype = any> {}
}


/**
 * A type that represents a constructor function that can be instantiated with any number of arguments.
 */
export type IConstructor = new (...args: any[]) => {};