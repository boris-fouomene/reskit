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
};
export class MongooseModule {
    static PROVIDER_NAME = 'MONGOOSE_CONNECTION';
    static createConnectionProvider = (uri: string, options?: IMongooseModuleOptions): any => {
        options = Object.assign({}, options);
        const { name, ...rest } = options;
        return {
            provide: defaultStr(name, MongooseModule.PROVIDER_NAME),
            useFactory: async () => {
                return mongoose.connect(uri, rest);
            },
        }
    }
    static forRoot(uri: string, options?: IMongooseModuleOptions): any {
        const provider = MongooseModule.createConnectionProvider(uri, options);
        return {
            module: MongooseModule,
            providers: [provider],
            exports: [provider],
        }
    }
}