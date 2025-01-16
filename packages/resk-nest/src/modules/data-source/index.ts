import { IResourcePrimaryKey, IResourceOperationResult, IResourcePaginatedResult, IResourceQueryOptions, IResourceDataProvider, isNonNullString, defaultStr } from "@resk/core";
import { DynamicModule, Inject, Injectable, NotFoundException, Provider } from "@nestjs/common";
import { DataSourceOptions, Repository } from "typeorm";
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
export class ResourceBaseRepository<DataType extends IResourceEntity = any> extends ResourceRepository<DataType> {
    create(record: Partial<DataType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    update(primaryKey: IResourcePrimaryKey, updatedData: Partial<DataType>): Promise<IResourceOperationResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    delete(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<any>> {
        throw new Error("Method not implemented.");
    }
    findOne(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<DataType | null>> {
        throw new Error("Method not implemented.");
    }
    find(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        throw new Error("Method not implemented.");
    }
    findAndCount(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourcePaginatedResult<DataType>> {
        throw new Error("Method not implemented.");
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
    count(options?: IResourceQueryOptions<DataType> | undefined): Promise<IResourceOperationResult<number>> {
        throw new Error("Method not implemented.");
    }
    exists(primaryKey: IResourcePrimaryKey): Promise<IResourceOperationResult<boolean>> {
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
export class TypeOrmRepository<DataType extends IResourceEntity = any> extends ResourceRepository<DataType> {
    constructor(readonly repository: Repository<DataType>) {
        super();
    }
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
        console.log(data, " is data found ");
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
    getRepository(): Repository<DataType> {
        return this.repository;
    }
}