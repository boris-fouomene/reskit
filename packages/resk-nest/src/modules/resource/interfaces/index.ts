import { ApiOperationOptions } from '@nestjs/swagger';
import { IResourceName, isNonNullString, isObj, ResourcesManager } from "@resk/core";


export interface IResourceApiOperation extends ApiOperationOptions { }

export interface IResourceApiDescription {
  getOne?: IResourceApiOperation;
  getAll?: IResourceApiOperation;
  create?: IResourceApiOperation;
  update?: IResourceApiOperation;
  delete?: IResourceApiOperation;
}

export interface IResourceApiDescriptions
  extends Record<IResourceName, IResourceApiDescription> { }

export type IResourcePrimaryKey = string | number;


declare module "@resk/core" {
  export interface IResource {
    apiDescription?: IResourceApiDescription;
  }
  export interface ResourcesManager {
    /***
      build the Swagger operation id
     @param controllerKey, The name of the controller
     @param methodKey, The name of the method
   */
    buildApiOperationId(controllerKey: string, methodKey: string): string;

    /**
     * Parse a Swagger operation id into its component parts.
     * @param operationId, The operation id
     * @returns 
     */
    parseApiOperationId(operationId: string): { controllerKey: string, methodKey: string };

    /***
     * Get the api description for a resource
     * @param resourceName, The name of the resource
     * @param method, The name of the method
     * @returns ApiOperationOptions, The api operation options
     */
    getApiDescription(resourceName: IResourceName, method?: string): ApiOperationOptions | undefined;


    /***
     * Get the api description for a resource by class name
     * @param className, The name of the class of the resource
     * @param method, The name of the method
     * @returns ApiOperationOptions, The api operation options
     */
    getApiDescriptionByClassName(className: string, method?: string): ApiOperationOptions | undefined;
  }
}

/***
  build the Swagger operation id
  @param controllerKey, The name of the controller
  @param methodKey, The name of the method
*/
ResourcesManager.prototype.buildApiOperationId = function (controllerKey: string, methodKey: string) {
  return `${controllerKey}::${methodKey}`;
}

/**
 * Parse a Swagger operation id into its component parts.
 * @param operationId, The operation id
 * @returns 
 */
ResourcesManager.prototype.parseApiOperationId = function (operationId: string): { controllerKey: string, methodKey: string } {
  if (!isNonNullString(operationId)) return { controllerKey: "", methodKey: "" };
  const [controllerKey, methodKey] = operationId.split("::");
  return { controllerKey, methodKey };
}

ResourcesManager.prototype.getApiDescription = function (resourceName: IResourceName, method?: string): ApiOperationOptions | undefined {
  const resourceOptions = ResourcesManager.getOptions(resourceName);
  if (!isObj(resourceOptions) || !isObj(resourceOptions?.apiDescription) || !isNonNullString(method)) return;
  return (resourceOptions?.apiDescription as any)[method];
}

ResourcesManager.prototype.getApiDescriptionByClassName = function (className, method?: string): ApiOperationOptions | undefined {
  const resourceName = ResourcesManager.getNameByClassName(className);
  if (!resourceName) return;
  return this.getApiDescription(resourceName, method);
}