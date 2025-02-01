import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { defaultStr, IResourceData, IResourcePrimaryKey } from '@resk/core';
import { ResourceController } from '@resource/resource.controller';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IResourceControllerInferDataType } from '@resource/interfaces';


@Injectable()
/***
 * The `ResourceInterceptor` class is an interceptor that provides hooks for performing actions before and after a resource operation.
 * This interceptor can be used to perform common operations before and after a resource operation, such as logging, validation, and error handling.
 * 
 * @example
 * // Example of using the ResourceInterceptor
 * import { Controller, Post, UseInterceptors, Body, Put } from '@nestjs/common';
    import { ResourceInterceptor } from '@resk/nest';
    @Controller('products')
    @UseInterceptors(ProductInterceptor)
    export class ProductController extends ResourceController<ProductDto, ProductService> {
        constructor(service: ProductService) {
            super(service);
        }
    }
    @Injectable()
    class ProductService extends ResourceService<ProductDto> {
        constructor(dataService: ResourceDataSource) {
            super(dataService);
        }
    }
    @Injectable()
    class ProductInterceptor extends ResourceInterceptor {
        beforeGetMany(context) {
            // Perform custom logic before getting all products
            return true;
        }
        beforeGetOne(context) {
            // Perform custom logic before getting a product
            return true;
        }
        beforeCreate(context) {
            // Perform custom logic before inserting a product
            thow new BadRequestException("Error, could not create product");
        }
        beforeUpdate(context) {
            // Perform custom logic before updating a product
            return true;
        }
        beforeDelete(context) {
            // Perform custom logic before deleting a product
            return true;
        }
        beforeUnknow(context) {
            // Perform custom logic before an unknown method
            return true;
        }
        afterCreate(result, context) {
            // Perform custom logic after creating a product
            result.name = "Updated name";
            return result;
        }  
        afterUpdate(result, context) {
            // Perform custom logic after updating a product
            return result;
        }
        afterDelete(result, context) {
            // Perform custom logic after deleting a product
            return result;
        }
        afterGetMany(result, context) {
            // Perform custom logic after getting all products
            return result;
        }
        afterGetOne(result, context) {
            // Perform custom logic after getting a product
            return result;
        }
        afterUnknow(result, handler, context) {
            // Perform custom logic after an unknown method
            return result;
        }
    }
    @Injectable()
    class ProductDataSource extends ResourceDataSource {
        constructor(dataSource: DataSource) {
            super(dataSource);
        }
    }
    @Injectable()
    class ProductDto extends ResourceDto {
        constructor(data: any) {
            super(data);
        }
    }
 */
export class ResourceInterceptor<ControllerType extends ResourceController<any, any> = ResourceController<any, any>> implements NestInterceptor {
    private request: any;
    private context: ExecutionContext | undefined;

