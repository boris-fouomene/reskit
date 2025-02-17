import { Locale } from "expo-localization";
import "@resk/core";
declare module "@resk/core" {
    export interface I18n {
        detectedLocale?: Locale;
    }
}