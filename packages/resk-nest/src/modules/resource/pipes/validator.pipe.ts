import { Injectable, ArgumentMetadata, BadRequestException, SetMetadata, ExecutionContext, createParamDecorator, PipeTransform } from '@nestjs/common';
import { IClassConstructor, IDict, isNonNullString, Validator } from '@resk/core';
import "../../../translations";
import { i18n } from "@resk/core";
import { stringify } from 'querystring';
import { IParseRequestConfig, RequestParser } from './parse-request';



const validatorPipeDtoMetadataKey = Symbol('validatorPipeDtoMetadataKey');



/**
 * Creates a parameter decorator that validate data parsed from the request.
 * 
 * This decorator takes a configuration object of type `IParseRequestConfig` and validate the data parsed from the request based on the configuration.
 * 
 * 
 * @param {IParseRequestConfig} options
 * @throws {BadRequestException} If the validation fails.
 * @returns a value parsed from the request based on the configuration.
 * 
 * @example
 * In this example, the ValidatorParam decorator use the UseValidatorPie decorator to validate to retrieve the controller method used to get the dtoClass.
 * ```typescript
 * @UseValidatorParam<UsersController>('getCreateUserDto')
 * async myHandler(@ValidatorParam('body') myHandlerDto : IMyHandlerDto) {
 *   // Use the dtoClass and data properties
 * }
 * async myHandler(@ValidatorParam('body.user.files') myHandlerDto : IMyHandlerDto) {
 *   // Use the dtoClass and data properties
 * ```
 * @example
 * ## Example usage of the ValidatorParam decorator without the UseValidatorParam decorator.
 * In this example, the ValidatorParam decorator is use to retrieve a specific property from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ValidatorParam('body.user.files') myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * }
 * ```
 * @example
 * In this example, the ValidatorParam decorator is use to retrieve body data from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ValidatorParam("body") myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * }
 * ```
 * @example
 * In this example, the ValidatorParam decorator is use to retrieve query data from the request object.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ValidatorParam("query") myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * } 
 * ```
 * @example
 * In this example, the ValidatorParam decorator is use to retrieve data from the request object by using a function.
 * ```typescript
 * class UsersController {
 *   async myHandler(@ValidatorParam((options, context) => {
 *     return { key: options.body.key, };
 *   }) myHandlerDto : IMyHandlerDto) {
 *     // Use the dtoClass and data properties
 *   }
 * } 
 * ```
 */
export const ValidatorParam = createParamDecorator<([config: IParseRequestConfig, dtoClassParam: IClassConstructor<any>]) | IParseRequestConfig>(async (options, ctx: ExecutionContext) => {
    /**
     * Gets the controller instance from the execution context.
     */
    const controller = ctx.getClass();

    /**
     * Gets the handler instance from the execution context.
     */
    const handler = ctx.getHandler();

    const [config, dtoClassParam] = Array.isArray(options) ? options : [options];
    const data = await RequestParser.parseRequest(config, ctx);
    /**
     * Gets the controller and handler names for error messages.
     */
    const controllerName = controller.name, handlerName = handler.name;

    /**
     * Creates an error message prefix with the controller and handler names.
     */
    const errorDetails = `[Controller] : ${controllerName}, [Handler] : ${handlerName}`;

    /**
     * Gets the DTO class or method name from the metadata.
     */
    const { dtoClassOrGetDtoMethodName, optional } = Object.assign({}, Reflect.getMetadata(validatorPipeDtoMetadataKey, handler));
    /***
     * The validator params become optional when the dtoClassOrGetDtoMethodName is undefined or the optional is true
     */
    let cannotValidate = optional === true || dtoClassOrGetDtoMethodName === undefined;
    let dtoClass: IClassConstructor | undefined = typeof dtoClassParam !== "boolean" ? dtoClassParam : undefined;
    if (typeof dtoClassOrGetDtoMethodName === "function") {
        dtoClass = dtoClassOrGetDtoMethodName;
    } else {
        if (!cannotValidate) {
            /**
             * Throws an error if the DTO method name is invalid.
             */
            if (!isNonNullString(dtoClassOrGetDtoMethodName)) throw new BadRequestException("Invalid Dto method name for validator : " + errorDetails);

            /**
             * Throws an error if the DTO method is not a function.
             */
            if (typeof controller.prototype[dtoClassOrGetDtoMethodName] !== "function") {
                throw new BadRequestException("Invalid dtoClass method : The method " + dtoClassOrGetDtoMethodName + " is not a function in controller " + controllerName + " : " + errorDetails);
            }
        }
        if (isNonNullString(dtoClassOrGetDtoMethodName) && typeof controller.prototype[dtoClassOrGetDtoMethodName] == "function") {
            /**
             * Calls the DTO method to get the DTO instance.
             */
            dtoClass = controller.prototype[dtoClassOrGetDtoMethodName]();
        }
    }
    const hasDtoValid = typeof dtoClass === "function";
    if (!hasDtoValid && cannotValidate) {
        return data;
    }
    /**
     * Throws an error if the DTO instance is not a function.
     */
    if (!hasDtoValid) {
        throw new BadRequestException("Invalid return type for dtoClass getter " + dtoClassOrGetDtoMethodName + " is not a function in controller " + controllerName + " : " + errorDetails);
    }
    try {
        return await ValidatorPipe.staticTransform({ dtoClass, data }, {} as any);
    } catch (e) {
        throw new BadRequestException(e)
    }
});

