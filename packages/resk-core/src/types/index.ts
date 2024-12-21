import { IAuthPerm, IAuthUser } from "@/auth/types";
import { IFilterQuery, IFilterSort } from "./filters";
import { TranslateOptions } from "i18n-js";

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

  /***
   * weatherr the field is a primary key or not
   */
  primaryKey?: boolean;
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
        interface IResourceNameMap {
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
 * - If none of the above conditions apply, it defaults to `IFieldBase<DataType>`.
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
  The IResourceName type is defined as the union of all keys in the IResourceNameMap object. 
  This means that IResourceName can only take on values that are present as keys in IResourceNameMap.
 * Here are some examples of using this type:
 *```ts
  import "@resk/core";
  declare module "@resk/core"{
      interface IResourceNameMap {
        resource1: any;
        resource2: any;
        resource3: any;
      }
  }
 * let resourceName: IResourceName = 'resource1'; // valid
 * let anotherResourceName: IResourceName = 'resource2'; // valid
 * let invalidResourceName: IResourceName = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourceName'.
 ```
 */
export type IResourceName = keyof IResourceNameMap;

/**
 * A global declaration for all resource names. This is the exported name of the IResourceName type.
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
 *   interface IResourceNameMap {
 *     users?: string;
       roles?:any;
       sales?:any;
 *   }
 * }
 * ```
 * This means that any variable or property with type `IResourceName` can only hold 
 * one of the values 'users', 'roles', or 'sales'.
 * 
 * @example
 * ```typescript
 * let resourceName: IResourceName = 'users'; // valid
 * let anotherResourceName: IResourceName = 'roles'; // valid
 * let invalidResourceName: IResourceName = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourceName'.
 * ```
 */
export interface IResourceNameMap { }

/**
 * @interface IResourceActionMap
 * 
 * Represents a mapping of resource actions to their corresponding action definitions.
 * This interface serves as a structured way to define the various actions that can be 
 * performed on resources within the application, ensuring consistency and type safety 
 * when managing resource interactions.
 * 
 * ### Properties
 * 
 * - `read`: Represents the action to read or view a resource. This action is typically 
 *   used to retrieve data from the resource.
 * 
 * - `create`: Represents the action to create a new resource. This action is used 
 *   when a new instance of the resource needs to be added to the system.
 * 
 * - `update`: Represents the action to modify or update an existing resource. This 
 *   action is used when changes need to be applied to a resource that already exists.
 * 
 * - `delete`: Represents the action to remove or delete a resource. This action is 
 *   used when a resource needs to be permanently removed from the system.
 * 
 * - `details`: Represents the action to retrieve detailed information about a 
 *   resource. This action is useful for obtaining more in-depth data about a 
 *   specific resource instance.
 * 
 * - `all`: Represents the action that encompasses all available actions on a 
 *   resource. This action can be used to perform batch operations or to indicate 
 *   that all actions are permitted.
 * 
 * ### Example Usage
 * 
 * Here is an example of how the `IResourceActionMap` interface can be utilized:
 * 
 * ```typescript
 * // Define a resource action map for a "documents" resource
 * const documentActions: IResourceActionMap = {
 *     read: { label: "Read Document", tooltip: "Retrieve the document details." },
 *     create: { label: "Create Document", tooltip: "Add a new document to the system." },
 *     update: { label: "Update Document", tooltip: "Modify the existing document." },
 *     delete: { label: "Delete Document", tooltip: "Remove the document from the system." },
 *     details: { label: "Document Details", tooltip: "View detailed information about the document." },
 *     all: { label: "All Actions", tooltip: "Perform all actions on the document." }
 * };
 * 
 * // Function to perform an action on a resource
 * function performAction(action: keyof IResourceActionMap) {
 *     switch (action) {
 *         case "read":
 *             console.log("Reading document...");
 *             break;
 *         case "create":
 *             console.log("Creating document...");
 *             break;
 *         case "update":
 *             console.log("Updating document...");
 *             break;
 *         case "delete":
 *             console.log("Deleting document...");
 *             break;
 *         case "details":
 *             console.log("Fetching document details...");
 *             break;
 *         case "all":
 *             console.log("Performing all actions on the document...");
 *             break;
 *         default:
 *             console.error("Unknown action");
 *     }
 * }
 * 
 * // Example of performing a specific action
 * performAction("create"); // Output: Creating document...
 * ```
 * 
 * ### Notes
 * 
 * - This interface is particularly useful in applications that require a clear 
 *   definition of actions associated with resources, allowing for better 
 *   organization and management of resource-related operations.
 * - Each action can be further customized with additional properties, such as 
 *   labels and tooltips, to enhance user experience and provide context in the UI.
 */
export interface IResourceActionMap {
  read: IResourceAction;
  create: IResourceAction;
  update: IResourceAction;
  delete: IResourceAction;
  list: IResourceAction;
  details: IResourceAction;
  all: IResourceAction;
}

/**
 * @interface IResourceAction
 * 
 * Represents the structure of an action that can be performed on a resource within the application.
 * This interface defines the essential properties that describe the action, allowing for a 
 * consistent representation of actions across different resources.
 * 
 * ### Properties
 * 
 * - `label` (optional): A user-friendly label for the action. This label is typically 
 *   displayed in the user interface (UI) to help users understand what the action does. 
 *   It should be concise and descriptive.
 * 
 * - `title` (optional): A more detailed title for the action. This title can provide 
 *   additional context or information about the action and may be displayed in UI elements 
 *   such as tooltips or headers.
 * 
 * - `tooltip` (optional): A short text that appears when the user hovers over the action 
 *   in the UI. The tooltip provides extra information about the action, helping users 
 *   understand its purpose without cluttering the interface.
 * 
 * ### Example Usage
 * 
 * Here is an example of how the `IResourceAction` interface can be utilized:
 * 
 * ```typescript
 * // Define a resource action for creating a new document
 * const createDocumentAction: IResourceAction = {
 *     label: "Create Document",
 *     title: "Create a new document in the system",
 *     tooltip: "Click to add a new document."
 * };
 * 
 * // Function to display action information
 * function displayActionInfo(action: IResourceAction) {
 *     console.log(`Action: ${action.label}`);
 *     console.log(`Title: ${action.title}`);
 *     console.log(`Tooltip: ${action.tooltip}`);
 * }
 * 
 * // Example of displaying action information
 * displayActionInfo(createDocumentAction);
 * // Output:
 * // Action: Create Document
 * // Title: Create a new document in the system
 * // Tooltip: Click to add a new document.
 * ```
 * 
 * ### Notes
 * 
 * - The `IResourceAction` interface is designed to be flexible, allowing developers to 
 *   define actions with varying levels of details based on the needs of their application.
 * - By providing clear labels, titles, and tooltips, developers can enhance the user 
 *   experience and make the application more intuitive.
 */
export interface IResourceAction {
  label?: string;
  title?: string;
  tooltip?: string;
}

/**
 * @type IResourceActionName
 * 
 * Represents the type of resource actions that can be performed within the application.
 * This type is derived from the keys of the `IResourceActionMap` interface, ensuring that 
 * only valid action names can be used when referencing actions associated with resources.
 * 
 * ### Description
 * 
 * The `IResourceActionName` type is a union of string literals that correspond to the 
 * defined actions in the `IResourceActionMap`. This provides type safety and consistency 
 * when working with resource actions, preventing errors that may arise from using 
 * invalid action names.
 * 
 * ### Example Usage
 * 
 * Here is an example of how the `IResourceActionName` type can be utilized:
 * 
 * ```typescript
 * // Function to perform an action on a resource
 * function performAction(action: IResourceActionName) {
 *     switch (action) {
 *         case "read":
 *             console.log("Reading resource...");
 *             break;
 *         case "create":
 *             console.log("Creating resource...");
 *             break;
 *         case "update":
 *             console.log("Updating resource...");
 *             break;
 *         case "delete":
 *             console.log("Deleting resource...");
 *             break;
 *         case "details":
 *             console.log("Fetching resource details...");
 *             break;
 *         case "all":
 *             console.log("Performing all actions on the resource...");
 *             break;
 *         default:
 *             console.error("Unknown action");
 *     }
 * }
 * 
 * // Example of using the performAction function
 * performAction("create"); // Output: Creating resource...
 * ```
 * 
 * ### Notes
 * 
 * - The use of `IResourceActionName` enhances type safety by ensuring that only 
 *   predefined action names can be passed to functions that require an action parameter.
 * - This type can be particularly useful in scenarios where actions are dynamically 
 *   determined or when implementing features that require strict adherence to defined 
 *   action names.
 */
export type IResourceActionName = keyof IResourceActionMap;


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
 * @typeParam DataType - An optional type representing the data that this resource holds. Defaults to `any`.
 */
/**
 * Represents a resource with a data provider and various metadata properties.
 *
 * @template DataType - The type of data the resource handles.
 * @template PrimaryKeyType - The type of the primary key for the resource.
 *
 * @property {IResourceDataProvider<DataType, PrimaryKeyType>} dataProvider - The data provider for the resource.
 * @property {IResourceName} [name] - The internal name of the resource used for programmatic referencing.
 * @property {string} [label] - A user-friendly label for the resource, typically used in UI elements.
 * @property {string} [title] - A descriptive title for the resource, often displayed in prominent places.
 * @property {string} [tooltip] - A short text that appears when the user hovers over the resource, providing additional context.
 * @property {IResourceActionMap} [actions] - The actions associated with the resource.
 */
export interface IResource<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
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
  name?: IResourceName;

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

  /**
   * Returns the actions associated with the resource.
   * @returns {IResourceActionMap} The actions associated with the resource.
   */
  actions?: IResourceActionMap;
}

