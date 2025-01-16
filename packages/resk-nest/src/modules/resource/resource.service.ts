import { Injectable } from '@nestjs/common';
import { defaultStr, IResourceDataProvider, IResourceName, IResourcePrimaryKey, ResourceBase } from '@resk/core';
import { ResourceDto } from './dto';
import { IResourceDataSource } from '../data-source/interfaces';

/**
 * The `ResourceService` class is an injectable service that extends the `ResourceBase` class.
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
 *     constructor(dataSource: IResourceDataSource) {
 *         super(dataSource);
 *     }
 *     // Additional methods for UserService can be added here
 * }
 */
@Injectable()
export class ResourceService<DataType extends ResourceDto = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceBase<DataType, PrimaryKeyType> {
  constructor(protected dataSource: IResourceDataSource) {
    super();
  }
  /***
   * Returns the data source associated with the `ResourceService` instance.
   * The data source is used to interact with the underlying data storage or service.
   */
  getDataSource(): IResourceDataSource {
    return this.dataSource;
  }
  getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType> {
    return this.getDataSource().getDataProvider<DataType, PrimaryKeyType>(this.getResourceName());
  }
  /**
  * Returns the resource name associated with the `ResourceService` instance.
  * The resource name is typically set on the `ResourceService` constructor, but if it is not set,
  * it defaults to 'resourceBase'.
  *
  * @returns {IResourceName} The resource name.
  */
  getResourceName(): IResourceName {
    return (defaultStr((this.constructor as any)["resourceName"], 'resourceBase')) as IResourceName;
  }
}
