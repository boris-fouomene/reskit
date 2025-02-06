
import { BadRequestException, Injectable } from "@nestjs/common";
import { i18n, IClassConstructor, IMongoQuery, IResourceData, IResourceDataService, IResourceManyCriteria, IResourcePrimaryKey, IResourceQueryOptions, isNonNullString, isObj, ResourcePaginationHelper } from "@resk/core";
import { DataSource, DeepPartial, EntityManager, In, QueryRunner, Repository, FindOptionsWhere, FindManyOptions, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, Not, ILike, IsNull, Like } from "typeorm";


/***
 * The `TypeOrmDataService` class is an implementation of the `IResourceDataService` interface that uses TypeORM as the underlying data storage. It provides methods for performing CRUD operations on entities within a transaction, ensuring atomicity and consistency of the database operations.

The class has the following key features:

- It initializes the primary and regular columns of the entity being managed, and provides methods to access them.
- The `getManager()` and `getDataSource()` methods return the `EntityManager` and `DataSource` instances associated with the service, respectively.
- The `executeInTransaction()` method executes a set of database operations within a transaction, ensuring that all operations are executed atomically.
- The `create()`, `update()`, `delete()`, `createMany()`, `updateMany()`, and `deleteMany()` methods provide CRUD operations on entities, with the ability to perform them within a transaction.
- The `findOneOrFail()`, `findOne()`, `find()`, `findAndCount()`, `count()`, and `exists()` methods provide various ways to retrieve entities based on the provided options.
- The `throwError()` method is a helper method that throws a `BadRequestException` with the specified error message.
- The `getRepository()` and `getRepositoryAs()` methods provide access to the underlying `Repository` instance.
- The `buildFindOptions()` method is a helper method that constructs the appropriate `IResourceQueryOptions` object based on the provided options.
- The `findAndPaginate()` method retrieves a paginated result set of entities based on the provided options.
 */
