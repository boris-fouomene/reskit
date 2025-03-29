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


class Datagrid<DataType extends IDatagridDataType = any> extends ObservableComponent<IDatagridProps<DataType>, IDatagridState<DataType>, IDatagridEvent> {
    private static reflectMetadataKey = Symbol('datagrid-reflect-metadata-key');
    private static aggregationFunctionMetadataKey = Symbol("datagrid-aggregation-functions-meta");
    static maxAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return Math.max(defaultNumber(acc.max), currentValue);
    };
    static minAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return Math.min(defaultNumber(acc.min), currentValue);
    };
    static sumAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return defaultNumber(acc.sum) + currentValue;
    };
    static countAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        return defaultNumber(acc.count) + 1;
    };
    static averageAggregationFunction: IDatagridAggregationFunction = function (acc, currentValue, currentIndex, data) {
        acc.avgSum = defaultNumber(acc.avgSum) + currentValue;
        acc.avgCount = defaultNumber(acc.avgCount) + 1;
        return acc.avgSum / acc.avgCount;
    };
    static get aggregationFunctions(): IDatagridAggregationFunctions {
        const functions = Datagrid.getRegisteredAggregationFunctions();
        functions.sum = Datagrid.sumAggregationFunction;
        functions.min = Datagrid.minAggregationFunction;
        functions.max = Datagrid.maxAggregationFunction;
        functions.count = Datagrid.countAggregationFunction;
        functions.average = Datagrid.averageAggregationFunction;
        return functions;
    }
    static getAggregationFunction(aggregationFunctionName: string) {
        const defaultFunc = () => 0;
        if (!isNonNullString(aggregationFunctionName)) return defaultFunc;
        const fn = (Datagrid.aggregationFunctions as any)[aggregationFunctionName];
        return typeof fn == "function" ? fn : defaultFunc;
    }
    constructor(props: IDatagridProps<DataType>) {
        super(props);
        (this as any).state = {
            ...this.initStateFromSessionData(),
            ...this.processColumns()
        };
        Object.assign(this.state, this.processData(this.props.data));
    }
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
    sortColumn(colName: string) {
        this.sortOrUnSortColumn(colName, "sort");
    }
    unsortColumn(colName: string) {
        this.sortOrUnSortColumn(colName, "unsort");
    }
    initStateFromSessionData(): Partial<IDatagridState<DataType>> {
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
                column.groupable = column.groupable !== false;
                column.filterable = column.filterable !== false;
                column.sortable = column.sortable !== false;
                column.visible = column.visible !== false;
                column.aggregatable = column.aggregatable !== false;
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
    getColumn(colName: string): IDatagridStateColumn<DataType> {
        if (isNonNullString(colName) && this.state.columnsByName[colName]) {
            return this.state.columnsByName[colName]
        }
        return {} as IDatagridStateColumn<DataType>;
    }
    isColumnVisible(colName: string) {
        return this.getColumn(colName).visible;
    }
    isColumnAggregatable(colName: string) {
        return this.getColumn(colName).aggregatable;
    }
    isColumnGroupable(colName: string) {
        return this.getColumn(colName).groupable;
    }
    isColumnSortable(colName: string) {
        return this.getColumn(colName).sortable;
    }
    isColumnFilterable(colName: string) {
        return this.getColumn(colName).filterable;
    }
    isSortable() {
        return this.props.sortable !== false;
    }
    isFiltrable() {
        return this.props.filterable !== false;
    }
    isAggregatable() {
        return this.props.aggregatable !== false;
    }
    isGroupable(): boolean {
        return this.props.groupable !== false;
    }

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
    // Process data with sorting and other transformations
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
        if (!Datagrid.areArraysEqual(prevProps.columns, this.props.columns)) {
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


class DatagridColumn<DataType extends IDatagridDataType = any, PropsType = unknown, StateType = unknown> extends Component<IMergeWithoutDuplicates<IDatagridStateColumn<DataType> & { datagridContext: Datagrid<DataType> }, PropsType>, StateType> {
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


export function AttachDatagridColumn(type: IFieldType) {
    return (target: typeof DatagridColumn) => {
        Datagrid.registerColumn(type, target as typeof DatagridColumn);
    };
}

export function AttachDatagridDisplayView(displayView: IDatagridDisplayViewName) {
    return (target: typeof DatagridDisplayView) => {
        Datagrid.registerDisplayView(displayView, target as typeof DatagridDisplayView);
    };
}


class DatagridDisplayView<DataType extends IDatagridDataType = any, PropType = {}, StateType extends object = any, EventType extends string = any> extends ObservableComponent<PropType & { datagridContext: Datagrid<DataType> }, StateType, EventType> {
    getDatagridContext() {
        return this.props.datagridContext;
    }
    getData(): IDatagridStateData<DataType> {
        const d = this.getDatagridContext().state.data;
        return Array.isArray(d) ? d : [];
    }
    getAllData(): DataType[] {
        const d = this.getDatagridContext().state.allData;
        return Array.isArray(d) ? d : [];
    }
    getPaginatedData(): DataType[] {
        const d = this.getDatagridContext().state.paginatedData;
        return Array.isArray(d) ? d : [];
    }
    getColumn(columnName: string) {
        return this.getDatagridContext().getColumn(columnName);
    }
    isGroupedRow(rowData: IDatagridGroupedRow<DataType> | DataType): rowData is IDatagridGroupedRow {
        return !!this.getDatagridContext().isGroupedRow(rowData);
    }
    renderGroupedRow(rowData: IDatagridGroupedRow<DataType>) {
        return null;
    }
    renderColumn(columnName: string, rowData: IDatagridGroupedRow | DataType) {
        if (!isObj(rowData) || !this.getColumn(columnName)) return null;
        if (this.isGroupedRow(rowData)) {
            return this.renderGroupedRow(rowData);
        }
        return <Column columnName={columnName} rowData={rowData} />;
    }
    render() {
        return <Label>
            No display view found for datagrid
        </Label>;
    }
}

export interface IDatagridCallOptions<DataType extends IDatagridDataType = any> {
    datagridContext: Datagrid<DataType>;

}
export interface IDatagridProps<DataType extends IDatagridDataType = any> {
    data: DataType[];
    sortable?: boolean;
    filterable?: boolean;
    internalFilter?: (rowData: DataType, rowIndex: number) => boolean;
    aggregatable?: boolean;
    groupable?: boolean;
    style: ViewProps["style"];
    testID?: string;

    /***
     * The name of the columns that will be used to group the data
     */
    groupedColumns?: string[];
    columns: IDatagridColumnProps<DataType>[];
    pivotConfig?: IDatagridPivotConfig<DataType>;
    displayView?: IDatagridDisplayViewName;
    orderBy?: IDatagridOrderBy<DataType>;
    getRowKey: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => string | number;
    rowKey: (keyof DataType) | (keyof DataType)[];
    onRowPress?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => void;
    isRowSelectable?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => boolean;
    /**
     * A string to be used as a separator between group header and group rows.
     */
    groupedRowHeaderSeparator?: string;
    /***
     * Wheter to prefix each row group header by the label of the current grouped column
     * Default is true.
     */
    includeColumnLabelInGroupedRowHeader?: boolean;
    rowDataMutator?: (options: IDatagridCallOptions<DataType> & { rowData: DataType }) => DataType;
    /***
     * A list of display views to be displayed in the datagrid. if provided, it will override the default display views.
     */
    displayViews?: IDatagridDisplayViewName[],
    sessionName?: string;
    pagination?: Partial<IDatagridPagination>;
    paginationEnabled?: boolean;
}

const DatagridContext = createContext<Datagrid | null>(null);

export function useDatagrid<DataType extends IDatagridDataType = any>(): (Datagrid<DataType>) | null {
    return useContext(DatagridContext) as (Datagrid<DataType>) | null;
}


export type IDatagridStateColumn<DataType extends IDatagridDataType = any> = Omit<IDatagridColumnProps<DataType>, "getAggregationValue" | "aggregationFunction" | "sortable" | "filterable" | "groupable" | "aggregatable" | "visible"> & {
    sortable: boolean;
    filterable: boolean;
    groupable: boolean;
    aggregatable: boolean;
    visible: boolean;
    aggregationFunction: IDatagridAggregationFunction<DataType>;
    testID?: string;
}

export type IDatagridColumnProps<DataType extends IDatagridDataType = any> = Omit<IField, "name"> & {
    sortable?: boolean;
    name: string;
    filterable?: boolean;
    groupable?: boolean;
    pivotable?: boolean;
    aggregatable?: boolean;
    width?: number | `${number}%`;
    minWidth?: number;
    visible?: boolean;
    computeValue?: (options: { rowData: DataType }) => any;
    ignoreCaseWhenSorting?: boolean;
    aggregationFunction?: keyof IDatagridAggregationFunctions<DataType> | IDatagridAggregationFunction<DataType>;
}

export interface IDatagridState<DataType extends IDatagridDataType = any> {
    data: IDatagridStateData<DataType>;
    allData: DataType[];
    rowsByKeys: Record<string, DataType>;
    pivotedData?: any[];
    displayView: IDatagridDisplayViewName;
    columnsByName: Record<string, IDatagridStateColumn<DataType>>;
    columns: IDatagridStateColumn<DataType>[];
    aggregatableColumns: IDatagridStateColumn[];
    visibleColumns: IDatagridStateColumn<DataType>[];
    groupableColumns: IDatagridStateColumn<DataType>[];
    groupedColumns: string[];
    groupedRowsByKeys: Record<string, DataType[]>;
    orderBy: IDatagridOrderBy<DataType>;
    pagination: IDatagridPagination;
    paginatedData: DataType[];
    /***
     * A record where each key is a column name and the value is an object containing the aggregation functions and their values
     */
    aggregatedColumnsValues: Record<string, Record<keyof IDatagridAggregationFunctions, number>>;
    displayGroupedColumns: boolean;
};

export interface IDatagridEventMap {
    fetchData: string;
}

export type IDatagridEvent = keyof IDatagridEventMap;

export interface IDatagridDataType extends Record<string, any> { }

export interface IDatagridAggregationAccumulator<DataType extends IDatagridDataType = any> extends Record<keyof IDatagridAggregationFunctions | string, number> {

}
export type IDatagridAggregationFunction<DataType extends IDatagridDataType = any> = (acc: IDatagridAggregationAccumulator, currentValue: number, currentIndex: number, data: DataType[]) => number;
//reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U

export interface IDatagridAggregationFunctions<DataType extends IDatagridDataType = any> {
    "sum": IDatagridAggregationFunction<DataType>;
    "average": IDatagridAggregationFunction<DataType>;
    "count": IDatagridAggregationFunction<DataType>;
    "min": IDatagridAggregationFunction<DataType>;
    "max": IDatagridAggregationFunction<DataType>;
}

export type IDatagridAggregator = keyof IDatagridAggregationFunctions;

export interface IDatagridGroupedRow<DataType extends IDatagridDataType = any> {
    isDatagridGroup: true;
    label: string;
    groupedKey: string;
}

export type IDatagridStateData<DataType extends IDatagridDataType = any> = Array<IDatagridGroupedRow<DataType> | DataType>;


// Pivot Configuration
export interface IDatagridPivotConfig<DataType extends IDatagridDataType = any> {
    rows: (keyof DataType)[];
    columns: (keyof DataType)[];
    values: {
        field: keyof DataType;
        aggregationFunction?: IDatagridAggregator;
    }[];
}
export interface IDatagridDisplayViewConfig {
    name: string;
    label: string;
    icon?: string;
}
export interface IDatagridDisplayViewMap {

}
export type IDatagridDisplayViewName = keyof IDatagridDisplayViewMap;


export type IDatagridOrderBy<DataType extends IDatagridDataType = any> = IResourceQueryOptionsOrderBy<DataType>;

export interface IDatagridPagination extends IResourcePaginationMetaData {
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