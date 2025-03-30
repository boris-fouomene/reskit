import React, { createContext, useContext, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ViewProps
} from 'react-native';
import { Component, ObservableComponent, getReactKey, getTextContent } from '@utils/index';
import { areEquals, defaultBool, defaultStr, isEmpty, isNonNullString, isNumber, isObj, isStringNumber, stringify } from '@resk/core/utils';
import Auth from "@resk/core/auth";
import { IField, IFieldType, IMergeWithoutDuplicates, IResourcePaginationMetaData, IResourceQueryOptionsOrderBy, IResourceQueryOptionsOrderDirection } from '@resk/core/types';
import Logger from "@resk/core/logger";
import Label from '@components/Label';
import InputFormatter from '@resk/core/inputFormatter';
import { ResourcePaginationHelper } from '@resk/core/resources';

const defaultNumber = (a: any) => isNumber(a) ? a : 0;

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
            ...this.processColumns()
        };
        Object.assign(this.state, this.processData(this.props.data));
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
    updateState(stateData: Partial<IDatagridState<DataType>>, callback?: () => void) {
        this.setState((prevState) => ({ ...prevState, ...stateData }), callback);
    }
    /***
     * returns the list of display views to be displayed in the datagrid. if provided from props, it will override the default display views.
     */
    getDisplayViews(): IDatagridDisplayViewName[] {
        return Array.isArray(this.props.displayViews) && this.props.displayViews.length > 0 ? this.props.displayViews : Object.keys(Datagrid.getRegisteredDisplayViews()) as IDatagridDisplayViewName[];
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
        this.props.columns.map((column) => {
            if (isObj(column) && isNonNullString(column.name)) {
                column.groupable = this.isGroupable() && column.groupable !== false;
                column.filterable = this.isFiltrable() && column.filterable !== false;
                column.sortable = this.isSortable() && column.sortable !== false;
                column.visible = column.visible !== false;
                column.aggregatable = this.isAggregatable() && column.aggregatable !== false;
                columns.push(column as IDatagridStateColumn<DataType>);
                if (column.visible !== false) {
                    visibleColumns.push(column as IDatagridStateColumn<DataType>);
                }
                if (column.aggregatable !== false) {
                    aggregatableColumns.push(column as IDatagridStateColumn<DataType>);
                }
                if (column.groupable !== false) {
                    groupableColumns.push(column as IDatagridStateColumn<DataType>);
                    if (groupedColumns.includes(column.name)) {
                        stateGroupedColumns.push(column.name);
                    }
                }
                columnsByName[column.name] = column as IDatagridStateColumn<DataType>;
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
    isColumnAggregatable(colName: string) {
        return this.isAggregatable() && this.getColumn(colName).aggregatable;
    }
    isColumnGroupable(colName: string) {
        return this.isGroupable() && this.getColumn(colName).groupable;
    }
    isColumnSortable(colName: string) {
        return this.isSortable() && this.getColumn(colName).sortable;
    }
    isColumnFilterable(colName: string) {
        return this.isFiltrable() && this.getColumn(colName).filterable;
    }
    isSortable() {
        return this.props.sortable !== false;
    }
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
     * @returns {any} - The computed value of the column.
     * 
     * @example
     * ```typescript
     * const value = datagridInstance.computeColumnValue("name", { name: "John" });
     * console.log(value); // Output: "John"
     * ```
     */
    computeColumnValue(column: IDatagridStateColumn | string, rowData: DataType, format?: boolean): any {
        const col: IDatagridStateColumn = typeof column === "string" && column ? this.getColumn(column) : column as any;
        if (!isObj(rowData) || !isObj(col) || !isNonNullString(col.name)) return undefined;
        const value = typeof col.computeValue === "function" ? col.computeValue({ rowData }) : (rowData as any)[col.name];
        if (format && !isEmpty(value)) {
            return InputFormatter.formatValue({ ...col, value }).formattedValue;
        }
        return value;
    }
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
    isGroupedRow(rowData: IDatagridGroupedRow<DataType> | DataType): rowData is IDatagridGroupedRow {
        return isObj(rowData) && !!rowData.isDatagridGroup && isNonNullString(rowData.label);
    }
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
                        return this.sortCompare(a, b, column, direction as any, column.ignoreCaseWhenSorting);
                    }
                    return 0;
                });
            }
        }
        return data;
    }
    getRowByKey(rowKey: string): DataType | null {
        if (!isNonNullString(rowKey)) return null;
        return this.state.rowsByKeys[rowKey] || null;
    }
    getGroupedRowHeaderSeparator(): string {
        return defaultStr(this.props.groupedRowHeaderSeparator, ",");
    }
    getGroupedRowHeader(rowData: DataType, groupedColumns?: string[]): string {
        const d: string[] = [];
        const groupHeaderSeparator = this.getGroupedRowHeaderSeparator();
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const includeColumnLabelInGroupedRowHeader = this.props.includeColumnLabelInGroupedRowHeader !== false;
        groupedColumns.map((columnName) => {
            if (!isNonNullString(columnName)) return;
            const column = this.getColumn(columnName);
            if (!column) return;
            const txt = this.computeColumnValue(column, rowData, true);
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
    getGroupedRows(groupedRowKey: string): DataType[] {
        if (!isNonNullString(groupedRowKey)) return [];
        const r = this.state.groupedRowsByKeys[groupedRowKey];
        return Array.isArray(r) ? r : [];
    }
    canPaginate(): boolean {
        return !!this.props.paginationEnabled;
    }
    /**
     * Processes the data for the component.
     * 
     * @param {DataType[]} data - The data to process.
     * @returns {IDatagridState<DataType>} The processed data.
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
            if (!isObj(rowData) || (typeof this.props.internalFilter == "function" && !this.props.internalFilter(rowData, index))) return;
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
                        const value = this.computeColumnValue(column, rowData);
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
    // Handle component updates
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
        if (hasUpdated) {
            this.updateState(newState, () => {
                this.setSessionData("displayView", this.state.displayView);
                this.setSessionData("orderBy", this.state.orderBy);
                this.setSessionData("groupedColumns", this.state.groupedColumns);
            });
        }
    }

    isValidDisplayView(displayView: any): displayView is IDatagridDisplayViewName {
        if (!isNonNullString(displayView)) return false;
        const displayViews = this.getDisplayViews();
        return displayViews.includes(displayView as IDatagridDisplayViewName);
    }
    // Switch view method
    switchDisplayView = (displayView: IDatagridDisplayViewName) => {
        this.setState({ displayView });
    }
    getDisplayView() {
        return this.state.displayView;
    }
    getTestID() {
        return defaultStr(this.props.testID, "resk-datagrid");
    }
    render() {
        return <DatagridRendered
            context={this}
        />
    }
    getSesionName() {
        return `datagrid-session-data-${defaultStr(this.props.sessionName, "default")}`;
    }
    removeSessionData(sessionName: string) {
        return this.setSessionData(sessionName, undefined);
    }
    removeAllSessionData() {
        return Auth.Session.set(this.getSesionName(), {});
    }
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
    getSessionData(sessionName?: keyof IDatagridState<DataType> | string) {
        const data = Object.assign({}, Auth.Session.get(this.getSesionName()));
        if (isNonNullString(sessionName)) {
            return data[sessionName as keyof typeof data];
        }
        return data;
    }
    static registerDisplayView(displayView: IDatagridDisplayViewName, component: typeof DatagridDisplayView) {
        if (!isNonNullString(displayView) || typeof (component) !== "function") return;
        const components = Datagrid.getRegisteredDisplayViews();
        (components as any)[displayView] = component;
        Reflect.defineMetadata(Datagrid.reflectMetadataKey, components, Datagrid);
    }
    static getRegisteredDisplayViews(): Record<IDatagridDisplayViewName, typeof DatagridDisplayView> {
        const components = Reflect.getMetadata(Datagrid.reflectMetadataKey, Datagrid);
        return isObj(components) ? components : {} as any;
    }

    sortCompare(rowDataA: DataType, rowDataB: DataType, column: IDatagridStateColumn, sortDirection: IResourceQueryOptionsOrderDirection = "asc", ignoreCase: boolean = true) {
        const multiplicater = !!(String(sortDirection).toLowerCase().trim() === "desc") ? -1 : 1;
        let a: any = this.computeColumnValue(column, rowDataA);
        if (isEmpty(a)) a = "";
        let b: any = this.computeColumnValue(column, rowDataB);
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
    static getRegisteredDisplayView(displayView: IDatagridDisplayViewName): typeof DatagridDisplayView {
        if (!isNonNullString(displayView)) return DatagridDisplayView;
        return Datagrid.getRegisteredDisplayViews()[displayView] || DatagridDisplayView;
    }
    static isValidAggregationFunction(aggregationFunction: IDatagridAggregationFunction<any>) {
        return typeof aggregationFunction === "function";
    }

    static registerAggregationFunction(aggregationFunctionName: keyof IDatagridAggregationFunctions, aggregationFunction: IDatagridAggregationFunction) {
        if (!isNonNullString(aggregationFunctionName) || !Datagrid.isValidAggregationFunction(aggregationFunction)) return;
        const aggregationsFunctions = Datagrid.getRegisteredAggregationFunctions();
        (aggregationsFunctions as any)[aggregationFunctionName] = aggregationFunction;
        Reflect.defineMetadata(Datagrid.aggregationFunctionMetadataKey, aggregationsFunctions, Datagrid);
    }
    static getRegisteredAggregationFunctions(): IDatagridAggregationFunctions {
        const aggregationsFunctions = Reflect.getMetadata(Datagrid.aggregationFunctionMetadataKey, Datagrid);
        return isObj(aggregationsFunctions) ? aggregationsFunctions : {} as any;
    }

    static registredColumnsReflectMetadataKey = Symbol("datagrid-registred-columns-reflect-metadata-key");
    static registerColumn(type: IFieldType, component: typeof DatagridColumn) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = Datagrid.getRegisteredColumns();
        components[type] = component;
        Reflect.defineMetadata(Datagrid.registredColumnsReflectMetadataKey, components, Datagrid);
    }
    static getRegisteredColumns(): Record<IFieldType, typeof DatagridColumn> {
        const components = Reflect.getMetadata(Datagrid.registredColumnsReflectMetadataKey, Datagrid);
        return isObj(components) ? components : {} as any;
    }
    static getRegisteredColumn(type: IFieldType): typeof DatagridColumn {
        const components = Datagrid.getRegisteredColumns();
        return isNonNullString(type) ? components[type] : DatagridColumn || DatagridColumn;
    }
}

function DatagridRendered<DataType extends IDatagridDataType = any>(options: { context: Datagrid<DataType> }) {
    const { context } = options;
    const displayView = context.getDisplayView();
    const testID = context.getTestID();
    const props = context.props;
    const Component = useMemo<typeof DatagridDisplayView<DataType>>(() => {
        return Datagrid.getRegisteredDisplayView(displayView);
    }, [displayView]);
    return (
        <DatagridContext.Provider value={context}>
            <View testID={testID} style={[styles.main, props.style]}>
                {/* View switcher */}
                <ScrollView testID={testID + "-horizontal-header-scrollview"} horizontal style={styles.viewSwitcher}>

                </ScrollView>
                {Component ? <Component datagridContext={context} /> : <Label colorScheme="error" fontSize={20} textBold>
                    {"No display view found for datagrid"}
                </Label>}
            </View>
        </DatagridContext.Provider>
    );
}


