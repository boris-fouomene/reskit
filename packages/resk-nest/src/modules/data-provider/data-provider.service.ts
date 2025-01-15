import { Injectable } from "@nestjs/common";
import { IResourceDataProvider, IResourceFetchOptions, IResourceOperationResult, IResourcePaginatedResult, IResourcePrimaryKey } from "@resk/core";

/**
 * Service for managing resource data operations.
 *
 * This service implements the IResourceDataProvider interface and provides methods
 * for creating, reading, updating, deleting, and listing resources.
 *
 * @template DataType - The type of data that the service will handle. Defaults to `any`.
 * @template PrimaryKeyType - The type of the primary key for the resource. Defaults to `IResourcePrimaryKey`.
 *
 * @example
 * // Example of extending the ResourceDataProviderService for a specific resource
 * import { Injectable } from '@nestjs/common';
 *
 * @Injectable()
 * export class UserDataProviderService extends ResourceDataProviderService<User> {
 *     constructor() {
 *         super();
 *     }
 *
 *     // Implement specific methods for User data operations
 * }
 */
@Injectable()
export class ResourceDataProviderService<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> implements IResourceDataProvider<DataType, PrimaryKeyType> {
    constructor() { }

    /**
     * Creates a new record in the data provider.
     *
     * @param {Partial<DataType>} record - The record to create.
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    create(record: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }

    /**
     * Updates an existing record in the data provider.
     *
     * @param {PrimaryKeyType} key - The primary key of the record to update.
     * @param {Partial<DataType>} updatedData - The updated data for the record.
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    update(key: PrimaryKeyType, updatedData: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }

    /**
     * Deletes a record from the data provider.
     *
     * @param {PrimaryKeyType} key - The primary key of the record to delete.
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourceOperationResult<any>>} A promise that resolves to the operation result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    delete(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any>> {
        throw new Error("Method not implemented.");
    }

    /**
     * Reads a record from the data provider.
     *
     * @param {PrimaryKeyType} key - The primary key of the record to read.
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    read(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }

    /**
     * Retrieves detailed information about a record.
     *
     * @param {PrimaryKeyType} key - The primary key of the record to retrieve details for.
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the operation result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    details(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }

    /**
     * Lists records from the data provider.
     *
     * @param {IResourceFetchOptions<DataType, PrimaryKeyType>} [options] - Optional fetch options.
     * @returns {Promise<IResourcePaginatedResult<DataType>>} A promise that resolves to the paginated result.
     *
     * @throws {Error} Throws an error if the method is not implemented.
     */
    list(options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>> {
        throw new Error("Method not implemented.");
    }
}