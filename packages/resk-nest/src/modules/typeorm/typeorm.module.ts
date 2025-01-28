import { DynamicModule, Provider } from "@nestjs/common";
import { defaultStr } from "@resk/core";
import { DataSource, DataSourceOptions } from "typeorm";

/**
 * A NestJS module for configuring and providing a TypeORM `DataSource` instance.
 * This module allows you to dynamically create and initialize a TypeORM data source
 * with customizable options, such as the data source name and connection settings.
 *
 * @example
 * ```typescript
 * // Example usage in a NestJS application:
 * @Module({
 *   imports: [
 *     TypeOrmModule.forRoot({
 *       name: 'myDataSource',
 *       type: 'postgres',
 *       host: 'localhost',
 *       port: 5432,
 *       username: 'user',
 *       password: 'password',
 *       database: 'my_db',
 *       entities: [__dirname + '/**\/*.entity{.ts,.js}'],
 *       synchronize: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * 
 * @example
 * ```typescript
 * ## Concrete example :
 * Let's suppose you have a user module with a User entity. 
 * First, you need to create a data source module for your database:
 * ## database.module.ts
 * export const DatabaseModule = TypeOrmModule.forRoot({
 *   name : 'myDataSource', //the name of the data source provider
 *   type: 'postgres',
 *   host: 'localhost',
 *   port: 5432,
 *   username: 'user',
 *   password: 'password',
 *   database: 'my_db',
 *   entities: [__dirname + '/**\/*.entity{.ts,.js}'],
 *   synchronize: true,
 * });
 * ## user.service.ts
 * import {TypeOrmService} from '@resk/nest';
 * import {User} from './user.entity';
 * import {Inject, Injectable} from '@nestjs/common';
 * @Injectable()
 * export class UserService extends TypeOrmService<User, number> {
 *   constructor(@Inject('myDataSource') private readonly dataSource: DataSource) {
 *     super(dataSource, User);
 *   }
 * }
 * ## user.module.ts
 * @Module({
 *   imports: [
 *     DatabaseModule,
 *   ],
 *   providers: [UserService],
 *   controllers: [UserController],
 * })
 * export class UserModule {}
 * ```
 */
export class TypeOrmModule {
    /**
     * The default provider name for the TypeORM data source.
     * This is used when no custom name is provided in the options.
     *
     * @default "TYPE_ORM_DATA_SOURCE"
     */
    static DEFAULT_PROVIDER_NAME = "TYPE_ORM_DATA_SOURCE";

    /**
     * Creates a provider for a TypeORM `DataSource` instance.
     * This method is used internally by `forRoot` to generate a provider
     * that initializes and provides a `DataSource` instance.
     *
     * @param {DataSourceOptions & { name?: string }} options - The configuration options for the data source.
     * @param {string} [options.name] - The name of the data source provider. If not provided, the default name is used.
     * @param {DataSourceOptions} options - The TypeORM data source options (e.g., database type, host, port, etc.).
     *
     * @returns {Provider} A NestJS provider that initializes and provides a `DataSource` instance.
     *
     * @example
     * ```typescript
     * // Example of creating a custom data source provider:
     * const provider = TypeOrmModule.createDataSourceProvider({
     *   name: 'myDataSource',
     *   type: 'mysql',
     *   host: 'localhost',
     *   port: 3306,
     *   username: 'root',
     *   password: 'password',
     *   database: 'my_db',
     * });
     * ```
     */
    static createDataSourceProvider(options?: DataSourceOptions & { name?: string }): Provider {
        // Merge the provided options with defaults
        options = Object.assign({}, options);
        const { name } = options;
        // Create a provider that initializes the data source
        const provider = {
            provide: defaultStr(name, TypeOrmModule.DEFAULT_PROVIDER_NAME),
            useFactory: async () => {
                const dataSource = new DataSource(options);
                return dataSource.initialize();
            },
        };
        return provider;
    }

    /**
     * Configures and provides a TypeORM `DataSource` instance as a dynamic module.
     * This method is used to register the data source provider in the NestJS dependency injection system.
     *
     * @param {DataSourceOptions & { name?: string }} options - The configuration options for the data source.
     * @param {string} [options.name] - The name of the data source provider. If not provided, the default name is used.
     * @param {DataSourceOptions} options - The TypeORM data source options (e.g., database type, host, port, etc.).
     *
     * @returns {DynamicModule} A dynamic module that provides and exports the `DataSource` instance.
     *
     * @example
     * ```typescript
     * // Example usage in a NestJS module:
     * @Module({
     *   imports: [
     *     TypeOrmModule.forRoot({
     *       name: 'myDataSource',
     *       type: 'sqlite',
     *       database: 'database.sqlite',
     *       entities: [__dirname + '/**\/*.entity{.ts,.js}'],
     *       synchronize: true,
     *     }),
     *   ],
     * })
     * export class AppModule {}
     * ```
     */
    static forRoot(
        options: DataSourceOptions & { name?: string }
    ): DynamicModule {
        // Create the data source provider
        const provider = TypeOrmModule.createDataSourceProvider(options);
        // Return the dynamic module configuration
        return {
            module: TypeOrmModule,
            providers: [provider],
            exports: [provider],
        };
    }
}