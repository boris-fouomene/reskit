import "reflect-metadata";
import isNonNullString from "@utils/isNonNullString";
import { I18nEvent, II18nTranslation } from "../types/i18n";
import { extendObj, isObj } from "@utils/object";
import { IObservable, IObservableCallback, observableFactory } from "@utils/observable";
import { Dict, I18n as I18nJs, I18nOptions, Scope, TranslateOptions } from "i18n-js";
import defaultStr from "@utils/defaultStr";
import stringify from "@utils/stringify";
import session from "@session/index";
import { IDict } from "../types/index";
import { isString } from "lodash";
import moment from "moment";
import { createPropertyDecorator, getDecoratedProperties } from "@/decorators";

/**
 * A key to store metadata for translations.
 */
const TRANSLATION_KEY = Symbol("TRANSLATION_KEY");

/**
* A decorator to attach metadata to properties or methods for translation.
* @param key The translation key in the translations.
* @returns A property and method decorator.
* @example 
* ```ts
*   // Class with translations using the decorator
    class MyComponent {
        @Translate("greeting")
        public greeting: string;

        @Translate("nested.example")
        public nestedExample: string;

        @Translate("farewell")
        public sayGoodbye(): string {
            return "";
        }
    }
* ```
*/
export function Translate(key: string): PropertyDecorator & MethodDecorator {
    return createPropertyDecorator<string>(TRANSLATION_KEY, key);
}

/**
 * The I18n class extends the i18n-js library to provide internationalization (i18n) 
 * functionality with observable capabilities. It manages translations, allows for 
 * dynamic loading of language dictionaries, and supports event-driven architecture 
 * through observable patterns.
 * 
 * @extends I18nJs
 * @implements IObservable<I18nEvent>
 * 
 * @example
 * // Example usage of the I18n class
 * const i18nInstance = I18n.getInstance();
 * i18nInstance.registerTranslations({
 *   en: {
 *     greeting: "Hello, {name}!",
 *     farewell: "Goodbye!",
 *   },
 * });
 * console.log(i18nInstance.t("greeting", { name: "John" })); // Outputs: Hello, John!
 * @see https://www.npmjs.com/package/i18n-js?activeTab=readme for more information on i18n-js library.
 */
export class I18n extends I18nJs implements IObservable<I18nEvent> {

    /**
     * Translates the given scope with the provided options.
     * If the scope is a string and the options include pluralization, the method will pluralize the translation.
     * Otherwise, it will call the parent `translate` method.
     * @param scope The translation scope.
     * @param options The translation options, including pluralization.
     * @returns The translated string or the type specified in the generic parameter.
     * @example
     * // Register translations for the "en" locale.
     * i18n.registerTranslations({
     *   en: {
     *     greeting: {
     *       one: "Hello, %{name}!",
     *       other: "Hello, %{name}s!",
     *       zero: "Hello, %{name}s!"
     *     },
     *     farewell: "Goodbye!"
     *   }
     * });
     * 
     * // Translate the "greeting" scope with pluralization.
     * i18n.translate("greeting", { count: 1 }); // "Hello, John!"
     * i18n.translate("greeting", { count: 2 }); // "Hello, Johns!"
     * i18n.translate("greeting", { count: 0 }); // "Hello, Johns!"
     * 
     * // Translate the "farewell" scope.
     * i18n.translate("farewell"); // "Goodbye!"    
     */
    translate<T = string>(scope: Scope, options?: TranslateOptions): string | T {
        if (this.isPluralizeOptions(options) && this.canPluralize(scope)) {
            if (typeof options.count === "number") {
                options.countStr = (options.count).formatNumber();
            }
            return this.pluralize(options.count as number, scope, options);
        }
        return super.translate(scope, options);
    }
    /***
     * Translates the keys of the given target class.
     * @param target The target class.
     * @param options The translation options.
     * @returns The translated keys.
     */
    translateTarget<T extends { new(...args: any[]): {} } = any>(target: T, options?: TranslateOptions): Record<string, string> {
        const translationKeys = I18n.getTargetTanslationKeys(target);
        for (let i in translationKeys) {
            if (isNonNullString(translationKeys[i])) {
                translationKeys[i] = this.t(translationKeys[i], options);
            }
        }
        return translationKeys;
    }
    /***
     * returns the translation keys for the target class
     * @param target the target class
     * @returns the translation keys for the target class
     */
    static getTargetTanslationKeys<T extends { new(...args: any[]): {} } = any>(target: T): Record<keyof T, string> {
        return getDecoratedProperties(target, TRANSLATION_KEY);
    }
    private _isLoading: boolean = false;
    /***
     * locales that are superted by the i18n instance
     */
    private _locales: string[] = [];
    /**
     * Namespace resolvers for loading translations.
     */
    private namespaceResolvers: Record<string, (locale: string) => Promise<II18nTranslation>> = {};
    /**
     * Singleton instance of the I18n class.
     */
    private static instance: I18n;

