import 'reflect-metadata';
import { IDict, IResourceName, IField, IResourceInstance, IResource, IResourceActionMap, IResourceActionName, IResourceAction, IResourceDataProvider, IResourceOperationResult, IResourcePrimaryKey, IResourceFetchOptions } from '../types';
import { getFields } from '../fields';
import { isEmpty, defaultStr, isObj, isNonNullString, stringify } from '../utils/index';
import { IConstructor } from '../types/index';
import { IAuthPerm, IAuthUser } from '@/auth/types';
import { isAllowed } from '../auth/perms';


/**
 * Represents the base class for any resource.
 * 
 * The `ResourceBase` class provides a flexible structure for defining resource instances with optional metadata such as 
 * `name`, `label`, `title`, and `tooltip`. Additionally, it manages dynamic fields associated with the resource.
 * 
 * This class can be extended to implement specific resources, and it automatically handles merging options passed into
 * the constructor with the instance properties. It also retrieves and manages resource fields using the `getFields` method.
 * 
 * @template DataType - The type of data the resource is expected to handle. By default, it accepts any type (`DataType=any`).
 * 
 * @implements IResourceInstance<DataType> - Ensures that the class follows the `IResourceInstance` interface for consistency.
 * 
 * @example
 * // Create a new resource with basic properties
 * const resource = new ResourceBase({
 *    name: 'user',
 *    label: 'User',
 *    title: 'User Information',
 *    tooltip: 'Contains user-related data'
 * });
 * 
 * console.log(resource.getLabel()); // Output: 'User'
 * console.log(resource.getTitle()); // Output: 'User Information'
 * console.log(resource.getTooltip()); // Output: 'Contains user-related data'
 * 
 * @example
 * // Create a resource with dynamic fields
 * const dynamicResource = new ResourceBase({
 *    name: 'product',
 *    fields: {
 *      name: { type: 'string', label: 'Product Name' },
 *      price: { type: 'number', label: 'Product Price' }
 *    }
 * });
 * 
 * console.log(dynamicResource.getFields()); 
 * // Output: { name: { type: 'string', label: 'Product Name' }, price: { type: 'number', label: 'Product Price' } }
 */
export class ResourceBase<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> implements IResourceInstance<DataType, PrimaryKeyType> {
  actions?: IResourceActionMap;
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
  * A type that represents a map of field names to their corresponding IField instances.
   @description this is the list of fields that are part of the resource.It's a map where each key represents a field name, and the value contains field metadata.
   Fields are created using the @Field decorator when resources are defined.
  */
  fields?: Record<string, IField>;

