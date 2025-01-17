import { IAuthPerm } from "@/auth/types";
import { IMangoQuery, IMangoOrderBy } from "./filters";

export type IResourceDefaultEvent = IResourceActionName | keyof IResourceDataService;

/**
 * @typedef IPrimitive
 * @description
 * The `IPrimitive` type represents a union of the basic primitive data types in TypeScript.
 * It can be one of the following types:
 * - `string`: Represents textual data.
 * - `number`: Represents numeric values, both integers and floating-point numbers.
 * - `boolean`: Represents a logical entity that can have two values: `true` or `false`.
 *
 * This type is useful when you want to define a variable or a function parameter that can accept
 * any of these primitive types, providing flexibility in your code.
 *
 * @example
 * // Example of using IPrimitive in a function
 * function logValue(value: IPrimitive): void {
 *     console.log(`The value is: ${value}`);
 * }
 *
 * logValue("Hello, World!"); // Logs: The value is: Hello, World!
 * logValue(42);               // Logs: The value is: 42
 * logValue(true);             // Logs: The value is: true
 *
 * @example
 * // Example of using IPrimitive in a variable
 * let myValue: IPrimitive;
 * myValue = "A string"; // Valid
 * myValue = 100;        // Valid
 * myValue = false;      // Valid
 * 
 * // myValue = [];      // Error: Type 'never[]' is not assignable to type 'IPrimitive'.
 *
 */
export type IPrimitive = string | number | boolean;

/**
 * Represents a base field with optional type, label, and name properties.
 * The type property defaults to "text" if not specified.
 * 
 * @template FieldType - The type of the field, defaults to "text"
 * @extends IProtectedResource
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
 * @see {@link IProtectedResource} for the `IProtectedResource` type.
 */