@Injectable()
export class TypeOrmDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> implements IResourceDataService<DataType, PrimaryKeyType> {
    private readonly primaryColumns: Record<string, any> = {};
    private readonly columns: Record<string, any> = {};
    private readonly primaryColumnsNames: string[] = [];
    constructor(protected readonly dataSource: DataSource, readonly entity: IClassConstructor<DataType>) {
        const repository = this.getRepository();
        repository.metadata.columns.map((column) => {
            if (column.isPrimary) {
                this.primaryColumns[column.propertyName] = column;
                this.primaryColumnsNames.push(column.propertyName);
            }
            this.columns[column.propertyName] = column;
        });
    }
    /***
     * Returns the entity manager associated with the `IResourceDataService` instance.
     * The entity manager is used to interact with the underlying data storage or service.
     * @returns {EntityManager} The entity manager associated with the `IResourceDataService` instance.
     */
    getManager(): EntityManager {
        return this.getRepository().manager;
    }
    /***
     * Returns the data source associated with the `IResourceDataService` instance.
     * The data source is used to interact with the underlying data storage or service.
     * @returns {DataSource} The data source associated with the `IResourceDataService` instance.
     */
    getDataSource() {
        return this.dataSource;
    }
    /**
    * Executes a set of database operations within a transaction.
    *
    * This method ensures that all operations performed within the provided callback
    * are executed atomically. If any operation fails, the entire transaction is rolled back.
    * If all operations succeed, the transaction is committed.
    *
    * @template ReturnType- The type of the result returned by the callback function.
    * @param {Function} callback - A function that performs database operations within the transaction.
    *                              It receives a `QueryRunner` instance as its parameter, which can be used
    *                              to execute queries and manage the transaction.
    * @returns {Promise<ReturnType>} - The result of the callback function if the transaction succeeds.
    * @throws {Error} - If any error occurs during the transaction, it is thrown after rolling back.
    *
    * @example
    * // Example 1: Updating an entity within a transaction
    * const updatedEntity = await dataService.executeInTransaction(async (queryRunner) => {
    *     const entity = await queryRunner.manager.findOne(DataType, { where: { id: 1 } });
    *     if (!entity) {
    *         this.throwError('Entity not found');
    *     }
    *     entity.name = 'Updated Name';
    *     return queryRunner.manager.save(entity);
    * });
    * console.log('Updated Entity:', updatedEntity);
    *
    * @example
    * // Example 2: Performing multiple operations within a transaction
    * await dataService.executeInTransaction(async (queryRunner) => {
    *     const entity1 = new DataType();
    *     entity1.name = 'Entity 1';
    *     await queryRunner.manager.save(entity1);
    *
    *     const entity2 = new DataType();
    *     entity2.name = 'Entity 2';
    *     await queryRunner.manager.save(entity2);
    * });
    * console.log('Transaction completed successfully');
    */
    async executeInTransaction<ReturnType>(callback: (queryRunner: QueryRunner) => Promise<ReturnType>): Promise<ReturnType> {
        // Create a new QueryRunner instance to manage the transaction
        const queryRunner = this.getDataSource().createQueryRunner();
        // Connect the QueryRunner to the database
        await queryRunner.connect();
        // Start a new transaction
        await queryRunner.startTransaction();
        try {
            // Execute the callback function, passing the QueryRunner to it
            const result = await callback(queryRunner) as ReturnType;
            // Commit the transaction if the callback succeeds
            await queryRunner.commitTransaction();
            // Return the result of the callback
            return result;
        } catch (error) {
            // Roll back the transaction if an error occurs
            await queryRunner.rollbackTransaction();
            // Re-throw the error to propagate it to the caller
            this.throwError(error as Error); // Re-throw the error after rolling back
        } finally {
            // Release the QueryRunner to clean up resources
            await queryRunner.release();
        }
    }
    getPrimaryColumnNames(): (keyof DataType)[] {
        return Object.keys(this.primaryColumns);
    }
    /**
    * Creates a single entity within a transaction.
    *
    * @param {Partial<DataType>} data - The data to create the entity with.
    * @returns {Promise<DataType>} - The created entity.
    *
    * @example
    * const newEntity = await dataService.createOne({ name: 'New Entity' });
    * console.log('Created Entity:', newEntity);
    */
    async create(data: Partial<DataType>) {
        return this.executeInTransaction(async (queryRunner) => {
            const entiity = this.getRepository().create(data as DeepPartial<DataType>);
            return await queryRunner.manager.save(entiity);
        });
    }
    /**
     * Updates a single entity within a transaction.
     *
     * @param {PrimaryKeyType} primaryKey - The ID of the entity to update.
     * @param {Partial<DataType>} dataToUpdate - The new data to update the entity with.
     * @returns {Promise<DataType>} - The updated entity.
     * @throws {Error} - If the entity is not found.
     *
     * @example
     * const updatedEntity = await dataService.updateOne(1, { name: 'Updated Name' });
     * console.log('Updated Entity:', updatedEntity);
     */
    async update(primaryKey: PrimaryKeyType, dataToUpdate: Partial<DataType>) {
        const findOptions = this.buildFindOptions(primaryKey);
        if (!findOptions.where || !isObj(findOptions.where) || !Object.getSize(findOptions.where, true)) this.throwError(i18n.t("typeorm.invalidWhereConditionOnUpdate"));
        return this.executeInTransaction(async (queryRunner) => {
            const entity = await this.getRepository().findOneBy(findOptions.where ?? {});
            if (!entity) {
                this.throwError(i18n.t("typeorm.entityNotFound", { id: JSON.stringify(primaryKey) }));
            }
            Object.assign(entity, dataToUpdate);
            return queryRunner.manager.save(entity);
        });
    }
    /**
     * Deletes a single entity within a transaction.
     *
     * @param {PrimaryKeyType} primaryKey - The ID of the entity to delete.
     * @returns {Promise<void>}
     * @throws {Error} - If the entity is not found.
     *
     * @example
     * await dataService.deleteOne(1);
     * console.log('Entity deleted successfully');
     */
    async delete(primaryKey: PrimaryKeyType) {
        const findOptions = this.buildFindOptions(primaryKey);
        if (!findOptions.where || !isObj(findOptions.where) || !Object.getSize(findOptions.where, true)) this.throwError(i18n.t("typeorm.invalidWhereConditionOnDelete"));
        return this.executeInTransaction(async (queryRunner) => {
            const entity = await this.getRepository().findOneBy(findOptions.where ?? {});
            if (!entity) {
                this.throwError(i18n.t("typeorm.entityNotFound", { id: JSON.stringify(primaryKey) }));
            }
            return await !!queryRunner.manager.remove(entity);
        });
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        return this.getRepository().findOneOrFail(this.buildFindOptions(options));
    }
    async findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>) {
        try {
            return await this.getRepository().findOne(this.buildFindOptions(options));
        } catch (error) {
            return null;
        }
    }
    async find(options?: IResourceQueryOptions<DataType> | undefined) {
        return await this.getRepository().find(options ? this.buildFindOptions(options) : undefined);
    }
    async findAndCount(options?: IResourceQueryOptions<DataType>) {
        return await this.getRepository().findAndCount(options ? this.buildFindOptions(options) : undefined);
    }
    async count(options?: IResourceQueryOptions<DataType>) {
        return await this.getRepository().count(options ? this.buildFindOptions(options) : undefined);
    }
    async exists(primaryKey: PrimaryKeyType) {
        return await this.getRepository().exists(this.buildFindOptions(primaryKey));
    }
    /**
     * Creates multiple entities within a transaction.
     *
     * @param {Partial<DataType>[]} data - An array of data objects to create entities with.
     * @returns {Promise<DataType[]>} - The array of created entities.
     *
     * @example
     * const newEntities = await dataService.createMany([
     *     { name: 'Entity 1' },
     *     { name: 'Entity 2' },
     * ]);
     * console.log('Created Entities:', newEntities);
     */
    async createMany(data: Partial<DataType>[]) {
        return this.executeInTransaction(async (queryRunner) => {
            const entities = this.getRepository().create(data as DeepPartial<DataType>[]);
            return queryRunner.manager.save(entities);
        });
    }
    /**
    * Updates multiple entities within a transaction.
    *
    * @param {IResourceManyCriteria<DataType, PrimaryKeyType>} criteria - The criteria to filter the entities to update.
    * @param {Partial<SomeEntity>} data - The new data to update the entities with.
    * @returns {Promise<SomeEntity[]>} - The array of updated entities.
    * @throws {Error} - If any of the entities are not found.
    *typeorm.
    * @example
    * const updatedEntities = await dataService.updateMany([1, 2], { name: 'Updated Name' });
    * console.log('Updated Entities:', updatedEntities);
    */
    async updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
        const findOptions = this.buildFindOptions(criteria as any);
        if (!findOptions.where || !isObj(findOptions.where) || !Object.getSize(findOptions.where, true)) this.throwError(i18n.t("typeorm.invalidWhereConditionOnUpdate"));
        return this.executeInTransaction(async (queryRunner) => {
            const entities = await this.getRepository().find(findOptions);
            entities.forEach((entity) => Object.assign(entity, data));
            return (await queryRunner.manager.save(entities)).length;
        });
    }
    /**
    * Deletes multiple entities within a transaction.
    *
    * @param {IResourceManyCriteria<DataType, PrimaryKeyType>} criteria - The criteria to filter the entities to delete.
    * @returns {Promise<void>}
    * @throws {Error} - If any of the entities are not found.
    * @example
    * await dataService.deleteMany([1, 2]);
    * console.log('Entities deleted successfully');
    */
    async deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
        return this.executeInTransaction(async (queryRunner) => {
            const findOptions = this.buildFindOptions(criteria as any);
            if (!findOptions.where || !isObj(findOptions.where) || !Object.getSize(findOptions.where, true)) this.throwError(i18n.t("typeorm.invalidWhereConditionOnDelete"));
            const entities = await this.getRepository().find(findOptions);
            return (await queryRunner.manager.remove(entities)).length;
        });
    }
    /**
     * Throws a BadRequestException with the specified error message.
     *
     * @param {string | Error} message - The error message.
     * @returns {never} - This function never returns a value; it always throws an error.
     *
     * @example
     * throwError('Something went wrong!'); // Throws an error with the message "Something went wrong!"
     */
    throwError(error: Error | string): never {
        throw new BadRequestException(error);
    }
    getRepository(): Repository<DataType> {
        return this.dataSource.getRepository(this.entity);
    }

    /**
     * Builds a TypeORM find options object from a given query options object.
     * 
     * This method takes a query options object and converts it into a TypeORM find options object.
     * It supports various query options, including filtering, sorting, and pagination.
     * 
     * @param {PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>} options - The query options object.
     * @returns {FindManyOptions<DataType>} - The TypeORM find options object.
     * @example
     * // Example usage of buildFindOptions
     * const queryOptions: IResourceQueryOptions<DataType> = {
     *   where: { name: 'John' },
     *   skip: 10,
     *   take: 20,
     * };
     * const findOptions = this.buildFindOptions(queryOptions);
     * 
     * // This would create a TypeORM find options object with the specified filtering, sorting, and pagination options.
     */
    buildFindOptions(options: PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>): FindManyOptions<DataType> {
        const contitions: IResourceQueryOptions<DataType>["where"] = {};
        const primaryColumns = this.getPrimaryColumnNames();
        const primaryColumn = primaryColumns[0];
        if (Array.isArray(options)) {
            (contitions as any)[primaryColumn] = { $in: options };
            options = { where: contitions };
        } else if (["number", "string"].includes(typeof options)) {
            const primaryColumn: keyof DataType = primaryColumns[0];
            contitions[primaryColumn] = options as (DataType[keyof DataType]);
            options = { where: contitions };
        }
        const result = Object.assign({}, options) as FindManyOptions<DataType>;
        const queryOptions = options as IResourceQueryOptions<DataType>;
        if (isObj(queryOptions) && queryOptions) {
            if (typeof queryOptions.limit === "number" && queryOptions.limit > 0) {
                (result as any).take = queryOptions.limit;
            }
            if (typeof queryOptions.skip === "number") {
                result.skip = queryOptions.skip;
            }
        }
        if (!isObj(result.where) || !Object.getSize(result.where, true)) {
            delete result.where;
        } else {
            result.where = MongoToTypeOrmConverter.convert<DataType>(result.where);
        }
        (result as any).order = isNonNullString(queryOptions.orderBy) ? [queryOptions.orderBy] : Array.isArray(queryOptions.orderBy) && queryOptions.orderBy.length ? queryOptions.orderBy : isObj(queryOptions.orderBy) ? queryOptions.orderBy : undefined;
        if (typeof queryOptions.limit === "number" && queryOptions.limit > 0) {
            (result as any).take = queryOptions.limit;
        }
        if (typeof queryOptions.skip === "number") {
            result.skip = queryOptions.skip;
        }
        return result;
    }
    async findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined) {
        options = Object.assign({}, options);
        const [data, count] = await this.findAndCount(options);
        return ResourcePaginationHelper.paginate(data, count, options);
    }
}



