import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IResourceData, IResourceDataService, IResourcePrimaryKey, Resource } from '@resk/core/resources';
/**
 * The `ResourceService` class is an injectable service that extends the `Resource` class.
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
export abstract class ResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends Resource<DataType, PrimaryKeyType> implements OnModuleInit, OnModuleDestroy, IResourceDataService<DataType, PrimaryKeyType> {
    onModuleDestroy() {
        this.destroy();
    }
    onModuleInit() {
        this.init();
    }
}