    /***
     * Retrives the request from the context
     * @returns {any} The request
     */
    protected getRequest() {
        return this.request;
    }
    /***
     * Retrives the context from the interceptor
     * @returns {ExecutionContext} The context
     */
    protected getContext(): ExecutionContext {
        return this.context as ExecutionContext;
    }
    /***
     * Retrives the handler name from the context
     * @param context - The execution context
     * @returns {keyof ControllerType} The handler name
     */
    protected getHanlder(): keyof ControllerType {
        return (this.getRequest()?.getHandler()?.name as keyof ControllerType);
    }
    protected getMethod(context: ExecutionContext): string {
        return defaultStr(context.switchToHttp()?.getRequest()?.method);
    }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        this.context = context;
        this.request = context.switchToHttp().getRequest();
        const handler: keyof ControllerType = (context.getHandler().name as keyof ControllerType);
        try {
            // Perform async operation before the method execution based on the route and method
            await this.performBeforeAction(handler, context);
        } catch (error) {
            // Handle exception from beforeTrigger
            return throwError(() => error); // Re-throw the caught exception
        }
        return next.handle().pipe(
            tap(async (response) => {
                try {
                    // Perform async operation after the method execution, passing the response
                    const data = await this.performAfterAction(handler, context, response);
                    if (data !== undefined) {
                        return data;
                    }
                    return response;
                } catch (error) {
                    // Handle exception from afterTrigger
                    throw error; // Re-throw the caught exception
                }
            }),
            catchError((error) => {
                // Handle any other exceptions that occur during the method execution
                return throwError(() => error); // Re-throw the caught exception
            }),
        );
    }
    protected async beforeUnknow(handler: keyof ControllerType, context: ExecutionContext): Promise<any> {
        return Object.assign({}, context.switchToHttp().getRequest().body);
    }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param data - The data being processed.
     * @param request - The request object.
     * @returns The modified data.
     */
    protected async performBeforeAction(
        /***
         * The name of the method being executed from the controller.
         */
        handler: keyof ControllerType,
        /***
         * The execution context.
         */
        context: ExecutionContext,
    ) {
        switch (handler) {
            case 'getMany':
                return await this.beforeGetMany(context);
            case 'getOne':
                return await this.beforeGetOne(context);
            case 'create':
                return await this.beforeCreate(context);
            case 'update':
                return await this.beforeUpdate(context);
            case 'delete':
                return await this.beforeDelete(context);
            default:
                return await this.beforeUnknow(handler, context);
        }
    }

    // Define the `after` hooks
    protected async performAfterAction(handler: keyof ControllerType, context: ExecutionContext, result: any) {
        switch (handler) {
            case 'getMany':
                return await this.afterGetMany(result, context);
            case 'getOne':
                return await this.afterGetOne(result, context);
            case 'create':
                return await this.afterCreate(result, context);
            case 'update':
                return await this.afterUpdate(result, context);
            case 'delete':
                return await this.afterDelete(result, context);
            default:
                return await this.afterUnknow(result, handler, context);
        }
    }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {ExecutionContext} context - The execution context.
     */
    protected beforeGetMany(context: ExecutionContext) { }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {ExecutionContext} context - The execution context.
     */
    protected beforeGetOne(context: ExecutionContext) { }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {ExecutionContext} context - The execution context.
     * @throws {BadRequestException}, if the data is invalid. Possible reason : The request data is invalid or doesn't meet the requirements for creating a resource. Example: Missing required fields, invalid data format, or duplicate resource creation.
     */
    protected async beforeCreate(context: ExecutionContext) {
        return Object.assign({}, context.switchToHttp().getRequest().body);
    }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {ExecutionContext} context - The execution context.
     * @throws {BadRequestException|Error}, if the data is invalid. Possible reason : The request data is invalid or doesn't meet the requirements for creating a resource. Example: Missing required fields, invalid data format, or duplicate resource creation.
     */
    protected async beforeUpdate(context: ExecutionContext) { }
    /***
     * Hooks for `before` actions (to be overridden by subclasses)
     * @param {ExecutionContext} context - The execution context.
     */
    protected beforeDelete(context: ExecutionContext) { }

    /***
     * Hooks for `after` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param {IResourceControllerInferDataType<ControllerType>[]} result - The result of the method execution.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterGetMany(result: IResourceControllerInferDataType<ControllerType>[], context: ExecutionContext) {
        return result;
    }
    /***
     * Hooks for `after` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param {IResourceControllerInferDataType<ControllerType>|null} result - The result of the method execution.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterGetOne(result: IResourceControllerInferDataType<ControllerType> | null, context: ExecutionContext) {
        return result;
    }
    /***
     * Hooks for `after` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param {IResourceControllerInferDataType<ControllerType>[] | IResourceControllerInferDataType<ControllerType>} result - The result of the method execution.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterCreate(result: IResourceControllerInferDataType<ControllerType>[] | IResourceControllerInferDataType<ControllerType>, context: ExecutionContext) {
        return result;
    }
    /***
     * Hooks for `after` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param {IResourceControllerInferDataType<ControllerType>[] | IResourceControllerInferDataType<ControllerType>} result - The result of the method execution.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterUpdate(result: IResourceControllerInferDataType<ControllerType>[] | IResourceControllerInferDataType<ControllerType>, context: ExecutionContext) {
        return result;
    }
    /***
     * Hooks for `after` actions (to be overridden by subclasses)
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @param {boolean|number} result - The result of the method execution.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterDelete(result: boolean | number, context: ExecutionContext) {
        return result;
    }

    /***
     * Hooks for `after` actions (to be overridden by subclasses).
     * @param {any} result - The result of the method execution.
     * @param {keyof ControllerType} handler - The name of the method being executed from the controller.
     * @param {ExecutionContext} context - The execution context.
     * @returns The modified result. That modified result will be returned to the client.That can be the same as the original result or a modified version of it. If nothing is returnded, The previous result is returned to the client.
     */
    protected async afterUnknow(result: any, handler: keyof ControllerType, context: ExecutionContext) {
        return result;
    }
}
