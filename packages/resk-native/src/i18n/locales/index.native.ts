import { NativeModules } from 'react-native';
import { II18nLocale } from '../types';


export function getLocales(): II18nLocale[] {
    if (NativeModules.SettingsManager && NativeModules.SettingsManager.settings) {
        const locales = NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages;
        if (Array.isArray(locales)) {
            return locales.map((locale) => {
                const parts = locale.split('_');
                const languageCode = parts[0].split('-')[0];
                const scriptCode = parts[0].split('-')[1] && parts[0].split('-')[1].length === 4 ? parts[0].split('-')[1] : undefined;
                const countryCode = parts[1];
                const isRTL = ['ar', 'he', 'fa', 'ur'].includes(languageCode);
                return {
                    languageCode,
                    scriptCode,
                    countryCode,
                    languageTag: locale,
                    isRTL,
                };
            });
        } else if (typeof locales === 'string') {
            const parts = locales.split('_');
            const languageCode = parts[0].split('-')[0];
            const scriptCode = parts[0].split('-')[1] && parts[0].split('-')[1].length === 4 ? parts[0].split('-')[1] : undefined;
            const countryCode = parts[1];
            const isRTL = ['ar', 'he', 'fa', 'ur'].includes(languageCode);
            return [{
                languageCode,
                scriptCode,
                countryCode,
                languageTag: locales,
                isRTL,
            }];
        }
    } else if (NativeModules.I18nManager && NativeModules.I18nManager.localeIdentifier) {
        const locale = NativeModules.I18nManager.localeIdentifier;
        const parts = locale.split('_');
        const languageCode = parts[0].split('-')[0];
        const scriptCode = parts[0].split('-')[1] && parts[0].split('-')[1].length === 4 ? parts[0].split('-')[1] : undefined;
        const countryCode = parts[1];
        const isRTL = ['ar', 'he', 'fa', 'ur'].includes(languageCode);
        return [{
            languageCode,
            scriptCode,
            countryCode,
            languageTag: locale,
            isRTL,
        }];
    }
    return [];
}
