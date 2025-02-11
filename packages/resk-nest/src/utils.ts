import { NestFactory } from '@nestjs/core';
import "./modules/resource/interfaces";
import { defaultStr, isNonNullString, ResourcesManager } from "@resk/core";
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerCustomOptions,
    SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { VersioningOptions, NestApplicationOptions } from '@nestjs/common';
const pathM = require("path");
/**
 * Creates a NestJS application with optional Swagger documentation and versioning.
 *
 * This function initializes a NestJS application based on the provided module and options.
 * It can set up Swagger documentation and enable versioning based on the configuration.
 *
 * @param {any} module - The main application module.
 * @param {ICreateNestAppOptions} [options] - Optional configuration options for the NestJS application and Swagger documentation.
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
    options?: ICreateNestAppOptions,
): Promise<INestApplication<T>> {
    const { swaggerOptions, versioningOptions, globalPrefix: nestAppGlobalPrefix, ...nestAppOptions } =
        Object.assign({}, options);
    const app = await NestFactory.create<T>(module, nestAppOptions);
    const vOptions: VersioningOptions = {
        type: VersioningType.URI,
        defaultVersion: '1',
        ...Object.assign({}, versioningOptions),
    } as VersioningOptions;
    const appVersion = typeof vOptions.defaultVersion === 'string' ? vOptions.defaultVersion : '1';
    // Capture the global prefix if set later
    let globalPrefix = defaultStr(nestAppGlobalPrefix);
    if (globalPrefix) {
        app.setGlobalPrefix(globalPrefix);
    }
    if (swaggerOptions?.enabled !== false) {
        // Combine global prefix and version prefix
        const combinedPrefix = `${globalPrefix ? globalPrefix + '/' : ''}v${appVersion}`;
        setupSwagger(
            app,
            Object.assign(
                {
                    path:
                        typeof swaggerOptions?.path === 'string' && swaggerOptions?.path
                            ? swaggerOptions?.path.trim()
                            : `${combinedPrefix}/swagger`,
                },
                swaggerOptions,
            ),
        );
    }
    if (versioningOptions?.enabled) {
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
 * @param {ICreateNestAppOptions['swaggerOptions']} [swaggerOptions] - Optional configuration options for the Swagger documentation.
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
    swaggerOptions?: ICreateNestAppOptions['swaggerOptions'],
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
    if (typeof (app as any).useStaticAssets === 'function') {
        (app as any).useStaticAssets(
            pathM.join(__dirname, '../dist', 'swagger-ui'),
            {
                prefix: `/${swaggerPath.trim().ltrim("/")}`,
            },
        );
    }
    // Set up the Swagger UI endpoint
    SwaggerModule.setup(swaggerPath, app, () => {
        const documents = SwaggerModule.createDocument(app, config, documentOptions);
        return documents;
    }, sOptions);
};



/**
 * Options for creating a Nest application.
 * This interface extends the NestApplicationOptions and includes additional options
 * for versioning and Swagger documentation.
 *
 * @interface ICreateNestAppOptions
 * @extends {NestApplicationOptions}
 */
export interface ICreateNestAppOptions extends NestApplicationOptions {
    /***
     * Global prefix for the application
     * @default ''
     */
    globalPrefix?: string;
    /**
     * The versioning options for the application.
     * This allows you to configure how versioning is handled in the application.
     *
     * @type {Partial<VersioningOptions>}
     * @memberof ICreateNestAppOptions
     * @example
     * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.versioningOptions
         * @default true
         * @example
         * const options: ICreateNestAppOptions = {
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
     * @memberof ICreateNestAppOptions
     * @example
     * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @default false
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @default '1.0'
         * @example
         * const options: ICreateNestAppOptions = {
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
         * @memberof ICreateNestAppOptions.swaggerOptions
         * @example
         * const options: ICreateNestAppOptions = {
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