import { useEffect, useMemo, useState } from "react";
import { I18n, isNonNullString,Platform } from "@resk/core";
import { getLocales } from "react-native-localize";
import { IUseI18nOptions } from "@src/types";


/**
 * @group Internationalization
 * @function useI18n
 * 
 * A custom hook that provides an instance of the `I18n` class for managing internationalization (i18n) in the application.
 * This hook allows for the configuration of locale settings based on user preferences or device settings.
 * 
 * @param {I18n} [i18n] - An optional instance of the `I18n` class. If provided, this instance will be used; otherwise, a new instance will be created.
 * 
 * @param {IUseI18nOptions} [options] - An optional configuration object that defines how the i18n instance should handle locale settings.
 * This object can specify whether to use the device's locale and the specific locale to set.
 * 
 * @returns {I18n} The configured instance of the `I18n` class, which can be used to manage translations and locale settings throughout the application.
 * 
 * @example
 * // Example of using the useI18n hook in a functional component
 * const MyComponent = () => {
 *   const i18nInstance = useI18n(undefined, { useLocaleFromDevice: true });
 * 
 *   return (
 *     <Text>{i18nInstance.t('welcome_message')}</Text>
 *   );
 * };
 * 
 * @example
 * // Example of using the useI18n hook with a specific locale
 * const MyComponentWithLocale = () => {
 *   const i18nInstance = useI18n(undefined, { locale: 'fr-FR' });
 * 
 *   return (
 *     <Text>{i18nInstance.t('welcome_message')}</Text>
 *   );
 * };
 * 
 * @note This hook is particularly useful for applications that require localization support,
 * allowing for flexible configuration of locale settings based on user preferences or device settings.
 * It also handles locale changes dynamically, ensuring that the application reflects the correct language and regional settings.
 */
export const useI18n = (i18n?: I18n, options?: IUseI18nOptions): I18n => {
    const expoLocales = Platform.isClientSide() ? getLocales() : [];
    const { locale: i18nLocale, useLocaleFromDevice } = Object.assign({}, options);
    const instance = useMemo(() => {
        return i18n instanceof I18n ? i18n : I18n.getInstance();
    }, [i18n, I18n.getInstance()]);
    const instanceLocale = instance.getLocale();
    useEffect(() => {
        if (!useLocaleFromDevice && instanceLocale != i18nLocale && i18nLocale && isNonNullString(i18nLocale)) {
            instance.setLocale(i18nLocale);
        }
    }, [useLocaleFromDevice, i18nLocale, instanceLocale]);
    const detectedLocale = useMemo(() => {
        const locales = instance.getLocales();
        if (Array.isArray(expoLocales)) {
            for (let i = 0; i < expoLocales.length; i++) {
                const locale = expoLocales[i];
                if (isNonNullString(locale?.languageTag) && locales.includes(locale.languageTag)) {
                    return locale;
                }
            }
            for (let i = 0; i < expoLocales.length; i++) {
                const locale = expoLocales[i];
                if (locale?.languageCode && isNonNullString(locale?.languageCode) && locales.includes(locale.languageCode)) {
                    return locale;
                }
            }
        }
        return undefined;
    }, [instance, expoLocales]);
    const [locale, setLocale] = useState(instance.getLocale());
    useEffect(() => {
        const onChangeListener = instance.on("locale-changed", (newLocale: string) => {
            if (locale != newLocale) {
                setLocale(newLocale);
            }
        });
        return () => {
            onChangeListener?.remove();
        }
    }, [locale]);
    useEffect(() => {
        if (useLocaleFromDevice && detectedLocale?.languageTag) {
            const detectedLangCode = instance.isLocaleSupported(detectedLocale.languageTag) ? detectedLocale.languageTag : instance.isLocaleSupported(detectedLocale.languageCode as string) ? detectedLocale.languageCode as string : undefined;
            if (detectedLangCode != instance.getLocale()) {
                instance.setLocale(detectedLangCode as string);
                /* if(isNonNullString(detectedLocale.currencyCode) && isNonNullString(detectedLocale.currencySymbol)) {
                    Currency.session.setCurrency({
                        name : detectedLocale.currencyCode as string,
                        symbol: detectedLocale.currencySymbol as string,
                        symbolNative: detectedLocale.currencySymbol as string,
                        code: detectedLocale.currencyCode as string,
                        rounding:2,
                    });
                } */
            }
        }
    }, [detectedLocale, instance.getLocale(), useLocaleFromDevice]);
    instance.detectedLocale = detectedLocale;
    return instance;
};