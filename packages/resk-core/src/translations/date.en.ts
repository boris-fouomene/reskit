import { I18nClass } from "@/i18n";

I18nClass.RegisterTranslations({
    "en": {
        /***
         * @param {string} resourceLabel - The label of the resource.
         * @param {string} resourceName - The name of the resource.
         * @returns {string} - The translated string.
         */
        "dates": {
            "defaultDateFormat": "YYYY-MM-DD",
            "defaultTimeFormat": "HH:mm",
            "defaultDateTimeFormat": "YYYY-MM-DD HH:mm",
            "invalidDate": "Invalid date",
            "invalidTime": "Invalid time",
            "invalidDateTime": "Invalid date and time",
            "today": "Today",
            "yesterday": "Yesterday",
            "tomorrow": "Tomorrow",
            "selectedDate": "Selected date",
            "selectedTime": "Selected time",
            "selectedDateTime": "Selected date and time",
        }
    }
});