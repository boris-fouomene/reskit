import React, { createContext, isValidElement, useContext, useEffect, useMemo, useRef } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ViewProps,
    Pressable,
    Dimensions,
    LayoutChangeEvent,
    LayoutRectangle
} from 'react-native';
import { Component, ObservableComponent, getReactKey, getTextContent, useForceRender, useIsMounted } from '@utils/index';
import { areEquals, defaultBool, defaultStr, isEmpty, isNonNullString, isNumber, isObj, isStringNumber, stringify, defaultNumber } from '@resk/core/utils';
import Auth from "@resk/core/auth";
import { IField, IFieldType, IResourcePaginationMetaData, IResourceQueryOptionsOrderBy, IResourceQueryOptionsOrderDirection } from '@resk/core/types';
import Logger from "@resk/core/logger";
import Label, { ILabelProps } from '@components/Label';
import InputFormatter from '@resk/core/inputFormatter';
import { ResourcePaginationHelper } from '@resk/core/resources';
import { IReactComponent } from '@src/types';
import { Preloader } from '@components/Dialog';
import { AppBar, IAppBarAction, IAppBarProps } from '@components/AppBar';
import { Divider } from '@components/Divider';
import { FontIcon, IFontIconName, IIconSource } from '@components/Icon';
import Theme from "@theme";
import { useDimensions } from '@dimensions/index';
import i18n from '@resk/core/i18n';

/**
 * A flexible and feature-rich data grid component for React Native.
 * 
 * The `Datagrid` class provides a powerful grid system for displaying, sorting, filtering, grouping, and paginating data.
 * It supports advanced features such as column aggregation, custom display views, and session-based state persistence.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * 
 * @example
 * ```tsx
 * import { Datagrid } from "./Datagrid";
 * 
 * const data = [
 *   { id: 1, name: "John", age: 30 },
 *   { id: 2, name: "Jane", age: 25 },
 * ];
 * 
 * const columns = [
 *   { name: "name", label: "Name", sortable: true },
 *   { name: "age", label: "Age", sortable: true, aggregatable: true },
 * ];
 * 
 * const App = () => (
 *   <Datagrid
 *     data={data}
 *     columns={columns}
 *     sortable
 *     aggregatable
 *     paginationEnabled
 *   />
 * );
 * ```
 */
class Datagrid<DataType extends IDatagridDataType = any> extends ObservableComponent<IDatagridProps<DataType>, IDatagridState<DataType>, IDatagridEvent> {
    /**
    * A unique symbol used to reflect metadata for the [Datagrid](cci:2://file:///d:/Projets/VSCODE/reskit/packages/resk-native/src/components/Datagrid/Datagrid.tsx:726:0-787:1) component.
    */
    private static reflectMetadataKey = Symbol('datagrid-reflect-metadata-key');
    /**
     * A unique symbol used to store aggregation function metadata for the [Datagrid](cci:2://file:///d:/Projets/VSCODE/reskit/packages/resk-native/src/components/Datagrid/Datagrid.tsx:726:0-787:1) component.
     */
    private static aggregationFunctionMetadataKey = Symbol("datagrid-aggregation-functions-meta");
    private _isLoading: boolean = false;
    private _toggleLoading: boolean = false;
    /***
     * A set of selected rows keys.
     */
    private readonly selectedRowsKeys: Set<string> = new Set();

    /**
     * Retrieves the keys of the currently selected rows.
     *
     * @returns {string[]} An array of strings representing the keys of the selected rows.
     */
    public getSelectedRowsKeys(): string[] {
        return Array.from(this.selectedRowsKeys);
    }
    /***
     * Retrieves the number of selected rows.
     *
     * @returns {number} The number of selected rows.
     */
    public getSelectedRowsCount(): number {
        return this.selectedRowsKeys.size;
    }
    /**
     * Determines if the given row is selected.
     *
     * This method checks if the specified row data corresponds to a selected row
     * within the Datagrid. It retrieves the row key using the provided row data and
     * verifies its validity. If the row key is valid, it checks the selection state
     * of the row by determining if the key exists in the set of selected row keys.
     *
     * @param {DataType} rowData - The data of the row to check selection status for.
     * @returns {boolean} `true` if the row is selected, `false` otherwise.
     */
    isRowSelected(rowData: DataType) {
        const rowKey = this.getRowKey(rowData);
        if (!Datagrid.isValidRowKey(rowKey)) return false;
        return this.selectedRowsKeys.has(rowKey);
    }
    /**
     * Validates the provided row key.
     *
     * This static method checks if the given row key is a non-null string,
     * indicating that it is a valid key for identifying a row in the Datagrid.
     *
     * @param {string} rowKey - The row key to validate.
     * @returns {boolean} - Returns `true` if the row key is a non-null string, `false` otherwise.
     */
    static isValidRowKey(rowKey: string) {
        return isNonNullString(rowKey);
    }

    /**
     * Checks if a row is selectable.
     *
     * This method determines if the given row data can be selected by checking if the row is a grouped row or if the `isRowSelectable` property is a function.
     * If the `isRowSelectable` property is a function, it calls the function with the provided row data and the current component's state and props.
     * Otherwise, it returns true, indicating that the row is selectable.
     *
     * @param {DataType | IDatagridGroupedRow} rowData - The data of the row to check selection status for.
     * @returns {boolean} - Returns `true` if the row is selectable, `false` otherwise.
     */
    isRowSelectable(rowData: DataType | IDatagridGroupedRow) {
        if (this.isGroupedRow(rowData)) return false;
        if (typeof this.props.isRowSelectable === "function") return this.props.isRowSelectable(this.getCallOptions({ rowData }));
        return true;
    }
    /**
     * Handles the layout change event for the container view.
     * 
     * This method is called when the container view's layout changes.
     * It updates the component's state with the new layout dimensions if the change is significant enough.
     * @param {LayoutChangeEvent} event - The layout change event.
     * @private
     */
    onContainerLayout(event: LayoutChangeEvent) {
        const { layout } = event.nativeEvent;
        const { width, height } = this.getContainerLayout();
        if (Math.abs(layout.width - width) <= 50 && Math.abs(layout.height - height) <= 50) return;
        this.setState({ containerLayout: layout });
    }

    /**
     * Returns the list of visible columns in the Datagrid.
     * 
     * This method returns the list of visible columns from the Datagrid's state.
     * 
     * @returns {IDatagridStateColumn[]} The list of visible columns.
     */
    getVisibleColumns() {
        return this.state.visibleColumns;
    }
    /**
     * Returns the list of all columns in the Datagrid.
     * 
     * This method retrieves the complete list of columns from the Datagrid's state.
     * 
     * @returns {IDatagridStateColumn[]} The list of all columns.
    */
    getColumns() {
        return this.state.columns;
    }
    /**
     * Returns the list of columns that can be grouped.
     * 
     * This method retrieves the list of groupable columns from the Datagrid's state.
     * 
     * @returns {IDatagridStateColumn[]} The list of groupable columns.
     */
    getGroupableColumns() {
        return this.state.groupableColumns;
    }
    /**
     * Toggles the selection state of a row in the Datagrid.
     * 
     * This method takes a row data object as a parameter and checks if the row is selectable by calling the `isRowSelectable` method.
     * If the row is not selectable, the method does nothing.
     * Otherwise, it checks if the row is already selected by calling the `isRowSelected` method.
     * If the row is selected, it removes the row key from the set of selected row keys and triggers the "rowUnselected" event.
     * Otherwise, it adds the row key to the set of selected row keys and triggers the "rowSelected" event.
     * Finally, it triggers the "toggleRowSelection" event with the updated selection state.
     * 
     * @param {DataType} rowData - The data of the row to toggle selection for.
     * @param {boolean} trigger - Optional flag to trigger the row selection changed event. Defaults to true.
     */
    toggleRowSelection(rowData: DataType, trigger: boolean = true) {
        const rowKey = this.getRowKey(rowData);
        if (!Datagrid.isValidRowKey(rowKey) || !this.isRowSelectable(rowData)) return;
        const isSelected = this.isRowSelected(rowData);
        if (isSelected) {
            this.selectedRowsKeys.delete(rowKey);
            if (trigger !== false) {
                this.trigger("rowUnselected", { rowData });
            }
        } else {
            this.selectedRowsKeys.add(rowKey);
            if (trigger !== false) {
                this.trigger("rowSelected", { rowData });
            }
        }
        if (trigger !== false) {
            this.trigger("toggleRowSelection", { rowData, isRowSelected: !isSelected });
        }
    }
    isAllRowsSelected() {
        return this.state.paginatedData.length > 0 && this.state.paginatedData.length <= this.selectedRowsKeys.size;
    }

