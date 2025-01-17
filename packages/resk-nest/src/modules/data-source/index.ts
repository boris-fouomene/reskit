import { IResourcePrimaryKey, IResourceOperationResult, IResourceData, IResourcePaginatedResult, IResourceQueryOptions, IResourceDataService, isNonNullString, defaultStr, isObj, isPrimitive, IResourceManyCriteria } from "@resk/core";
import { DynamicModule, Inject, Injectable, NotFoundException, Provider } from "@nestjs/common";
import { DataSourceOptions, DeepPartial, EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { getPrimaryKeys, PrimaryKeys } from "./decorators";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";


export interface IResourceEntity extends Record<string, any> { }

@Injectable()
export abstract class ResourceDataService<DataType extends IResourceData = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> implements IResourceDataService<DataType, PrimaryKeyType> {
    abstract create(record: Partial<DataType>): Promise<DataType>;
    abstract update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType>;
    abstract delete(primaryKey: PrimaryKeyType): Promise<boolean>;
    abstract findOne(primaryKey: PrimaryKeyType): Promise<DataType | null>;
    abstract findOneOrFail(primaryKey: PrimaryKeyType): Promise<DataType>;
    abstract find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]>;
    abstract findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]>;
    abstract findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>>;
    abstract createMany(data: Partial<DataType>[]): Promise<DataType[]>;
    abstract updateMany(filter: IResourceManyCriteria<DataType, PrimaryKeyType>, data: Partial<DataType>): Promise<number>;
    abstract deleteMany(criteria: IResourceManyCriteria<DataType, PrimaryKeyType>): Promise<number>;
    abstract count(options?: IResourceQueryOptions<DataType> | undefined): Promise<number>;
    abstract exists(primaryKey: PrimaryKeyType): Promise<boolean>;
    distinct?(field: keyof DataType): Promise<any[]> {
        throw new Error("Method distinct not implemented.");
    }
    aggregate?(pipeline: any[]): Promise<any[]> {
        throw new Error("Method aggregate not implemented.");
    }

}
export class ResourceDataServiceBase<DataType extends IResourceEntity = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceDataService<DataType, PrimaryKeyType> {
    create(record: Partial<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    update(primaryKey: PrimaryKeyType, updatedData: Partial<DataType>): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    delete(primaryKey: PrimaryKeyType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findOne(primaryKey: PrimaryKeyType): Promise<DataType | null> {
        throw new Error("Method not implemented.");
    }
    findOneOrFail(primaryKey: PrimaryKeyType): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<DataType[]> {
        throw new Error("Method not implemented.");
    }
    findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<[DataType[], number]> {
        throw new Error("Method not implemented.");
    }
    findAndPaginate(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
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

}

export interface IDataSourcesMap {
    typeorm?: any;
}

export interface IResourceRepositoryEntity {
    name: string;
}

export type IDataSourceName = keyof IDataSourcesMap;

export interface IDataSourceMetaData<EntityType = any> {
    name: IDataSourceName,
    getRepositoryToken: (Entity: EntityType, ...args: any[]) => any,
    entities?: EntityType[];
    createProviders: (...entities: EntityType[]) => Provider[];
    forRoot: <ModuleOptions = any, ModuleOptions2 = any, ModuleOptions3 = any>(options?: ModuleOptions, options2?: ModuleOptions2, options3?: ModuleOptions3, ...args: any[]) => Promise<DynamicModule>;
}

export class DataSourceManager {
    private static dataSourceMetaData: symbol = Symbol('repositoriesMetaData');
    static getDefaultDataSourceName(): IDataSourceName {
        return 'typeorm';
    }
    /***
     * 
     * register a repository
     * @param {IDataSourceMetaData} options
     */
    static register<EntityType = any>(metaData: IDataSourceMetaData<EntityType>): Record<IDataSourceName, IDataSourceMetaData<EntityType>> {
        metaData = Object.assign({}, metaData);
        metaData.entities = Array.isArray(metaData.entities) ? metaData.entities : [];
        const metadata = this.getAll();
        if (isNonNullString(metaData.name)) {
            (metadata as any)[metaData.name as IDataSourceName] = metaData;
            Reflect.defineMetadata(this.dataSourceMetaData, metadata, DataSourceManager);
        }
        return metadata;
    }
    static registerEntities<EntityType = any>(entities: EntityType[], dataSourceName?: IDataSourceName,): Record<IDataSourceName, IDataSourceMetaData<EntityType>> {
        const metaData = this.get(dataSourceName);
        const allEnt = metaData.entities = Array.isArray(metaData.entities) ? metaData.entities : [];
        (Array.isArray(entities) ? entities : []).forEach(entity => {
            if (!allEnt.includes(entity) && entity && typeof entity === 'function') {
                allEnt.push(entity);
            }
        });
        return this.register(metaData);
    }
    static getDataSourceEntities<EntityType = any>(dataSourceName: IDataSourceName): EntityType[] {
        const metaData = this.get(dataSourceName);
        return (Array.isArray(metaData?.entities) ? metaData.entities : []) as EntityType[];
    }
    static getAll(): Record<IDataSourceName, IDataSourceMetaData> {
        return Object.assign({}, Reflect.getMetadata(this.dataSourceMetaData, DataSourceManager));
    }
    static get<EntityType = any>(dataSourceName?: IDataSourceName): IDataSourceMetaData<EntityType> {
        dataSourceName = defaultStr(dataSourceName, this.getDefaultDataSourceName()) as IDataSourceName;
        return this.getAll()[dataSourceName];
    }
    static async forRoot<ModuleOptions = any, ModuleOptions2 = any, ModuleOptions3 = any>(dataSourceName: IDataSourceName, options?: ModuleOptions, options2?: ModuleOptions2, options3?: ModuleOptions3, ...args: any[]): Promise<DynamicModule> {
        const dataSourceMeta = this.get(dataSourceName);
        return await (dataSourceMeta.forRoot.bind(dataSourceMeta))<ModuleOptions, ModuleOptions2, ModuleOptions3>(options, options2, options3, ...args);
    }
    static getRepositoryToken(entity: IResourceRepositoryEntity, dataSourceName?: IDataSourceName, ...args: any[]): Parameters<typeof Inject>[0] {
        dataSourceName = defaultStr(dataSourceName, DataSourceManager.getDefaultDataSourceName()) as IDataSourceName;
        const dataSourceMeta = this.get(dataSourceName);
        if (!dataSourceMeta) {
            throw new Error('No default repository found');
        }
        dataSourceMeta.entities = Array.isArray(dataSourceMeta.entities) ? dataSourceMeta.entities : [];
        if (!dataSourceMeta.entities.includes(entity)) {
            dataSourceMeta.entities.push(entity);
        }
        const all = this.getAll();
        all[dataSourceName] = dataSourceMeta;
        Reflect.defineMetadata(this.dataSourceMetaData, all, DataSourceManager);
        return dataSourceMeta.getRepositoryToken(entity, ...args);
    }
}
/**
 * Injects the default repository for the provided entity using the Inject decorator from @nest/common.
 * @param entity - The entity for which to inject the repository.
 * @returns The injected repository.
 */
export function InjectRepository<EntityType extends IResourceRepositoryEntity = any>(entity: EntityType, dataSourceName?: IDataSourceName, ...args: any[]): PropertyDecorator & ParameterDecorator {
    DataSourceManager.registerEntities([entity], dataSourceName);
    const repositoryToken = DataSourceManager.getRepositoryToken(entity, dataSourceName, ...args);
    return Inject(repositoryToken);
};


export function DataSource<EntityType = any>(options: IDataSourceMetaData<EntityType>): ClassDecorator {
    return (target: Function) => {
        DataSourceManager.register<EntityType>(options);
    };
}


@DataSource<EntityClassOrSchema>({
    name: 'typeorm',
    getRepositoryToken: (Entity, ...args: any[]) => `${getRepositoryToken(Entity, ...args)}TypeOrm`,
    createProviders: function (...entities: EntityClassOrSchema[]) {
        return entities.map(entity => {
            return {
                provide: this.getRepositoryToken(entity),
                useFactory: (repository: Repository<typeof entity>) => new TypeOrmRepository(repository),
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
export class TypeOrmRepository<DataType extends IResourceEntity = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey> extends ResourceDataService<DataType, PrimaryKeyType> {
    private readonly primaryColumns: Record<string, ColumnMetadata> = {};
    private readonly columns: Record<string, ColumnMetadata> = {};
    private readonly primaryColumnsNames: string[] = [];
    constructor(readonly repository: Repository<DataType>) {
        super();
        repository.metadata.columns.map((column) => {
            if (column.isPrimary) {
                this.primaryColumns[column.propertyName] = column;
                this.primaryColumnsNames.push(column.propertyName);
            }
            this.columns[column.propertyName] = column;
        });
    }
    async executeInTransaction<R>(callback: (transaction: ITransaction<DataType>) => Promise<R>): Promise<R> {
        const dataSource = this.repository.manager.connection; // Get the DataSource from the repository
        return new Promise(async (resolve, reject) => {
            // Use the `transaction` method of the DataSource
            await dataSource.transaction(async (manager: EntityManager) => {
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
        await this.repository.update(this.buildConditions(primaryKey), updatedData as any);
        return this.findOneOrFail(primaryKey);
    }
    async delete(primaryKey: PrimaryKeyType) {
        const r = await this.repository.delete(this.buildConditions(primaryKey));
        return (typeof r.affected === 'number' && r.affected > 0);
    }
    findOneOrFail(primaryKey: PrimaryKeyType): Promise<DataType> {
        throw new Error("Method not implemented.");
    }
    async findOne(primaryKey: PrimaryKeyType) {
        try {
            return await this.repository.findOne({ where: this.buildConditions(primaryKey) });
        } catch (error) {
            return null;
        }
    }
    async find(options?: IResourceQueryOptions<DataType> | undefined) {
        options = Object.assign({}, options);
        return await this.repository.find({
            ...options,
            take: typeof options?.limit === 'number' && options.limit > 0 ? options.limit : undefined,
            skip: typeof options?.skip === 'number' && options.skip > 0 ? options.skip : undefined,
        });
    }
    async findAndCount(options?: IResourceQueryOptions<DataType>) {
        return await this.repository.findAndCount(options);
    }
    async count(options?: IResourceQueryOptions<DataType>) {
        return await this.repository.count(options);
    }
    async exists(primaryKey: PrimaryKeyType) {
        return await this.repository.exists({
            where: this.buildConditions(primaryKey),
        });
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
    buildConditions(primaryKey: PrimaryKeyType) {
        const condiitons: Record<string, any> = {};
        if (primaryKey && isPrimitive(primaryKey)) {
            this.primaryColumnsNames.map((column) => {
                condiitons[column] = primaryKey;
            });
        } else if (isObj(primaryKey)) {
            Object.entries(primaryKey).map(([key, value]) => {
                if (this.columns[key]) {
                    condiitons[key] = value;
                }
            });
        }
        return condiitons;
    }
    getRepository(): Repository<DataType> {
        return this.repository;
    }
}

export interface ITransactionProvider {
    startTransaction(): Promise<ITransaction>;
}

export interface ITransaction<DataType extends IResourceEntity = any> {
    commit(): Promise<void>;
    rollback(error?: any): Promise<void>;
    getRepository(): ResourceDataService<DataType>;
}