/**
 * A base class for Datagrid columns.
 * 
 * This class provides a basic implementation for a Datagrid column, and can be extended to create custom columns.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * @template PropsType - The type of the component's props.
 * @template StateType - The type of the component's state.
 */
class DatagridColumn<DataType extends IDatagridDataType = any, PropsType = unknown, StateType = unknown> extends Component<IMergeWithoutDuplicates<IDatagridStateColumn<DataType> & { datagridContext: Datagrid<DataType> }, PropsType>, StateType> {
    /**
     * Renders the column.
     * 
     * This method is called when the column is rendered.
     * 
     * @returns The rendered column.
     */
    render(): React.ReactNode {
        return <></>;
    }
}
function Column<DataType extends IDatagridDataType = any>({ rowData, columnName }: { columnName: string; rowData: IDatagridGroupedRow | DataType }) {
    const datagridContext = useContext(DatagridContext);
    const column = datagridContext?.getColumn(columnName);
    const columnType = useMemo<IFieldType>(() => {
        return column?.type || "text";
    }, [column?.type]);
    const Component = useMemo<any>(() => {
        return Datagrid.getRegisteredColumn(columnType);
    }, [columnType]);
    if (!datagridContext || !column) return null;
    const testId = datagridContext?.getTestID();
    const rowKey = datagridContext?.getRowKey(rowData);
    return <Component
        datagridContext={datagridContext}
        testID={`${testId}-column-${name}`}
        key={`${testId}-cell-${name}-${rowKey}`}
    />;
}
Column.displayName = "Datagrid.RenderedColumn";


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
/**
 * A decorator to attach a display view to the Datagrid component.
 * 
 * This decorator registers the display view with the Datagrid component, making it available for use.
 * 
 * @param displayView The name of the display view to attach.
 * @returns A decorator function that registers the display view.
 */