  /**
   * Constructs a new `ResourceBase` instance.
   * 
   * The constructor accepts an `options` object, which is used to populate the instance properties.
   * It automatically copies all the non-function properties from the `options` into the current instance.
   * 
   * @param {IResource<DataType>} options - The initial configuration object for the resource, containing optional properties like `name`, `label`, `title`, and `tooltip`.
   * @param {...any[]} args - Additional arguments that can be passed for further customization.
   */
  constructor(options: IResource<DataType>, ...args: any[]) {
    this.init(options);
  }
  /**
   * The data provider for the resource.
   */
  dataProvider: IResourceDataProvider<DataType, PrimaryKeyType> = null as unknown as IResourceDataProvider<DataType, PrimaryKeyType>;
  /**
   * get the data provider for the resource.
   * @returns {IResourceDataProvider<DataType, PrimaryKeyType>} The data provider for the resource.
   */
  getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType> {
    return this.dataProvider;
  };
  /***
   * creates a new record in the resource.
   * @param {DataType} record - The data for the new record.
   * @param options - Optional settings for the creation process.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the create operation.
   */
  create(record: DataType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
    return this.getDataProvider()?.create(record, options);
  }
  /***
   * Fetches all records from the resource.
   * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} options - Optional options for fetching resources.
   * @returns {Promise<IResourceOperationResult<DataType[]>>} A promise that resolves to the result of the fetch operation.
   */
  fetch(options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType[]>> {
    return this.getDataProvider()?.fetch(options);
  }
  /***
   * fetches a single record from the resource.
   * @param {PrimaryKeyType} key - The primary key of the resource.
   * @param options - Optional settings for the fetch operation.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the fetch operation.
   */
  getOne(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
    return this.getDataProvider()?.getOne(key, options);
  }
  /**
   * gets the details of a record from the resource.
   * @param key - The primary key of the resource.
   * @param options - Optional settings for the fetch operation.
   * @returns {Promise<IResourceOperationResult<DataType>} A promise that resolves to the result of the fetch operation.
   */
  details(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
    return this.getDataProvider()?.details(key, options);
  }
  /**
   * updates a record in the resource.
   * @param key {PrimaryKeyType} The primary key of the resource to update.
   * @param updatedData
   * @param options - Optional settings for the update process.
   * @returns 
   */
  update(key: PrimaryKeyType, updatedData: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
    return this.getDataProvider()?.update(key, updatedData, options);
  }
  /***
   * deletes a record from the resource.
   * @param key {PrimaryKeyType} The primary key of the resource to delete.
   * @param options - Optional settings for the deletion process.
   * @returns Promise<IResourceOperationResult<any>> A promise that resolves to the result of the delete operation.
   */
  delete(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any>> {
    return this.getDataProvider()?.delete(key, options);
  }

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
  init(options: IResource<DataType>) {
    options = Object.assign({}, options);
    for (let i in options) {
      if (isEmpty((this as IDict)[i]) && typeof (this as IDict)[i] !== "function") {
        try {
          (this as IDict)[i] = options[i as keyof typeof options];
        } catch { }
      }
    }
    this.getFields();
  }

  /**
   * Retrieves the name of the resource.
   *
   * @returns {IResourceName} The name of the resource, cast to the IResourceName type.
   */
  getName(): IResourceName {
    return defaultStr(this.name) as IResourceName;
  }

  /**
   * Retrieves the actions associated with the resource.
   * If the actions are not already defined or not an object, 
   * it initializes them as an empty object of type `IResourceActionMap`.
   *
   * @returns {IResourceActionMap} The map of resource actions.
   */
  getActions(): IResourceActionMap {
    if (!isObj(this.actions) || !this.actions) {
      this.actions = {} as IResourceActionMap;
    }
    return this.actions;
  }

  /**
   * Determines if the given permission is allowed for the specified user.
   *
   * @param perm - The permission to check. It can be a string or an object implementing the IAuthPerm interface.

   * @param user - The user for whom the permission is being checked. It can be an object implementing the IAuthUser interface.The user object for whom the permission.If not provided, the function will attempt 
   *   to retrieve the signed user from the session.
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
  isAllowed(perm?: IAuthPerm, user?: IAuthUser): boolean {
    if (!this.getName()) return false;
    let prefix = `${String(this.getName()).trim().rtrim(":")}:`;
    let permStr: any = perm;
    if (typeof perm === "string") {
      permStr = perm.trim();
      let hasPrefix = true;
      if (!permStr.includes(":")) {
        permStr = `${prefix}${permStr}`;
      } else {
        const permStplit = permStr.toLowerCase().trim().split(":");
        hasPrefix = String(this.getName()).toLowerCase().trim() === permStplit[0]?.trim();
      }
      if (hasPrefix) {
        const action = permStr.trim().split(":")[1];
        if (isNonNullString(action)) {
          const actionSplit = action.toLowerCase().trim().split("|");
          let hasAction = actionSplit.includes("all");
          const actions = this.getActions();
          if (!hasAction) {
            for (let actionName in actions) {
              actionName = String(actionName).toLowerCase().trim();
              if (actionSplit.includes(actionName)) {
                hasAction = true;
                break;
              }
            }
          }
          if (!hasAction) {
            return false;
          }
        }
      }
    }
    return isAllowed(permStr as IAuthPerm, user);
  }
  /**
   * Determines if the specified user has read access.
   *
   * @param user - The user whose read access is being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has read access.
   */
  canUserRead(user?: IAuthUser): boolean {
    return this.isAllowed(`read`, user);
  }

  /**
   * Determines if the user has permission to create a resource.
   *
   * @param user - The user whose permissions are being checked. If not provided, the method will use the default user.
   * @returns A boolean indicating whether the user is allowed to create the resource.
   */
  canUserCreate(user?: IAuthUser): boolean {
    return this.isAllowed(`create`, user);
  }
  /**
   * Determines if the specified user has permission to update the resource.
   *
   * @param user - The user whose update permissions are being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has permission to update the resource.
   */
  canUserUpdate(user?: IAuthUser): boolean {
    return this.isAllowed(`update`, user);
  }

  /**
   * Determines if the user has permission to delete.
   *
   * @param user - The authenticated user whose permissions are being checked. Optional.
   * @returns A boolean indicating whether the user is allowed to delete.
   */
  canUserDelete(user?: IAuthUser): boolean {
    return this.isAllowed(`delete`, user);
  }

  /**
   * Determines if the user has permission to view details.
   *
   * @param user - The authenticated user object. Optional.
   * @returns A boolean indicating whether the user is allowed to view details.
   */
  canUserViewDetails(user?: IAuthUser): boolean {
    return this.isAllowed(`details`, user);
  }
  /**
   * Retrieves the label of the resource.
   * 
   * If the label is not defined, it returns a default empty string.
   * 
   * @returns {string} The label of the resource.
   */
  getLabel(): string {
    return defaultStr(this.label);
  }

  /**
   * Retrieves the title of the resource.
   * 
   * If the title is not defined, it returns a default empty string.
   * 
   * @returns {string} The title of the resource.
   */
  getTitle(): string {
    return defaultStr(this.title);
  }

  /**
   * Retrieves the tooltip of the resource.
   * 
   * If the tooltip is not defined, it returns a default empty string.
   * 
   * @returns {string} The tooltip of the resource.
   */
  getTooltip(): string {
    return defaultStr(this.tooltip);
  }

  /**
   * Retrieves the fields associated with the resource.
   * 
   * This method populates the `fields` property by invoking an external `getFields` function, 
   * which dynamically retrieves and returns all the fields related to the resource.
   * 
   * @returns {Record<string, IField>} A record containing all the fields of the resource.
   */
  getFields(): Record<string, IField> {
    this.fields = getFields(this);
    return this.fields;
  }

  /**
   * Formats a string by replacing placeholders with corresponding values from a parameters object.
   *
   * @param text - The string containing placeholders in the format `{key}` to be replaced.
   * @param params - An object containing key-value pairs where the key corresponds to the placeholder in the text and the value is the replacement.
   * @returns The formatted string with placeholders replaced by corresponding values from the params object.
   */
  sprintf(text?: string, params?: Record<string, any>): string {
    let t: string = defaultStr(text);
    if (text && isObj(params) && params) {
      for (let i in params) {
        if (!isEmpty(params[i])) {
          t = t.replaceAll(`{${i}}`, stringify(params[i]));
        }
      }
    }
    return t;
  }
  /**
   * Retrieves the label for a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which to get the label.
   * @param params - Optional parameters to format the label.
   * @returns The formatted action label.
   */
  getActionLabel(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.label, params);
  }
  /**
   * Retrieves the title of a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which the title is to be retrieved.
   * @param params - An optional record of parameters to format the title.
   * @returns The formatted title of the specified action.
   */
  getActionTitle(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.title, params);
  }
  /**
   * Retrieves the tooltip for a specified action.
   *
   * @param actionName - The name of the action for which to get the tooltip.
   * @param params - Optional parameters to format the tooltip string.
   * @returns The formatted tooltip string for the specified action.
   */
  getActionTooltip(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.tooltip, params);
  }
  /**
   * Retrieves a specific action by its name.
   *
   * @param {IResourceActionName} actionName - The name of the action to retrieve.
   * @returns {IResourceAction} The action object if found, otherwise an empty object.
   */
  getAction(actionName: IResourceActionName): IResourceAction {
    if (!isNonNullString(actionName)) return {};
    const actions = this.getActions();
    return (isObj(actions[actionName]) && actions[actionName]) || {};
  }

  /**
   * Retrieves the primary key fields from the current object's fields.
   *
   * @returns {IField[]} An array of fields that are marked as primary keys.
   */
  getPrimaryKeys(): IField[] {
    const primaryKeys: IField[] = [];
    if (isObj(this.fields)) {
      for (let i in this.fields) {
        if (isObj(this.fields[i]) && this.fields[i].primaryKey) {
          primaryKeys.push(this.fields[i]);
        }
      }
    }
    return primaryKeys;
  }
}

