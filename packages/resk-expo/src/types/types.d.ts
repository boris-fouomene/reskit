import { Locale } from "expo-localization";
import "@resk/core";
declare module "@resk/core" {
    interface I18n {
        detectedLocale?: Locale;
    }
}