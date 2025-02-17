import { Locale } from "react-native-localize";
import "@resk/core";
declare module "@resk/core" {
    export interface I18n {
        detectedLocale?: Locale;
    }
}