export interface I18nOptions {
    /**
     * Set default locale. This locale will be used when fallback is enabled and
     * the translation doesn't exist in a particular locale. Defaults to `en`.
     *
     * @type {string}
     */
    defaultLocale: string;

    /**
     * Set the default string separator. Defaults to `.`, as in
     * `scope.translation`.
     *
     * @type {string}
     */
    defaultSeparator: string;

    /**
     * Set if engine should fallback to the default locale when a translation is
     * missing. Defaults to `false`.
     *
     * When enabled, missing translations will first be looked for in less
     * specific versions of the requested locale and if that fails by taking them
     * from your `I18n#defaultLocale`.
     *
     * @type {boolean}
     */
    enableFallback: boolean;

    /**
     * Set the current locale. Defaults to `en`.
     *
     * @type {string}
     */
    locale: string;

    /**
     * Set missing translation behavior.
     *
     * - `message` will display a message that the translation is missing.
     * - `guess` will try to guess the string.
     * - `error` will raise an exception whenever a translation is not defined.
     *
     * See {@link MissingTranslation.register} for instructions on how to define
     * your own behavior.
     *
     * @type {MissingBehavior}
     */
    missingBehavior: MissingBehavior;



    /**
     * If you use missingBehavior with 'message', but want to know that the string
     * is actually missing for testing purposes, you can prefix the guessed string
     * by setting the value here. By default, no prefix is used.
     *
     * @type {string}
     */
    missingTranslationPrefix: string;

    /**
     * Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
     *
     * @type {RegExp}
     */
    placeholder: RegExp;

    /**
     * Transform keys. By default, it returns the key as it is, but allows for
     * overriding. For instance, you can set a function to receive the camelcase
     * key, and convert it to snake case.
     *
     * @type {function}
     */
    transformKey: (key: string) => string;
}


/**
 * Possible missing translation behavior.
 * @type {String}
 */
export type MissingBehavior = "message" | "guess" | "error";