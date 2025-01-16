import { IResourcePrimaryKey, IResourceOperationResult, IResourcePaginatedResult, IResourceQueryOptions, IResourceDataProvider, isNonNullString, defaultStr } from "@resk/core";
import { DynamicModule, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";



export interface IResourceEntity extends Record<string, any> { }

@Injectable()
export abstract class ResourceRepository<DataType = any> implements IResourceDataProvider<DataType> {
    abstract create(record: Partial<DataType>): Promise<IResourceOperationResult<DataType>>;
    abstract update(primaryKey: IResourcePrimaryKey, updatedData: Partial<DataType>): Promise<IResourceOperationResult<DataType>>;
    abstract delete(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<any>>;
    abstract findOne(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<DataType | null>>;
    abstract find(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>>;
    abstract findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>>;
    abstract createMany(data: Partial<DataType>[]): Promise<IResourceOperationResult<DataType[]>>;
    abstract updateMany(data: Partial<DataType>): Promise<IResourceOperationResult<DataType[]>>;
    abstract deleteMany(criteria: IResourceQueryOptions<DataType>): Promise<IResourceOperationResult<any[]>>;
    abstract count(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourceOperationResult<number>>;
    abstract exists(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<boolean>>;
    distinct?(field: keyof DataType, options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourceOperationResult<DataType[]>> {
        throw new Error("Method distinct not implemented.");
    }
    aggregate?(pipeline: any[]): Promise<IResourceOperationResult<any[]>> {
        throw new Error("Method aggregate not implemented.");
    }
    async findOneOrFail(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<DataType>> {
        const result = await this.findOne(primaryKey);
        if (!result) {
            throw new NotFoundException(`Entity not found with primary key: ${JSON.stringify(primaryKey)}`);
        }
        return result as IResourceOperationResult<DataType>;
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
    injectEntity: (Entity: EntityType, ...args: any[]) => any,
    entities?: EntityType[];
    forRoot: (...args: any[]) => Promise<DynamicModule>;
}

export class DataSourceManager {
    private static dataSourceMetaData: symbol = Symbol('repositoriesMetaData');
    static getDefaultDataSourceName(): IDataSourceName {
        return 'typeorm';
    }
    /***
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
    static getDataSourceEntities<EntityType = any>(dataSourceName: IDataSourceName): EntityType[] {
        const metaData = this.get(dataSourceName);
        return (Array.isArray(metaData?.entities) ? metaData.entities : []) as EntityType[];
    }
    static getAll(): Record<IDataSourceName, IDataSourceMetaData> {
        return Object.assign({}, Reflect.getMetadata(this.dataSourceMetaData, DataSourceManager));
    }
    static get<EntityType = any>(dataSourceName: IDataSourceName): IDataSourceMetaData<EntityType> | undefined {
        if (!isNonNullString(dataSourceName)) return undefined;
        return this.getAll()[dataSourceName] || undefined;
    }
    static getDefault(): IDataSourceMetaData | undefined {
        const defaultDataSourceName = this.getDefaultDataSourceName();
        if (!defaultDataSourceName) return undefined;
        return this.getAll()[defaultDataSourceName] || undefined;
    }
    static async forRoot(dataSourceName: IDataSourceName, ...args: any[]): Promise<DynamicModule | undefined> {
        dataSourceName = defaultStr(dataSourceName, this.getDefaultDataSourceName()) as IDataSourceName;
        return await this.get(dataSourceName)?.forRoot(...args);
    }
    static inject(entity: IResourceRepositoryEntity, ...args: any[]): ReturnType<typeof Inject> {
        const defaultRepository = this.getDefault();
        if (!defaultRepository) {
            throw new Error('No default repository found');
        }
        return Inject(defaultRepository.injectEntity(entity, ...args));
    }
}
/**
 * Injects the default repository for the provided entity using the Inject decorator from @nest/common.
 * @param entity - The entity for which to inject the repository.
 * @returns The injected repository.
 */
export function InjectEntity<EntityType extends IResourceRepositoryEntity = any>(entity: EntityType) {
    console.log("injecting ", entity, " is entity")
    return Inject(DataSourceManager.inject(entity));
};


export function DataSource<EntityType = any>(options: IDataSourceMetaData<EntityType>): ClassDecorator {
    return (target: Function) => {
        DataSourceManager.register<EntityType>(options);
    };
}


@DataSource<EntityClassOrSchema>({
    name: 'typeorm',
    injectEntity: (Entity, ...args: any[]) => getRepositoryToken(Entity, ...args),
    forRoot: async (options?: TypeOrmModuleOptions) => {
        const r = await TypeOrmModule.forRoot(options);
        return {
            ...Object.assign({}, r),
            imports: [TypeOrmModule, ...(Array.isArray(r.imports) ? r.imports : [])],
        };
    },
})
export class TypeOrmRepository<DataType extends IResourceEntity = any> extends ResourceRepository<DataType> {
    async create(data: Partial<DataType>) {
        const entity = this.repository.create();
        const result = await this.repository.save(entity, { data });
        return { data: result, success: true };
    }
    async update(primaryKey: IResourcePrimaryKey, updatedData: Partial<DataType>) {
        await this.repository.update(primaryKey, updatedData as any);
        return this.findOneOrFail(primaryKey);
    }
    async delete(primaryKey: IResourcePrimaryKey) {
        const result = await this.repository.delete(primaryKey);
        return {
            data: result,
        };
    }
    async findOne(primaryKey: IResourcePrimaryKey) {
        try {
            const data = await this.repository.findOne(primaryKey);
            return { data, success: true };
        } catch (error) {
            return { error, data: null };
        }
    }
    async find(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        options = Object.assign({}, options);
        const data = await this.repository.find({
            ...options,
            take: typeof options?.limit === 'number' ? options.limit : undefined,
        });
        return { data, success: true };
    }
    async findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        const [data, count] = await this.repository.findAndCount(options);
        return { data, success: true, meta: { total: count } };
    }
    createMany(data: Partial<DataType>[]): Promise<IResourceOperationResult<DataType[]>> {
        throw new Error("Method not implemented.");
    }
    updateMany(data: Partial<DataType>): Promise<IResourceOperationResult<DataType[]>> {
        throw new Error("Method not implemented.");
    }
    deleteMany(criteria: IResourceQueryOptions<DataType>): Promise<IResourceOperationResult<any[]>> {
        throw new Error("Method not implemented.");
    }
    async count(options?: IResourceQueryOptions<DataType> | undefined) {
        const data = await this.repository.count(options);
        return { data, success: true };
    }
    async exists(primaryKey: IResourcePrimaryKey) {
        const data = await this.repository.exists(primaryKey);
        return { data, success: true };
    }
    constructor(private readonly repository: Repository<DataType>) {
        super();
    }
    getRepository(): Repository<DataType> {
        return this.repository;
    }
}