    /**
     * Creates an instance of the I18n class.
     * @param options Optional configuration options for the I18n instance.
     */
    constructor(translations: II18nTranslation = {}, options: Partial<I18nOptions> = {}) {
        super(translations, options);
        this.loadNamespaces();
    }
    readonly _observableFactory = observableFactory<I18nEvent>();
    readonly _____isObservable?: boolean | undefined = true;
    /**
     * Subscribes a callback function to a specific event.
     * @param event The event name to listen for.
     * @param fn The callback function to be invoked when the event is triggered.
     * @returns An object containing a remove method to unsubscribe from the event.
     */
    on(event: I18nEvent, fn: IObservableCallback) {
        return this._observableFactory.on.call(this, event, fn);
    }
    /**
     * Registers a callback to be invoked finally when an event is triggered.
     * @param event The event name.
     * @param fn The callback function to be invoked.
     * @returns The observable instance.
     */
    finally(event: I18nEvent, fn: IObservableCallback) {
        return this._observableFactory.finally.call(this, event, fn);
    }
    /**
     * Unsubscribes a callback from a specific event.
     * @param event The event name.
     * @param fn The callback function to remove.
     * @returns The observable instance.
     */
    off(event: I18nEvent, fn: IObservableCallback) {
        return this._observableFactory?.off.call(this, event, fn);
    }
    /**
    * Triggers a specific event with optional arguments.
    * @param event The event name to trigger.
    * @param args Optional arguments to pass to the event callbacks.
    * @returns The observable instance.
    */
    trigger(event: I18nEvent | "*", ...args: any[]) {
        return this._observableFactory?.trigger.call(this, event, ...args);
    }
    /**
     * Unsubscribes all event callbacks for this component.
     * @returns The observable instance.
     */
    offAll(): IObservable<I18nEvent> {
        return this._observableFactory?.offAll.call(this)
    }
    /**
    * Subscribes a callback function to be triggered once for a specific event.
    * @param event The event name.
    * @param fn The callback function to be invoked.
    * @returns An object containing a remove method to unsubscribe from the event.
    */
    once(event: I18nEvent, fn: IObservableCallback) {
        return this._observableFactory?.once.call(this, event, fn);
    }
    /**
     * Retrieves all registered event callbacks.
     * @returns An object mapping event names to their respective callback functions.
     */
    getEventCallBacks() {
        return this._observableFactory?.getEventCallBacks.call(this);
    }
    /**
     * Retrieves the singleton instance of the I18n class.
     * @returns The singleton I18n instance.
     */
    static getInstance(options?: I18nOptions): I18n {
        if (!I18n.instance) {
            const locale = I18n.getLocaleFromSession();
            I18n.instance = this.createInstance({}, Object.assign({}, locale ? { locale } : {}, options));
        }
        return I18n.instance;
    }
    /***
     * returns true if the instance is the default instance.
     * @returns true if the instance is the default instance.
     */
    isDefaultInstance() {
        return this === I18n.instance;
    }
    private static setLocaleToSession(locale: string) {
        session.set("i18n.locale", locale);
    }
    private static getLocaleFromSession() {
        return session.get("i18n.locale") as string;
    }
    /**
     * Checks if the provided translation key can be pluralized for the given locale.
     * @param scope The translation scope to check.
     * @param locale The locale to use for the check. If not provided, the current locale is used.
     * @returns `true` if the translation key can be pluralized, `false` otherwise.
     * @note This method is useful for determining if a translation key can be pluralized for a specific locale.
     * A translation key can be pluralized if it has pluralization rules defined in the translation dictionary.
     * The pluralization rules are defined in the `one`, `other`, and `zero` properties of the translation dictionary.
     * @example
     * //register a translation dictionary for the "en" locale.
     * i18n.registerTranslations({
     *   en: {
     *     greeting: {
     *       one: "Hello, {name}!",
     *       other: "Hello, {name}s!",
     *       zero: "Hello, {name}s!"
     *     },
     *     farewell: "Goodbye!"
     *   }
     * );
     * });
     * // Check if the translation key "greeting" can be pluralized for the current locale.
     * i18n.canPluralize("greeting");
     * 
     * // Check if the translation key "greeting" can be pluralized for the "en" locale.    
     * i18n.canPluralize("greeting", "en"); 
     * i18n.canPluralize("greeting", "fr"); // returns false
     * i18n.canPluralize("farewell", "en"); // returns false
     */
    canPluralize(scope: Scope, locale?: string) {
        locale = defaultStr(locale, this.getLocale());
        const r = this.getNestedTranslation(scope, locale) as IDict;
        if (!isObj(r) || !r) return false;
        return isString(r?.one) && isString(r?.other) //&& isNonNullString(r?.zero);
    }
    /**
     * Resolves translation for nested keys.
     * @param scope {Scope} The translation scope.
     * @param locale The locale to use for translation.
     * @returns The translated string or undefined if not found.
     * @example
     * // Register translations for the "en" locale.
     * i18n.registerTranslations({
     *   en: {
     *     greeting: {
     *       one: "Hello, {name}!",
     *       other: "Hello, {name}s!",
     *       zero: "Hello, {name}s!"
     *     },
     *     farewell: "Goodbye!"
     *   }
     * });
     * 
     * // Resolve translation for the "greeting" key.
     * i18n.getNestedTranslation("greeting.one", "en");
     * 
     * // Resolve translation for the "greeting" key.
     * i18n.getNestedTranslation("greeting.other", "en");
     * 
     * // Resolve translation for the "greeting" key.
     * i18n.getNestedTranslation("en", "greeting.zero", 0);
     * 
     * // Resolve translation for the "farewell" key.
     * i18n.getNestedTranslation("en", "farewell");
     */
    getNestedTranslation(scope: Scope, locale?: string): string | IDict | undefined {
        locale = defaultStr(locale, this.getLocale());
        const scopeArray = isNonNullString(scope) ? scope.trim().split(".") : Array.isArray(scope) ? scope : [];
        if (!scopeArray.length) return undefined;
        let result: any = this.getTranslations(locale);
        const canLog = scope === "dates.defaultDateFormat";
        for (const k of scopeArray) {
            if (isObj(result)) {
                result = result[k];
            } else {
                return undefined;
            }
        }
        return result;
    }
    /**
     * Checks if the provided `TranslateOptions` object has a `count` property of type `number`.
     * This is used to determine if the translation should be pluralized based on the provided count.
     * @param options The `TranslateOptions` object to check.
     * @returns `true` if the `options` object has a `count` property of type `number`, `false` otherwise.
     */
    isPluralizeOptions(options?: TranslateOptions): options is TranslateOptions {
        return !!(isObj(options) && options && typeof (options.count) === "number");
    }
    /**
     * static function to attach translations to the I18n default instance.
        @example : 
        // --- Usage as a decorator ---
        I18n.RegisterTranslations({
            de: {
                greeting: "Hallo, {name}!",
                farewell: "Auf Wiedersehen!",
            },
        })
    * @param translations The language translations.
    */
    static RegisterTranslations(translations: II18nTranslation): II18nTranslation {
        return I18n.getInstance().registerTranslations(translations);
    }

