import isNonNullString from "@utils/isNonNullString";
import { I18nEvent, II18nTranslation } from "../types/i18n";
import { extendObj, isObj } from "@utils/object";
import { IObservable, IObservableCallback, observableFactory } from "@utils/observable";
import "reflect-metadata";
import { Dict, I18n as I18nJs } from "i18n-js";
import defaultStr from "@utils/defaultStr";
import stringify from "@utils/stringify";

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
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(TRANSLATION_KEY, key, target, propertyKey);
    };
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
     * alias for translate method of i18n-js
     */
    readonly t: typeof this.translate = this.translate;
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
    constructor(...args: any[]) {
        super(...args);
        this.onChangeHandlers.unshift(this._onChangeHandler.bind(this));
        this.loadNamespaces();
    }
    private _onChangeHandler(i18n: I18nJs) {
        if (i18n.locale == this.getLocale()) {
            return;
        }
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
    one(event: I18nEvent, fn: IObservableCallback) {
        return this._observableFactory?.one.call(this, event, fn);
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
    static getInstance(): I18n {
        if (!I18n.instance) {
            I18n.instance = new I18n();
        }
        return I18n.instance;
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
    static createInstance(...args: any[]): I18n {
        const i18n = new I18n(...args);
        return i18n;
    }

    /**
     * Retrieves the current locale translations.
     * @returns The current locale translations.
     */
    getTranslations() {
        return isObj(this.translations) ? this.translations : {};
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
     * Automatically resolves translations using Reflect Metadata.
     * Translations created using the @I18n.Translate decorator will be resolved.
     * @param target The target class instance or object.
     * @example 
     * // Class with translations using the decorator
     * class MyComponent {
     *     @I18n.Translate("greeting")
     *     public greeting: string;
     * 
     *     @I18n.Translate("nested.example")
     *     public nestedExample: string;
     * 
     *     @I18n.Translate("farewell")
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
    getLocale() {
        return super.locale;
    }
    set locale(locale: string) {
        if (this.locale == locale) {
            return;
        }
        this.loadNamespaces(locale).then((translations) => {
            super.locale = locale;
            this.trigger("locale-changed", locale, translations);
        });
    }
    setLocale(locale: string) {
        this.locale = locale;
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
            const dict = { [locale]: Object.assign({}, translations) };
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
        for (const namespace in this.namespaceResolvers) {
            if (this.namespaceResolvers.hasOwnProperty(namespace) && typeof this.namespaceResolvers[namespace] === "function") {
                namespaces.push(this.namespaceResolvers[namespace](locale).then((translations) => {
                    extendObj(translations, translations);
                }));
            }
        }
        return Promise.all(namespaces).then(() => {
            const dict = { [locale]: translations };
            if (updateTranslations !== false) {
                this.store(dict);
            }
            this.trigger("namespaces-loaded", locale, dict);
            return dict;
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
    private static defaultFormatter(value: string, params?: Record<string, any>) {
        if (value === undefined || value === null) return "";
        if (!["number", "boolean", "string"].includes(typeof value)) {
            return stringify(value);
        }
        value = String(value);
        if (!isObj(params)) return value;
        if (!params) return value;
        if (!isObj(params) || !params) return value;
        return value.replace(/{(.*?)}/g, (_, key) => stringify(params[key]));
    }
}

export const i18n = I18n.getInstance();