    /**
     * Determines if the Datagrid is currently in a loading state.
     * The loading state is determined by the presence of the `isLoading` property
     * in the component's props.
     * @returns {boolean} `true` if the Datagrid is currently in a loading state, `false` otherwise.
     */
    isLoading() {
        return !!this.props.isLoading;
    }
    /**
     * Determines if the loading indicator can be rendered.
     * 
     * The loading indicator can be rendered if the Datagrid is in a loading state,
     * either due to the `isLoading` prop or the internal `_isLoading` state.
     * 
     * @returns {boolean} `true` if the loading indicator can be rendered, `false` otherwise.
     */
    canRenderLoadingIndicator() {
        return this.isLoading() || this._isLoading;
    }
    /**
     * Sets the loading state of the Datagrid and triggers the "toggleIsLoading" event.
     * If the loading state is set to `true`, the `_toggleLoading` flag is set to `true`.
     * The `cb` argument is a callback function that is called after the loading state has been toggled.
     * The callback function is called with the `isLoading` state as an argument.
     * The `timeout` argument is the time in milliseconds to wait before calling the callback function.
     * If `timeout` is not provided, the default timeout of 500 milliseconds is used.
     * @param {boolean} loading - The loading state of the Datagrid to be set.
     * @param {Function} [cb] - The callback function to be called after the loading state has been toggled.
     * @param {number} [timeout] - The time in milliseconds to wait before calling the callback function.
     * @returns {boolean} The loading state of the Datagrid.
     */
    setIsLoading(loading: boolean, cb?: Function, timeout?: number) {
        if (loading === true) {
            this._toggleLoading = true;
        }
        loading = this.props.isLoading === true ? true : typeof loading == "boolean" ? loading : false;
        timeout = typeof timeout == "number" ? timeout : 500;
        cb = typeof cb == "function" ? cb : () => true;
        this._isLoading = loading;
        this.trigger("toggleIsLoading", { isLoading: loading });
        setTimeout(cb, timeout);
        return this._isLoading;
    };
    /**
     * Toggles the selection state of all rows in the Datagrid.
     * 
     * This method takes an optional boolean parameter `selectOrUnselectAll` to determine if all rows should be selected.
     * If `selectOrUnselectAll` is `undefined`, the method will toggle the selection state of all rows.
     * If `selectOrUnselectAll` is `true`, all rows will be selected.
     * If `selectOrUnselectAll` is `false`, all rows will be unselected.
     * The method will also trigger the "toggleAllRowsSelection" event with the updated selection state if the `trigger` parameter is not set to `false`.
     * 
     * @param {boolean} [selectOrUnselectAll] - Optional flag to select all rows. Defaults to `undefined`.
     * @param {boolean} [trigger] - Optional flag to trigger the "toggleAllRowsSelection" event. Defaults to `true`.
     */
    toggleAllRowsSelection(selectOrUnselectAll?: boolean, trigger: boolean = true) {
        selectOrUnselectAll = typeof selectOrUnselectAll == "boolean" ? selectOrUnselectAll : !this.isAllRowsSelected();
        this.selectedRowsKeys.clear();
        if (selectOrUnselectAll) {
            for (const rowData of this.state.paginatedData) {
                const rowKey = this.getRowKey(rowData);
                if (!Datagrid.isValidRowKey(rowKey)) continue;
                this.selectedRowsKeys.add(rowKey);
            }
        }
        if (trigger !== false) {
            this.trigger("toggleAllRowsSelection", { isAllRowsSelected: selectOrUnselectAll });
        }
    }
    /**
     * Retrieves the selected rows.
     *
     * This method returns an array of rows that are currently selected in the Datagrid.
     * The array contains the actual data of the selected rows.
     *
     * @returns {DataType[]} An array of rows that are currently selected in the Datagrid.
     */
    getSelectedRows(): DataType[] {
        const selectedRows: DataType[] = [];
        for (const rowKey of this.selectedRowsKeys) {
            const row = this.getRowByKey(rowKey);
            if (!isObj(row) || !row) continue;
            selectedRows.push(row);
        }
        return selectedRows;
    }
    /**
     * A built-in aggregation function that returns the maximum value of a column.
     * 
     * @param {any} acc - The accumulator value.
     * @param {any} currentValue - The current value being processed.
     * @param {number} currentIndex - The index of the current value.
     * @param {DataType[]} data - The data being aggregated.
     * @returns {any} The maximum value of the column.
     */
    static maxAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return Math.max(defaultNumber(acc.max), currentValue);
    };
    /**
     * A built-in aggregation function that returns the minimum value of a column.
     * 
     * @param {any} acc - The accumulator value.
     * @param {any} currentValue - The current value being processed.
     * @param {number} currentIndex - The index of the current value.
     * @param {DataType[]} data - The data being aggregated.
     * @returns {any} The minimum value of the column.
     */
    static minAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return Math.min(defaultNumber(acc.min), currentValue);
    };
    /**
     * A built-in aggregation function that returns the sum of a column.
     * 
     * @param {any} acc - The accumulator value.
     * @param {any} currentValue - The current value being processed.
     * @param {number} currentIndex - The index of the current value.
     * @param {DataType[]} data - The data being aggregated.
     * @returns {any} The sum of the column.
     */
    static sumAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return defaultNumber(acc.sum) + currentValue;
    };
    /**
     * A built-in aggregation function that returns the count of a column.
     * 
     * @param {any} acc - The accumulator value.
     * @param {any} currentValue - The current value being processed.
     * @param {number} currentIndex - The index of the current value.
     * @param {DataType[]} data - The data being aggregated.
     * @returns {any} The count of the column.
     */
    static countAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return defaultNumber(acc.count) + 1;
    };
    /**
     * A built-in aggregation function that returns the average of a column.
     * 
     * @param {any} acc - The accumulator value.
     * @param {any} currentValue - The current value being processed.
     * @param {number} currentIndex - The index of the current value.
     * @param {DataType[]} data - The data being aggregated.
     * @returns {any} The average of the column.
     */
    static averageAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        acc.avgSum = defaultNumber(acc.avgSum) + currentValue;
        acc.avgCount = defaultNumber(acc.avgCount) + 1;
        return acc.avgSum / acc.avgCount;
    };
    /**
     * Returns an object containing all built-in and registered aggregation functions.
     * 
     * @returns {IDatagridAggregationFunctions} An object containing all aggregation functions.
     */
    static get aggregationFunctions(): IDatagridAggregationFunctions {
        return {
            sum: Datagrid.sumAggregationFunction,
            min: Datagrid.minAggregationFunction,
            max: Datagrid.maxAggregationFunction,
            count: Datagrid.countAggregationFunction,
            average: Datagrid.averageAggregationFunction,
            ...Datagrid.getRegisteredAggregationFunctions() as any,
        };
    }
    /**
     * Returns a registered aggregation function by name.
     * 
     * @param {string} aggregationFunctionName - The name of the aggregation function to retrieve.
     * @returns {IDatagridAggregationFunction} The aggregation function, or a default function if not found.
     */
    static getAggregationFunction(aggregationFunctionName: string) {
        const defaultFunc = () => 0;
        if (!isNonNullString(aggregationFunctionName)) return defaultFunc;
        const fn = (Datagrid.aggregationFunctions as any)[aggregationFunctionName];
        return typeof fn == "function" ? fn : defaultFunc;
    }
    /**
     * Initializes a new instance of the `Datagrid` component.
     * 
     * @param {IDatagridProps<DataType>} props - The properties for the component.
     */
    constructor(props: IDatagridProps<DataType>) {
        super(props);
        (this as any).state = {
            ...this.initStateFromSessionData(),
            columnsWidths: {},
            containerLayout: {
                x: 0, y: 0, width: 0, height: 0
            }
        };
        Object.assign(this.state, this.processColumns());
        Object.assign(this.state, this.processData(this.props.data));
    }
    getColumnWidth(colName: string) {
        const column = this.getColumn(colName);
        if (!column) return 0;
        const colWidth = this.state.columnsWidths[colName];
        if (isNumber(colWidth) && colWidth > 20) return colWidth;
        if (isNumber(column.width) && column.width > 20) return column.width;
        if (["date", "time", "datetime", "tel"].includes(column.type)) {
            return column.type == "datetime" ? 280 : 200;
        }
        if (["number", "decimal"].includes(column.type)) {
            return 170;
        }
        return 170;
    }

    getContainerLayout(): LayoutRectangle {
        return this.state.containerLayout;
    }
    /**
     * Sorts or unsorts a column based on the specified action.
     * 
     * @param {string} colName - The name of the column to sort or unsort.
     * @param {"sort" | "unsort"} action - The action to perform (`"sort"` or `"unsort"`).
     */
    private sortOrUnSortColumn(colName: string, action: "sort" | "unsort") {
        if (!isNonNullString(colName) || !this.isSortable()) return;
        const column = this.getColumn(colName);
        if (!column || column.sortable === false) return;
        let direction: IResourceQueryOptionsOrderDirection = "asc";
        const orderBy = [...this.state.orderBy].filter((o) => {
            if (!isObj(o)) return false;
            const [field, cDirection] = Object.entries(o)[0];
            const hasF = String(field).toLowerCase() !== String(colName).toLowerCase();
            if (hasF) {
                direction = String(cDirection).toLowerCase() === "asc" ? "desc" : "asc";
            }
            return !hasF;
        });
        if (action == "sort") {
            orderBy.push({ [colName]: direction } as any);
        }
        this.updateState({ orderBy }, () => {
            this.setSessionData("orderBy", orderBy);
        });
    }
    /**
     * Sorts a column in ascending or descending order.
     * 
     * @param {string} colName - The name of the column to sort.
     * 
     * @example
     * ```typescript
     * datagridInstance.sortColumn("name");
     * ```
     */
    sortColumn(colName: string) {
        this.sortOrUnSortColumn(colName, "sort");
    }
    /**
     * Unsorts a column, removing it from the sorting criteria.
     * 
     * @param {string} colName - The name of the column to unsort.
     * 
     * @example
     * ```typescript
     * datagridInstance.unsortColumn("name");
     * ```
     */
    unsortColumn(colName: string) {
        this.sortOrUnSortColumn(colName, "unsort");
    }
    /**
    * Initializes the component's state from session data.
    * 
    * @returns {IDatagridState<DataType>} The initialized state.
    */
    protected initStateFromSessionData(): Partial<IDatagridState<DataType>> {
        const sessionData = this.getSessionData();
        const r: Partial<IDatagridState<DataType>> = {};
        if (Array.isArray(sessionData.orderBy) && sessionData.orderBy.length > 0) {
            r.orderBy = sessionData.orderBy;
        } else if (Array.isArray(this.props.orderBy) && this.props.orderBy.length > 0) {
            r.orderBy = this.props.orderBy;
        }
        const displayViews = this.getDisplayViews() as IDatagridDisplayViewName[];
        const displayView = this.isValidDisplayView(sessionData.displayView) ? sessionData.displayView : undefined;
        r.displayView = displayView ? displayView : this.isValidDisplayView(this.props.displayView) ? this.props.displayView : displayViews[0];
        const groupedColumns = Array.isArray(sessionData.groupedColumns) ? sessionData.groupedColumns : Array.isArray(this.props.groupedColumns) ? this.props.groupedColumns : [];
        r.groupedColumns = groupedColumns;
        r.displayFilters = defaultBool(sessionData.displayFilters, this.isFiltrable());
        r.displayHeaders = defaultBool(sessionData.displayHeaders, true);
        r.displayAggregatedHeaders = defaultBool(sessionData.displayAggregatedHeaders, this.props.aggregatable !== false);
        if (this.props.displayHeaders === false) {
            r.displayHeaders = false;
        }
        if (this.props.displayFilters === false) {
            r.displayFilters = false;
        }
        if (this.props.displayAggregatedHeaders === false) {
            r.displayAggregatedHeaders = false;
        }
        this.setSessionData("displayFilters", r.displayFilters);
        this.setSessionData("displayHeaders", r.displayHeaders);
        this.setSessionData("displayAggregatedHeaders", r.displayAggregatedHeaders);
        return r;
    }
    /**
     * Updates the current display view of the datagrid if the provided display view is valid and 
     * different from the current one. Persists the new display view in the session data.
     * 
     * @param {IDatagridDisplayViewName} displayView - The name of the display view to update to.
     */
    updateDisplayView(displayView: IDatagridDisplayViewName) {
        if (!displayView) return;
        const displayViews = this.getDisplayViews();
        if (displayViews.includes(displayView) && defaultStr(this.state.displayView).toLowerCase().trim() !== defaultStr(displayView).toLowerCase().trim()) {
            this.updateState({ displayView }, () => {
                this.setSessionData("displayView", displayView);
            });
        }
    }

    /**
     * Updates the component's state with the provided data, and optionally executes a callback function
     * after the state has been updated.
     * 
     * @param {Partial<IDatagridState<DataType>>} stateData - The data to update the component's state with.
     * @param {() => void} [callback] - An optional function to execute after the state has been updated.
     */
    updateState(stateData: Partial<IDatagridState<DataType>>, callback?: () => void) {
        this.setIsLoading(true, () => {
            this.setState((prevState) => ({ ...prevState, ...stateData }), callback);
        });
    }
    /***
     * returns the list of display views to be displayed in the datagrid. if provided from props, it will override the default display views.
     */
    getDisplayViews(): IDatagridDisplayViewName[] {
        return Array.isArray(this.props.displayViews) && this.props.displayViews.length > 0 ? this.props.displayViews : Object.keys(Datagrid.getRegisteredDispayViews2Metadata()) as IDatagridDisplayViewName[];
    }
    /**
     * Processes the columns for the component.
     * 
     * @returns {IDatagridState<DataType>} The processed columns.
     */
    processColumns(groupedColumns?: string[]) {
        if (!Array.isArray(this.props.columns)) return { columns: [], groupedColumns: [], groupableColumns: [], visibleColumns: [], columnsByName: {}, aggregatableColumns: [] };
        const columns: IDatagridStateColumn<DataType>[] = [];
        const visibleColumns: IDatagridStateColumn<DataType>[] = [];
        const columnsByName: IDatagridState<DataType>["columnsByName"] = {};
        const aggregatableColumns: IDatagridStateColumn<DataType>[] = [];
        const groupableColumns: IDatagridStateColumn<DataType>[] = [];
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const stateGroupedColumns: string[] = [];
        let colIndex = -1;
        this.props.columns.map((column) => {
            if (isObj(column) && isNonNullString(column.name)) {
                colIndex++;
                const aggretagionFunction = isNonNullString(column.aggregationFunction) ? Datagrid.getAggregationFunction(column.aggregationFunction) :
                    Datagrid.isValidAggregationFunction(column.aggregationFunction as any) ? column.aggregationFunction : undefined;
                const col: IDatagridStateColumn<DataType> = {
                    ...Object.clone(column),
                    colIndex,
                    groupable: this.isGroupable() && column.groupable !== false,
                    filterable: this.isFiltrable() && column.filterable !== false,
                    sortable: this.isSortable() && column.sortable !== false,
                    visible: column.visible !== false,
                    aggregatable: this.isAggregatable() && column.aggregatable !== false,
                    aggregationFunction: aggretagionFunction ? aggretagionFunction : Datagrid.countAggregationFunction,
                };
                columns.push(col);
                if (col.visible !== false) {
                    visibleColumns.push(col);
                }
                if (col.aggregatable !== false) {
                    aggregatableColumns.push(col);
                }
                if (col.groupable !== false) {
                    groupableColumns.push(col);
                    if (groupedColumns.includes(col.name)) {
                        stateGroupedColumns.push(col.name);
                    }
                }
                columnsByName[col.name] = col;
            }
        });
        return { columns, visibleColumns, columnsByName, aggregatableColumns, groupableColumns, groupedColumnsNames: stateGroupedColumns };
    }
    /**
     * Retrieves a column definition by name.
     * 
     * @param {string} colName - The name of the column to retrieve.
     * 
     * @returns {IDatagridStateColumn<DataType>} The column definition if found, otherwise an empty object.
     */
    getColumn(colName: string): IDatagridStateColumn<DataType> {
        if (isNonNullString(colName) && this.state.columnsByName[colName]) {
            return this.state.columnsByName[colName]
        }
        return {} as IDatagridStateColumn<DataType>;
    }
    isValidColumn(column: IDatagridStateColumn): column is IDatagridStateColumn<DataType> {
        return isObj(column) && isNonNullString(column.name);
    }
    /**
     * Checks if a column is visible.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is visible, otherwise `false`.
     */
    isColumnVisible(colName: string) {
        return this.getColumn(colName).visible;
    }
    /**
     * Checks if a column is aggregatable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is aggregatable, otherwise `false`.
     */
    isColumnAggregatable(colName: string) {
        return this.isAggregatable() && this.getColumn(colName).aggregatable;
    }
    /**
     * Toggles the display of filters.
     * 
     * This method simply toggles the `displayFilters` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleDisplayFilters() {
        this.updateState({ displayFilters: !this.state.displayFilters }, () => {
            this.setSessionData("displayFilters", this.state.displayFilters);
        });
    }
    /**
     * Toggles the display of aggregated headers.
     * 
     * This method simply toggles the `displayAggregatedHeaders` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleDisplayAggregatedHeaders() {
        this.updateState({ displayFilters: !this.state.displayAggregatedHeaders }, () => {
            this.setSessionData("displayAggregatedHeaders", this.state.displayAggregatedHeaders);
        });
    }
    /**
     * Toggles the display of headers.
     * 
     * This method simply toggles the `displayHeaders` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleDisplayHeaders() {
        this.updateState({ displayHeaders: !this.state.displayHeaders }, () => {
            this.setSessionData("displayHeaders", this.state.displayHeaders);
        });
    }

    /**
     * Determines if headers can be displayed in the datagrid.
     *
     * This method checks the current state and props to decide if headers should be shown.
     *
     * @returns {boolean} - `true` if headers can be displayed, otherwise `false`.
     */
    canDisplayHeaders() {
        return !!this.state.displayHeaders && this.props.displayHeaders !== false;
    }
    /**
     * Determines if filters can be displayed in the datagrid.
     *
     * This method checks the current state and props to decide if filters should be shown.
     *
     * @returns {boolean} - `true` if filters can be displayed, otherwise `false`.
     */
    canDisplayFilters() {
        return !!this.state.displayFilters && this.props.displayFilters !== false;
    }
    /**
     * Checks if a column is groupable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is groupable, otherwise `false`.
     */
    isColumnGroupable(colName: string) {
        return this.isGroupable() && this.getColumn(colName).groupable;
    }
    /**
     * Checks if a column is sortable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is sortable, otherwise `false`.
     */
    isColumnSortable(colName: string) {
        return this.isSortable() && this.getColumn(colName).sortable;
    }
    /**
     * Checks if a column is filterable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is filterable, otherwise `false`.
     */
    isColumnFilterable(colName: string) {
        return this.isFiltrable() && this.getColumn(colName).filterable;
    }
    /**
     * Determines whether the grid supports sorting.
     * 
     * @returns {boolean} - `true` if sorting is enabled, otherwise `false`.
     */
    isSortable() {
        return this.props.sortable !== false;
    }
    /**
     * Determines whether the grid supports filtering.
     * 
     * @returns {boolean} - `true` if filtering is enabled, otherwise `false`.
     */
    isFiltrable() {
        return this.props.filterable !== false;
    }
    /**
     * Determines whether the grid supports aggregation.
     * 
     * @returns {boolean} - `true` if aggregation is enabled, otherwise `false`.
     */
    isAggregatable() {
        return this.props.aggregatable !== false;
    }
    /**
     * Determines whether the grid supports grouping.
     * 
     * @returns {boolean} - `true` if grouping is enabled, otherwise `false`.
     */
    isGroupable(): boolean {
        return this.props.groupable !== false;
    }

    /**
     * Computes the value of a column for a given row.
     * 
     * @param {IDatagridStateColumn | string} column - The column object or column name.
     * @param {DataType} rowData - The data for the row.
     * @param {boolean} [format=false] - Whether to format the value using the column's formatter.
     * 
     * @returns {any} - The computed value of the row cell.
     * 
     * @example
     * ```typescript
     * const value = datagridInstance.computeCellValue("name", { name: "John" });
     * console.log(value); // Output: "John"
     * ```
     */
    computeCellValue(column: IDatagridStateColumn | string, rowData: DataType, format?: boolean): any {
        const col: IDatagridStateColumn = typeof column === "string" && column ? this.getColumn(column) : column as any;
        if (!isObj(rowData) || !isObj(col) || !isNonNullString(col.name)) return undefined;
        const v = typeof col.computeCellValue === "function" ? col.computeCellValue(this.getCallOptions({ rowData })) : (rowData as any)[col.name];
        const value = typeof v === "object" ? stringify(v) : v;
        if (format && !isEmpty(value)) {
            return InputFormatter.formatValue({ ...col, value }).formattedValue;
        }
        return value;
    }
    /**
     * Returns an object containing the Datagrid context and the provided options.
     * 
     * @template T - The type of the options.
     * @param {T} otherOptions - The options to include in the returned object.
     * 
     * @returns {IDatagridCallOptions<DataType> & T} - The object containing the Datagrid context and the provided options.
     * 
     */
    getCallOptions<T = any>(otherOptions: T): IDatagridCallOptions<DataType> & T {
        return Object.assign({}, { datagridContext: this }, otherOptions);
    }
    /**
     * Retrieves the key for a given row.
     * 
     * @param {DataType} rowData - The data for the row.
     * 
     * @returns {string} - The key for the row.
     * 
     * @example
     * ```typescript
     * const rowKey = datagridInstance.getRowKey({ id: 1, name: "John" });
     * console.log(rowKey); // Output: "1"
     * ```
     */
    getRowKey(rowData: DataType): string {
        let k: any = undefined;
        if (typeof (this.props.getRowKey) === "function") {
            k = this.props.getRowKey(this.getCallOptions({ rowData }));
            if (typeof k == 'string' && k || typeof k == 'number') {
                return String(k);
            }
        }
        const rKey = getReactKey<DataType>(rowData, this.props.rowKey);
        return defaultStr(!isEmpty(rKey) ? String(rKey) : undefined, undefined);
    }
    /**
     * Determines if the provided row data represents a grouped row.
     *
     * This method checks if the row data is an object and contains the properties 
     * indicating it is a grouped row, such as `isDatagridGroup` and a valid `label`.
     * 
     * @param {IDatagridGroupedRow | DataType} rowData - The row data to evaluate.
     * 
     * @returns {boolean} - Returns true if the row data is a grouped row; otherwise, false.
     */
    isGroupedRow(rowData: IDatagridGroupedRow | DataType): rowData is IDatagridGroupedRow {
        return isObj(rowData) && !!rowData.isDatagridGroup && isNonNullString(rowData.label);
    }
    /**
     * Sorts the data in ascending or descending order according to the specified columns and directions.
     * 
     * @param {DataType[]} data - The data to be sorted.
     * @param {IResourceQueryOptionsOrderBy<DataType>} orderBy - The sorting columns and directions. If not specified, the Datagrid's `orderBy` state is used.
     * 
     * @returns {DataType[]} - The sorted data.
     */
    internalSort(data: DataType[], orderBy?: IResourceQueryOptionsOrderBy<DataType>): DataType[] {
        if (!Array.isArray(data)) return [];
        orderBy = Array.isArray(orderBy) ? orderBy : this.state.orderBy;
        // Multi-field sorting
        if (data.length && this.isSortable() && Array.isArray(orderBy) && orderBy.length > 0) {
            const sortableCols = orderBy.filter((sortColumn) => {
                if (!isObj(sortColumn)) return false;
                const [field, direction] = Object.entries(sortColumn)[0];
                const column = this.getColumn(field);
                return column && ["asc", "desc"].includes(String(direction).toLowerCase());
            });
            if (sortableCols.length) {
                return data.sort((a, b) => {
                    for (const sortColumn of sortableCols) {
                        const [field, direction] = Object.entries(sortColumn)[0];
                        const column = this.getColumn(field);
                        return this.compareCellValues(a, b, column, direction as any, column.ignoreCaseWhenSorting);
                    }
                    return 0;
                });
            }
        }
        return data;
    }
    /**
     * Retrieves a row by its key.
     * 
     * @param {string} rowKey - The key of the row to retrieve.
     * 
     * @returns {DataType | null} - The row data if found, otherwise `null`.
     */
    getRowByKey(rowKey: string): DataType | null {
        if (!isNonNullString(rowKey)) return null;
        return this.state.rowsByKeys[rowKey] || null;
    }
    /**
     * Returns the separator used for grouping row headers.
     * 
     * The separator is used to separate the column values in the grouped row header.
     * 
     * If not specified, the default value is a comma (`,`).
     * 
     * @returns {string} - The separator used for grouping row headers.
     */
    getGroupedRowHeaderSeparator(): string {
        return defaultStr(this.props.groupedRowHeaderSeparator, ",");
    }
    /**
     * Computes the grouped row header text from the given row data.
     * 
     * @param {DataType} rowData - The row data to use for computing the grouped row header.
     * @param {string[]} groupedColumns - The columns to include in the grouped row header. If not specified, the Datagrid's `groupedColumns` state is used.
     * 
     * @returns {string} - The grouped row header text. If no columns are specified, an empty string is returned.
     */
    getGroupedRowHeader(rowData: DataType, groupedColumns?: string[]): string {
        const d: string[] = [];
        const groupHeaderSeparator = this.getGroupedRowHeaderSeparator();
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const includeColumnLabelInGroupedRowHeader = this.props.includeColumnLabelInGroupedRowHeader !== false;
        groupedColumns.map((columnName) => {
            if (!isNonNullString(columnName)) return;
            const column = this.getColumn(columnName);
            if (!column) return;
            const txt = this.computeCellValue(column, rowData, true);
            if (isEmpty(txt)) return;
            const labelText = getTextContent(column.label);
            const stringifiedTxt = stringify(txt);
            if (!stringifiedTxt) return;
            if (labelText && includeColumnLabelInGroupedRowHeader) {
                d.push(`${labelText} : ${stringifiedTxt}`)
            } else {
                d.push(stringifiedTxt)
            }
        });
        return d.join(groupHeaderSeparator).toUpperCase() || "";
    }
    /**
     * Retrieves the grouped rows associated with the given key.
     * 
     * @param {string} groupedRowKey - The key of the grouped row to retrieve.
     * 
     * @returns {DataType[]} - The grouped row data if found, otherwise an empty array.
     */
    getGroupedRows(groupedRowKey: string): DataType[] {
        if (!isNonNullString(groupedRowKey)) return [];
        const r = this.state.groupedRowsByKeys[groupedRowKey];
        return Array.isArray(r) ? r : [];
    }
    /**
     * Checks if the Datagrid can paginate its data.
     * 
     * It checks if the component's `paginationEnabled` prop is set to `true`.
     * 
     * @returns {boolean} Whether the Datagrid can paginate its data.
     */
    canPaginate(): boolean {
        return !!this.props.paginationEnabled;
    }

    /**
     * Processes the data for the component.
     * 
     * This method is an internal, protected method that is used by the Datagrid to process the data
     * when the component mounts or when the data changes.
     * 
     * It processes the data by sorting it, filtering it, grouping it, and paginating it.
     * 
     * @param {DataType[]} data - The data to process.
     * @param {IResourceQueryOptionsOrderBy<DataType>} orderBy - The sorting columns and directions. If not specified, the Datagrid's `orderBy` state is used.
     * @param {string[]} groupedColumns - The columns to group the data by. If not specified, the Datagrid's `groupedColumns` state is used.
     * @param {IDatagridPagination} pagination - The pagination configuration. If not specified, the Datagrid's `pagination` state is used.
     * 
     * @returns {Partial<IDatagridState<DataType>>} - A partial state object containing the aggregated columns values, the paginated data, the all data, the data to display, the pagination configuration, and the grouped rows by keys.
     */
    protected processData(data: DataType[], orderBy?: IResourceQueryOptionsOrderBy<DataType>, groupedColumns?: string[], pagination?: IDatagridPagination): Partial<IDatagridState<DataType>> {
        let processingData: DataType[] = [];
        const paginationConfig: IDatagridPagination = isObj(pagination) ? pagination as IDatagridPagination : isObj(this.state.pagination) ? this.state.pagination : {} as IDatagridPagination;
        const { columns, aggregatableColumns } = this.state;
        const canPaginate = this.canPaginate();
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const groupedRowsByKeys: IDatagridState<DataType>["groupedRowsByKeys"] = {} as IDatagridState<DataType>["groupedRowsByKeys"];
        const rowsByKeys: IDatagridState<DataType>["rowsByKeys"] = {} as IDatagridState<DataType>["rowsByKeys"];
        const isGroupable = this.isGroupable() && groupedColumns?.length;
        const aggregationFunctions = Datagrid.getRegisteredAggregationFunctions();
        const aggregatedColumnsValues: Record<string, Record<keyof IDatagridAggregationFunctions, number>> = {};
        aggregatableColumns.map((column) => {
            const colAggregated = (aggregatedColumnsValues as any)[column.name] = {};
            for (let i in aggregationFunctions) {
                (colAggregated as any)[i] = 0;
            }
        });
        data.map((rowData, index) => {
            if (!isObj(rowData) || (typeof this.props.localFilter == "function" && !this.props.localFilter(rowData, index))) return;
            rowData = typeof this.props.rowDataMutator == "function" ? this.props.rowDataMutator(this.getCallOptions({ rowData })) : rowData;
            if (!isObj(rowData)) return;
            const rowKey = this.getRowKey(rowData);
            if (!isNonNullString(rowKey)) {
                Logger.log("Invalid datagrid rowKey : rowKey is not a string", rowKey, " at index ", index, " datagrid session name : ", this.getSesionName());
                return;
            }
            rowsByKeys[rowKey] = rowData;
            processingData.push(rowData);
            columns.map((column) => {
                if (column.aggregatable) {
                    const colAggregated = (aggregatedColumnsValues as any)[column.name];
                    for (let i in aggregationFunctions) {
                        const fn: IDatagridAggregationFunction = (aggregationFunctions as any)[i];
                        const value = this.computeCellValue(column, rowData);
                        const val2 = isStringNumber(value) ? parseFloat(value) : value;
                        if (isNumber(val2) && typeof fn === "function") {
                            (colAggregated as any)[i] = defaultNumber(fn(colAggregated, val2, index, data));
                        }
                    }
                }
                if (column.groupable) {

                }
            });
        });
        paginationConfig.total = processingData.length;
        paginationConfig.currentPage = isNumber(paginationConfig.currentPage) && paginationConfig.currentPage > 0 ? paginationConfig.currentPage : 1;
        paginationConfig.pageSize = isNumber(paginationConfig.pageSize) && paginationConfig.pageSize > 0 ? paginationConfig.pageSize : 10;
        processingData = this.internalSort(processingData, orderBy);
        let paginatedData = processingData;
        if (canPaginate) {
            const { data: rData, meta } = ResourcePaginationHelper.paginate(processingData, paginationConfig.total, {
                ...paginationConfig,
                limit: paginationConfig.pageSize,
                page: paginationConfig.currentPage
            });
            Object.assign(paginationConfig, meta);
            paginatedData = rData;
        }
        const stateData: IDatagridStateData<DataType> = isGroupable ? [] : processingData;
        const unknowGroupLabel = "N/A";
        if (isGroupable) {
            paginatedData.map((rowData, rowIndex) => {
                const groupableKey = defaultStr(this.getGroupedRowHeader(rowData, groupedColumns), unknowGroupLabel);
                const groupedRowHeader = {
                    label: groupableKey,
                    isDatagridGroup: true,
                    groupedKey: groupableKey,
                } as IDatagridGroupedRow;
                if (!Array.isArray(groupedRowsByKeys[groupableKey])) {
                    groupedRowsByKeys[groupableKey] = [];
                }
                groupedRowsByKeys[groupableKey].push(rowData);
                stateData.push(groupedRowHeader);
                stateData.push(rowData);
            });
        }
        return { aggregatedColumnsValues, paginatedData, allData: processingData, data: stateData, pagination: paginationConfig, groupedRowsByKeys, rowsByKeys };
    }
    /**
     * Checks if two arrays are equal.
     * 
     * This function assumes that the arrays contain only primitive values and not objects.
     * It first checks if the arrays have the same length. If they do, it checks if the arrays are the same reference.
     * If they are not the same reference, it checks every element in the arrays to see if they are equal.
     * If all elements are equal, it returns true, otherwise it returns false.
     * If the arrays are not the same length, it returns false.
     * If either of the arrays is null or undefined, it returns true.
     * @param a The first array to compare.
     * @param b The second array to compare.
     * @returns {boolean} True if the arrays are equal, otherwise false.
     */
    static areArraysEqual(a?: any[], b?: any[]) {
        if (!Array.isArray(a)) {
            a = [];
        }
        if (!Array.isArray(b)) {
            b = [];
        }
        if (a.length === 0 || b.length === 0) return true;
        if (a.length !== b.length) return false;
        return a === b;
    }
    /**
     * Lifecycle method that is called after the component updates.
     *
     * This method updates the component's state based on changes in props such as columns, sorting, filtering, aggregation,
     * grouping, display view, order by, grouped columns, and pagination. If any of these properties change, the method
     * processes the new columns, data, and state, and updates the session data accordingly.
     * 
     * @param {IDatagridProps<DataType>} prevProps - The previous properties of the datagrid component.
     * @param {IDatagridState<DataType>} prevState - The previous state of the datagrid component.
     */
    componentDidUpdate(prevProps: IDatagridProps<DataType>, prevState: IDatagridState<DataType>) {
        const newState: Partial<IDatagridState<DataType>> = {};
        let hasUpdated = false;
        if (!Datagrid.areArraysEqual(prevProps.columns, this.props.columns)
            || this.props.sortable !== prevProps.sortable
            || this.props.filterable !== prevProps.filterable
            || this.props.aggregatable !== prevProps.aggregatable
            || this.props.groupable !== prevProps.groupable
        ) {
            Object.assign(newState, this.processColumns());
            hasUpdated = true;
        }
        if (this.props.displayView !== prevProps.displayView && this.isValidDisplayView(this.props.displayView)) {
            newState.displayView = this.props.displayView;
            hasUpdated = true;
        }
        const hasOrderByChanged = !Datagrid.areArraysEqual(prevProps.orderBy, this.props.orderBy) && Array.isArray(this.props.orderBy);
        const orderBy = hasOrderByChanged ? this.props.orderBy : this.state.orderBy;
        const groupedColumns = Array.isArray(this.props.groupedColumns) ? this.props.groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const hasGroupedColumnsChanged = !Datagrid.areArraysEqual(prevProps.groupedColumns, this.props.groupedColumns) && Array.isArray(this.props.groupedColumns);
        const hasPaginationChanged = defaultBool(prevProps.paginationEnabled) !== defaultBool(this.props.paginationEnabled) || !areEquals(prevProps.pagination, this.props.pagination);
        const pagination: IDatagridPagination = isObj(this.props.pagination) ? this.props.pagination as any : this.state.pagination;
        // Check if data has changed
        if (hasUpdated || hasPaginationChanged || hasGroupedColumnsChanged || hasOrderByChanged || !Datagrid.areArraysEqual(prevProps.data, this.props.data)) {
            Object.assign(newState, this.processData(this.props.data, orderBy, groupedColumns, pagination));
            hasUpdated = true;
        }
        if (prevProps.displayFilters !== this.props.displayFilters && typeof this.props.displayFilters == "boolean") {
            newState.displayFilters = this.props.displayFilters;
            hasUpdated = true;
        }
        if (prevProps.displayHeaders !== this.props.displayHeaders && typeof this.props.displayHeaders == "boolean") {
            newState.displayHeaders = this.props.displayHeaders;
            hasUpdated = true;
        }
        if (prevProps.displayAggregatedHeaders !== this.props.displayAggregatedHeaders && typeof this.props.displayAggregatedHeaders === "boolean") {
            newState.displayAggregatedHeaders = this.props.displayAggregatedHeaders;
            hasUpdated = true;
        }
        if (hasUpdated) {
            this.updateState(newState, () => {
                this.setSessionData("displayView", this.state.displayView);
                this.setSessionData("orderBy", this.state.orderBy);
                this.setSessionData("groupedColumns", this.state.groupedColumns);
                this.setSessionData("displayAggregatedHeaders", this.state.displayAggregatedHeaders);
            });
        } else {
            setTimeout(() => {
                if (this._toggleLoading === true) {
                    this.setIsLoading(false);
                }
                this._toggleLoading = false;
            }, 500);
        }
    }

    /**
     * Checks if the given display view is valid.
     * 
     * The method checks if the given display view is a non-null string and if it is included in the list of registered display views.
     * 
     * @param {any} displayView - The display view to check.
     * @returns {displayView is IDatagridDisplayViewName} - If the display view is valid, the method returns true.
     */
    isValidDisplayView(displayView: any): displayView is IDatagridDisplayViewName {
        if (!isNonNullString(displayView)) return false;
        const displayViews = this.getDisplayViews();
        return displayViews.includes(displayView as IDatagridDisplayViewName);
    }
    /***
     * Switches the display view of the Datagrid.
     * 
     * This method updates the state of the Datagrid to switch the display view.
     * 
     * @param {IDatagridDisplayViewName} displayView - The name of the display view to switch to.
     */
    switchDisplayView = (displayView: IDatagridDisplayViewName) => {
        this.setState({ displayView });
    }
    /**
     * Returns the current display view of the Datagrid.
     * 
     * @returns {IDatagridDisplayViewName} - The current display view of the Datagrid.
     */
    getDisplayView() {
        return this.state.displayView;
    }
    /**
     * Retrieves the test ID for the Datagrid component.
     * 
     * The method returns the value of the `testID` property if it is a non-null string, otherwise it returns "resk-datagrid".
     * 
     * @returns {string} The test ID for the Datagrid component.
     */
    getTestID() {
        return defaultStr(this.props.testID, "resk-datagrid");
    }
    render() {
        return <DatagridRendered
            context={this}
        />
    }
    /**
     * Generates a unique session key based on the provided session name.
     * 
     * The session key is constructed in the format: `datagrid-session-data-{sessionName}`.
     * If the session name is not specified, the default session name is `default`.
     * 
     * @returns {string} The unique session key associated with the Datagrid component.
     */
    getSesionName() {
        return `datagrid-session-data-${defaultStr(this.props.sessionName, "default")}`;
    }
    /**
     * Removes the session data for the Datagrid component associated with the specified session name.
     * 
     * If the session name is not a non-null string, the method does nothing.
     * 
     * @param {string} sessionName - The session name associated with the session data to remove.
     * @returns {any} The previous session data associated with the specified session name, or undefined if no session data was associated with the session name.
     */
    removeSessionData(sessionName: string) {
        return this.setSessionData(sessionName, undefined);
    }
    /**
     * Removes all session data associated with the Datagrid component.
     * 
     * This function clears all stored data for the session identified by the component's session name.
     * It sets the session data to an empty object, effectively removing any existing data.
     * 
     * @returns {void} This function does not return a value.
     */

    removeAllSessionData() {
        return Auth.Session.set(this.getSesionName(), {});
    }
    /**
     * Sets a value in the session data associated with the specified session name.
     * 
     * This function sets a value in the session data associated with the specified session name.
     * If the value is undefined or null, the corresponding key is removed from the session data.
     * If the session name is not a non-null string, the method does nothing.
     * 
     * @param {keyof IDatagridState<DataType> | string} sessionName - The session name associated with the session data to set.
     * @param {any} data - The value to set in the session data.
     * 
     * @returns {any} The updated session data associated with the specified session name.
     */
    setSessionData(sessionName: keyof IDatagridState<DataType> | string, data: any) {
        const sessionData = this.getSessionData();
        if (!isNonNullString(sessionName)) return sessionData;
        if (data === undefined || data === null) {
            delete sessionData[sessionName as keyof typeof sessionData];
        } else {
            (sessionData as any)[sessionName] = data;
        }
        Auth.Session.set(this.getSesionName(), sessionData);
        return sessionData;
    }
    /**
    * Retrieves the session data associated with the Datagrid component, or a value from that session data if a session name is provided.
    * 
    * This function retrieves the session data associated with the Datagrid component's session name.
    * If the session name is not a non-null string, the method does nothing and the original session data is returned.
    * If the session name is provided, the corresponding value is returned from the session data.
    * 
    * @param {keyof IDatagridState<DataType> | string} [sessionName] - The session name associated with the value to retrieve from the session data.
    * @returns {any} The session data associated with the Datagrid component, or the value associated with the specified session name.
    */
    getSessionData(sessionName?: keyof IDatagridState<DataType> | string) {
        const data = Object.assign({}, Auth.Session.get(this.getSesionName()));
        if (isNonNullString(sessionName)) {
            return data[sessionName as keyof typeof data];
        }
        return data;
    }
    /**
     * Registers a display view for the Datagrid component.
     * 
     * The method adds the display view to the list of registered display views.
     * If the display view name is not a non-null string or the component is not a valid function, the method does nothing.
     * 
     * @param {IDatagridDisplayViewMetadata} metadata, the display view meta data
     * @param {typeof DatagridDisplayView} component - The component class to register for the display view.
     * 
     * @returns {void} This function does not return a value.
     */
    static registerDisplayView(metadata: IDatagridDisplayViewMetadata, component: typeof DatagridDisplayView) {
        metadata = Object.assign({}, metadata);
        if (!isNonNullString(metadata.name) || typeof (component) !== "function") return;
        const components = Datagrid.getRegisteredDispayViews2Metadata();
        (components as any)[metadata.name] = { ...metadata, Component: component };
        Reflect.defineMetadata(Datagrid.reflectMetadataKey, components, Datagrid);
    }
    /**
     * Retrieves the registered display views for the Datagrid component.
     * 
     * This method accesses the metadata of the Datagrid class to obtain 
     * the list of registered display views. If no display views are 
     * registered, it returns an empty object.
     * 
     * @returns {Record<IDatagridDisplayViewName, IDatagridDisplayViewMetadata & {Component:typeof DatagridDisplayView}>} 
     * An object mapping display view names to their corresponding component classes and metadata.
     */
    static getRegisteredDispayViews2Metadata(): Record<IDatagridDisplayViewName, IDatagridDisplayViewMetadata & { Component: typeof DatagridDisplayView }> {
        const components = Reflect.getMetadata(Datagrid.reflectMetadataKey, Datagrid);
        return isObj(components) ? components : {} as any;
    }

    /**
     * Compares two values and returns a negative, zero, or positive number to indicate that the first value is less than, equal to, or greater than the second value.
     * 
     * The comparison is done based on the specified column and sort direction. Strings are compared lexicographically, while booleans are compared by converting them to integers.
     * If `ignoreCase` is true, strings are compared in a case-insensitive manner.
     * 
     * @param {DataType} rowDataA - The first row to compare.
     * @param {DataType} rowDataB - The second row to compare.
     * @param {IDatagridStateColumn} column - The column to use for sorting.
     * @param {IResourceQueryOptionsOrderDirection} [sortDirection="asc"] - The direction of the sort. Can be either "asc" or "desc".
     * @param {boolean} [ignoreCase=true] - Whether to ignore case when comparing strings.
     * 
     * @returns {number} A negative, zero, or positive number indicating the result of the comparison.
     */
    compareCellValues(rowDataA: DataType, rowDataB: DataType, column: IDatagridStateColumn, sortDirection: IResourceQueryOptionsOrderDirection = "asc", ignoreCase: boolean = true) {
        const multiplicater = !!(String(sortDirection).toLowerCase().trim() === "desc") ? -1 : 1;
        let a: any = this.computeCellValue(column, rowDataA);
        if (isEmpty(a)) a = "";
        let b: any = this.computeCellValue(column, rowDataB);
        if (isEmpty(b)) b = "";

        const isStringCompare = [typeof a, typeof b].includes("string");
        if (isStringCompare || [typeof a, typeof b].includes("boolean")) {
            // Convert values to strings if necessary
            a = a?.toString() ?? "";
            b = b?.toString() ?? "";

            // Ignore case if specified
            if (ignoreCase !== false) {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }
        }
        return multiplicater * (a < b ? -1 : +(a > b));
    };
    /**
     * Returns the registered display view for the given display view name.
     * 
     * If the display view name is not a non-null string, the method returns the default display view class.
     * If the display view name is not registered, the method returns the default display view class.
     * 
     * @param {IDatagridDisplayViewName} displayView - The name of the display view to retrieve.
     * @returns {typeof DatagridDisplayView} - The registered display view class, or the default display view class if the display view is not registered or the display view name is invalid.
     */
    static getRegisteredDisplayView(displayView: IDatagridDisplayViewName): typeof DatagridDisplayView {
        const d = Datagrid.getRegisteredDisplayView2Metadata(displayView);
        return typeof d.Component == "function" ? d.Component : DatagridDisplayView;
    }
    /**
     * Retrieves the registered display view metadata for the given display view name.
     * 
     * If the display view name is not a non-null string, the method returns an empty object.
     * If the display view name is not registered, the method returns an empty object.
     * 
     * @param {IDatagridDisplayViewName} displayView - The name of the display view to retrieve.
     * @returns {IDatagridDisplayViewMetadata & { Component: typeof DatagridDisplayView }} - An object containing the metadata and the component class of the registered display view, or an empty object if the display view is not registered or the display view name is invalid.
     */
    static getRegisteredDisplayView2Metadata(displayView: IDatagridDisplayViewName): IDatagridDisplayViewMetadata & { Component: typeof DatagridDisplayView } {
        if (!isNonNullString(displayView)) return {} as IDatagridDisplayViewMetadata & { Component: typeof DatagridDisplayView };
        return Object.assign({}, Datagrid.getRegisteredDispayViews2Metadata()[displayView]) as any;
    }

    /**
     * Determines whether the given function is a valid aggregation function for the Datagrid component.
     * 
     * An aggregation function is considered valid if it is a function.
     * 
     * @param {IDatagridAggregationFunction<any>} aggregationFunction - The aggregation function to validate.
     * @returns {aggregationFunction is IDatagridAggregationFunction} Whether the given aggregation function is valid.
     */
    static isValidAggregationFunction(aggregationFunction: IDatagridAggregationFunction<any>): aggregationFunction is IDatagridAggregationFunction {
        return typeof aggregationFunction === "function";
    }

    /**
     * Registers a custom aggregation function for the Datagrid component.
     * 
     * This method adds the specified aggregation function to the list of registered aggregation functions.
     * If the aggregation function name is not a non-null string or the aggregation function is not a valid function, the method does nothing.
     * 
     * @param {keyof IDatagridAggregationFunctions} aggregationFunctionName - The name of the aggregation function to register.
     * @param {IDatagridAggregationFunction} aggregationFunction - The aggregation function to register.
     * 
     * @returns {void} This function does not return a value.
     */
    static registerAggregationFunction(aggregationFunctionName: keyof IDatagridAggregationFunctions, aggregationFunction: IDatagridAggregationFunction) {
        if (!isNonNullString(aggregationFunctionName) || !Datagrid.isValidAggregationFunction(aggregationFunction)) return;
        const aggregationsFunctions = Datagrid.getRegisteredAggregationFunctions();
        (aggregationsFunctions as any)[aggregationFunctionName] = aggregationFunction;
        Reflect.defineMetadata(Datagrid.aggregationFunctionMetadataKey, aggregationsFunctions, Datagrid);
    }
    /**
     * Retrieves the registered aggregation functions for the Datagrid component.
     * 
     * This method accesses the metadata of the Datagrid class to obtain 
     * the list of registered aggregation functions. If no aggregation functions are 
     * registered, it returns an empty object.
     * 
     * @returns {IDatagridAggregationFunctions} 
     * An object mapping aggregation function names to their corresponding functions.
     */

    static getRegisteredAggregationFunctions(): IDatagridAggregationFunctions {
        const aggregationsFunctions = Reflect.getMetadata(Datagrid.aggregationFunctionMetadataKey, Datagrid);
        return isObj(aggregationsFunctions) ? aggregationsFunctions : {} as any;
    }

    static registredColumnsReflectMetadataKey = Symbol("datagrid-registred-columns-reflect-metadata-key");

    /**
     * Registers a column type with its corresponding component in the Datagrid.
     * 
     * This method allows users to add custom column types to the Datagrid by associating a column type name with a component class.
     * If the type is not a non-null string or the component is not a valid function, the method does nothing.
     * 
     * @param {IFieldType} type - The name of the column type to register.
     * @param {typeof DatagridColumn} component - The component class to associate with the column type.
     * 
     * @returns {void} This function does not return a value.
     */
    static registerColumn(type: IFieldType, component: typeof DatagridColumn) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = Datagrid.getRegisteredColumns();
        components[type] = component;
        Reflect.defineMetadata(Datagrid.registredColumnsReflectMetadataKey, components, Datagrid);
    }

    /**
     * Retrieves the registered column types and their associated components.
     * 
     * This method provides access to the list of column types and their associated components that have been registered
     * using the `registerColumn` method. If no column types have been registered, it returns an empty object.
     * 
     * @returns {Record<IFieldType, typeof DatagridColumn>} An object mapping column types to their associated components.
     */
    static getRegisteredColumns(): Record<IFieldType, typeof DatagridColumn> {
        const components = Reflect.getMetadata(Datagrid.registredColumnsReflectMetadataKey, Datagrid);
        return isObj(components) ? components : {} as any;
    }
    /**
     * Retrieves the registered column component for a given column type.
     * 
     * This method returns the component class associated with the given column type. If the type is not a non-null string or
     * the type has not been registered with the `registerColumn` method, it returns the default column component class.
     * 
     * @param {IFieldType} type - The name of the column type to retrieve the component for.
     * 
     * @returns {typeof DatagridColumn} The component class associated with the column type, or the default column component class.
     */
    static getRegisteredColumn(type: IFieldType): typeof DatagridColumn {
        const components = Datagrid.getRegisteredColumns();
        return isNonNullString(type) ? components[type] : DatagridColumn || DatagridColumn;
    }
    /**
     * A loading indicator component for the Datagrid.
     * 
     * This static method renders a custom loading indicator component based on the 
     * current loading state of the Datagrid. It listens for "toggleIsLoading" events 
     * from the Datagrid context to update the loading state. The loading state is 
     * managed internally using React's state and effect hooks.
     * 
     * @param {Object} param - The function parameter.
     * @param {IReactComponent<IDatagridLoadingIndicatorProps>} param.Component - The component to render as the 
     * loading indicator. It receives the `isLoading` prop to determine its display.
     * 
     * @returns {JSX.Element | null} The rendered loading indicator component, or null 
     * if the provided Component is not a function.
     */
    static LoadingIndicator({ Component }: { Component: IReactComponent<IDatagridLoadingIndicatorProps> }) {
        const datagridContext = useDatagrid();
        const canRenderLoadingIndicator = !!datagridContext?.canRenderLoadingIndicator();
        const [isLoading, _setIsLoading] = React.useState(canRenderLoadingIndicator);
        const isMounted = useIsMounted();
        const setIsLoading = (nLoading: boolean) => {
            if (!isMounted() || nLoading == isLoading) return;
            _setIsLoading(nLoading);
        };
        useDatagridOnEvent("toggleIsLoading", (newIsLoading) => {
            setIsLoading(newIsLoading?.isLoading);
        }, false);
        useEffect(() => {
            const loading: boolean = !!datagridContext?.canRenderLoadingIndicator();
            if (loading !== isLoading) {
                setIsLoading(loading);
            }
        }, [datagridContext?.canRenderLoadingIndicator()]);
        return typeof Component !== "function" ? null : <Component isLoading={isLoading} />;
    };
    /**
     * The default loading indicator component for the Datagrid.
     * 
     * This loading indicator uses the {@link Preloader} component to show a loading indicator
     * that covers the entire screen. It listens for "toggleIsLoading" events from the Datagrid
     * context to update the loading state. The loading state is managed internally using
     * React's state and effect hooks.
     * 
     * @param {IDatagridLoadingIndicatorProps} props - The properties for the loading indicator.
     * @param {boolean} props.isLoading - The boolean indicating whether the Datagrid is in a loading state.
     * 
     * @returns {JSX.Element | null} The rendered loading indicator component, or null if the loading
     * indicator is not to be rendered.
     */
    static DefaultLoadingIndicator({ isLoading }: IDatagridLoadingIndicatorProps) {
        const hasShownPreloaderRef = useRef(false);
        useEffect(() => {
            if (isLoading) {
                Preloader.open();
            } else {
                if (hasShownPreloaderRef.current) {
                    Preloader.close();
                }
            }
            (hasShownPreloaderRef as any).current = isLoading;
        }, [!!isLoading]);
        return null;
    }

    /**
     * Renders the loading indicator for the Datagrid component.
     *
     * This function checks if the loading indicator can be rendered, and if so,
     * it returns a `Datagrid.LoadingIndicator` component. The loading indicator
     * to be rendered can be customized via the `loadingIndicator` prop. If the
     * `loadingIndicator` prop is a valid React element, it will be rendered
     * directly. Otherwise, the default loading indicator is rendered.
     *
     * @returns {JSX.Element | null} The loading indicator component if it can be
     * rendered, otherwise null.
     */
    renderLoadingIndicator() {
        if (!this.canRenderLoadingIndicator()) {
            return null;
        }
        const loadingIndicator = this.props.loadingIndicator;
        return <Datagrid.LoadingIndicator
            Component={function ({ isLoading }: IDatagridLoadingIndicatorProps) {
                if (isValidElement(loadingIndicator) && loadingIndicator) {
                    return loadingIndicator;
                }
                return <Datagrid.DefaultLoadingIndicator isLoading={isLoading} />;
            }}
        />;
    }
    /**
     * Renders the actions toolbar component for the Datagrid component.
     *
     * This component renders the actions toolbar with the actions specified
     * in the `actions` or `selectedRowsActions` props. If `selectedRowsActions`
     * is present and there are selected rows, it will be used instead of the
     * `actions` prop. The title of the toolbar is automatically set to
     * the number of selected rows, or an empty string if there are no selected
     * rows.
     *
     * @returns {JSX.Element | null} The actions toolbar component if the
     * `renderActionsToolbar` prop is true, otherwise null.
     */
    static Actions() {
        const datagridContext = useDatagrid();
        const { selectedRowsActions, actions, renderActionsToolbar, actionsToolbarProps, ...props } = Object.assign({}, datagridContext?.props);
        useDatagridOnEvent(["toggleAllRowsSelection"], undefined, true);
        const { actions: actionsToDisplay, title } = useMemo(() => {
            if (!datagridContext) return {
                actions: [],
                title: ""
            };
            const count = defaultNumber(datagridContext?.getSelectedRowsCount());
            const actionsOrCallback = count > 0 ? selectedRowsActions : actions;
            const _actions = typeof actionsOrCallback === "function" ? actionsOrCallback(datagridContext) : actionsOrCallback;
            const suffix = count > 1 ? "s" : "";
            return { actions: Array.isArray(_actions) ? _actions : [], title: count ? count.formatNumber() + suffix : "" };
        }, [datagridContext?.getSelectedRowsCount()]);
        if (!renderActionsToolbar) return null;
        const testID = datagridContext?.getTestID();
        return <View testID={testID + "-actions-container"} style={[styles.actionsToolbar]}>
            <AppBar testID={`${testID}-actions`}
                backAction={false}
                backgroundColor='transparent' {...Object.assign({}, actionsToolbarProps)}
                title={title || i18n.t("components.datagrid.actions")} actions={actionsToDisplay as any}
            />
            <Divider testID={testID + "-actions-divider"} />
        </View>
    }
}
/**
 * Specifies the type of rendering for the column.
 *
 * This prop determines whether the column should render as a **cell** or a **header** in the datagrid.
 * It allows developers to control the visual representation of the column based on its role in the table.
 *
 * @type {"rowCell" | "header"}
 * @example
 * // Render a column as a header
 * <DatagridColumn renderType="header" value="ID" />
 *
 * @example
 * // Render a column as a cell
 * <DatagridColumn renderType="rowCell" value={row.id} />
 *
 * @remarks
 * - Use `"header"` when the column represents a table header (e.g., column titles).
 * - Use `"rowCell"` when the column represents a table cell (e.g., row data).
 *
 * @default "rowCell"
 */