/**
 * Manages a collection of resources within the application.
 * 
 * The `ResourcesManager` class provides static methods to store, retrieve, and manage resource instances.
 * It maintains a global record of all instantiated resources, allowing for easy access and management.
 * Each resource is identified by a unique name, which is derived from the `IResourceName` type.
 * 
 * @example
 * // Instantiate and add resources to the manager
 * const userResource = new UserResource();
 * ResourcesManager.addResource('userResource', userResource);
 * 
 * // Retrieve the names of all resources
 * const resourceNames = ResourcesManager.getResourceNames(); 
 * console.log(resourceNames); // Output: ['userResource']
 * 
 * // Retrieve a specific resource
 * const retrievedResource = ResourcesManager.getResource<UserResource>('userResource');
 * if (retrievedResource) {
 *   console.log(retrievedResource.getLabel()); // Output: The label of the user resource
 * }
 */
export class ResourcesManager {

  /**
   * A global constant storing a record of all instantiated resources.
   * 
   * This represents a record of all resources, where the keys are derived from `IResourceName`
   * and the values are instances of `ResourceBase`.
   * 
   * @example
   * const allResources: IAllResource = {
   *   userResource: new UserResource()
   * };
   */
  private static resources: Record<IResourceName, ResourceBase> = {} as Record<IResourceName, ResourceBase>;

