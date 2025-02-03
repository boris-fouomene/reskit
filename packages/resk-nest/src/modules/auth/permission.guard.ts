import { CanActivate, ExecutionContext, SetMetadata, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Auth, defaultObj, i18n, IAuthPerm, IAuthPermAction, IResourceName, isNonNullString, isObj, ResourcesManager, createPropertyDecorator, getDecoratedProperty, getDecoratedProperties } from '@resk/core';

/**
 * Unique symbol used as the key for storing permissions metadata.
 */
const PERMISSIONS_KEY = Symbol('permissions');

/**
 * Decorator to set permissions metadata on a class or method.
 * 
 * This decorator is used to specify the permissions required to access a class or method.
 * It takes a variable number of IAuthPerm arguments, each representing a permission.
 * 
 * @example
 * ```typescript
 * @Permissions('users:read|update|create',{ resourceName: 'users', action: 'read' }, { resourceName: 'users', action: 'read|update'})
 * class MyController {
 *   // implementation
 * }
 * ```
 * 
 * @param  {(IAuthPerm|{ resourceName: IResourceName, action: IAuthPermAction })[]} permissions A variable number of IAuthPerm arguments, each representing a permission.
 * @returns A decorator that sets the permissions metadata on the target class or method.
 */
export const Permissions = (...permissions: (IAuthPerm | { resourceName: IResourceName, action: IAuthPermAction })[]) => {
    return createPropertyDecorator<(IAuthPerm | { resourceName: IResourceName, action: IAuthPermAction })[]>(PERMISSIONS_KEY, permissions);
};

/**
 * Injectable guard that checks if a user has the required permissions to access a route.
 * 
 * This guard uses the Reflector to get the required permissions from the route's metadata.
 * It then checks if the user has some of the required permissions using the Auth service from the @resk/core package.
 * @note This guard should be used in conjunction with the @Permissions decorator. 
 * The user is retrieved from the request using the switchToHttp method. It must exists and extends the {@link IAuthUser} interface.
 * @example
 * ```typescript
 * @UseGuards(PermissionsGuard)
 * @Controller('my-controller')
 * export class MyController {
 *   // implementation
 * }
 * //users.controller.ts
 * @Controller('users')
 * @UseGuards(PermissionsGuard)
 * export class UsersController {
 *   @Get()
 *   @Permissions('users:read', 'users:update','users:create|delete',{ resourceName: 'users', action: 'read' }, { resourceName: 'users', action: 'read|update'})
 *   getUsers() {
 *     return 'Users list';
 *   }
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor() { }

    /**
     * Method that checks if a user has the required permissions to access a route.
     * 
     * This method is called by the NestJS framework before the route is executed.
     * It returns a boolean indicating whether the user has the required permissions.
     * 
     * @param context The ExecutionContext instance.
     * @returns A boolean indicating whether the user has the required permissions.
     */
    canActivate(context: ExecutionContext): boolean {
        /**
         * Get the required permissions from the route's metadata.
         * 
         * The Reflector is used to get the required permissions from the route's metadata.
         * The getAllAndOverride method is used to get all the required permissions from the route's metadata,
         * including any overridden permissions.
         */
        const requiredPermissions = getDecoratedProperty<IAuthPerm[]>(context.getClass(), PERMISSIONS_KEY, context.getHandler().name);
        /**
         * If no required permissions are found, return true.
         * 
         * This means that the route does not require any permissions to access.
         */
        if (!Array.isArray(requiredPermissions) || !requiredPermissions.length) return true;

        /**
         * Get the user from the request.
         * 
         * The user is retrieved from the request using the switchToHttp method.
         */
        const user = defaultObj(context.switchToHttp().getRequest().user, Auth.getSignedUser());

        /**
         * If the user is not an object, return false.
         * 
         * This means that the user is not authenticated or does not have the required permissions.
         */
        if (!isObj(user) || !Object.getSize(user, true)) {
            throw new UnauthorizedException(i18n.t('auth.unauthorized'));
        }

        /**
         * Check if the user has any of the required permissions.
         * 
         * The some method is used to check if the user has any of the required permissions.
         * The Auth.isAllowed method is used to check if the user has a specific permission.
         */
        const canActivate = requiredPermissions.some(perm => {
            if (isObj(perm) && typeof perm == "object") {
                const { resourceName, action } = perm;
                if (isNonNullString(resourceName) && isNonNullString(action)) {
                    return ResourcesManager.isAllowed({ resourceName: resourceName, perm: action }, user);
                }
                return false;
            } else {
                const split = String(perm).trim().split(":");
                const resourceName: IResourceName = split[0] as IResourceName;
                const action = split[1] as IAuthPermAction;
                if (isNonNullString(resourceName) && isNonNullString(action)) {
                    return ResourcesManager.isAllowed({ resourceName, perm: action }, user);
                }
                return Auth.isAllowed(perm, user);
            }
        });
        if (!canActivate) {
            throw new ForbiddenException(i18n.t("auth.guards.permissions.forbiddenError"));
        }
        return true;
    }
} 