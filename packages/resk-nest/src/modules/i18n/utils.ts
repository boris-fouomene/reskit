import { defaultStr, I18n } from "@resk/core";

/**
 * Applies the language to the I18n instance based on the 'Accept-Language' header in the request.
 * 
 * @param i18n The I18n instance to set the locale for.
 * @param request The request object containing the 'Accept-Language' header.
 * 
 * @returns A promise that resolves when the locale has been set.
 * 
 * @example
 * ```typescript
 * import { applyLanguage } from './utils';
 * import { I18n } from '@resk/core';
 * 
 * const i18n = new I18n();
 * const request = { headers: { 'accept-language': 'fr' } };
 * await applyLanguage(i18n, request);
 * console.log(i18n.getLocale()); // Output: fr
 * ```
 */
export const applyLanguage = async (i18n: I18n, request: any) => {
    /**
     * Extracts the 'Accept-Language' header from the request and sets the locale accordingly.
     * 
     * If the 'Accept-Language' header is not present, it defaults to 'en'.
     * 
     * @note The 'Accept-Language' header is case-insensitive, so both 'accept-language' and 'Accept-Language' are supported.
     */
    let lang = defaultStr(Object.assign({}, request.headers)['accept-language'], Object.assign({}, request.headers)['Accept-Language'], 'en');

    /**
     * Checks if the extracted language is supported by the I18n instance.
     * 
     * If the language is not supported, it defaults to 'en'.
     */
    if (!i18n.hasLocale(lang)) {
        lang = "en";
    }

    /**
     * Sets the locale using the I18n instance.
     * 
     * @note This method is asynchronous and returns a promise that resolves when the locale has been set.
     */
    await i18n.setLocale(lang);
}