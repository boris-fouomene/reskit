import { II18nLocale } from "../types";
import platform from "@platform/index";
import { parseLanguageTag } from "./utils";


export function getLocales(): II18nLocale[] {
    if (!platform.isClientSide() || typeof navigator === 'undefined' || !navigator) return [];
    const result: II18nLocale[] = [];
    if (Array.isArray(navigator?.languages)) {
        navigator.languages.map((language) => {
            const parsedLanguage = parseLanguageTag(language);
            if (parsedLanguage) {
                result.push(parsedLanguage);
            }
        });
        if (result.length) return result;
    }
    // Ensure we're in a web environment with the Intl API
    if (typeof Intl === 'undefined' || !Intl || !Intl.Locale) {
        const parsedLanguage = parseLanguageTag(navigator?.language);
        if (parsedLanguage) {
            return [parsedLanguage];
        }
        return [];
    }
    return result;
}