export type IDatagridColumnRenderType = "header" | "rowCell";


function DatagridRendered<DataType extends IDatagridDataType = any>(options: { context: Datagrid<DataType> }) {
    const { context } = options;
    const { width: screenWidth, height: screenHeight } = useDimensions();
    const displayView = context.getDisplayView();
    const testID = context.getTestID();
    const props = context.props;
    const Component = useMemo<typeof DatagridDisplayView<DataType>>(() => {
        return Datagrid.getRegisteredDisplayView(displayView);
    }, [displayView]);
    const { width: containerWidth } = context.getContainerLayout();
    const visibleColumns = context.getVisibleColumns();
    // Calculate column widths
    const visibleColumnsWidths = useMemo(() => {
        const availableWidth = Math.min(containerWidth, screenWidth);
        if (availableWidth <= 0) return {} as Record<string, number>;
        const visibleColumnsWidths: Record<string, number> = {};
        const remainingColumns: string[] = [];
        let remainingWidth = availableWidth;

        // First pass: calculate fixed widths
        visibleColumns.forEach((column) => {
            if (isNumber(column.width) && column.width) {
                visibleColumnsWidths[column.name] = column.width;
                remainingWidth -= column.width;
            } else {
                remainingColumns.push(column.name);
            }
        });

        // Second pass: calculate flex-based widths
        if (remainingColumns.length && remainingWidth > 0) {
            const equalSize = remainingWidth / remainingColumns.length;
            remainingColumns.forEach((columnName) => {
                visibleColumnsWidths[columnName] = equalSize;
            });
        }
        return visibleColumnsWidths;
    }, [visibleColumns, containerWidth, screenWidth]);
    const isLoading = context.isLoading();
    return (
        <DatagridContext.Provider value={context}>
            <View testID={testID} style={[styles.main, isLoading && styles.disabled, props.style]} onLayout={context.onContainerLayout.bind(context)}>
                {context.renderLoadingIndicator()}
                {<Datagrid.Actions />}
                {/* View switcher */}
                <ScrollView testID={testID + "-horizontal-header-scrollview"} horizontal style={styles.viewSwitcher}>

                </ScrollView>
                {Component ? <Component visibleColumnsWidths={visibleColumnsWidths} datagridContext={context} /> : <Label colorScheme="error" fontSize={20} textBold>
                    {"No display view found for datagrid"}
                </Label>}
            </View>
        </DatagridContext.Provider>
    );
}
DatagridRendered.displayName = "Datagrid.Rendered";