export function AttachDatagridDisplayView(displayView: IDatagridDisplayViewName) {
    return (target: typeof DatagridDisplayView) => {
        Datagrid.registerDisplayView(displayView, target as typeof DatagridDisplayView);
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
class DatagridDisplayView<DataType extends IDatagridDataType = any, PropType = {}, StateType extends object = any, EventType extends string = any> extends ObservableComponent<PropType & { datagridContext: Datagrid<DataType> }, StateType, EventType> {
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
    isGroupedRow(rowData: IDatagridGroupedRow<DataType> | DataType): rowData is IDatagridGroupedRow {
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
    renderGroupedRow(rowData: IDatagridGroupedRow<DataType>) {
        return null;
    }

    /**
     * Renders a column.
     * 
     * This method is called when a column is encountered.
     * 
     * @param columnName The name of the column to render.
     * @param rowData The row data to render.
     * @returns The rendered column.
     */
    renderColumn(columnName: string, rowData: IDatagridGroupedRow | DataType) {
        if (!isObj(rowData) || !this.getColumn(columnName)) return null;
        if (this.isGroupedRow(rowData)) {
            return this.renderGroupedRow(rowData);
        }
        return <Column columnName={columnName} rowData={rowData} />;
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
    internalFilter?: (rowData: DataType, rowIndex: number) => boolean;

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
    style: ViewProps["style"];

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
    getRowKey: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => string | number;

    /**
     * The key or keys to use for the row.
     * 
     * This property is used to specify the key or keys that should be used for the row.
     */
    rowKey: (keyof DataType) | (keyof DataType)[];

    /**
     * A function to handle row press events.
     * 
     * This property is used to specify a custom function for handling row press events.
     * 
     * @param options An object containing the row data and the datagrid context.
     */
    onRowPress?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => void;

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
}

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

/**
 * @typedef IDatagridStateColumn
 * Represents a column in the Datagrid component's state.
 * @extends {IDatagridColumnProps}
 * @template DataType - The type of the data displayed in the grid.
 * @see {@link IDatagridColumnProps} for more information about column properties.  
 */
export type IDatagridStateColumn<DataType extends IDatagridDataType = any> = Omit<IDatagridColumnProps<DataType>, "getAggregationValue" | "aggregationFunction" | "sortable" | "filterable" | "groupable" | "aggregatable" | "visible"> & {
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
    width?: number | `${number}%`;

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
     * @returns The computed value of the column.
     */
    computeValue?: (options: { rowData: DataType }) => any;

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
}

/**
 * A map of events that can be triggered by the Datagrid component. Each key is an event name.
 * @typedef IDatagridEventMap
 */
export interface IDatagridEventMap { }

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
export interface IDatagridGroupedRow<DataType extends IDatagridDataType = any> {
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
export type IDatagridStateData<DataType extends IDatagridDataType = any> = Array<IDatagridGroupedRow<DataType> | DataType>;


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

const DatagridExported: typeof Datagrid & {
    Column: DatagridColumn;
    DisplayView: DatagridDisplayView;
} = Datagrid as any;

export { DatagridExported as Datagrid };

const styles = StyleSheet.create({
    main: {
        width: "100%",
        minHeight: 300,
    },
    viewSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10
    },
    viewSwitcherButton: {
        marginRight: 10,
        padding: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5
    }
});