/**
 * @type IResourceInstance
 * Represents a standardized base class for managing resources.
 *
 * This class provides common CRUD (Create, Read, Update, Delete) methods
 * and advanced options for filtering, sorting, and fetching resources.
 *
 * @typedef {Object} IResourceInstance
 *
 * @template DataType - The specific data's type of `IResource` being instantiated (defaults to `IResource`).
 * @template PrimaryKeyType - The type of the primary key for the resource. Defaults to `IResourcePrimaryKey`.
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
export interface IResourceInstance<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends IResource<DataType, PrimaryKeyType> {
  /*
  The data provider for the resource.
  */
  dataProvider: IResourceDataProvider<DataType, PrimaryKeyType>;
  /**
   * retrieves the data provider for the resource.
   * @returns {IResourceDataProvider<DataType, PrimaryKeyType>} The data provider for the resource.
  */
  getDataProvider: () => IResourceDataProvider<DataType, PrimaryKeyType>;
  /**
  * A type that represents a map of field names to their corresponding IField instances.
    @description this is the list of fields that are part of the resource.  Fields are created using the @Field decorator when resources are defined.
  */
  fields?: Record<string, IField>;

  /**
  * Returns the list of fields for the resource.
  *
  * @returns {Record<string, IField>} An object mapping property names to their corresponding field declaration
  * @example
  * ```typescript
  * class MyClass extends ResourceBase<DataType,number> {
  *   @Field({ type: 'string' }) myField: string;
  * }
  * const fields = new MyClass().getFields();
  * console.log(fields); // Output: { myField: { name: 'myField', type: 'string' } }
  * ```
  */
  getFields: () => Record<string, IField>;

  /**
   * Returns the field label for the resource.
     @returns  {string} The label of the resource.
  */
  getLabel: () => string;

  /**
   * Returns the field title for the resource;
   * @returns {string} The title of the resource
   */
  getTitle: () => string;

  /***
    Returns the field tooltip for the resource;
    @returns {string} The tooltip of the resource
  */
  getTooltip: () => string;


  /**
   * Retrieves the actions associated with the resource.
   * If the actions are not already defined or not an object, 
   * it initializes them as an empty object of type `IResourceActionMap`.
   *
   * @returns {IResourceActionMap} The map of resource actions.
   */
  getActions: () => IResourceActionMap;

  /**
   * Determines if the given permission is allowed for the specified user.
   *
   * @param perm - The permission to check. It can be a string or an object implementing the IAuthPerm interface.
   * @param user - The user for whom the permission is being checked. It can be an object implementing the IAuthUser interface.
   * @returns A boolean indicating whether the permission is allowed for the user.
   *
   * The method performs the following steps:
   * 1. Constructs a prefix using the resource name.
   * 2. If the permission is a string, it trims and processes it to ensure it has the correct prefix.
   * 3. Checks if the permission string has the correct prefix.
   * 4. Extracts the action part of the permission and checks if it is a valid action.
   * 5. If the action is "all" or matches any of the resource's actions, it returns true.
   * 6. Otherwise, it delegates the permission check to the Auth.isAllowed method.
   */
  isAllowed(perm?: IAuthPerm, user?: IAuthUser): boolean;

  /**
   * Retrieves the name of the resource.
   *
   * @returns {IResourceName} The name of the resource, cast to the IResourceName type.
   */
  getName(): IResourceName;

  /**
   * Initializes the resource with the provided options.
   * 
   * @param options - An object implementing the IResource interface, containing the data to initialize the resource with.
   * 
   * This method assigns the provided options to the resource, ensuring that any empty properties
   * on the resource are filled with the corresponding values from the options object. It skips
   * properties that are functions. After assigning the options, it calls the `getFields` method
   * to further process the resource.
   */
  init(options: IResource<DataType>): void;

  /**
   * Formats a string by replacing placeholders with corresponding values from a parameters object.
   *
   * @param text - The string containing placeholders in the format `{key}` to be replaced.
   * @param params - An object containing key-value pairs where the key corresponds to the placeholder in the text and the value is the replacement.
   * @returns The formatted string with placeholders replaced by corresponding values from the params object.
   */
  sprintf(text?: string, params?: Record<string, any>): string;
  /**
   * Retrieves the label for a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which to get the label.
   * @param params - Optional parameters to format the label.
   * @returns The formatted action label.
   */
  getActionLabel(actionName: IResourceActionName, params?: Record<string, any>): string;
  /**
   * Retrieves the title of a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which the title is to be retrieved.
   * @param params - An optional record of parameters to format the title.
   * @returns The formatted title of the specified action.
   */
  getActionTitle(actionName: IResourceActionName, params?: Record<string, any>): string;

  /**
   * Retrieves the tooltip for a specified action.
   *
   * @param actionName - The name of the action for which to get the tooltip.
   * @param params - Optional parameters to format the tooltip string.
   * @returns The formatted tooltip string for the specified action.
   */
  getActionTooltip(actionName: IResourceActionName, params?: Record<string, any>): string;

  /**
   * Retrieves a specific action by its name.
   *
   * @param {IResourceActionName} actionName - The name of the action to retrieve.
   * @returns {IResourceAction} The action object if found, otherwise an empty object.
   */
  getAction(actionName: IResourceActionName): IResourceAction;

  /**
  * Determines if the specified user has read access.
  *
  * @param user - The user whose read access is being checked. If no user is provided, the method will use default permissions.
  * @returns A boolean indicating whether the user has read access.
  */
  canUserRead(user?: IAuthUser): boolean;

  /**
   * Determines if the specified user has list access.
   *
   * @param user - The user whose list access is being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has list access.
   */
  canUserList(user?: IAuthUser): boolean;
  /**
   * Determines if the user has permission to create a resource.
   *
   * @param user - The user whose permissions are being checked. If not provided, the method will use the default user.
   * @returns A boolean indicating whether the user is allowed to create the resource.
   */
  canUserCreate(user?: IAuthUser): boolean;

  /**
   * Determines if the specified user has permission to update the resource.
   *
   * @param user - The user whose update permissions are being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has permission to update the resource.
   */
  canUserUpdate(user?: IAuthUser): boolean;
  /**
   * Determines if the user has permission to delete.
   *
   * @param user - The authenticated user whose permissions are being checked. Optional.
   * @returns A boolean indicating whether the user is allowed to delete.
   */
  canUserDelete(user?: IAuthUser): boolean;

  /**
   * Determines if the user has permission to view details.
   *
   * @param user - The authenticated user object. Optional.
   * @returns A boolean indicating whether the user is allowed to view details.
   */
  canUserViewDetails(user?: IAuthUser): boolean;

  /**
   * Retrieves the primary key fields from the current object's fields.
   *
   * @returns {IField[]} An array of fields that are marked as primary keys.
   */
  getPrimaryKeys(): IField[];

  /***
   * Creates a new record in the resource.
   * @param {DataType} record - The data for the new record.
   * @param options - Optional settings for the creation process.
   * @returns A promise that resolves to the result of the operation.
   * 
   * @example
   * ```typescript
   * const result = await resource.create({ name: "Product A", price: 100 }, {
   *   returnFields: ['id', 'name'],
   *   include: ['category']
   * });
   * console.log(result.data); // { id: 1, name: "Product A" }
   * ```
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the create operation.
   */
  create(record: DataType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;

  /***
   * Fetches all records from the resource.
   * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} options - Optional options for fetching resources.
   * @returns {Promise<IResourcePaginatedResult<DataType>>} A promise that resolves to the result of the fetch operation.
   */
  fetch(options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>>;

  /***
   * Fetches a single record from the resource.
   * @param {PrimaryKeyType} key - The primary key of the resource.
   * @param options - Optional settings for the fetch operation.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the fetch operation.
   */
  getOne(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;

  /**
   * Fetch detailed information about a specific resource.
   * This can include related or associated data.
   * @param key - The primary key of the resource.
   * @param options - Optional settings for the fetch operation.
   * @returns The detailed resource information or an error message.
   */
  details(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;

  /***
   * Updates a single record in the resource.
   * @param {PrimaryKeyType} key - The primary key of the resource to update.
   * @param {Partial<DataType>} updatedData - The updated data for the resource.
   * @param options - Optional settings for the update process.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the update operation.
   */
  update(key: PrimaryKeyType, updatedData: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;

  /**
   * 
   * @param key - The primary key of the resource to delete.
   * @param options - Optional settings for the deletion process.
   * @returns {Promise<IResourceOperationResult<any>>} A promise that resolves to the result of the delete operation.
   */
  delete(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any>>;

  /**
   * An optional array of property names that should be automatically translated.
   * The values corresponding to these properties in the translations dictionary
   * will be of the form "resources.[resourceName].[propertyName]".
   * @type {string[]}
   * @default ["label","title","tooltip"]
   */
  translatableProperties?: string[];
  /***
   * returns the properties of the resource that will be translated automatically.
   * returns an array of strings representing the properties that will be translated.
   * this implies that, in the translations dictionary, the value corresponding to these properties will be of the form : [resources][resourceName].[propertyName]
   * and example of a translation dictionary is: {
   *    "en" : {
   *      "resources" : {
   *        "user" : {
   *          "label" : "User",
   *          "email" : "Email" 
   *        }
   *      }
   *    },
    * "fr" : {
    *      "resources" : {
    *        "user" : {
    *          "label" : "Utilisateur",
    *          "email" : "Email"
    *        }
    *    }
   * }
   * label and email properties will be translated to "Utilisateur" and "Email" in french using the i18n.t function with the key : "resources.user.label" and "resources.user.email"
   * @returns {string[]} An array of strings representing the properties that will be translated.
   * @default ["label","title","tooltip"]
   */
  getTranslatableProperties(): string[];

  /***
   * translates a property of the resource using the translate function from the default I18n instance.
   * @param propertyName - The name of the property to translate.
   * @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation.
   * @returns The translated property value.
   */
  translateProperty(propertyName: string, fallbackValue?: string, options?: TranslateOptions): string;
  /***
   * adds the prefix "resources.${resourceName}." to the property name if it doesn't already have it.
   * @param propertyName - The name of the property to prefix.
   * @returns The prefixed property name.
   */
  setI18nPropertyPrefix(propertyName: string): string;

  /**
   * Adds the prefix "resources.${resourceName}.actions." to the action name if it doesn't already have it.
   * This is used to construct the i18n key for translating the action name.
   * 
   * @param {IResourceActionName} actionName - The name of the action to prefix.
   * @returns The prefixed action name.
   */
  setI18nActionPrefix(actionName: IResourceActionName): string;

  /***
  * translates a property of the resource using the translate function from the default I18n instance.
  * @param propertyName - The name of the property to translate.
  * @param fallbackValue - The fallback value to use if the translation is not found.
  * @param options - The options for the translation.
  * @returns The translated property value.
  * @exports
  * this.translateProperty("label") // returns "Label"
  * this.translateProperty("label", "Users") // returns "Label"
  * this.translateProperty("label", "Label", { resourceName: "users" }) // returns "Label"
  * this.translateProperty("title", "Title", { resourceName: "users" }) // returns "Title"
  */
  translateProperty(propertyName: string, fallbackValue?: string, options?: TranslateOptions): string;


  /**
   * Translates the name of a resource action using the default I18n instance.
   *
   * @param actionName - The name of the action to translate.
   * @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated action name.
   * @exports
   *  this.translateAction("read") // returns "Read"
   *  this.translateAction("read", "Read") // returns "Read"
   *  this.translateAction("read", "Read", { resourceName: "users" }) // returns "Read"
   *  this.translateAction("update", "Update", { resourceName: "users" }) // returns "Update"
   */
  translateAction(actionName: IResourceActionName, fallbackValue?: string, options?: TranslateOptions): string;

  /***
   * return the translated label for the read action.
   * @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated label for the read action.
   */
  getReadActionLabel(fallbackValue?: string, options?: TranslateOptions): string;
  /***
   * return the translated label for the create action.
   *  @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated label for the create action.
   */
  getCreateActionLabel(fallbackValue?: string, options?: TranslateOptions): string;
  /***
   * return the translated label for the update action.
  *  @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated label for the update action.
   */
  getUpdateActionLabel(fallbackValue?: string, options?: TranslateOptions): string;
  /***
   * return the translated label for the delete action.
   * @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated label for the delete action.
   */
  getDeleteActionLabel(fallbackValue?: string, options?: TranslateOptions): string;
  /***
   * return the translated tooltip for the details action.
  *  @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated tooltip for the details action.
   */
  getDetailsActionLabel(fallbackValue?: string, options?: TranslateOptions): string;


  /***
   * return the translated label for the list action.
   * @param fallbackValue - The fallback value to use if the translation is not found.
   * @param options - The options for the translation, including the resource name.
   * @returns The translated label for the list action.
   */
  getListActionLabel(fallbackValue?: string, options?: TranslateOptions): string;

  /**
   * checks if the resource has the action
   * @param action - The action to check
   * @returns true if the action exists, false otherwise
   */
  hasAction(action: IResourceActionName): boolean;

};

/**
 * A type that represents a constructor function that can be instantiated with any number of arguments.
 */
export type IConstructor = new (...args: any[]) => {};


/**
 * A renderer function type that renders a given value of type `InputType` into a value of type `OutputType`.
 * 
 * This type is used to define renderers for different value types (e.g., number, string)
 * within various components (e.g., `datagridCell`, `formField`). The renderer function
 * receives a value and returns an HTML string or a ReactNode or other content representing that value.
 * 
 * @template InputType - The type of the value to be rendered.
   @template OutputType - The type of the rendered value.
 * @param {InputType} value - The value to render.
 * @returns {OutputType} - The content representation of the rendered value.
 * 
 * ## Example:
 * 
 * ```typescript
 * const numberRenderer: ITypeRegistryRenderer<number,string> = (value: number) => {
 *   return `<div class="cell number">${value}</div>`;
 * };
 * console.log(numberRenderer(123)); // Output: <div class="cell number">123</div>
 * ```
 */
export type ITypeRegistryRenderer<InputType = any, OutputType = any> = (value: InputType) => OutputType;

/**
 * @interface
 * Represents a function that formats a field value according to specified options.
 *
 * The formatting can be customized based on the options provided when 
 * the `format` function of the `IField` interface is called. This type 
 * allows for greater flexibility in defining how field values should 
 * be displayed or manipulated.
 *
 * ### Parameters:
 * - `options`: 
 *   - **Type**: `IFormatValueOptions`
 *   - An object containing options for formatting the value. The options may 
 *     include the value to be formatted, the expected type of the value, 
 *     and a custom format specification.
 *
 * ### Returns:
 * - **Type**: `string`
 *   - The formatted value as a string, based on the provided options.
 *
 * ### Example Usage:
 * ```typescript
 * const customFormatter: IFormatValueFunc = (options) => {
 *     const { value, format } = options;
 *     if (format === 'money') {
 *         return `$${parseFloat(value).toFixed(2)}`; // Formats value as money
 *     }
 *     return String(value); // Default to string conversion
 * };
 *
 * const formattedValue = customFormatter({
 *     value: 1234.567,
 *     format: 'money'
 * });
 * console.log(formattedValue); // Outputs: "$1234.57"
 * ```
 */
export type IFormatValueFunc = ((options: IFormatValueOptions) => string);



/**
 * Represents the format types for value formatting.
 *
 * This type can be used to specify how values should be formatted in an application, such as:
 * - As a standard number
 * - As a monetary value
 * - Using a custom format defined by the user
 *
 * ### Format Options:
 * - `"number"`: For standard numerical formatting.
 * - `"money"`: For formatting values as monetary amounts, following currency rules.
 * - `"custom"`: For user-defined formatting rules.
 * - `ICurrencyFormatterKey`: Represents a specific currency format that adheres to the structure defined in the `ICurrencyFormatterKey` interface.
 *
 * ### Example Usage:
 * ```typescript
 * // Define a value with a money format
 * const moneyValue: IFormatValueFormat = "money";
 *
 * // Define a custom format
 * const customValue: IFormatValueFormat = "custom";
 *
 * // Define a value using ICurrencyFormatterKey
 * const currencyValue: IFormatValueFormat = "formatUSD" | "formatCAD" | "formatEUR" | "formatAED" | "formatAFN" | "formatALL" | "formatAMD" | "formatARS" |;
 * ```
 */
export type IFormatValueFormat = "number" | "money" | "custom" | IFormatValueFunc;

/**
 * Options for formatting a value into a string representation.
 *
 * This interface is used in the `formatValue` function to specify the options 
 * for formatting a given value, allowing for flexible and customizable 
 * output based on the provided settings.
 *
 * ### Properties:
 * - `value?`: The value to be formatted. This can be of any type and is the 
 *   main input for the formatting process.
 * - `type?`: The expected type of the input value, which can help in determining 
 *   the appropriate formatting logic to apply.
 * - `format?`: A predefined or custom format to be used for formatting the parsed 
 *   value. This allows for dynamic formatting based on the specified type.
 *
 * ### Example Usage:
 * ```typescript
 * const options: IFormatValueOptions = {
 *   value: 1234.56,
 *   type: "number",
 *   format: "money" // Example format for monetary values
 * };
 *
 * const formattedValue = formatValue(options);
 * console.log(formattedValue); // Outputs: "$1,234.56" or similar, depending on the format
 * ```
 * 
 *  * ```typescript
 * const options: IFormatValueOptions = {
 *   value: 1234.56,
 *   type: "number",
 *   format: "formatUSD" // Example format for monetary values in $USD
 * };
 *
 * const formattedValue = formatValue(options);
 * console.log(formattedValue); // Outputs: "$1,234.56" or similar, depending on the format
 * ```
 */
export interface IFormatValueOptions {
  value?: any; // The value to be formatted
  type?: any; // The expected type of the value
  /**
   * This function is used by default to format the parsed or custom value.
   */
  format?: IFormatValueFormat; // The format to be applied

  dateFormat?: IMomentFormat;
}

/**
 * @interface IFormatValueResult
 * Represents the result of a formatted value obtained via the `formatValue` function.
 *
 * This interface extends the `IFormatValueOptions` interface and contains 
 * properties that provide information about the formatted value, its type, 
 * and the parsed representation.
 *
 * ### Properties:
 * - `formattedValue`: 
 *   - **Type**: `string`
 *   - The formatted representation of the value, which is returned 
 *     after applying the formatting logic.
 *
 * - `isDecimalType`: 
 *   - **Type**: `boolean`
 *   - Indicates whether the type associated with the function supports 
 *     decimal values. This property helps determine how to handle the 
 *     formatted value correctly.
 *
 * - `parsedValue`: 
 *   - **Type**: `any`
 *   - The raw value that was parsed before formatting. By default, 
 *     this will be a number when the original value is a numeric type.
 *
 * - `decimalValue`: 
 *   - **Type**: `number`
 *   - The decimal representation of the formatted value. This is useful 
 *     for calculations or further processing of the value as a number.
 *
 * ### Example Usage:
 * ```typescript
 * const result: IFormatValueResult = {
 *   formattedValue: "$1,234.56",
 *   isDecimalType: true,
 *   parsedValue: 1234.56,
 *   decimalValue: 1234.56,
 * };
 * console.log(result.formattedValue); // Outputs: "$1,234.56"
 * console.log(result.isDecimalType);   // Outputs: true
 * ```
 */
export interface IFormatValueResult extends IFormatValueOptions {
  formattedValue: string; // The value to be formatted
  isDecimalType: boolean; //if the type linked to the function supports decimal values
  parsedValue: any; //defaults to a number when it is a number
  decimalValue: number; //the decimal value of the formatted value
}



/**
* @type IMomentYearToken
* @description
* A union type representing the various formats for year tokens in Moment.js.
* These tokens can be used to format or parse years in different representations.
* 
* ### Supported Tokens:
* - **`'YYYY'`**: 4-digit year (e.g., `2024`).
* - **`'YY'`**: 2-digit year (e.g., `24` for `2024`).
*/
export type IMomentYearToken = 'YYYY' | 'YY';

/**
 * @type IMomentMonthToken
 * @description
 * A union type representing the various formats for month tokens in Moment.js.
 * These tokens allow for formatting or parsing months in various styles.
 * 
 * ### Supported Tokens:
 * - **`'MM'`**: 2-digit month (e.g., `10` for October).
 * - **`'MMM'`**: Abbreviated month name (e.g., `Oct` for October).
 * - **`'MMMM'`**: Full month name (e.g., `October`).
 */
export type IMomentMonthToken = 'MM' | 'MMM' | 'MMMM';

/**
 * @type IMomentDayToken
 * @description
 * A union type representing the various formats for day tokens in Moment.js.
 * These tokens can be used to format or parse days in different representations.
 * 
 * ### Supported Tokens:
 * - **`'DD'`**: 2-digit day of the month (e.g., `07`).
 * - **`'D'`**: Day of the month (1-31).
 */
export type IMomentDayToken = 'DD' | 'D';

/**
 * @type IMomentDayOfWeekToken
 * @description
 * A union type representing the various formats for day of the week tokens in Moment.js.
 * These tokens are useful for formatting or parsing days based on their position in the week.
 * 
 * ### Supported Tokens:
 * - **`'dd'`**: Abbreviated day of the week (e.g., `Mo` for Monday).
 * - **`'ddd'`**: 3-letter abbreviation for the day (e.g., `Mon`).
 * - **`'dddd'`**: Full name of the day (e.g., `Monday`).
 */
export type IMomentDayOfWeekToken = 'dd' | 'ddd' | 'dddd';

/**
 * @type IMomentHourToken
 * @description
 * A union type representing the various formats for hour tokens in Moment.js.
 * These tokens can be used to format or parse hours in both 12-hour and 24-hour formats.
 * 
 * ### Supported Tokens:
 * - **`'HH'`**: 24-hour format (e.g., `14`).
 * - **`'H'`**: 24-hour format (1-23).
 * - **`'hh'`**: 12-hour format (e.g., `02`).
 * - **`'h'`**: 12-hour format (1-12).
 */
export type IMomentHourToken = 'HH' | 'H' | 'hh' | 'h';

/**
 * @type IMomentMinuteToken
 * @description
 * A union type representing the various formats for minute tokens in Moment.js.
 * These tokens can be used to format or parse minutes in both 2-digit and 1-digit formats.
 * 
 * ### Supported Tokens:
 * - **`'mm'`**: 2-digit minutes (e.g., `30`).
 * - **`'m'`**: Minute (0-59).
 */
export type IMomentMinuteToken = 'mm' | 'm';

/**
 * @type IMomentSecondToken
 * @description
 * A union type representing the various formats for second tokens in Moment.js.
 * These tokens can be used to format or parse seconds in both 2-digit and 1-digit formats.
 * 
 * ### Supported Tokens:
 * - **`'ss'`**: 2-digit seconds (e.g., `45`).
 * - **`'s'`**: Second (0-59).
 */
export type IMomentSecondToken = 'ss' | 's';

/**
 * @type IMomentFractionToken
 * @description
 * A union type representing the various formats for fractional second tokens in Moment.js.
 * These tokens can be used to format or parse milliseconds and fractions of seconds.
 * 
 * ### Supported Tokens:
 * - **`'SSS'`**: 3-digit milliseconds (e.g., `500`).
 * - **`'SS'`**: 2-digit fractional seconds.
 * - **`'S'`**: 1-digit fractional seconds.
 */
export type IMomentFractionToken = 'SSS' | 'SS' | 'S';

/**
 * @type IMomentMeridiemToken
 * @description
 * A union type representing the formats for meridiem tokens in Moment.js.
 * These tokens are used to indicate AM or PM in time formatting.
 * 
 * ### Supported Tokens:
 * - **`'A'`**: Uppercase meridiem (e.g., `PM`).
 * - **`'a'`**: Lowercase meridiem (e.g., `pm`).
 */
export type IMomentMeridiemToken = 'A' | 'a';

/**
 * @type IMomentTimezoneToken
 * @description
 * A union type representing the formats for timezone tokens in Moment.js.
 * These tokens are used to represent timezone offsets in date/time formatting.
 * 
 * ### Supported Tokens:
 * - **`'Z'`**: Timezone offset (e.g., `-07:00`).
 * - **`'ZZ'`**: Compact timezone offset (e.g., `-0700`).
 */
export type IMomentTimezoneToken = 'Z' | 'ZZ';

/**
 * @type IMomentDateSeparator
 * @description
 * A union type representing the valid separators for date components in Moment.js.
 * These separators are used to format dates in various styles.
 */
export type IMomentDateSeparator = '/' | '-' | '.';

/**
 * @type IMomentTimeSeparator
 * @description
 * A union type representing the valid separators for time components in Moment.js.
 * This separator is used to format time in various styles.
 */
export type IMomentTimeSeparator = ':';

/**
 * @type IMomentDateFormat
 * @description
 * A union type representing the various combinations of date components in Moment.js.
 * This type allows for flexibility in formatting dates according to different structures.
 */
export type IMomentDateFormat =
  `${IMomentYearToken}${IMomentDateSeparator}${IMomentMonthToken}${IMomentDateSeparator}${IMomentDayToken}` |
  `${IMomentMonthToken}${IMomentDateSeparator}${IMomentDayToken}${IMomentDateSeparator}${IMomentYearToken}` |
  `${IMomentDayToken}${IMomentDateSeparator}${IMomentMonthToken}${IMomentDateSeparator}${IMomentYearToken}`;

/**
 * @type IMomentTimeFormat
 * @description
 * A union type representing the various combinations of time components in Moment.js.
 * This type allows for flexibility in formatting times according to different structures.
 */
export type IMomentTimeFormat =
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}` |
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}${IMomentTimeSeparator}${IMomentSecondToken}` |
  `${IMomentHourToken}${IMomentTimeSeparator}${IMomentMinuteToken}${IMomentTimeSeparator}${IMomentSecondToken}.${IMomentFractionToken}`;

/**
 * @type IMomentDateTimeFormat
 * @description
 * A union type representing the various combinations of date and time components in Moment.js.
 * This type allows for flexible formatting of date/time strings according to different structures.
 */
export type IMomentDateTimeFormat =
  `${IMomentDateFormat} ${IMomentTimeFormat}` |
  `${IMomentDateFormat}T${IMomentTimeFormat}`;

/**
 * @type IMomentFullFormatFormat
 * @description
 * A union type representing the various combinations of date/time components with meridiem
 * and timezone tokens in Moment.js. This type allows for comprehensive formatting of
 * date/time strings that include all relevant components.
 */
export type IMomentFullFormatFormat =
  `${IMomentDateTimeFormat}${IMomentMeridiemToken}` |
  `${IMomentDateTimeFormat} ${IMomentMeridiemToken}` |
  `${IMomentDateTimeFormat}${IMomentTimezoneToken}` |
  `${IMomentDateTimeFormat} ${IMomentTimezoneToken}`


/**
 * @type IMomentDayOfWeekFormat
 * @description
 * A union type representing the various combinations of day of the week components
 * in Moment.js. This type allows for flexible formatting of date/time strings
 * that include the day of the week.
 */
export type IMomentDayOfWeekFormat = `${IMomentDayOfWeekToken}, ` | `${IMomentDayOfWeekToken} `;

/**
 * @type IMomentFormat
 * @description
 * A comprehensive union type representing all valid Moment.js format strings.
 * This type serves as a unified reference for various date/time formatting options,
 * accommodating various combinations of date, time, and day of the week components.
 */
export type IMomentFormat = IMomentDateFormat | IMomentTimeFormat | IMomentDateTimeFormat | IMomentFullFormatFormat |
  `${IMomentDayOfWeekFormat}${IMomentDateFormat}` | `${IMomentDayOfWeekFormat}${IMomentTimeFormat}`



/**
 * @interface IDictPrefixWithKey
 * Combines a string prefix with the keys of a dictionary type to create a new type.
 * 
 * This utility type allows you to prepend a given string (the `Prefix`) to the keys of a given dictionary (`Dict`),
 * generating a new type where each key is the combination of the prefix and the original key.
 * 
 * @template Prefix The string prefix that will be prepended to each key in the dictionary.
 * @template Dict The dictionary type whose keys will be combined with the prefix.
 * 
 * @example
 * ```typescript
 * type MyDict = {
 *   name: string;
 *   age: number;
 *   city: string;
 * };
 * 
 * // Combine the prefix 'user_' with the keys of MyDict
 * type PrefixedKeys = PrefixWithKey<'user_', MyDict>;
 * 
 * // Result:
 * // type PrefixedKeys = 'user_name' | 'user_age' | 'user_city'
 * ```
 * 
 * @param Prefix A string type representing the prefix to be added.
 * @param Dict A dictionary type (Record) whose keys will be used.
 * @returns A new type where the prefix is combined with each key of the dictionary.
 */
export type IDictPrefixWithKey<Prefix extends string, Dict extends Record<string, any>> =
  `${Prefix}${keyof Dict & string}`;


/**
 * @interface IDictKeysAsString
 * Converts all keys of a dictionary to a union of string literals.
 * 
 * This type transforms the keys of a dictionary into a string literal type
 * and ensures that IntelliSense provides suggestions for those keys.
 *
 * @template T The dictionary (object type) whose keys are to be converted.
 */
export type IDictKeysAsString<T> = keyof T extends string ? keyof T : never;

/**
 * @type IResourcePrimaryKey
 * 
 * Represents the type of primary keys that can be utilized in a resource.
 * This type is a union that provides flexibility in defining unique identifiers
 * for resources, accommodating various data structures and use cases.
 * 
 * ### Possible Forms:
 * 
 * - **String**: A simple string value that can represent a unique identifier.
 *   - **Example**: 
 *     ```typescript
 *     const userId: IResourcePrimaryKey = "user123"; // A unique username
 *     ```
 * 
 * - **Number**: A numeric value that can also serve as a unique identifier.
 *   - **Example**: 
 *     ```typescript
 *     const orderId: IResourcePrimaryKey = 456; // An auto-incremented order ID
 *     ```
 * 
 * - **Record<string, string | number>**: An object where the keys are strings
 *   and the values can be either strings or numbers. This allows for composite keys
 *   that consist of multiple fields.
 *   - **Example**: 
 *     ```typescript
 *     const compositeKey: IResourcePrimaryKey = { userId: "user123", orderId: 456 }; 
 *     // A composite key representing a user and their order
 *     ```
 * 
 * ### Notes:
 * - This type is particularly useful in scenarios where resources may have 
 *   different types of identifiers, such as in databases or APIs.
 * - Using a `Record` allows for more complex primary key structures, which can 
 *   be beneficial in applications that require composite keys.
 * 
 * ### Use Cases:
 * - Defining primary keys in database models.
 * - Creating unique identifiers for API resources.
 * - Handling composite keys in data structures.
 * 
 * ### Related Types:
 * - Consider using `IResource` for defining the overall structure of a resource
 *   that utilizes this primary key type.
 * 
 * ### Example Usage:
 * Here’s how you might use the `IResourcePrimaryKey` type in a function that
 * retrieves a resource by its primary key:
 * 
 * ```typescript
 * function getResourceById(id: IResourcePrimaryKey): Resource {
 *     // Implementation to fetch the resource based on the provided primary key
 * }
 * 
 * const resource = getResourceById("user123"); // Fetching by string ID
 * const anotherResource = getResourceById(456); // Fetching by numeric ID
 * const compositeResource = getResourceById({ userId: "user123", orderId: 456 }); // Fetching by composite key
 * ```
 * 
 * ### Summary:
 * The `IResourcePrimaryKey` type provides a versatile way to define primary keys
 * for resources, supporting simple and complex identifiers. This flexibility is
 * essential for applications that manage diverse data structures and require
 * unique identification of resources.
 */
export type IResourcePrimaryKey = string | number | Record<string, string | number>;

/**
 * @interface IResourceOperationResult
 * 
 * Represents the result of an operation performed on a resource.
 * This interface provides a structured way to convey the outcome of 
 * operations, including success status, returned data, and error messages.
 * 
 * @template DataType - The type of data that may be returned as part of the 
 * operation result. Defaults to `any`, allowing for flexibility in the 
 * type of data returned.
 * 
 * ### Properties:
 * 
 * - **success**: A boolean indicating whether the operation was successful.
 *   - **Example**: 
 *     ```typescript
 *     const result: IResourceOperationResult = { success: true };
 *     ```
 * 
 * - **data**: An optional property that holds the data returned from the 
 * operation if it was successful. The type of this data is defined by 
 * the `DataType` template parameter.
 *   - **Example**: 
 *     ```typescript
 *     const result: IResourceOperationResult<User> = { 
 *         success: true, 
 *         data: { id: 1, name: "John Doe" } 
 *     };
 *     ```
 * 
 * - **error**: An optional string that contains an error message if the 
 * operation was not successful. This property provides context on what 
 * went wrong during the operation.
 *   - **Example**: 
 *     ```typescript
 *     const result: IResourceOperationResult = { 
 *         success: false, 
 *         error: "User  not found." 
 *     };
 *     ```
 * 
 * ### Notes:
 * - This interface is useful for standardizing the response format of 
 *   resource operations, making it easier to handle success and error 
 *   cases consistently across the application.
 * - The `DataType` parameter allows for strong typing of the returned 
 *   data, enhancing type safety and reducing runtime errors.
 * 
 * ### Example Usage:
 * Here’s how you might use the `IResourceOperationResult` interface 
 * in a function that performs a resource operation:
 * 
 * ```typescript
 * function createUser (userData: User): IResourceOperationResult<User> {
 *     try {
 *         // Logic to create a user
 *         const newUser  = { id: 1, ...userData }; // Simulated created user
 *         return { success: true, data: newUser  };
 *     } catch (error) {
 *         return { success: false, error: error.message };
 *     }
 * }
 * 
 * const result = createUser ({ name: "John Doe" });
 * if (result.success) {
 *     console.log("User  created:", result.data);
 * } else {
 *     console.error("Error creating user:", result.error);
 * }
 * ```
 * 
 * ### Summary:
 * The `IResourceOperationResult` interface provides a clear and 
 * consistent structure for representing the outcome of resource 
 * operations, facilitating better error handling and data management 
 * in applications.
 */
export interface IResourceOperationResult<DataType = any> {
  statusCode?: number; // HTTP status code for the operation
  success: boolean; // Indicates if the operation was successful
  data?: DataType; // Optional data returned from the operation
  error?: string | Error; // Optional error message if the operation failed
}

/**
 * @interface IResourceDataProvider
 * 
 * Represents a data provider interface for managing resources.
 * This interface defines methods for performing CRUD (Create, Read, Update, Delete)
 * operations on resources, allowing for flexible data management.
 * 
 * @template DataType - The type of the resource data being managed. Defaults to `any`,
 * allowing for flexibility in the type of data handled by the provider.
 * 
 * @template PrimaryKeyType - The type of the primary key used to identify resources. 
 * It extends `IResourcePrimaryKey`, which can be a string, number, or a composite key.
 * Defaults to `string | number`.
 * 
 * ### Methods:
 * 
 * - **create(record: DataType)**: Creates a new resource record.
 *   - **Parameters**:
 *     - `record`: The data for the new resource to be created.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<DataType>`, 
 *     indicating the success or failure of the operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.create({ name: "New Resource" });
 *     ```
 * 
 * - **fetch()**: Retrieves all resource records.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<DataType[]>`, 
 *     containing an array of resource records.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.fetch();
 *     console.log(result.data); // Array of resource records
 *     ```
 * 
 * - **getOne(key: K)**: Retrieves a single resource record by its primary key.
 *   - **Parameters**:
 *     - `key`: The primary key of the resource to retrieve.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<DataType>`, 
 *     containing the requested resource record.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.getOne("resourceId");
 *     ```
 * 
 * - **details(key: K)**: Retrieves detailed information about a single resource record.
 *   - **Parameters**:
 *     - `key`: The primary key of the resource to retrieve details for.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<DataType>`, 
 *     containing detailed information about the resource.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.details("resourceId");
 *     ```
 * 
 * - **update(key: K, updatedData: Partial<DataType>)**: Updates an existing resource record.
 *   - **Parameters**:
 *     - `key`: The primary key of the resource to update.
 *     - `updatedData`: An object containing the updated data for the resource.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<DataType>`, 
 *     indicating the success or failure of the update operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.update("resourceId", { name: "Updated Resource" });
 *     ```
 * 
 * - **delete(key: K)**: Deletes a resource record by its primary key.
 *   - **Parameters**:
 *     - `key`: The primary key of the resource to delete.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<any>`, 
 *     indicating the success or failure of the delete operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.delete("resourceId");
 *     ```
 * 
 * ### Notes:
 * - This interface provides a standard way to interact with resource data,
 *   ensuring that all operations return consistent results.
 * - The use of promises allows for asynchronous operations, making it suitable
 *   for use in modern web applications.
 * 
 * ### Example Usage:
 * Here’s how you might implement the `IResourceDataProvider` interface:
 * 
 * ```typescript
 * class MyDataProvider implements IResourceDataProvider<MyResourceType> {
 *     async create(record: MyResourceType): Promise<IResourceOperationResult<MyResourceType>> {
 *         // Implementation for creating a resource
 *     }
 * 
 *     async fetch(): Promise<IResourceOperationResult<MyResourceType[]>> {
 *         // Implementation for fetching resources
 *     }
 * 
 *     // Implement other methods...
 * }
 * ```
 * 
 * ### Summary:
 * The `IResourceDataProvider` interface defines a comprehensive set of methods
 * for managing resources, facilitating CRUD operations and ensuring a consistent
 * approach to data handling in applications.
 */
export interface IResourceDataProvider<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
  create(record: DataType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;
  update(key: PrimaryKeyType, updatedData: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;
  delete(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any>>;
  getOne(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;
  details(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>>;
  fetch(options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>>;
}

/**
 * Interface representing options for fetching resources.
 * 
 * This interface allows you to specify various options when retrieving resources,
 * including filters to narrow down the results based on specific criteria.
 * 
 * @template DataType - The type of data being fetched. Defaults to 'any'.
 * @template PrimaryKeyType - The type of the primary key for the resource. 
 *                            Defaults to IResourcePrimaryKey.
 * 
 * @example
 * // Example of using IResourceFetchOptions
 * const fetchOptions: IResourceFetchOptions<MyDataType, string> = {
 *     filters: {
 *             status: { $eq: "active" }, // Filter for active resources
 *             category: { $in: ["A", "B"] } // Filter for categories A or B
*      },
*      sort: { createdAt: 'desc' }, // Sort by creation date descending
*      limit: 20, // Limit results to 20
*      skip: 0 // Do not skip any results
 * };
 */
export interface IResourceFetchOptions<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
  filters: IFilterQuery; // The filter criteria to apply to the query
  /** Fields to include in the response. */
  fields?: Array<keyof DataType>;
  sort?: IFilterSort;        // Optional sorting criteria for the results
  limit?: number;            // Optional limit on the number of results to return
  skip?: number;             // Optional number of results to skip before returning

  /** Pagination settings for the fetched resources. */
  pagination?: {
    /** The current page number (starting from 1). */
    page?: number;
    /** The number of items per page. */
    pageSize?: number;
  };

  /** Include relationships or nested resources. */
  include?: IResourceName[];

  /** Include only distinct results or specific fields for distinct values. */
  distinct?: boolean | Array<keyof DataType>;

  /** Include soft-deleted resources. */
  includeDeleted?: boolean;

  /** Cache the results for performance optimization. */
  cache?: boolean;

  /** Time-to-Live for cache, in seconds. */
  cacheTTL?: number;
}

/**
 * @interface IResourcePaginatedResult
 * 
 * Represents the result of a paginated resource fetch operation.
 * This interface encapsulates the data retrieved from a paginated API response,
 * along with metadata about the pagination state and navigation links.
 * 
 * @template DataType - The type of the resources being fetched. Defaults to `any`.
 * 
 * ### Properties:
 * 
 * - **data**: An array of fetched resources.
 *   - **Type**: `DataType[]`
 *   - **Description**: This property contains the list of resources retrieved from the API.
 *   - **Example**:
 *     ```typescript
 *     const result: IResourcePaginatedResult<User> = {
 *         data: [
 *             { id: 1, name: "John Doe" },
 *             { id: 2, name: "Jane Smith" }
 *         ],
 *         meta: { totalItems: 100, currentPage: 1, pageSize: 10, totalPages: 10 },
 *         links: { first: null, previous: null, next: "http://api.example.com/users?page=2", last: "http://api.example.com/users?page=10" }
 *     };
 *     ```
 * 
 * - **meta**: Metadata about the pagination state.
 *   - **Type**: `Object`
 *   - **Description**: This property provides information about the total number of items, the current page, the page size, and the total number of pages.
 *   - **Properties**:
 *     - **totalItems**: The total number of items available across all pages.
 *       - **Type**: `number`
 *       - **Example**: `100` indicates there are 100 items in total.
 *     - **currentPage**: The current page number being viewed.
 *       - **Type**: `number`
 *       - **Example**: `1` indicates the first page.
 *     - **pageSize**: The number of items displayed per page.
 *       - **Type**: `number`
 *       - **Example**: `10` indicates that 10 items are shown per page.
 *     - **totalPages**: The total number of pages available.
 *       - **Type**: `number`
 *       - **Example**: `10` indicates there are 10 pages in total.
 * 
 * - **links**: Navigation links for paginated results.
 *   - **Type**: `Object`
 *   - **Description**: This property contains URLs for navigating through the paginated results.
 *   - **Properties**:
 *     - **first**: URL to the first page of results.
 *       - **Type**: `string | null`
 *       - **Example**: `"http://api.example.com/users?page=1"` or `null` if there is no first page.
 *     - **previous**: URL to the previous page of results.
 *       - **Type**: `string | null`
 *       - **Example**: `"http://api.example.com/users?page=1"` or `null` if there is no previous page.
 *     - **next**: URL to the next page of results.
 *       - **Type**: `string | null`
 *       - **Example**: `"http://api.example.com/users?page=2"` or `null` if there is no next page.
 *     - **last**: URL to the last page of results.
 *       - **Type**: `string | null`
 *       - **Example**: `"http://api.example.com/users?page=10"` or `null` if there is no last page.
 * 
 * ### Example Usage:
 * Here’s how you might use the `IResourcePaginatedResult` interface in a function that fetches paginated user data:
 * 
 * ```typescript
 * async function fetchUsers(page: number): Promise<IResourcePaginatedResult<User>> {
 *     const response = await fetch(`http://api.example.com/users?page=${page}`);
 *     const result: IResourcePaginatedResult<User> = await response.json();
 *     return result;
 * }
 * 
 * fetchUsers(1).then(result => {
 *     console.log(`Total Users: ${result.meta.totalItems}`);
 *     console.log(`Current Page: ${result.meta.currentPage}`);
 *     console.log(`Users on this page:`, result.data);
 * });
 * ```
 * 
 * ### Notes:
 * - This interface is particularly useful for APIs that return large datasets,
 *   allowing clients to retrieve data in manageable chunks.
 * - The `links` property facilitates easy navigation between pages, enhancing user experience.
 */
export interface IResourcePaginatedResult<DataType = any> extends IResourceOperationResult<DataType[]> {
  /** List of fetched resources. */
  data: DataType[];

  /** Pagination metadata. */
  meta?: {
    /** The total number of items available. */
    totalItems: number;
    /** The current page number. */
    currentPage: number;
    /** The number of items per page. */
    pageSize: number;
    /** The total number of pages. */
    totalPages: number;
  };

  /** Links for navigation in paginated results. */
  links?: {
    /** URL or index to the first page. */
    first?: string | number;
    /** URL or index to the previous page. */
    previous?: string | number;
    /** URL or index to the next page. */
    next?: string | number;
    /** URL or index to the last page. */
    last?: string | number;
  };
}

export * from "./filters";
export * from "./i18n";