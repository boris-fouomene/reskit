import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { defaultStr, I18n } from '@resk/core';

/**
 * I18n Interceptor class that handles internationalization for incoming requests.
 * 
 * This class implements the NestInterceptor interface and is responsible for setting the locale
 * based on the 'Accept-Language' header in the incoming request.
 * 
 * @example
 * ```typescript
 * // Example usage in a NestJS module
 * import { Module } from '@nestjs/common';
 * import { I18nInterceptor } from './i18n.interceptor';
 * 
 * @Module({
 *   providers: [I18nInterceptor],
 *   exports: [I18nInterceptor],
 * })
 * export class AppModule {}
 * ```
 * @example
 * Example, Global language Interceptor : 
 * ```typescript
 *  //i18n.controller.ts
 *  import { Controller, Get, Inject } from '@nestjs/common';
    import { I18n } from '@resk/core';
    @Controller('i18n')
    export class I18nController {
      constructor(@Inject('I18N') private readonly i18n: I18n) {}
      @Get()
      async getHello(): Promise<string> {
        const message = await this.i18n.t('greeting', { name: 'John' });
        return message;
      }
    }
 *  //app.module.ts
 *  import { APP_INTERCEPTOR } from '@nestjs/core';
    import { I18nModule,I18nInterceptor } from '@resk/nest';
    @Module({
      imports: [
        I18nModule.forRoot({
          namespaces: {
            'common': () => import('./locales/common'),
            'auth': () => import('./locales/auth'),
          },
        }),
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nInterceptor,
        },
      ],
    })
    export class AppModule {}
 * 
 */
@Injectable()
export class I18nInterceptor implements NestInterceptor {
  /**
   * Creates an instance of I18nInterceptor.
   * 
   * @param i18n The I18n instance injected through the 'I18N' token.
   */
  constructor(@Inject("I18N") private readonly i18n: I18n) { }

  /**
   * Intercepts incoming requests and sets the locale based on the 'Accept-Language' header.
   * 
   * @param context The ExecutionContext of the incoming request.
   * @param next The CallHandler that handles the next step in the request pipeline.
   * 
   * @returns An Observable that represents the result of the request.
   * 
   * @example
   * ```typescript
   * // Example usage in a NestJS controller
   * import { Controller, Get } from '@nestjs/common';
   * import { I18nInterceptor } from './i18n.interceptor';
   * 
   * @Controller('example')
   * export class ExampleController {
   *   @Get()
   *   async getExample(): Promise<string> {
   *     // The locale is set by the I18nInterceptor
   *     return this.i18n.translate('example.message');
   *   }
   * }
   * ```
   */
  async intercept(context: ExecutionContext, next: CallHandler) {
    /**
     * Gets the incoming request from the ExecutionContext.
     */
    const request = context.switchToHttp().getRequest();

    /**
     * Extracts the 'Accept-Language' header from the request and sets the locale accordingly.
     * 
     * If the 'Accept-Language' header is not present, it defaults to 'en'.
     */
    let lang = defaultStr(Object.assign({}, request.headers)['accept-language'], Object.assign({}, request.headers)['Accept-Language'], 'en');
    if (!this.i18n.hasLocale(lang)) {
      lang = "en";
    }
    /** 
     * Sets the locale using the I18n instance.
     */
    await this.i18n.setLocale(lang);

    /**
     * Calls the next handler in the request pipeline.
     */
    return next.handle();
  }
}