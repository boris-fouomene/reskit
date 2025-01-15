import { Injectable } from '@nestjs/common';
import { IResourceDataProvider, IResourceName, IResourcePaginatedResult, IResourcePrimaryKey } from '@resk/core';
import { BaseService } from '../base/base.service';
import { ResourceDto } from './dto';
import { ResourceDataProviderService } from '../data-provider/data-provider.service';

/**
 * The `ResourceService` class is an injectable service that extends the `BaseService` class. It provides a generic implementation for managing resources in a NestJS application.
 *
 * The `ResourceService` class is parameterized with two type parameters:
 * - `DataType`: Extends the `ResourceDto` class, representing the data type of the resource.
 * - `PrimaryKeyType`: Extends the `IResourcePrimaryKey` interface, representing the primary key type of the resource.
 *
 * The `ResourceService` class has the following methods:
 *
 * - `constructor(dataProvider: IResourceDataProvider<DataType, PrimaryKeyType>)`: Initializes the `ResourceService` with a `dataProvider` instance that implements the `IResourceDataProvider` interface.
 * - `getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType>`: Returns the `dataProvider` instance associated with the `ResourceService`.
 * - `getResourceName(): IResourceName`: Returns the resource name associated with the `ResourceService` instance. If the resource name is not set, it defaults to 'resourceBase'.
 */
@Injectable()
export class ResourceService<DataType extends ResourceDto = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends BaseService<DataType> {
  constructor(protected dataProvider: ResourceDataProviderService<DataType, PrimaryKeyType>) {
    super();
  }
  /**
   * Returns the `IResourceDataProvider` instance associated with the `ResourceService`.
   */
  getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType> {
    return this.dataProvider;
  }
  /***
    * Returns the resource name associated with the `ResourceService` instance.
    * The resource name is typically set on the `ResourceService` constructor, but if it is not set,
  */
  getResourceName(): IResourceName {
    return ((this.constructor as any)["resourceName"] || 'resourceBase') as IResourceName;
  }
  getAll() {
    return this.dataProvider.list();
  }
  create(record: Partial<DataType>) {
    return this.dataProvider.create(record);
  }
  update(id: PrimaryKeyType, record: Partial<DataType>) {
    return this.dataProvider.update(id, record);
  }
  delete(id: PrimaryKeyType) {
    return this.dataProvider.delete(id);
  }
  getOne(id: PrimaryKeyType) {
    return this.dataProvider.read(id);
  }
  getDetails(id: PrimaryKeyType) {
    return this.dataProvider.details(id);
  }
}
