import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { i18n, IResourceData, IResourceDataService, IResourceManyCriteria, IResourcePaginatedResult, IResourcePrimaryKey, IResourceQueryOptions, isNonNullString, isObj, ResourcePaginationHelper } from '@resk/core';
import mongoose, { ClientSession, FilterQuery, Model, ObjectId, QueryWithHelpers } from 'mongoose';
import { Connection, Schema } from 'mongoose';
import { stringify } from "@resk/core";
import { cp } from 'fs';

export interface IMongooseDataType extends IResourceData {
    _id?: ObjectId;
}
@Injectable()
export class MongooseDataService<DataType extends IMongooseDataType = any, PrimaryKeyType extends IResourcePrimaryKey = ObjectId> implements IResourceDataService<DataType, PrimaryKeyType> {
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
        } catch (error: any) {
            await session.abortTransaction();
            await session.endSession();
            throw error instanceof HttpException ? error : new HttpException(stringify(error), error?.statusCode ?? 500);
        }
    }
    buildFindOptions(options: PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>): Omit<IResourceQueryOptions<DataType>, "where"> & { where?: FilterQuery<DataType> } {
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
        const result = Object.assign({}, options) as IResourceQueryOptions<DataType>;
        if (isObj(result.where)) {
            const { limit, skip } = ResourcePaginationHelper.normalizePagination(options as IResourceQueryOptions<DataType>);
            if (limit) {
                (result as any).limit = limit;
            }
            if (skip) {
                (result as any).skip = skip;
            }
        }
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
        return this.executeInTransaction(async (session) => {
            const model = this.getModel();
            const findOptions = this.buildFindOptions(primaryKey);
            const result = await model.findOneAndUpdate(findOptions.where ?? {}, updatedData, { new: true, session });
            if (!result) {
                throw new NotFoundException(i18n.t("resources.notFoundError"));
            }
            return result;
        });
    }
    delete(primaryKey: PrimaryKeyType): Promise<boolean> {
        return this.executeInTransaction(async (session) => {
            return await !!this.getModel().findByIdAndDelete(primaryKey).session(session);
        });
    }
    performQuery<ResultType>(query: any, options: IResourceQueryOptions<DataType>): Promise<ResultType> {
        const { orderBy } = options;
        const { limit, skip } = ResourcePaginationHelper.normalizePagination(options);
        if (typeof skip == "number" && skip && typeof query.skip == "function") {
            query.skip(skip);
        }
        if (typeof limit == "number" && limit && typeof query.limit == "function") {
            query.limit(limit);
        }
        if (isObj(orderBy) && Object.getSize(orderBy, true) > 0) {
            const sortObj: Record<string, "asc" | "desc"> = {};
            for (const [key, value] of Object.entries(orderBy as any)) {
                const sortOrder = String(value).toLowerCase();
                if (isNonNullString(key) && ["asc", "desc"].includes(sortOrder)) {
                    sortObj[key] = sortOrder as "asc" | "desc";
                }
            }
            if (Object.getSize(sortObj, true) > 0) {
                query.sort(sortObj);
            }
        }
        return query.exec();
    }
    findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null> {
        const findOptions = this.buildFindOptions(options);
        return this.performQuery(this.getModel().findOne(findOptions.where), findOptions);
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        const d = this.findOne(options);
        if (!d || d === null) {
            throw new NotFoundException(i18n.t("resources.notFoundError"));
        }
        return d as Promise<DataType>;
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]> {
        const opts = Object.assign({}, options);
        const { where } = opts;
        return this.performQuery(this.getModel().find(where ?? {}), opts);
    }
    async findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]> {
        const findOptions = this.buildFindOptions(options ?? {});
        const { where } = findOptions;
        const data = await this.find(options);
        return [data, await this.getModel().countDocuments(where ?? {})];
    }
    async findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        options = Object.assign({}, options);
        const [data, count] = await this.findAndCount(options);
        return ResourcePaginationHelper.paginate(data, count, options);
    }
    createMany(data: Partial<DataType>[]): Promise<DataType[]> {
        return this.executeInTransaction(async (session) => {
            return this.getModel().insertMany(data, { session }) as unknown as Promise<DataType[]>;
        });
    }
    updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
        const findOptions = this.buildFindOptions(criteria as any);
        return this.executeInTransaction(async (session) => {
            const { where } = findOptions;
            return (await this.getModel().updateMany(where, data, { session })).modifiedCount;
        });
    }
    deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
        return this.executeInTransaction(async (session) => {
            const findOptions = this.buildFindOptions(criteria as any);
            const { where } = findOptions;
            return (await this.getModel().deleteMany(where, { session })).deletedCount;
        });
    }
    count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number> {
        const findOptions = this.buildFindOptions(options ?? {});
        const { where } = findOptions;
        return this.getModel().countDocuments(where ?? {});
    }
    async exists(primaryKey: PrimaryKeyType): Promise<boolean> {
        return await this.count(primaryKey as any) > 0
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