/**
 * A base class for Datagrid columns.
 * 
 * This class provides a basic implementation for a Datagrid column, and can be extended to create custom columns.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * @template PropExtensions - The type of the component's props. This type is used to extend the component's props with additional properties.
 * @template StateType - The type of the component's state.
 */
class DatagridColumn<DataType extends IDatagridDataType = any, PropExtensions = unknown, StateType = unknown> extends Component<IDatagridStateColumn<DataType> & { rowData?: DataType, renderType?: IDatagridColumnRenderType, datagridContext: Datagrid<DataType> } & PropExtensions, StateType> {
    /**
     * Returns the Datagrid context.
     * 
     * This method provides access to the Datagrid component's state and methods.
     * 
     * @returns The Datagrid context.
     */
    getDatagridContext() {
        return this.props.datagridContext;
    }
    /**
     * Returns the name of the column.
     * 
     * This method returns the name of the column, or an empty string if no name is provided.
     * 
     * @returns The name of the column.
     */
    getName() {
        return defaultStr(this.props.name);
    }
    /**
     * Checks if the column is groupable.
     * 
     * This method checks if the column is groupable by calling the Datagrid context's isGroupable method.
     * 
     * @returns True if the column is groupable, false otherwise.
     */
    isGroupable() {
        return this.getDatagridContext().isGroupable();
    }
    /**
     * Checks if the column is filtrable.
     * 
     * This method checks if the column is filtrable by calling the Datagrid context's isFiltrable method.
     * 
     * @returns True if the column is filtrable, false otherwise.
     */
    isFiltrable() {
        return this.getDatagridContext().isFiltrable();
    }
    /**
     * Checks if the column is sortable.
     * 
     * This method checks if the column is sortable by calling the Datagrid context's isSortable method.
     * 
     * @returns True if the column is sortable, false otherwise.
     */
    isSortable() {
        return this.getDatagridContext().isSortable();
    }
    /**
     * Checks if the column is aggregatable.
     * 
     * This method checks if the column is aggregatable by calling the Datagrid context's isAggregatable method.
     * 
     * @returns True if the column is aggregatable, false otherwise.
     */
    isAggregatable() {
        return this.getDatagridContext().isAggregatable();
    }
    /**
     * Computes the value of a row cell based on the provided row data and format.
     * 
     * This method computes the value of the column based on the provided row data and format.
     * 
     * @param rowData The row data to compute the value for.
     * @param format Whether to format the value.
     * @returns The computed value of the row cell.
     */
    computeCellValue(rowData: DataType, format: boolean = false) {
        if (!this.isRowCell()) return null;
        return this.getDatagridContext().computeCellValue(this.props.name, rowData, format);
    }
    /**
     * Returns a state column definition by name.
     * 
     * This method returns the column definition from the Datagrid context.
     * 
     * @param colName The name of the column to retrieve. If not provided, it defaults to the current column's name.
     * @returns The column definition.
     */
    getColumn(colName?: string): IDatagridStateColumn<DataType> {
        return this.getDatagridContext().getColumn(defaultStr(colName, this.getName()));
    }
    /**
     * Returns the list of statecolumns.
     * 
     * This method returns the list of columns from the Datagrid context.
     * 
     * @returns The list of columns.
     */
    getColumns(): IDatagridStateColumn<DataType>[] {
        const columns = this.getDatagridContext().state.columns;
        return Array.isArray(columns) ? columns : [];
    }
    /**
     * Returns the list of visible state columns.
     * 
     * This method returns the list of visible columns from the Datagrid context.
     * 
     * @returns The list of visible columns.
     */
    getVisibleColumns(): IDatagridStateColumn<DataType>[] {
        const columns = this.getDatagridContext().state.visibleColumns;
        return Array.isArray(columns) ? columns : [];
    }
    /**
     * Checks if the column is the first column.
     * 
     * This method checks if the column is the first column by comparing its name to the name of the first column.
     * 
     * @returns True if the column is the first column, false otherwise.
     */
    isFirstColumn() {
        return this.getColumns()[0]?.name === this.getName();
    }
    /**
     * Checks if the column is the last column.
     * 
     * This method checks if the column is the last column by comparing its name to the name of the last column.
     * 
     * @returns True if the column is the last column, false otherwise.
     */
    isLastColumn() {
        const columns = this.getColumns();
        return columns?.length && columns[columns.length - 1]?.name === this.getName();
    }
    /**
     * Checks if the column is the first visible column.
     * 
     * This method checks if the column is the first visible column by comparing its name to the name of the first visible column.
     * 
     * @returns True if the column is the first visible column, false otherwise.
     */
    isFirstVisibleColumn() {
        const columns = this.getVisibleColumns();
        return columns?.length && columns[0]?.name === this.getName();
    }
    /**
     * Checks if the column is the last visible column.
     * 
     * This method checks if the column is the last visible column by comparing its name to the name of the last visible column.
     * 
     * @returns True if the column is the last visible column, false otherwise.
     */
    isLastVisibleColumn() {
        const columns = this.getVisibleColumns();
        return columns?.length && columns[columns.length - 1]?.name === this.getName();
    }
    /**
     * Checks if the column is a header.
     * 
     * This method checks if the column is a header by checking its render type.
     * 
     * @returns True if the column is a header, false otherwise.
     */
    isHeader() {
        return this.props.renderType === "header";
    }
    /**
     * Checks if the column is a row cell.
     * 
     * This method checks if the column is a row cell by checking its render type and row data.
     * 
     * @returns True if the column is a row cell, false otherwise.
     */
    isRowCell() {
        return this.props.renderType === "rowCell" && isObj(this.props.rowData);
    }
    /**
     * Renders the column as a row cell.
     * 
     * This method renders the column as a row cell, using the provided row data and label props.
     * 
     * @returns The rendered column.
     */
    protected renderRowCell(): React.ReactNode {
        const { labelProps, rowData } = this.props;
        if (!rowData || !this.isRowCell()) {
            return null;
        }
        const column = this.getColumn();
        if (!this.isValidColumn(column)) return null;
        if (typeof this.props.renderRowCell == "function") {
            const datagridContext = this.getDatagridContext();
            return this.props.renderRowCell(datagridContext.getCallOptions({ column, rowData: rowData }));
        }
        return <Label {...labelProps} >{this.computeCellValue(rowData as DataType)}</Label>;
    }