export interface IFieldBase<FieldType extends IFieldType = any> extends IProtectedResource {
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
  [key in (IResourceActionName | "form" | "filter")]?: Partial<IField>;
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
 * Represents a protected resource that can be associated with a button in the user interface.
 * This type is used to define the conditions under which a button should be rendered based on user permissions.
 *
 * @type IProtectedResource
 * 
 * @property {IResourceName} [resourceName] - The name of the resource associated with the button.
 * This property can be used to identify the specific resource that the button interacts with.
 * 
 * @property {IAuthPerm} [perm] - The permission associated with the button.
 * This permission is used to determine if the button will be rendered or not.
 * If this property is not provided, the button will be rendered regardless of the user's permissions.
 * 
 * @example
 * // Example of a protected resource with a specific permission
 * const deleteButton: IProtectedResource = {
 *   resourceName: 'Delete User',
 *   perm: 'user:delete'
 * };
 * 
 * // Example of a protected resource without a specific permission
 * const saveButton: IProtectedResource = {
 *   resourceName: 'Save Changes'
 * };
 * 
 * // In the above example, the 'deleteButton' will only be rendered if the user has the 'user:delete' permission,
 * // while the 'saveButton' will always be rendered since no permission is specified.
 * 
 * @remarks
 * This type is particularly useful in applications where user roles and permissions dictate the visibility of UI elements.
 * By using this type, developers can easily manage which buttons should be displayed based on the user's access rights.
 */
export type IProtectedResource = {
  /**
    * The name of the resource associated with the button.
    */
  resourceName?: IResourceName;
  /**
   * The permission associated with the button.
   * This permission is used to determine if the button will be rendered or not.
   * If not provided, the button will be rendered regardless of the user's permissions.
   */
  perm?: IAuthPerm;
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
 *     findOne: { label: "Read Document", tooltip: "Retrieve the document details." },
 *     create: { label: "Create Document", tooltip: "Add a new document to the system." },
 *     update: { label: "Update Document", tooltip: "Modify the existing document." },
 *     delete: { label: "Delete Document", tooltip: "Remove the document from the system." },
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
 * @type IResourceActionKey
 * 
 * Represents the keys of the actions that can be performed on a resource within the application.
 * This type is derived from the keys of the `IResourceAction` interface, ensuring that 
 * only valid action names can be used when referencing actions associated with resources.
 * 
 * ### Description
 * The `IResourceActionKey` type serves as a union of string literals that correspond to the 
 * defined actions in the `IResourceAction` interface. This provides type safety and consistency 
 * when working with resource actions, preventing errors that may arise from using 
 * invalid action names.
 * 
 * ### Example Usage
 * Here is an example of how the `IResourceActionKey` type can be utilized:
 * 
 * ```typescript
 * // Function to perform an action on a resource
 * function performAction(action: IResourceActionKey) {
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
 * - The use of `IResourceActionKey` enhances type safety by ensuring that only 
 *   predefined action names can be passed to functions that require an action parameter.
 * - This type can be particularly useful in scenarios where actions are dynamically 
 *   determined or when implementing features that require strict adherence to defined 
 *   action names.
 */
export type IResourceActionKey = keyof IResourceAction;


/**
 * @type IResourceTranslateActionKey
 * 
 * Represents the keys used for translating actions associated with resources in the application.
 * This type allows for both simple resource names and more complex keys that combine 
 * resource names with specific action keys, facilitating localization and internationalization.
 * 
 * ### Description
 * The `IResourceTranslateActionKey` type is a union type that can either be:
 * - A simple resource name (e.g., `"user"`).
 * - A combination of a resource name and an action key, formatted as a template literal (e.g., `"user.create"`).
 * 
 * This structure allows for flexible and organized translation keys, making it easier to manage 
 * localization for various actions associated with different resources.
 * 
 * ### Example Usage
 * Here’s how you might use the `IResourceTranslateActionKey` type in a function that retrieves 
 * translation strings for resource actions:
 * 
 * ```typescript
 * i18n.registerTranslations({
 *     en: {
 *         resources: {
 *             user: {
 *                 create: {
 *                    label: "Create User",
 *                    title: "Create a new user",
 *                    tooltip: "Click to add a new user.",
 *                 },
 *                 read: {
 *                    label: "View User",
 *                    title: "View a specific user",
 *                    tooltip: "Click to view a specific user.",
 *                 },    
 *                 update: {
 *                    label: "Update User",
 *                    title: "Update a specific user",
 *                    tooltip: "Click to update a specific user.",
 *                    zero: "No users to update.",
 *                    one: "Updated one user.",
 *                    other: "Updated %{count} users.",
 *                },
 *                delete : {
 *                    label: "Delete User",
 *                    title: "Delete a specific user",
 *                    tooltip: "Click to delete a specific user.",
 *                    zero: "No users to delete.",
 *                    one: "Deleted one user.",
 *                    other: "Deleted %{count} users.", 
 *                },
 *                list : {
 *                    label: "List Users",
 *                    title: "List all users",
 *                    tooltip: "Click to list all users.",
 *                    zero: "No users to list.",
 *                    one: "Listed one user.",
 *                    other: "Listed %{count} users.",
 *                },
 *             }
 *         }
 *     }
 * });
 * ```
 * 
 * ### Notes
 * - This type is particularly useful in applications that require localization for various 
 *   actions associated with resources, allowing developers to easily manage and retrieve 
 *   translation strings based on resource and action keys.
 * - By using template literals, it enforces a consistent naming convention for translation keys, 
 *   reducing the likelihood of errors when referencing them.
 */
export type IResourceTranslateActionKey = IResourceName | `${IResourceName}.${IResourceActionKey}`;


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

 * @property {IResourceDataService<DataType>} dataProvider - The data provider for the resource.
 * @property {IResourceName} [name] - The internal name of the resource used for programmatic referencing.
 * @property {string} [label] - A user-friendly label for the resource, typically used in UI elements.
 * @property {string} [title] - A descriptive title for the resource, often displayed in prominent places.
 * @property {string} [tooltip] - A short text that appears when the user hovers over the resource, providing additional context.
 * @property {IResourceActionMap} [actions] - The actions associated with the resource.
 */
export interface IResource<DataType = any> {
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
   * @returns {Partial<IResourceActionMap>} The actions associated with the resource.
   */
  actions?: Partial<IResourceActionMap>;


  /***
   * The class name of the resource
   * This information is used to identify the resource class in the application.
   * It is retrieved from the target class passed to the @Resource decorator.
   */
  className?: string;
}

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
 * @type IMomentFormat
 * @description
 * A comprehensive type representing all valid Moment.js format strings.
 * This type serves as a unified reference for various date/time formatting options,
 * accommodating various combinations of date, time, and day of the week components.
 * ### Supported Tokens:
 *  monts : 
 *   M : Month number, without leading zeros (1-12).
 * - **`'MM'`**: 2-digit month (e.g., `10` for October).
 * - **`'MMM'`**: Abbreviated month name (e.g., `Oct` for October).
 * - **`'MMMM'`**: Full month name (e.g., `October`).
 * - **`'D'`**: Day of the month (e.g., `1` for the first day of the month... 2 ... 30 31).
 * - **``Do'`**: Ordinal day of the month (e.g., `1st` for the first day of the month,1st 2nd ... 30th 31st).
 * - **`'DD'`**: 2-digit day of the month (e.g., `01` for the first day of the month).
 * - **`'DDD'`**: 3-digit day of the year (e.g., `001` for the first day of the year).
 * - **`'DDDD'`**: 4-digit day of the year (e.g., `0001` for the first day of the year).
 * - **``d'`**: Day of the week (e.g., `1` for Monday : 0 1 ... 5 6).
 * - **``do'`**: Ordinal day of the week (e.g., `1st` for Monday).
 * - **``dd'`**: Abbreviated day of the week (e.g., `Mon` for Monday).
 * - **``ddd'`**: Full day of the week (e.g., `Monday`).
 * - **``dddd'`**: Full day of the week (e.g., `Monday`).
 * - **`'YY'`**: 2-digit year (e.g., `19` for the year 2019).
 * - **`'YYYY'`**: 4-digit year (e.g., `2019`).
 * - **`'YYYYY'`**: 5-digit year (e.g., `1999`).
 * - **`'a'`**: Lowercase am/pm marker (e.g., `am` or `pm`).
 * - **`'A'`**: Uppercase AM/PM marker (e.g., `AM` or `PM`).
 * - **`'H'`**: 24-hour hour (e.g., `0` to `23`).
 * - **`'HH'`**: 2-digit 24-hour hour (e.g., `00` to `23`).
 * - **`'h'`**: 12-hour hour (e.g., `1` to `12`).
 * - **`'hh'`**: 2-digit 12-hour hour (e.g., `01` to `12`).
 * - **`'m'`**: Minutes (e.g., `0` to `59`).
 * - **`'mm'`**: 2-digit minutes (e.g., `00` to `59`).
 * - **`'s'`**: Seconds (e.g., `0` to `59`).
 * - **`'ss'`**: 2-digit seconds (e.g., `00` to `59`).
 * - **`'S'`**: Milliseconds (e.g., `0` to `999`).
 * - **`'SS'`**: 3-digit milliseconds (e.g., `00` to `999`).
 * - **`'SSS'`**: 4-digit milliseconds (e.g., `000` to `9999`). 
 * - Q : Quarter of the year (1-4) : 1 2 3 4.
 * - Qo : Quarter of the year (1-4) : 1st 2nd 3rd 4th.
 * 
   * @see https://momentjs.com/docs/#/displaying/format for more information about the supported tokens.
 */
export type IMomentFormat = string;


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
 * - **Record<string, string | number>**: An object where the keys are strings
 *   and the values can be either strings or numbers. This allows for composite keys
 *   that consist of multiple fields.
 *   - **Example**: 
 *     ```typescript
 *     const compositeKey: PrimaryKeyType = { userId: "user123", orderId: 456 }; 
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
 * function getResourceById(id: PrimaryKeyType): Resource {
 *     // Implementation to list the resource based on the provided primary key
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
export type IResourcePrimaryKey = string | number | object;

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
  success?: boolean; // Indicates if the operation was successful
  data: DataType; // Optional data returned from the operation
  error?: any; // Optional error message if the operation failed
  message?: string; // Optional message for the operation
  status?: string; // Optional status of the operation
  errors?: string | Error[]; // Optional errors for the operation
}

/**
 * @interface IResourceDataService
 * 
 * Represents a data provider interface for managing resources.
 * This interface defines methods for performing CRUD (Create, Read, Update, Delete)
 * operations on resources, allowing for flexible data management.
 * 
 * @template DataType - The type of the resource data being managed. Defaults to `any`,
 * allowing for flexibility in the type of data handled by the provider.
 * 
 * @template PrimaryKeyType - The type of the primary key used to identify resources.
 * 
 * 
 * ### Methods:
 * 
 * - **create(record: Partial<DataType>)**: Creates a new resource record.
 *   - **Parameters**:
 *     - `record`: The data for the new resource to be created.
 *   - **Returns**: A promise that resolves to an `DataType`, 
 *     indicating the success or failure of the operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.create({ name: "New Resource" });
 *     ```
 * 
 * - **update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>)**: Updates an existing resource record.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to update.
 *     - `updatedData`: An object containing the updated data for the resource.
 *   - **Returns**: A promise that resolves to an `DataType`, 
 *     indicating the success or failure of the update operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.update("resourceId", { name: "Updated Resource" });
 *     ```
 * 
 * - **delete(primaryKey: PrimaryKeyType)**: Deletes a resource record by its primary key.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to delete.
 *   - **Returns**: A promise that resolves to an `IResourceOperationResult<any>`, 
 *     indicating the success or failure of the delete operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.delete("resourceId");
 *     ```
 * 
 * - **findOne(primaryKey: PrimaryKeyType)**: Retrieves a single resource record by its primary key.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to retrieve.
 *   - **Returns**: A promise that resolves to an `DataType | null`, 
 *     containing the requested resource record or null if not found.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.findOne("resourceId");
 *     ```
 * 
 * - **findOneOrFail(primaryKey: PrimaryKeyType)**: Retrieves a single resource record by its primary key or throws an error if not found.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to retrieve.
 *   - **Returns**: A promise that resolves to an `DataType`, 
 *     containing the requested resource record.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.findOneOrFail("resourceId");
 *     ```
 * 
 * - **find(options?: IResourceQueryOptions<DataType>)**: Retrieves multiple resource records based on query options.
 *   - **Parameters**:
 *     - `options`: Optional query options to filter the results.
 *   - **Returns**: A promise that resolves to an `IResourcePaginatedResult<DataType>`, 
 *     containing the list of resource records.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.find({ limit: 10, skip: 0 });
 *     ```
 * 
 * - **findAndCount(options?: IResourceQueryOptions<DataType>)**: Retrieves multiple resource records and the total count based on query options.
 *   - **Parameters**:
 *     - `options`: Optional query options to filter the results.
 *   - **Returns**: A promise that resolves to an `IResourcePaginatedResult<DataType>`, 
 *     containing the list of resource records and the total count.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.findAndCount({ limit: 10, skip: 0 });
 *     ```
 * 
 * - **createMany(data: Partial<DataType>[])**: Creates multiple resource records.
 *   - **Parameters**:
 *     - `data`: An array of data for the new resources to be created.
 *   - **Returns**: A promise that resolves to an `DataType[]`, 
 *     indicating the success or failure of the operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.createMany([{ name: "Resource 1" }, { name: "Resource 2" }]);
 *     ```
 * 
 * - **updateMany(data: Partial<DataType>)**: Updates multiple resource records.
 *   - **Parameters**:
 *     - `data`: An object containing the updated data for the resources.
 *   - **Returns**: A promise that resolves to an `DataType[]`, 
 *     indicating the success or failure of the update operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.updateMany({ status: "active" });
 *     ```
 * 
 * - **deleteMany(criteria: IResourceQueryOptions<DataType>)**: Deletes multiple resource records based on criteria.
 *   - **Parameters**:
 *     - `criteria`: The criteria to filter which resources to delete.
 *   - **Returns**: A promise that resolves to an `number`, 
 *     indicating the success or failure of the delete operation.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.deleteMany({ filters: { status: "inactive" } });
 *     ```
 * 
 * - **count(options?: IResourceQueryOptions<DataType>)**: Counts the total number of resource records based on query options.
 *   - **Parameters**:
 *     - `options`: Optional query options to filter the count.
 *   - **Returns**: A promise that resolves to an `number`, 
 *     containing the total count of resource records.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.count({ filters: { status: "active" } });
 *     ```
 * 
 * - **exists(primaryKey: PrimaryKeyType)**: Checks if a resource record exists by its primary key.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to check.
 *   - **Returns**: A promise that resolves to an `boolean`, 
 *     indicating whether the resource exists.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.exists("resourceId");
 *     ```
 * 
 * - **distinct?(field: keyof DataType, options?: IResourceQueryOptions<DataType>)**: Retrieves distinct values for a specified field.
 *   - **Parameters**:
 *     - `field`: The field for which to retrieve distinct values.
 *     - `options`: Optional query options to filter the results.
 *   - **Returns**: A promise that resolves to an `DataType[]`, 
 *     containing the distinct values.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.distinct("category");
 *     ```
 * 
 * - **aggregate?(pipeline: any[])**: Performs aggregation operations on the resource data.
 *   - **Parameters**:
 *     - `pipeline`: An array representing the aggregation pipeline.
 *   - **Returns**: A promise that resolves to an `number`, 
 *     containing the aggregated results.
 *   - **Example**:
 *     ```typescript
 *     const result = await dataProvider.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
 *     ```
 * 
 * ### Notes:
 * - This interface provides a standard way to interact with resource data,
 *   ensuring that all operations return consistent results.
 * - The use of promises allows for asynchronous operations, making it suitable
 *   for use in modern web applications.
 * 
 * ### Example Usage:
 * Here’s how you might implement the `IResourceDataService` interface:
 * 
 * ```typescript
 * class MyDataProvider implements IResourceDataService<MyResourceType> {
 *     async create(record: MyResourceType): Promise<IResourceOperationResult<MyResourceType>> {
 *         // Implementation for creating a resource
 *     }
 * 
 *     async list(): Promise<IResourceOperationResult<MyResourceType[]>> {
 *         // Implementation for fetching resources
 *     }
 * 
 *     // Implement other methods...
 * }
 * ```
 * 
 * ### Summary:
 * The `IResourceDataService` interface defines a comprehensive set of methods
 * for managing resources, facilitating CRUD operations and ensuring a consistent
 * approach to data handling in applications.

