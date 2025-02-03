import { DynamicModule } from '@nestjs/common';
import { defaultStr } from '@resk/core';
import * as mongoose from 'mongoose';

export type IMongooseModuleOptions = mongoose.ConnectOptions & {
    /***
     * The name of the connection provider.
     * This is used to identify the connection provider in the application.
     *
     * @default 'MONGOOSE_CONNECTION'
     */
    name?: string;
    /***
     * Whether the connection provider should be global or not.
     * If set to true, the connection provider will be registered as global for the application.
     *
     * @default true
     */
    global?: boolean;
};
export class MongooseResourceModule {
    static DEFAULT_PROVIDER_NAME = 'MONGOOSE_CONNECTION';
    static createConnectionProvider = (uri: string, options?: IMongooseModuleOptions): any => {
        options = Object.assign({}, options);
        const { name, global, ...rest } = options;
        return {
            provide: defaultStr(name, MongooseResourceModule.DEFAULT_PROVIDER_NAME),
            useFactory: async () => {
                return mongoose.connect(uri, rest);
            },
        }
    }
    static forRoot(uri: string, options?: IMongooseModuleOptions): DynamicModule & { name: string } {
        const provider = MongooseResourceModule.createConnectionProvider(uri, options);
        return {
            global: typeof options?.global === 'boolean' ? options.global : true,
            name: defaultStr(options?.name, MongooseResourceModule.DEFAULT_PROVIDER_NAME),
            module: MongooseResourceModule,
            providers: [provider],
            exports: [provider],
        }
    }
}