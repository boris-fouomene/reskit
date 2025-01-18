import { IResourcePrimaryKey, IResourceData, IResourcePaginatedResult, IResourceQueryOptions, IResourceDataService, isNonNullString, defaultStr, isObj, IResourceManyCriteria, IResourceFindWhereAndCondition, IResourceFindWhereCondition, IResourceFindWhereOrCondition } from "@resk/core";
import { DynamicModule, Inject, Injectable, Provider } from "@nestjs/common";
import { DeepPartial, EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";


export interface IDataServicesMap {
    typeorm?: Repository<any>;
}

export interface IDataServiceEntity {
    name: string;
}

export type IDataServiceName = keyof IDataServicesMap;

export type IDataServiceRepository = IDataServicesMap[IDataServiceName];

@Injectable()
export abstract class ResourceDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, RepositoryType extends IDataServiceRepository = any> implements IResourceDataService<DataType, PrimaryKeyType> {
    constructor(protected readonly repository: RepositoryType) { }
    abstract getDataSeviceName(): IDataServiceName;
    getRepository(): RepositoryType {
        return this.repository;
    }
    getRepositoryAs<DataRepositoryType extends IDataServiceRepository = RepositoryType>(): DataRepositoryType {
        return this.repository as unknown as DataRepositoryType;
    }
    abstract create(record: Partial<DataType>): Promise<DataType>;
    abstract update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
    abstract delete(primaryKey: PrimaryKeyType): Promise<boolean>;
    abstract findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null>;
    abstract findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType>;
    abstract find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]>;
    abstract findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]>;
    abstract createMany(data: Partial<DataType>[]): Promise<DataType[]>;
    abstract updateMany(filter: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;
    abstract deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;
    abstract count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number>;
    abstract exists(primaryKey: PrimaryKeyType): Promise<boolean>;
    abstract executeInTransaction<R>(callback: (transaction: ITransaction<DataType>) => Promise<R>): Promise<R>;
    /***
     * Returns the names of the primary columns of the resource.
     * @returns {(keyof DataType)[]} An array of primary column names.
     */
    abstract getPrimaryColumnNames(): (keyof DataType)[];
    buildWhereCondition(options: PrimaryKeyType | PrimaryKeyType[] | IResourceQueryOptions<DataType>): Omit<IResourceQueryOptions<DataType>, "where"> & { where: IResourceFindWhereCondition<DataType> } {
        const contitions: IResourceFindWhereAndCondition<DataType> = {};
        const primaryColumns = this.getPrimaryColumnNames();
        if (["number", "string"].includes(typeof options)) {
            const primaryColumn: keyof DataType = this.getPrimaryColumnNames()[0];
            contitions[primaryColumn] = options as (DataType[keyof DataType]);
            options = { where: contitions };
        }
        if (Array.isArray(options)) {
            const where: IResourceFindWhereOrCondition = [];
            (options as PrimaryKeyType[]).map((primaryColumn: PrimaryKeyType) => {
                where.push({ [primaryColumns[0]]: primaryColumn });
            });
            options = { where };
        }
        const result = Object.assign({}, options) as Omit<IResourceQueryOptions<DataType>, "where"> & { where: IResourceFindWhereCondition<DataType> };
        if (Array.isArray(result.where) && !isObj(result.where) && typeof result.where[0] !== 'object') {
            result.where = {};
        }
        return result;
    }
    async findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined) {
        options = Object.assign({}, options);
        const [data, count] = await this.findAndCount(options);
        const meta: IResourcePaginatedResult<DataType>["meta"] = {
            total: count,
        }
        if (typeof options?.skip === 'number' && options.skip > 0 && typeof options?.limit === 'number' && options.limit > 0) {
            meta.currentPage = Math.ceil(options.skip / options.limit) + 1;
            meta.pageSize = options.limit;
            meta.totalPages = Math.ceil(count / options.limit);
            meta.hasNextPage = meta.currentPage < meta.totalPages;
            meta.hasPreviousPage = meta.currentPage > 1;
            meta.nextPage = meta.currentPage + 1;
            meta.previousPage = meta.currentPage - 1;
            meta.lastPage = meta.totalPages;
        }
        return {
            data,
            toal: count,
            meta,
        }
    }
    distinct?(field: keyof DataType): Promise<any[]> {
        throw new Error("Method distinct not implemented.");
    }
    aggregate?(pipeline: any[]): Promise<any[]> {
        throw new Error("Method aggregate not implemented.");
    }
}
export class ResourceDataServiceBase<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, RepositoryType extends IDataServiceRepository = any> extends ResourceDataService<DataType, PrimaryKeyType, RepositoryType> {
    getDataSeviceName(): IDataServiceName {
        return "typeorm";
    }
    create(record: Partial<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    delete(primaryKey: PrimaryKeyType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType | null> {
        throw new Error("Method not implemented.");
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]> {
        throw new Error("Method not implemented.");
    }
    findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]> {
        throw new Error("Method not implemented.");
    }
    createMany(data: Partial<DataType>[]): Promise<DataType[]> {
        throw new Error("Method not implemented.");
    }
    updateMany(filter: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
        throw new Error("Method not implemented.");
    }
    deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
        throw new Error("Method not implemented.");
    }
    count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number> {
        throw new Error("Method not implemented.");
    }
    exists(primaryKey: PrimaryKeyType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    executeInTransaction<R>(callback: (transaction: ITransaction) => Promise<R>): Promise<R> {
        throw new Error("Method not implemented.");
    }
    getPrimaryColumnNames(): (keyof DataType)[] {
        throw new Error("Method not implemented.");
    }
}


export interface IDataServiceMetaData<EntityType = any> {
    name: IDataServiceName,
    getDataServiceToken: (Entity: EntityType, ...args: any[]) => any,
    entities?: EntityType[];
    createProviders: (...entities: EntityType[]) => Provider[];
    forRoot: <ModuleOptions = any, ModuleOptions2 = any, ModuleOptions3 = any>(options?: ModuleOptions, options2?: ModuleOptions2, options3?: ModuleOptions3, ...args: any[]) => Promise<DynamicModule>;
}

export class DataServiceManager {
    private static dataServiceMetaData: symbol = Symbol('repositoriesMetaData');
    static getDefaultDataServiceName(): IDataServiceName {
        return 'typeorm';
    }
    /***
     * 
     * register a repository
     * @param {IDataServiceMetaData} options
     */
    static register<EntityType = any>(metaData: IDataServiceMetaData<EntityType>): Record<IDataServiceName, IDataServiceMetaData<EntityType>> {
        metaData = Object.assign({}, metaData);
        metaData.entities = Array.isArray(metaData.entities) ? metaData.entities : [];
        const metadata = this.getAll();
        if (isNonNullString(metaData.name)) {
            (metadata as any)[metaData.name as IDataServiceName] = metaData;
            Reflect.defineMetadata(this.dataServiceMetaData, metadata, DataServiceManager);
        }
        return metadata;
    }
    static registerEntities<EntityType = any>(entities: EntityType[], dataServiceName?: IDataServiceName,): Record<IDataServiceName, IDataServiceMetaData<EntityType>> {
        const metaData = this.get(dataServiceName);
        const allEnt = metaData.entities = Array.isArray(metaData.entities) ? metaData.entities : [];
        (Array.isArray(entities) ? entities : []).forEach(entity => {
            if (!allEnt.includes(entity) && entity && typeof entity === 'function') {
                allEnt.push(entity);
            }
        });
        return this.register(metaData);
    }
    static getDataServiceEntities<EntityType = any>(dataServiceName: IDataServiceName): EntityType[] {
        const metaData = this.get(dataServiceName);
        return (Array.isArray(metaData?.entities) ? metaData.entities : []) as EntityType[];
    }
    static getAll(): Record<IDataServiceName, IDataServiceMetaData> {
        return Object.assign({}, Reflect.getMetadata(this.dataServiceMetaData, DataServiceManager));
    }
    static get<EntityType = any>(dataServiceName?: IDataServiceName): IDataServiceMetaData<EntityType> {
        dataServiceName = defaultStr(dataServiceName, this.getDefaultDataServiceName()) as IDataServiceName;
        return this.getAll()[dataServiceName];
    }
    static async forRoot<ModuleOptions = any, ModuleOptions2 = any, ModuleOptions3 = any>(dataServiceName: IDataServiceName, options?: ModuleOptions, options2?: ModuleOptions2, options3?: ModuleOptions3, ...args: any[]): Promise<DynamicModule> {
        const dataServiceMeta = this.get(dataServiceName);
        return await (dataServiceMeta.forRoot.bind(dataServiceMeta))<ModuleOptions, ModuleOptions2, ModuleOptions3>(options, options2, options3, ...args);
    }
    static getDataServiceToken(entity: IDataServiceEntity, dataServiceName?: IDataServiceName, ...args: any[]): Parameters<typeof Inject>[0] {
        dataServiceName = defaultStr(dataServiceName, DataServiceManager.getDefaultDataServiceName()) as IDataServiceName;
        const dataServiceMeta = this.get(dataServiceName);
        if (!dataServiceMeta) {
            throw new Error('No default repository found');
        }
        dataServiceMeta.entities = Array.isArray(dataServiceMeta.entities) ? dataServiceMeta.entities : [];
        if (!dataServiceMeta.entities.includes(entity)) {
            dataServiceMeta.entities.push(entity);
        }
        const all = this.getAll();
        all[dataServiceName] = dataServiceMeta;
        Reflect.defineMetadata(this.dataServiceMetaData, all, DataServiceManager);
        return dataServiceMeta.getDataServiceToken(entity, ...args);
    }
}
/**
 * Injects the default repository for the provided entity using the Inject decorator from @nest/common.
 * @param entity - The entity for which to inject the repository.
 * @returns The injected repository.
 */
export function InjectDataService<EntityType extends IDataServiceEntity = any>(entity: EntityType, dataServiceName?: IDataServiceName, ...args: any[]): PropertyDecorator & ParameterDecorator {
    DataServiceManager.registerEntities([entity], dataServiceName);
    const repositoryToken = DataServiceManager.getDataServiceToken(entity, dataServiceName, ...args);
    return Inject(repositoryToken);
};


export function DataService<EntityType = any>(options: IDataServiceMetaData<EntityType>): ClassDecorator {
    return (target: Function) => {
        DataServiceManager.register<EntityType>(options);
    };
}


@DataService<EntityClassOrSchema>({
    name: 'typeorm',
    getDataServiceToken: (Entity, ...args: any[]) => `${getRepositoryToken(Entity, ...args)}TypeOrm`,
    createProviders: function (...entities: EntityClassOrSchema[]) {
        return entities.map(entity => {
            return {
                provide: this.getDataServiceToken(entity),
                useFactory: (repository: Repository<typeof entity>) => new TypeOrmDataService(repository),
                inject: [getRepositoryToken(entity)],
            };
        });
    },
    forRoot: async function (options) {
        return await TypeOrmModule.forRoot({
            ...Object.assign({}, options),
            entities: this.entities,
        });
    },
})
@Injectable()
export class TypeOrmDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceDataService<DataType, PrimaryKeyType, Repository<DataType>> {
    private readonly primaryColumns: Record<string, ColumnMetadata> = {};
    private readonly columns: Record<string, ColumnMetadata> = {};
    private readonly primaryColumnsNames: string[] = [];
    constructor(readonly repository: Repository<DataType>) {
        super(repository);
        repository.metadata.columns.map((column) => {
            if (column.isPrimary) {
                this.primaryColumns[column.propertyName] = column;
                this.primaryColumnsNames.push(column.propertyName);
            }
            this.columns[column.propertyName] = column;
        });
    }
    getPrimaryColumnNames(): (keyof DataType)[] {
        return Object.keys(this.primaryColumns);
    }

