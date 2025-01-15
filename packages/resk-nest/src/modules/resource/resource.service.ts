import { Injectable } from '@nestjs/common';
import { IResourceDataProvider, IResourceName, IResourcePaginatedResult, IResourcePrimaryKey } from '@resk/core';
import { BaseService } from '../base/base.service';
import { ResourceDto } from './dto';
import { ResourceDataProviderService } from '../data-provider/data-provider.service';

/**
 * The `ResourceService` class is an injectable service that extends the `BaseService` class.
 * It provides a generic implementation for managing resources in a NestJS application.
 *
 * The `ResourceService` class is parameterized with two type parameters:
 * - `DataType`: Extends the `ResourceDto` class, representing the data type of the resource.
 * - `PrimaryKeyType`: Extends the `IResourcePrimaryKey` interface, representing the primary key type of the resource.
 *
 * @template DataType - The type of data that the service will handle. Defaults to `ResourceDto`.
 * @template PrimaryKeyType - The type of the primary key for the resource. Defaults to `IResourcePrimaryKey`.
 *
 * @example
 * // Example of extending the ResourceService for a specific resource
 * import { Injectable } from '@nestjs/common';
 * import { UserDto } from './dto/user.dto';
 *
 * @Injectable()
 * export class UserService extends ResourceService<UserDto> {
 *     constructor(dataProvider: ResourceDataProviderService<UserDto>) {
 *         super(dataProvider);
 *     }
 *
 *     // Additional methods for UserService can be added here
 * }
 */
@Injectable()
export class ResourceService<DataType extends ResourceDto = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends BaseService<DataType> {
  constructor(protected dataProvider: ResourceDataProviderService<DataType, PrimaryKeyType>) {
    super();
  }
  /**
   * Returns the `IResourceDataProvider` instance associated with the `ResourceService`.
   *
   * @returns {IResourceDataProvider<DataType, PrimaryKeyType>} The data provider instance.
   */
  getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType> {
    return this.dataProvider;
  }
  /**
  * Returns the resource name associated with the `ResourceService` instance.
  * The resource name is typically set on the `ResourceService` constructor, but if it is not set,
  * it defaults to 'resourceBase'.
  *
  * @returns {IResourceName} The resource name.
  */
  getResourceName(): IResourceName {
    return ((this.constructor as any)["resourceName"] || 'resourceBase') as IResourceName;
  }
  /**
   * Retrieves all records from the data provider.
   *
   * @returns {Promise<IResourcePaginatedResult<DataType>>} A promise that resolves to the paginated result.
   */
  getAll() {
    return this.dataProvider.list();
  }
  /**
   * Creates a new record in the data provider.
   *
   * @param {Partial<DataType>} record - The record to create.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
   */
  create(record: Partial<DataType>) {
    return this.dataProvider.create(record);
  }
  /**
   * Updates an existing record in the data provider.
   *
   * @param {PrimaryKeyType} id - The primary key of the record to update.
   * @param {Partial<DataType>} record - The updated data for the record.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
   */
  update(id: PrimaryKeyType, record: Partial<DataType>) {
    return this.dataProvider.update(id, record);
  }
  /**
   * Deletes a record from the data provider.
   *
   * @param {PrimaryKeyType} id - The primary key of the record to delete.
   * @returns {Promise<IResourceOperationResult<any>>} A promise that resolves to the operation result.
   */
  delete(id: PrimaryKeyType) {
    return this.dataProvider.delete(id);
  }
  /**
   * Retrieves a single record from the data provider.
   *
   * @param {PrimaryKeyType} id - The primary key of the record to retrieve.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
   */
  getOne(id: PrimaryKeyType) {
    return this.dataProvider.read(id);
  }
  /**
     * Retrieves detailed information about a record.
     *
     * @param {PrimaryKeyType} id - The primary key of the record to retrieve details for.
     * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
     */
  getDetails(id: PrimaryKeyType) {
    return this.dataProvider.details(id);
  }
}
