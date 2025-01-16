import { DynamicModule, Injectable } from "@nestjs/common";
import { defaultStr } from "@resk/core";
import { IResourceDataSource } from "./interfaces";


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