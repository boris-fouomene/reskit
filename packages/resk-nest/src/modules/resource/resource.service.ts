import { Injectable } from '@nestjs/common';
import { defaultStr, IResourceDataProvider, IResourceName, ResourceBase } from '@resk/core';
import { IResourceEntity, ResourceRepository } from '../data-source';
/**
 * The `ResourceService` class is an injectable service that extends the `ResourceBase` class.
 * It provides a generic implementation for managing resources in a NestJS application.
 *
 * The `ResourceService` class is parameterized with two type parameters:
 * - `DataType`: Extends the `ResourceDto` class, representing the data type of the resource.
 * @template DataType - The type of data that the service will handle. Defaults to `ResourceDto`.
 * @example
 * // Example of extending the ResourceService for a specific resource
 * import { Injectable } from '@nestjs/common';
 * import { UserDto } from './dto/user.dto';
 *
 * @Injectable()
 * export class UserService extends ResourceService<UserDto> {
 *     constructor(resourceRepository: ResourceDataSource) {
 *         super(resourceRepository);
 *     }
 *     // Additional methods for UserService can be added here
 * }
 */
@Injectable()
export class ResourceService<DataType extends IResourceEntity = any> extends ResourceBase<DataType> {
  constructor(protected resourceRepository: ResourceRepository<DataType>) {
    super();
  }
  /***
   * Returns the data source associated with the `ResourceService` instance.
   * The data source is used to interact with the underlying data storage or service.
   */
  getRespository(): ResourceRepository<DataType> {
    return this.resourceRepository;
  }
  getDataProvider(): IResourceDataProvider<DataType> {
    return this.getRespository();
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
