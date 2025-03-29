import { IDict } from "./dictionary";
import { IMongoQuery, IResourceQueryOptionsOrderBy } from "./filters";

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
 *   interface IResources {
 *   users : {
 *      actions : {
 *          read: {
 *              label: "Read User",
 *              title: "Read a specific user",
 *              tooltip: "Click to read a specific user.",
 *          };
 *          create: {
 *              label: "Create User",
 *              title: "Create a new user", 
 *              tooltip: "Click to create a new user.",
 *          };
 *          update: {
 *              label: "Update User",
 *              title: "Update a specific user",    
 *              tooltip: "Click to update a specific user.",
 *          };
 *          delete: {
 *              label: "Delete User",
 *              title: "Delete a specific user",
 *              tooltip: "Click to delete a specific user.",
 *          };
 *          all: {
 *              label: "All Actions",    
 *              title: "Perform all actions on the user.",
 *              tooltip: "Click to perform all actions on the user.",
 *          };
 *      }
 *    }
 *   }
 * }
 * ```
 * This means that any variable or property with type `IResourceName` can only hold 
 * one of the values 'users', 'roles', or 'sales'.
 * 
 * @example
 * ```typescript
 * let resourceName: IResourceName = 'users'; // valid * let invalidResourceName: IResourceName = 'unknownResource'; // error: Type '"unknownResource"' is not assignable to type 'IResourceName'.
 * ```
 */
export interface IResources { }


/**
 * Enforces the type constraint that all properties of an object must conform to the `IResource` interface.
 * This type is a mapped type that iterates over the keys of the input type `T` and checks if each property conforms to `IResource`.
 * If a property does not conform, the type is set to `never`, indicating a type error.
 * 
 * @template T - The input type to be enforced.
 * 
 * @example
 * ```typescript
 * interface MyResources {
 *     users: IResource;
 *     products: IResource;
 * }
 * 
 * type EnforcedResources = IEnforceIResources<MyResources>;
 * ```
 * 
 * @typeParam T - The input type to be enforced.
 * 
 * @typedef {{ [K in keyof T]: T[K] extends IResource ? T[K] : never }} IEnforceIResources
 */
type IEnforceIResources<T> = {
    /**
     * Iterates over the keys of the input type `T` and checks if each property conforms to `IResource`.
     * 
     * @type {[K in keyof T]}
     */
    [K in keyof T]: (
        /**
         * If the property conforms to `IResource`, returns the property type.
         * 
         * @type {T[K] extends IResource ? T[K] : never}
         */
        T[K] extends IResource ? T[K] : never // ❌ Invalid types will result in 'never'
    );
};

/**
 * Triggers validation of the `IResources` object to ensure it conforms to the `IResource` interface.
 * This type is used to enforce type safety and catch any errors in the `IResources` object.
 * 
 * @type {IEnforceIResources<IResources>}
 */
// ✅ Trigger validation
type ICheckIResources = IEnforceIResources<IResources>;

/**
 * Represents the type of names that can be used to identify resources.
 * This type is a union of the keys of the `IResources` object, enforced to conform to the `IResource` interface.
 * The resulting type is a string literal type that represents the valid resource names.
 * @remarks
 * You must ensure that the `IResources` object conforms to the `IResource` interface before using this type.
 * This type is particularly useful for working with resource names in your code.
 * each property of the `IResources` object must conform to the `IResource` interface.
 * @example
 * ```typescript
 * // Assuming IResources is defined as follows:
 * // interface IResources {
 * //     users: IResource;
 * //     products: IResource;
 * //     other:any; // Invalid resource type
 * // }
 * // Then, IResourceName would be equivalent to:
 * // type IResourceName = "users" | "products";
 * ```
 * 
 * @typedef {keyof IEnforceIResources<IResources> & string} IResourceName
 */
export type IResourceName = keyof ICheckIResources;

/**
 * Represents the default actions that can be performed on a resource.
 * This interface defines the structure for the actions, including read, create, update, delete, and all.
 * 
 * @example
 * ```typescript
 * const defaultActions: IResourceActions = {
 *     read: {
 *         label: "Read Resource",
 *         title: "Read a specific resource",
 *         tooltip: "Click to read a specific resource.",
 *     },
 *     create: {
 *         label: "Create Resource",
 *         title: "Create a new resource",
 *         tooltip: "Click to create a new resource.",
 *     },
 *     update: {
 *         label: "Update Resource",
 *         title: "Update a specific resource",
 *         tooltip: "Click to update a specific resource.",
 *     },
 *     delete: {
 *         label: "Delete Resource",
 *         title: "Delete a specific resource",
 *         tooltip: "Click to delete a specific resource.",
 *     },
 *     all: {
 *         label: "All Actions",
 *         title: "Perform all actions on the resource",
 *         tooltip: "Click to perform all actions on the resource.",
 *     },
 * };
 * ```
 * 
 * @interface IResourceActions
 */
export interface IResourceActions {
    /**
     * The read action for the resource.
     * This action is used to retrieve a specific resource.
     * 
     * @type {IResourceAction}
     * @example
     * ```typescript
     * const readAction: IResourceAction = {
     *     label: "Read Resource",
     *     title: "Read a specific resource",
     *     tooltip: "Click to read a specific resource.",
     * };
     * ```
     */
    read: IResourceAction;

    /**
     * The create action for the resource.
     * This action is used to create a new resource.
     * 
     * @type {IResourceAction}
     * @example
     * ```typescript
     * const createAction: IResourceAction = {
     *     label: "Create Resource",
     *     title: "Create a new resource",
     *     tooltip: "Click to create a new resource.",
     * };
     * ```
     */
    create: IResourceAction;

    /**
     * The update action for the resource.
     * This action is used to update a specific resource.
     * 
     * @type {IResourceAction}
     * @example
     * ```typescript
     * const updateAction: IResourceAction = {
     *     label: "Update Resource",
     *     title: "Update a specific resource",
     *     tooltip: "Click to update a specific resource.",
     * };
     * ```
     */
    update: IResourceAction;

    /**
     * The delete action for the resource.
     * This action is used to delete a specific resource.
     * 
     * @type {IResourceAction}
     * @example
     * ```typescript
     * const deleteAction: IResourceAction = {
     *     label: "Delete Resource",
     *     title: "Delete a specific resource",
     *     tooltip: "Click to delete a specific resource.",
     * };
     * ```
     */
    delete: IResourceAction;

    /**
     * The all action for the resource.
     * This action is used to perform all actions on the resource.
     * 
     * @type {IResourceAction}
     * @example
     * ```typescript
     * const allAction: IResourceAction = {
     *     label: "All Actions",
     *     title: "Perform all actions on the resource",
     *     tooltip: "Click to perform all actions on the resource.",
     * };
     * ```
     */
    all: IResourceAction;
}

/**
 * @interface IResourceActionName
 * Represents the name of an action that can be performed on a resource.
 * This type is a union of the action names defined in the `IResources` for a specific resource,
 * and the default action names defined in `IResourceActions`.
 * 
 * @template ResourceName - The name of the resource. Defaults to `IResourceName`.
 * 
 * @example
 * ```typescript
 * // Assuming IResources is defined as follows:
 * // interface IResources {
 * //     users: {
 * //         actions: {
 * //             read: IResourceAction;
 * //             create: IResourceAction;
 * //             update: IResourceAction;
 * //             delete: IResourceAction;
 * //             customAction: IResourceAction;
 * //         };
 * //     };
 * // }
 * 
 * // Then, IResourceActionName would be equivalent to:
 * // type IResourceActionName = "read" | "create" | "update" | "delete" | "customAction" | "all";
 * ```
 * 
 * @typeParam ResourceName - The name of the resource.
 * @default IResourceName
 * 
 * @typedef {keyof IResources[ResourceName]["actions"]} IResourceActionName
 */
export type IResourceActionName<ResourceName extends IResourceName = IResourceName> = keyof (ICheckIResources[ResourceName]["actions"]) | keyof IResourceActions


/**
 * @interface IResourceActionTuple
 * Represents a tuple that contains a resource name and an action name.
 * This type is a union of two possible tuple formats: `IResourceActionTupleArray` and `IResourceActionTupleObject`.
 * 
 * @template ResourceName - The name of the resource. Defaults to `IResourceName`.
 * 
 * @example
 * ```typescript
 * // Using IResourceActionTupleArray
 * const actionTuple: IResourceActionTuple = ["users", "read"];
 * 
 * // Using IResourceActionTupleObject
 * const actionTuple: IResourceActionTuple = { resourceName: "users", action: "read" };
 * ```
 * 
 * @typeParam ResourceName - The name of the resource.
 * @default IResourceName
 * 
 * @typedef {(IResourceActionTupleArray<ResourceName> | IResourceActionTupleObject<ResourceName>)} IResourceActionTuple
 * 
 * @see {@link IResourceActionTupleArray} for the `IResourceActionTupleArray` type.
 * @see {@link IResourceActionTupleObject} for the `IResourceActionTupleObject` type.
 */
export type IResourceActionTuple<ResourceName extends IResourceName = IResourceName> = (
    IResourceActionTupleArray<ResourceName> | IResourceActionTupleObject<ResourceName>
);

/**
 * @interface IResourceActionTupleArray
 * Represents a tuple that contains a resource name and an action name in an array format.
 * This type is a tuple with two elements: the resource name and the action name.
 * 
 * @template ResourceName - The name of the resource. Defaults to `IResourceName`.
 * 
 * @example
 * ```typescript
 * const actionTuple: IResourceActionTupleArray = ["users", "read"];
 * ```
 * 
 * @typeParam ResourceName - The name of the resource.
 * @default IResourceName
 * 
 * @typedef {[ResourceName, IResourceActionName<ResourceName>]} IResourceActionTupleArray
 */
export type IResourceActionTupleArray<ResourceName extends IResourceName = IResourceName> = [
    /**
     * The name of the resource.
     * 
     * @type {ResourceName}
     */
    ResourceName,
    /**
     * The name of the action.
     * 
     * @type {IResourceActionName<ResourceName>}
     */
    IResourceActionName<ResourceName>
];

/**
 * @interface IResourceActionTupleObject
 * Represents a tuple that contains a resource name and an action name in an object format.
 * This type is an object with two properties: `resourceName` and `action`.
 * 
 * @template ResourceName - The name of the resource. Defaults to `IResourceName`.
 * 
 * @example
 * ```typescript
 * const actionTuple: IResourceActionTupleObject = { resourceName: "users", action: "read" };
 * ```
 * 
 * @typeParam ResourceName - The name of the resource.
 * @default IResourceName
 * 
 * @interface IResourceActionTupleObject
 */
export interface IResourceActionTupleObject<ResourceName extends IResourceName = IResourceName> {
    /**
     * The name of the resource.
     * 
     * @type {ResourceName}
     */
    resourceName: ResourceName;

    /**
     * The name of the action.
     * 
     * @type {IResourceActionName<ResourceName>}
     */
    action: IResourceActionName<ResourceName>;
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
 * @property {Partial<IResourceActions> & Record<string, IResourceAction>} [actions] - The actions associated with the resource.
 */
export interface IResource<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
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

    /***
     * The actions associated with the resource.
     * This property is used to define the actions that can be performed on the resource.
     * It is an object where each key represents an action name and the value is an object that contains the action's properties.
     * 
     * @example
     * ```typescript
     * const resourceActions = {
     *     read: {
     *         label: "Read Resource",
     *         title: "Read a specific resource",
     *         tooltip: "Click to read a specific resource.",
     *     },
     *     create: {
     *         label: "Create Resource",
     *         title: "Create a new resource",
     *         tooltip: "Click to create a new resource.",
     *     },
     *     update: {
     *         label: "Update Resource",
     *         title: "Update a specific resource",
     *         tooltip: "Click to update a specific resource.",
     *     },
     *     delete: {
     *         label: "Delete Resource",
     *         title: "Delete a specific resource",
     *         tooltip: "Click to delete a specific resource.",
     *     },
     *     all: {
     *         label: "All Actions",
     *         title: "Perform all actions on the resource",
     *         tooltip: "Click to perform all actions on the resource.",
     *     },
     * };
     * ```
     */
    actions?: Partial<IResourceActions>;

    /***
     * The class name of the resource
     * This information is used to identify the resource class in the application.
     * It is retrieved from the target class passed to the @ResourceMetadata decorator.
     */
    className?: string;
}


/**
 * @interface IResourceDefaultEvent
 * Represents the default events that can be triggered for a resource.
 * This type is a union of custom action names (`IResourceActionName`) and keys from the `IResourceDataService`.
 *
 * @example
 * ```typescript
 * const event: IResourceDefaultEvent = "create"; // Example of a resource action name
 * const event: IResourceDefaultEvent = "update"; // Example of a key from IResourceDataService
 * ```
 *
 * @typedef {string} IResourceDefaultEvent
 */
export type IResourceDefaultEvent = IResourceActionName & string | keyof IResourceDataService;


/**
 * @interface IResourceData
 * Represents the data structure for a resource.
 * This interface extends `IDict`, allowing it to store key-value pairs dynamically.
 *
 * @example
 * ```typescript
 * const resourceData: IResourceData = {
 *   id: "123",
 *   name: "Example ResourceMetadata",
 *   description: "This is an example resource.",
 * };
 * ```
 *
 * @interface IResourceData
 * @extends IDict
 */
export interface IResourceData extends IDict { };


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
 * function getResourceById(id: PrimaryKeyType): ResourceMetadata {
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
 *     const result = await dataProvider.create({ name: "New ResourceMetadata" });
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
 *     const result = await dataProvider.update("resourceId", { name: "Updated ResourceMetadata" });
 *     ```
 * 
 * - **delete(primaryKey: PrimaryKeyType)**: Deletes a resource record by its primary key.
 *   - **Parameters**:
 *     - `primaryKey`: The primary key of the resource to delete. 
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
 *     const result = await dataProvider.createMany([{ name: "ResourceMetadata 1" }, { name: "ResourceMetadata 2" }]);
 *     ```
 * 
 * - **updateMany(data: IResourceManyCriteria<PrimaryKeyType,DataType>)**: Updates multiple resource records.
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
 *     async create(record: MyResourceType) {
 *         // Implementation for creating a resource
 *     }
 * 
 *     async list() {
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
export interface IResourceDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> {
    /***
     * Creates a new resource record.
     * @param record The data for the new resource to be created.
     * @returns A promise that resolves to an `DataType`, 
     * indicating the success or failure of the operation.
     * @example
    *   ```typescript
    *   const result = await dataProvider.create({ name: "New ResourceMetadata" });
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
    *   const result = await dataProvider.update("resourceId", { name: "Updated ResourceMetadata" });
    *     ```
     */
    update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
    /***
     * Deletes a resource record by its primary key.
     * @param primaryKey The primary key of the resource to delete.
     * @returns A promise that resolves to an `Promise<boolean>`, 
     * indicating the success or failure of the delete operation.
     * @example
    *   ```typescript
    *   const result = await dataProvider.delete("resourceId");
    *     ```
     */
    delete(primaryKey: PrimaryKeyType): Promise<boolean>;
    /***
     * Retrieves a single resource record by its primary key.
     * @param options The primary key or query options of the resource to retrieve.
     * @returns A promise that resolves to an `DataType | null`, 
     * containing the requested resource record or null if not found.
     * @example
    *   ```typescript
    *   const result = await dataProvider.findOne("resourceId");
    *     ```
    * @example
    *   ```typescript
    *   const result = await dataProvider.findOne({ firstName: 1 });
    *     ```
     */
    findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null>;
    /***
     * Retrieves a single resource record by its primary key or throws an error if not found.
     * @param primaryKey The primary key or query options of the resource to retrieve.
     * @returns A promise that resolves to an `DataType`, 
     * containing the requested resource record.
     * @example
    *   ```typescript
    *   const result = await dataProvider.findOneOrFail("resourceId");
    *     ```
     */
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType>;
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
    *   const result = await dataProvider.createMany([{ name: "ResourceMetadata 1" }, { name: "ResourceMetadata 2" }]);
    *     ```
     */
    createMany(data: Partial<DataType>[]): Promise<DataType[]>;
    /***
     * Updates multiple resource records.
     * @param criteria An object containing the filter criteria for the resources.
     * @param data An object containing the updated data for the resources.
     * @returns A promise that resolves to an `DataType[]`, 
     * indicating the success or failure of the update operation.
     * @example
    *   ```typescript
    *   const result = await dataProvider.updateMany({ status: "active" });
    *     ```
     */
    updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;
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
    deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;
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
 * @type IResourceManyCriteria
 * 
 * Represents the criteria used for  multiple actions on a resource.
 * This type allows for flexible definitions of what constitutes an update,
 * accommodating various scenarios based on the primary key or partial data.
 * 
 * ### Type Parameters
 * - **PrimaryKeyType**: The type of the primary key used to identify resources. 
 *   Defaults to `IResourcePrimaryKey`, which can be a string, number, or object.
 * - **DataType**: The type of data associated with the resource. Defaults to `IDict`, 
 *   which is a generic dictionary type allowing for any key-value pairs.
 * 
 * ### Possible Forms
 * The `IResourceManyCriteria` can take one of the following forms:
 * 
 * 1. **Array of Primary Keys**: 
 *    - An array of primary keys that uniquely identify the resources to be updated.
 *    - **Example**: 
 *      ```typescript
 *      const updateCriteria: IResourceManyCriteria<string> = ["user123", "user456"];
 *      ```
 * 
 * 2. **Partial Data Object**: 
 *    - An object containing partial data that represents the fields to be updated.
 *    - **Example**: 
 *      ```typescript
 *      const updateCriteria: IResourceManyCriteria<string, { name: string; age: number }> = {
 *          name: "John Doe",
 *          age: 30
 *      };
 *      ```
 * 
 * 3. **Record of Data Fields**: 
 *    - A record where each key corresponds to a field in the resource, allowing for 
 *      updates to specific fields.
 *    - **Example**: 
 *      ```typescript
 *      const updateCriteria: IResourceManyCriteria<string, { name: string; age: number }> = {
 *          name: "Jane Doe",
 *          age: 25
 *      };
 *      ```
 * 
 * ### Notes
 * - This type is particularly useful in scenarios where resources can be updated 
 *   based on different criteria, such as updating multiple records at once or 
 *   modifying specific fields of a resource.
 * - By leveraging TypeScript's generics, this type provides strong typing and 
 *   flexibility, ensuring that the criteria used for updates are well-defined and 
 *   type-safe.
 * 
 * ### Example Usage
 * Here’s how you might use the `IResourceManyCriteria` type in a function that 
 * updates resources:
 * 
 * ```typescript
 * function updateResources(criteria: IResourceManyCriteria<string, { name: string; age: number }>) {
 *     // Implementation to update resources based on the provided criteria
 * }
 * 
 * // Example of updating resources by primary keys
 * updateResources(["user123", "user456"]);
 * 
 * // Example of updating resources with partial data
 * updateResources({ name: "John Doe", age: 30 });
 * ```
 * @typeParam DataType - The type of data associated with the resource.
 * @default any
 * @typeParam PrimaryKeyType - The type of the primary key used to identify resources.
 * @default IResourcePrimaryKey
 * @see {@link IResourcePrimaryKey} for the `IResourcePrimaryKey` type.
 * @see {@link IMongoQuery} for the `IMongoQuery` type.
 * @example
 * // Example of using IResourceManyCriteria
 * const criteria: IResourceManyCriteria<string, { name: string; age: number }> = {
 *   name: "John Doe",
 *   age: 30
 * };
 * @Example 
 * // Example of using IResourceManyCriteria with an array of primary keys
 * const criteria: IResourceManyCriteria<string, { name: string; age: number }> = [
 *   "user123",
 *   "user456"
 * ];
 */
