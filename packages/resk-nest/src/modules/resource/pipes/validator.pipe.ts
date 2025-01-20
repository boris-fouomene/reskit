import { PipeTransform, Injectable, Request, ArgumentMetadata, BadRequestException, SetMetadata, ExecutionContext, createParamDecorator, UsePipes, applyDecorators } from '@nestjs/common';
import { IDict, isNonNullString, isObj, Validator } from '@resk/core';

/**
 * @interface IValidatorParamConfigMap
 * Interface representing a map of validator parameter configurations.
 * 
 * This interface defines the structure of the validator parameter configurations, which includes the following properties:
 * 
 * @template T The type of the data in the map.
 * - `body`: An object containing the request body data.
 * - `query`: An object containing the request query parameters.
 * - `params`: An object containing the request route parameters.
 * - `headers`: An object containing the request headers.
 * 
 * @example
 * ```typescript
 * const validatorParamConfigMap: IValidatorParamConfigMap = {
 *   body: { name: 'John Doe', age: 30 },
 *   query: { page: 1, limit: 10 },
 *   params: { id: 123 },
 *   headers: { 'Content-Type': 'application/json' },
 * };
 * ```
 */
export interface IValidatorParamConfigMap<T extends IDict = IDict> {
    /**
     * An object containing the request body data.
     */
    body: T;
    /**
     * An object containing the request query parameters.
     */
    query: T;
    /**
     * An object containing the request route parameters.
     */
    params: T;
    /**
     * An object containing the request headers.
     */
    headers: T;
}

/**
 * @interface IValidatorParamConfig
 * Type representing a validator parameter configuration.
 * 
 * This type can be one of the following:
 * 
 * - A key of the `IValidatorParamConfigMap` interface (e.g. `'body'`, `'query'`, `'params'`, or `'headers'`).
 * - A string in the format `'key.subkey'`, where `key` is a key of the `IValidatorParamConfigMap` interface and `subkey` is a property of the corresponding object.
 * - A function that takes an object with the `IValidatorParamConfigMap` properties and a `Request` object as arguments and returns an object with the validator parameter configuration.
 * 
 * @example
 * ```typescript
 * const validatorParamConfig: IValidatorParamConfig = 'body';
 * const validatorParamConfig: IValidatorParamConfig = 'body.user.files';
 * const validatorParamConfig: IValidatorParamConfig = (options) => ({ ...options.body, ...options.query });
 * ```
 */
export type IValidatorParamConfig = keyof IValidatorParamConfigMap | `${keyof IValidatorParamConfigMap}.${string}` | ((options: IValidatorParamConfigMap & { req: Request }) => IDict);
/**
 * @interface IValidatorParamResult
 * Interface representing the result of a validator parameter.
 * 
 * This interface defines the structure of the result, which includes the following properties:
 * 
 * - `data`: An object containing the validator data.
 * - `dtoClass`: An instance of the DTO class.
 * 
 * @example
 * ```typescript
 * const validatorParamResult: IValidatorParamResult = {
 *   data: { name: 'John Doe', age: 30 },
 *   dtoClass: CreateUserDto,
 * };
 * ```
 */
export interface IValidatorParamResult<T extends IDict = IDict> {
    /**
     * An object containing the validator data.
     */
    data: T | T[];

    /**
     * An instance of the DTO class.
     */
    dtoClass: InstanceType<any>;
}

const validatorPipeDtoMetadataKey = Symbol('validatorPipeDtoMetadataKey');

/**
 * Creates a parameter decorator that extracts the validator configuration and data from the request.
 * 
 * This decorator takes a configuration object of type `IValidatorParamConfig` and returns an object with the `dtoClass` and `data` properties.
 * 
 * The `dtoClass` property is an instance of the DTO class returned by the method specified in the `validatorPipeDtoMetadataKey` metadata.
 * 
 * The `data` property is an object containing the validator data extracted from the request based on the configuration.
 * 
 * @param {IValidatorParamConfig} config The validator configuration object.
 * @param {ExecutionContext} ctx The current execution context.
 * @throws {BadRequestException} If the DTO method name is invalid or the DTO class is not a function or the config is invalid (extracted data is not an object).
 * @returns An object with the `dtoClass` and `data` properties.
 * 
 * @example
 * ```typescript
 * @UseValidatorPipe<UsersController>('getCreateUserDto')
 * async myHandler(@ValidatorParam('body') { dtoClass, data }: { dtoClass: InstanceType<any>, data: IDict }) {
 *   // Use the dtoClass and data properties
 * }
 * async myHandler(@ValidatorParam('body.user.files') { dtoClass, data }: { dtoClass: any, data: IDict }) {
 *   // Use the dtoClass and data properties
 * ```
 */
