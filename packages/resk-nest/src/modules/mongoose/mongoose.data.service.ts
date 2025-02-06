import { Injectable } from '@nestjs/common';
import { IResourceData, IResourceDataService, IResourceManyCriteria, IResourcePaginatedResult, IResourcePrimaryKey, IResourceQueryOptions } from '@resk/core';
import mongoose, { ClientSession, FilterQuery, Model, ObjectId } from 'mongoose';
import { Connection, Schema } from 'mongoose';

@Injectable()
export class MongooseDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = ObjectId> implements IResourceDataService<DataType, PrimaryKeyType> {
    constructor(protected readonly connection: Connection, protected readonly schemaName: string, protected readonly schema: Schema) { }
    /***
     * Executes a set of database operations within a transaction.
     *
     * This method ensures that all operations performed within the provided callback
     * are executed atomically. If any operation fails, the entire transaction is rolled back.
     * If all operations succeed, the transaction is committed.
     *
     * @template ReturnType - The type of the result returned by the callback function.
     * @param {Function} callback - A function that performs database operations within the transaction.
     *                              It receives a `session` instance as its parameter, which can be used
     *                              to execute queries and manage the transaction.
     * @returns {Promise<ReturnType>} - The result of the callback function if the transaction succeeds.
     * @throws {Error} - If any error occurs during the transaction, it is thrown after rolling back.
     *
     * @example
     * await dataService.executeInTransaction(async (session) => {
     *     const d = /// Perform database operations here
     *     return d;
     * });
     * console.log('Updated Entity:', updatedEntity);
     */
    async executeInTransaction<ReturnType>(callback: (session: ClientSession) => Promise<ReturnType>): Promise<ReturnType> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Perform transactional operations
            const r = await callback(session);
            // Commit the transaction
            await session.commitTransaction();
            await session.endSession();
            return r;
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
    }
    buildFindOptions(options: PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>): FilterQuery<DataType> {
        const contitions: IResourceQueryOptions<DataType>["where"] = {};
        const primaryColumn = "_id";
        if (Array.isArray(options)) {
            (contitions as any)[primaryColumn] = { $in: options };
            options = { where: contitions };
        } else if ((["number", "string"].includes(typeof options) || options instanceof Schema.Types.ObjectId)) {
            (options as any) = {
                where: {
                    [primaryColumn]: options
                }
            };
        }
        const result = Object.assign({}, options) as FilterQuery<DataType>;
        /* (result as any).order = isNonNullString(queryOptions.orderBy) ? [queryOptions.orderBy] : Array.isArray(queryOptions.orderBy) && queryOptions.orderBy.length ? queryOptions.orderBy : isObj(queryOptions.orderBy) ? queryOptions.orderBy : undefined;
        if (typeof queryOptions.limit === "number" && queryOptions.limit > 0) {
            (result as any).take = queryOptions.limit;
        }
        if (typeof queryOptions.skip === "number") {
            result.skip = queryOptions.skip;
        }  */
        return result;
    }
    /***
     * Creates a single entity within a transaction.
     *
     * @param {Partial<DataType>} record - The data to create the entity with.
     * @returns {Promise<DataType>} - The created entity.
     *
     * @example
     * const newEntity = await dataService.createOne({ name: 'New Entity' });
     * console.log('Created Entity:', newEntity);
     */
    create(record: Partial<DataType>): Promise<DataType> {
        const model = this.getModel();
        return this.executeInTransaction(async (session) => new model(record).save({ session }));
    }
    update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType> {
        //return this.getModel().findByIdAndUpdate(primaryKey, updatedData, { new: true }).exec();
        throw new Error('Method not implemented.');
    }
    delete(primaryKey: PrimaryKeyType): Promise<boolean> {
        const findOptions = this.buildFindOptions(primaryKey);
        return this.executeInTransaction(async (session) => {
            return await !!this.getModel().findByIdAndDelete(findOptions).session(session);
        });
    }
    findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null> {
        return this.getModel().findOne(this.buildFindOptions(options)).exec();
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        throw new Error('Method not implemented.');
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]> {
        const { where } = Object.assign({}, options);
        return this.getModel().find(where as {}).exec();
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