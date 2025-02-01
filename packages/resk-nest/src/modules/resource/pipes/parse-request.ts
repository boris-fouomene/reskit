import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { flattenObject, IDict, isNonNullString, isObj } from "@resk/core";

/**
 * @interface IParseRequestConfigMap
 * Interface representing a map of request configuration objects for parsing.
 * 
 * @template T - The type of the dictionary object extending {@link IDict}.
 * @example
 * // Example usage:
 * const requestConfig: IParseRequestConfigMap<MyDict> = {
 *   body: { key: 'value' },
 *   query: { search: 'example' },
 *   params: { id: '123' },
 *   headers: { 'Content-Type': 'application/json' }
 * };
 * console.log(requestConfig.body.key); // Output: 'value'
 */
export interface IParseRequestConfigMap<T extends IDict = IDict> {
    /**
     * An object containing the request body data.
     * 
     * @type {T}
     * @memberof IParseRequestConfigMap
     * @example
     * // Example usage:
     * const bodyData = requestConfig.body;
     * console.log(bodyData); // Output: { key: 'value' }
     */
    body: T | T[];

    /**
     * An object containing the request query parameters.
     * 
     * @type {T}
     * @memberof IParseRequestConfigMap
     * @example
     * // Example usage:
     * const queryParams = requestConfig.query;
     * console.log(queryParams); // Output: { search: 'example' }
     */
    query: T;

    /**
     * An object containing the request route parameters.
     * 
     * @type {T}
     * @memberof IParseRequestConfigMap
     * @example
     * // Example usage:
     * const routeParams = requestConfig.params;
     * console.log(routeParams); // Output: { id: '123' }
     */
    params: T;

    /**
     * An object containing the request headers.
     * 
     * @type {T}
     * @memberof IParseRequestConfigMap
     * @example
     * // Example usage:
     * const requestHeaders = requestConfig.headers;
     * console.log(requestHeaders); // Output: { 'Content-Type': 'application/json' }
     */
    headers: T;
}


/**
 * Type alias representing the configuration for parsing requests.
 * 
 * This type can be one of the following:
 * 1. A key from {@link IParseRequestConfigMap}.
 * 2. A string template literal combining a key from {@link IParseRequestConfigMap} and an additional string.
 * 3. A function that takes {@link IParseRequestConfigMap} and {@link ExecutionContext}, and returns any.
 * 
 * @example
 * // Example usage as a key:
 * const configKey: IParseRequestConfig = 'body';
 * 
 * @example
 * // Example usage as a string template literal:
 * const configTemplate: IParseRequestConfig = 'body.key';
 * 
 * @example
 * // Example usage as a function:
 * const configFunction: IParseRequestConfig = (options, context) => {
 *   return { key: options.body.key, contextId: context.id };
 * };
 * 
 * @template T - The type of the dictionary object extending {@link IDict}.
 */
export type IParseRequestConfig =
    | keyof IParseRequestConfigMap
    | `${keyof IParseRequestConfigMap}.${string}`
    | ((options: IParseRequestConfigMap, context: ExecutionContext) => any);


/**
 * Parses the request based on the provided configuration and execution context.
 * 
 * @param {IParseRequestConfig} config - The configuration for parsing the request.
 * @param {ExecutionContext} ctx - The execution context containing the request information.
 * 
 * @returns {Promise<IDict>} - A promise that resolves to the parsed data.
 * 
 * @example
 * // Example usage:
 * const config: IParseRequestConfig = 'body.key';
 * const context: ExecutionContext = getContext();
 * parseRequest(config, context).then(parsedData => {
 *   console.log(parsedData); // Output: value of body.key
 * });
 */
export async function parseRequest(config: IParseRequestConfig, ctx: ExecutionContext): Promise<IDict> {

    /**
     * Gets the request instance from the execution context.
     * 
     * @example
     * const req = ctx.switchToHttp().getRequest();
     */
    const req = ctx.switchToHttp().getRequest();

    const inputData: IParseRequestConfigMap = {
        body: Array.isArray(req.body) ? req.body : Object.assign({}, req.body),
        query: Object.assign({}, req.query),
        params: Object.assign({}, req.params),
        headers: Object.assign({}, req.headers),
    };

    let data: any = undefined;

    /**
     * If the configuration is a function, calls it to get the data.
     * 
     * @example
     * if (typeof config === "function") {
     *   return await config(inputData, ctx);
     * }
     */
    if (typeof config === "function") {
        return await config(inputData, ctx);
    } else if (isNonNullString(config)) {
        /**
         * If the configuration is a string, extracts the data from the request.
         * 
         * @example
         * const d = flattenObject(data);
         * if (Object.hasOwnProperty.call(d, config)) {
         *   return d[config];
         * }
         * const [key, ...subKeys] = config.split(".");
         * data = inputData[key as keyof IParseRequestConfigMap];
         * for (const k of subKeys) {
         *   if (isObj(data)) {
         *     data = data[k];
         *   } else {
         *     data = undefined as any;
         *     break;
         *   }
         * }
         */
        const d = flattenObject(data);
        if (Object.hasOwnProperty.call(d, config)) {
            return d[config];
        }
        const [key, ...subKeys] = config.split(".");
        data = inputData[key as keyof IParseRequestConfigMap];
        for (const k of subKeys) {
            if (isObj(data)) {
                data = data[k];
            } else {
                data = undefined as any;
                break;
            }
        }
    }
    return data;
}


/**
 * Creates a parameter decorator that parse data from the request.
 * 
 * This decorator takes a configuration object of type `IParseRequestConfig` and returns a value parsed from the request based on the configuration.
 * 
 * 
 * @param {IParseRequestConfig} options
 * @returns a value parsed from the request based on the configuration.
 * 
 * @example
 * ```typescript
 * async myHandler(@ParseRequest('body.user.files') myHandlerDto : IMyHandlerDto) {
 *   // Use the dtoClass and data properties
 * ```
 * @example
 * ## Example usage of the ParseRequest decorator without the UseValidatorParam decorator.
 * In this example, the ParseRequest decorator is use to retrieve a specific property from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ParseRequest('body.user.files') myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * }
 * ```
 * @example
 * In this example, the ParseRequest decorator is use to retrieve body data from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ParseRequest("body") myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * }
 * ```
 * @example
 * In this example, the ParseRequest decorator is use to retrieve query data from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ParseRequest("query") myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * } 
 * ```
 * @example
 * In this example, the ParseRequest decorator is use to retrieve data from the request object by using a function.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ParseRequest((options, context) => {
 *     return { key: options.body.key, };
 *   }) myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * } 
 * ```
 */
export const ParseRequest = createParamDecorator<IParseRequestConfig>(parseRequest);