 */
export interface IResourceDataService<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
  /***
   * Creates a new resource record.
   * @param record The data for the new resource to be created.
   * @returns A promise that resolves to an `DataType`, 
   * indicating the success or failure of the operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.create({ name: "New Resource" });
  *     ```
   */
  create(record: Partial<DataType>): Promise<DataType>;
  /***
   * Updates an existing resource record.
   * @param primaryKey The primary key of the resource to update.
   * @param updatedData An object containing the updated data for the resource.
   * @returns A promise that resolves to an `DataType`, 
   * indicating the success or failure of the update operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.update("resourceId", { name: "Updated Resource" });
  *     ```
   */
  update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
  /***
   * Deletes a resource record by its primary key.
   * @param primaryKey The primary key of the resource to delete.
   * @returns A promise that resolves to an `IResourceOperationResult<any>`, 
   * indicating the success or failure of the delete operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.delete("resourceId");
  *     ```
   */
  delete(primaryKey: PrimaryKeyType): Promise<boolean>;
  /***
   * Retrieves a single resource record by its primary key.
   * @param primaryKey The primary key of the resource to retrieve.
   * @returns A promise that resolves to an `DataType | null`, 
   * containing the requested resource record or null if not found.
   * @example
  *   ```typescript
  *   const result = await dataProvider.findOne("resourceId");
  *     ```
   */
  findOne(primaryKey: PrimaryKeyType): Promise<DataType | null>;
  /***
   * Retrieves a single resource record by its primary key or throws an error if not found.
   * @param primaryKey The primary key of the resource to retrieve.
   * @returns A promise that resolves to an `DataType`, 
   * containing the requested resource record.
   * @example
  *   ```typescript
  *   const result = await dataProvider.findOneOrFail("resourceId");
  *     ```
   */
  findOneOrFail(primaryKey: PrimaryKeyType): Promise<DataType>;
  /***
   * Retrieves multiple resource records based on query options.
   * @param options Optional query options to filter the results.
   * @returns A promise that resolves to an `DataType[]`, 
   * containing the list of resource records.
   * @example
  *   ```typescript
  *   const result = await dataProvider.find({ limit: 10, skip: 0 });
  *     ```
   */
  find(options?: IResourceQueryOptions<DataType>): Promise<DataType[]>;
  /***
   * Retrieves multiple resource records and the total count based on query options.
   * @param options Optional query options to filter the results.
   * @returns A promise that resolves to an `DataType[]`, 
   * containing the list of resource records and the total count.
   * @example
  *   ```typescript
  *   const result = await dataProvider.findAndCount({ limit: 10, skip: 0 });
  *     ```
   */
  findAndCount(options?: IResourceQueryOptions<DataType>): Promise<[DataType[], number]>;

