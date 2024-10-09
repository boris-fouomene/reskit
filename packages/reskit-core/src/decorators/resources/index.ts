import 'reflect-metadata';
/***
    @interface The reflect metat key used to store resources metatdata
*/
export const resourceMetaData = Symbol("resource:data");

/**
 * A decorator to add resource metadata to a class that implements IResource.
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
export function Resource<DataType=any>(resourceData: IResource<DataType>) {
  return function<T extends { new (...args: any[]): {} } & IResource<DataType>> (target: T) {
    console.log(target," is target heeein");
    // Define the resource metadata on the target (class constructor)
    Reflect.defineMetadata(resourceData, resourceData, target);
  };
}

/**
 * Retrieves the fields metadata from a class target.
 *
 * This function uses reflection to access the metadata associated with the given target class.
 * It returns an object where the keys are property names, and the values are objects containing the type, name, and any additional options defined in the field metadata.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {IResource<any>} An object mapping property names to their corresponding metadata, which includes the type and other options.
 * @example
 */
export const getResourceMetaData = <DataType=any>(target:any): IResource<DataType> =>{
   return Object.assign({}, Reflect.getMetadata(resourceMetaData, target));
}