class MongoToTypeOrmConverter {
    /**
     * Converts MongoDB query operators to TypeORM FindOperators
     */
    private static operatorMap = {
        $eq: (value: any) => value,
        $gt: (value: any) => MoreThan(value),
        $gte: (value: any) => MoreThanOrEqual(value),
        $lt: (value: any) => LessThan(value),
        $lte: (value: any) => LessThanOrEqual(value),
        $ne: (value: any) => Not(value),
        $in: (value: any[]) => In(value),
        $nin: (value: any[]) => Not(In(value)),
        $regex: (value: string, options?: string) => {
            const pattern = `%${value}%`;
            return options?.includes('i') ? ILike(pattern) : Like(pattern);
        },
        $exists: (value: boolean) => value ? Not(IsNull()) : IsNull(),
        $elemMatch: (value: any) => Array.isArray(value) ? In(value) : undefined,
    };

    /**
     * Main conversion method
     */
    static convert<DataType = any>(mongoQuery: any): FindOptionsWhere<DataType> {
        // Handle empty query
        if (!isObj(mongoQuery) || Object.keys(mongoQuery).length === 0) {
            return {};
        }
        const whereConditions: any[] = [];
        const andConditions: any = {};
        // Process each key in the query
        for (const [key, value] of Object.entries(mongoQuery)) {
            if (key === '$or') {
                // Handle OR conditions
                if (Array.isArray(value)) {
                    const orConditions = value.map((condition: any) => {
                        return this.processCondition(condition);
                    }).filter((v) => v !== undefined);
                    if (orConditions.length) {
                        whereConditions.push(...orConditions);
                    }
                }
            } else if (key === '$and') {
                // Handle AND conditions
                if (Array.isArray(value)) {
                    (value as any).forEach((condition: any) => {
                        const processed = this.processCondition(condition);
                        if (processed !== undefined) {
                            Object.assign(andConditions, processed);
                        }
                    });
                }
            } else {
                // Handle regular field conditions
                const processed = this.processCondition({ [key]: value });
                if (processed !== undefined) {
                    Object.assign(andConditions, processed);
                }
            }
        }
        // Combine AND conditions with OR conditions
        if (Object.keys(andConditions).length > 0) {
            whereConditions.push(andConditions);
        }
        // Return array for multiple conditions, object for single condition
        return whereConditions.length > 1 ? whereConditions : whereConditions[0] || andConditions;
    }

    /**
     * Process individual conditions
     */
    private static processCondition(condition: any): any {
        const result: any = {};
        for (const [field, value] of Object.entries(condition)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Handle operator objects
                const operators = Object.keys(value);
                if (operators.some(op => op.startsWith('$'))) {
                    const v = this.convertOperators(value);
                    if (v !== undefined) {
                        result[field] = v;
                    }
                } else {
                    // Handle nested objects
                    result[field] = value;
                }
            } else {
                // Handle direct values
                result[field] = value;
            }
        }

        return result;
    }

    /**
     * Convert MongoDB operators to TypeORM operators
     */
    private static convertOperators(operatorObj: any): any {
        for (const [operator, value] of Object.entries(operatorObj)) {
            if (operator in this.operatorMap) {
                if (operator === '$regex') {
                    return this.operatorMap[operator](value as any, operatorObj.$options);
                }
                return this.operatorMap[operator as keyof typeof this.operatorMap](value);
            }
        }
        return operatorObj;
    }
}