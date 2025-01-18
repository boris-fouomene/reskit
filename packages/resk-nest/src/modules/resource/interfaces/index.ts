import { ApiOperationOptions } from '@nestjs/swagger';
import { IResourceName, isNonNullString, isObj, ResourcesManager } from "@resk/core";

/**
 * Represents an API operation for a resource.
 *
 * This interface extends the ApiOperationOptions from NestJS Swagger
 * to include additional properties specific to resource operations.
 *
 * @interface IResourceApiOperation
 */
export interface IResourceApiOperation extends ApiOperationOptions { }

/**
 * Describes the API operations available for a resource.
 *
 * This interface defines the operations that can be performed on a resource,
 * including getting one, getting all, creating, updating, and deleting.
 *
 * @interface IResourceApiDescription
 */
export interface IResourceApiDescription {
  /**
   * Operation for retrieving a single resource.
   */
  getOne?: IResourceApiOperation;

  /**
   * Operation for retrieving all resources.
   */
  getAll?: IResourceApiOperation;

  /**
   * Operation for creating a new resource.
   */
  create?: IResourceApiOperation;

  /**
   * Operation for updating an existing resource.
   */
  update?: IResourceApiOperation;

  /**
   * Operation for deleting a resource.
   */
  delete?: IResourceApiOperation;
}

/**
 * A collection of API descriptions for multiple resources.
 *
 * This interface extends a record type where each key is a resource name
 * and the value is the corresponding API description.
 *
 * @interface IResourceApiDescriptions
 */
export interface IResourceApiDescriptions
  extends Record<IResourceName, IResourceApiDescription> { }



declare module "@resk/core" {
  export interface IResource {
    /**
    * Optional API description for the resource.
    */
    apiDescription?: IResourceApiDescription;
  }
  export namespace ResourcesManager {
    /**
     * Builds the Swagger operation ID for a resource.
     *
     * @param {string} controllerKey - The name of the controller.
     * @param {string} methodKey - The name of the method.
     * @returns {string} The constructed operation ID.
     */
    export function buildApiOperationId(controllerKey: string, methodKey: string): string;

    /**
    * Parses a Swagger operation ID into its component parts.
    *
    * @param {string} operationId - The operation ID to parse.
    * @returns {{ controllerKey: string, methodKey: string }} An object containing the controller and method keys.
    */
    export function parseApiOperationId(operationId: string): { controllerKey: string, methodKey: string };

    /**
     * Retrieves the API description for a resource.
     *
     * @param {IResourceName} resourceName - The name of the resource.
     * @param {string} [method] - The name of the method (optional).
     * @returns {ApiOperationOptions | undefined} The API operation options or undefined if not found.
     */
    export function getApiDescription(resourceName: IResourceName, method?: string): ApiOperationOptions | undefined;

    /**
     * Retrieves the API description for a resource by class name.
     *
     * @param {string} className - The name of the class of the resource.
     * @param {string} [method] - The name of the method (optional).
     * @returns {ApiOperationOptions | undefined} The API operation options or undefined if not found.
     */
    export function getApiDescriptionByClassName(className: string, method?: string): ApiOperationOptions | undefined;
  }
}

/**
 * Builds the Swagger operation ID for a resource.
 *
 * @param {string} controllerKey - The name of the controller.
 * @param {string} methodKey - The name of the method.
 * @returns {string} The constructed operation ID.
 */
ResourcesManager.buildApiOperationId = function (controllerKey: string, methodKey: string) {
  return `${controllerKey}::${methodKey}`;
}

/**
 * Parses a Swagger operation ID into its component parts.
 *
 * @param {string} operationId - The operation ID to parse.
 * @returns {{ controllerKey: string, methodKey: string }} An object containing the controller and method keys.
 */
ResourcesManager.parseApiOperationId = function (operationId: string): { controllerKey: string, methodKey: string } {
  if (!isNonNullString(operationId)) return { controllerKey: "", methodKey: "" };
  const [controllerKey, methodKey] = operationId.split("::");
  return { controllerKey, methodKey };
}

/**
 * Retrieves the API description for a resource.
 *
 * @param {IResourceName} resourceName - The name of the resource.
 * @param {string} [method] - The name of the method (optional).
 * @returns {ApiOperationOptions | undefined} The API operation options or undefined if not found.
 */
ResourcesManager.getApiDescription = function (resourceName: IResourceName, method?: string): ApiOperationOptions | undefined {
  const resourceOptions = ResourcesManager.getMetaDataFromName(resourceName);
  if (!isObj(resourceOptions) || !isObj(resourceOptions?.apiDescription) || !isNonNullString(method)) return;
  return (resourceOptions?.apiDescription as any)[method];
}

/**
 * Retrieves the API description for a resource by class name.
 *
 * @param {string} className - The name of the class of the resource.
 * @param {string} [method] - The name of the method (optional).
 * @returns {ApiOperationOptions | undefined} The API operation options or undefined if not found.
 */
ResourcesManager.getApiDescriptionByClassName = function (className: string, method?: string): ApiOperationOptions | undefined {
  const resourceName = ResourcesManager.getMetaDataFromClassName(className)?.name;
  if (!resourceName) return;
  return ResourcesManager.getApiDescription(resourceName, method);
}