    /**
     * Checks if the column is a valid column.
     * 
     * This method checks if the column is a valid column by checking its name and whether it is an object.
     * 
     * @param {IDatagridStateColumn<DataType>} column - The column to check.
     * 
     * @returns {column is IDatagridStateColumn<DataType>} True if the column is a valid column, false otherwise.
     */
    isValidColumn(column: IDatagridStateColumn<DataType>): column is IDatagridStateColumn<DataType> {
        return this.getDatagridContext().isValidColumn(column);
    }
    /**
     * Renders the column as a header.
     * 
     * This method renders the column as a header, using the provided label props.
     * 
     * @returns The rendered column.
     */
    protected renderHeader(): React.ReactNode {
        const { labelProps, rowData } = this.props;
        const column = this.getColumn();
        if (!this.isValidColumn(column)) return null;
        if (typeof this.props.renderHeader == "function") {
            const datagridContext = this.getDatagridContext();
            return this.props.renderHeader(datagridContext.getCallOptions({ column }));
        }
        const testId = this.getDatagridContext().getTestID() + "-column-" + column.name;
        const sortIcon = this.getSortIcon();
        return <View style={styles.headerWrapper} testID={testId + "-wrapper"}>
            <View testID={testId + "-container"} style={[styles.headerContainer]}>
                <Label testID={testId} {...labelProps} >{this.props.label}</Label>
                {sortIcon ? <FontIcon testID={testId + "-sort-icon"} color={Theme.colors.primary} size={25} name={sortIcon} onPress={(event) => { this.sort(); }} /> : null}
            </View>;
        </View>
    }
    /**
     * Retrieves the type of the field for the column.
     * 
     * This method returns the type of the field associated with the column, defaulting to "text"
     * if no specific type is provided. The type is derived from the column's properties and ensures
     * type safety by casting to `IFieldType`.
     * 
     * @returns {IFieldType} The type of the field for the column, defaulting to "text".
     */
    getType(): IFieldType {
        return defaultStr(this.props.type, "text") as IFieldType;
    }

    /**
     * Retrieves the sort icon for the column, based on the column's type and sort direction.
     * 
     * This method returns the sort icon for the column, based on the column's type and sort direction.
     * If the column is not sortable, it returns null.
     * 
     * @returns {IFontIconName | null} The sort icon for the column.
     */
    getSortIcon(): IFontIconName | null {
        if (!this.isSortable()) return null;
        const orderBy = this.getDatagridContext()?.state?.orderBy;
        let sortDirection: IResourceQueryOptionsOrderDirection | undefined;
        if (Array.isArray(orderBy) && orderBy.length > 0) {
            for (const ob of orderBy) {
                if (!isObj(ob)) continue;
                const [field, direction] = Object.entries(ob)[0];
                if (field == this.getName()) {
                    sortDirection = direction as any;
                    break;
                }
            }
        }
        if (sortDirection) {
            const isDesc = String(sortDirection).toLowerCase().trim() === "desc";
            const sortType = defaultStr(this.getType()).toLowerCase();
            let sortIcon: IFontIconName | null = null;
            switch (sortType) {
                case "number":
                    sortIcon = isDesc ? "sort-numeric-descending" : "sort-numeric-ascending";
                    break;
                case "decimal":
                    sortIcon = isDesc ? "sort-numeric-descending" : "sort-numeric-ascending";
                    break;
                case "boolean":
                    sortIcon = isDesc ? "sort-bool-descending" : "sort-bool-ascending";
                    break;
                case "date":
                    sortIcon = isDesc ? "sort-calendar-descending" : "sort-calendar-ascending";
                    break;
                case "datetime":
                    sortIcon = isDesc ? "sort-calendar-descending" : "sort-calendar-ascending";
                    break;
                case "time":
                    sortIcon = isDesc ? "sort-clock-descending" : "sort-clock-ascending";
                    break;
                default:
                    sortIcon = isDesc ? "sort-alphabetical-descending" : "sort-alphabetical-ascending";
                    break;
            }
            return sortIcon;
        }
        return null;
    }
    /**
     * Initiates sorting on the column if it is a header.
     * 
     * This method checks if the column is a header and, if so, triggers the sorting functionality
     * for the column using the Datagrid context. The sorting is performed based on the column's name.
     */
    sort() {
        if (!this.isHeader()) return;
        return this.getDatagridContext().sortColumn(this.getName());
    }
    /**
     * Renders the column.
     * 
     * This method renders the column, either as a row cell or a header, depending on its render type.
     * 
     * @returns The rendered column.
     */
    render() {
        return this.isRowCell() ? this.renderRowCell() : this.renderHeader();
    }
}