/**
 * A method decorator that enables validation for a controller method.
 * 
 * This decorator uses the `ValidatorPipe` to validate the request data and sets the `validatorPipeDtoMetadataKey` metadata to specify the DTO method name.
 * 
 * @template T The type of the controller class.
 * @param {keyof T} dtoClassOrGetDtoMethodName The dto class or The name of the method that returns the DTO class.
 * @param {boolean} optional Whether to make the method optional. Default is false. If set to true, the method validates the request data and returns the validated data only if the data and dtoClass are provided.
 * @returns A method decorator that enables validation for a controller method.
 * 
 * @example
 * 
 * ## Example usage with ValidatorParam decorator and @UseValidatorParam decorator.
 * In this example, the `getCreateUserDto` method returns the `CreateUserDto` class. The `CreateUserDto` class is used to validate the request data.
 * This example is useful when you want to validate data based on dynamic DTO classes.
 * ```typescript
 * class UsersController {
 *      @UseValidatorParam<UsersController>('getCreateUserDto')
 *      async myMethod(@ValidatorParam('body') bodyData: IMyMethodDto) {
*          // Use the dtoClass and data properties
 *      }
 *      getCreateUserDto(): IClassConstructor<Partial<User>> {
 *          return CreateUserDto;
 *      }
 * }
 * ```
 * @example 
 * ## Example usage without ValidatorParam decorator and @UseValidatorParam decorator.
 * ```typescript
 * class UsersController {
 *   async create(@Body(new ValidatorPide(CreateUserDto)) createUserDto: CreateUserDto) {}
 * }
 * ```
 * @example
 * ## Example usage with the UsePipes decorator.
 * ```typescript
 * import { UsePipes } from '@nestjs/common';
 * class UsersController {
 *   @UsePipes(new ValidatorPipe(CreateUserDto))
 *   async create(@Body() createUserDto: CreateUserDto) {}
 * }
 * ```
 * @example
 * ## Example : Optional validation. In this example, the data are validated only if the getDtoClass method returns a valid dtoClass.
 * ```typescript
 * class UsersController {
 *   @UseValidatorParam<UsersController>('getCreateUserDto', true)
 *   async myMethod(@ValidatorParam('body') bodyData: IMyMethodDto) {
 *     // Use the dtoClass and data properties
 *   }
*   getCreateUserDto(): IClassConstructor<Partial<User>> {
*     return undefined; //invalid dtoClass, The data are not validated, because the dtoClass is not valid and the optional parameter is set to true.
*   }
 * }
 */
export function UseValidatorParam<T extends InstanceType<any> = any>(dtoClassOrGetDtoMethodName: (IClassConstructor<any> | keyof T), optional?: boolean): MethodDecorator {
    /**
     * Returns a method decorator that enables validation for a controller method.
     * 
     * @param target The target class.
     * @param propertyKey The property key of the method.
     * @param descriptor The property descriptor of the method.
     */
    return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        /**
         * Sets the `validatorPipeDtoMetadataKey` metadata to specify the DTO method name.
         */
        SetMetadata(validatorPipeDtoMetadataKey, {
            dtoClassOrGetDtoMethodName,
            optional,
        })(target, propertyKey, descriptor);
    };
}

/**
 * A pipe that validates the input data using a DTO class.
 * 
 *
 * If the validation fails, it throws a `BadRequestException` with the validation errors.
 * 
 *  * 
 * @example
 * 
 * ## Example usage with ValidatorParam decorator and @UseValidatorParam decorator.
 * In this example, the `getCreateUserDto` method returns the `CreateUserDto` class. The `CreateUserDto` class is used to validate the request data.
 * This example is useful when you want to validate data based on dynamic DTO classes.
 * ```typescript
 * class UsersController {
 *      @UseValidatorParam<UsersController>('getCreateUserDto')
 *      async myMethod(@ValidatorParam('body') { dtoClass, data }: { dtoClass: InstanceType<any>, data: IDict }) {
*          // Use the dtoClass and data properties
 *      }
 *      getCreateUserDto(): IClassConstructor<Partial<User>> {
 *          return CreateUserDto;
 *      }
 * }
 * ```
 * @example 
 * ## Example usage without ValidatorParam decorator and @UseValidatorParam decorator.
 * ```typescript
 * class UsersController {
 *   async create(@Body(new ValidatorPide(CreateUserDto)) createUserDto: CreateUserDto) {}
 * }
 * ```
 * @example
 * ## Example usage with the UsePipes decorator.
 * ```typescript
 * import { UsePipes } from '@nestjs/common';
 * class UsersController {
 *   @UsePipes(new ValidatorPipe(CreateUserDto))
 *   async create(@Body() createUserDto: CreateUserDto) {}
 * }
 * ```
 */
