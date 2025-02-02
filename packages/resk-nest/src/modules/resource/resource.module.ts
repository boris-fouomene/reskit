import { DynamicModule } from '@nestjs/common';
import { I18nInterceptor, I18nModule } from '../i18n';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PermissionsGuard } from '@auth/permission.guard';
/**
 * The `ResourceModule` is a global NestJS module that provides the `ResourceService` and a configurable `serviceProvider`.
 * It can be imported and configured using the `forRoot()` static method, which takes an object with a `serviceProvider` property.
 * The `ResourceService` and the `serviceProvider` are exported from the module, allowing them to be used in other parts of the application.
 */
export class ResourceModule {
  /**
   * The `forRoot()` static method is used to configure and return a dynamic module for the `ResourceModule`.
   * It takes an object with a `serviceProvider` property, which is used to provide a custom resource service provider.
   * The method returns a dynamic module that includes the `ResourceModule`, the `I18nModule` with empty namespaces, and the configured providers and exports.
   * @param options An object with a `serviceProvider` property, which is a provider for a custom resource service.
   * @returns A dynamic module that can be imported and used in the application.
   */
  static forRoot(options: {
    /**
    * When "true", makes a module global-scoped.
    *
    * Once imported into any module, a global-scoped module will be visible
    * in all modules. Thereafter, modules that wish to inject a service exported
    * from a global module do not need to import the provider module.
    *
    * @default true
    */
    global?: boolean;
  }): DynamicModule {
    options = Object.assign({}, options);
    return {
      global: typeof options.global === 'boolean' ? options.global : true,
      module: ResourceModule,
      imports: [I18nModule.forRoot()],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: I18nInterceptor,
        },
        {
          provide: APP_GUARD,
          useClass: PermissionsGuard,
        }
      ],
      exports: []
    };
  }
}




