import { NestFactory } from '@nestjs/core';
import "./modules/resource/interfaces";
import { isNonNullString, isObj, extendObj, ResourcesManager, IResourceMetaData, IResourceName } from "@resk/core";
import { MainExceptionFilter } from './modules/resource';
import {
    SwaggerModule,
    DocumentBuilder,
    ApiOperationOptions,
    SwaggerCustomOptions,
    SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { VersioningOptions, NestApplicationOptions } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
const pathM = require("path");
/**
 * Creates a NestJS application with optional Swagger documentation and versioning.
 *
 * This function initializes a NestJS application based on the provided module and options.
 * It can set up Swagger documentation and enable versioning based on the configuration.
 *
 * @param {any} module - The main application module.
 * @param {ICreateAppOptions} [options] - Optional configuration options for the NestJS application and Swagger documentation.
 * @returns {Promise<INestApplication<T>>} A Promise that resolves to the created NestJS application.
 *
 * @example
 * // Example of creating a NestJS application with Swagger and versioning
 * import { createApp } from './utils/app';
 * import { AppModule } from './app.module';
 *
 * async function bootstrap() {
 *     const app = await createApp(AppModule, {
 *         swaggerOptions: {
 *             enabled: true,
 *             path: '/api-docs',
 *             title: 'My API',
 *             description: 'API documentation for my application',
 *             version: '1.0.0',
 *         },
 *         versioningOptions: {
 *             enabled: true,
 *         },
 *     });
 *     await app.listen(3000);
 * }
 * bootstrap();
 *
 * @example
 * // Example of creating an application without Swagger
 * const app = await createApp(AppModule, {
 *     versioningOptions: {
 *         enabled: true,
 *     },
 * });
 */
export async function createApp<T extends INestApplication = INestApplication>(
    module: any,
    options?: ICreateAppOptions,
): Promise<INestApplication<T>> {
    const { swaggerOptions, versioningOptions, ...nestAppOptions } =
        Object.assign({}, options);
    const app = await NestFactory.create<T>(module, nestAppOptions);
    const vOptions: VersioningOptions = {
        type: VersioningType.URI,
        defaultVersion: '1',
        ...Object.assign({}, versioningOptions),
    } as VersioningOptions;
    const appVersion =
        typeof vOptions.defaultVersion === 'string' ? vOptions.defaultVersion : '1';
    if (swaggerOptions?.enabled !== false) {
        setupSwagger(
            app,
            Object.assign(
                {
                    path:
                        typeof swaggerOptions?.path === 'string' && swaggerOptions?.path
                            ? swaggerOptions?.path.trim()
                            : `v${appVersion}/${`swagger`}`,
                },
                swaggerOptions,
            ),
        );
    }
    if (versioningOptions?.enabled !== false) {
        app.enableVersioning(vOptions as unknown as VersioningOptions);
    }
    return app;
}

/**
 * Sets up Swagger documentation for a NestJS application.
 *
 * This function configures the Swagger UI and generates the API documentation
 * based on the provided options. It allows customization of the Swagger UI
 * and the API documentation.
 *
 * @param {INestApplication} app - The NestJS application instance.
 * @param {ICreateAppOptions['swaggerOptions']} [swaggerOptions] - Optional configuration options for the Swagger documentation.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Example of setting up Swagger in a NestJS application
 * import { NestFactory } from '@nestjs/core';
 * import { AppModule } from './app.module';
 * import { setupSwagger } from './utils/swagger';
 *
 * async function bootstrap() {
 *     const app = await NestFactory.create(AppModule);
 *     setupSwagger(app, {
 *         enabled: true,
 *         path: '/api-docs',
 *         title: 'My API',
 *         description: 'API documentation for my application',
 *         version: '1.0.0',
 *     });
 *     await app.listen(3000);
 * }
 * bootstrap();
 *
 * @example
 * // Example of using a custom configuration mutator
 * setupSwagger(app, {
 *     configMutator: (builder) => {
 *         return builder.setTitle('Custom API Title');
 *     },
 * });
 */
export const setupSwagger = (
    app: INestApplication,
    swaggerOptions?: ICreateAppOptions['swaggerOptions'],
) => {
    const {
        configMutator,
        path,
        enabled,
        title,
        description,
        version,
        documentOptions: customOptions,
        ...sOptions
    } = Object.assign({}, swaggerOptions);
    const documentOptions = Object.assign({}, customOptions);
    const { operationIdFactory } = documentOptions;
    documentOptions.operationIdFactory = (controllerKey: string, methodKey: string) => {
        const operatorId = ResourcesManager.buildApiOperationId(controllerKey, methodKey);
        const str = typeof operationIdFactory === 'function' ? operationIdFactory(controllerKey, methodKey) : operatorId;
        return isNonNullString(str) ? str : operatorId;
    };
    const configBuilder = new DocumentBuilder();
    if (isNonNullString(title) && title) {
        configBuilder.setTitle(title);
    }
    if (isNonNullString(description) && description) {
        configBuilder.setDescription(description);
    }
    if (isNonNullString(version)) {
        configBuilder.setVersion(version);
    }
    const swaggerPath = typeof path === 'string' ? path : 'v1/swagger';
    /***
          configBuilder.setBasePath(process.env.BASE_PATH ?? '/');
          configBuilder.setSchemes(['http','https']);
          configBuilder.setHost(process.env.HOST ?? 'localhost:3002');
        */
    const config = (
        typeof configMutator === 'function'
            ? configMutator(configBuilder)
            : configBuilder
    )
        //.addBearerAuth() // Optional: Add security options
        .build();
    const customCssUrl = Array.isArray(sOptions.customCssUrl)
        ? sOptions.customCssUrl
        : isNonNullString(sOptions.customCssUrl)
            ? sOptions.customCssUrl.split(',')
            : [];
    customCssUrl.push('./swagger-ui/swagger-ui.css');
    sOptions.customCssUrl = customCssUrl;
    sOptions.customJs = Array.isArray(sOptions.customJs)
        ? sOptions.customJs
        : isNonNullString(sOptions.customJs)
            ? sOptions.customJs.split(',')
            : [];
    sOptions.customJs.push(
        './swagger-ui-standalone-preset.js',
        './swagger-ui-bundle.js',
    );
    sOptions.swaggerOptions = Object.assign({}, sOptions.swaggerOptions);
    sOptions.swaggerOptions.persistAuthorization =
        typeof sOptions.swaggerOptions.persistAuthorization !== undefined
            ? sOptions.swaggerOptions.persistAuthorization
            : true;
    if (typeof (app as NestExpressApplication).useStaticAssets === 'function') {
        (app as NestExpressApplication).useStaticAssets(
            pathM.join(__dirname, '../dist', 'swagger-ui'),
            {
                prefix: `/${swaggerPath.trim().ltrim("/")}`,
            },
        );
    }
    // Set up the Swagger UI endpoint
    SwaggerModule.setup(swaggerPath, app, () => {
        const documents = SwaggerModule.createDocument(app, config, documentOptions);
        const resourcesByControllersClassNames: Record<string, IResourceMetaData> = {} as Record<string, IResourceMetaData>;
        const allResurces = ResourcesManager.getAllMetaData();
        for (let resourceName in allResurces) {
            if (isObj(allResurces[resourceName as IResourceName]) && isNonNullString(allResurces[resourceName as IResourceName].controllerName)) {
                const controllerName = allResurces[resourceName as IResourceName].controllerName as string;
                resourcesByControllersClassNames[controllerName] = allResurces[resourceName as IResourceName];
            }
        }
        //console.log(documents," are list of resources",ResourcesManager.getApiDescription("users")," are api descriptions");
        if (isObj(documents?.paths)) {
            for (let path in documents.paths) {
                const pathItem = documents.paths[path];
                if (!isObj(pathItem)) continue;
                Object.entries(pathItem).forEach(([method, operation]) => {
                    const op: ApiOperationOptions = operation as ApiOperationOptions;
                    if (!isObj(op) || !isNonNullString(op.operationId)) return;
                    const { operationId } = op;
                    const { controllerKey, methodKey } = ResourcesManager.parseApiOperationId(operationId);
                    if (isNonNullString(controllerKey) && isNonNullString(methodKey)) {
                        const parentDesk = resourcesByControllersClassNames[controllerKey];
                        if (isObj(parentDesk) && parentDesk && isObj(parentDesk.apiDescription)) {
                            const apiDescription = (parentDesk?.apiDescription as any)[methodKey];
                            if (isObj(apiDescription)) {
                                extendObj(op, apiDescription);
                            }
                        }
                    }
                });
            }
        }
        return documents;
    }, sOptions);
};



/**
 * Options for creating a Nest application.
 * This interface extends the NestApplicationOptions and includes additional options
 * for versioning and Swagger documentation.
 *
 * @interface ICreateAppOptions
 * @extends {NestApplicationOptions}
 */
export interface ICreateAppOptions extends NestApplicationOptions {
    /**
     * The versioning options for the application.
     * This allows you to configure how versioning is handled in the application.
     *
     * @type {Partial<VersioningOptions>}
     * @memberof ICreateAppOptions
     * @example
     * const options: ICreateAppOptions = {
     *     versioningOptions: {
     *         enabled: true
     *     }
     * };
     */
    versioningOptions?: Partial<VersioningOptions> & {
        /**
         * Specify if you want to enable versioning.
         * If set to false, it will disable versioning.
         * If the value is not set, it will enable URI versioning.
         *
         * @type {boolean}
         * @memberof ICreateAppOptions.versioningOptions
         * @default true
         * @example
         * const options: ICreateAppOptions = {
         *     versioningOptions: {
         *         enabled: false
         *     }
         * };
         */
        enabled?: boolean;
    };

    /**
     * Swagger document options for the application.
     * This allows you to configure Swagger documentation settings.
     *
     * @type {SwaggerCustomOptions}
     * @memberof ICreateAppOptions
     * @example
     * const options: ICreateAppOptions = {
     *     swaggerOptions: {
     *         enabled: true,
     *         path: '/api-docs',
     *         title: 'My API',
     *         description: 'API documentation for my application',
     *         version: '1.0.0'
     *     }
     * };
     */
    swaggerOptions?: SwaggerCustomOptions & {
        /**
         * Enable Swagger documentation.
         * If set to true, Swagger UI will be available for the application.
         *
         * @type {boolean}
         * @memberof ICreateAppOptions.swaggerOptions
         * @default false
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         enabled: true
         *     }
         * };
         */
        enabled?: boolean;

        /**
         * Path to the Swagger documentation.
         * This is the URL path where the Swagger UI will be served.
         *
         * @type {string}
         * @memberof ICreateAppOptions.swaggerOptions
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         path: '/api-docs'
         *     }
         * };
         */
        path?: string;

        /**
         * A function to mutate the Swagger document builder.
         * This allows for custom configurations of the Swagger document.
         *
         * @param {DocumentBuilder} builder - The Swagger document builder.
         * @returns {DocumentBuilder} The modified builder.
         * @memberof ICreateAppOptions.swaggerOptions
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         configMutator: (builder) => {
         *             return builder.setTitle('My API');
         *         }
         *     }
         * };
         */
        configMutator?: (builder: DocumentBuilder) => DocumentBuilder;

        /**
         * Swagger document title.
         * This is the title that will be displayed in the Swagger UI.
         *
         * @type {string}
         * @memberof ICreateAppOptions.swaggerOptions
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         title: 'My API'
         *     }
         * };
         */
        title?: string;

        /**
         * Swagger document description.
         * This provides a description of the API that will be displayed in the Swagger UI.
         *
         * @type {string}
         * @memberof ICreateAppOptions.swaggerOptions
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         description: 'API documentation for my application'
         *     }
         * };
         */
        description?: string;

        /**
         * Swagger document version.
         * The default is '1.0', or it can be retrieved from the versioningOptions.defaultVersion.
         *
         * @type {string}
         * @memberof ICreateAppOptions.swaggerOptions
         * @default '1.0'
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         version: '1.0.0'
         *     }
         * };
         */
        version?: string;

        /**
         * Swagger createDocument options.
         * This allows for additional options when creating the Swagger document.
         *
         * @type {SwaggerDocumentOptions}
         * @memberof ICreateAppOptions.swaggerOptions
         * @example
         * const options: ICreateAppOptions = {
         *     swaggerOptions: {
         *         documentOptions: {
         *             // additional options here
         *         }
         *     }
         * };
         */
        documentOptions?: SwaggerDocumentOptions;
    };
}