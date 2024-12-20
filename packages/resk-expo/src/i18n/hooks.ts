import { useEffect, useMemo, useState } from "react";
import { I18n, isNonNullString, Currency } from "@resk/core";
import { getLocales, Locale } from 'expo-localization';


/**
 * A custom React hook that provides an instance of the I18n class for internationalization (i18n) support.
 * This hook allows components to access the current locale and listen for locale changes.
 *
 * @param {I18n} [i18n] - An optional instance of the I18n class. If provided, this instance will be used; 
 *                        otherwise, a new instance will be created using the default I18n singleton.
 * 
 * @param {boolean} [useLocaleFromDevice] - A flag indicating whether the locale should be set from the device's locale if it matches the supported locales.
 * 
 * @returns {I18n} The current instance of the I18n class, which can be used to get the current locale, 
 *                 translate strings, and manage localization dictionaries.
 * 
 * @example
 * import { useI18n } from '@resk/expo';
 * 
 * const MyComponent = () => {
 *     const i18n = useI18n(); // Use the default I18n instance
 *     
 *     return (
 *         <div>
 *             <h1>{i18n.t('welcome_message')}</h1> {}
 *         </div>
 *     );
 * };
 * 
 * @example
 * const customI18n = new I18n();
 * const MyComponentWithCustomI18n = () => {
 *     const i18n = useI18n(customI18n); // Use a custom I18n instance
 *     
 *     return (
 *         <div>
 *             <h1>{i18n.t('welcome_message')}</h1> {}
 *         </div>
 *     );
 * };
 * 
 * @remarks
 * This hook automatically subscribes to locale changes and updates the component state accordingly.
 * It is important to clean up the listener when the component unmounts to prevent memory leaks.
 * 
 * @see {@link I18n} for more details on the I18n class and its methods.
 */
export const useI18n = (i18n?: I18n, useLocaleFromDevice?: boolean): I18n => {
    const expoLocales = getLocales();
    const instance = useMemo(() => {
        return i18n instanceof I18n ? i18n : I18n.getInstance();
    }, [i18n, I18n.getInstance()]);
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
        const onChangeListener = instance.on("locale-changed", (newLocale, dictionary) => {
            if (locale != newLocale) {
                setLocale(newLocale);
            }
        });
        return () => {
            onChangeListener.remove();
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