  /***
   * Retrieves multiple resource records and paginates the results.
   * @param options Optional query options to filter the results.
   * @returns A promise that resolves to an `IResourcePaginatedResult<DataType>`, 
   * containing the list of resource records and the total count.
   * @example
  *   ```typescript
  *   const result = await dataProvider.findAndPaginate({ limit: 10, skip: 0 });
   */
  findAndPaginate(options?: IResourceQueryOptions<DataType>): Promise<IResourcePaginatedResult<DataType>>;

  /***
   * Creates multiple resource records.
   * @param data An array of data for the new resources to be created.
   * @returns A promise that resolves to an `DataType[]`, 
   * indicating the success or failure of the operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.createMany([{ name: "Resource 1" }, { name: "Resource 2" }]);
  *     ```
   */
  createMany(data: Partial<DataType>[]): Promise<DataType[]>;
  /***
   * Updates multiple resource records.
   * @param filter An object containing the filter criteria for the resources.
   * @param data An object containing the updated data for the resources.
   * @returns A promise that resolves to an `DataType[]`, 
   * indicating the success or failure of the update operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.updateMany({ status: "active" });
  *     ```
   */
  updateMany(filter: IResourceQueryOptions, data: Partial<DataType>): Promise<number>;
  /**
   * 
   * @param criteria The criteria to filter which resources to delete.
   * @returns A promise that resolves to an `number`, 
   * indicating the success or failure of the delete operation.
   * @example
  *   ```typescript
  *   const result = await dataProvider.deleteMany({ filters: { status: "inactive" } });
  *     ```
   */
  deleteMany(criteria: IResourceQueryOptions<DataType>): Promise<number>;
  /***
   * Counts the total number of resource records based on query options.
   * @param options Optional query options to filter the count.
   * @returns A promise that resolves to an `number`, 
   * containing the total count of resource records.
   * @example
  *   ```typescript
  *   const result = await dataProvider.count({ filters: { status: "active" } });
  *     ```
   */
  count(options?: IResourceQueryOptions<DataType>): Promise<number>;
  /**
   * 
   * @param primaryKey The primary key of the resource to check.
   * @returns A promise that resolves to an `boolean`, 
   * indicating whether the resource exists.
   * @example
  *   ```typescript
  *   const result = await dataProvider.exists("resourceId");
  *     ```
   */
  exists(primaryKey: PrimaryKeyType): Promise<boolean>;
  /**
   * Returns distinct values for a field
   * @param field The field to check for distinct values.
   * @param options 
   */
  distinct?(field: keyof DataType): Promise<any[]>;

