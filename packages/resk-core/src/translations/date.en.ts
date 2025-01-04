import { I18n } from "@/i18n";

I18n.RegisterTranslations({
    "en": {
        /***
         * @param {string} resourceLabel - The label of the resource.
         * @param {string} resourceName - The name of the resource.
         * @returns {string} - The translated string.
         */
        "dates": {
            "defaultDateFormat": "MM/DD/YYYY",
            "defaultTimeFormat": "HH:mm:ss",
            "defaultDateTimeFormat": "DD/MM/YYYY HH:mm:ss",
            "invalidDate": "Invalid date",
            "invalidTime": "Invalid time",
            "invalidDateTime": "Invalid date and time",
        }
    }
});