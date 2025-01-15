import { Injectable } from "@nestjs/common";
import { IResourceDataProvider, IResourceFetchOptions, IResourceOperationResult, IResourcePaginatedResult, IResourcePrimaryKey } from "@resk/core";

@Injectable()
export class ResourceDataProviderService<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> implements IResourceDataProvider<DataType, PrimaryKeyType> {
    constructor() { }
    create(record: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    update(key: PrimaryKeyType, updatedData: Partial<DataType>, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    delete(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any>> {
        throw new Error("Method not implemented.");
    }
    read(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    details(key: PrimaryKeyType, options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    list(options?: IResourceFetchOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>> {
        throw new Error("Method not implemented.");
    }
}