import { I18n } from "@resk/core";
I18n.RegisterTranslations({
    "en": {
        "components": {
            "calendar": {
                "closeModal": "Close Modal",
            },
            "textInput": {
                "selectCountry": "Select Country",
            },
            "menu": {
                "close": "Close Menu",
            },
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
                "searchPlaceholder": {
                    "zero": "Search ...",
                    "one": "Search in %{count} item...",
                    "other": "Search in %{count} items...",
                },
                "noneSelected": "None selected",
                "andMoreItemSelected": {
                    "zero": "",
                    "one": ", and one selected.",
                    "other": ", and %{count} selected.",
                },
            },
            "drawer": {
                "close": "Close",
                "open": "Open",
                "toggle": "Toggle",
                "toggleFullScreen": "Toggle Drawer Full Screen",
            }
        }
    }
});