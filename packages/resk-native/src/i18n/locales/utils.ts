import { defaultStr, isNonNullString } from "@resk/core";
import { I18nManager } from "react-native";
import { II18nLocale } from "../types";
// RTL language codes based on common knowledge
const RTL_LANGUAGES = ['ar', 'fa', 'he', 'ur', 'yi', 'dv', 'ha', 'ks', 'ku', 'ps', 'sd', 'ug'];

/**
 * Check if a language is RTL based on language code
 */
export const isRTLLanguage = (languageCode: string): boolean => {
    return !!I18nManager.isRTL || !!(isNonNullString(languageCode) && RTL_LANGUAGES.includes(languageCode));
};

/**
 * Parse language tag into locale components
 * Format: language-script-region
 * Examples: en-US, zh-Hant-TW, ar-SA
 */
export const parseLanguageTag = (languageTag: string): II18nLocale & { scriptCode?: string } | null => {
    if (!isNonNullString(languageTag)) {
        return null;
    }
    const parts = languageTag.split('-');
    if (!parts[0]) return null;
    // Default structure with just language code
    const result = {
        languageCode: parts[0],
        countryCode: '',
        languageTag,
        isRTL: isRTLLanguage(parts[0])
    } as II18nLocale & { scriptCode?: string };

    // Check for script code (always starts with uppercase)
    if (parts.length > 1) {
        if (parts[1].length === 4 && isNonNullString(parts[1]) && /^[A-Z][a-z]{3}$/.test(parts[1])) {
            result.scriptCode = parts[1];
            // Country code would be the third part if script is present
            (result as any).countryCode = parts.length > 2 ? parts[2] : '';
        } else {
            // No script code, second part is country code
            (result as any).countryCode = parts[1];
        }
    }
    (result as any).countryCode = defaultStr(result.countryCode);
    return result;
};