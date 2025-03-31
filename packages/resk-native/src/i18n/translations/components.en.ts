import { I18nClass } from "@resk/core/i18n";
I18nClass.RegisterTranslations({
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
            },
            "datagrid": {
                "actions": "Actions",
                "selectedActionsCount": {
                    "zero": "No selected rows",
                    "one": "one selected row",
                    "other": "%{countStr} selected rows",
                },
                "selectAll": {
                    "zero": "Select all",
                    "one": "Select one row",
                    "other": "Select %{countStr} rows",
                },
                "showFilters": "Show filters",
                "showAggregatedTotals": "Show aggregated totals",
                "columns": "Columns",
                "hideAggregatedTotals": "Hide aggregated totals",
                "groupTableData": "Group table data",
                "groupBy": "Group by",
                "displayOnlyAggregatedTotal": "Display only aggregated total",
                "ungroup": "Ungroup",
                "aggregationFunctionMenuDescription": "Select the aggregation function to use for the totals of the numeric columns",
                "aggregationFunctionsLabel": "Aggregation functions",
                "aggregationFunctions": {
                    "sum": "Sum",
                    "min": "Min",
                    "max": "Max",
                    "count": "Count",
                    "average": "Average",
                }
            }
        }
    }
});