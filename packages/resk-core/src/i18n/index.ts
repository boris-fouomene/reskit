import isNonNullString from "@utils/isNonNullString";
import { I18nFormatter, I18nOptions, II18nDictionary } from "../types/i18n";
import { extendObj, isObj } from "@utils/object";
import { ObservableClass } from "@utils/observable";
import stringify from "@utils/stringify";
import "reflect-metadata";

/**
 * A key to store metadata for translations.
 */
const TRANSLATION_KEY = Symbol("TRANSLATION_KEY");

/**
 * The main I18n manager class to handle translations.
 */
/**
 * The I18n class provides internationalization support, allowing for the registration
 * and retrieval of translations based on locale. It extends the ObservableClass to 
 * support event-driven updates when the locale or dictionary changes.
 */
export class I18n extends ObservableClass {
    /**
     * The dictionary containing translations for different locales.
     */
    private dictionary: II18nDictionary = {} as II18nDictionary;

    /**
     * Options for configuring the I18n instance.
     */
    private options: I18nOptions;

    /**
     * Singleton instance of the I18n class.
     */
    private static instance: I18n;

    /**
     * The current locale for translations.
     */
    private locale: string = "en";

    /**
     * Default formatter for translating values with dynamic parameters.
     * @param value The value to format.
     * @param params Optional parameters for dynamic values.
     * @returns The formatted string.
     */
    public static defaultFormatter: I18nFormatter = (value: string, params?: Record<string, any>) => {
        if (value === undefined || value === null) return "";
        if (["number", "boolean", "string"].includes(typeof value)) {
            return stringify(value);
        }
        value = String(value);
        if (!isObj(params)) return value;
        if (!params) return value;
        return value.replace(/{(.*?)}/g, (_, key) => stringify(params[key]));
    }

    /**
     * Creates an instance of the I18n class.
     * @param options Optional configuration options for the I18n instance.
     */
    constructor(options?: I18nOptions) {
        super();
        this.options = Object.assign({}, options);
        if (isNonNullString(options?.locale) && options?.locale) this.locale = options.locale;
        this.options.formatter = typeof this.options.formatter === "function" ? this.options.formatter : I18n.defaultFormatter;
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
     * A decorator to attach metadata to properties or methods for translation.
     * @param key The translation key in the dictionary.
     * @returns A property and method decorator.
     */
    static Translate(key: string): PropertyDecorator & MethodDecorator {
        return (target: Object, propertyKey: string | symbol) => {
            Reflect.defineMetadata(TRANSLATION_KEY, key, target, propertyKey);
        };
    }

    /**
     * Factory method to create I18n instances dynamically.
     * @param options Optional configuration options for the I18n instance.
     * @returns A new I18n instance.
     */
    static create(options?: I18nOptions): I18n {
        const i18n = new I18n(options);
        i18n.resolveTranslations(i18n);
        return i18n;
    }

    /**
     * Sets the current locale for translations.
     * @param locale The locale to set.
     */
    setLocale(locale: string) {
        this.locale = locale;
        this.trigger("locale-changed", locale);
    }

    /**
     * Retrieves the current locale.
     * @returns The current locale.
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Retrieves the current dictionary of translations.
     * @returns The current dictionary.
     */
    getDictionary() {
        if (!isObj(this.dictionary)) this.dictionary = {} as II18nDictionary;
        return this.dictionary;
    }

    /**
     * Registers a new dictionary into the I18n manager.
     * @param dictionary The dictionary to register.
     * @returns The updated dictionary.
     */
    public registerDictionary(dictionary: II18nDictionary): II18nDictionary {
        this.dictionary = extendObj({}, this.dictionary, dictionary);
        this.trigger("dictionary-changed", this.dictionary);
        return this.dictionary;
    }

    /**
     * Retrieves a translation for a given key.
     * @param key The translation key.
     * @param params Optional parameters for dynamic values.
     * @returns The translated string.
     */
    public t(key: string, params?: Record<string, any>): string {
        const locale = this.getLocale();
        const value = this.getNestedTranslation(locale, key);
        if (value) {
            return this.format(value, params);
        } else if (this.options.fallbackLocale && isNonNullString(this.options.fallbackLocale) && locale !== this.options.fallbackLocale) {
            const fallbackValue = this.getNestedTranslation(this.options.fallbackLocale, key);
            return this.format(fallbackValue || key, params);
        }
        return key; // Return the key itself if not found.
    }

    /**
     * Resolves translation for nested keys.
     * @param locale The locale to use for translation.
     * @param key The translation key.
     * @returns The translated string or undefined if not found.
     */
    private getNestedTranslation(locale: string, key: string): string | undefined {
        const keys = key.split(".");
        let result: any = this.dictionary[locale];
        for (const k of keys) {
            if (result && typeof result === "object") {
                result = result[k];
            } else {
                return undefined;
            }
        }
        return result;
    }

    /**
     * Formats a string with dynamic parameters.
     * @param value The string to format.
     * @param params Optional parameters for dynamic values.
     * @returns The formatted string.
     */
    private format(value: string, params?: Record<string, any>): string {
        if (!params || !isObj(params) || !this.options.formatter) return value;
        // Use the custom formatter if provided
        return this.options.formatter(value, params);
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
}

export const i18n = I18n.getInstance();