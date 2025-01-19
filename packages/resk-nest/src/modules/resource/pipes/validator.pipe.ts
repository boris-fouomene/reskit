import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, SetMetadata, ExecutionContext, createParamDecorator, UsePipes, applyDecorators } from '@nestjs/common';
import { IClassConstructor, isNonNullString, isObj, Validator } from '@resk/core';

const validatorPipeDtoMetadataKey = Symbol('validatorPipeDtoMetadataKey');

/**
 * A parameter decorator that retrieves the DTO class associated with the current request handler.
 * 
 * This decorator is used to get the DTO class that should be used for validating the request payload.
 * It retrieves the DTO class name from the `validatorPipeDtoMetadataKey` metadata on the handler method,
 * and then returns the corresponding DTO class instance.
 * 
 * @param data - Unused parameter required by the `createParamDecorator` function.
 * @param ctx - The current execution context, which is used to get the controller and handler information.
 * @returns The DTO class instance that should be used for validating the request payload.
 * @throws {BadRequestException} If the DTO method name is invalid or the DTO class is not a function.
 */
export const ValidatorGetDto = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const controller = ctx.getClass();
    const handler = ctx.getHandler();
    const controllerName = controller.name, handlerName = handler.name;
    const errorDetails = `[Controller] : ${controllerName}, [Handler] : ${handlerName}`;
    const methodName = Reflect.getMetadata(validatorPipeDtoMetadataKey, handler);
    if (!isNonNullString(methodName)) throw new BadRequestException("Invalid Dto method name for validator : " + errorDetails);
    if (typeof controller.prototype[methodName] !== "function") {
        throw new BadRequestException("Invalid dto method : The method " + methodName + " is not a function in controller " + controllerName + " : " + errorDetails);
    }
    const r = controller.prototype[methodName]();
    if (typeof r !== "function") {
        throw new BadRequestException("Invalid return type for dto getter " + methodName + " is not a function in controller " + controllerName + " : " + errorDetails);
    }
    return r;
},);

export function ValidatorValidate<T extends InstanceType<any> = any>(getDtoMethodName: keyof T): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        UsePipes(ValidatorPipe)(target, propertyKey, descriptor);
        SetMetadata(validatorPipeDtoMetadataKey, getDtoMethodName)(target, propertyKey, descriptor);
    };
}

@Injectable()
export class ValidatorPipe implements PipeTransform<any> {
    constructor() { }
    async transform(value: any, metadata: ArgumentMetadata) {
        console.log(value, " is value ddddddddddddddddddddddddddd");
        throw new BadRequestException("Cannot validate");
        /* 
                // Transform plain object to class instance
                const object = plainToInstance(DtoClass, value);
        
                // Validate the object
                const errors = await validate(object);
                if (errors.length > 0) {
                const messages = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints,
                
        
                /* if (!isObj(value)) {
                    throw new BadRequestException(`Invalid value type ${typeof value} input for ${this.dtoClass.name}`);
                }
                if (Array.isArray(value)) {
                    return await Promise.all(value.map(async (v: any) => {
                        const r = await this.transform(v, metadata);
                        return v;
                    }));
                }
                const { success, errors, rulesByField, errorsByField, ...rest } = await Validator.validateTarget(this.dtoClass, value);
                if (errors.length > 0) {
                    throw new BadRequestException({
                        errors,
                        data: value,
                        message: errors.join("\n"),
                        errorsByField
                    })
                } */
        ///return value; */
    }
}