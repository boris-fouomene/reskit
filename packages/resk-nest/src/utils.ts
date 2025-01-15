import { NestFactory } from '@nestjs/core';
import "./modules/resource/interfaces";
import { isNonNullString, isObj, extendObj, ResourcesManager } from "@resk/core";
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
 * @param module - The main application module.
 * @param options - Optional configuration options for the NestJS application and Swagger documentation.
 * @returns A Promise that resolves to the created NestJS application.
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
 * @param app - The NestJS application instance.
 * @param swaggerOptions - Optional configuration options for the Swagger documentation.
 * @returns Void.
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
    (app as NestExpressApplication).useStaticAssets(
        pathM.join(__dirname, '../dist', 'swagger-ui'),
        {
            prefix: `/${swaggerPath.trim().ltrim("/")}`,
        },
    );
    // Set up the Swagger UI endpoint
    SwaggerModule.setup(swaggerPath, app, () => {
        const documents = SwaggerModule.createDocument(app, config, documentOptions);
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
                    const apiDescription = ResourcesManager.getApiDescriptionByClassName(controllerKey, methodKey);
                    if (isObj(apiDescription)) {
                        extendObj(op, apiDescription);
                    }
                });
            }
        }
        return documents;
    }, sOptions);
};



export interface ICreateAppOptions extends NestApplicationOptions {
    /***
      The versioning options for the application
    */
    versioningOptions?: Partial<VersioningOptions> & {
        /***
        Specify if you want to enable versioning
        if set to false, it will disable versioning
        if the value is not set, it will enable URI versioning
      */
        enabled?: boolean;
    };
    /**
     * Swagger document options
     */
    swaggerOptions?: SwaggerCustomOptions & {
        /***
            Enable swagger documentation
        */
        enabled?: boolean;

        /**
         * Path to the swagger documentation
         */
        path?: string;

        configMutator?: (builder: DocumentBuilder) => DocumentBuilder;

        /**
         * Swagger document title
         */
        title?: string;

        /**
         * Swagger document description
         */
        description?: string;

        /***
            Swagger document version, default is 1.0, or retrived from the versioningOptions.defaultVersion
        */
        version?: string;

        /***
          Swagger createDocument options
        */
        documentOptions?: SwaggerDocumentOptions;
    };
}