    /**
     * Factory method to create I18n instances dynamically.
     * @param options Optional configuration options for the I18n instance.
     * @returns A new I18n instance.
     */
    static createInstance(translations: II18nTranslation = {}, options: Partial<I18nOptions> & { interpolate?: (i18n: I18nJs, str: string, params: Record<string, any>) => string } = {}): I18n {
        const { interpolate: i18nInterpolate, ...restOptions } = Object.assign({}, options);
        const i18n = new I18n(translations, restOptions);
        i18n.interpolate = (i18n: I18nJs, str: string, params: Record<string, any>) => {
            const flattenParams = I18n.flattenObject(params);
            const formattedValue = this.defaultInterpolator(i18n, str, flattenParams);
            if (isNonNullString(formattedValue) && formattedValue !== str) {
                str = formattedValue;
            }
            if (typeof i18nInterpolate == "function") {
                return i18nInterpolate(i18n, str, params);
            }
            return str;
        }
        return i18n;
    }


    /**
     * Gets the translations for the specified locale, or all translations if no locale is provided.
     * @param locale The locale to get translations for. If not provided, returns all translations.
     * @returns The translations for the specified locale, or all translations if no locale is provided.
     * @example
     * // Get all translations
     * const translations = i18n.getTranslations();
     * console.log(translations);
     * 
     * // Get translations for the "en" locale
     * const enTranslations = i18n.getTranslations("en");
     * console.log(enTranslations);
     */
    getTranslations(locale?: string) {
        const r = isObj(this.translations) ? this.translations : {};
        if (isNonNullString(locale)) {
            return isObj(r[locale]) ? r[locale] : {};
        }
        return r;
    }