/**
 * A decorator to attach a column to the Datagrid component.
 * 
 * This decorator registers the column with the Datagrid component, making it available for use.
 * 
 * @param type The type of the column to attach.
 * @returns A decorator function that registers the column.
 */
export function AttachDatagridColumn(type: IFieldType) {
    return (target: typeof DatagridColumn) => {
        /**
         * Registers the column with the Datagrid component.
         * 
         * This method adds the column to the Datagrid component's registry, making it available for use.
         */
        Datagrid.registerColumn(type, target as typeof DatagridColumn);
    };
}
export interface IDatagridDisplayViewMetadata {
    /***
     * The name of the display view.
     */
    name: IDatagridDisplayViewName;
    /***
     * The label of the display view.
     */
    label: string;
    /**
     * The icon of the display view.
     */
    icon?: IIconSource;

    /**
     * @property {string} optimizedFor - Specifies the screen size or device type for which this display view is optimized.
     *
     * This property determines the target screen size or condition under which the current view should be rendered.
     * It ensures that the layout, styling, and behavior of the component are tailored to provide the best user experience
     * for the specified screen size or device type.
     *
     * ### Supported Values:
     * - `"mobile"`: Optimized for small screens, @see {@link {IBreakpoint}} for more information about mobile breakpoints.
     * - `"tablet"`: Optimized for medium-sized screens, Suitable for tablet.
     * - `"desktop"`: Optimized for large screens, typically wider than 1024px. Designed for desktop and laptop devices.
     * ### Notes:
     * - Ensure that the value provided matches one of the predefined options to avoid unexpected behavior.
     * - This property works in conjunction with responsive design principles to dynamically adjust the UI based on the user's device.
     *
     * @default ["mobile","tablet","desktop"]
     */
    optimizedFor?: ("mobile" | "tablet" | "desktop")[];
}
/**
 * A decorator to attach a display view to the Datagrid component.
 * 
 * This decorator registers the display view with the Datagrid component, making it available for use.
 * 
 * @param {IDatagridDisplayViewMetadata}, the display view meta data
 * @returns A decorator function that registers the display view.
 */
export function AttachDatagridDisplayView(metadata: IDatagridDisplayViewMetadata) {
    return (target: typeof DatagridDisplayView) => {
        Datagrid.registerDisplayView(metadata, target as typeof DatagridDisplayView);
    };
}

/**
 * @typedef IDatagridDisplayView
 * A base class for Datagrid display views.
 * 
 * This class provides a set of methods for accessing the Datagrid context and rendering data.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * @template PropType - The type of the component's props.
 * @template StateType - The type of the component's state.
 * @template EventType - The type of the component's events.
 * @see {@link IDatagridDisplayViewName} for more information about display view names.
 * @see {@link IDatagridDisplayViewMap} for more information about display view maps.
 * @see {@link IDatagridCallOptions} for more information about call options.
 */
class DatagridDisplayView<DataType extends IDatagridDataType = any, PropType = unknown, StateType extends object = any, EventType extends string = any> extends ObservableComponent<PropType & { datagridContext: Datagrid<DataType>, visibleColumnsWidths: Record<string, number> }, StateType, EventType> {
    /**
     * Retrieves the datagrid context associated with this display view.
     * 
     * This method provides access to the datagrid context, allowing the display view 
     * to interact with the datagrid's state, methods, and properties.
     * 
     * @returns {Datagrid<DataType>} The datagrid context for the current display view.
     */
    getDatagridContext() {
        return this.props.datagridContext;
    }
    /**
     * Retrieves the list of visible columns for the current display view.
     * 
     * This method accesses the datagrid context to obtain the list of columns that are currently visible. 
     * It is useful for determining which columns should be displayed based on the current state of the datagrid.
     * 
     * @returns {IDatagridStateColumn<DataType>[]} An array of visible column definitions.
     */
    getVisibleColumns() {
        return this.getDatagridContext().getVisibleColumns();
    }

    /**
     * Retrieves the list of all columns in the datagrid.
     * 
     * This method provides access to the complete list of columns in the datagrid, including hidden columns.
     * It is useful for determining the structure of the data displayed in the datagrid.
     * 
     * @returns {IDatagridStateColumn<DataType>[]} An array of all column definitions.
     */
    getColumns() {
        return this.getDatagridContext().getColumns();
    }
    /**
     * Retrieves the list of all columns in the datagrid.
     * 
     * This method provides access to the complete list of columns in the datagrid, including hidden columns.
     * It is useful for determining the structure of the data displayed in the datagrid.
     * 
     * @returns {IDatagridStateColumn<DataType>[]} An array of all column definitions.
     */
    getGroupableColumns() {
        return this.getDatagridContext().getGroupableColumns();
    }

    /**
     * Returns an object containing the aggregated values for all columns in the grid.
     * 
     * The object returned by this method is a record of aggregated values, where each key is the column name and each value is an object containing the aggregated values for that column.
     * 
     * @returns {Record<string, Record<keyof IDatagridAggregationFunctions, number>>} An object containing the aggregated values for all columns in the grid.
     */
    getAggregatedColumnsValues(): Record<string, Record<keyof IDatagridAggregationFunctions, number>> {
        const o = this.getDatagridContext().state.aggregatedColumnsValues;
        return isObj(o) ? o : {};
    }

    /**
     * Retrieves the aggregated values for a specific column.
     * 
     * This method returns an object containing the aggregated values for the specified column name.
     * The object includes various aggregation metrics as defined by the `IDatagridAggregationFunctions`.
     * 
     * @param {string} columnName - The name of the column for which to retrieve aggregated values.
     * 
     * @returns {Record<keyof IDatagridAggregationFunctions, number>} An object containing the aggregated values for the specified column. If the column does not exist or the name is invalid, an empty object is returned.
     */
    getAggregatedColumnValues(columnName: string): Record<keyof IDatagridAggregationFunctions, number> {
        if (!isNonNullString(columnName)) return {} as Record<keyof IDatagridAggregationFunctions, number>;
        const o = this.getAggregatedColumnsValues();
        return isObj(o) && isObj(o[columnName]) ? o[columnName] : {} as Record<keyof IDatagridAggregationFunctions, number>;
    }

    /**
     * Returns the data to be displayed in the grid.
     * 
     * This method returns the data from the Datagrid context's state.
     * 
     * @returns The data to be displayed in the grid.
     */
    getData(): IDatagridStateData<DataType> {
        const d = this.getDatagridContext().state.data;
        return Array.isArray(d) ? d : [];
    }

    /**
     * Returns the entire dataset, including all rows and columns.
     * 
     * This method returns the data from the Datagrid context's state.
     * 
     * @returns The entire dataset.
     */
    getAllData(): DataType[] {
        const d = this.getDatagridContext().state.allData;
        return Array.isArray(d) ? d : [];
    }

    /**
     * Returns the paginated data in the grid.
     * 
     * This method returns the data from the Datagrid context's state.
     * 
     * @returns The paginated data.
     */
    getPaginatedData(): DataType[] {
        const d = this.getDatagridContext().state.paginatedData;
        return Array.isArray(d) ? d : [];
    }

    /**
     * Returns a column definition by name.
     * 
     * This method returns the column definition from the Datagrid context.
     * 
     * @param columnName The name of the column to retrieve.
     * @returns The column definition.
     */
    getColumn(columnName: string) {
        return this.getDatagridContext().getColumn(columnName);
    }

    /**
     * Checks if a row is a grouped row.
     * 
     * This method checks if the row is a grouped row by calling the Datagrid context's isGroupedRow method.
     * 
     * @param rowData The row data to check.
     * @returns Whether the row is a grouped row.
     */
    isGroupedRow(rowData: IDatagridGroupedRow | DataType): rowData is IDatagridGroupedRow {
        return !!this.getDatagridContext().isGroupedRow(rowData);
    }

    /**
     * Renders a grouped row.
     * 
     * This method is called when a grouped row is encountered.
     * 
     * @param rowData The row data to render.
     * @returns The rendered grouped row.
     */
    renderGroupedRow(rowData: IDatagridGroupedRow) {
        return null;
    }
    /**
     * Retrieves the test identifier for the current Datagrid display view.
     * 
     * This method returns the test ID from the Datagrid context if available.
     * If the test ID is not specified, it defaults to "resk-datagrid".
     * 
     * @returns {string} The test ID for the Datagrid display view.
     */
    getTestID() {
        return defaultStr(this.getDatagridContext().getTestID(), "resk-datagrid");
    }
    /**
     * Retrieves the key for the given row data.
     * 
     * This method delegates to the Datagrid context's `getRowKey` method.
     * 
     * @param {DataType} rowData - The row data for which to retrieve the key.
     * 
     * @returns {string} - The key for the row data.
     */

    getRowKey(rowData: DataType) {
        return this.getDatagridContext().getRowKey(rowData);
    }
    /**
     * Retrieves the grouped row header text from the given row data.
     * 
     * This method delegates to the Datagrid context's `getGroupedRowHeader` method.
     * 
     * @param {DataType} rowData - The row data to use for computing the grouped row header.
     * 
     * @returns {string} - The grouped row header text.
     */

    getGroupedRowHeader(rowData: DataType) {
        return this.getDatagridContext().getGroupedRowHeader(rowData);
    }
    /**
     * Returns the separator used for grouping row headers.
     * 
     * The separator is used to separate the column values in the grouped row header.
     * 
     * If not specified, the default value is a comma (`,`).
     * 
     * @returns {string} - The separator used for grouping row headers.
     */
    getGroupedRowHeaderSeparator() {
        return this.getDatagridContext().getGroupedRowHeaderSeparator();
    }

    /**
     * Renders a column as either a row cell or header.
     * 
     * This method renders a column as a row cell or header, depending on the value of `renderType`.
     * 
     * If `renderType` is `"rowCell"`, the column is rendered as a row cell and the `rowData` prop is required.
     * 
     * If `renderType` is `"header"`, the column is rendered as a header and the `rowData` prop is ignored.
     * 
     * This method will return null if the column is not found or if the `rowData` prop is not an object.
     * 
     * @param {string} columnName - The name of the column.
     * @param {IDatagridColumnRenderType} [renderType="rowCell"] - The type of rendering for the column.
     * @param {IDatagridGroupedRow | DataType} [rowData] - The row data to use for rendering the column as a row cell.
     * 
     * @returns {React.ReactNode} - The rendered column.
     */
    protected renderRowCellOrHeader(columnName: string, renderType: IDatagridColumnRenderType = "rowCell", rowData?: IDatagridGroupedRow | DataType) {
        const datagridContext = this.getDatagridContext();
        if (!datagridContext) return null;
        const column = this.getColumn(columnName);
        if (!column || renderType === "rowCell" && !isObj(rowData)) return null;
        const columnType = defaultStr(column?.type, "text");
        const Component = Datagrid.getRegisteredColumn(columnType as IFieldType);
        const testId = datagridContext.getTestID();
        const isRowCell = renderType === "rowCell" && isObj(rowData);
        if (renderType === "rowCell" && !isRowCell) return null;
        if (rowData && this.isGroupedRow(rowData)) {
            return this.renderGroupedRow(rowData);
        }
        const rowKey = isRowCell ? datagridContext.getRowKey(rowData as DataType) : "";
        return <Component<DataType>
            {...column}
            renderType={renderType}
            datagridContext={datagridContext}
            testID={`${testId}-column-${columnName}`}
            key={`${testId}-cell-${columnName}-${rowKey}`}
        />;
    }
    /**
     * Renders a cell in the grid for a given column and row data.
     * 
     * @param columnName - The name of the column to render the cell for.
     * @param rowData - The data for the row, which can be either a grouped row or a regular data row.
     * 
     * @returns The rendered cell component, or null if the row data is invalid or the column does not exist.
     * 
     * If the row data is a grouped row, it delegates rendering to `renderGroupedRow`. Otherwise, it renders a regular `DatagridCell`.
     */

    renderRowCell(columnName: string, rowData: IDatagridGroupedRow | DataType) {
        if (!isObj(rowData) || !this.getColumn(columnName)) return null;
        if (this.isGroupedRow(rowData)) {
            return this.renderGroupedRow(rowData);
        }
        return this.renderRowCellOrHeader(columnName, "rowCell", rowData);
    }
    /**
     * Renders a header cell in the grid for a given column.
     * 
     * This method is called when the component needs to render a header cell for a given column.
     * 
     * It delegates rendering to `renderRowCellOrHeader`, passing `"header"` as the render type.
     * 
     * @param columnName - The name of the column to render the header cell for.
     * 
     * @returns The rendered header cell component, or null if the column does not exist.
     */

    renderHeader(columnName: string) {
        return this.renderRowCellOrHeader(columnName, "header");
    }
    /**
     * Retrieves the keys of the currently selected rows.
     *
     * @returns {string[]} An array of strings representing the keys of the selected rows.
     */
    getSelectedRowsKeys() {
        return this.getDatagridContext().getSelectedRowsKeys();
    }

    /**
     * Retrieves the number of selected rows.
     *
     * @returns {number} The number of selected rows.
     */
    getSelectedRowsCount() {
        return this.getDatagridContext().getSelectedRowsCount();
    }
    /**
     * Retrieves the currently selected rows.
     *
     * @returns {DataType[]} An array of objects representing the currently selected rows.
     */
    getSelectedRows() {
        return this.getDatagridContext().getSelectedRows();
    }
    /**
     * Checks if a row is selected.
     * 
     * This method checks if a given row is selected in the grid.
     * 
     * @param rowData - The row data to check.
     * 
     * @returns Whether the row is selected.
     * 
     * @remarks
     * It delegates the check to the Datagrid context's isRowSelected method.
     */
    isRowSelected(rowData: DataType) {
        return this.getDatagridContext().isRowSelected(rowData);
    }

    /**
     * Toggles the selection state of a row in the Datagrid.
     * 
     * This method is a pass-through to the Datagrid context's toggleRowSelection method.
     * It takes a row data object as a parameter and checks if the row is selectable by calling the `isRowSelectable` method.
     * If the row is not selectable, the method does nothing.
     * Otherwise, it checks if the row is already selected by calling the `isRowSelected` method.
     * If the row is selected, it removes the row key from the set of selected row keys and triggers the "rowUnselected" event.
     * Otherwise, it adds the row key to the set of selected row keys and triggers the "rowSelected" event.
     * Finally, it triggers the "toggleRowSelection" event with the updated selection state.
     * 
     * @param {DataType} rowData - The data of the row to toggle selection for.
     * @param {boolean} trigger - Optional flag to trigger the row selection changed event. Defaults to true.
     */
    toggleRowSelection(rowData: DataType, trigger: boolean = true) {
        return this.getDatagridContext().toggleRowSelection(rowData, true);
    }
    /**
     * Toggles the selection state of all rows in the Datagrid.
     * 
     * This method is a pass-through to the Datagrid context's toggleAllRowsSelection method.
     * It takes an optional boolean parameter `selectOrUnselectAll` to determine if all rows should be selected.
     * If `selectOrUnselectAll` is `undefined`, the method will toggle the selection state of all rows.
     * If `selectOrUnselectAll` is `true`, all rows will be selected.
     * If `selectOrUnselectAll` is `false`, all rows will be unselected.
     * The method will also trigger the "toggleAllRowsSelection" event with the updated selection state if the `trigger` parameter is not set to `false`.
     * 
     * @param {boolean} [selectOrUnselectAll] - Optional flag to select all rows. Defaults to `undefined`.
     * @param {boolean} [trigger] - Optional flag to trigger the "toggleAllRowsSelection" event. Defaults to `true`.
     */
    toggleAllRowsSelection(selectOrUnselectAll?: boolean, trigger: boolean = true) {
        return this.getDatagridContext().toggleAllRowsSelection(selectOrUnselectAll, trigger);
    }

