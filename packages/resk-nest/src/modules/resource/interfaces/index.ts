import { ApiOperationOptions } from '@nestjs/swagger';
import {
  IResourceData, IResourceName, IResourcePrimaryKey, isNonNullString, isObj, ResourcesManager
  , IResourceQueryOptions, IResourceManyCriteria,
} from "@resk/core";
import { ResourceController } from '../resource.controller';
import { Injectable } from "@nestjs/common";


declare module "@resk/core" {
  export interface IResourceMetadata<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, ClassType extends ResourceController<any> = ResourceController<any>> {
    /***
     * The name of the controller class for the resource service
     */
    controllerName?: string;
  }
}

/**
 * Abstract class for resource data services.
 * Provides a set of methods for creating, updating, deleting, and querying resources.
 *
 * @template DataType The type of resource data.
 * @template PrimaryKeyType The type of primary key for the resource.
 * @template RepositoryType The type of repository for the resource.
 */
@Injectable()
export abstract class ResourceDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, RepositoryType = any> {
  /**
   * Constructor for the resource data service.
   * Initializes the service with a repository instance.
   *
   * @param repository The repository instance for the resource.
   */
  constructor(protected readonly repository: RepositoryType) { }

  /**
   * Creates a new resource record.
   *
   * @param record The partial data for the new resource record.
   * @returns A promise that resolves to the created resource record.
   */
  abstract create(record: Partial<DataType>): Promise<DataType>;

  /**
   * Updates an existing resource record.
   *
   * @param primaryKey The primary key of the resource record to update.
   * @param updatedData The partial data for the updated resource record.
   * @returns A promise that resolves to the updated resource record.
   */
  abstract update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;

  /**
   * Deletes a resource record.
   *
   * @param primaryKey The primary key of the resource record to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  abstract delete(primaryKey: PrimaryKeyType): Promise<boolean>;

  /**
   * Finds a single resource record by primary key or query options.
   *
   * @param options The primary key or query options for the resource record to find.
   * @returns A promise that resolves to the found resource record, or null if not found.
   */
  abstract findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null>;

  /**
   * Finds a single resource record by primary key or query options, throwing an error if not found.
   *
   * @param options The primary key or query options for the resource record to find.
   * @returns A promise that resolves to the found resource record.
   */
  abstract findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType>;

  /**
   * Finds multiple resource records by query options.
   *
   * @param options The query options for the resource records to find.
   * @returns A promise that resolves to an array of found resource records.
   */
  abstract find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]>;

  /**
   * Finds multiple resource records by query options and returns the count of found records.
   *
   * @param options The query options for the resource records to find.
   * @returns A promise that resolves to an array of found resource records and the count of found records.
   */
  abstract findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]>;

  /**
   * Creates multiple resource records.
   *
   * @param data The partial data for the new resource records.
   * @returns A promise that resolves to an array of created resource records.
   */
  abstract createMany(data: Partial<DataType>[]): Promise<DataType[]>;

  /**
   * Updates multiple resource records.
   *
   * @param filter The criteria for the resource records to update.
   * @param data The partial data for the updated resource records.
   * @returns A promise that resolves to the count of updated resource records.
   */
  abstract updateMany(filter: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;

  /**
   * Deletes multiple resource records.
   *
   * @param criteria The criteria for the resource records to delete.
   * @returns A promise that resolves to the count of deleted resource records.
   */
  abstract deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;

  /**
   * Counts the number of resource records by query options.
   *
   * @param options The query options for the resource records to count.
   * @returns A promise that resolves to the count of resource records.
   */
  abstract count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number>;

  /**
   * Checks if a resource record exists by primary key.
   *
   * @param primaryKey The primary key of the resource record to check.
   * @returns A promise that resolves to a boolean indicating whether the resource record exists.
   */
  abstract exists(primaryKey: PrimaryKeyType): Promise<boolean>;

  /**
   * Returns the names of the primary columns of the resource.
   *
   * @returns An array of primary column names.
   */
  abstract getPrimaryColumnNames(): (keyof DataType)[];

  /**
   * Retrieves distinct values for a specified field.
   *
   * @param field The field for which to retrieve distinct values.
   * @returns A promise that resolves to an array of distinct values.
   * @throws Will throw an error if the method is not implemented.
   */
  distinct?(field: keyof DataType): Promise<any[]> {
    throw new Error("Method distinct not implemented.");
  }

  /**
   * Performs aggregation on the resource data using a specified pipeline.
   *
   * @param pipeline The aggregation pipeline to apply.
   * @returns A promise that resolves to an array of aggregated results.
   * @throws Will throw an error if the method is not implemented.
   */
  aggregate?(pipeline: any[]): Promise<any[]> {
    throw new Error("Method aggregate not implemented.");
  }
}


/**
 * Infers the data type of a resource controller.
 * 
 * This type is used to extract the data type from a resource controller.
 * It uses the `infer` keyword to infer the type of the data.
 * 
 * @template ControllerType The type of the resource controller.
 * @example
 * ```typescript
 * class MyController extends ResourceController<MyData, MyPrimaryKey> {}
 * 
 * type MyDataType = IResourceControllerInferDataType<typeof MyController>;
 * // MyDataType is now MyData
 * ```
 * 
 * @returns The inferred data type of the resource controller.
 */
export type IResourceControllerInferDataType<ControllerType extends ResourceController<any, any>> = ControllerType extends ResourceController<infer D, any> ? D : IResourceData;

/**
 * Infers the primary key type of a resource controller.
 * 
 * This type is used to extract the primary key type from a resource controller.
 * It uses the `infer` keyword to infer the type of the primary key.
 * 
 * @template ControllerType The type of the resource controller.
 * @example
 * ```typescript
 * class MyController extends ResourceController<MyData, MyPrimaryKey> {}
 * 
 * type MyPrimaryKeyType = IResourceControllerInferPrimaryKey<typeof MyController>;
 * // MyPrimaryKeyType is now MyPrimaryKey
 * ```
 * 
 * @returns The inferred primary key type of the resource controller.
 */
export type IResourceControllerInferPrimaryKey<ControllerType extends ResourceController<any, any>> = ControllerType extends ResourceController<any, infer S> ? S : IResourcePrimaryKey;