    /**
     * Registers translations into the I18n manager.
     * @param translations The translations to register.
     * @returns The updated translations.
     */
    public registerTranslations(translations: II18nTranslation): II18nTranslation {
        this.store(translations);
        return this.getTranslations();
    }

    /**
     * Stores the provided translations and triggers a "translations-changed" event with the current locale and translations.
     * @param translations The translations to store.
     */
    store(translations: Dict): void {
        super.store(translations);
        this.trigger("translations-changed", this.getLocale(), this.getTranslations());
    }
    /**
     * Automatically resolves translations using reflect Metadata.
     * Translations created using the @Translate decorator will be resolved.
     * @param target The target class instance or object.
     * @example 
     * // Class with translations using the decorator
     * class MyComponent {
     *     @Translate("greeting")
     *     public greeting: string;
     * 
     *     @Translate("nested.example")
     *     public nestedExample: string;
     * 
     *     @Translate("farewell")
     *     public sayGoodbye(): string {
     *         return "";
     *     }
     * }
     * // Resolve translations and print them
     * const component = new MyComponent();
     * I18n.getInstance().resolveTranslations(component);
     */
    public resolveTranslations<T extends Object>(target: T): void {
        try {
            const keys = Object.getOwnPropertyNames(target);
            for (const key of keys) {
                const metadataKey = Reflect.getMetadata(TRANSLATION_KEY, target, key);
                if (metadataKey) {
                    try {
                        (target as any)[key] = this.t(metadataKey);
                    } catch (error) {
                        console.error(error, " resolving translation for key : ", metadataKey);
                    }
                }
            }
        } catch (error) {
            console.error(error, " resolving translations for target : ", target);
        }
    }

    /***
     * returns the missing placeholder string for the given placeholder and message.
     * @param placeholder - The placeholder to be replaced.
     * @param message - The message to be displayed.
     * @param options - The options for the missing placeholder string.
     * @returns The missing placeholder string.
     */
    getMissingPlaceholderString(placeholder: string, message?: string, options?: II18nTranslation) {
        if (typeof this.missingPlaceholder == "function") {
            return this.missingPlaceholder(this, placeholder, defaultStr(message), Object.assign({}, options));
        }
        return placeholder;
    }
    get locale() {
        return super.locale;
    }
    /**
     * Gets the current locale for the i18n instance.
     * @returns {string} The current locale.
     */
    getLocale() {
        return super.locale;
    }

    /**
     * Sets the list of supported locales for the i18n instance.
     * @param locales - An array of locale strings to set as the supported locales.
     * @returns The list of all locales supported by the i18n instance, including both the locales for which translations are available and the locales explicitly set as supported.
     */
    public setLocales(locales: string[]) {
        this._locales = Array.isArray(locales) ? locales : ["en"];
        if (!this._locales.includes("en")) {
            this._locales.push("en");
        }
        return this.getLocales();
    }
    /***
     * returns true if the locale is supported by a i18n instance.
     * @param locale - The locale to check.
     * @returns true if the locale is supported, false otherwise.
     */
    public hasLocale(locale: string) {
        return isNonNullString(locale) && this.getLocales().includes(locale);
    }