    /**
     * Checks if a row is selectable.
     * 
     * This method checks if the given row is selectable by delegating the check to the Datagrid context's isRowSelectable method.
     * 
     * @param {DataType | IDatagridGroupedRow} rowData - The data of the row to check selection status for.
     * 
     * @returns {boolean} - Whether the row is selectable.
     */
    isRowSelectable(rowData: DataType | IDatagridGroupedRow) {
        return this.getDatagridContext().isRowSelectable(rowData);
    }
    /**
     * Checks if the Datagrid is currently loading data.
     * 
     * This method is a pass-through to the Datagrid context's isLoading method.
     * It returns a boolean indicating whether the Datagrid is currently loading data.
     * 
     * @returns {boolean} - Whether the Datagrid is currently loading data.
     */
    isLoading() {
        return this.getDatagridContext().isLoading();
    }

    /**
     * Checks if the loading indicator can be rendered.
     * 
     * This method is a pass-through to the Datagrid context's canRenderLoadingIndicator method.
     * It returns a boolean indicating whether the loading indicator can be rendered.
     * The loading indicator can be rendered if the Datagrid is in a loading state,
     * either due to the `isLoading` prop or the internal `_isLoading` state.
     * 
     * @returns {boolean} - Whether the loading indicator can be rendered.
     */
    canRenderLoadingIndicator() {
        return this.getDatagridContext().canRenderLoadingIndicator();
    }
    /**
     * Sets the loading state of the Datagrid and triggers the "toggleIsLoading" event.
     * 
     * This method is a pass-through to the Datagrid context's setIsLoading method.
     * It takes three parameters: `loading`, `cb`, and `timeout`.
     * The `loading` parameter is a boolean indicating whether the Datagrid should be in a loading state.
     * The `cb` parameter is an optional callback function to be called after the loading state has been toggled.
     * The `timeout` parameter is an optional number indicating the time in milliseconds to wait before calling the callback function.
     * If `timeout` is not provided, the default timeout of 500 milliseconds is used.
     * The callback function is called with the `isLoading` state as an argument.
     * The method returns the `isLoading` state of the Datagrid.
     * 
     * @param {boolean} loading - The loading state to set the Datagrid to.
     * @param {Function} [cb] - An optional callback function to be called after the loading state has been toggled.
     * @param {number} [timeout] - An optional number indicating the time in milliseconds to wait before calling the callback function.
     * @returns {boolean} The loading state of the Datagrid.
     */
    setIsLoading(loading: boolean, cb?: Function, timeout?: number) {
        this.getDatagridContext().setIsLoading(loading, cb, timeout);
    }
    /**
     * Renders the component.
     * 
     * This method is called when the component is rendered.
     * 
     * @returns The rendered component.
     */
    render() {
        return <Label>
            No display view found for datagrid
        </Label>;
    }
}

/**
 * Represents the options for a Datagrid call.
 * 
 * @template DataType - The type of the data displayed in the grid.
 */
export interface IDatagridCallOptions<DataType extends IDatagridDataType = any> {
    /**
     * The Datagrid context.
     * 
     * This property provides access to the Datagrid component's state and methods.
     */
    datagridContext: Datagrid<DataType>;
}
/**
 * @typedef IDatagridProps
 * Represents the properties for the `Datagrid` component.
 * 
 * @template DataType - The type of the data displayed in the grid.
 */
export interface IDatagridProps<DataType extends IDatagridDataType = any> {
    /**
     * The data to display in the grid.
     * 
     * This property is required and must be an array of objects.
     */
    data: DataType[];

    /**
     * Whether sorting is enabled for the grid.
     * 
     * If true, the grid allows sorting of columns.
     */
    sortable?: boolean;

    /**
     * Whether filtering is enabled for the grid.
     * 
     * If true, the grid allows filtering of rows.
     */
    filterable?: boolean;

    /**
     * A function to filter rows internally.
     * 
     * This property is used to filter rows based on custom logic.
     * 
     * @param rowData The data for the row.
     * @param rowIndex The index of the row.
     * @returns Whether the row should be included in the grid.
     */
    localFilter?: (rowData: DataType, rowIndex: number) => boolean;

    /**
     * Whether aggregation is enabled for the grid.
     * 
     * If true, the grid allows aggregation of columns.
     */
    aggregatable?: boolean;

    /**
     * Whether grouping is enabled for the grid.
     * 
     * If true, the grid allows grouping of rows.
     */
    groupable?: boolean;

    /**
     * The style to apply to the grid container.
     * 
     * This property is used to customize the appearance of the grid.
     */
    style?: ViewProps["style"];

    /**
     * A unique identifier for the grid.
     * 
     * This property is used for testing purposes.
     */
    testID?: string;

    /**
     * The name of the columns that will be used to group the data.
     * 
     * This property is used to specify the columns that should be used for grouping.
     */
    groupedColumns?: string[];

    /**
     * The columns to display in the grid.
     * 
     * This property is required and must be an array of column objects.
     */
    columns: IDatagridColumnProps<DataType>[];

    /**
     * The display view to use for the grid.
     * 
     * This property is used to specify the display view that should be used for the grid.
     * 
     * @see {@link IDatagridDisplayViewName} for more information about display view names.
     */
    displayView?: IDatagridDisplayViewName;

    /**
     * The order by configuration for the grid.
     * 
     * This property is used to specify the order by configuration for the grid.
     * 
     * @see {@link IDatagridOrderBy} for more information about order by configurations.
     */
    orderBy?: IDatagridOrderBy<DataType>;

    /**
     * A function to get the key for a row.
     * 
     * This property is used to specify a custom function for getting the key for a row.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns The key for the row.
     */
    getRowKey?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => string | number;

    /**
     * The key or keys to use for the row.
     * 
     * This property is used to specify the key or keys that should be used for the row.
     */
    rowKey?: (keyof DataType) | (keyof DataType)[];

    /**
     * A function to determine whether a row is selectable.
     * 
     * This property is used to specify a custom function for determining whether a row is selectable.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns Whether the row is selectable.
     */
    isRowSelectable?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => boolean;

    /**
     * A string to be used as a separator between group header and group rows.
     * 
     * This property is used to specify a custom separator for group headers and rows.
     */
    groupedRowHeaderSeparator?: string;

    /**
     * Whether to prefix each row group header by the label of the current grouped column.
     * 
     * This property is used to specify whether to prefix each row group header by the label of the current grouped column.
     * 
     * Default is true.
     */
    includeColumnLabelInGroupedRowHeader?: boolean;

    /**
     * A function to mutate the row data.
     * 
     * This property is used to specify a custom function for mutating the row data.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns The mutated row data.
     */
    rowDataMutator?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => DataType;

    /**
     * A list of display views to be displayed in the datagrid.
     * 
     * This property is used to specify a list of display views that should be displayed in the datagrid.
     * 
     * If provided, it will override the default display views.
     */
    displayViews?: IDatagridDisplayViewName[];

    /**
     * The name of the session to use for the datagrid.
     * 
     * This property is used to specify the name of the session that should be used for the datagrid.
     */
    sessionName?: string;

    /**
     * The pagination configuration for the grid.
     * 
     * This property is used to specify the pagination configuration for the grid.
     * 
     * @see {@link IDatagridPagination} for more information about pagination configurations.
     */
    pagination?: Partial<IDatagridPagination>;

    /**
     * Whether pagination is enabled for the grid.
     * 
     * If true, the grid allows pagination.
     */
    paginationEnabled?: boolean;

    /***
     * Whether the grid is loading data.
     */
    isLoading?: boolean;

    /**
     * A JSX element or `null` to render as the loading indicator.
     *
     * This prop allows you to customize the visual representation of the loading state in the datagrid.
     * When the `isLoading` prop is set to `true`, the `loadingIndicator` will be displayed in place of the actual data.
     * If no `loadingIndicator` is provided, the datagrid will not display any loading UI.
     *
     * @type {React.ReactNode}
     * @example
     * // Using a custom progress bar component
     * <Datagrid
     *   isLoading={true}
     *   loadingIndicator={<LoadingIndicator />}
     * />
     *
     * @example
     * // Using a simple text-based loading indicator
     * <Datagrid
     *   isLoading={true}
     *   loadingIndicator={<Text>Loading...</Text>}
     * />
     *
     * @example
     * // No loading indicator (default behavior)
     * <Datagrid
     *   isLoading={true}
     * />
     *
     * @remarks
     * - The `loadingIndicator` is only rendered when the `isLoading` prop is `true`.
     * - You can pass any valid React element, including functional components, class components, or HTML elements.
     * - If you pass `null` or omit this prop, no loading indicator will be displayed.
     */
    loadingIndicator?: JSX.Element | null;


    /**
     * Defines the actions that can be performed within the Datagrid component.
     * 
     * The `actions` property allows you to specify a list of actions or a function that dynamically generates actions
     * based on the current state of the Datagrid. These actions can be displayed in the Datagrid's toolbar or other interactive elements.
     * 
     * @type {IDatagridAction | null[] | ((dataTableContext: Datagrid<DataType>) => (IDatagridAction | null)[])}
     * 
     * @template DataType - The type of the data displayed in the grid.
     * 
     * @example
     * ```typescript
     * const deleteAction: IDatagridAction = {
     *   icon: "delete",
     *   label: "Delete",
     *   onPress : (event,{ datagridContext }) => {
     *     const selectedRows = datagridContext.getSelectedRows();
     *     console.log("Deleting rows:", selectedRows);
     *   },
     * };
     * 
     * const actions: IDatagridAction[] = [deleteAction];
     * 
     * <Datagrid
     *   data={data}
     *   columns={columns}
     *   actions={actions}
     * />
     * ```
     * 
     * @remarks
     * - The `actions` property can be a static array of actions or a function that dynamically generates actions based on the Datagrid's state.
     * - Each action must conform to the `IDatagridAction` interface.
     * - If no actions are provided, the toolbar will not display any actions.
     * 
     * @see {@link IDatagridAction} for the structure of an action.
     */
    actions?: IDatagridAction | null[] | ((dataTableContext: Datagrid<DataType>) => (IDatagridAction | null)[]);

    /***
     * Whether to render the actions toolbar.
     */
    renderActionsToolbar?: boolean;

    /***
     * The props to pass to the actions toolbar.
     */
    actionsToolbarProps?: Partial<Omit<IAppBarProps, "children" | "actions">>;

    /**
     * Defines the actions that can be performed on the selected rows within the Datagrid component.
     * 
     * The `selectedRowsActions` property allows you to specify a list of actions or a function that dynamically generates actions
     * based on the current state of the Datagrid and the selected rows. These actions can be displayed in the Datagrid's toolbar
     * or other interactive elements.
     * 
     * @type {IDatagridAction | null[] | ((dataTableContext: Datagrid<DataType>) => (IDatagridAction | null)[])}
     * 
     * @template DataType - The type of the data displayed in the grid.
     * 
     * @example
     * ```typescript
     * const deleteAction: IDatagridAction = {
     *   icon: "delete",
     *   label: "Delete",
     *   onPress :  (event,{ datagridContext }) => {
     *     const selectedRows = datagridContext.getSelectedRows();
     *     console.log("Deleting rows:", selectedRows);
     *   },
     * };
     * 
     * const selectedRowsActions: IDatagridAction[] = [deleteAction];
     * 
     * <Datagrid
     *   data={data}
     *   columns={columns}
     *   selectedRowsActions={selectedRowsActions}
     * />
     * ```
     * 
     * @example
     * ```typescript
     * const dynamicActions = (datagridContext: Datagrid<any>) => {
     *   const selectedRowsCount = datagridContext.getSelectedRowsCount();
     *   if (selectedRowsCount > 0) {
     *     return [
     *       {
     *         icon: "delete",
     *         label: `Delete (${selectedRowsCount})`,
     *         onPress :  (event,{ datagridContext }) => {
     *           const selectedRows = datagridContext.getSelectedRows();
     *           console.log("Deleting rows:", selectedRows);
     *         },
     *       },
     *     ];
     *   }
     *   return [];
     * };
     * 
     * <Datagrid
     *   data={data}
     *   columns={columns}
     *   selectedRowsActions={dynamicActions}
     * />
     * ```
     * 
     * @remarks
     * - The `selectedRowsActions` property can be a static array of actions or a function that dynamically generates actions based on the Datagrid's state and selected rows.
     * - Each action must conform to the `IDatagridAction` interface.
     * - If no actions are provided, the toolbar will not display any actions for selected rows.
     * 
     * @see {@link IDatagridAction} for the structure of an action.
     */
    selectedRowsActions?: IDatagridAction | null[] | ((dataTableContext: Datagrid<DataType>) => (IDatagridAction | null)[]);

    /**
     * Whether to display headers in the Datagrid.
     */
    displayHeaders?: boolean;

    /***
     * Whether to display filters in the Datagrid.
     */
    displayFilters?: boolean;

    /***
     * Whether to display aggregated headers in the Datagrid.
     */
    displayAggregatedHeaders?: boolean;
}

/**
 * Represents an action that can be performed within the Datagrid component.
 * 
 * The `IDatagridAction` interface extends the `IAppBarAction` interface, adding a context specific to the Datagrid.
 * Actions defined by this interface can be used in the Datagrid's toolbar or other interactive elements.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * 
 * @extends {IAppBarAction}
 * 
 * @property {Datagrid<any>} datagridContext - The context of the Datagrid component, providing access to its state and methods.
 * 
 * @example
 * ```typescript
 * const deleteAction: IDatagridAction = {
 *   icon: "delete",
 *   label: "Delete",
 *   onPress : (event,{ datagridContext }) => {
 *     const selectedRows = datagridContext.getSelectedRows();
 *     console.log("Deleting rows:", selectedRows);
 *   },
 * };
 * 
 * const actions: IDatagridAction[] = [deleteAction];
 * ```
 * 
 * @remarks
 * - Actions can be dynamically generated based on the Datagrid's state or user interactions.
 * - The `datagridContext` provides access to the Datagrid's methods, such as `getSelectedRows` or `toggleRowSelection`.
 * 
 * @see {@link IAppBarAction} for the base action interface.
 */
export interface IDatagridAction extends IAppBarAction<{ datagridContext: Datagrid<any> }> { }

const DatagridContext = createContext<Datagrid | null>(null);

/**
 * Hook to access the Datagrid component's context.
 * 
 * This hook returns the Datagrid component's context, which provides access to the grid's state and methods.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * 
 * @returns The Datagrid component's context, or null if not found.
 */
export function useDatagrid<DataType extends IDatagridDataType = any>(): (Datagrid<DataType>) | null {
    /**
     * Returns the Datagrid component's context from the React context API.
     * 
     * The useContext hook is used to access the Datagrid component's context, which is stored in the DatagridContext.
     * 
     * @see {@link DatagridContext} for more information about the Datagrid component's context.
     */
    return useContext(DatagridContext) as (Datagrid<DataType>) | null;
}

/**** Hooks sections */

/**
 * A hook to subscribe to events emitted by the Datagrid component.
 * 
 * This hook uses the useEffect hook to subscribe to the specified event(s) on the Datagrid component.
 * When the event is emitted, the callback function is called with the provided arguments.
 * If the forceRender argument is true, the component will be forced to re-render.
 * If the forceRender argument is a function, it will be called to determine whether to force a re-render.
 * 
 * @param event The event to subscribe to, or an array of events to subscribe to.
 * @param callback The callback function to call when the event is emitted.
 * @param forceRender Whether to force a re-render of the component when the event is emitted.
 * 
 * @example
 */
