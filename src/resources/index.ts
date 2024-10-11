import 'reflect-metadata';
import { IDict, IResourcesNames, IResource, IField,IResourceInstance } from '@types';
import { getFields } from '../fields';
import { isEmpty } from '@utils';
import { IConstructor } from '../types/index';
import defaultStr from '@utils/defaultStr';


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
export class ResourceBase<DataType=any> implements IResourceInstance<DataType> {
  
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


  /**
  * A type that represents a map of field names to their corresponding IField instances.
   @description this is the list of fields that are part of the resource.It's a map where each key represents a field name, and the value contains field metadata.
   Fields are created using the @Field decorator when resources are defined.
  */
   fields ?: Record<string,IField>;

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
}

/**
 * Manages a collection of resources within the application.
 * 
 * The `ResourcesManager` class provides static methods to store, retrieve, and manage resource instances.
 * It maintains a global record of all instantiated resources, allowing for easy access and management.
 * Each resource is identified by a unique name, which is derived from the `IResourcesNames` type.
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
   * This represents a record of all resources, where the keys are derived from `IResourcesNames`
   * and the values are instances of `ResourceBase`.
   * 
   * @example
   * const allResources: IAllResource = {
   *   userResource: new UserResource()
   * };
   */
  private static resources: Record<IResourcesNames, ResourceBase> = {} as Record<IResourcesNames, ResourceBase>;

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
   * @param {IResourcesNames} name - The name of the resource to retrieve, as defined in `IResourcesNames`.
   * @returns {(ResourceInstanceType | null)} The resource instance if it exists, or `null` if the resource is not found.
   * 
   * @example
   * const userResource = ResourcesManager.getResource<UserResource>('userResource');
   * if (userResource) {
   *   console.log(userResource.getLabel()); // Output: The label of the user resource
   * }
   */
  public static getResource<ResourceInstanceType extends ResourceBase = ResourceBase>(name: IResourcesNames): ResourceInstanceType | null {
    if (typeof name === "string" && name) {
      return this.resources[name] as ResourceInstanceType;
    }
    return null;
  }

  /**
   * Adds a new resource instance to the manager.
   * 
   * @param {IResourcesNames} name - The unique name of the resource to add.
   * @param {ResourceBase<DataType>} resource - The resource instance to be added.
   * @template DataType The type of data associated with the resource.
   * 
   * @example
   * const productResource = new ProductResource();
   * ResourcesManager.addResource('productResource', productResource);
   * console.log(ResourcesManager.getResourceNames()); // Output: ['userResource', 'productResource']
   */
  public static addResource<DataType = any>(name: IResourcesNames, resource: ResourceBase<DataType>) {
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
   * @param {IResourcesNames} name - The name of the resource to be removed from the manager.
   * 
   * @returns {Record<IResourcesNames, ResourceBase>} The updated record of all remaining resources after the removal.
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
  public static removeResource(name: IResourcesNames): Record<IResourcesNames, ResourceBase> {
    if (typeof name === "string") {
      delete (this.resources as IDict)[name];
    }
    return this.resources;
  }

  
  /**
   * Retrieves all resource instances managed by the manager.
   * 
   * This method returns a record of all resources currently stored in the `ResourcesManager`.
   * The keys are derived from `IResourcesNames`, and the values are instances of `ResourceBase`.
   * This allows for easy access to all registered resources.
   * 
   * @returns {Record<IResourcesNames, ResourceBase>} A record containing all resource instances, where each key is a resource name.
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
  public static getResources(): Record<IResourcesNames, ResourceBase> {
    return this.resources;
  }
}


/***
    @interface The reflect metat key used to store resources metatdata
*/
export const resourceMetaData = Symbol("resource");

/**
 * A decorator to add resource metadata to a class that implements ResourceBase.
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
export function Resource<DataType=any>(options: IResource<DataType>) {
  return function (target: Function) {
    options = Object.assign({},options);
    if(typeof target =="function"){
      try {
        ResourcesManager.addResource<DataType>((options.name as IResourcesNames),new (target as IConstructor)(options) as ResourceBase<DataType>);
      } catch{}
    }
    Reflect.defineMetadata(resourceMetaData, options, target);
  };
}

/**
 * Retrieves the fields metadata from a class target.
 *
 * This function uses reflection to access the metadata associated with the given target class.
 * It returns an object where the keys are property names, and the values are objects containing the type, name, and any additional options defined in the field metadata.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {ResourceBase} An object mapping property names to their corresponding metadata, which includes the type and other options.
 * @example
 */
export const getResourceMetaData = <DataType=any>(target:any): ResourceBase<DataType> =>{
   return Object.assign({}, Reflect.getMetadata(resourceMetaData, target));
}
