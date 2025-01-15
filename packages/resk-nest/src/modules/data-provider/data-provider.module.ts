import { DynamicModule, Module } from '@nestjs/common';
import { ResourceDataProviderService } from './data-provider.service';

export class ResourceDataProviderModule {
    static dataProviderName = "DATA_PROVIDER";
    static forRoot(): DynamicModule {
        return {
            module: ResourceDataProviderModule,
            providers: [
                {
                    provide: ResourceDataProviderModule.dataProviderName,
                    useFactory: async () => {
                        return true;
                    },
                },
                ResourceDataProviderService,
            ],
        };
    }

}