  /**
   * Retrieves the names of all registered resources.
   * 
   * This method returns an array of resource names that are currently managed by the `ResourcesManager`.
   * 
   * @returns {string[]} An array of resource names.
   * 
   * @example
   * const names = ResourcesManager.getResourceNames();
   * console.log(names); // Output: ['userResource', 'productResource']
   */
  public static getResourceNames() {
    return Object.keys(this.resources);
  }

  /**
   * Retrieves a resource instance by its name from the `resources` record.
   * 
   * @template ResourceInstanceType The type extending `ResourceBase` for the resource being returned.
   * @param {IResourceName} name - The name of the resource to retrieve, as defined in `IResourceName`.
   * @returns {(ResourceInstanceType | null)} The resource instance if it exists, or `null` if the resource is not found.
   * 
   * @example
   * const userResource = ResourcesManager.getResource<UserResource>('userResource');
   * if (userResource) {
   *   console.log(userResource.getLabel()); // Output: The label of the user resource
   * }
   */
  public static getResource<ResourceInstanceType extends ResourceBase = ResourceBase>(name: IResourceName): ResourceInstanceType | null {
    if (typeof name === "string" && name) {
      return this.resources[name] as ResourceInstanceType;
    }
    return null;
  }

  /**
   * Adds a new resource instance to the manager.
   * 
   * @param {IResourceName} name - The unique name of the resource to add.
   * @param {ResourceBase<DataType>} resource - The resource instance to be added.
   * @template DataType The type of data associated with the resource.
   * 
   * @example
   * const productResource = new ProductResource();
   * ResourcesManager.addResource('productResource', productResource);
   * console.log(ResourcesManager.getResourceNames()); // Output: ['userResource', 'productResource']
   */
  public static addResource<DataType = any>(name: IResourceName, resource: ResourceBase<DataType>) {
    if (typeof name === "string" && name && resource && resource instanceof ResourceBase) {
      (this.resources as IDict)[name] = resource;
    }
  }