  /**
   * // Supports MongoDB-style aggregation pipelines
   * Aggregates resources based on a pipeline.
   * @param pipeline 
   */
  aggregate?(pipeline: any[]): Promise<any[]>;
}

/**
 * Interface representing options for fetching resources.
 * 
 * This interface allows you to specify various options when retrieving resources,
 * including filters to narrow down the results based on specific criteria.
 * 
 * @template DataType - The type of data being fetched. Defaults to 'any'.
 * @example
 * // Example of using IResourceQueryOptions
 * const fetchOptions: IResourceQueryOptions<MyDataType, string> = {
 *     filters: {
 *             status: { $eq: "active" }, // Filter for active resources
 *             category: { $in: ["A", "B"] } // Filter for categories A or B
*      },
*      orderBy: { createdAt: 'desc' }, // Sort by creation date descending
*      limit: 20, // Limit results to 20
*      skip: 0 // Do not skip any results
 * };
 */
export interface IResourceQueryOptions<DataType = any> {
  /***
   * The filter criteria to apply to the query using the Mango query language.
   */
  mango?: IMangoQuery; // The filter criteria to apply to the query
  /** Fields to include in the response. */
  fields?: Array<keyof DataType>;
  relations?: string[];      // The relations to include in the response.
  orderBy?: IMangoOrderBy;        // Optional sorting criteria for the results
  limit?: number;            // Optional limit on the number of results to return
  skip?: number;             // Optional number of results to skip before returning

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

  /**
   * Where clause to filter the results.
   */
  where?: Partial<Record<keyof DataType, any>>;
}

/**
 * @interface IResourcePaginatedResult
 * 
 * Represents the result of a paginated resource list operation.
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
 *     const response = await list(`http://api.example.com/users?page=${page}`);
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
export interface IResourcePaginatedResult<DataType = any> extends Omit<IResourceOperationResult, "data"> {
  /** List of fetched resources. */
  data: DataType[];

  /** Pagination metadata. */
  meta?: {
    /** The total number of items available. */
    total: number;
    /** The current page number. */
    currentPage?: number;
    /** The number of items per page. */
    pageSize?: number;
    /** The total number of pages. */
    totalPages?: number;
    /***
     * Whether there is a next page.
     */
    hasNextPage?: boolean;
    /***
     * Whether there is a previous page.
     */
    hasPreviousPage?: boolean;
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
