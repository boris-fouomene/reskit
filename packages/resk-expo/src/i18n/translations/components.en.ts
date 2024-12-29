import { I18n } from "@resk/core";
I18n.RegisterTranslations({
    "en": {
        "components": {
            "dropdown": {
                "selectAll": "Select All",
                "unselectAll": "Unselect All",
                "selectSingle": "Select",
                "unselectSingle": "Unselect element",
                /***
                 * The placeholder text for the search input field in the dropdown component.
                 * @param {string} countStr - The string representation of number of items in the dropdown list.
                 * @example "Search in 10 items"
                 */
                "searchPlaceholder": "Search %{countStr}",
                "noneSelected": "None selected",
            }
        }
    }
});