  /**
   * Removes a resource instance from the manager by its name.
   * 
   * This method deletes the specified resource from the `resources` record. 
   * If the resource exists, it will be removed, and the updated list of resources will be returned.
   * 
   * @param {IResourceName} name - The name of the resource to be removed from the manager.
   * 
   * @returns {Record<IResourceName, ResourceBase>} The updated record of all remaining resources after the removal.
   * 
   * @example
   * // Assuming a resource named 'userResource' has been previously added
   * console.log(ResourcesManager.getResourceNames()); // Output: ['userResource', 'productResource']
   * 
   * // Remove the user resource
   * ResourcesManager.removeResource('userResource');
   * 
   * // Check the remaining resources
   * console.log(ResourcesManager.getResourceNames()); // Output: ['productResource']
   */
  public static removeResource(name: IResourceName): Record<IResourceName, ResourceBase> {
    if (typeof name === "string") {
      delete (this.resources as IDict)[name];
    }
    return this.resources;
  }


  /**
   * Retrieves all resource instances managed by the manager.
   * 
   * This method returns a record of all resources currently stored in the `ResourcesManager`.
   * The keys are derived from `IResourceName`, and the values are instances of `ResourceBase`.
   * This allows for easy access to all registered resources.
   * 
   * @returns {Record<IResourceName, ResourceBase>} A record containing all resource instances, where each key is a resource name.
   * 
   * @example
   * // Retrieve all registered resources
   * const allResources = ResourcesManager.getResources();
   * console.log(allResources); 
   * // Output: 
   * // {
   * //   userResource: UserResourceInstance,
   * //   productResource: ProductResourceInstance
   * // }
   */
  public static getResources(): Record<IResourceName, ResourceBase> {
    return this.resources;
  }
}


/***
    @interface The reflect metat key used to store resources metatdata
*/
export const resourceMetaData = Symbol("resource");

/**
 * A decorator function that adds resource metadata to a class that implements `ResourceBase`
 * 
 * This decorator stores the resource properties (`name`, `label`, `title`, `tooltip`) using Reflect metadata.
 *
 * @typeParam Datatype - An optional type representing the data that this resource holds. Defaults to `any`.
 * @param options - The properties to be set as metadata on the class.
 * 
 * @example
 * ```typescript
 * @Resource({
 *   name: "user",
 *   label: "User",
 *   title: "User Management",
 *   tooltip: "Manage user data"
 * })
 * class User {}
 * 
 * ```
 */
export function Resource<DataType = any>(options: IResource<DataType>) {
  return function (target: Function) {
    options = Object.assign({}, options);
    if (typeof target == "function") {
      try {
        ResourcesManager.addResource<DataType>((options.name as IResourceName), new (target as IConstructor)(options) as ResourceBase<DataType>);
      } catch { }
    }
    Reflect.defineMetadata(resourceMetaData, options, target);
  };
}

/**
 * Retrieves the resource metadata associated with the given target class.
 *
 * This function uses reflection to access the metadata stored on the target class using the `@Resource` decorator.
 * It returns a new object that is a copy of the metadata, which includes properties like `name`, `label`, `title`, and `tooltip`.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {ResourceBase} An object containing the resource metadata for the given target.
 */
export const getResourceMetaData = <DataType = any>(target: any): ResourceBase<DataType> => {
  return Object.assign({}, Reflect.getMetadata(resourceMetaData, target));
}
