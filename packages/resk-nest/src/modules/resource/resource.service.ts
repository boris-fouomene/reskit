import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { defaultStr, IResourceData, IResourceManyCriteria, IResourceName, IResourcePrimaryKey, ResourceBase, ResourcesManager } from '@resk/core';
import { IDataServiceRepository, ResourceDataService, ResourceDataServiceBase } from '../data-source';
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
  getRepository(): RepositoryType {
    return this.dataService.getRepository();
  }
  getRepositoryAs<DataServiceRepository extends IDataServiceRepository>(): DataServiceRepository {
    return this.dataService.getRepositoryAs();
  }
  checkPermissionAction(actionPerm: () => boolean, i18nActionKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super.checkPermissionAction(actionPerm, i18nActionKey).then(res => {
        resolve(res)
      }).catch(error => {
        resolve(true);
        return;
        reject(new HttpException(
          { status: HttpStatus.FORBIDDEN, error: (error instanceof Error) ? error.message : error },
          HttpStatus.FORBIDDEN,
        ));
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

  create(record: Partial<DataType>): Promise<DataType> {
    return super.create(record);
  }
  update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType> {
    return super.update(primaryKey, updatedData);
  }
  delete(primaryKey: PrimaryKeyType): Promise<boolean> {
    return super.delete(primaryKey);
  }
  updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
    return super.updateMany(criteria, data);
  }
  deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
    return super.deleteMany(criteria);
  }
}
