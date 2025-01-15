import { DynamicModule, Injectable } from "@nestjs/common";
import { defaultStr, IResourceDataProvider, IResourceName, IResourcePrimaryKey } from "@resk/core";


export interface IResourceDataSource {
    getDataProvider<DataType extends object = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey>(resourceName: IResourceName): IResourceDataProvider<DataType, PrimaryKeyType>;
    initialize(): Promise<void>;
}

export class DataSourceModule {
    static providerName: "DATA_SOURCE";
    static forRoot(dataSource: IResourceDataSource, providerName?: string): DynamicModule {
        providerName = defaultStr(providerName, DataSourceModule.providerName);
        return {
            module: DataSourceModule,
            providers: [
                {
                    provide: providerName,
                    useFactory: async () => {
                        await dataSource.initialize();
                    },
                },
            ],
            exports: [providerName],
        };
    }
}

export * from "./typeorm";