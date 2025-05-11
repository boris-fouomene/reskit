import { NativeModules } from 'react-native';
import { II18nLocale } from '../types';
import platform from '@platform/index';
import { parseLanguageTag } from './utils';

/**
 * Gets the list of all locales supported by the native environment.
 * @returns The list of locales supported by the native environment.
 */
export function getLocales(): II18nLocale[] {
    const r = getAvailableLocalesNative();
    if (r.length) return r;
    const result: II18nLocale[] = [];
    if (NativeModules.SettingsManager && NativeModules.SettingsManager.settings) {
        const locales = NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages;
        if (Array.isArray(locales)) {
            locales.map((locale) => {
                const parsedLanguage = parseLanguageTag(locale);
                if (parsedLanguage) {
                    result.push(parsedLanguage);
                }
            });
        } else if (typeof locales === 'string') {
            const parsedLanguage = parseLanguageTag(locales);
            if (parsedLanguage) {
                result.push(parsedLanguage);
            }
        }
    } else if (NativeModules.I18nManager && NativeModules.I18nManager.localeIdentifier) {
        const parsedLanguage = parseLanguageTag(NativeModules.I18nManager.localeIdentifier);
        if (parsedLanguage) {
            result.push(parsedLanguage);
        }
    }
    return result;
}

/**
 * Get available locales for native environments (iOS/Android)
 */
const getAvailableLocalesNative = (): II18nLocale[] => {
    try {
        // Access to NativeModules
        const { I18nManager, SettingsManager } = NativeModules;
        let deviceLanguage = '';
        if (platform.isIos()) {
            // For iOS, first try to get the locale from SettingsManager
            if (SettingsManager && SettingsManager.settings) {
                deviceLanguage = SettingsManager.settings.AppleLocale ||
                    (SettingsManager.settings.AppleLanguages &&
                        SettingsManager.settings.AppleLanguages[0]);
            }

            // If that fails, fallback to RCTLocalization if available
            if (!deviceLanguage && NativeModules.RCTLocalization) {
                deviceLanguage = NativeModules.RCTLocalization.localeIdentifier ||
                    (NativeModules.RCTLocalization.languages &&
                        NativeModules.RCTLocalization.languages[0]);
            }
        } else if (platform.isAndroid()) {
            // For Android
            if (I18nManager) {
                deviceLanguage = I18nManager.localeIdentifier;
            }

            // If that fails, try other modules
            if (!deviceLanguage && NativeModules.RNI18n) {
                deviceLanguage = NativeModules.RNI18n.locale;
            }
            // If still no locale, try another method
            if (!deviceLanguage) {
                try {
                    const JavascriptLocaleModule = NativeModules.JavascriptLocaleModule;
                    if (JavascriptLocaleModule && JavascriptLocaleModule.locale) {
                        deviceLanguage = JavascriptLocaleModule.locale;
                    }
                } catch (e) {
                    console.warn('Could not access JavascriptLocaleModule', e);
                }
            }
        }
        // Parse the language tag
        const parsedLanguage = parseLanguageTag(deviceLanguage);
        return parsedLanguage ? [parsedLanguage] : [];
    } catch (e) { }
    try {
        // Get current device locale
        const deviceLanguage = platform.isIos() ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]
            : NativeModules.I18nManager.localeIdentifier;

        if (!deviceLanguage) {
            return [];
        }

        const parsedLanguage = parseLanguageTag(deviceLanguage);
        if (parsedLanguage) {
            return [parsedLanguage];
        }
    } catch (e) { }
    return [];
};

