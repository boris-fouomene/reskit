/**
 * @interface II18nDictionary
 * Represents a dictionary for internationalization (i18n) strings.
 * 
 * This interface defines a structure for storing localized strings
 * for different locales. Each locale can have multiple keys, each
 * associated with a string or another dictionary for nested translations.
 * 
 * @example
 * const translations: II18nDictionary = {
 *     en: {
 *         greeting: "Hello",
 *         farewell: "Goodbye"
 *     },
 *     es: {
 *         greeting: "Hola",
 *         farewell: "Adiós"
 *     }
 * };
 */
export interface II18nDictionary {
    /**
     * A mapping of locale strings to their corresponding translation dictionaries.
     * 
     * @type {string}
     * @example
     * const locale = "en"; // English locale
     */
    [locale: string]: {
        /**
         * A mapping of translation keys to their localized string values or nested dictionaries.
         * 
         * @type {string | II18nDictionary}
         * @example
         * const greeting = translations[locale].greeting; // "Hello" for English
         */
        [key: string]: string | II18nDictionary;
    };
}

/**
 * Represents the different events related to internationalization (i18n).
 * 
 * This type defines the possible events that can be emitted during
 * the i18n process, allowing for event-driven updates in the application.
 * 
 * @example
 * function onI18nEvent(event: I18nEvent) {
 *     switch (event) {
 *         case "dictionary-loaded":
 *             console.log("Translation dictionary has been loaded.");
 *             break;
 *         case "dictionary-changed":
 *             console.log("Translation dictionary has been updated.");
 *             break;
 *         case "locale-changed":
 *             console.log("Locale has been changed.");
 *             break;
 *     }
 * }
 */
export type I18nEvent = "dictionary-loaded" | "dictionary-changed" | "locale-changed";

/**
 * A formatter function for internationalization (i18n) strings.
 * 
 * This type defines a function that takes a string value and optional
 * parameters to format the string according to specific rules or
 * requirements. The formatted string is then returned.
 * 
 * @param {string} value - The string value to format.
 * @param {Record<string, any>} [params] - Optional parameters to customize the formatting.
 * @returns {string} The formatted string.
 * 
 * @example
 * const formatter: I18nFormatter = (value, params) => {
 *     return value.replace(/{(\w+)}/g, (_, key) => params[key] || '');
 * };
 * 
 * const greeting = formatter("Hello, {name}!", { name: "John" }); // "Hello, John!"
 */
export type I18nFormatter = (value: string, params?: Record<string, any>) => string;

/**
 * @interface I18nOptions
 * Options for configuring internationalization (i18n) settings.
 * 
 * This interface defines the options that can be used to customize
 * the behavior of the i18n system, including the locale, fallback
 * locale, and a custom formatter for string values.
 * 
 * @property {string} locale - The primary locale to use for translations.
 * @property {string} [fallbackLocale] - An optional fallback locale to use if the primary locale is not available.
 * @property {I18nFormatter} [formatter] - An optional custom formatter function for formatting strings.
 * 
 * @example
 * const i18nOptions: I18nOptions = {
 *     locale: "en",
 *     fallbackLocale: "es",
 *     formatter: (value, params) => value.replace(/{(\w+)}/g, (_, key) => params[key] || '')
 * };
 */
export interface I18nOptions {
    /**
     * The primary locale to use for translations.
     * 
     * @type {string}
     * @example
     * const currentLocale = i18nOptions.locale; // "en"
     */
    locale: string;

    /**
     * An optional fallback locale to use if the primary locale is not available.
     * 
     * @type {string}
     * @example
     * const fallback = i18nOptions.fallbackLocale; // "es"
     */
    fallbackLocale?: string;

    /**
     * An optional custom formatter function for formatting strings.
     * 
     * @type {I18nFormatter}
     * @example
     * const formattedString = i18nOptions.formatter("Hello, {name}!", { name: "Alice" });
     * // Outputs: "Hello, Alice!"
    ```typescript
    * 
    * @example
    * const i18nOptions: I18nOptions = {
    *     locale: "en",
    *     fallbackLocale: "es",
    *     formatter: (value, params) => value.replace(/{(\w+)}/g, (_, key) => params[key] || '')
    * };
    */
    formatter?: I18nFormatter;
}