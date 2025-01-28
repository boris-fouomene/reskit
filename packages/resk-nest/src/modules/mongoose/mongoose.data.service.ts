import { Injectable } from '@nestjs/common';
import { IResourceData, IResourceDataService, IResourceManyCriteria, IResourcePaginatedResult, IResourcePrimaryKey, IResourceQueryOptions, IResourceQueryOptionsWithMango } from '@resk/core';
import { Model, ObjectId } from 'mongoose';
import { Connection, Schema } from 'mongoose';

@Injectable()
export class MongooseDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = ObjectId> implements IResourceDataService<DataType, PrimaryKeyType> {
    constructor(protected readonly connection: Connection, protected readonly schemaName: string, protected readonly schema: Schema) { }
    create(record: Partial<DataType>): Promise<DataType> {
        return this.getModel().create(record);
    }
    update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType> {
        throw new Error('Method not implemented.');
    }
    delete(primaryKey: PrimaryKeyType): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null> {
        throw new Error('Method not implemented.');
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        throw new Error('Method not implemented.');
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]> {
        const { where } = Object.assign({}, options);
        return this.getModel().find(where as {}).exec();
    }
    findWithMango?(options: IResourceQueryOptionsWithMango<DataType>): Promise<DataType[]> {
        throw new Error('Method not implemented.');
    }
    findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]> {
        throw new Error('Method not implemented.');
    }
    findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        throw new Error('Method not implemented.');
    }
    createMany(data: Partial<DataType>[]): Promise<DataType[]> {
        throw new Error('Method not implemented.');
    }
    updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
        throw new Error('Method not implemented.');
    }
    deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
        throw new Error('Method not implemented.');
    }
    count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number> {
        throw new Error('Method not implemented.');
    }
    exists(primaryKey: PrimaryKeyType): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    distinct?(field: keyof DataType): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    aggregate?(pipeline: any[]): Promise<any[]> {
        throw new Error('Method not implemented.');
    }
    getSchemaName(): string {
        return this.schemaName
    }
    getSchema(): Schema {
        return this.schema
    }
    getConnection(): Connection {
        return this.connection
    }
    getModel(): Model<DataType> {
        return this.connection.model<DataType>(this.schemaName, this.schema);
    }
}