import { isNonNullString } from "@resk/core";
import { II18nLocale } from "../types";
import platform from "@platform/index";


export function getLocales(): II18nLocale[] {
    if (!platform.isClientSide() || typeof navigator === 'undefined' || !navigator || !Array.isArray(navigator?.languages)) return [];
    const result: II18nLocale[] = [];
    navigator.languages.map((language) => {
        if (!isNonNullString(language)) return undefined;
        const parts = language.split('-');
        const languageCode = parts[0];
        const scriptCode = parts[1] && parts[1].length === 4 ? parts[1] : undefined;
        const countryCode = parts[parts.length - 1];
        const isRTL = ['ar', 'he', 'fa', 'ur'].includes(languageCode);
        result.push({
            languageCode,
            scriptCode,
            countryCode,
            languageTag: language,
            isRTL,
        });
    });
    return result;
}