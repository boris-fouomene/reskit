import { Locale } from "react-native-localize";
import "@resk/core/i18n";
declare module "@resk/core/i18n" {
    export interface I18n {
        detectedLocale?: Locale;
    }
}