@Injectable()
export class ValidatorPipe implements PipeTransform<IDict, Promise<IDict>> {
    /**
     * Constructs a new instance of the `ValidatorPipe` class.
     * 
     * @param dtoClass - An optional class constructor for the DTO class to be used for validation.
     */
    constructor(readonly dtoClass?: IClassConstructor<any>) { }
    /**
     * Transforms the input value by validating it using the DTO class.
     *
     * If the `dtoClass` property is a valid class constructor, it calls the `ValidatorPipe.staticTransform` method to validate the input data.
     * If the `dtoClass` property is not a valid class constructor, it throws a `BadRequestException` with an error message.
     *
     * @param value The input value to be validated.
     * @param metadata The metadata of the argument.
     * @returns The validated data.
     * @throws {BadRequestException} If the validation fails or the `dtoClass` is invalid.
     */
    async transform(value: IDict, metadata: ArgumentMetadata): Promise<IDict> {
        if (typeof this.dtoClass === "function") {
            return ValidatorPipe.staticTransform({
                dtoClass: this.dtoClass,
                data: value,
            }, metadata);
        }
        throw new BadRequestException("Invalid dtoClass for validator pipe " + this.constructor.name);
    }

    /**
     * Transforms the input value by validating it using the DTO class.
     * 
     * @param value The input value to be validated.
     * @param metadata The metadata of the argument.
     * @returns The validated data.
     * @throws {BadRequestException} If the validation fails.
     */
    static async staticTransform(options: IValidatorConfig, metadata?: ArgumentMetadata): Promise<IDict> {
        options = Object.assign({}, options);
        /**
         * Checks if the input value is an object with a `dtoClass` property.
         */
        if (!options.dtoClass || typeof options.dtoClass !== "function") {
            throw new BadRequestException(`Invalid value type ${typeof options.data} input for Validator pipe line, data : ` + JSON.stringify(options?.data));
        }

        /**
         * Destructures the input value into `dtoClass` and `data`.
         */
        const { dtoClass, data } = options;

        /**
         * If the data is an array, validates each item in the array.
         */
        if (Array.isArray(data)) {
            const errors: any[] = [];
            const promises: Promise<any>[] = data.map((v: any, index) => {
                return new Promise((resolve, reject) => {
                    Validator.validateTarget(dtoClass, v).then(resolve).catch((err: any) => {
                        errors.push({
                            message: isNonNullString(err?.message) ? err.message : stringify(err),
                            data: v,
                            index: index + 1,
                            errors: Array.isArray(err?.errors) ? err.errors : [],
                        });
                        resolve(null);
                    });
                });
            })
            await Promise.all(promises);
            if (errors.length) {
                throw new BadRequestException({
                    message: i18n.translate("validator.failedForNItems", { count: errors.length }),
                    errors,
                })
            }
            return data;
        }
        try {
            await Validator.validateTarget(dtoClass, data);
            return data;
        } catch (e) {
            /**
             * If the validation fails, throws a `BadRequestException` with the validation errors.
             */
            throw new BadRequestException(e)
        }
    }
}




/**
 * @interface IValidatorConfig
 * Interface representing the configuration for the validator pipe.
 * @description This interface defines the structure of the result, which includes the following properties:
 * - `data`: An object containing the validator data.
 * - `dtoClass`: An instance of the DTO class.
 * 
 * @example
 * ```typescript
 * const validatorParamResult: IValidatorConfig = {
 *   data: { name: 'John Doe', age: 30 },
 *   dtoClass: CreateUserDto,
 * };
 * ```
 * 
 * @template T - The type of the dictionary object extending {@link IDict}.
 * 
 * @example
 * // Example usage:
 * const validatorConfig: IValidatorConfig<MyDict> = {
 *   data: { key: 'value' },
 *   dtoClass: MyDtoClass
 * };
 * console.log(validatorConfig.data.key); // Output: 'value'
 */
export interface IValidatorConfig<T extends IDict = IDict> {
    /**
     * An object containing the validator data.
     * 
     * @type {T | T[]}
     * @memberof IValidatorConfig
     * 
     * @example
     * // Example usage with a single object:
     * const singleData = validatorConfig.data;
     * console.log(singleData); // Output: { key: 'value' }
     * 
     * @example
     * // Example usage with an array of objects:
     * const arrayData = validatorConfig.data;
     * console.log(arrayData); // Output: [{ key: 'value1' }, { key: 'value2' }]
     */
    data: T | T[];

    /**
     * An instance of the DTO class.
     * 
     * @type {InstanceType<any>}
     * @memberof IValidatorConfig
     * 
     * @example
     * // Example usage:
     * const dtoInstance = validatorConfig.dtoClass;
     * console.log(dtoInstance); // Output: MyDtoClass instance
     */
    dtoClass: InstanceType<any>;
}