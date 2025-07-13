import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { i18n } from '@resk/core/i18n';

/**
 * A guard that checks if the incoming request is using HTTPS protocol.
 * If the request is not using HTTPS, it throws a ForbiddenException.
 *
 * @example
 * To use this guard, you can add it to a controller or a route in your NestJS application.
 * ```typescript
 * @UseGuards(HttpsGuard)
 * @Controller('my-controller')
 * export class MyController {}
 * ```
 */
@Injectable()
export class HttpsGuard implements CanActivate {
    /**
     * Checks if the incoming request is using HTTPS protocol.
     *
     * @param context The execution context of the incoming request.
     * @returns {boolean} True if the request is using HTTPS protocol, false otherwise.
     * @throws {ForbiddenException} If the request is not using HTTPS protocol.
     */
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.protocol !== 'https') {
            throw new ForbiddenException(i18n.t('auth.guards.httpsRequired'));
        }
        return true;
    }
}