export type IResourceManyCriteria<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey>
    = PrimaryKeyType[] | IMongoQuery<DataType>;

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
export interface IResourceQueryOptions<DataType extends IResourceData = any> {
    /** Fields to include in the response. */
    fields?: Array<keyof DataType>;
    relations?: string[];      // The relations to include in the response.
    orderBy?: IResourceQueryOptionsOrderBy<DataType>;        // Optional sorting criteria for the results
    limit?: number;            // Optional limit on the number of results to return
    skip?: number;             // Optional number of results to skip before returning
    page?: number; // Optional page number for pagination, We can use it instead of skip

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
     * Resources are filtered using a MongoDB-like query syntax.
     * This allows you to specify conditions for filtering resources based on various criteria.
     * 
     * @type {IMongoQuery}
     * @see {@link https://www.mongodb.com/docs/manual/reference/operator/query/} for more information on MongoDB query operators.
     * @example
     * const queryOptions: IResourceQueryOptions<{ id: number, name: string }> = {
     *   where: {
     *     name : "John",
     *     surname : "Doe"
     *   },
     *   orderBy: { name: 'asc' },
     *   limit: 10,
     *   skip: 0
     * };
     * @see {@link IMongoQuery} for more information on where clauses.
     * @example
     * const queryOptions: IResourceQueryOptions<{ id: number, name: string }> = {
     *   where: {
     *     name : "John",
     *     surname : "Doe"
     *   },
     *   orderBy: { name: 'asc' },
     *   limit: 10,
     *   skip: 0
     * };
     */
    where?: IMongoQuery<DataType>;
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
export interface IResourcePaginatedResult<DataType extends IResourceData = any> {
    /** List of fetched resources. */
    data: DataType[];

    statusCode?: number; // HTTP status code for the operation
    success?: boolean; // Indicates if the operation was successful
    error?: any; // Optional error message if the operation failed
    message?: string; // Optional message for the operation
    status?: string; // Optional status of the operation
    errors?: string | Error[]; // Optional errors for the operation

    /** Pagination metadata. */
    meta?: IResourcePaginationMetaData;

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

/**
 * @typedef IResourcePaginationMetaData
 * Represents the pagination metadata for a resource.
 * 
 * This type defines the structure of the pagination metadata returned by a resource query operation.
 * It includes information about the total number of items, the current page, the page size, and other
 * pagination-related properties.
 * 
 * @property {number} total - The total number of items available.
 * @property {number} [currentPage] - The current page number.
 * @property {number} [pageSize] - The number of items per page.
 * @property {number} [totalPages] - The total number of pages.
 * @property {number} [nextPage] - The next page number.
 * @property {number} [previousPage] - The previous page number.
 * @property {number} [lastPage] - The last page number.
 * @property {boolean} [hasNextPage] - Whether there is a next page.
 * @property {boolean} [hasPreviousPage] - Whether there is a previous page.
 */
export interface IResourcePaginationMetaData {
    /** The total number of items available. */
    total: number;
    /** The current page number. */
    currentPage?: number;
    /** The number of items per page. */
    pageSize?: number;
    /** The total number of pages. */
    totalPages?: number;
    nextPage?: number;
    previousPage?: number;
    lastPage?: number;
    /***
     * Whether there is a next page.
     */
    hasNextPage?: boolean;
    /***
     * Whether there is a previous page.
     */
    hasPreviousPage?: boolean;
}