export const ValidatorParam = createParamDecorator<IValidatorParamConfig, ExecutionContext, IValidatorParamResult>((config: IValidatorParamConfig, ctx: ExecutionContext) => {
    /**
     * Gets the controller instance from the execution context.
     */
    const controller = ctx.getClass();

    /**
     * Gets the handler instance from the execution context.
     */
    const handler = ctx.getHandler();

    /**
     * Gets the request instance from the execution context.
     */
    const req = ctx.switchToHttp().getRequest();

    /**
     * Gets the controller and handler names for error messages.
     */
    const controllerName = controller.name, handlerName = handler.name;

    /**
     * Creates an error message prefix with the controller and handler names.
     */
    const errorDetails = `[Controller] : ${controllerName}, [Handler] : ${handlerName}`;

    /**
     * Gets the DTO method name from the metadata.
     */
    const methodName = Reflect.getMetadata(validatorPipeDtoMetadataKey, handler);

    /**
     * Throws an error if the DTO method name is invalid.
     */
    if (!isNonNullString(methodName)) throw new BadRequestException("Invalid Dto method name for validator : " + errorDetails);

    /**
     * Throws an error if the DTO method is not a function.
     */
    if (typeof controller.prototype[methodName] !== "function") {
        throw new BadRequestException("Invalid dtoClass method : The method " + methodName + " is not a function in controller " + controllerName + " : " + errorDetails);
    }

    /**
     * Calls the DTO method to get the DTO instance.
     */
    const dtoClass = controller.prototype[methodName]();

    /**
     * Throws an error if the DTO instance is not a function.
     */
    if (typeof dtoClass !== "function") {
        throw new BadRequestException("Invalid return type for dtoClass getter " + methodName + " is not a function in controller " + controllerName + " : " + errorDetails);
    }

    /**
     * Creates an object with the request data.
     */
    const inputData: IValidatorParamConfigMap = {
        body: Array.isArray(req.body) ? req.body : Object.assign({}, req.body),
        query: Object.assign({}, req.query),
        params: Object.assign({}, req.params),
        headers: Object.assign({}, req.headers),
    };

    /**
     * Initializes the data object.
     */
    let data: IDict = {};

    /**
     * If the configuration is a function, calls it to get the data.
     */
    if (typeof config === "function") {
        const r = config({ ...inputData, req });
        data = Array.isArray(r) ? r : Object.assign({}, r);
    }
    /**
     * If the configuration is a string, extracts the data from the request.
     */
    else if (isNonNullString(config)) {
        const [key, ...subKeys] = config.split(".");
        data = inputData[key as keyof IValidatorParamConfigMap];
        for (const k of subKeys) {
            if (isObj(data)) {
                data = data[k];
            } else {
                data = undefined as any;
                break;
            }
        }
        /**
         * Throws an error if the data is invalid.
         */
        if (!Array.isArray(data) && !isObj(data)) {
            throw new BadRequestException("Invalid config data result for validator param : " + config + " in controller " + controllerName + " : " + errorDetails);
        }
    }

    /**
     * Returns the DTO and data objects.
     */
    return {
        dtoClass,
        data,
    };
},);

/**
 * Creates a method decorator that enables validation for a controller method.
 * 
 * This decorator uses the `ValidatorPipe` to validate the request data and sets the `validatorPipeDtoMetadataKey` metadata to specify the DTO method name.
 * 
 * @template T The type of the controller class.
 * @param {keyof T} getDtoMethodName The name of the method that returns the DTO instance.
 * @returns A method decorator that enables validation for a controller method.
 * 
 * @example
 * ```typescript
 * @UseValidatorPipe<UsersController>('getCreateUserDto')
 * async myMethod(@ValidatorParam('body') { dtoClass, data }: { dtoClass: InstanceType<any>, data: IDict }) {
 *   // Use the dtoClass and data properties
 * }
 * ```
 */
export function UseValidatorPipe<T extends InstanceType<any> = any>(getDtoMethodName: keyof T): MethodDecorator {
    /**
     * Returns a method decorator that enables validation for a controller method.
     * 
     * @param target The target class.
     * @param propertyKey The property key of the method.
     * @param descriptor The property descriptor of the method.
     */
    return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        /**
         * Applies the `ValidatorPipe` to the method to enable validation.
         */
        UsePipes(ValidatorPipe)(target, propertyKey, descriptor);

        /**
         * Sets the `validatorPipeDtoMetadataKey` metadata to specify the DTO method name.
         */
        SetMetadata(validatorPipeDtoMetadataKey, getDtoMethodName)(target, propertyKey, descriptor);
    };
}

/**
 * A pipe that validates the input data using a DTO class.
 * 
 * This pipe takes an object with a `dtoClass` property and a `data` property, and validates the `data` using the `dtoClass`.
 * 
 * If the validation fails, it throws a `BadRequestException` with the validation errors.
 * 
 * @example
 * ```typescript
 * @UseValidatorPipe<UsersController>('getCreateUserDto')
 * async myHandler(@ValidatorParam('body') createUserDto: CreateUserDto) {
 *   // Use the validated data
 * }
 * ```
 */
@Injectable()
export class ValidatorPipe implements PipeTransform<IValidatorParamResult, IValidatorParamResult['data']> {
    /**
     * Constructor.
     */
    constructor() { }

    /**
     * Transforms the input value by validating it using the DTO class.
     * 
     * @param value The input value to be validated.
     * @param metadata The metadata of the argument.
     * @returns The validated data.
     * @throws {BadRequestException} If the validation fails.
     */
    async transform(value: IValidatorParamResult, metadata: ArgumentMetadata) {
        /**
         * Checks if the input value is an object with a `dtoClass` property.
         */
        if (!isObj(value) || !value.dtoClass) {
            throw new BadRequestException(`Invalid value type ${typeof value} input for Validator pipe line, data : ` + JSON.stringify(value?.data));
        }

        /**
         * Destructures the input value into `dtoClass` and `data`.
         */
        const { dtoClass, data } = value;

        /**
         * If the data is an array, validates each item in the array.
         */
        if (Array.isArray(data)) {
            return await Promise.all(data.map(async (v: any) => {
                await this.transform({ dtoClass, data: v }, metadata);
                return v;
            }));
        }

        /**
         * Validates the data using the DTO class.
         */
        const { success, errors, rulesByField, errorsByField, ...rest } = await Validator.validateTarget(dtoClass, data);

        /**
         * If the validation fails, throws a `BadRequestException` with the validation errors.
         */
        if (errors.length > 0) {
            throw new BadRequestException({
                errors,
                data,
                message: errors.join("\n"),
                errorsByField
            })
        }

        /**
         * Returns the validated data.
         */
        return data;
    }
}