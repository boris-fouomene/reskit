import { defaultStr, I18n } from "@resk/core";

export const applyLanguage = async (i18n: I18n, request: any) => {
    /**
     * Extracts the 'Accept-Language' header from the request and sets the locale accordingly.
     * 
     * If the 'Accept-Language' header is not present, it defaults to 'en'.
     */
    let lang = defaultStr(Object.assign({}, request.headers)['accept-language'], Object.assign({}, request.headers)['Accept-Language'], 'en');
    if (!i18n.hasLocale(lang)) {
        lang = "en";
    }
    /** 
     * Sets the locale using the I18n instance.
     */
    await i18n.setLocale(lang);
}