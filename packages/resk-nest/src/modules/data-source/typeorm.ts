
import { IResourceName, IResourcePrimaryKey } from '@resk/core';
import { DataSource, DataSourceOptions } from 'typeorm';
import { IResourceDataProvider, IResourceDataSource } from './interfaces';

export class TypeOrmDataSource {
    static factory(options: DataSourceOptions): IResourceDataSource {
        return new TypeOrmDataSourceInstance(options);
    }
}

class TypeOrmDataSourceInstance implements IResourceDataSource {
    private dataSource: DataSource;
    constructor(options: DataSourceOptions) {
        this.dataSource = new DataSource(options);
    }
    getDataProvider<DataType extends object = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey>(resourceName: IResourceName): IResourceDataProvider<DataType, PrimaryKeyType> {
        return {
            create: (data: DataType) => {
                return this.dataSource.getRepository(resourceName).save(data);
            },
        } as unknown as IResourceDataProvider<DataType, PrimaryKeyType>;
    }
    async initialize(): Promise<void> {
        await this.dataSource.initialize();
        return;
    }
}
