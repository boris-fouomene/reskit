import { Injectable } from '@nestjs/common';
import { IResourceData, IResourceDataService, IResourcePrimaryKey, ResourceBase } from '@resk/core';
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
export abstract class ResourceService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceBase<DataType, PrimaryKeyType> implements IResourceDataService<DataType, PrimaryKeyType> { }
