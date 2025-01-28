import { ApiOperationOptions } from '@nestjs/swagger';
import {
  IResourceData, IResourceName, IResourcePrimaryKey, isNonNullString, isObj, ResourcesManager
  , IResourceQueryOptions, IResourceDataService, IResourceManyCriteria, IResourceFindWhereAndCondition, IResourceFindWhereCondition, IResourceFindWhereOrCondition,
  IResourcePaginatedResult,
} from "@resk/core";
import { ResourceController } from '../resource.controller';
import { BadRequestException, Injectable } from "@nestjs/common";


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
export type IResourceApiDescription<ClassType extends ResourceController<any> = ResourceController> = {
  [methodName in keyof ClassType]?: IResourceApiOperation;
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
  export interface IResourceMetaData<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, ClassType extends ResourceController<any> = ResourceController<any>> {
    /**
    * Optional API description for the resource.
    */
    apiDescription?: IResourceApiDescription<ClassType>;

    /***
     * The name of the controller class for the resource service
     */
    controllerName?: string;
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

@Injectable()
export abstract class ResourceDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, RepositoryType = any> {
  constructor(protected readonly repository: RepositoryType) { }

  abstract create(record: Partial<DataType>): Promise<DataType>;
  abstract update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
  abstract delete(primaryKey: PrimaryKeyType): Promise<boolean>;
  abstract findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null>;
  abstract findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType>;
  abstract find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]>;
  abstract findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]>;
  abstract createMany(data: Partial<DataType>[]): Promise<DataType[]>;
  abstract updateMany(filter: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;
  abstract deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;
  abstract count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number>;
  abstract exists(primaryKey: PrimaryKeyType): Promise<boolean>;
  /***
   * Returns the names of the primary columns of the resource.
   * @returns {(keyof DataType)[]} An array of primary column names.
   */
  abstract getPrimaryColumnNames(): (keyof DataType)[];

  distinct?(field: keyof DataType): Promise<any[]> {
    throw new Error("Method distinct not implemented.");
  }
  aggregate?(pipeline: any[]): Promise<any[]> {
    throw new Error("Method aggregate not implemented.");
  }
}

