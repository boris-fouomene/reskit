import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { defaultStr, IResourceData, IResourceName, IResourcePrimaryKey, ResourceBase } from '@resk/core';
import { IDataServiceRepository, ResourceDataService, ResourceDataServiceBase } from '../data-source';
import { error } from 'console';
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
 *     constructor(dataService: ResourceDataSource) {
 *         super(dataService);
 *     }
 *     // Additional methods for UserService can be added here
 * }
 */
@Injectable()
export class ResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, RepositoryType extends IDataServiceRepository = any> extends ResourceBase<DataType, PrimaryKeyType> {
  constructor(protected dataService: ResourceDataServiceBase<DataType, PrimaryKeyType, RepositoryType>) {
    super();
  }
  checkPermissionAction(actionPerm: () => boolean, i18nActionKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(true);
      return;
      super.checkPermissionAction(actionPerm, i18nActionKey).then(res => {
        resolve(res)
      }).catch(err => {
        console.log(err, " is errrrrrrrrrrr");
        throw new HttpException(error, HttpStatus.FORBIDDEN);
      })
    })
  }
  /***
   * Returns the data source associated with the `ResourceService` instance.
   * The data source is used to interact with the underlying data storage or service.
   */
  getDataService(): ResourceDataService<DataType> {
    return this.dataService;
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
