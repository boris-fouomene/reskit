export interface II18nLocale extends Readonly<{
    languageCode: string;
    scriptCode?: string;
    countryCode: string;
    languageTag: string;
    isRTL: boolean;
}> {

}