    getDataSeviceName(): IDataServiceName {
        return "typeorm";
    }
    async executeInTransaction<R>(callback: (transaction: ITransaction<DataType>) => Promise<R>): Promise<R> {
        const dataService = this.repository.manager.connection; // Get the DataService from the repository
        return new Promise(async (resolve, reject) => {
            // Use the `transaction` method of the DataService
            await dataService.transaction(async (manager: EntityManager) => {
                try {
                    // Execute the transactional operation using the EntityManager
                    const result = await callback({
                        getRepository: () => this,
                        commit: async () => {
                            resolve(result);
                        },
                        rollback: async (error) => {
                            throw (error instanceof Error ? error : new Error(error || 'Transaction rollback'));
                        },
                    });
                } catch (error) {
                    console.error('Transaction failed, rolling back.', error);
                    // Any error will automatically roll back the transaction
                    throw error; // Rethrow to propagate the error
                }
            });
        });
    }
    async create(data: Partial<DataType>) {
        const entity = this.repository.create();
        return await this.repository.save(entity, { data });
    }
    async update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>) {
        await this.repository.update(this.buildWhereCondition(primaryKey).where as FindOptionsWhere<DataType>, updatedData as any);
        return this.findOneOrFail(primaryKey);
    }
    async delete(primaryKey: PrimaryKeyType) {
        const r = await this.repository.delete(this.buildWhereCondition(primaryKey).where as FindOptionsWhere<DataType>);
        return (typeof r.affected === 'number' && r.affected > 0);
    }
    findOneOrFail(options: PrimaryKeyType | IResourceQueryOptions<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    async findOne(options: PrimaryKeyType | IResourceQueryOptions<DataType>) {
        try {
            return await this.repository.findOne(this.buildWhereCondition(options));
        } catch (error) {
            return null;
        }
    }
    async find(options?: IResourceQueryOptions<DataType> | undefined) {
        return await this.repository.find(options ? this.buildWhereCondition(options) : undefined);
    }
    async findAndCount(options?: IResourceQueryOptions<DataType>) {
        return await this.repository.findAndCount(options ? this.buildWhereCondition(options) : undefined);
    }
    async count(options?: IResourceQueryOptions<DataType>) {
        return await this.repository.count(options ? this.buildWhereCondition(options) : undefined);
    }
    async exists(primaryKey: PrimaryKeyType) {
        return await this.repository.exists(this.buildWhereCondition(primaryKey));
    }
    async createMany(data: Partial<DataType>[]) {
        const entities = this.repository.create(data as DeepPartial<DataType>[]);
        return await this.repository.save(entities);
    }
    async updateMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number> {
        const result = await this.repository.update(criteria as FindOptionsWhere<DataType>, data);
        return typeof result.affected === 'number' && result.affected > 0 ? result.affected : 0;
    }
    async deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number> {
        const result = await this.repository.delete(criteria as FindOptionsWhere<DataType>);
        return typeof result.affected === 'number' && result.affected > 0 ? result.affected : 0;
    }
    getRepository(): Repository<DataType> {
        return this.repository;
    }
}

export interface ITransactionProvider {
    startTransaction(): Promise<ITransaction>;
}

export interface ITransaction<DataType extends IResourceData = any> {
    commit(): Promise<void>;
    rollback(error?: any): Promise<void>;
    getRepository(): ResourceDataService<DataType>;
}
