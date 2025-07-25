import { IMongoOperatorName } from "@resk/core/types";
import { I18n } from "@resk/core/i18n";
I18n.RegisterTranslations({
  en: {
    components: {
      calendar: {
        closeModal: "Close Modal",
      },
      textInput: {
        selectCountry: "Select Country",
      },
      menu: {
        close: "Close Menu",
      },
      dropdown: {
        selectAll: "Select All",
        unselectAll: "Unselect All",
        selectSingle: "Select",
        unselectSingle: "Unselect element",
        /***
         * The placeholder text for the search input field in the dropdown component.
         * @param {string} countStr - The string representation of number of items in the dropdown list.
         * @example "Search in 10 items"
         */
        searchPlaceholder: {
          zero: "Search ...",
          one: "Search in %{count} item...",
          other: "Search in %{count} items...",
        },
        noneSelected: "None selected",
        andMoreItemSelected: {
          zero: "",
          one: ", and one selected.",
          other: ", and %{count} selected.",
        },
        clearSearchText: "Clear search",
      },
      drawer: {
        close: "Close",
        open: "Open",
        toggle: "Toggle",
        toggleFullScreen: "Toggle Drawer Full Screen",
      },
      datagrid: {
        actions: "Actions",
        selectedActionsCount: {
          zero: "No selected rows",
          one: "one selected row",
          other: "%{countStr} selected rows",
        },
        selectAll: {
          zero: "Select all",
          one: "Select one row",
          other: "Select %{countStr} rows",
        },
        unselectAll: {
          zero: "Unselect all",
          one: "Unselect one row",
          other: "Unselect %{countStr} rows",
        },
        showFilters: "Show filters",
        hideFilters: "Hide filters",
        showAggregatedTotals: "Show aggregated totals",
        columns: "Columns",
        hideAggregatedTotals: "Hide aggregated totals",
        groupTableData: "Group table data",
        groupBy: "Group by",
        displayOnlyAggregatedTotal: "Display only aggregated total",
        ungroup: "Ungroup",
        aggregationFunctionMenuDescription: "Select the aggregation function to use for the totals of the numeric columns",
        aggregationFunctionsLabel: "Aggregation functions",
        includeColumnLabelInGroupedRowHeader: "Include column label in grouped row header",
        showAggregatedValues: "Show Aggregated Values",
        hideAggregatedValues: "Hide Aggregated Values",
        abreviateAggregatableValues: "Abreviate Aggregatable Values",
        viewsMenuItems: "Display View",
        pagination: {
          pageSize: "Pagination Page size",
          goToFirstPage: "Go to first page",
          goToLastPage: "Go to last page",
          goToPreviousPage: "Go to previous page",
          goToNextPage: "Go to next page",
          customPageSize: "Custom page size",
          customizePageSizeTitle: "Customize page size",
          saveCustomPageSize: "Save",
        },
        aggregationFunctions: {
          sum: "Sum",
          min: "Min",
          max: "Max",
          count: "Count",
          average: "Average",
        },
      },
      filter: {
        selectValue: "Select a value",
        set: "Set",
        moduloDivisor: "Divisor",
        searchInLabel: "Search in %{label}",
        moduloRemainder: "Remainder",
        periodFromDate: "From",
        periodToDate: "To",
        fromValue: "From",
        toValue: "To",
        moduloDividerMayNotBeNull: "Divisor may not be nulll",
        endValueMustBeGreaterThanStartValue: "End value must be greater than Start Value",
        setStartAndEndValue: "Set Start and End Value",
        addFilter: "Add Filter",
        filter: "Filter",
        clearFilter: "Clear Filter",
        ignoreCase: "Ignore Case",
        operatorsLabel: "Operators",
        actionsLabel: "Actions",
        handleZero: "Handle Zero",
        operators: {
          $and: "And",
          $or: "Or",
          $nor: "Nor",
          $not: "Not",
          $eq: "Equals",
          $ne: "Not Equals",
          $gt: "Greater Than",
          $gte: "Greater Than or Equals",
          $lt: "Less Than",
          $lte: "Less Than or Equals",
          $in: "In",
          $nin: "Not In",
          $exists: "Exists",
          $type: "Type",
          $regex: "Regex",
          $options: "Options",
          $size: "Size",
          $mod: "Modulo",
          $all: "All",
          $elemMatch: "Element Match",
          $regexEquals: "Equals",
          $regexContains: "Contains",
          $regexNotContains: "Not Contains",
          $regexNotequals: "Not Equals",
          $regexStartswith: "Starts With",
          $regexEndswith: "Ends With",
          $week: "Week",
          $month: "Month",
          $period: "Period",
          $thisday: "This Day",
          $yesterday: "Yesterday",
          $prevWeek: "Previous Week",
          $nextWeek: "Next Week",
          $between: "Between",
          $prevMonth: "Previous Month",
          $nextMonth: "Next Month",
        } as Record<IMongoOperatorName, string>,
      },
      dialog: {
        alert: {
          confirmButton: "Ok",
          cancelButton: "Cancel",
        }
      },
      notify: {
        errorTitle: "Error",
        successTitle: "Success",
        infoTitle: "Info",
        warningTitle: "Warning",
      },
      form: {
        validator: {
          matchField: "Field %{fieldName} must match %{matchFieldName}",
        }
      }
    },
  },
});