export function useDatagridOnEvent(event: IDatagridEvent | IDatagridEvent[], callback?: (...args: any[]) => any, forceRender?: boolean | (() => boolean)) {
    const datagridContext = useDatagrid();
    const fRender = useForceRender();
    useEffect(() => {
        const subscribers: Record<string, { remove: Function }> = {};
        (Array.isArray(event) ? event : [event]).map((event) => {
            if (isNonNullString(event)) {
                (subscribers as any)[String(event.toLowerCase().trim())] = datagridContext?.on(event, (...args: any[]) => {
                    const canForceRender = typeof forceRender === "function" ? forceRender() : !!forceRender;
                    if (typeof callback === "function") {
                        callback(...args, event);
                    }
                    if (canForceRender) {
                        fRender();
                    }
                });
            }
        });
        return () => {
            for (let i in subscribers) {
                subscribers[i].remove();
            }
        };
    }, [event, datagridContext?.on, callback]);
}

/**
 * @typedef IDatagridStateColumn
 * Represents a column in the Datagrid component's state.
 * @extends {IDatagridColumnProps}
 * @template DataType - The type of the data displayed in the grid.
 * @see {@link IDatagridColumnProps} for more information about column properties.  
 */
export type IDatagridStateColumn<DataType extends IDatagridDataType = any> = Omit<IDatagridColumnProps<DataType>, "name" | "getAggregationValue" | "aggregationFunction" | "sortable" | "filterable" | "groupable" | "aggregatable" | "visible"> & {
    /**
     * Whether the column is sortable.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     */
    sortable: boolean;

    /**
     * Whether the column is filterable.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     */
    filterable: boolean;

    /**
     * Whether the column is groupable.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     */
    groupable: boolean;

    /**
     * Whether the column is aggregatable.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     */
    aggregatable: boolean;

    /**
     * Whether the column is visible.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     */
    visible: boolean;

    /**
     * The aggregation function to use for the column.
     * 
     * This property is a computed value based on the column's configuration and the grid's settings.
     * 
     * @see {@link IDatagridAggregationFunction} for more information about aggregation functions.
     */
    aggregationFunction: IDatagridAggregationFunction<DataType>;

    /**
     * The test ID for the column.
     * 
     * This property is used for testing purposes and can be used to identify the column in the grid.
     */
    testID?: string;

    /***
     * The unique name of the column.
     */
    name: string;

    /***
     * The index of the column in the list of columns of the grid.
     */
    colIndex: number;
}


/**
 * @typedef IDatagridColumnProps
 * Represents the properties of a column in the Datagrid component.
 * 
 * @extends {IField}
 * @see {@link IField} for more information about the properties of a column.
 * 
 * @template DataType - The type of the data displayed in the grid.
 */
export type IDatagridColumnProps<DataType extends IDatagridDataType = any> = Omit<IField, "name"> & {
    /**
     * Whether the column is sortable.
     * 
     * If true, the column can be sorted in ascending or descending order.
     */
    sortable?: boolean;

    labelProps?: Partial<Omit<ILabelProps, "children">>;

    /**
     * The name of the column.
     * 
     * This property is required and must be a unique string.
     */
    name: string;

    /**
     * Whether the column is filterable.
     * 
     * If true, the column can be filtered using a filter input.
     */
    filterable?: boolean;

    /**
     * Whether the column is groupable.
     * 
     * If true, the column can be used to group the data in the grid.
     */
    groupable?: boolean;

    /**
     * Whether the column is aggregatable.
     * 
     * If true, the column can be used to calculate aggregated values, such as sum, average, count, min, and max.
     */
    aggregatable?: boolean;

    /**
     * The width of the column.
     * 
     * This property can be a number (in pixels) or a string (in percentage).
     * 
     * @example
     * ```typescript
     * 100 // 100 pixels
     * "20%" // 20% of the grid width
     * ```
     */
    width?: number;

    /**
     * The minimum width of the column.
     * 
     * This property is used to prevent the column from being resized to a width less than the specified value.
     */
    minWidth?: number;

    /**
     * Whether the column is visible.
     * 
     * If false, the column is hidden from the grid.
     */
    visible?: boolean;

    /**
     * A function to compute the value of the column.
     * 
     * This property is used to calculate the value of the column based on the data in the grid.
     * 
     * @param options An object containing the row data.
     * @returns The computed value of the row cell.
     */
    computeCellValue?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => any;

    /**
     * Whether to ignore case when sorting the column.
     * 
     * If true, the column is sorted in a case-insensitive manner.
     */
    ignoreCaseWhenSorting?: boolean;

    /**
     * The aggregation function to use for the column.
     * 
     * This property can be a key of the IDatagridAggregationFunctions interface or a custom aggregation function.
     * 
     * @see {@link IDatagridAggregationFunctions} for more information about aggregation functions.
     */
    aggregationFunction?: keyof IDatagridAggregationFunctions<DataType> | IDatagridAggregationFunction<DataType>;

    /***
     * A custom render function for the column.
     * 
     * This property is used to render the column in a custom way.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns The rendered column.
     */
    renderRowCell?: (options: IDatagridCallOptions<DataType> & { rowData: DataType; column: IDatagridStateColumn<DataType> }) => React.ReactNode;

    /**
     * A custom render function for the header of the column.
     * 
     * This property is used to render the header of the column in a custom way.
     * @param options An object containing the row data and the datagrid context.
     * @returns The rendered header.
     */
    renderHeader?: (options: IDatagridCallOptions<DataType> & { column: IDatagridStateColumn<DataType> }) => React.ReactNode;
}

/**
 * Represents the state of the Datagrid component.
 * @typedef IDatagridState
 * 
 * @template DataType - The type of the data displayed in the grid.
 */
export interface IDatagridState<DataType extends IDatagridDataType = any> {
    /**
     * The data to be displayed in the grid.
     * 
     * This property contains an array of either grouped rows or data rows.
     * 
     * @see {@link IDatagridStateData} for more information about the data state.
     */
    data: IDatagridStateData<DataType>;

    /**
     * The entire dataset, including all rows and columns.
     * 
     * This property is useful for accessing the raw data, without any filtering or grouping.
     */
    allData: DataType[];

    /**
     * A map of rows by their keys.
     * 
     * This property allows for efficient lookup of rows by their keys.
     */
    rowsByKeys: Record<string, DataType>;

    /**
     * The current display view of the grid.
     * 
     * This property determines how the data is displayed in the grid.
     * 
     * @see {@link IDatagridDisplayViewName} for more information about display view names.
     */
    displayView: IDatagridDisplayViewName;

    /**
     * A map of columns by their names.
     * 
     * This property allows for efficient lookup of columns by their names.
     */
    columnsByName: Record<string, IDatagridStateColumn<DataType>>;

    /**
     * The list of columns in the grid.
     * 
     * This property contains an array of column objects, each representing a column in the grid.
     */
    columns: IDatagridStateColumn<DataType>[];

    /**
     * The list of aggregatable columns in the grid.
     * 
     * This property contains an array of column objects that support aggregation.
     */
    aggregatableColumns: IDatagridStateColumn[];

    /**
     * The list of visible columns in the grid.
     * 
     * This property contains an array of column objects that are currently visible in the grid.
     */
    visibleColumns: IDatagridStateColumn<DataType>[];

    /**
     * The list of groupable columns in the grid.
     * 
     * This property contains an array of column objects that support grouping.
     */
    groupableColumns: IDatagridStateColumn<DataType>[];

    /**
     * The list of columns that are currently grouped.
     * 
     * This property contains an array of column names that are currently grouped in the grid.
     */
    groupedColumns: string[];

    /**
     * A map of grouped rows by their keys.
     * 
     * This property allows for efficient lookup of grouped rows by their keys.
     */
    groupedRowsByKeys: Record<string, DataType[]>;

    /**
     * The current order by configuration of the grid.
     * 
     * This property determines how the data is sorted in the grid.
     * 
     * @see {@link IDatagridOrderBy} for more information about order by configurations.
     */
    orderBy: IDatagridOrderBy<DataType>;

    /**
     * The current pagination configuration of the grid.
     * 
     * This property determines how the data is paginated in the grid.
     * 
     * @see {@link IDatagridPagination} for more information about pagination configurations.
     */
    pagination: IDatagridPagination;

    /**
     * The paginated data in the grid.
     * 
     * This property contains an array of data rows that are currently visible in the grid, based on the pagination configuration.
     */
    paginatedData: DataType[];

    /**
     * A record of aggregated column values.
     * 
     * This property contains an object where each key is a column name and the value is an object containing the aggregation functions and their values.
     * 
     * @example
     * ```typescript
     * {
     *   "column1": {
     *     "sum": 100,
     *     "average": 20,
     *     "count": 5,
     *     "min": 10,
     *     "max": 50
     *   },
     *   "column2": {
     *     "sum": 200,
     *     "average": 40,
     *     "count": 5,
     *     "min": 20,
     *     "max": 100
     *   }
     * }
     * ```
     */
    aggregatedColumnsValues: Record<string, Record<keyof IDatagridAggregationFunctions, number>>;

    /**
     * A flag indicating whether to display grouped columns.
     * 
     * This property determines whether to display the grouped columns in the grid.
     */
    displayGroupedColumns: boolean;

    /***
     * A flag indicating whether to display filters.
     */
    displayFilters: boolean;

    /***
     * A flag indicating whether to display headers.
     */
    displayHeaders: boolean;

    /**
     * The layout of the view container.
     */
    containerLayout: LayoutRectangle;

    /***
     * The widths of the columns.
     * Each key is the name of the column and the value is the width of the column.
     */
    columnsWidths: Record<string, number>;

    /**
     * Whether to display aggregated headers in the Datagrid.
     */
    displayAggregatedHeaders: boolean;
}

/**
 * A map of events that can be triggered by the Datagrid component. Each key is an event name.
 * @typedef IDatagridEventMap
 */
export interface IDatagridEventMap {
    /***
     * Triggered when a row is selected.
     */
    rowSelected: string;
    /***
     * Triggered when a row is unselected.
     */
    rowUnselected: string;
    /***
     * Triggered when the selection state of a row changes.
     */
    toggleRowSelection: string;

    /***
     * Triggered when the selection state of all rows changes.
     */
    toggleAllRowsSelection: string;

    /***
     * Triggered to toggle loading state of the Datagrid component.
     */
    toggleIsLoading: string;
}

/**
 * A type representing the possible events that can be triggered by the Datagrid component.
 * @typedef IDatagridEvent
 */
export type IDatagridEvent = keyof IDatagridEventMap;

/**
 * A type representing the data type of the Datagrid component.
 * It is an object with any number of properties.
 */
export interface IDatagridDataType extends Record<string, any> { }

/**
 * An interface representing the accumulator object used in aggregation functions.
 * It is an object with properties that are the keys of the IDatagridAggregationFunctions interface.
 * @typedef IDatagridAggregationAccumulator
 * @template DataType - The type of the data displayed in the grid.
 * @see {@link IDatagridAggregationFunctions} for more information about aggregation functions.
 */
export interface IDatagridAggregationAccumulator<DataType extends IDatagridDataType = any> extends Record<keyof IDatagridAggregationFunctions | string, number> {

}

/**
 * A type representing an aggregation function that takes an accumulator, a current value, an index, and an array of data.
 * It returns a number representing the aggregated value.
 * 
 * @param acc The accumulator object.
 * @param currentValue The current value being processed.
 * @param currentIndex The index of the current value.
 * @param data The array of data being aggregated.
 * @returns The aggregated value.
 */
export type IDatagridAggregationFunction<DataType extends IDatagridDataType = any> = (acc: IDatagridAggregationAccumulator, currentValue: number, currentIndex: number, data: DataType[]) => number;

/**
 * An interface representing the possible aggregation functions that can be used in the Datagrid component.
 * @typedef IDatagridAggregationFunctions
 * @template DataType - The type of the data displayed in the grid.
 * @see {@link IDatagridAggregationFunction} for more information about aggregation functions.
 */
export interface IDatagridAggregationFunctions<DataType extends IDatagridDataType = any> {
    /**
     * The sum aggregation function.
     */
    "sum": IDatagridAggregationFunction<DataType>;
    /**
     * The average aggregation function.
     */
    "average": IDatagridAggregationFunction<DataType>;
    /**
     * The count aggregation function.
     */
    "count": IDatagridAggregationFunction<DataType>;
    /**
     * The minimum aggregation function.
     */
    "min": IDatagridAggregationFunction<DataType>;
    /**
     * The maximum aggregation function.
     */
    "max": IDatagridAggregationFunction<DataType>;
}

/**
 * A type representing the possible aggregators that can be used in the Datagrid component.
 * @typedef IDatagridAggregator
 */
export type IDatagridAggregator = keyof IDatagridAggregationFunctions;

/**
 * An interface representing a grouped row in the Datagrid component.
 * @typedef IDatagridGroupedRow
 * @template DataType - The type of the data displayed in the grid.
 */
export interface IDatagridGroupedRow {
    /**
     * A flag indicating that this is a grouped row.
     */
    isDatagridGroup: true;
    /**
     * The label of the grouped row.
     */
    label: string;
    /**
     * The key of the grouped row.
     */
    groupedKey: string;
}

/**
 * A type representing the data state of the Datagrid component.
 * It is an array of either grouped rows or data rows.
 * @typedef IDatagridStateData
 * @template DataType - The type of the data displayed in the grid.
 * @see {@link IDatagridGroupedRow} for more information about grouped rows.
 */
export type IDatagridStateData<DataType extends IDatagridDataType = any> = Array<IDatagridGroupedRow | DataType>;


/**
 * An interface representing the display view map of the Datagrid component.
 * Eeach key is a display view name and each value is the display view configuration.
 * Eeach value must be a class extending the DatagridDisplayView class.
 * @typedef IDatagridDisplayViewMap
 */
export interface IDatagridDisplayViewMap { }

/**
 * A type representing the possible display view names of the Datagrid component.
 * @typedef IDatagridDisplayViewName
 */
export type IDatagridDisplayViewName = keyof IDatagridDisplayViewMap;

/**
 * A type representing the order by configuration of the Datagrid component.
 * @typedef IDatagridOrderBy
 * @template DataType - The type of the data displayed in the grid.
 * @extends {IResourceQueryOptionsOrderBy<DataType>}
 * @see {@link IResourceQueryOptionsOrderBy}
 */
export type IDatagridOrderBy<DataType extends IDatagridDataType = any> = IResourceQueryOptionsOrderBy<DataType>;

/**
 * An interface representing the pagination configuration of the Datagrid component.
 */
export interface IDatagridPagination extends IResourcePaginationMetaData {
    /**
     * The limit of the pagination.
     */
    limit: number;
}
export interface IDatagridLoadingIndicatorProps extends Record<string, any> {
    isLoading?: boolean;
}

const DatagridExported: typeof Datagrid & {
    Column: typeof DatagridColumn;
    DisplayView: typeof DatagridDisplayView;
} = Datagrid as any;

DatagridExported.Column = DatagridColumn;
DatagridExported.DisplayView = DatagridDisplayView;

export { DatagridExported as Datagrid };

const styles = StyleSheet.create({
    main: {
        width: "100%",
        minHeight: 100,
    },
    disabled: {
        pointerEvents: "none",
    },
    actionsToolbar: {
        width: "100%",
    },
    viewSwitcher: {

    },
    headerWrapper: {
        alignSelf: "flex-start",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
    }
});