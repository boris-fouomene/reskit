import { defaultStr } from "@resk/core/utils";
import { I18n } from "@resk/core/i18n";
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
    const acceptLanguage = defaultStr(Object.assign({}, request.headers)['accept-language'], Object.assign({}, request.headers)['Accept-Language'], 'en');
    const preferredLanguage = acceptLanguage.split(",")[0].split("-")[0]; // e.g., "fr-FR" -> "fr"
    const lang = i18n.hasLocale(acceptLanguage) ? acceptLanguage : i18n.hasLocale(preferredLanguage) ? preferredLanguage : "en";
    await i18n.setLocale(lang);
}