    /**
     * Gets the list of all locales supported by the i18n instance, including both the locales for which translations are available and the locales explicitly set as supported.
     * @returns {string[]} The list of all supported locales.
     */
    getLocales(): string[] {
        const translations = Object.keys(this.getTranslations());
        const suportedLocales = Array.isArray(this._locales) ? this._locales : ["en"];
        const r = [...translations, ...suportedLocales.filter((locale) => !translations.includes(locale))];
        if (!r.includes("en")) {
            r.push("en");
        }
        return r;
    }
    /***
     * returns true if the locale is supported by the i18n instance.
     * @param locale - The locale to check.
     * @returns true if the locale is supported, false otherwise.
     */
    isLocaleSupported(locale: string): boolean {
        if (!isNonNullString(locale)) return false;
        return this.getLocales().includes(locale);
    }
    /***
     * returns true if the instance is loading translations.
     * @returns true if the instance is loading translations, false otherwise.
     * @example
     * // Check if the instance is loading translations.
     * i18n.isLoading();
     */
    isLoading() {
        return this._isLoading;
    }
    /**
     * Sets the locale for the i18n instance.
     * If the provided locale is the same as the current locale, this method will return without doing anything.
     * Otherwise, it will load the translations for the new locale and trigger a "locale-changed" event.
     * If this is the default i18n instance, it will also set the locale in the session.
     * @param locale - The new locale to set.
     */
    private set locale(locale: string) {
        if (this.locale == locale) {
            return;
        }
        this._isLoading = true;
        try {
            moment.locale(locale);
        } catch (error) {
            console.error(error, " setting moment locale : ", locale);
        }
        this.trigger("namespaces-before-load", locale);
        this.loadNamespaces(locale).then((translations) => {
            if (this.isDefaultInstance() && this.isLocaleSupported(locale)) {
                I18n.setLocaleToSession(locale);
            }
            super.locale = locale;
            this.trigger("locale-changed", locale, translations);
        });
    }
    /**
     * Sets the locale for the i18n instance.
     * If the provided locale is the same as the current locale, this method will return without doing anything.
     * Otherwise, it will load the translations for the new locale and trigger a "locale-changed" event.
     * If this is the default i18n instance, it will also set the locale in the session.
     * @param locale - The new locale to set.
     */
    setLocale(locale: string): Promise<II18nTranslation> {
        this.locale = locale;
        return new Promise((resolve, reject) => {
            let hasResolved = false;
            const _resolve = (translations: II18nTranslation) => {
                if (!hasResolved) {
                    hasResolved = true;
                    resolve(this.getTranslations());
                }
            };
            if (!this.isLoading()) {
                resolve(this.getTranslations());
            } else {
                this.once("locale-changed", (locale, translations) => {
                    _resolve(translations);
                });
                /* this.once("namespace-loaded", (namespace, locale, translations) => {
                    _resolve(translations);
                }); */
            };
        });
    }
    /**
     * Register a namespace resolver.
     * @param namespace The namespace to register.
     * @param resolver The resolver function to load the namespace.
     * @example
     * // Register a namespace resolver for the "common" namespace.
     * i18n.registerNamespaceResolver("common", async (locale) => {
     *   const response = await fetch(`/i18n/${locale}/common.json`);
     *   return await response.json();
     * });
     */
    registerNamespaceResolver(namespace: string, resolver: (locale: string) => Promise<II18nTranslation>): void {
        if (!isNonNullString(namespace) || typeof resolver !== "function") {
            console.warn("Invalid arguments for registerNamespaceResolver.", namespace, resolver);
            return;
        }
        this.namespaceResolvers[namespace] = resolver;
    }
    /**
     * Static method to register a namespace resolver to the I18n default instance.
     * @param namespace, The namespace to register.
     * @param resolver, The resolver function to load the namespace.
     * @returns 
     * @example
     * // Register a namespace resolver for the "common" namespace.
     * I18n.RegisterNamespaceResolver("common", async (locale) => {
     *   const response = await fetch(`/i18n/${locale}/common.json`);
     *   return await response.json();
     * });
     */
    static RegisterNamespaceResolver(namespace: string, resolver: (locale: string) => Promise<any>): void {
        return I18n.getInstance().registerNamespaceResolver(namespace, resolver);
    }

