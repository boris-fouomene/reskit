import { I18n } from '@resk/core/i18n';
import { DynamicModule, Inject, Injectable } from '@nestjs/common';
import { isObj } from '@resk/core/utils';

interface II18nTranslation extends Record<string, any> { }
/**
 * A dynamic NestJS module for managing internationalization (i18n) within the application.
 * This module allows registering namespace resolvers and loading namespaces dynamically.
 *
 * @example
 * ```typescript
 * I18nModule.forRoot({
 *   'common': () => import('./locales/common'),
 *   'auth': () => import('./locales/auth'),
 * });
 * ```
 *
 * @class I18nModule
 */
export class I18nModule {
    /**
     **
     * Configures and initializes the `I18nModule` with the provided namespace resolvers.
     * This method registers the namespace resolvers and ensures namespaces are loaded before the application starts.
     *
     * @static
     * @param {Object} options - An object containing the namespace resolvers to register.
     * @param {Object} options.namespaces - An object mapping namespace keys to their respective resolver functions.
     * @param {string} options.namespaces.key - The namespace key (e.g., 'common', 'auth').
     * @param {Function} options.namespaces.value - A function that resolves the namespace (e.g., `(locale) => import('./locales/common')`).
     * @returns {DynamicModule} - A configured dynamic module for NestJS.
     *
     * @example
     * ```typescript
     * @Module({
     *   imports: [
     *     I18nModule.forRoot({
     *        translations: [
     *          {
     *            en: {
     *              greeting: "Hello, {name}!",
     *              farewell: "Goodbye!",
     *            },
     *            fr: {
     *              greeting: "Bonjour, {name}!",
     *              farewell: "Au revoir!",
     *            },
     *          },
     *       ],
     *        namespaces : {
        *       'common': (locale:string) => import('./locales/common'),
        *       'auth': (locale:string) => import('./locales/auth'),
        *     }
     *     }),
     *   ],
     * })
     * export class AppModule {}
     * ```
     * @Module({
     *   imports: [
     *     I18nModule.forRoot({
     *        namespaces : {
        *       'common': (locale:string) => import('./locales/common')
        *     },
        *     createNewInstance: true
     *     }),
     *   ],
     * })
     * export class AppModule {}
     */
    static forRoot(options?: {
        /***
         * The namespaces to register for the module.
         * If provided, the namespaces will be registered for the module.
         */
        namespaces?: { [key: string]: Parameters<typeof I18n.RegisterNamespaceResolver>[1]; }
        /***
         * The translations to load for the module.
         * If provided, the translations will be loaded for the module.
         */
        translations?: II18nTranslation | II18nTranslation[];
        /**
         * Whether to create a new instance of the I18n class for the module.
         * If set to `true`, the I18n class will be created once for the module.
         * If set to `false`, the I18n class will use the default instance, obtained by calling I18N.getInstance().
         * Default value is `false`.
         */
        createNewInstance?: boolean;


        /***
         * When "true", makes a module global-scoped.
         */
        global?: boolean;

        /***
         * The list of supported locales.
         * This is used to determine whether a locale is supported or not.
         */
        locales?: string[];
    }): DynamicModule {
        options = Object.assign({}, options);
        // Create a copy of the namespacesToResolve object to avoid mutation
        const namespacesToResolve = Object.assign({}, options.namespaces);
        // Create an instance of the I18n class
        const i18n = !!options.createNewInstance ? new I18n() : I18n.getInstance();
        // Register each namespace resolver with the i18n instance
        for (let namespace in namespacesToResolve) {
            i18n.registerNamespaceResolver(namespace, namespacesToResolve[namespace]);
        }
        // Register the translations
        (isObj(options.translations) ? [options.translations] : Array.isArray(options.translations) ? options.translations : []).map(translation => {
            i18n.registerTranslations(translation);
        });
        if (Array.isArray(options.locales) && options.locales.length > 0) {
            i18n.setLocales(options.locales);
        }
        // Return the dynamic module configuration
        return {
            module: I18nModule,
            global: typeof options.global === "boolean" ? options.global : true,
            imports: [],
            providers: [
                {
                    provide: "I18N",
                    useFactory: async () => {
                        // Load all registered namespaces
                        await i18n.loadNamespaces();
                        return i18n;
                    }
                }
            ],
            exports: [I18nModule, "I18N"]
        }
    }
}

@Injectable()
export class I18nService {

}
