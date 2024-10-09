import 'reflect-metadata';
import { ResourceBase } from '@types';
import { IDict } from '../../types/index';

/**
 * A global constant storing a record of all resource names and their corresponding `ResourceBase` types.
 * This object can be used to store different resource definitions.
 *
 * @example
 * ALL_RESSOURCES_NAMES['userResource'] = UserResource;
 */
export const ALL_RESSOURCES_NAMES: Record<string, ResourceBase> = {};

/**
 * Type representing all the possible keys from the `ALL_RESSOURCES_NAMES` object.
 * This helps in referencing the resource names dynamically.
 *
 * @example
 * const resourceName: IAllResourcesNames = 'userResource'; // valid if 'userResource' exists in ALL_RESSOURCES_NAMES
 */
export type IAllResourcesNames = keyof typeof ALL_RESSOURCES_NAMES;

/**
 * A type representing an instance of a class that extends `ResourceBase`.
 * This allows us to dynamically handle resource instances with generic types.
 *
 * @template T The specific type of `ResourceBase` being instantiated.
 * @example
 * const userResourceInstance: ResourceBaseInstance<UserResource> = new UserResource();
 */
export type ResourceBaseInstance<T extends ResourceBase<any> = ResourceBase> = { new (...args: any[]): {} } & T;

/**
 * Type representing a record of all resources, where the keys are derived from `IAllResourcesNames`
 * and the values are instances of `ResourceBaseInstance`.
 *
 * @example
 * const allResources: IAllResource = {
 *   userResource: UserResourceInstance
 * };
 */
export type IAllResource = Record<IAllResourcesNames, ResourceBaseInstance>;

/**
 * A global constant storing a record of all instantiated resources.
 * The keys correspond to resource names defined in `ALL_RESSOURCES_NAMES`,
 * and the values are the corresponding `ResourceBaseInstance`.
 *
 * @example
 * ALL_RESOURCES['userResource'] = new UserResource();
 */
export const ALL_RESOURCES: IAllResource = {} as Record<IAllResourcesNames, ResourceBaseInstance>;


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
 * @param resourceData - The properties to be set as metadata on the class.
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
export function Resource<DataType=any>(resourceData: ResourceBase<DataType>) {
  return function (target: { new (...args: any[]): {} } & ResourceBase<DataType>) {
    // Define the resource metadata on the target (class constructor)
    let name : string = typeof resourceData?.name ==="string" && resourceData?.name || "";
    if(name){
      (ALL_RESSOURCES_NAMES as IDict)[name] = typeof target;
      try {
        if(typeof target =="function"){
          ALL_RESOURCES[name] = new target() as unknown as ResourceBaseInstance;
        }
      } catch{}
    }
    Reflect.defineMetadata(resourceMetaData, resourceData, target);
  };
}

/**
 * Retrieves the fields metadata from a class target.
 *
 * This function uses reflection to access the metadata associated with the given target class.
 * It returns an object where the keys are property names, and the values are objects containing the type, name, and any additional options defined in the field metadata.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {ResourceBase<any>} An object mapping property names to their corresponding metadata, which includes the type and other options.
 * @example
 */
export const getResourceMetaData = <DataType=any>(target:any): ResourceBase<DataType> =>{
   return Object.assign({}, Reflect.getMetadata(resourceMetaData, target));
}

/**
 * Retrieves a resource instance by its name from the `ALL_RESOURCES` object.
 * 
 * @template T The type extending `ResourceBase` for the resource being returned.
 * @param {IAllResourcesNames} name - The name of the resource to retrieve, as defined in `ALL_RESOURCES_NAMES`.
 * @returns {(ResourceBaseInstance<T> | null)} The resource instance if it exists, or `null` if the resource is not found.
 * 
 * @example
 * const userResource = getResource<UserResource>('userResource');
 * if (userResource) {
 *   const instance = new userResource();
 * }
 */
export const getResource = <T extends ResourceBase<any>>(name: IAllResourcesNames): ({ new (...args: any[]): {} } & T) | null => {
  if (!name) return null;
  return ALL_RESOURCES[name] as ResourceBaseInstance<T> || null;
};


declare global {
  type IAllResourcesNames = keyof typeof ALL_RESSOURCES_NAMES;
}