import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { applyLanguage } from './utils';
import { I18n } from '@resk/core';

/**
 * A NestJS middleware class that handles internationalization (i18n) for incoming requests.
 * 
 * This class implements the NestMiddleware interface and is responsible for setting the locale
 * based on the 'Accept-Language' header in the incoming request.
 * 
 * @example
 * ```typescript
 * // Example usage in a NestJS module
 * import { Module } from '@nestjs/common';
 * import { I18nMiddleware } from '@resk/nest';
 * 
 * export class AppModule implements NestMiddleware {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer.apply(I18nMiddleware).forRoutes('*');
 *   }
 * }
 * ```
 */
@Injectable()
export class I18nMiddleware implements NestMiddleware {
    /**
     * Creates an instance of I18nMiddleware.
     * 
     * @param i18n The I18n instance injected through the 'I18N' token.
     */
    constructor(@Inject("I18N") private readonly i18n: I18n) { }

    /**
     * Handles incoming requests and sets the locale based on the 'Accept-Language' header.
     * 
     * @param req The incoming request object.
     * @param res The response object.
     * @param next The next function in the middleware chain.
     * 
     * @returns A promise that resolves when the locale has been set.
     */
    async use(req: Request, res: Response, next: NextFunction) {
        /**
         * Applies the language to the I18n instance based on the 'Accept-Language' header in the request.
         */
        await applyLanguage(this.i18n, req);

        /**
         * Calls the next function in the middleware chain.
         */
        next();
    }
}