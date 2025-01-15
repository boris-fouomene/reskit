import { Injectable } from "@nestjs/common";

/**
 * A base service class for NestJS applications.
 *
 * This class serves as a generic base for creating services in a NestJS application.
 * It can be extended to create specific services with additional functionality.
 *
 * @template DataType - The type of data that the service will handle. Defaults to `any`.
 *
 * @example
 * // Example of extending the BaseService to create a specific service
 * import { Injectable } from '@nestjs/common';
 *
 * @Injectable()
 * export class UserService extends BaseService<User> {
 *     constructor() {
 *         super();
 *     }
 *
 *     // Additional methods for UserService can be added here
 * }
 */
@Injectable()
export class BaseService<DataType = any> {
    constructor() { }
}