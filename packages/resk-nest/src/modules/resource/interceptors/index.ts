import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { isObj } from '@resk/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        beforeInsert(context, data) {
            // Perform custom logic before inserting a product
            return data;
        }
        afterCreate(context, result) {
            // Perform custom logic after creating a product
            return result;
        }
    }
 */
export class ResourceInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const data = request.body;
        const method = request.method.toLowerCase();
        // Retrieve the controller method name
        const methodName = context.getHandler().name;;
        // Determine the action (e.g., 'create', 'update')
        const action = this.getActionFromMethod(method, context);

        // Perform the `before` action
        const modifiedData = this.performBeforeAction(action, context, data, methodName, request);
        if (isObj(modifiedData)) {
            request.body = modifiedData;
        }
        return next.handle().pipe(
            map((result) => {
                // Perform the `after` action
                return this.performAfterAction(action, context, result, methodName, request);
            }),
        );
    }

    // Map HTTP methods to CRUD actions
    private getActionFromMethod(method: string, context: ExecutionContext): string {
        const route = context.switchToHttp().getRequest().route.path;
        if (method === 'post') return 'insert';
        if (method === 'put' || method === 'patch') return 'update';
        if (method === 'delete') return 'delete';
        if (method === 'get') return route.includes(':id') ? 'findOne' : 'findAll';
        return 'unknown';
    }

    // Define the `before` hooks
    protected performBeforeAction(
        action: string,
        context: ExecutionContext,
        data: any,
        /**
         * The name of the method being executed from the controller.
         */
        methodName: string,
        request: any,
    ): any {
        switch (action) {
            case 'insert':
                return this.beforeInsert(context, data);
            case 'update':
                return this.beforeUpdate(context, data);
            case 'delete':
                return this.beforeDelete(context, data);
            case 'findOne':
                return this.beforeFindOne(context, data);
            case 'findAll':
                return this.beforeFindAll(context, data);
            default:
                return data;
        }
    }

    // Define the `after` hooks
    protected performAfterAction(action: string, context: ExecutionContext, result: any, methodName: string, request: any): any {
        switch (action) {
            case 'create':
                return this.afterCreate(context, result);
            case 'update':
                return this.afterUpdate(context, result);
            case 'delete':
                return this.afterDelete(context, result);
            case 'findOne':
                return this.afterFindOne(context, result);
            case 'findAll':
                return this.afterFindAll(context, result);
            default:
                return result;
        }
    }

    // Hooks for `before` actions (to be overridden by subclasses)
    protected beforeInsert(context: ExecutionContext, data: any): any {
        return data;
    }

    protected beforeUpdate(context: ExecutionContext, data: any): any {
        return data;
    }

    protected beforeDelete(context: ExecutionContext, data: any): any {
        return data;
    }

    protected beforeFindOne(context: ExecutionContext, data: any): any {
        return data;
    }

    protected beforeFindAll(context: ExecutionContext, data: any): any {
        return data;
    }

    // Hooks for `after` actions (to be overridden by subclasses)
    protected afterCreate(context: ExecutionContext, result: any): any {
        return result;
    }

    protected afterUpdate(context: ExecutionContext, result: any): any {
        return result;
    }

    protected afterDelete(context: ExecutionContext, result: any): any {
        return result;
    }

    protected afterFindOne(context: ExecutionContext, result: any): any {
        return result;
    }

    protected afterFindAll(context: ExecutionContext, result: any): any {
        return result;
    }
}