    /***
     * Load a namespace for the current locale.
     * @param namespace The namespace to load.
     * @param locale optional locale to load the namespace for
     * @param updateTranslations optional boolean to update the translations
     * @example
     * // Load the "common" namespace for the current locale. 
     * i18n.loadNamespace("common");      
     * @returns A promise that resolves to the loaded namespace.
     */
    loadNamespace(namespace: string, locale?: string, updateTranslations: boolean = true): Promise<II18nTranslation> {
        if (!isNonNullString(namespace) || !this.namespaceResolvers[namespace]) {
            return Promise.reject(new Error(`Invalid namespace or resolver for namespace "${namespace}".`));
        }
        locale = defaultStr(locale, this.getLocale());
        if (!isNonNullString(locale)) {
            return Promise.reject(new Error(`Locale is not set. Cannot load namespace "${namespace}".`));
        }
        return this.namespaceResolvers[namespace](locale).then(((translations) => {
            const dict: II18nTranslation = {};
            dict[locale as string] = Object.assign({}, translations);
            if (isObj(translations)) {
                if (updateTranslations !== false) {
                    this.store(dict);
                }
                this.trigger("namespace-loaded", namespace, locale, dict);
            }
            return dict;
        }));
    }
    /**
     * load a namespace for the current locale on the I18n default instance.
     * @param namespace, namespace to load
     * @param locale, optional locale to load the namespace for
     * @param updateTranslations optional boolean to update the translations
     * @returns 
     */
    static LoadNamespace(namespace: string, locale?: string, updateTranslations: boolean = true): Promise<II18nTranslation> {
        return I18n.getInstance().loadNamespace(namespace, locale, updateTranslations);
    }

    /**
     * Loads all registered namespaces for the current locale and returns the combined translations as an II18nTranslation.
     * @param locale optional locale to load the namespaces for
     * @param updateTranslations optional boolean to update the translations
     * @returns {Promise<II18nTranslation>} A promise that resolves to the combined translations for the current locale.
     * @example
     * // Load all namespaces for the current locale and return the combined translations.
     * i18n.loadNamespaces().then((translations) => {
     *   console.log(translations);
     * });
     */
    loadNamespaces(locale?: string, updateTranslations: boolean = true): Promise<II18nTranslation> {
        const namespaces = [];
        const translations: II18nTranslation = {};
        locale = defaultStr(locale, this.getLocale());
        this._isLoading = true;
        //const errors : any[] = [];
        for (const namespace in this.namespaceResolvers) {
            if (this.namespaceResolvers.hasOwnProperty(namespace) && typeof this.namespaceResolvers[namespace] === "function") {
                namespaces.push(new Promise((resolve, reject) => {
                    this.namespaceResolvers[namespace](locale).then((trs) => {
                        extendObj(translations, trs);
                    }).finally(() => {
                        resolve(true);
                    })
                }));
            }
        }
        return Promise.all(namespaces).then(() => {
            const dict: II18nTranslation = {};
            dict[locale as string] = translations;
            if (updateTranslations !== false) {
                this.store(dict);
            }
            setTimeout(() => {
                this.trigger("namespaces-loaded", locale, dict);
            }, 100);
            return dict;
        }).finally(() => {
            this._isLoading = false;
        });
    }
    /***
     * Load all registered namespaces for the current locale on the I18n default instance.
     * @param locale optional locale to load the namespaces for
     * @param updateTranslations optional boolean to update the translations
     * @returns {Promise<II18nTranslation>} A promise that resolves to the combined translations for the current local
     */
    static LoadNamespaces(locale?: string, updateTranslations: boolean = true): Promise<II18nTranslation> {
        return I18n.getInstance().loadNamespaces(locale, updateTranslations);
    }
    static flattenObject(obj: any): TranslateOptions {
        if (!isObj(obj)) return obj;
        return Object.flatten(obj);
    }

    /**
     * Provides a default interpolation function for the I18n instance.
     * 
     * If the input `value` is `undefined` or `null`, an empty string is returned.
     * If the input `value` is not a number, boolean, or string, it is converted to a string using `stringify`.
     * If the input `params` is not an object, the `value` is returned as-is.
     * If the input `params` is an object, the `value` is replaced with any matching placeholders in the format `%{key}` using the corresponding values from the `params` object.
     * 
     * @param i18n The I18n instance.
     * @param value The input value to be interpolated.
     * @param params Optional object containing replacement values for placeholders in the `value`.
     * @returns The interpolated string.
     */
    private static defaultInterpolator(i18n: I18nJs, value: string, params?: Record<string, any>) {
        if (value === undefined || value === null) return "";
        if (!["number", "boolean", "string"].includes(typeof value)) {
            return stringify(value);
        }
        value = String(value);
        if (!isObj(params)) return value;
        if (!params) return value;
        if (!isObj(params) || !params) return value;
        return value.replace(/%{(.*?)}/g, (_, key) => stringify(params[key]));
    }

}

export const i18n = I18n.getInstance();