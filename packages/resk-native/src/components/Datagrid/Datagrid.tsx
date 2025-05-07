import React, { createContext, createRef, isValidElement, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    LayoutChangeEvent,
    LayoutRectangle,
    Dimensions,
    PanResponderInstance,
    PanResponder,
    GestureResponderEvent,
    PanResponderGestureState
} from 'react-native';
import { Component, ObservableComponent, getReactKey, getTextContent, measureInWindow, useForceRender, useIsMounted, usePrevious, useStateCallback } from '@utils/index';
import { areEquals, defaultBool, defaultStr, isEmpty, isNonNullString, isNumber, isObj, isStringNumber, stringify, defaultNumber, sortBy, extendObj, uniqid } from '@resk/core/utils';
import Auth from "@resk/core/auth";
import { IField, IFieldType, IResourcePaginationMetaData, IResourceQueryOptionsOrderByDirection } from '@resk/core/types';
import Logger from "@resk/core/logger";
import {Label,ILabelProps } from '@components/Label';
import InputFormatter from '@resk/core/inputFormatter';
import { ResourcePaginationHelper } from '@resk/core/resources';
import { IReactComponent, IViewStyle } from '@src/types';
import { Preloader } from '@components/Dialog';
import { AppBar, IAppBarAction, IAppBarProps } from '@components/AppBar';
import { Divider } from '@components/Divider';
import { FontIcon,IIconSource, Icon } from '@components/Icon';
import {IFontIconName} from "@resk/native-icon-types";
import Theme, { Colors, useTheme } from "@theme";
import { useDimensions } from '@dimensions/index';
import i18n from '@resk/core/i18n';
import { IPreloaderProps } from '@components/Dialog/Preloader';
import { IProgressBarProps, ProgressBar } from '@components/ProgressBar';
import { Button, IButtonProps } from '@components/Button';
import { IMenuItemProps, Menu } from '@components/Menu';
import Breakpoints from '@breakpoints/index';
import { Form } from '@components/Form';
import { HStack } from '@components/Stack';
import { IFilterColumnName, IFilterGroupProps, IFilterProps } from '@components/Filter/types';
import { Filter } from '@components/Filter';

/**
 * A flexible and feature-rich data grid component for React Native.
 * 
 * The `DatagridView` class provides a powerful grid system for displaying, sorting, filtering, grouping, and paginating data.
 * It supports advanced features such as column aggregation, custom view names, and session-based state persistence.
 * 
 * @template DataType - The type of the data shown in the grid.
 * @template PropsExtensions - The type of the component's props. This type is used to extend the component's props with additional properties.
 * @template StateExtensions - The type of the component's state. This type is used to extend the component's state with additional properties.
 * 
 * @example
 * ```tsx
 *  // Extending DatagridView externally to add a custom view
 *  import {AttachDatagridView} from "@resk/native";
 *  interface IDatagridTableViewProps<DataType extends object = any> {}
 *
 *   declare module "@resk/native" {
 *       export interface IDatagridViews {
 *           table: IDatagridTableViewProps;
 *       }
 *   }
 *  @AttachDatagridView({name: "table", label: "Table"})
 *  class DatagridTableView<DataType extends object = any> extends DatagridView<DataType, IDatagridTableViewProps> {
 *      _render(){
 *          //render table view
 *      }
 *  }
 * ```
 */
class DatagridView<DataType extends object = any, PropsExtensions = unknown, StateExtensions = unknown> extends ObservableComponent<IDatagridViewProps<DataType, PropsExtensions>, IDatagridViewState<DataType, StateExtensions>, IDatagridEvent> {
    private static reflectMetadataKey = Symbol('datagrid-reflect-viewName-key');
    private static aggregationFunctionMetadataKey = Symbol("datagrid-aggregation-functions-meta");
    private _isLoading: boolean = false;
    private _toggleLoading: boolean = false;
    private _containerRef = createRef<View>();
    private _contentContainerRef = createRef<View>();
    private _toolbarActionsContainerRef = createRef<View>();
    private dimensionsBindListener: { remove: Function } | null = null;
    static MIN_HEIGHT: number = 100;
    public get containerRef() {
        return this._containerRef;
    }
    public get contentContainerRef() {
        return this._contentContainerRef;
    }
    public get toolbarActionsContainerRef() {
        return this._toolbarActionsContainerRef;
    }

    /**
     * Determines whether the datagrid view is resizable.
     *
     * This method checks the `resizable` property from the component's props to 
     * determine if the datagrid view can be resized. By default, the datagrid is 
     * resizable unless explicitly set otherwise.
     *
     * @returns {boolean} `true` if the datagrid view is resizable, `false` otherwise.
     */
    public isResizable(): boolean {
        return this.props.resizable !== false;
    }
    /**
     * Handles the column resize event.
     *
     * This method is invoked when a column in the datagrid is resized, allowing 
     * for custom behavior or state updates based on the new column width. It 
     * receives details about the column being resized, the previous and new 
     * widths, and optional gesture event details.
     *
     * @param {Object} options - The options object containing event details.
     * @param {IDatagridViewStateColumn<DataType>} options.column - The column that is being resized.
     * @param {number} options.oldWidth - The previous width of the column before resizing.
     * @param {number} options.newWidth - The new width of the column after resizing.
     * @param {GestureResponderEvent} [options.gestureEvent] - Optional gesture event associated with the resizing action.
     * @param {PanResponderGestureState} options.gestureState - The state of the gesture during the resize.
     * @returns {any} - This method currently does not return a value.
     */
    public onColumnResize({ column, newWidth }: { column: IDatagridViewStateColumn<DataType>, oldWidth: number, newWidth: number, gestureEvent?: GestureResponderEvent, gestureState: PanResponderGestureState }): any {
        if (!this.isResizable() || !this.isValidColumn(column) || column.resizable === false) {
            return null;
        }
        const oldResizedWidth = this.getResizedColumnWidth(column.name);
        if (newWidth === oldResizedWidth) {
            return null;
        }
        this.updateState({
            resizedColumnsWidths: {
                ...this.state.resizedColumnsWidths,
                [column.name]: newWidth
            }
        });
    }
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
    /**
     * Retrieves the name of the datagrid view. This is used by the datagrid to determine which type of view to render.
     * The default implementation returns an empty string.
     * Subclasses should override this method to provide a meaningful name.
     * @returns {IDatagridViewName} The name of the view.
     */
    getViewName(): IDatagridViewName {
        return "" as IDatagridViewName
    }
    /**
     * Determines whether the given view name matches the name of the current datagrid view.
     * The comparison is case-insensitive and trims the given view name.
     * @param {IDatagridViewName} viewName - The name of the view to check.
     * @returns {boolean} True if the given view name matches the name of the current view, otherwise false.
     */
    public isDatagridView(viewName: IDatagridViewName) {
        return isNonNullString(viewName) && (viewName).toLowerCase().trim() === String(this.getViewName()).toLowerCase();
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
     * within the DatagridView. It retrieves the row key using the provided row data and
     * verifies its validity. If the row key is valid, it checks the selection state
     * of the row by determining if the key exists in the set of selected row keys.
     *
     * @param {DataType} rowData - The data of the row to check selection status for.
     * @returns {boolean} `true` if the row is selected, `false` otherwise.
     */
    isRowSelected(rowData: DataType) {
        const rowKey = this.getRowKey(rowData);
        if (!DatagridView.isValidRowKey(rowKey)) return false;
        return this.selectedRowsKeys.has(rowKey);
    }
    /**
     * Validates the provided row key.
     *
     * This static method checks if the given row key is a non-null string,
     * indicating that it is a valid key for identifying a row in the DatagridView.
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
     * @param {IDatagridViewRowOrGroup<DataType>} rowData - The data of the row to check selection status for.
     * @returns {boolean} - Returns `true` if the row is selectable, `false` otherwise.
     */
    isRowSelectable(rowData: IDatagridViewRowOrGroup<DataType>) {
        if (!this.isSelectable() || this.isGroupedRow(rowData)) return false;
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
        this.measureLayout().then((r) => {
            this.setState({ ...r, isLayoutMeasured: true, columnsWidths: this.processColumnsWidths() } as IDatagridViewState<DataType, StateExtensions>);
        });
    }

    /**
     * Measures the layout of the given view ref.
     *
     * This method returns a promise that resolves with the layout coordinates of the given view ref.
     * If the `measure` method of the view is available, it is called instead of `measureInWindow` to measure the layout.
     * @param {React.RefObject<View>} ref - The reference to the view to measure.
     * @returns {Promise<{ x: number, y: number, width: number, height: number, pageX: number, pageY: number }>} A promise that resolves with the layout coordinates of the view.
     * @private
     */
    protected measureViewLayout(ref: React.RefObject<View|null|undefined>): Promise<IDatagridViewMeasuredLayout> {
        return new Promise((resolve, reject) => {
            if (typeof ref.current?.measure === "function") {
                return ref.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                    resolve({
                        x,
                        y,
                        width,
                        height,
                        pageX,
                        pageY,
                    })
                });
            } else {
                measureInWindow(ref).then((r) => {
                    resolve(Object.assign(r, { pageX: 0, pageY: 0 }));
                }).catch(reject);
            }
        })
    }
    /**
     * Measures the layout of the DatagridView's container and content container views.
     *
     * This method returns a promise that resolves with an object containing the layout coordinates of both the container view and the content container view.
     * The properties of the resolved object are `containerLayout` and `contentContainerLayout`.
     * These properties are objects with the following properties: `x`, `y`, `width`, `height`, `pageX`, and `pageY`.
     * The `pageX` and `pageY` properties are only available if the view is positioned relative to the window, otherwise they are `0`.
     * @returns {Promise<{ containerLayout: IDatagridViewMeasuredLayout, contentContainerLayout: IDatagridViewMeasuredLayout,toolbarActionsContainerLayout:IDatagridViewMeasuredLayout}>} A promise that resolves with an object containing the layout coordinates of both the container view and the content container view.
     */
    measureLayout() {
        return Promise.all([
            measureInWindow(this.containerRef),
            this.measureViewLayout(this.contentContainerRef),
            this.measureViewLayout(this.toolbarActionsContainerRef),
        ]).then(([containerLayout, contentContainerLayout, toolbarActionsContainerLayout]) => {
            return { containerLayout, contentContainerLayout, toolbarActionsContainerLayout }
        });
    }
    /**
     * Returns the list of visible columns in the DatagridView.
     * 
     * This method returns the list of visible columns from the DatagridView's state.
     * 
     * @returns {IDatagridViewStateColumn[]} The list of visible columns.
     */
    getVisibleColumns() {
        return this.state.visibleColumns;
    }
    /**
     * Returns the list of all columns in the DatagridView.
     * 
     * This method retrieves the complete list of columns from the DatagridView's state.
     * 
     * @returns {IDatagridViewStateColumn[]} The list of all columns.
    */
    getColumns() {
        return this.state.columns;
    }
    /**
     * Returns the list of columns that can be grouped.
     * 
     * This method retrieves the list of groupable columns from the DatagridView's state.
     * 
     * @returns {IDatagridViewStateColumn[]} The list of groupable columns.
     */
    getGroupableColumns() {
        return this.state.groupableColumns;
    }
    /**
     * Returns the list of columns that support aggregation.
     * 
     * This method retrieves the list of aggregatable columns from the DatagridView's state.
     * 
     * @returns {IDatagridViewStateColumn[]} The list of aggregatable columns.
     */
    getAggregatableColumns() {
        return this.state.aggregatableColumns;
    }
    componentWillUnmount(): void {
        super.componentWillUnmount();
        typeof this.dimensionsBindListener?.remove == "function" && this.dimensionsBindListener?.remove();
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
     * The returned object represent a record of aggregated values, where each key is the name of an aggregation function and the value is the result of the aggregation function for the specified column in the given grouped row key.
     */
    getAggregatedColumnValues(columnName: IDatagridViewColumnName<DataType>): Record<keyof IDatagridAggregationFunctions, number> {
        if (!isNonNullString(columnName)) return {} as Record<keyof IDatagridAggregationFunctions, number>;
        const o = this.getAggregatedColumnsValues();
        return isObj(o) && isObj(o[columnName]) ? o[columnName] : {} as Record<keyof IDatagridAggregationFunctions, number>;
    }

    /**
     * Renders the table structure including the header, body, and footer.
     * 
     * This method returns a JSX fragment containing the rendered components
     * for the table header, body, and footer, which together constitute the
     * complete table layout.
     * Each Datagrid table view must implement or override this method.
     */
    _render() {
        return <>
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
        </>
    }
    /**
     * Returns an object containing the aggregated values for all columns in the grid.
     * 
     * The object returned by this method is a record of aggregated values, where each key is the column name and each value is an object containing the aggregated values for that column.
     * 
     * @returns {Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>>} An object containing the aggregated values for all columns in the grid.
     */
    getAggregatedColumnsValues(): Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>> {
        const o = this.state.aggregatedColumnsValues;
        return isObj(o) ? o : {} as any;
    }

    /**
     * Renders the table header.
     * 
     * This method renders the table header, which consists of all visible columns.
     * Each column is rendered as a header cell by calling `renderTableColumnHeader` with the column name.
     * 
     * @returns {JSX.Element} The rendered table header.
     */
    renderTableHeader() {
        const visibleColumns = this.getVisibleColumns();
        return <>
            {visibleColumns.map((c, index) => this.renderTableColumnHeader(c.name, index))}
        </>
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
     * @param {IDatagridViewColumnRenderType} [renderType="rowCell"] - The type of rendering for the column.
     * @param {DataType} [rowData] - The row data to use for rendering the column as a row cell.
     * @param {number} [rowIndex] - The index of the row in the state data array.
     * 
     * @returns {React.ReactNode} - The rendered column.
     */
    renderTableCellOrColumnHeader(columnName: IDatagridViewColumnName<DataType>, renderType: IDatagridViewColumnRenderType = "rowCell", rowData?: DataType, rowIndex?: number) {
        const column = this.getColumn(columnName);
        if (!column || renderType === "rowCell" && !isObj(rowData)) return null;
        const columnType = defaultStr(column?.type, "text");
        const Component = DatagridView.getRegisteredColumn(columnType as IFieldType);
        const testId = this.getTestID();
        const isRowCell = renderType === "rowCell" && isObj(rowData);
        if (renderType === "rowCell" && !isRowCell) return null;
        return <Component<DataType>
            {...column}
            renderType={renderType}
            datagridContext={this as any}
            testID={`${testId}-column-${columnName}-cell`}
            rowData={rowData}
            key={`cell-${columnName}`}
        />;
    }
    /**
     * Renders a column header in the grid.
     * 
     * This method delegates rendering to `renderTableCellOrColumnHeader` with the `renderType` set to `"header"`.
     * It returns the rendered column header component, or null if the column does not exist.
     * 
     * @param columnName - The name of the column to render the header for.
     * @param columnIndex - The index of the column in the grid.
     * @returns The rendered column header component, or null if the column does not exist.
     */
    renderTableColumnHeader(columnName: IDatagridViewColumnName<DataType>, columnIndex: number): JSX.Element | null {
        const column = this.getColumn(columnName);
        if (!column) return null;
        return <React.Fragment key={`column-header-${columnName}`}>
            {this.renderTableCellOrColumnHeader(columnName, "header")}
            {this.renderTableColumnHeaderChildren(columnName, columnIndex)}
        </React.Fragment>
    }
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Renders additional children for a table column header.
     * 
     * By default, this method returns null, so the rendered column header does not have any additional children.
     * 
     * @param {string} columnName - The name of the column to render children for.
     * @param {number} columnIndex - The index of the column in the grid.
     * @returns {JSX.Element | null} - The rendered additional children for the column header, or null if no additional children are needed.
     */
    /*******  2e8e8306-8b4d-42fe-812e-3ef78c15112f  *******/

    renderTableColumnHeaderChildren(columnName: IDatagridViewColumnName<DataType>, columnIndex: number): JSX.Element | null {
        return null;
    }
    /**
     * Returns the style object for a table column header.
     * 
     * By default, this method returns null and the column header style is determined by the theme.
     * 
     * @param {IDatagridViewStateColumn<DataType>} column - The column to get the style for.
     * 
     * @returns {IViewStyle} The style object for the column header.
     */
    getTableColumnHeaderStyle(column: IDatagridViewStateColumn<DataType>): IViewStyle {
        return [styles.columnHeaderOrCell];
    }

    /**
     * Renders the table body.
     * 
     * This method maps over the data in the current state and renders each row using `renderTableRow`.
     * It returns a collection of rendered rows, which are displayed as the table body.
     * 
     * @returns {JSX.Element[]} The rendered table body containing all the rows.
     */
    renderTableBody() {
        const { data } = this.state;
        return <>
            {data.map((rowData, rowIndex) => this.renderTableRow(rowData, rowIndex))}
        </>
    }
    /**
     * Renders the table footer.
     * 
     * This method is responsible for rendering the table footer, which can be customized to display
     * additional information, such as the number of rows in the grid.
     * 
     * @returns The rendered table footer, or null if no footer should be displayed.
     */
    renderTableFooter(): JSX.Element | null {
        return null;
    }

    /**
     * Returns the container style for the datagrid view.
     * 
     * This method can be overridden to provide a custom style for the container that wraps the entire grid.
     * 
     * @returns {IViewStyle} The container style.
     */
    getContainerStyle(): IViewStyle {
        return null;
    }
    /**
     * Returns the content container style for the datagrid view.
     * 
     * This method can be overridden to provide a custom style for the content container
     * that wraps the grid content.
     * 
     * @returns {IViewStyle} The content container style.
     */
    getContentContainerStyle(): IViewStyle {
        return null;
    }
    /**
     * Renders a single row of the table.
     * 
     * This method is responsible for rendering a single row of the table, which may contain
     * grouped rows. If the row is a grouped row, it will be rendered using the
     * `renderTableGroupedRow` method. Otherwise, it will be rendered as a regular row.
     * 
     * @param {IDatagridViewRowOrGroup<DataType>} rowData - The row data to render.
     * @param {number} rowIndex - The index of the row in the state data array.
     * 
     * @returns The rendered row, or null if the row should not be displayed.
     */
    renderTableRow(rowData: IDatagridViewRowOrGroup<DataType>, rowIndex: number) {
        const rowKey = this.getRowKey(rowData);
        if (!rowKey) return null;
        if (this.isGroupedRow(rowData)) {
            return <React.Fragment key={rowKey}>{this.renderTableGroupedRow(rowData, rowIndex)}</React.Fragment>
        }
        const visibleColumns = this.getVisibleColumns();
        return <React.Fragment key={rowKey}>
            {visibleColumns.map((column, columnIndex) => <React.Fragment key={column.name}>
                {this.renderTableCell(column.name, rowData, rowIndex)}
            </React.Fragment>)}
        </React.Fragment>
    }
    /**
     * Renders a cell in the grid for a given column and row data.
     * 
     * @param columnName - The name of the column to render the cell for.
     * @param rowData - The data for the row, which can be either a grouped row or a regular data row.
     * @param rowIndex - The index of the row in the state data array.
     * 
     * @returns The rendered cell component, or null if the row data is invalid or the column does not exist.
     * 
     * If the row data is a grouped row, it delegates rendering to `renderTableGroupedRow`. Otherwise, it renders a regular `DatagridCell`.
     */

    renderTableCell(columnName: IDatagridViewColumnName<DataType>, rowData: DataType, rowIndex: number): JSX.Element | null {
        if (!isObj(rowData) || !this.getColumn(columnName)) return null;
        return this.renderTableCellOrColumnHeader(columnName, "rowCell", rowData);
    }
    /**
     * Returns the style for a table cell in the grid.
     * 
     * This method can be overridden to provide a custom style for a table cell in the grid.
     * 
     * @param {IDatagridViewStateColumn<DataType>} column - The column configuration for the column that the cell belongs to.
     * @param {DataType} rowData - The row data for the cell.
     * 
     * @returns {IViewStyle} The style for the table cell.
     */
    getTableCellStyle(column: IDatagridViewStateColumn<DataType>, rowData: DataType): IViewStyle {
        return [styles.columnHeaderOrCell];
    }
    /**
     * Renders a grouped row.
     * 
     * This method is called when a grouped row is encountered.
     * 
     * @param rowData The row data to render.
     * @param {rowIndex} the index of the row from state data
     * @returns The rendered grouped row.
     */
    renderTableGroupedRow(rowData: IDatagridViewGroupedRow<DataType>, rowIndex: number) {
        return null;
    }

    /**
     * Retrieves the appropriate sort icon based on the column type and sort direction.
     * 
     * This method determines the sort icon to be displayed for a given column name in the DatagridView.
     * It checks if the column is sortable and if it is part of the current sorting order. Based on the
     * column type and direction ("asc" or "desc"), it returns a corresponding icon name.
     * 
     * @param {IDatagridViewColumnName<DataType>} columnName - The name of the column for which to retrieve the sort icon.
     * @param {IFieldType} columnType - The type of the column for which to retrieve the sort icon.
     * 
     * @returns {IFontIconName | null} The name of the sort icon to be used, or null if the column is not sortable
     * or not part of the current sorting order.
     */
    getSortIcon(columnName: IDatagridViewColumnName<DataType>, columnType?: IFieldType): IFontIconName | null {
        if (!this.isSortable()) return null;
        const columnObj = this.getColumn(columnName);
        if (!columnObj) return null;
        const { column, direction: sortDirection } = Object.assign({}, this.getOrderBy());
        if (!column || column !== columnObj.name) return null;
        if (sortDirection) {
            const isDesc = String(sortDirection).toLowerCase().trim() === "desc";
            const sortType = defaultStr(columnType, columnObj.type).toLowerCase();
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
     * Retrieves the list of grouped columns in the DatagridView.
     * 
     * This method returns the names of the columns that are currently grouped in the DatagridView,
     * as specified in the component's state.
     * 
     * @returns {string[]} An array of column names that are grouped.
     */
    getGroupedColumns(): string[] {
        return this.state.groupedColumns;
    }
    /**
     * Toggles the selection state of a row in the DatagridView.
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
        if (!DatagridView.isValidRowKey(rowKey) || !this.isRowSelectable(rowData)) return;
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
     * Determines if the DatagridView is currently in a loading state.
     * The loading state is determined by the presence of the `isLoading` property
     * in the component's props.
     * @returns {boolean} `true` if the DatagridView is currently in a loading state, `false` otherwise.
     */
    isLoading() {
        return !!this.props.isLoading;
    }
    /**
     * Determines if the loading indicator can be rendered.
     * 
     * The loading indicator can be rendered if the DatagridView is in a loading state,
     * either due to the `isLoading` prop or the internal `_isLoading` state.
     * 
     * @returns {boolean} `true` if the loading indicator can be rendered, `false` otherwise.
     */
    canShowLoadingIndicator() {
        return this.isLoading() || this._isLoading || !this.state.isLayoutMeasured;
    }
    /**
     * Sets the loading state of the DatagridView and triggers the "toggleIsLoading" event.
     * If the loading state is set to `true`, the `_toggleLoading` flag is set to `true`.
     * The `cb` argument is a callback function that is called after the loading state has been toggled.
     * The callback function is called with the `isLoading` state as an argument.
     * The `timeout` argument is the time in milliseconds to wait before calling the callback function.
     * If `timeout` is not provided, the default timeout of 500 milliseconds is used.
     * @param {boolean} loading - The loading state of the DatagridView to be set.
     * @param {Function} [cb] - The callback function to be called after the loading state has been toggled.
     * @param {number} [timeout] - The time in milliseconds to wait before calling the callback function.
     * @returns {boolean} The loading state of the DatagridView.
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
     * Toggles the selection state of all rows in the DatagridView.
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
                if (!DatagridView.isValidRowKey(rowKey)) continue;
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
     * This method returns an array of rows that are currently selected in the DatagridView.
     * The array contains the actual data of the selected rows.
     *
     * @returns {DataType[]} An array of rows that are currently selected in the DatagridView.
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
            sum: DatagridView.sumAggregationFunction,
            min: DatagridView.minAggregationFunction,
            max: DatagridView.maxAggregationFunction,
            count: DatagridView.countAggregationFunction,
            average: DatagridView.averageAggregationFunction,
            ...DatagridView.getRegisteredAggregationFunctions() as any,
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
        const fn = (DatagridView.aggregationFunctions as any)[aggregationFunctionName];
        return typeof fn == "function" ? fn : defaultFunc;
    }
    /**
     * Initializes a new instance of the `DatagridView` component.
     * 
     * @param {IDatagridViewProps<DataType,PropsExtensions>} props - The properties for the component.
     */
    constructor(props: IDatagridViewProps<DataType, PropsExtensions>) {
        super(props);
        this.dimensionsBindListener = Dimensions.addEventListener("change", this.onDimensionsChange.bind(this));
        (this as any).state = {
            ...this.initStateFromSessionData(),
            containerLayout: {
                x: 0, y: 0, width: 0, height: 0
            },
            contentContainerLayout: {
                x: 0, y: 0, width: 0, height: 0,
            },
            toolbarActionsContainerLayout: {
                x: 0, y: 0, width: 0, height: 0,
            },
            isLayoutMeasured: true,
        } as IDatagridViewState<DataType>;
        Object.assign(this.state, this.processColumns());
        Object.assign(this.state, this.processData({
            data: this.props.data,
        }));
    }
    onDimensionsChange() {
        if (this.props.bindDimensionsChangeEvent === false) {
            return;
        }
        this.measureLayout().then((r) => {
            this.setState({ ...r, isLayoutMeasured: true } as IDatagridViewState<DataType, StateExtensions>);
        });
    }

    /**
     * Gets the layout of the container view.
     * 
     * @returns {IDatagridViewMeasuredLayout} The layout of the container view.
     * 
     * @remarks
     * The layout is only available after the component has been rendered and the onLayout event has been triggered.
     * If the component is not rendered or the layout is not measured, returns an object with all properties set to 0.
     */
    getContainerLayout(): IDatagridViewMeasuredLayout {
        return this.state.containerLayout;
    }
    /**
     * Gets the layout of the content container view.
     * 
     * @returns {IDatagridViewMeasuredLayout} The layout of the content container view.
     * 
     * @remarks
     * The layout is only available after the component has been rendered and the onLayout event has been triggered.
     * If the component is not rendered or the layout is not measured, returns an object with all properties set to 0.
     */
    getContentContainerLayout(): IDatagridViewMeasuredLayout {
        return this.state.contentContainerLayout;
    }

    /**
     * Sorts the data in ascending or descending order according to the specified column and direction.
     * 
     * @param {string} colName - The name of the column to sort by.
     * 
     * If the column is already sorted, reverses the direction.
     * If the column is not sorted, sets the direction to ascending.
     * If the column is not sortable, does nothing.
     * 
     * Updates the component state with the new sorted data.
     * Sets the sorted column and direction in the component session data.
     */
    sortColumn(colName: IDatagridViewColumnName<DataType>) {
        if (!isNonNullString(colName) || !this.isSortable()) return;
        const column = this.getColumn(colName);
        if (!column || column.sortable === false) return;
        let direction: IResourceQueryOptionsOrderByDirection = "asc";
        const { column: field, direction: cDirection } = Object.assign({}, this.state.orderBy);
        const hasF = String(field).toLowerCase() === String(colName).toLowerCase();
        if (hasF) {
            direction = String(cDirection).toLowerCase() === "asc" ? "desc" : "asc";
        }
        const orderBy: IDatagridViewOrderBy<DataType> = { column: colName, direction };
        if (!this.canSortInternally()) {
            if (typeof this.props.onSort === "function") {
                this.updateState({ orderBy }, () => {
                    (this.props.onSort as any)(this.getCallOptions({ ...orderBy, ignoreCase: column.ignoreCase }));
                });
            }
            return;
        }
        this.setIsLoading(true, () => {
            this.updateState({ orderBy, ...this.processData({ orderBy }) }, () => {
                this.setSessionData("orderBy", orderBy);
                this.trigger("columnSorted", orderBy);
            });
        });
    }

    /**
     * Returns the current sorting configuration for the DatagridView.
     * 
     * This method returns the current sorting configuration as an `IDatagridViewOrderBy` object.
     * This object contains the field name and direction of the sorting criteria.
     * 
     * @returns {IDatagridViewOrderBy} - The current sorting configuration.
     */
    getOrderBy(): IDatagridViewOrderBy {
        return isObj(this.state.orderBy) ? this.state.orderBy : {} as IDatagridViewOrderBy;
    }
    private persistablePaginationOptions: (keyof IDatagridViewPagination)[] = ["pageSize"];
    /**
    * Initializes the component's state from session data.
    * 
    * @returns {IDatagridViewState<DataType, StateExtensions>} The initialized state.
    */
    initStateFromSessionData(): Partial<IDatagridViewState<DataType, StateExtensions>> {
        const sessionData = this.getSessionData();
        const r: Partial<IDatagridViewState<DataType, StateExtensions>> = {};
        if (isObj(sessionData.orderBy) && sessionData?.orderBy?.column) {
            r.orderBy = sessionData.orderBy;
        } else {
            (r as any).orderBy = Object.assign({}, this.props.orderBy);
        }
        const groupedColumns = Array.isArray(sessionData.groupedColumns) ? sessionData.groupedColumns : Array.isArray(this.props.groupedColumns) ? this.props.groupedColumns : [];
        r.groupedColumns = groupedColumns;
        r.aggregationFunction = isNonNullString(this.props.defaultAggregationFunction) && DatagridView.isValidAggregationFunction(this.props.defaultAggregationFunction) ? this.props.defaultAggregationFunction :
            isNonNullString(sessionData.aggregationFunction) && DatagridView.isValidAggregationFunction(sessionData.aggregationFunction) ? sessionData.aggregationFunction : "sum";
        this.setSessionData("aggregationFunction", r.aggregationFunction);
        this.getToggleableStateItems().map((key) => {
            const propValue = (this.props as any)[key];
            (r as any)[key] = defaultBool(sessionData[key], propValue, !["showOnlyAggregatedValues", "abreviateAggregatableValues", "includeColumnLabelInGroupedRowHeader"].includes(key as string));
            if (propValue === false) {
                (r as any)[key] = false;
            }
            this.setSessionData(key, (r as any)[key]);
        });

        return r;
    }

    /**
     * Retrieves pagination configuration from session data.
     *
     * This function accesses the session data to extract pagination options 
     * and returns a partial pagination configuration.
     * 
     * @returns {Partial<IDatagridViewPagination>} The pagination configuration 
     * retrieved from session data.
     */
    getPaginationFromSession(): Partial<IDatagridViewPagination> {
        const sessionData = this.getSessionData();
        const pagination = Object.assign({}, sessionData.pagination);
        const result = {};
        this.persistablePaginationOptions.map((o) => {
            if (isNumber(pagination[o]) && pagination[o] > 0) {
                (result as any)[o] = pagination[o];
            }
        });
        return result as any;
    }

    /**
     * Retrieves the list of state keys that can be toggled.
     *
     * This method returns an array of state keys that represent the togglable
     * features of the DatagridView component, such as visibility of filters, headers,
     * aggregated totals, actions, and the toolbar.
     *
     * @returns {(keyof IDatagridViewState<DataType, StateExtensions>)[]} An array of keys indicating
     * the togglable state properties of the DatagridView.
     */
    getToggleableStateItems(): (keyof IDatagridViewState<DataType, StateExtensions>)[] {
        return ["showFilters", "showHeaders", "showAggregatedValues", "abreviateAggregatableValues", "showActions", "showToolbar", "showOnlyAggregatedValues", "includeColumnLabelInGroupedRowHeader"];
    }

    /**
     * Updates the component's state with the provided data, and optionally executes a callback function
     * after the state has been updated.
     * 
     * @param {Partial<IDatagridViewState<DataType, StateExtensions>>} stateData - The data to update the component's state with.
     * @param {() => void} [callback] - An optional function to execute after the state has been updated.
     */
    updateState(stateData: Partial<IDatagridViewState<DataType, any>>, callback?: () => void) {
        this.setIsLoading(true, () => {
            this.setState((prevState) => ({ ...prevState, ...stateData }), callback);
        });
    }
    /**
     * Returns the widths of the columns as an object where the keys are the column names
     * and the values are the column widths.
     * 
     * @returns {IDatagridViewState<DataType, StateExtensions>["columnsWidths"]} - The widths of the columns.
     * 
     * @remarks
     * The column widths are initially set based on the type of the column. The widths are
     * then updated based on the user's interactions with the datagrid.
     * 
     * @example
     * // Get the widths of the columns
     * const widths = datagrid.getColumnsWidths();
     */
    getColumnsWidths(): IDatagridViewState<DataType, StateExtensions>["columnsWidths"] {
        return isObj(this.state.columnsWidths) ? this.state.columnsWidths : {} as any;
    }
    /**
     * Retrieves the current widths of all resized columns.
     * 
     * This method returns an object with the resized widths of columns,
     * where the keys are column names and the values are the widths
     * in pixels. If there are no resized columns or the state is invalid,
     * an empty object is returned.
     * 
     * @returns {Partial<Record<IDatagridViewColumnName<DataType>, number>>} - An object
     * mapping column names to their resized widths.
     */
    getResizedColumnsWidths(): Partial<Record<IDatagridViewColumnName<DataType>, number>> {
        return isObj(this.state.resizedColumnsWidths) ? this.state.resizedColumnsWidths : {} as any;
    }
    /**
     * Retrieves the width of a resized column.
     * 
     * This method returns the current width of a column that has been resized
     * by the user. If the column name is invalid or not found, it returns a default
     * width of 0. The width is determined from the `resizedColumnsWidths` state.
     *
     * @param {IDatagridViewColumnName<DataType>} columnName - The name of the column
     * for which to retrieve the resized width.
     * 
     * @returns {number} - The current width of the resized column, or 0 if the column
     * name is invalid or not found.
     */
    getResizedColumnWidth(columnName: IDatagridViewColumnName<DataType>): number {
        if (!isNonNullString(columnName)) return 0;
        return defaultNumber(this.getResizedColumnsWidths()[columnName]);
    }
    /**
     * Returns the width of a column based on its type.
     *
     * This method determines the default width for a column by evaluating its type.
     * Different column types have pre-defined widths to ensure optimal display within
     * the datagrid. If the column type is not recognized, a default width is returned.
     *
     * @param {IFieldType} columnType - The type of the column, which influences the width.
     * 
     * @returns {number} - The width of the column in pixels.
     * 
     * @example
     * // Get the width for a date column
     * const width = getColumnWidthFromType("date");
     */
    getColumnWidthFromType(columnType: IFieldType) {
        switch (columnType) {
            case "date":
                return 180;
            case "time":
                return 120;
            case "datetime":
                return 200;
            default:
                return 150;
        }
    }


    /**
     * Returns the width of a column in pixels.
     * 
     * This method determines the width of a column by evaluating the column type and
     * the pre-defined widths for different column types. If the column type is not
     * recognized, a default width is returned.
     * 
     * @param {string} columnName - The name of the column.
     * 
     * @returns {number} The width of the column in pixels.
     * 
     * @example
     * // Get the width for a column named "date"
     * const width = getColumnWidth("date");
     */
    getColumnWidth(columnName: IDatagridViewColumnName<DataType>): number {
        const resizedWidth = this.getResizedColumnWidth(columnName);
        if (resizedWidth > 0) return resizedWidth;
        if (!isNonNullString(columnName)) return 0;
        const widths = this.getColumnsWidths();
        if (isNumber(widths[columnName]) && widths[columnName] > 0) {
            return widths[columnName];
        }
        const column = this.getColumn(columnName);
        if (!this.isValidColumn(column)) return 0;
        return this.getColumnWidthFromType(column.type);
    }

    /**
     * Calculates the width of each column in the datagrid based on its type and constraints.
     * 
     * This method processes the columns and determines their widths by evaluating their types, widths, min widths, and flex units.
     * The method has two passes: the first pass counts the fixed widths and flex units of all columns, and the second pass calculates the width of each flex column based on the available space and the flex units.
     * If the total fixed width of all columns exceeds the screen width, the table is considered scrollable and the flex columns are not resized.
     * Otherwise, the flex columns are resized to fit the available space by multiplying their flex units by the flex unit value.
     * The method returns the calculated widths of each column in a record with column names as keys and the widths as values.
     * @param {IDatagridViewStateColumn<DataType>[]} [columns] - An array of column objects to process. If not provided, the method will use the columns from the datagrid state.
     * @returns {IDatagridViewState<DataType>["columnsWidths"]} - The calculated widths of each column.
     */
    processColumnsWidths(columns?: IDatagridViewStateColumn<DataType>[]): IDatagridViewState<DataType>["columnsWidths"] {
        const cols = Array.isArray(columns) ? columns : this.getColumns();
        const columnsWidths: IDatagridViewState<DataType>['columnsWidths'] = {} as any;
        const containerWidths = defaultNumber(this.getContainerLayout()?.width);
        const screenWidth = Dimensions.get('window').width;
        let totalFixedWidth = 0;
        let totalFlexUnits = 0;

        // First pass: count fixed widths and flex units
        cols.forEach(column => {
            const colWidth = isNumber(column.width) && column.width > 0 ? column.width : 0;//this.getColumnWidthFromType(column.type);
            const width = Math.max(colWidth, defaultNumber(column.minWidth));
            if (width > 0) {
                totalFixedWidth += width;
                columnsWidths[column.name] = width;
            } else if (isNumber(column.flex)) {
                totalFlexUnits += column.flex;
            } else {
                totalFixedWidth += Math.max(this.getColumnWidthFromType(column.type), defaultNumber(column.minWidth));
            }
        });

        // Determine if table needs to be scrollable
        const isScrollable = totalFixedWidth > (containerWidths > 0 ? containerWidths : screenWidth);

        // Calculate available space for flex columns
        const availableFlexSpace = isScrollable ? 0 : (screenWidth - totalFixedWidth);
        const flexUnit = totalFlexUnits > 0 ? availableFlexSpace / totalFlexUnits : 0;

        cols.map(column => {
            if (!columnsWidths[column.name]) {
                const minWidth = defaultNumber(column.minWidth);
                if (!isScrollable && isNumber(column.flex) && column.flex > 0) {
                    columnsWidths[column.name] = Math.max(minWidth, column.flex * flexUnit);
                } else {
                    columnsWidths[column.name] = Math.max(minWidth, this.getColumnWidthFromType(column.type));
                }
            }
        });
        return columnsWidths;
    }

    /**
     * Processes the columns and returns the columns, visible columns, columns by name, groupable columns, and grouped columns names.
     * 
     * This method processes the columns and returns the columns, visible columns, columns by name, groupable columns, and grouped columns names.
     * The method also sets the `visible`, `filterable`, `sortable`, and `aggregatable` properties of each column based on the component's props.
     * If the column is groupable, the method adds it to the `groupableColumns` array and to the `groupedColumnsNames` array if it is already grouped.
     * 
     * @param {string[]} [groupedColumns] - The names of the columns that are grouped.
     * 
     * @returns {IDatagridViewState<DataType, StateExtensions> & { groupedColumnsNames: string[]; }} - The columns, visible columns, columns by name, groupable columns, and grouped columns names.
     */
    processColumns(groupedColumns?: string[]) {
        if (!Array.isArray(this.props.columns)) return { columns: [], groupedColumns: [], groupableColumns: [], visibleColumns: [], columnsByName: {}, aggregatableColumns: [] };
        const columns: IDatagridViewStateColumn<DataType>[] = [];
        const visibleColumns: IDatagridViewStateColumn<DataType>[] = [];
        const columnsByName: IDatagridViewState<DataType, StateExtensions>["columnsByName"] = {} as IDatagridViewState<DataType, StateExtensions>["columnsByName"];
        const aggregatableColumns: IDatagridViewStateColumn<DataType>[] = [];
        const groupableColumns: IDatagridViewStateColumn<DataType>[] = [];
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const stateGroupedColumns: string[] = [];
        this.props.columns.map((column) => {
            if (isObj(column) && isNonNullString(column.name)) {
                const col: IDatagridViewStateColumn<DataType> = {
                    ...Object.clone(column),
                    groupable: this.isGroupable() && column.groupable !== false,
                    filterable: this.isFilterable() && column.filterable !== false,
                    sortable: this.isSortable() && column.sortable !== false,
                    visible: column.visible !== false,
                    aggregatable: this.props.aggregatable !== false && column.aggregatable === true || false,
                };
                columns.push(col);
                if (col.visible !== false) {
                    visibleColumns.push(col);
                }
                if (col.aggregatable) {
                    aggregatableColumns.push(col);
                }
                if (col.groupable !== false) {
                    groupableColumns.push(col);
                    if (groupedColumns.includes(col.name)) {
                        stateGroupedColumns.push(col.name);
                    }
                }
                (columnsByName as any)[col.name] = col;
            }
        });
        return { columns, columnsWidths: this.processColumnsWidths(columns), visibleColumns, columnsByName, aggregatableColumns, groupableColumns, groupedColumnsNames: stateGroupedColumns };
    }
    /**
     * Retrieves a column definition by name.
     * 
     * @param {string} colName - The name of the column to retrieve.
     * 
     * @returns {IDatagridViewStateColumn<DataType> | null} The column definition if found, otherwise an empty object.
     */
    getColumn(colName: IDatagridViewColumnName<DataType>): IDatagridViewStateColumn<DataType> | null {
        if (isNonNullString(colName) && this.state.columnsByName[colName]) {
            return this.state.columnsByName[colName]
        }
        return null;
    }
    /**
     * Checks if the given column is a valid DatagridView column.
     * 
     * This method checks if the given column is a valid DatagridView column by verifying that
     * it is an object and that it has a `name` property with a non-empty string value.
     * 
     * @param {IDatagridViewStateColumn} column - The column to check.
     * 
     * @returns {column is IDatagridViewStateColumn<DataType>} - `true` if the column is valid, otherwise `false`.
     */
    isValidColumn(column: any): column is IDatagridViewStateColumn<DataType> {
        if (!column) return false;
        return isObj(column) && isNonNullString(column.name);
    }
    /**
     * Checks if a column is visible.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is visible, otherwise `false`.
     */
    isColumnVisible(colName: IDatagridViewColumnName<DataType>) {
        return this.getColumn(colName)?.visible;
    }
    /**
     * Checks if a column is currently grouped.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is grouped, otherwise `false`.
     */
    isColumnGrouped(colName: IDatagridViewColumnName<DataType>) {
        const column = this.getColumn(colName);
        if (!column || !column.groupable || !Array.isArray(this.state.groupedColumns)) return false;
        return this.state.groupedColumns.includes(column.name);
    }
    /**
     * Checks if a column is aggregatable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is aggregatable, otherwise `false`.
     */
    isColumnAggregatable(colName: IDatagridViewColumnName<DataType>) {
        return this.isAggregatable() && !!this.getColumn(colName)?.aggregatable;
    }
    /**
     * Toggles the state value of the provided key in the DatagridView component's state.
     * If the state value is a boolean, it is simply toggled. If the state value is a number, it is negated.
     * The new state value is then persisted to the session data under the same key.
     * 
     * @param {keyof IDatagridViewState<DataType, StateExtensions>} stateKey - The key of the state value to toggle.
     */
    toggleToggleableStateItem(stateKey: keyof IDatagridViewState<DataType, StateExtensions>, cb?: () => void) {
        const stateValue = this.state[stateKey];
        if (["number", "boolean"].includes(typeof stateValue)) {
            this.updateState({ [stateKey]: !!!stateValue }, () => {
                this.setSessionData(stateKey, this.state[stateKey]);
                if (typeof cb === "function") cb();
            });
        }
    }
    /**
     * Checks if a specific state key can be shown in the datagrid.
     * 
     * This method determines if the specified state key is currently set to `true` 
     * in the component's state and is not restricted by the component's props.
     *
     * @param {keyof IDatagridViewState<DataType, StateExtensions>} stateKey - The key of the state value to check.
     * @returns {boolean} - `true` if the state key can be shown, otherwise `false`.
     */
    canShow(stateKey: keyof IDatagridViewState<DataType, StateExtensions>) {
        return this.state[stateKey] === true// && (this.props as any)[stateKey] !== false;
    }
    /**
     * Toggles the display of filters.
     * 
     * This method simply toggles the `showFilters` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleShowFilters() {
        this.toggleToggleableStateItem("showFilters");
    }
    /**
     * Toggles the display of aggregated headers.
     * 
     * This method simply toggles the `showAggregatedValues` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleShowAggregatedValues() {
        this.toggleToggleableStateItem("showAggregatedValues");
    }
    toggleShowOnlyAggregatedValues() {
        this.toggleToggleableStateItem("showOnlyAggregatedValues");
    }
    /**
     * Toggles the abbreviation of aggregatable values.
     * 
     * This method toggles the `abreviateAggregatableValues` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleAbreviateAggregatableValues() {
        this.toggleToggleableStateItem("abreviateAggregatableValues", () => {
            this.trigger("abreviateAggregatableValuesChanged");
        });
    }

    /**
     * Checks if the abreviation of aggregatable values can be shown in the datagrid.
     * 
     * This method determines if the `abreviateAggregatableValues` state key is currently set to `true` 
     * in the component's state and is not restricted by the component's props.
     *
     * @returns {boolean} - `true` if the abreviation of aggregatable values can be shown, otherwise `false`.
     */
    canAbreviateAggregatableValues() {
        return this.canShow("abreviateAggregatableValues");
    }
    /**
     * Toggles the display of headers.
     * 
     * This method simply toggles the `showHeaders` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleShowHeaderss() {
        this.toggleToggleableStateItem("showHeaders");
    }
    /**
     * Toggles the display of the toolbar.
     * 
     * This method simply toggles the `showToolbar` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleShowToolbar() {
        this.toggleToggleableStateItem("showToolbar");
    }
    /**
     * Toggles the inclusion of column labels in the grouped row header.
     *
     * This method toggles the `includeColumnLabelInGroupedRowHeader` state and persists it to the session data.
     *
     * @returns {void}
     */
    toggleIncludeColumnLabelInGroupedRowHeader() {
        this.setIsLoading(true, () => {
            const includeColumnLabelInGroupedRowHeader = !!!this.state.includeColumnLabelInGroupedRowHeader;
            this.updateState({
                includeColumnLabelInGroupedRowHeader,
                ...this.processData({ includeColumnLabelInGroupedRowHeader })
            }, () => {
                this.setSessionData("includeColumnLabelInGroupedRowHeader", includeColumnLabelInGroupedRowHeader);
            })
        });
    }
    /**
     * Determines if the toolbar can be shown in the datagrid.
     *
     * This method checks the current state and props to decide if the toolbar should be shown.
     *
     * @returns {boolean} - `true` if the toolbar can be shown, otherwise `false`.
     */
    canShowToolbar() {
        return this.canShow("showToolbar");
    }
    /**
     * Toggles the visibility of a column by its name.
     * 
     * @param {string} columnName - The name of the column to toggle its visibility.
     * 
     * @returns {void}
     */
    toggleColumnVisibility(columnName: IDatagridViewColumnName<DataType>) {
        const column = this.getColumn(columnName);
        if (!column) return;
        const { columns, visibleColumns } = this.state;
        column.visible = !column.visible;
        const newVisibleColumns = visibleColumns.filter(c => c.name !== columnName);
        if (column.visible) {
            newVisibleColumns.push(column);
        }
        this.setIsLoading(true, () => {
            this.updateState({ columns: [...columns], visibleColumns: newVisibleColumns })
        });
    }
    /**
     * Toggles the grouping state of a column in the datagrid.
     * 
     * This method checks if the specified column is groupable and updates the state to group or ungroup the column.
     * If the column is not currently grouped, it will be added to the list of grouped columns; otherwise, it will be removed.
     * The datagrid's data is reprocessed to reflect the updated grouping, and the updated grouping state is saved to the session.
     * 
     * @param {string} columnName - The name of the column to toggle its grouping state.
     * 
     * @returns {void}
     */
    toggleGroupedColumn(columnName: IDatagridViewColumnName<DataType>) {
        const column = this.getColumn(columnName);
        if (!column || !column.groupable) return;
        this.setIsLoading(true, () => {
            const { groupedColumns } = this.state;
            const isGrouped = groupedColumns.includes(columnName);
            const newGroupedColumns = isGrouped ? [...groupedColumns].filter(c => c !== columnName) : [...groupedColumns];
            if (!isGrouped) {
                newGroupedColumns.push(column.name as any);
            }
            this.updateState({
                ...this.processData({
                    orderBy: this.state.orderBy,
                    groupedColumns: newGroupedColumns
                }),
                groupedColumns: newGroupedColumns
            }, () => {
                this.setSessionData("groupedColumns", this.state.groupedColumns);
            });
        });
    }
    /**
     * Ungroups all the columns in the datagrid.
     * 
     * This method will reprocess the data to reflect that no columns are grouped.
     * The updated state is saved to the session.
     * 
     * @returns {void}
     */
    ungroupAll() {
        this.setIsLoading(true, () => {
            this.updateState({
                groupedColumns: [],
                ...this.processData({
                    groupedColumns: [],
                }),
            }, () => {
                this.setSessionData("groupedColumns", []);
            });
        })
    }
    /**
     * Gets the translation key for a given key in the datagrid.
     * 
     * The translation key is of the form `components.datagrid.${key}`.
     * 
     * @param {string} key - The key to get the translation key for.
     * 
     * @returns {string} - The translation key for the given key.
     */
    static getI18nTranslationKey(key: string): string {
        return `components.datagrid.${defaultStr(key).trim()}`;
    }

    /**
     * Translates the given key using the i18n default instance, ensuring that the
     * key is prefixed with the datagrid translation key.
     *
     * @param {string} key - The key to translate.
     * @param {Object} [options] - Optional options to pass to the translation function.
     *
     * @returns {T} - The translated string, or the translated value of type T if the key returns a non-string value.
     * @example
     * // Translate the "selectAll" property.
     * const selectAllLabel = DatagridView.staticTranslate("selectAll"); // "Select all"
     */
    static staticTranslate<T = string>(key: string, options?: Parameters<typeof i18n.translate>[1]): T {
        return i18n.t<T>(this.getI18nTranslationKey(key), options) as T;
    }

    /**
     * Translates the given key using the i18n default instance, ensuring that the
     * key is prefixed with the datagrid translation key.
     *
     * @param {string} key - The key to translate.
     * @param {Object} [options] - Optional options to pass to the translation function.
     *
     * @returns {T} - The translated string, or the translated value of type T if the key returns a non-string value.
     * @example
     * // Translate the "selectAll" property.
     * const selectAllLabel = this.translate("selectAll"); // "Select all"
     */
    translate<T = string>(key: string, options?: Parameters<typeof i18n.translate>[1]): T {
        return DatagridView.staticTranslate<T>(key, options);
    }
    /**
     * Returns an array of menu items for selecting groupable columns.
     *
     * Each item must conform to the IDatagridViewToolbarAction interface and
     * must have the following properties:
     * - label: The label to display for the menu item.
     * - icon: The icon to display for the menu item. If the column is currently
     *   grouped, the icon should be a check icon. If the column is not grouped,
     *   the icon should be a null or undefined.
     * - onPress: The function to call when the menu item is pressed. This
     *   function should toggle the grouping state of the column.
     *
     * The method should return an empty array if the datagrid is not groupable.
     *
     * @returns {(IDatagridViewToolbarAction<DataType> | null)[]} - An array of
     *   menu items for selecting groupable columns.
     */
    getGroupableColumnsMenuItems(): (IDatagridViewToolbarAction<DataType> | null)[] {
        return [];
    }
    /**
     * Renders a menu for selecting groupable columns.
     *
     * This method checks if the datagrid is groupable and renders a menu that 
     * allows the user to toggle the grouping state of each groupable column. 
     * The menu includes items for each groupable column, with an icon indicating 
     * whether the column is currently grouped. Additionally, it includes options 
     * to display only aggregated totals and to ungroup all columns if there are 
     * any grouped columns.
     *
     * The menu is anchored to a pressable component that displays an icon and label.
     * When a menu item is pressed, the corresponding column's grouping state is 
     * toggled with a slight delay.
     *
     * @returns {JSX.Element | null} The rendered menu or null if the datagrid 
     * is not groupable or there are no groupable columns.
     */
    renderGroupableColumnsMenu(): JSX.Element | null {
        if (!this.isGroupable()) {
            return null;
        }
        const { groupedColumns, groupableColumns } = this.state;
        if (!Array.isArray(groupableColumns) || !Array.isArray(groupedColumns)) {
            return null;
        }
        const menuItems2 = this.getGroupableColumnsMenuItems();
        const menuItems: (IDatagridViewToolbarAction | null)[] = [];
        const isGlobalGrouped = groupedColumns.length;
        groupableColumns.map((column) => {
            if (!column?.groupable) return;
            const isGrouped = this.isColumnGrouped(column.name);
            menuItems.push({
                onPress: () => {
                    this.toggleGroupedColumn(column.name);
                },
                label: column.label || column.name,
                icon: isGrouped ? FontIcon.CHECK : undefined,
            });
        });
        if (menuItems.length > 0) {
            return <Menu
                responsive
                anchor={({ openMenu }) => {
                    return <DatagridToolbarAction icon='format-list-group' title={this.translate("groupTableData")} onPress={() => { openMenu() }} style={[Theme.styles.row]}>
                        {this.translate("groupBy")}
                    </DatagridToolbarAction>
                }}
                items={[
                    {
                        label: this.translate("groupBy"),
                        icon: "group",
                        closeOnPress: false,
                        right: (p) => <Icon {...p} iconName="material-settings" />,
                        divider: true,
                        labelProps: { textBold: true },
                        ///onPress : this.configureSectionLists.bind(this),
                    },
                    {
                        label: this.translate("includeColumnLabelInGroupedRowHeader"),
                        icon: this.state.includeColumnLabelInGroupedRowHeader ? "check" : null,
                        onPress: () => {
                            this.toggleIncludeColumnLabelInGroupedRowHeader();
                        }
                    },
                    this.canShowAggregatedValues() ? {
                        label: this.translate("displayOnlyAggregatedTotal"),
                        icon: this.canShowAggregatedValues() ? "check" : null,
                        onPress: this.toggleShowOnlyAggregatedValues.bind(this)
                    } : null,
                    ...(Array.isArray(menuItems2) ? menuItems2 : []),
                    isGlobalGrouped ? {
                        label: this.translate("ungroup"),
                        icon: "ungroup",
                        onPress: () => {
                            setTimeout(() => {
                                this.ungroupAll();
                            }, 100)
                        }
                    } : null,
                    { divider: true },
                    ...menuItems,
                ]}
            />
        }
        return null;
    }
    /**
     * Retrieves the localized labels for the aggregation functions.
     *
     * This method returns an object containing the translated labels for each aggregation function.
     * The labels are fetched from the localization files using the `i18n` utility.
     * 
     * @returns {Partial<Record<keyof IDatagridAggregationFunctions | string, string>>} 
     * An object mapping each aggregation function name or identifier to its localized label.
     */
    getAggregationFunctionsTranslations(): Partial<Record<keyof IDatagridAggregationFunctions | string, string>> {
        const registeredAggregations = Object.keys(DatagridView.aggregationFunctions);
        const obj = {};
        registeredAggregations.map((aggregation) => {
            (obj as any)[aggregation] = aggregation;
        })
        return Object.assign({}, obj, i18n.getNestedTranslation("components.datagrid.aggregationFunctions") as any);
    }


    /**
     * Renders a menu for selecting aggregation functions.
     *
     * This method checks if the datagrid is aggregatable and renders a menu that 
     * allows the user to toggle the aggregation function for each aggregatable column. 
     * The menu includes items for each aggregation function, with an icon indicating 
     * whether the function is currently active for the column. Additionally, it includes 
     * an option to toggle the display of abbreviated values for numerical columns.
     * 
     * The menu is anchored to a pressable component that displays an icon and label.
     * When a menu item is pressed, the corresponding aggregation function is toggled 
     * with a slight delay.
     *
     * @returns {JSX.Element | null} The rendered menu or null if the datagrid 
     * is not aggregatable or there are no aggregatable columns.
     */
    renderAggregationFunctionsMenu() {
        if (!this.isAggregatable()) return null;
        const aggregatableColumns = this.getAggregatableColumns();
        if (!aggregatableColumns.length) return null;
        const menuItems: (IDatagridViewToolbarAction<DataType> | null)[] = [];
        if (this.isAggregatable()) {
            const canAbreviateAggregatableValues = this.canAbreviateAggregatableValues();
            menuItems.push({
                label: this.translate("abreviateAggregatableValues"),
                icon: canAbreviateAggregatableValues ? 'check' : null,
                onPress: this.toggleAbreviateAggregatableValues.bind(this),
                divider: true,
            })
        }
        //const aggregatorFunction = this.getCurrentAggregationFunctionName();
        const aggregationsFunctions = this.getAggregationFunctions();
        const aggregationTranslations = this.getAggregationFunctionsTranslations();
        for (let funcName in aggregationsFunctions) {
            const label = defaultStr(aggregationTranslations[funcName], funcName);
            const active = this.getAggregationFunction() === funcName;
            if (label) {
                menuItems.push({
                    label,
                    icon: active ? "check" : null,
                    onPress: active ? undefined : () => {
                        this.toggleAggregationFunction(funcName as any);
                    }
                })
            }
        }
        return <Menu
            items={menuItems}
            responsive
            anchor={({ openMenu }) => {
                return <DatagridToolbarAction icon="material-functions" title={this.translate("aggregationFunctionMenuDescription")} onPress={() => { openMenu() }} style={[Theme.styles.row]}>
                    {this.translate("aggregationFunctionsLabel")}
                </DatagridToolbarAction>
            }}
        />
    }

    /**
     * Renders the first set of actions in the toolbar of the DatagridView component.
     *
     * This method is intended to be overridden to provide custom actions that will appear
     * at the start of the toolbar. By default, it returns null, indicating no actions.
     *
     * @returns {JSX.Element | (JSX.Element|null)[] | null } The rendered toolbar actions or null if no actions are provided.
     */
    renderFirstToolbarActions(): JSX.Element | (JSX.Element | null)[] | null {
        return null;
    }
    /**
     * Renders the last set of actions in the toolbar of the DatagridView component.
     *
     * This method is intended to be overridden to provide custom actions that will appear
     * at the end of the toolbar. By default, it returns null, indicating no actions.
     *
     * @returns {JSX.Element | (JSX.Element|null)[] | null } The rendered toolbar actions or null if no actions are provided.
     */
    renderLastToolbarActions(): JSX.Element | (JSX.Element | null)[] | null {
        return null;
    }
    /**
     * Retrieves the list of page sizes for the pagination controls.
     *
     * If the `pagination.pageSizes` property is an array with at least one element, it is returned.
     * Otherwise, a default list of page sizes is generated.
     *
     * The default list includes the following values: 0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, and 5000.
     * If the current viewport is a desktop, the list is extended with the following values: 6000, 7000, 8000, 9000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, and 50000.
     *
     * @returns {number[]} The list of page sizes for the pagination controls.
     */
    getPaginationPageSizes() {
        if (Array.isArray(this.props.pagination?.pageSizes) && this.props.pagination.pageSizes.length) {
            return this.props.pagination.pageSizes;
        }
        return [0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 10000];
    }

    getCustomPaginationSize(): number | undefined {
        const customPageSize = this.getSessionData("customPageSize");
        if (isNumber(customPageSize) && customPageSize > 0) {
            return customPageSize;
        }
        return undefined;
    }

    /**
     * Paginates the data using the given pagination options.
     *
     * This method is called when the pagination controls are used to navigate through the data.
     * If the `canPaginateInternally` method returns `true`, this method will filter the data
     * according to the given pagination options and update the component's state accordingly.
     * If the `canPaginateInternally` method returns `false`, this method will call the
     * `onPaginate` callback function with the given pagination options.
     *
     * @param pagination - The pagination options to use for paginating the data.
     */
    protected paginate(pagination: IDatagridViewPagination) {
        if (!isObj(pagination) || !this.canPaginate()) return;
        pagination = {
            ...this.state.pagination,
            ...pagination
        }
        if (pagination.pageSize !== this.state.pagination?.pageSize) {
            pagination.currentPage = 1;
        }
        const cb = () => {
            const persistable = {} as any;
            this.persistablePaginationOptions.map((o) => {
                persistable[o] = this.state.pagination[o];
            });
            this.setSessionData('pagination', persistable);
        }
        if (!this.canPaginateInternally()) {
            this.updateState({ pagination }, () => {
                if (typeof this.props.onPaginate === "function") {
                    this.props.onPaginate(this.getCallOptions({ ...pagination }));
                }
                cb();
            });
            return;
        }
        this.updateState({
            pagination, ...this.processData({
                data: this.state.allData,
                pagination,
            })
        }, cb);
    }
    askForCustomPaginationSize(callback?: (pageSize: number) => any) {
        const formName = uniqid("custom-pagination-size");
        Form.Dialog.open({
            title: this.translate("pagination.customizePageSizeTitle"),
            formName,
            responsive: false,
            fullScreen: false,
            actions: [
                {
                    label: this.translate("pagination.saveCustomPageSize"),
                    formName,
                    icon: "check",
                }
            ],
            onSubmit: ({ data }) => {
                if (typeof callback === "function" && isNumber(data.pageSize) && data.pageSize > 0) {
                    callback(data.pageSize);
                }
            },
            fields: {
                pageSize: {
                    type: "number",
                    label: this.translate("pagination.customPageSize"),
                    defaultValue: this.getCustomPaginationSize(),
                }
            },
        });
    }

    /**
     * Renders the pagination controls in the DatagridView component.
     *
     * This method returns `null` if the `pagination` property is not an object or if the `total` property is not a number.
     * If the `canPaginate` method returns `false`, this method will render a simple label with the total number of records.
     * If the `canPaginate` method returns `true`, this method will render a more complex pagination control with the following elements:
     *  - A dropdown menu with the page size options.
     *  - A "first page" button.
     *  - A "previous page" button.
     *  - A label with the current page number.
     *  - A "next page" button.
     *  - A "last page" button.
     *
     * @returns {JSX.Element | null} The rendered pagination controls or null if the `pagination` property is not an object or if the `total` property is not a number.
     */
    renderPagination() {
        const { pagination } = this.state;
        if (!pagination || !isNumber(pagination.total)) return null;
        if (!this.canPaginate()) {
            return <DatagridToolbarAction
                children={pagination.total.formatNumber()}
                colorScheme={"primary"}
                labelProps={{
                    textBold: true,
                }}
            />
        }
        const pageSize = defaultNumber(pagination.pageSize, 10);
        const currentPage = defaultNumber(pagination.currentPage);
        const testID = this.getTestID();
        const total = defaultNumber(pagination.total, this.getAllData().length);
        const totalPages = isNumber(pagination.totalPages) ? pagination.totalPages : pageSize > 0 ? Math.ceil(total / pageSize) : 1;
        const hasNextPage = typeof pagination.hasNextPage === 'boolean' ? pagination.hasNextPage : currentPage < totalPages;;
        const hasPreviousPage = typeof pagination.hasPreviousPage === 'boolean' ? pagination.hasPreviousPage : currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : undefined;
        const previousPage = hasPreviousPage ? currentPage - 1 : undefined;
        const lastPage = totalPages;

        const itLimits: IDatagridViewToolbarAction<DataType>[] = [{
            label: this.translate("pagination.pageSize"),
            divider: true,
        }];
        const pageSizes = this.getPaginationPageSizes();
        const customPageSize = this.getCustomPaginationSize();
        if (isNumber(customPageSize) && customPageSize > 0 && !pageSizes.includes(customPageSize)) {
            pageSizes.push(customPageSize);
        }
        pageSizes.map((item) => {
            //if (!isNumber(item)) return null;
            itLimits.push({
                label: item.formatNumber(),
                icon: pageSize == item ? FontIcon.CHECK : null,
                onPress: () => {
                    if (item == pageSize) return;
                    if (!isNumber(item) || item === 0) {
                        return this.askForCustomPaginationSize((pageSize) => {
                            this.setSessionData("customPageSize", pageSize);
                            this.paginate({
                                ...pagination,
                                pageSize,
                                currentPage: 1,
                            });
                        })
                    }
                    return this.paginate({
                        ...pagination,
                        pageSize: item,
                        currentPage: 1,
                    });
                }
            });
        });
        return <View testID={testID + "-pagination-container"}>
            <View style={[styles.paginationContentContainer]} testID={testID + "-pagination-content-container"}>
                <Menu
                    responsive
                    testID={testID + "pagination-page-size-menu"}
                    anchor={<View style={styles.paginationItem} testID={testID + "-pagination-page-size"}>
                        <Label colorScheme='primary' fontSize={16}>
                            {pageSize.formatNumber()}
                        </Label>
                    </View>}
                    items={itLimits}
                />
                <Icon
                    size={25}
                    title={this.translate("pagination.goToFirstPage")}
                    iconName="material-first-page"
                    disabled={!!!hasPreviousPage}
                    onPress={() => {
                        if (!hasPreviousPage) return;
                        this.paginate({
                            ...pagination,
                            currentPage: 1
                        })
                    }}
                />
                <Icon
                    size={25}
                    title={this.translate("pagination.goToPreviousPage")}
                    iconName="material-keyboard-arrow-left"
                    disabled={!!!hasPreviousPage || !!!previousPage}
                    onPress={() => {
                        if (!previousPage) return;
                        const page = previousPage;
                        if (page < 1) return;
                        this.paginate({
                            ...pagination,
                            currentPage: previousPage
                        })
                    }}

                />
                <View testID={testID + "-pagination-label"} style={[styles.paginationItem]}>
                    <Label style={{ fontSize: 15 }}>
                        {currentPage.formatNumber()}-{totalPages.formatNumber()}{" / "}{total.formatNumber()}
                    </Label>
                </View>
                <Icon
                    size={25}
                    title={this.translate("pagination.goToNextPage")}
                    iconName="material-keyboard-arrow-right"
                    disabled={!!!hasNextPage || !!!nextPage}
                    onPress={() => {
                        if (!nextPage) return;
                        this.paginate({
                            ...pagination,
                            currentPage: nextPage
                        })
                    }}
                />
                <Icon
                    size={25}
                    iconName="material-last-page"
                    title={this.translate("pagination.goToLastPage")}
                    disabled={currentPage >= totalPages || !!!lastPage}
                    onPress={() => {
                        if (currentPage >= totalPages || !lastPage) return;
                        this.paginate({
                            ...pagination,
                            currentPage: lastPage
                        });
                    }}
                />
            </View>
        </View>
    }
    /**
     * Returns an array of actions to be displayed in the toolbar of the DatagridView component.
     * 
     * By default, this method returns an empty array. You can override this method to return your own
     * actions. Each action should be an object with the following properties:
     * - `label`: The text to be displayed in the action button.
     * - `icon`: The icon to be displayed in the action button.
     * - `onPress`: The function to be called when the action button is pressed.
     * - `divider`: A boolean indicating whether to display a divider after the action button.
     * - `style`: An array of styles to be applied to the action button.
     * - `disabled`: A boolean indicating whether the action button is disabled.
     * 
     * @returns {(IDatagridViewToolbarAction<DataType> | null)[]} An array of actions to be displayed in the toolbar.
     */
    getToolbarActions(): (IDatagridViewToolbarAction<DataType> | null)[] {
        return [];
    }
    /**
     * Retrieves the list of views that are registered to be displayed in the DatagridView component.
     * 
     * The `getViews` method returns an array of objects with the following properties:
     * - `name`: The name of the view.
     * - `component`: The component to be rendered for the view.
     * - Other properties from the `IDatagridRegisterViewOptions` interface.
     * 
     * The method takes into account the `viewNames` property of the component and filters out
     * any views that are not specified in the array. If `viewNames` is not an array, the method
     * returns all registered views.
     * 
     * @returns {Array< IDatagridRegisterViewOptions & {component: typeof DatagridView<DataType>;} >} An array of view options.
     */
    getViews(): Array<IDatagridRegisterViewOptions & { component: typeof DatagridView<DataType>; }> {
        const views = [];
        const viewsOptions = DatagridView.getRegisteredViewsWithOptions();
        const possibleDisplayViews: IDatagridViewName[] = Array.isArray(this.props.viewNames) ? this.props.viewNames : [];
        for (const name in viewsOptions) {
            if (possibleDisplayViews.length && !possibleDisplayViews.includes(name as any)) {
                continue;
            }
            views.push({
                name,
                ...(viewsOptions as any)[name]
            });
        }
        return views;
    }
    /**
     * Renders a menu of available views for the DatagridView component.
     * 
     * This method retrieves the views using `getViews`. If there are no views available, it returns `null`.
     * Otherwise, it returns a `Menu` component containing the views without their component property. 
     * The menu is anchored by a label displaying a translated string for "viewsMenuItems".
     * 
     * @returns {JSX.Element | null} A menu with the available views or null if no views are available.
     */
    renderViewsMenu() {
        const views = this.getViews();
        if (!views.length) {
            return null;
        }
        return <Menu
            responsive
            items={views.map((view) => {
                if (!view) return null;
                delete ((view as any).component);
                const { name, label, rendable } = view;
                if (typeof rendable === "function" && !rendable({ datagrid: this as any })) {
                    return null;
                }
                const checked = this.getViewName() === name;
                return {
                    ...view,
                    label: label || name,
                    right: checked ? ({ textColor }) => <FontIcon name="check" color={textColor} size={20} /> : undefined,
                    onPress: checked ? undefined : () => {
                        this.onToggleView(name)
                    }
                };
            })}
            anchor={<HStack noWrap>
                <FontIcon
                    name="material-display-settings"
                />
                <Label>{this.translate("viewsMenuItems")}</Label>
            </HStack>}
        />;
    }
    /**
     * Toggles the datagrid view based on the view name provided.
     * @param {IDatagridViewName} name The name of the view to toggle.
     * @fires Datagrid#toggleView
     */
    onToggleView(name: IDatagridViewName) {
        this.trigger("toggleView", name);
        if (typeof this.props.onToggleView === "function") {
            this.props.onToggleView(this.getCallOptions({ viewName: name } as any));
        }
    }
    /**
     * Renders the toolbar for the datagrid.
     * 
     * This method will render all the toolbar actions, including the following:
     * - A button to show/hide all filters, if the datagrid is filterable.
     * - A button to show/hide all aggregated totals, if the datagrid is aggregatable.
     * - A button to select/unselect all rows, if the datagrid is selectable and there is at least one row.
     * - A button to select/unselect all rows, if there are selected rows.
     * - A menu to show/hide columns, with the column name as the label and a check icon if the column is visible.
     * 
     * The toolbar actions are wrapped in a scroll view, so they can be scrolled horizontally.
     * 
     * @returns {JSX.Element} - The rendered toolbar.
     */
    renderToolbar() {
        if (!this.canShowToolbar()) return null;
        const { columns } = this.state;
        const cActions = typeof this.props.toolbarActions === "function" ? this.props.toolbarActions(this.getCallOptions({}))
            : Array.isArray(this.props.toolbarActions) ? this.props.toolbarActions : undefined;
        const actions = (Array.isArray(cActions) ? cActions : []) as IDatagridViewToolbarAction<DataType>[];
        //const actions: IDatagridViewToolbarAction<DataType>[] = [];
        const selectable = this.isSelectable();
        const data = this.state.data;
        const paginatedData = this.state.paginatedData;
        const dataLength = paginatedData.length;
        const isFilterable = this.isFilterable();
        const selectedRowsCount = this.getSelectedRowsCount();
        const isAggregatable = this.isAggregatable();
        const customToolbarActions = this.getToolbarActions();
        if (selectable && dataLength) {
            actions.push({
                label: <Datagrid.ToggleAllRowsSelection />,
            });
        }
        if (isFilterable) {
            actions.push({
                label: this.translate(this.canShowFilters() ? "hideFilters" : "showFilters", { count: dataLength }),
                icon: this.canShowFilters() ? 'eye-off' : 'eye',
                onPress: () => {
                    this.toggleShowFilters();
                }
            })
        }
        if (isAggregatable) {
            actions.push({
                label: !this.canShowAggregatedValues() ? this.translate("showAggregatedValues") : this.translate("hideAggregatedValues"),
                icon: this.canShowAggregatedValues() ? 'view-column' : 'view-module-outline',
                onPress: this.toggleShowAggregatedValues.bind(this),
            })
        }
        const visibleColumnsMenus: IMenuItemProps<{ datagridContext: DatagridView<DataType> }>[] = [];
        columns.map((column) => {
            const visible = column.visible;
            visibleColumnsMenus.push({
                onPress: () => {
                    setTimeout(() => {
                        this.toggleColumnVisibility(column.name);
                    }, 500);
                },
                label: column.label || column.name,
                icon: visible ? FontIcon.CHECK : undefined,
            });
        })
        const testID = this.getTestID();
        return <ScrollView horizontal testID={testID + "-toolbar-scrollview"} contentContainerStyle={styles.headerScrollViewContentContainer} style={[styles.headerScrollView]}>
            <View testID={testID + "-toolbar-container"} style={[styles.toolbarContainer]}>
                {this.renderPagination()}
                {this.renderFirstToolbarActions()}
                {(Array.isArray(customToolbarActions) ? [...actions, customToolbarActions] : actions).map((action, index) => {
                    if (!action || !isObj(action)) return null;
                    return <DatagridToolbarAction
                        testID={testID + "-toolbar-button-" + index}
                        key={"toolbar-action-" + index}
                        {...action}
                    />
                })}
                <Menu
                    responsive
                    anchor={({ openMenu }) => {
                        const onPress = () => {
                            openMenu();
                        }
                        return <DatagridToolbarAction
                            icon="view-column"
                            children={this.translate("columns")}
                            onPress={onPress}
                        />
                    }}
                    items={visibleColumnsMenus}
                />
                {this.renderGroupableColumnsMenu()}
                {this.renderAggregationFunctionsMenu()}
                {this.renderLastToolbarActions()}
                {this.renderViewsMenu()}
            </View>
        </ScrollView>
    }
    /**
     * Determines if headers can be shown in the datagrid.
     *
     * This method checks the current state and props to decide if headers should be shown.
     *
     * @returns {boolean} - `true` if headers can be shown, otherwise `false`.
     */
    canShowHeaders() {
        return this.canShow("showHeaders");
    }
    /**
     * Determines if filters can be shown in the datagrid.
     *
     * This method checks the current state and props to decide if filters should be shown.
     *
     * @returns {boolean} - `true` if filters can be shown, otherwise `false`.
     */
    canShowFilters() {
        return this.canShow("showFilters");
    }
    /**
     * Determines if actions can be shown in the datagrid.
     *
     * This method checks the current props to decide if actions should be shown.
     *
     * @returns {boolean} - `true` if actions can be shown, otherwise `false`.
     */
    canShowActions() {
        return this.canShow("showActions");
    }
    /**
     * Toggles the display of the actions toolbar.
     * 
     * This method simply toggles the `showActions` state and persists it to the session data.
     * 
     * @returns {void}
     */
    toggleShowActions() {
        this.toggleToggleableStateItem("showActions");
    }
    /**
     * Determines if aggregated headers can be shown in the datagrid.
     *
     * This method checks the current state and props to decide if aggregated headers should be shown.
     *
     * @returns {boolean} - `true` if aggregated headers can be shown, otherwise `false`.
     */
    canShowAggregatedValues() {
        return this.canShow("showAggregatedValues") && this.isAggregatable();
    }
    /**
     * Determines if only aggregated headers can be shown in the datagrid.
     *
     * This method checks the current state to decide if only aggregated headers should be shown.
     *
     * @returns {boolean} - `true` if only aggregated headers can be shown, otherwise `false`.
     */
    canShowOnlyAggregatedValues() {
        return !!this.state.showOnlyAggregatedValues;
    }
    /**
     * Checks if a column is groupable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is groupable, otherwise `false`.
     */
    isColumnGroupable(colName: IDatagridViewColumnName<DataType>) {
        return this.isGroupable() && !!this.getColumn(colName)?.groupable;
    }
    /**
     * Checks if a column is sortable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is sortable, otherwise `false`.
     */
    isColumnSortable(colName: IDatagridViewColumnName<DataType>) {
        return this.isSortable() && !!this.getColumn(colName)?.sortable;
    }
    /**
     * Checks if a column is filterable.
     * 
     * @param {string} colName - The name of the column to check.
     * 
     * @returns {boolean} - `true` if the column is filterable, otherwise `false`.
     */
    isColumnFilterable(colName: IDatagridViewColumnName<DataType>) {
        return this.isFilterable() && !!this.getColumn(colName)?.filterable;
    }

    /**
     * Determines if the datagrid is selectable.
     *
     * This method checks the `selectable` property in the component's props
     * to decide if the datagrid allows row selection.
     *
     * @returns {boolean} - `true` if the datagrid is selectable, `false` otherwise.
     */
    isSelectable() {
        return this.props.selectable !== false;
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
    isFilterable() {
        return this.props.filterable !== false;
    }
    /**
     * Determines whether the grid supports aggregation.
     * 
     * @returns {boolean} - `true` if aggregation is enabled, otherwise `false`.
     */
    isAggregatable() {
        return this.props.aggregatable !== false && !!this.getAggregatableColumns()?.length;
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
     * Determines if the datagrid has grouped data.
     * 
     * This method checks if the datagrid is groupable and if there are any grouped columns.
     * 
     * @returns {boolean} - Returns true if the datagrid is groupable and has grouped columns, otherwise false.
     */
    hasGroupedRows(): boolean {
        return this.isGroupable() && this.state.groupedColumns.length > 0;
    }

    /**
     * Retrieves all data stored in the component's state.
     * 
     * This method returns the complete set of data present in the `allData` state.
     * If `allData` is not an array, it returns an empty array.
     * 
     * @returns {DataType[]} - An array of all data objects.
     */
    getAllData(): DataType[] {
        return Array.isArray(this.state.allData) ? this.state.allData : [];
    }

    /**
     * Retrieves the data from state displayed in the datagrid.
     * 
     * This method returns the array of data objects that are currently displayed in the datagrid.
     * If the `data` state is not an array, it returns an empty array.
     * 
     * @returns {DataType[]} - An array of data objects.
     */
    getData(): DataType[] | IDatagridViewGroupedRow<DataType>[] {
        return Array.isArray(this.state.data) ? this.state.data : [];
    }

    /**
     * Computes the value of a column for a given row.
     * 
     * @param {IDatagridViewStateColumn<DataType>} column - The column object or column name.
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
    computeCellValue(column: IDatagridViewStateColumn<DataType> | IDatagridViewColumnName<DataType>, rowData: DataType, format?: boolean): any {
        const col: IDatagridViewStateColumn = typeof column === "string" && column ? this.getColumn(column) : column as any;
        if (!isObj(rowData) || !isObj(col) || !isNonNullString(col.name)) return undefined;
        const value = typeof col.computeCellValue === "function" ? col.computeCellValue(this.getCallOptions({ rowData })) : (rowData as any)[col.name];
        if (format && !isEmpty(value)) {
            return InputFormatter.formatValue({ ...col, value }).formattedValue;
        }
        return typeof value === "object" ? stringify(value, { escapeString: false }) : value;
    }
    /**
     * Returns an object containing the DatagridView context and the provided options.
     * 
     * @template T - The type of the options.
     * @param {T} otherOptions - The options to include in the returned object.
     * 
     * @returns {IDatagridViewCallOptions<DataType> & T} - The object containing the DatagridView context and the provided options.
     * 
     */
    getCallOptions<T = any>(otherOptions: T): IDatagridViewCallOptions<DataType, any, any> & T {
        return Object.assign({}, { datagridContext: this }, otherOptions);
    }
    /**
     * Retrieves the key for a given row.
     * 
     * @param {IDatagridViewRowOrGroup<DataType>} rowData - The data for the row.
     * 
     * @returns {string} - The key for the row.
     * 
     * @example
     * ```typescript
     * const rowKey = datagridInstance.getRowKey({ id: 1, name: "John" });
     * console.log(rowKey); // Output: "1"
     * ```
     */
    getRowKey(rowData: IDatagridViewRowOrGroup<DataType>): string {
        if (this.isGroupedRow(rowData)) {
            return String(rowData.datagridGroupedRowKey).trim().replace(/\s/g, '_');
        }
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
     * indicating it is a grouped row, such as `isDatagridGroupedRowData` and a valid `label`.
     * 
     * @param {IDatagridViewRowOrGroup<DataType>} rowData - The row data to evaluate.
     * 
     * @returns {boolean} - Returns true if the row data is a grouped row; otherwise, false.
     */
    isGroupedRow(rowData: IDatagridViewRowOrGroup<DataType>): rowData is IDatagridViewGroupedRow<DataType> {
        return isObj(rowData) &&
            !!Array.isArray((rowData as IDatagridViewGroupedRow).data) &&
            !!(rowData as IDatagridViewGroupedRow).isDatagridGroupedRowData && !!isNonNullString((rowData as IDatagridViewGroupedRow).label);
    }

    /**
     * Checks if the DatagridView can sort the data internally.
     * 
     * This method checks if the `onSort` property is not a function, which means that the DatagridView should sort the data internally.
     * When `onSort` is a function, the DatagridView will not sort the data internally and will instead rely on the parent component to sort the data.
     * 
     * @returns {boolean} - Returns true if the DatagridView can sort the data internally, otherwise false.
     */
    canSortInternally() {
        return typeof this.props.onSort !== "function";
    }
    /**
     * Checks if the DatagridView can paginate the data internally.
     * 
     * This method checks if the `onPaginate` property is not a function, which means that the DatagridView should paginate the data internally.
     * When `onPaginate` is a function, the DatagridView will not paginate the data internally and will instead rely on the parent component to paginate the data.
     * 
     * @returns {boolean} - Returns true if the DatagridView can paginate the data internally, otherwise false.
     */
    canPaginateInternally() {
        return typeof this.props.onPaginate !== "function";
    }
    /**
     * Sorts the data in ascending or descending order according to the specified columns and directions.
     * 
     * @param {DataType[]} data - The data to be sorted.
     * @param {IDatagridViewOrderBy<DataType>} orderBy - The sorting columns and directions. If not specified, the DatagridView's `orderBy` state is used.
     * 
     * @returns {DataType[]} - The sorted data.
     */
    internalSort(data: DataType[], orderBy?: IDatagridViewOrderBy<DataType>): DataType[] {
        if (!Array.isArray(data)) return [];
        if (!this.isSortable()) return data;
        orderBy = Object.assign({}, isObj(orderBy) && orderBy ? orderBy : this.state.orderBy);
        const sortColumn = orderBy.column,
            sortDirection = isNonNullString(orderBy.direction) && ["asc", "desc"].includes(orderBy.direction.toLowerCase()) ? orderBy.direction : "asc";
        const sortColObj = isNonNullString(sortColumn) && this.getColumn(sortColumn) || null;
        if (!sortColObj) return data;
        if (!this.canSortInternally()) {
            return data;
        }
        // Multi-field sorting
        if (data.length) {
            return sortBy<DataType>(data, (item) => this.computeCellValue(sortColObj, item), {
                direction: sortDirection,
                ignoreCase: sortColObj.ignoreCase
            })
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
        return defaultStr(this.props.groupedRowHeaderSeparator, ", ");
    }
    /**
     * Computes the grouped row header text from the given row data.
     * 
     * @param {DataType} rowData - The row data to use for computing the grouped row header.
     * @param {string[]} groupedColumns - The columns to include in the grouped row header. If not specified, the DatagridView's `groupedColumns` state is used.
     * @param {boolean} includeColumnLabelInGroupedRowHeader  - 
     * @returns {string} - The grouped row header text. If no columns are specified, an empty string is returned.
     */
    computeGroupedRowHeader(rowData: DataType, groupedColumns?: string[], includeColumnLabelInGroupedRowHeader?: boolean): string {
        const d: string[] = [];
        const groupHeaderSeparator = this.getGroupedRowHeaderSeparator();
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        includeColumnLabelInGroupedRowHeader = defaultBool(includeColumnLabelInGroupedRowHeader, this.state.includeColumnLabelInGroupedRowHeader, this.props.includeColumnLabelInGroupedRowHeader !== false);
        groupedColumns.map((columnName) => {
            if (!isNonNullString(columnName)) return;
            const column = this.getColumn(columnName);
            if (!column) return;
            let txt = this.computeCellValue(column, rowData, true);
            if (isEmpty(txt)) {
                txt = "N/A";
            }
            const stringifiedTxt = stringify(txt, { escapeString: false });
            if (!stringifiedTxt) return;
            const labelText = getTextContent(column.label);
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
        return Array.isArray(r?.data) ? r.data : [];
    }
    /**
     * Retrieves the aggregated values for the given grouped row key.
     * Representing a record of aggregated values, where each key is a column name and each value is an object containing the aggregated values for that column.
     * 
     * @param {string} groupedRowKey - The key of the grouped row to retrieve.
     * 
     * @returns {Record<string, Record<keyof IDatagridAggregationFunctions, number>>} - The aggregated values for the given grouped row key.
    */
    getGroupedRowAggregatedColumnsValues(groupedRowKey: string): Record<string, Record<keyof IDatagridAggregationFunctions, number>> {
        if (!isNonNullString(groupedRowKey)) return {} as Record<string, Record<keyof IDatagridAggregationFunctions, number>>;
        const r = this.state.groupedRowsByKeys[groupedRowKey];
        return isObj(r?.aggregatedColumnsValues) ? r?.aggregatedColumnsValues : {};
    }

    /**
     * Retrieves the aggregated values for a specific column in the given grouped row key.
     * 
     * @param {string} groupedRowKey - The key of the grouped row to retrieve.
     * @param {string} columnName - The name of the column for which to retrieve aggregated values.
     * 
     * @returns {Record<keyof IDatagridAggregationFunctions, number>} An object containing the aggregated values for the specified column in the given grouped row key. If the column does not exist or the name is invalid, an empty object is returned.
     * The returned object represent a record of aggregated values, where each key is the name of an aggregation function and the value is the result of the aggregation function for the specified column in the given grouped row key.
     */
    getGroupedRowAggregatedColumnValues(groupedRowKey: string, columnName: IDatagridViewColumnName<DataType>): Record<keyof IDatagridAggregationFunctions, number> {
        const r = this.getGroupedRowAggregatedColumnsValues(groupedRowKey);
        if (!isObj(r)) return {} as Record<keyof IDatagridAggregationFunctions, number>;
        const r2 = r[columnName as any];
        return isObj(r2) ? r2 : {} as Record<keyof IDatagridAggregationFunctions, number>;
    }
    /**
     * Checks if the DatagridView can paginate its data.
     * 
     * It checks if the component's `paginationEnabled` prop is set to `true`.
     * 
     * @returns {boolean} Whether the DatagridView can paginate its data.
     */
    canPaginate(): boolean {
        return this.props.paginationEnabled !== false;
    }

    /**
     * Returns the aggregation functions available for use in the DatagridView.
     * 
     * This method returns the set of aggregation functions registered with the DatagridView.
     * The set of aggregation functions includes all built-in aggregation functions and
     * any functions registered by the user.
     * 
     * @returns {IDatagridAggregationFunctions} The set of aggregation functions available for use.
     */
    getAggregationFunctions() {
        return DatagridView.aggregationFunctions;
    }
    /**
     * Initializes the computation of aggregated values for the datagrid columns.
     * 
     * This method prepares the data structure for storing aggregated values for each
     * column that supports aggregation. It retrieves available aggregation functions
     * and initializes the aggregated values to zero for each function and column.
     * 
     * @returns {Object} An object containing the aggregation functions and the initialized
     * aggregated columns values.
     * - `aggregationFunctions`: The set of aggregation functions available for use.
     * - `aggregatedColumnsValues`: A record with column names as keys and their respective
     * aggregated values initialized to zero for each aggregation function.
     */
    initAggregationComputation() {
        const aggregatedColumnsValues: Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>> = {} as any;
        const aggregationFunctions = this.getAggregationFunctions();
        const { aggregatableColumns } = this.state;
        if (Array.isArray(aggregatableColumns)) {
            aggregatableColumns.map((column) => {
                const colAggregated = (aggregatedColumnsValues as any)[column.name] = {};
                for (let i in aggregationFunctions) {
                    (colAggregated as any)[i] = 0;
                }
            });
        }
        return { aggregationFunctions, aggregatedColumnsValues };
    }
    /**
     * Computes the aggregated values for each column that supports aggregation.
     * 
     * This method iterates over the aggregatable columns and applies the provided aggregation
     * functions to compute the aggregated values for each column based on the row data.
     * The computed values are stored in the `aggregatedColumnsValues` object.
     * 
     * @param {DataType} rowData - The data for the current row being processed.
     * @param {number} rowIndex - The index of the current row in the dataset.
     * @param {IDatagridAggregationFunctions<DataType>} aggregationFunctions - The set of aggregation functions to apply.
     * @param {Record<string, Record<keyof IDatagridAggregationFunctions, number>>} aggregatedColumnsValues - An object to store the aggregated values for each column.
     * @param {DataType[]} allData - The complete dataset being processed.
     * @returns {Record<string, Record<keyof IDatagridAggregationFunctions, number>>} - The updated object containing aggregated values for each column.
     */
    computeAggregationsForRow(rowData: DataType, rowIndex: number, aggregationFunctions: IDatagridAggregationFunctions<DataType>, aggregatedColumnsValues: Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>>, allData: DataType[]) {
        const { aggregatableColumns } = this.state;
        aggregatedColumnsValues = isObj(aggregatedColumnsValues) ? aggregatedColumnsValues : {} as any;
        if (!Array.isArray(aggregatableColumns)) return aggregatedColumnsValues;
        aggregatableColumns.map((column) => {
            if (column.aggregatable) {
                const colAggregated = (aggregatedColumnsValues as any)[column.name];
                for (let i in aggregationFunctions) {
                    const fn: IDatagridAggregationFunction = (aggregationFunctions as any)[i];
                    const value = this.computeCellValue(column, rowData);
                    const val2 = isStringNumber(value) ? parseFloat(value) : value;
                    if (isNumber(val2) && typeof fn === "function") {
                        (colAggregated as any)[i] = defaultNumber(fn(colAggregated, val2, rowIndex, allData));
                    }
                }
            }
        });
        return aggregatedColumnsValues;
    }
    /**
     * Processes the data for the component.
     * 
     * This method is an internal, method that is used by the DatagridView to process the data
     * when the component mounts or when the data changes.z
     * 
     * It processes the data by sorting it, filtering it, grouping it, and paginating it.
     * 
     * @param {object} options
     * @param {DataType[]} options.data - The data to process.
     * @param {IDatagridViewOrderBy<DataType>} options.orderBy - The sorting columns and directions. If not specified, the DatagridView's `orderBy` state is used.
     * @param {string[]} options.groupedColumns - The columns to group the data by. If not specified, the DatagridView's `groupedColumns` state is used.
     * @param {IDatagridViewPagination} pagination - The pagination configuration. If not specified, the DatagridView's `pagination` state is used.
     * @param {boolean} {options.includeColumnLabelInGroupedRowHeader} - Whether to include the column label in the grouped row header. If not specified, the DatagridView's `includeColumnLabelInGroupedRowHeader` state is used.
     * @returns {Partial<IDatagridViewState<DataType, StateExtensions>>} - A partial state object containing the aggregated columns values, the paginated data, the all data, the data to display, the pagination configuration, and the grouped rows by keys.
     */
    processData(options?: { data?: DataType[], orderBy?: IDatagridViewOrderBy<DataType>, groupedColumns?: string[], pagination?: IDatagridViewPagination, includeColumnLabelInGroupedRowHeader?: boolean }): Partial<IDatagridViewState<DataType, any>> {
        let { data, orderBy, groupedColumns, pagination, includeColumnLabelInGroupedRowHeader } = Object.assign({}, options);
        let allData: DataType[] = [];
        const paginationConfig: IDatagridViewPagination = extendObj({}, this.getPaginationFromSession(), isObj(pagination) ? pagination as IDatagridViewPagination : isObj(this.state.pagination) ? this.state.pagination : {} as IDatagridViewPagination);
        data = Array.isArray(data) ? data : Array.isArray(this.state.allData) ? this.state.allData : Array.isArray(this.props.data) ? this.props.data : [];
        groupedColumns = Array.isArray(groupedColumns) ? groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const groupedRowsByKeys: IDatagridViewState<DataType, StateExtensions>["groupedRowsByKeys"] = {} as IDatagridViewState<DataType, StateExtensions>["groupedRowsByKeys"];
        const rowsByKeys: IDatagridViewState<DataType, StateExtensions>["rowsByKeys"] = {} as IDatagridViewState<DataType, StateExtensions>["rowsByKeys"];
        const isGroupable = this.isGroupable() && groupedColumns?.length;
        const { aggregationFunctions, aggregatedColumnsValues } = this.initAggregationComputation();
        data.map((rowData, index) => {
            if (!isObj(rowData) || (typeof this.props.localFilter == "function" && !this.props.localFilter(rowData, index))) return;
            rowData = typeof this.props.rowDataMutator == "function" ? this.props.rowDataMutator(this.getCallOptions({ rowData })) : rowData;
            if (!isObj(rowData)) return;
            const rowKey = this.getRowKey(rowData);
            if (!isNonNullString(rowKey)) {
                Logger.log("Invalid datagrid rowKey : rowKey is not a string", rowKey, " at index ", index, " datagrid session name : ", this.getSessionName());
                return;
            }
            (rowsByKeys as any)[rowKey] = rowData;
            allData.push(rowData);
            this.computeAggregationsForRow(rowData, index, aggregationFunctions, aggregatedColumnsValues, data);
        });
        paginationConfig.total = isNumber(paginationConfig?.total) ? paginationConfig.total : allData.length;
        paginationConfig.currentPage = isNumber(paginationConfig.currentPage) && paginationConfig.currentPage > 0 ? paginationConfig.currentPage : 1;
        paginationConfig.pageSize = isNumber(paginationConfig.pageSize) && paginationConfig.pageSize > 0 ? paginationConfig.pageSize : 10;
        allData = this.internalSort(allData, orderBy);
        let paginatedData: DataType[] = allData;
        const canPaginate = this.canPaginate();
        const canPaginateInternally = this.canPaginateInternally();

        if (canPaginate && canPaginateInternally) {
            const { data: rData, meta } = ResourcePaginationHelper.paginate(allData, paginationConfig.total, {
                ...paginationConfig,
                limit: paginationConfig.pageSize,
                page: paginationConfig.currentPage
            });
            Object.assign(paginationConfig, meta);
            paginatedData = rData;
        }
        const stateData: IDatagridViewState<DataType>["data"] = isGroupable ? [] : paginatedData;
        const unknowGroupLabel = "N/A";
        if (isGroupable) {
            paginatedData.map((rowData, rowIndex) => {
                const groupedRowLabel = defaultStr(this.computeGroupedRowHeader(rowData, groupedColumns, includeColumnLabelInGroupedRowHeader), unknowGroupLabel);
                const groupedRowKey = groupedRowLabel.trim().replace(/\s/g, '_');
                const groupedRow: IDatagridViewGroupedRow<DataType> = {
                    label: groupedRowLabel,
                    isDatagridGroupedRowData: true,
                    datagridGroupedRowKey: groupedRowKey,
                    data: [],
                    aggregatedColumnsValues: this.initAggregationComputation().aggregatedColumnsValues,
                };
                if (!groupedRowsByKeys[groupedRowKey]) {
                    (groupedRowsByKeys as any)[groupedRowKey] = groupedRow;
                }
                groupedRowsByKeys[groupedRowKey].data.push(rowData);
                (stateData as Array<IDatagridViewGroupedRow<DataType>>).push(groupedRow);
                //stateData.push(rowData);
            });
            /***
             * We compute aggregation values for each grouped row key
             */
            for (let i in groupedRowsByKeys) {
                const d = groupedRowsByKeys[i];
                if (Array.isArray(d.data) && d.data.length > 0) {
                    d.data.map((rowData, rowIndex) => {
                        d.aggregatedColumnsValues = this.computeAggregationsForRow(rowData, rowIndex, aggregationFunctions, d.aggregatedColumnsValues, data);
                    })
                }
            }
        }
        return { aggregatedColumnsValues, paginatedData, allData, data: stateData, pagination: paginationConfig, groupedRowsByKeys, rowsByKeys };
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
     * grouping, view name, order by, grouped columns, and pagination. If any of these properties change, the method
     * processes the new columns, data, and state, and updates the session data accordingly.
     * 
     * @param {IDatagridViewProps<DataType,PropsExtensions>} prevProps - The previous properties of the datagrid component.
     * @param {IDatagridViewState<DataType, StateExtensions>} prevState - The previous state of the datagrid component.
     */
    componentDidUpdate(prevProps: IDatagridViewProps<DataType, PropsExtensions>, prevState: IDatagridViewState<DataType, StateExtensions>) {
        const newState: Partial<IDatagridViewState<DataType, StateExtensions>> = {};
        let hasUpdated = false;
        if (!DatagridView.areArraysEqual(prevProps.columns, this.props.columns)
            || this.props.sortable !== prevProps.sortable
            || this.props.filterable !== prevProps.filterable
            || this.props.aggregatable !== prevProps.aggregatable
            || this.props.groupable !== prevProps.groupable
        ) {
            Object.assign(newState, this.processColumns());
            hasUpdated = true;
        }
        const hasOrderByChanged = prevProps?.orderBy?.column !== this.props.orderBy?.column || prevProps?.orderBy?.direction !== this.props.orderBy?.direction && isObj(this.props.orderBy);
        const orderBy: IDatagridViewOrderBy<DataType> = hasOrderByChanged ? (this.props as any).orderBy : this.state.orderBy;
        const groupedColumns = Array.isArray(this.props.groupedColumns) ? this.props.groupedColumns : Array.isArray(this.state.groupedColumns) ? this.state.groupedColumns : [];
        const hasGroupedColumnsChanged = !DatagridView.areArraysEqual(prevProps.groupedColumns, this.props.groupedColumns) && Array.isArray(this.props.groupedColumns);
        const hasPaginationChanged = defaultBool(prevProps.paginationEnabled) !== defaultBool(this.props.paginationEnabled) || !areEquals(prevProps.pagination, this.props.pagination);
        const pagination: IDatagridViewPagination = isObj(this.props.pagination) ? this.props.pagination as any : this.state.pagination;
        if (prevProps.defaultAggregationFunction !== this.props.defaultAggregationFunction && isNonNullString(this.props.defaultAggregationFunction) && DatagridView.isValidAggregationFunction(this.props.defaultAggregationFunction)) {
            newState.aggregationFunction = this.props.defaultAggregationFunction as any;
            hasUpdated = true;
        }

        const dataChanged = !DatagridView.areArraysEqual(prevProps.data, this.props.data);
        // Check if data has changed
        if (hasUpdated || hasPaginationChanged || hasGroupedColumnsChanged || hasOrderByChanged || dataChanged) {
            Object.assign(newState, this.processData({ orderBy, groupedColumns, pagination, data: dataChanged ? this.props.data : this.state.allData }));
            hasUpdated = true;
        }
        this.getToggleableStateItems().map((key) => {
            const propValue = (this.props as any)[key];
            const prevPropValue = (prevProps as any)[key];
            if (prevPropValue !== propValue && typeof propValue == "boolean") {
                (newState as any)[key] = propValue;
                hasUpdated = true;
            }
        });
        if (hasUpdated) {
            this.updateState(newState, () => {
                if (newState.aggregationFunction) {
                    this.setSessionData("aggregationFunction", newState.aggregationFunction);
                }
                this.getToggleableStateItems().map((key) => {
                    if (key in newState) {
                        this.setSessionData(key, newState[key]);
                    }
                })
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
     * Retrieves the test ID for the DatagridView component.
     * 
     * The method returns the value of the `testID` property if it is a non-null string, otherwise it returns "resk-datagrid".
     * 
     * @returns {string} The test ID for the DatagridView component.
     */
    getTestID() {
        const viewName = this.getViewName();
        return defaultStr(this.props.testID, ("resk-datagrid" + (viewName ? `-${viewName}` : "")));
    }

    /**
     * Retrieves the current aggregation function of the DatagridView component.
     * 
     * @returns {keyof IDatagridAggregationFunctions} The current aggregation function of the DatagridView component.
     */
    getAggregationFunction(): keyof IDatagridAggregationFunctions {
        return this.state.aggregationFunction;
    }
    /**
     * Toggles the aggregation function of the DatagridView component.
     * 
     * The method takes an aggregation function name as parameter and checks if the aggregation function is valid and not already set.
     * If the aggregation function is valid and not already set, it updates the state of the component with the new aggregation function.
     * If the aggregation function is not valid or already set, the method does nothing.
     * @param {keyof IDatagridAggregationFunctions} aggregationFunction - The aggregation function to toggle.
     * @returns {void} This function does not return a value.
     */
    toggleAggregationFunction(aggregationFunction: keyof IDatagridAggregationFunctions) {
        const aggregations = this.getAggregationFunctions();
        if (aggregationFunction !== this.getAggregationFunction() && isNonNullString(aggregationFunction) && aggregationFunction in aggregations) {
            this.updateState({ aggregationFunction }, () => {
                this.setSessionData("aggregationFunction", aggregationFunction);
                this.trigger("aggregationFunctionChanged", this.getAggregationFunction());
            });
        }
    }
    /**
     * Retrieves the minimum height of the DatagridView component.
     * 
     * The method returns the value of the `minHeight` property if it is a number, otherwise it returns the constant `DatagridView.MIN_HEIGHT`.
     * 
     * @returns {number} The minimum height of the DatagridView component.
     */
    getMinHeight(): number {
        return defaultNumber(this.props.minHeight, DatagridView.MIN_HEIGHT);
    }

    /**
     * Retrieves the maximum height of the DatagridView component.
     * 
     * The method returns the maximum of the value of the `maxHeight` property and the minimum height of the component.
     * 
     * @returns {number} The maximum height of the DatagridView component.
     */
    getMaxHeight(): number {
        const m = defaultNumber(this.props.maxHeight);
        const screenHeight = Dimensions.get("window").height - 100;
        if (m > 0) return Math.min(m,);
        return Math.min(screenHeight, Math.max(screenHeight, this.getMinHeight(), 0));
    }
    /**
     * Calculates the heights of the DatagridView component.
     * 
     * The method takes into account the height of the parent container, the position of the DatagridView component
     * within the parent container, the minimum and maximum heights of the DatagridView component, and the height of the
     * content container. The method returns an object with the following properties:
     * 
     * - `minHeight`: The minimum height of the DatagridView component.
     * - `maxHeight`: The maximum height of the DatagridView component.
     * - `availableHeight`: The available height of the DatagridView component.
     * - `parentBottom`: The bottom position of the parent container.
     * 
     * @returns {Object} An object with the calculated heights of the DatagridView component.
     */
    calculateHeights() {
        const { containerLayout: { y: parentPageY, height: parentHeight }, contentContainerLayout: { pageY }, toolbarActionsContainerLayout: { height: toolbarHeight } } = this.state;
        const minHeight = this.getMinHeight();
        const maxHeight = this.getMaxHeight();
        //const screenHeight = Dimensions.get("window").height;
        //const bottomPadding = screenHeight - defaultNumber(parentPageY);
        //const containerRelativeY = Math.max(defaultNumber(pageY) - parentPageY, 0);
        //const availableHeight = defaultNumber(Math.max(parentHeight - containerRelativeY - 20, minHeight, 0));
        const availableHeight = maxHeight - defaultNumber(toolbarHeight);
        return {
            minHeight,
            maxHeight,
            availableHeight: Math.max(availableHeight, 100),
        };
    }
    /**
     * Renders the filters component.
     * 
     * The method returns null if the filters should not be shown, otherwise it returns null.
     * 
     * @returns {JSX.Element | null} The filters component or null.
     */
    renderFilters(): JSX.Element | null {
        if (!this.isFilterable()) return null;
        const canShowFilters = this.canShowFilters();
        return <Filter.Group<DataType>
            {...Object.assign({}, { sessionName: this.getSessionName() }, this.props.filterGroupProps)}
            columns={this.props.columns}
            style={[this.props.filterGroupProps?.style, !canShowFilters && Theme.styles.hidden]}
        />;
    }
    render(): JSX.Element | null {
        const testID = this.getTestID();
        const isLoading = this.isLoading();
        const { containerStyle, contentContainerStyle } = this.props;
        const { minHeight, maxHeight, availableHeight } = this.calculateHeights();
        return <DatagridContext.Provider value={this}>
            <View ref={this.containerRef} testID={testID + "-container"} style={[styles.container, isNumber(minHeight) && minHeight > 0 && { minHeight }, { maxHeight }, isLoading && styles.disabled, containerStyle, this.getContainerStyle()]} onLayout={this.onContainerLayout.bind(this)}>
                <View ref={this.toolbarActionsContainerRef} testID={testID + "-toolbar-actions-container"} style={styles.toolbarActionsContainer}>
                    {<DatagridView.Actions />}
                    {this.renderToolbar()}
                    {this.renderFilters()}
                    {this.renderLoadingIndicator()}
                </View>
                <View ref={this.contentContainerRef} testID={testID + "-content-container"} style={[styles.contentContainer, { maxHeight: availableHeight }, contentContainerStyle, this.getContentContainerStyle()]}>
                    {this._render()}
                </View>
            </View>
        </DatagridContext.Provider>
    }
    /**
     * Generates a unique session key based on the provided session name.
     * 
     * The session key is constructed in the format: `datagrid-session-data-{sessionName}`.
     * If the session name is not specified, the default session name is `default`.
     * 
     * @returns {string} The unique session key associated with the DatagridView component.
     */
    getSessionName() {
        return `datagrid-session-data-${defaultStr(this.props.sessionName, "default")}`;
    }
    /**
     * Removes the session data for the DatagridView component associated with the specified session name.
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
     * Removes all session data associated with the DatagridView component.
     * 
     * This function clears all stored data for the session identified by the component's session name.
     * It sets the session data to an empty object, effectively removing any existing data.
     * 
     * @returns {void} This function does not return a value.
     */

    removeAllSessionData() {
        return this.session.set({});
    }
    /**
     * Sets a value in the session data associated with the specified session name.
     * 
     * This function sets a value in the session data associated with the specified session name.
     * If the value is undefined or null, the corresponding key is removed from the session data.
     * If the session name is not a non-null string, the method does nothing.
     * 
     * @param {keyof IDatagridViewState<DataType, StateExtensions> | string} sessionName - The session name associated with the session data to set.
     * @param {any} data - The value to set in the session data.
     * 
     * @returns {any} The updated session data associated with the specified session name.
     */
    setSessionData(sessionName: keyof IDatagridViewState<DataType, StateExtensions> | string, data: any) {
        return this.session.set(sessionName as any, data);
    }
    /**
     * Retrieves the session storage associated with the DatagridView component.
     * 
     * This property returns an object that provides methods for managing session data associated with the DatagridView component.
     * 
     * @returns {IAuthSessionStorage} The authentication session storage associated with the DatagridView component's session name.
     */
    get session() {
        return Auth.Session.getStorage(this.getSessionName());
    }
    /**
    * Retrieves the session data associated with the DatagridView component, or a value from that session data if a session name is provided.
    * 
    * This function retrieves the session data associated with the DatagridView component's session name.
    * If the session name is not a non-null string, the method does nothing and the original session data is returned.
    * If the session name is provided, the corresponding value is returned from the session data.
    * 
    * @param {keyof IDatagridViewState<DataType, StateExtensions> | string} [sessionName] - The session name associated with the value to retrieve from the session data.
    * @returns {any} The session data associated with the DatagridView component, or the value associated with the specified session name.
    */
    getSessionData(sessionName?: keyof IDatagridViewState<DataType, StateExtensions> | string) {
        const data = Object.assign({}, this.session.getData());
        if (isNonNullString(sessionName)) {
            return data[sessionName as keyof typeof data];
        }
        return data;
    }
    /**
     * Registers a view name for the DatagridView component.
     * 
     * The method adds the view name to the list of registered view names.
     * If the view name name is not a non-null string or the component is not a valid function, the method does nothing.
     * 
     * @param {IDatagridRegisterViewOptions} options - The options for registering the view.
     * @param {typeof DatagridView} component - The component class to register for the view name.
     * 
     * @returns {void} This function does not return a value.
     */
    static registerView(options: IDatagridRegisterViewOptions, component: typeof DatagridView) {
        options = Object.assign({}, options);
        const { name: viewName } = options;
        if (!isNonNullString(viewName) || typeof (component) !== "function") return;
        const components = DatagridView.getRegisteredViewsWithOptions();
        (components as any)[viewName] = { ...options, component };
        Reflect.defineMetadata(DatagridView.reflectMetadataKey, components, DatagridView);
    }


    /**
     * Retrieves the registered view options and component classes for all registered views.
     * 
     * This method returns an object containing all registered view names as keys and their associated options and component classes as values.
     * If no views have been registered, the method returns an empty object.
     * 
     * @returns {Record<IDatagridViewName, IDatagridRegisterViewOptions & { component: typeof DatagridView }>} An object containing the registered view options and component classes as well as their associated options.
     */
    static getRegisteredViewsWithOptions(): Record<IDatagridViewName, IDatagridRegisterViewOptions & { component: typeof DatagridView }> {
        const components = Reflect.getMetadata(DatagridView.reflectMetadataKey, DatagridView);
        return isObj(components) ? components : {} as any;
    }


    /**
     * Retrieves the registered view component for the specified view name.
     * 
     * The method looks up the view name in the list of registered view names and returns the associated component class.
     * If the view name is not registered, it returns the DatagridUnimplemented component.
     * 
     * @param {IDatagridViewName} viewName - The view name to retrieve the component for.
     * 
     * @returns {typeof DatagridView} The component class associated with the view name, or the DatagridUnimplemented component.
     */
    static getRegisteredView(viewName: IDatagridViewName): typeof DatagridView<any, any, any> {
        if (!isNonNullString(viewName)) return DatagridUnimplemented;
        const { component } = DatagridView.getRegisteredViewWithOptions(viewName);
        return typeof component === "function" ? component : DatagridUnimplemented;
    }
    /**
     * Retrieves the registered view options and component for a specified view name.
     * 
     * This method looks up the view name in the list of registered views and returns an object
     * containing the view's registration options and the associated component class. If the view name
     * is not a non-null string or is not registered, it returns an empty object with the expected type.
     * 
     * @param {IDatagridViewName} viewName - The name of the view to retrieve the options and component for.
     * 
     * @returns {IDatagridRegisterViewOptions & { component: typeof DatagridView }} An object containing
     * the view's registration options and the associated component class.
     */
    static getRegisteredViewWithOptions(viewName: IDatagridViewName): IDatagridRegisterViewOptions & { component: typeof DatagridView } {
        if (!isNonNullString(viewName)) return {} as IDatagridRegisterViewOptions & { component: typeof DatagridView };
        const components = DatagridView.getRegisteredViewsWithOptions();
        return Object.assign({}, { component: DatagridUnimplemented }, components[viewName as keyof typeof components]);
    }

    /**
     * Retrieves the component class for a specified view name if it is optimized 
     * for the current media type.
     *
     * This method fetches the registered view options for the given view name 
     * and checks if the view is optimized for the current media type 
     * (mobile, tablet, or desktop). If the view is optimized for the current 
     * media, it returns the associated component class; otherwise, it returns null.
     *
     * @param {IDatagridViewName} viewName - The name of the view to retrieve the component for.
     *
     * @returns {typeof DatagridView | null} The component class if the view is optimized 
     * for the current media type, or null if not optimized or not registered.
     */
    static getRendableViewComponent(viewName: IDatagridViewName): typeof DatagridView | null {
        const options = DatagridView.getRegisteredViewWithOptions(viewName);
        if (!options) return null;
        if (Array.isArray(options.optimizedFor) && options.optimizedFor.length) {
            const currentMedia = Breakpoints.isMobileMedia() ? "mobile" : Breakpoints.isTabletMedia() ? "tablet" : "desktop";
            if (!options.optimizedFor.includes(currentMedia)) {
                return null;
            }
            return options.component;
        }
        return null;
    }
    /**
     * Retrieves the names of the views that are optimized for the current media type.
     *
     * This method fetches the registered view options and filters out the views that are
     * not optimized for the current media type (mobile, tablet, or desktop).
     *
     * @returns {IDatagridViewName[]} An array of view names that are optimized for the current media type.
     */
    static getOptimizedRendableViewOptions(): IDatagridViewName[] {
        const views = DatagridView.getRegisteredViewsWithOptions();
        const optimizedViews = Object.keys(views).filter((viewName) => {
            const options = views[viewName as keyof typeof views];
            if (!options) return false;
            if (Array.isArray(options.optimizedFor) && options.optimizedFor.length) {
                const currentMedia = Breakpoints.isMobileMedia() ? "mobile" : Breakpoints.isTabletMedia() ? "tablet" : "desktop";
                return options.optimizedFor.includes(currentMedia);
            }
            return true;
        });
        return optimizedViews as IDatagridViewName[];
    }

    /**
     * Determines whether the given function is a valid aggregation function for the DatagridView component.
     * 
     * An aggregation function is considered valid if it is a function.
     * 
     * @param {IDatagridAggregationFunction<any> | keyof IDatagridAggregationFunctions} aggregationFunction - The aggregation function to validate.
     * @returns {aggregationFunction is IDatagridAggregationFunction} Whether the given aggregation function is valid.
     */
    static isValidAggregationFunction(aggregationFunction: IDatagridAggregationFunction<any> | keyof IDatagridAggregationFunctions): aggregationFunction is IDatagridAggregationFunction {
        if (isNonNullString(aggregationFunction)) {
            const aggregatedFunctions = DatagridView.aggregationFunctions;
            return typeof aggregatedFunctions[aggregationFunction as keyof typeof aggregatedFunctions] === "function";
        }
        return typeof aggregationFunction === "function";
    }

    /**
     * Registers a custom aggregation function for the DatagridView component.
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
        if (!isNonNullString(aggregationFunctionName) || !DatagridView.isValidAggregationFunction(aggregationFunction)) return;
        const aggregationsFunctions = DatagridView.getRegisteredAggregationFunctions();
        (aggregationsFunctions as any)[aggregationFunctionName] = aggregationFunction;
        Reflect.defineMetadata(DatagridView.aggregationFunctionMetadataKey, aggregationsFunctions, DatagridView);
    }
    /**
     * Retrieves the registered aggregation functions for the DatagridView component.
     * 
     * This method accesses the viewName of the DatagridView class to obtain 
     * the list of registered aggregation functions. If no aggregation functions are 
     * registered, it returns an empty object.
     * 
     * @returns {IDatagridAggregationFunctions} 
     * An object mapping aggregation function names to their corresponding functions.
     */

    static getRegisteredAggregationFunctions(): IDatagridAggregationFunctions {
        const aggregationsFunctions = Reflect.getMetadata(DatagridView.aggregationFunctionMetadataKey, DatagridView);
        return isObj(aggregationsFunctions) ? aggregationsFunctions : {} as any;
    }

    static registredColumnsReflectMetadataKey = Symbol("datagrid-registred-columns-reflect-viewName-key");

    /**
     * Registers a column type with its corresponding component in the DatagridView.
     * 
     * This method allows users to add custom column types to the DatagridView by associating a column type name with a component class.
     * If the type is not a non-null string or the component is not a valid function, the method does nothing.
     * 
     * @param {IFieldType} type - The name of the column type to register.
     * @param {typeof DatagridViewColumn} component - The component class to associate with the column type.
     * 
     * @returns {void} This function does not return a value.
     */
    static registerColumn(type: IFieldType, component: typeof DatagridViewColumn) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = DatagridView.getRegisteredColumns();
        components[type] = component;
        Reflect.defineMetadata(DatagridView.registredColumnsReflectMetadataKey, components, DatagridView);
    }

    /**
     * Retrieves the registered column types and their associated components.
     * 
     * This method provides access to the list of column types and their associated components that have been registered
     * using the `registerColumn` method. If no column types have been registered, it returns an empty object.
     * 
     * @returns {Record<IFieldType, typeof DatagridViewColumn>} An object mapping column types to their associated components.
     */
    static getRegisteredColumns(): Record<IFieldType, typeof DatagridViewColumn> {
        const components = Reflect.getMetadata(DatagridView.registredColumnsReflectMetadataKey, DatagridView);
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
     * @returns {typeof DatagridViewColumn} The component class associated with the column type, or the default column component class.
     */
    static getRegisteredColumn(type: IFieldType): typeof DatagridViewColumn {
        const components = DatagridView.getRegisteredColumns();
        return isNonNullString(type) && typeof components[type] === "function" ? components[type] : DatagridViewColumn;
    }


    /**
     * Renders the loading indicator for the DatagridView component.
     *
     * This function checks if the loading indicator can be rendered, and if so,
     * it returns a `DatagridView.LoadingIndicator` component. The loading indicator
     * to be rendered can be customized via the `loadingIndicator` prop. If the
     * `loadingIndicator` prop is a valid React element, it will be rendered
     * directly. Otherwise, the default loading indicator is rendered.
     *
     * @returns {JSX.Element | null} The loading indicator component if it can be
     * rendered, otherwise null.
     */
    renderLoadingIndicator() {
        if (!this.canShowLoadingIndicator()) {
            return null;
        }
        const loadingIndicator = this.props.loadingIndicator;
        return <LoadingIndicator
            Component={function ({ isLoading }: IDatagridViewLoadingIndicatorProps) {
                const datagridContext = useDatagrid();
                const testID = defaultStr(datagridContext?.getTestID(), "resk-datagrid");
                return isValidElement(loadingIndicator) && loadingIndicator ? loadingIndicator : <DefaultLoadingIndicator
                    testID={testID + "-loading-indicator"}
                    isLoading={isLoading}
                />;
                /* return <View testID={testID + "-loading-indicator-container"} style={[isLoading && styles.loadingIndicatorContainer]}>
                    {}
                </View>; */
            }}
        />;
    }
    /**
     * Renders the actions toolbar component for the DatagridView component.
     *
     * This component renders the actions toolbar with the actions specified
     * in the `actions` or `selectedRowsActions` props. If `selectedRowsActions`
     * is present and there are selected rows, it will be used instead of the
     * `actions` prop. The title of the toolbar is automatically set to
     * the number of selected rows, or an empty string if there are no selected
     * rows.
     *
     * @returns {JSX.Element | null} The actions toolbar component if the
     * `showActions` prop is true, otherwise null.
     */
    static Actions() {
        const datagridContext = useDatagrid();
        const { selectedRowsActions, actions, showActions, actionsProps: aProps } = Object.assign({}, datagridContext?.props);
        const { divider, ...actionsProps } = Object.assign({}, aProps);
        const theme = useTheme();
        useDatagridOnEvent(["toggleAllRowsSelection"], true);
        const { actions: actionsToDisplay, title } = useMemo(() => {
            if (!datagridContext) return {
                actions: [],
                title: ""
            };
            const count = defaultNumber(datagridContext?.getSelectedRowsCount());
            const actionsOrCallback = count > 0 ? selectedRowsActions : actions;
            const _actions = typeof actionsOrCallback === "function" ? actionsOrCallback(datagridContext.getCallOptions({} as any)) : actionsOrCallback;
            return { actions: Array.isArray(_actions) ? _actions : [], title: count > 0 ? DatagridView.staticTranslate("selectedActionsCount", { count }) : "" };
        }, [datagridContext?.getSelectedRowsCount()]);
        if (!datagridContext?.canShowActions()) return null;
        const testID = datagridContext?.getTestID();
        const actionsTitle = title || actionsProps.title;
        const appBarActions = Array.isArray(actionsToDisplay) && actionsToDisplay.length ? actionsToDisplay : [];
        const hasActions = appBarActions.length > 0;
        return <View testID={testID + "-actions-container"} style={[styles.actionsToolbar]}>
            <AppBar testID={`${testID}-actions`}
                backAction={false}
                backgroundColor='transparent'
                statusBarHeight={0}
                elevation={0}
                {...Object.assign({}, actionsProps)}
                context={Object.assign({}, actionsProps.context, { datagridContext })}
                right={actionsProps.right || !hasActions && !actionsTitle ? <Button mode='text'>{DatagridView.staticTranslate("actions")}</Button> : null}
                title={actionsTitle}
                actions={appBarActions as any}
            />
            {divider !== false ? <Divider testID={testID + "-actions-divider"} /> : null}
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
 * <DatagridViewColumn renderType="header" value="ID" />
 *
 * @example
 * // Render a column as a cell
 * <DatagridViewColumn renderType="rowCell" value={row.id} />
 *
 * @remarks
 * - Use `"header"` when the column represents a table header (e.g., column titles).
 * - Use `"rowCell"` when the column represents a table cell (e.g., row data).
 *
 * @default "rowCell"
 */
export type IDatagridViewColumnRenderType = "header" | "rowCell";


class DatagridUnimplemented<DataType extends object = any> extends DatagridView<DataType> {
    _render() {
        return <Label colorScheme="error" fontSize={20} textBold>
            {"No Datagrid View found for datagrid"}
        </Label>
    }
}

export type IDatagridProps<DataType extends object = any, PropsExtensions = unknown> = IDatagridViewProps<DataType, PropsExtensions> & {
    /**
     * The view name to use for the grid.
     * 
     * This property is used to specify the view name that should be used for the grid.
     * 
     * @see {@link IDatagridViewName} for more information about view name names.
     */
    viewName?: IDatagridViewName;
} & {
    /**
     * A mapped type that creates a union of props for different views.
     *
     * For each view name `K` in `IDatagridViewName`, it creates a property `${K}ViewProps` that is optional (`?`) and has a type of `IDatagridViews<DataType>[K]`.
     * If `IDatagridViews<DataType>[K]` is a subclass of `DatagridView<DataType>`, then the property type is `IDatagridViews<DataType>[K]`, otherwise it is an empty object (`{}`).
     */
    [K in IDatagridViewName as `${K}ViewProps`]?: Partial<(keyof IDatagridViews<DataType>[K] extends never ? never : IDatagridViews<DataType>[K])>;
};

export interface IDatagridViewColumnState<DataType extends object = any> {
    panResponder: PanResponderInstance;
}

/**
 * A base class for DatagridView columns.
 * 
 * This class provides a basic implementation for a DatagridView column, and can be extended to create custom columns.
 * 
 * @template DataType - The type of the data shown in the grid.
 * @template PropExtensions - The type of the component's props. This type is used to extend the component's props with additional properties.
 * @template StateExtensions - The type of the component's state.
 */
class DatagridViewColumn<DataType extends object = any, PropExtensions = unknown, StateExtensions = unknown> extends Component<IDatagridViewStateColumn<DataType> & { rowData?: DataType, renderType?: IDatagridViewColumnRenderType, datagridContext: DatagridView<DataType, any, any> } & PropExtensions, StateExtensions & IDatagridViewColumnState<DataType>> {
    private panResizingOptions = {
        startX: 0,
        startWidth: 0,
        width: 0,
    }

    /**
     * Returns whether the column is resizable.
     * 
     * This method checks both the `resizable` property of the column and the `isResizable` method of the datagrid context.
     * If both are true, it returns true, otherwise it returns false.
     * 
     * @returns {boolean} Whether the column is resizable.
     */
    isResizable(): boolean {
        return false;
        return this.props.resizable !== false && !!this.getDatagridContext()?.isResizable();
    }
    readonly state: StateExtensions & IDatagridViewColumnState<DataType> = {
        panResponder: PanResponder.create({
            onStartShouldSetPanResponder: () => this.isResizable(),
            onMoveShouldSetPanResponder: () => this.isResizable(),
            onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                this.panResizingOptions.startX = gestureState.x0;
                this.panResizingOptions.width = this.panResizingOptions.width || 0;
            },
            onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                // Calculate the delta movement
                const { startX, startWidth } = this.panResizingOptions;
                const dx = gestureState.moveX - startX;

                // Calculate new width ensuring it doesn't go below min width
                const minWidth = Math.max(this.getMinWidth(), 50); // Default min width
                const oldWidth = this.panResizingOptions.width;
                const newWidth = Math.max(minWidth, startWidth + dx);
                const column = this.getColumn();
                if (!column) return;
                this.panResizingOptions.width = newWidth;// Ensure width doesn't go below min width
                this.getDatagridContext()?.onColumnResize({ column, oldWidth, newWidth, gestureEvent: evt, gestureState });
            },
            onPanResponderRelease: () => {
                this.panResizingOptions.startX = 0;
                this.panResizingOptions.startWidth = 0;
            },
            onPanResponderTerminate: () => {
                this.panResizingOptions.startX = 0;
                this.panResizingOptions.startWidth = 0;
            }
        })
    } as any;
    /**
     * Returns the DatagridView context.
     * 
     * This method provides access to the DatagridView component's state and methods.
     * 
     * @returns The DatagridView context.
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
    getName(): IDatagridViewColumnName<DataType> {
        return defaultStr(this.props.name) as IDatagridViewColumnName<DataType>;
    }
    /**
     * Checks if the column is groupable.
     * 
     * This method checks if the column is groupable by calling the DatagridView context's isGroupable method.
     * 
     * @returns True if the column is groupable, false otherwise.
     */
    isGroupable() {
        return this.getDatagridContext().isGroupable() && this.props.groupable !== false;
    }
    /**
     * Checks if the column is filtrable.
     * 
     * This method checks if the column is filtrable by calling the DatagridView context's isFilterable method.
     * 
     * @returns True if the column is filtrable, false otherwise.
     */
    isFilterable() {
        return this.getDatagridContext().isFilterable() && this.props.filterable !== false;
    }
    /**
     * Checks if the column is sortable.
     * 
     * This method checks if the column is sortable by calling the DatagridView context's isSortable method.
     * 
     * @returns True if the column is sortable, false otherwise.
     */
    isSortable() {
        return this.getDatagridContext().isSortable() && this.props.sortable !== false;
    }
    /**
     * Checks if the column is aggregatable.
     * 
     * This method checks if the column is aggregatable by calling the DatagridView context's isAggregatable method.
     * 
     * @returns True if the column is aggregatable, false otherwise.
     */
    isAggregatable() {
        return this.getDatagridContext().isAggregatable() && this.props.aggregatable === true;
    }
    /**
     * Returns the list of aggregatable columns.
     * 
     * This method returns the list of columns that are aggregatable in the DatagridView context.
     * 
     * @returns The list of aggregatable columns.
     */
    getAggregatableColumns() {
        return this.getDatagridContext().getAggregatableColumns();
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
        return this.getDatagridContext().computeCellValue(this.getName(), rowData, format);
    }
    /**
     * Returns a state column definition by name.
     * 
     * This method returns the column definition from the DatagridView context.
     * 
     * @param colName The name of the column to retrieve. If not provided, it defaults to the current column's name.
     * @returns The column definition.
     */
    getColumn(colName?: string) {
        return this.getDatagridContext().getColumn(defaultStr(colName, this.getName()));
    }
    /**
     * Returns the list of statecolumns.
     * 
     * This method returns the list of columns from the DatagridView context.
     * 
     * @returns The list of columns.
     */
    getColumns(): IDatagridViewStateColumn<DataType>[] {
        const columns = this.getDatagridContext().state.columns;
        return Array.isArray(columns) ? columns : [];
    }
    /**
     * Returns the list of visible state columns.
     * 
     * This method returns the list of visible columns from the DatagridView context.
     * 
     * @returns The list of visible columns.
     */
    getVisibleColumns(): IDatagridViewStateColumn<DataType>[] {
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
    getTestID() {
        return defaultStr(this.props.testID, this.getDatagridContext().getTestID() + "-column" + this.getName() + (this.isRowCell() ? "-cell" : "-header"));
    }
    /**
     * Renders the column as a row cell.
     * 
     * This method renders the column as a row cell, using the provided row data and label props.
     * 
     * @returns The rendered column.
     */
    renderRowCell(): React.ReactNode {
        const { labelProps, rowData } = this.props;
        if (!rowData || !this.isRowCell()) {
            return null;
        }
        const column = this.getColumn();
        if (!this.isValidColumn(column)) return null;
        const datagridContext = this.getDatagridContext();
        const children = typeof this.props.renderRowCell == "function" ? this.props.renderRowCell(datagridContext.getCallOptions({ column, rowData: rowData })) : null;
        const testID = this.getTestID();
        return <View testID={testID} style={[styles.columnHeaderOrCell, this.getStyle()]}>
            <Label wrapText numberOfLines={10} {...labelProps} testID={testID + "-label"} >{
                children !== null && children != undefined && (["number", "boolean"].includes(typeof children) || children) ? children
                    : this.renderRowCellContent()}</Label>
        </View>;
    }
    /**
     * Renders the content of the row cell.
     * 
     * This method renders the content of the row cell by computing the value of the column based on the provided row data and formatting it.
     * 
     * @returns The rendered row cell content.
     */
    renderRowCellContent(): ReactNode {
        return this.computeCellValue(this.props.rowData as DataType, true);
    }

    /**
     * Checks if the column is a valid column.
     * 
     * This method checks if the column is a valid column by checking its name and whether it is an object.
     * 
     * @param {any} column - The column to check.
     * 
     * @returns {column is IDatagridViewStateColumn<DataType>} True if the column is a valid column, false otherwise.
     */
    isValidColumn(column: any): column is IDatagridViewStateColumn<DataType> {
        return this.getDatagridContext().isValidColumn(column);
    }
    /**
     * Gets the row data.
     * 
     * This method returns the row data, if the column is a row cell.
     * 
     * @returns The row data, or null if the column is not a row cell.
     */
    getRowData(): DataType | null {
        if (!this.isRowCell()) return null;
        return this.props.rowData as DataType;
    }

    /**
     * Gets the style for the column, depending on whether it is a row cell or a header.
     * 
     * If the column is a row cell, this method calls `getTableCellStyle` on the datagrid context, passing the column configuration and the row data.
     * If the column is a header, this method calls `getTableColumnHeaderStyle` on the datagrid context, passing the column configuration.
     * 
     * @returns The style for the column, or null if the column is not a valid column.
     */
    getStyle(): IViewStyle {
        const datagridContext = this.getDatagridContext();
        const column = this.getColumn();
        if (!column) return null;
        if (this.isRowCell()) {
            return datagridContext.getTableCellStyle(column, this.getRowData() as DataType);
        }
        return datagridContext.getTableColumnHeaderStyle(column);
    }

    /**
     * Returns the width of the column in pixels.
     * 
     * This method returns the width of the column by retrieving the column width from the datagrid context.
     * If the column does not exist or the column width is not specified, this method returns 0.
     * 
     * @returns The width of the column in pixels.
     */
    getWidth(): number {
        const column = this.getColumn();
        if (!column) return 0;
        return this.getDatagridContext()?.getColumnWidth(column.name) || 0;
    }

    /**
     * Returns the minimum width of the column in pixels.
     * 
     * This method returns the value of the `minWidth` prop if it is a number, otherwise it returns 0.
     * 
     * @returns The minimum width of the column in pixels.
     */
    getMinWidth(): number {
        return defaultNumber(this.props.minWidth);
    }
    /**
     * Returns the style for the column width.
     * 
     * This method returns a style object with a single property, `width`, which is the width of the column in pixels.
     * The width is determined by calling `getWidth`, which returns 0 if the column does not exist or the column width is not specified.
     * 
     * @returns The style object with the width of the column in pixels.
     */
    getWidthStyle(): IViewStyle {
        return { width: this.getWidth() };
    }


    renderResizeHandle() {
        if (!this.isResizable()) return null;
        return (
            <View
                testID={this.getTestID() + "-resize-handle"}
                style={[styles.resizeHandle, {
                    borderRightColor: Theme.colors.outline,
                    backgroundColor: Colors.setAlpha(Theme.colors.surface, 0.2),
                }]}
                {...this.state.panResponder.panHandlers}
            />
        )
    }

    /**
     * Renders the column as a header.
     * 
     * This method renders the column as a header, using the provided label props.
     * 
     * @returns The rendered column.
     */
    renderHeader(): React.ReactNode {
        const { labelProps, rowData } = this.props;
        const column = this.getColumn();
        if (!this.isValidColumn(column)) return null;
        const datagridContext = this.getDatagridContext();
        if (!datagridContext) return null;
        const header = typeof this.props.renderHeader == "function" ? this.props.renderHeader(datagridContext.getCallOptions({ column })) : null;
        const testId = this.getTestID();
        return <Pressable onPress={(event) => { this.sort() }} disabled={!this.isSortable()} style={[styles.columnHeaderOrCell, this.getStyle()]} testID={testId}>
            <View testID={testId + "-content-container"} style={[styles.columnHeaderContentContainer]}>
                <View testID={testId + "-label-container"} style={[styles.columnHeaderLabelContainer]}>
                    {header && isValidElement(header) ? header : <Label testID={testId + "-label"} textBold {...labelProps} >{this.props.label}</Label>}
                </View>
                <SortIcon
                    columnName={column.name}
                    columnType={this.getType()}
                />
                {this.renderResizeHandle()}
            </View>
        </Pressable>
    }
    renderHeaderChildren(): JSX.Element | null {
        return null;
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
        return this.getDatagridContext().getSortIcon(this.getName(), this.getType());
    }
    /**
     * Initiates sorting on the column if it is a header.
     * 
     * This method checks if the column is a header and, if so, triggers the sorting functionality
     * for the column using the DatagridView context. The sorting is performed based on the column's name.
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
 * A decorator to attach a column to the DatagridView component.
 * 
 * This decorator registers the column with the DatagridView component, making it available for use.
 * 
 * @param type The type of the column to attach.
 * @returns A decorator function that registers the column.
 */
export function AttachDatagridViewColumn<DataType extends object = any, PropsExtensions = unknown, StateExtensions = unknown>(type: IFieldType) {
    return (target: typeof DatagridViewColumn<DataType, PropsExtensions, StateExtensions>) => {
        /**
         * Registers the column with the DatagridView component.
         * 
         * This method adds the column to the DatagridView component's registry, making it available for use.
         */
        DatagridView.registerColumn(type, target as any);
    };
}

/**
 * A decorator to attach a view to the DatagridView component.
 * 
 * This decorator registers the view with the DatagridView component using the provided options,
 * making it available for use. The view is associated with a specific view name, which must be a non-null string.
 * 
 * @template DataType - The type of the data shown in the grid.
 * @template PropsExtensions - The type of the component's props, used to extend the component's props with additional properties.
 * @template StateExtensions - The type of the component's state, used to extend the component's state with additional properties.
 * 
 * @param {IDatagridRegisterViewOptions} options - The options for registering the datagrid view.
 * 
 * @returns A decorator function that registers the view.
 */

export function AttachDatagridView<DataType extends object = any, PropsExtensions = unknown, StateExtensions = unknown>(options: IDatagridRegisterViewOptions) {
    return (target: typeof DatagridView<DataType, PropsExtensions, StateExtensions>) => {
        DatagridView.registerView(options, target as typeof DatagridView);
    };
}



/**
 * Datagrid component for rendering data views.
 * 
 * This component determines the appropriate view to render based on the provided view name(s).
 * It utilizes registered views from `DatagridView` and ensures that only valid views are selected.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * 
 * @param {IDatagridProps<DataType, {}>} props - The properties for the Datagrid component, including view names and additional props.
 * @returns {JSX.Element} - The rendered component corresponding to the selected view.
 * 
 * @remarks
 * - Uses `useDimensions` to handle responsive design.
 * - Computes the current view and view names using `useMemo`.
 * - Manages state with `useState` and effects with `useEffect`.
 * - Renders the appropriate `DatagridView` component based on the selected view name.
 */

const Datagrid = function Datagrid<DataType extends object = any>({ viewName: cViewName, viewNames: cViewNames, ...props }: IDatagridProps<DataType, {}>) {
    const dimensions = useDimensions();
    const sessionName = "datagrid";
    const session = useMemo(() => {
        return Auth.Session.getStorage(sessionName);
    }, [sessionName]);
    const { viewNames, viewName } = useMemo(() => {
        const optimizedViews = DatagridView.getOptimizedRendableViewOptions();
        const registeredViewNames = Object.keys(DatagridView.getRegisteredViewsWithOptions()) as IDatagridViewName[];
        const viewNameFromSession = session.get("viewName");
        const viewNames = (Array.isArray(cViewNames) && cViewNames.length) ? cViewNames.filter((vName) => registeredViewNames.includes(vName)) : registeredViewNames;
        return {
            viewNames,
            viewName: isNonNullString(cViewName) && viewNames.includes(cViewName) ? cViewName : viewNameFromSession && registeredViewNames.includes(viewNameFromSession) ? viewNameFromSession : optimizedViews[0] || viewNames[0]
        }
    }, [cViewName, cViewNames, dimensions.width, dimensions.height]);
    const [state, setState] = useStateCallback({ viewName, viewNames });
    const { Component, restProps, options: viewOptions } = useMemo<{ Component: typeof DatagridView<DataType>, restProps: any, options: IDatagridRegisterViewOptions }>(() => {
        const { component, ...options } = DatagridView.getRegisteredViewWithOptions(state.viewName);
        return {
            Component: component,
            options,
            restProps: isNonNullString(state.viewName) ? Object.assign({}, (props as any)[`${state.viewName}ViewProps`]) : {}
        }
    }, [state.viewName]);
    if (!Component) {
        return <View
            testID={'datagrid-view-invalid'}
            style={[Theme.styles.centered, Theme.styles.w100]}
        >
            <Label textBold colorScheme='error'>
                {`Invalid Datagrid view name: ${defaultStr(state.viewName, 'N/A')}`}
            </Label>
        </View>;
    }
    return <Component
        {...props as any}
        {...restProps}
        onToggleView={(options) => {
            if (!options.viewName || viewName === options.viewName) return;
            setState({ ...state, viewName: options.viewName }, () => {
                session.set("viewName", options.viewName);
                if (typeof props.onToggleView === "function") {
                    props.onToggleView(options);
                }
            });
        }}
        viewNames={viewNames}
    />;
};


/**
 * A loading indicator component for the DatagridView.
 * 
 * This static method renders a custom loading indicator component based on the 
 * current loading state of the DatagridView. It listens for "toggleIsLoading" events 
 * from the DatagridView context to update the loading state. The loading state is 
 * managed internally using React's state and effect hooks.
 * 
 * @param {Object} param - The function parameter.
 * @param {IReactComponent<IDatagridViewLoadingIndicatorProps>} param.Component - The component to render as the 
 * loading indicator. It receives the `isLoading` prop to determine its display.
 * 
 * @returns {JSX.Element | null} The rendered loading indicator component, or null 
 * if the provided Component is not a function.
 */
function LoadingIndicator({ Component }: { Component: IReactComponent<IDatagridViewLoadingIndicatorProps> }) {
    const datagridContext = useDatagrid();
    const canShowLoadingIndicator = !!datagridContext?.canShowLoadingIndicator();
    const [isLoading, _setIsLoading] = React.useState(canShowLoadingIndicator);
    const isMounted = useIsMounted();
    const setIsLoading = (nLoading: boolean) => {
        if (!isMounted() || nLoading == isLoading) return;
        _setIsLoading(nLoading);
    };
    useDatagridOnEvent("toggleIsLoading", (newIsLoading) => {
        setIsLoading(newIsLoading?.isLoading);
        return false;
    });
    useEffect(() => {
        const loading: boolean = !!datagridContext?.canShowLoadingIndicator();
        if (loading !== isLoading) {
            setIsLoading(loading);
        }
    }, [datagridContext?.canShowLoadingIndicator()]);
    return typeof Component !== "function" ? null : <Component isLoading={isLoading} />;
};
LoadingIndicator.displayName = "Datagrid.LoadingIndicator";
/**
 * A component to display the sort icon for a given column.
 * 
 * This component will render the appropriate sort icon for the given column name and type.
 * If the column is not sortable or not part of the current sorting order, it will return null.
 * It uses the `getSortIcon` method of the DatagridView context to determine the sort icon.
 * 
 * @param {{ columnName: IDatagridViewColumnName<DataType>, columnType?: IFieldType }} props - The component props.
 * @param {columnName: IDatagridViewColumnName<DataType>} props.columnName - The name of the column to display the sort icon for.
 * @param {IFieldType} [props.columnType] - The type of the column. If not provided, it is determined from the column definition.
 * 
 * @returns {React.ReactNode | null} The rendered sort icon component, or null if the column is not sortable.
 */
function SortIcon<DataType extends object = any>({ columnName, columnType }: { columnName: IDatagridViewColumnName<DataType>, columnType?: IFieldType }) {
    const datagrid = useDatagrid();
    useDatagridOnEvent("columnSorted", true);
    if (!datagrid) return null;
    const sortIcon = datagrid.getSortIcon(columnName, columnType);
    if (!sortIcon) return null;
    const testID = datagrid.getTestID();
    return <FontIcon testID={testID + "-sort-icon"} color={Theme.colors.primary} size={25} name={sortIcon} />;
}
SortIcon.displayName = "Datagrid.SortIcon";
/**
 * A loading indicator component for the DatagridView that uses the ProgressBar
 * component to show an indeterminate progress bar at the bottom of the
 * DatagridView. It listens for "toggleIsLoading" events from the DatagridView context
 * to update the loading state. The loading state is managed internally using
 * React's state and effect hooks.
 * 
 * @param {IDatagridViewLoadingIndicatorProps & IProgressBarProps} props - The properties for the
 * loading indicator.
 * @param {boolean} props.isLoading - The boolean indicating whether the
 * DatagridView is in a loading state.
 * 
 * @returns {JSX.Element | null} The rendered loading indicator component, or
 * null if the loading indicator is not to be rendered.
 */
function ProgressBarLoadingIndicator({ isLoading, ...props }: IDatagridViewLoadingIndicatorProps & IProgressBarProps) {
    return <ProgressBar indeterminate visible={isLoading} {...props} />;
}

/**
 * A default loading indicator component for the DatagridView that uses the
 * ProgressBarLoadingIndicator loading indicator component to show an
 * indeterminate progress bar at the bottom of the DatagridView. It listens
 * for "toggleIsLoading" events from the DatagridView context to update the
 * loading state. The loading state is managed internally using
 * React's state and effect hooks.
 * @param {IDatagridViewLoadingIndicatorProps} props - The properties for the
 * loading indicator.
 * @param {boolean} props.isLoading - The boolean indicating whether the
 * DatagridView is in a loading state.
 * @returns {JSX.Element | null} The rendered loading indicator component, or
 * null if the loading indicator is not to be rendered.
 */
function DefaultLoadingIndicator({ isLoading }: IDatagridViewLoadingIndicatorProps) {
    return <ProgressBarLoadingIndicator isLoading={isLoading} />
}


/**
 * A loading indicator component for the DatagridView that uses the Preloader
 * component to show a loading indicator that covers the entire screen.
 * It listens for "toggleIsLoading" events from the DatagridView context to
 * update the loading state. The loading state is managed internally using
 * React's state and effect hooks.
 * 
 * @param {IDatagridViewLoadingIndicatorProps & IPreloaderProps} props - The properties for the
 * loading indicator.
 * @param {boolean} props.isLoading - The boolean indicating whether the
 * DatagridView is in a loading state.
 * 
 * @returns {JSX.Element | null} The rendered loading indicator component, or
 * null if the loading indicator is not to be rendered.
 */
function PreloaderLoadingIndicator({ isLoading, ...props }: IDatagridViewLoadingIndicatorProps & IPreloaderProps) {
    const hasShownPreloaderRef = useRef(false);
    useEffect(() => {
        if (isLoading) {
            Preloader.open(props);
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
 * A component that displays the aggregated value for a given column.
 * It renders a button that when pressed shows a menu with all the available
 * aggregation functions for the given column. The selected aggregation function
 * is highlighted in the menu.
 * The component uses the `getAggregationFunctions` method of the DatagridView
 * context to get the list of available aggregation functions for the given column.
 * The component uses the `getAggregationFunctionsTranslations` method of the
 * DatagridView context to get the translations for the aggregation functions.
 * The component uses the `canShowAggregatedValues` method of the DatagridView
 * context to determine if the aggregated values are to be shown.
 * @example
 * <AggregatedValue values={{sum:10, count: 20}} column="myColumn" />
 */
function AggregatedValue<DataType extends object = any>({ values, column }: { values: Record<keyof IDatagridAggregationFunctions, number>, column: IDatagridViewColumnName<DataType> }) {
    const datagridContext = useDatagrid();
    useDatagridOnEvent("aggregationFunctionChanged", true);
    useDatagridOnEvent("abreviateAggregatableValuesChanged", true);
    const columnObj = datagridContext?.getColumn(column);
    const datagridAggregationFunction = datagridContext?.getAggregationFunction() || "sum";
    const prevDatagridAggregationFunc = usePrevious(datagridAggregationFunction);
    const abreviate = !!datagridContext?.canAbreviateAggregatableValues();
    const [aggregationFunction, setAggregationFunction] = useState<keyof IDatagridAggregationFunctions>(datagridAggregationFunction);
    useEffect(() => {
        if (datagridAggregationFunction !== aggregationFunction && prevDatagridAggregationFunc !== datagridAggregationFunction) {
            setAggregationFunction(datagridAggregationFunction);
        }
    }, [datagridAggregationFunction, prevDatagridAggregationFunc]);
    const formatValue = (aggregationFunction: keyof IDatagridAggregationFunctions) => {
        if (!isObj(columnObj)) return 0;
        const value = values[aggregationFunction];
        if (!isNumber(value)) return 0;
        if (aggregationFunction == "count") {
            return value.formatNumber();
        }
        return InputFormatter.formatValue({ ...columnObj, abreviateNumber: abreviate || !!columnObj?.abreviateNumber, value }).formattedValue;
    }
    const aggregatedValue = useMemo(() => {
        if (!isObj(columnObj)) return 0;
        return formatValue(aggregationFunction);
    }, [values, aggregationFunction, columnObj, abreviate]);
    const aggregations = datagridContext?.getAggregationFunctions();
    const aggretionsTranslations = datagridContext?.getAggregationFunctionsTranslations();
    const menuItems = useMemo(() => {
        if (!isObj(aggretionsTranslations) || !isObj(aggregations)) return [];
        const items = [];
        if (!isObj(values)) return [];
        for (let i in aggregations) {
            const label = defaultStr((aggretionsTranslations as any)[i], i);
            const active = aggregationFunction === i;
            items.push({
                label: `${label} : ${formatValue(i as any)}`,
                icon: active ? "check" : null,
                onPress: () => {
                    setAggregationFunction(i as any);
                }
            });
        }
        return items;
    }, [aggregationFunction, aggretionsTranslations, values, columnObj, abreviate]);
    if (!columnObj || !isObj(values) || !datagridContext || !datagridContext?.canShowAggregatedValues()) return null;
    const testID = datagridContext.getTestID();
    return <Menu
        responsive
        items={menuItems as any}
        testID={testID + "-aggregated-value-menu"}
        anchor={<View testID={testID + "-aggregated-value-container"}>
            <Label textBold numberOfLines={10} wrapText fontSize={16} colorScheme="primary">
                {aggregatedValue}
            </Label>
        </View>}
    />
}

/**
 * A button component that is designed to be used within the DatagridView component's toolbar.
 * 
 * This component is a wrapper around the Button component, with some additional features that are specific to the DatagridView component.
 * It provides a convenient way to add buttons to the toolbar, with automatic integration with the DatagridView component's context.
 * 
 * @template DataType - The type of the data shown in the grid.
 * @param {IButtonProps<{ datagridContext: DatagridView<DataType> }>} props - The props of the button component.
 * @returns {JSX.Element} - The rendered button component.
 */
function DatagridToolbarAction<DataType extends object = any>({ testID, ...props }: IButtonProps<{ datagridContext: DatagridView<DataType> }>) {
    const datagridContext = useDatagrid();
    return <Button
        noPadding
        {...props}
        style={[styles.button, props.style]}
        context={Object.assign({}, (props as any).context, { datagridContext })}
    />
}
DatagridToolbarAction.displayName = "Datagrid.ToolbarAction";

AggregatedValue.displayName = "Datagrid.AggregatedValue";
Datagrid.AggregatedValue = AggregatedValue;
Datagrid.View = DatagridView;
Datagrid.LoadingIndicator = LoadingIndicator;
Datagrid.displayName = "Datagrid";
Datagrid.DefaultLoadingIndicator = DefaultLoadingIndicator;
Datagrid.PreloaderLoadingIndicator = PreloaderLoadingIndicator;
Datagrid.View = DatagridView;
Datagrid.SortIcon = SortIcon;
Datagrid.ToolbarAction = DatagridToolbarAction;


/**
 * Renders a button that toggles the selection state of all rows in the DatagridView component.
 * 
 * This component is a convenience wrapper around the `toggleAllRowsSelection` method of the DatagridView component.
 * It uses the `useDatagrid` and `useDatagridOnEvent` hooks to access the DatagridView context and to trigger the "toggleAllRowsSelection" event.
 * The component returns null if the DatagridView is not selectable or if there is no data to select.
 * Otherwise, it renders a button with the "selectAll" or "unselectAll" label, depending on the current selection state.
 * When the button is pressed, it calls the `toggleAllRowsSelection` method of the DatagridView component.
 */
Datagrid.ToggleAllRowsSelection = function ToggleAllRowsSelection() {
    const datagridContext = useDatagrid();
    useDatagridOnEvent(["toggleAllRowsSelection", "toggleRowSelection"], true);
    if (!datagridContext || !datagridContext?.isSelectable() || !datagridContext?.getData()?.length) return null;
    const isAllRowsSelected = datagridContext?.isAllRowsSelected();
    const title = DatagridView.staticTranslate(isAllRowsSelected ? "unselectAll" : "selectAll", { count: defaultNumber(datagridContext?.getData()?.length) });
    return <DatagridToolbarAction
        role="none"
        icon={isAllRowsSelected ? "select-off" : "check"}
        title={title}
        children={title}
        onPress={() => {
            datagridContext.toggleAllRowsSelection();
        }}
    />;
};

DefaultLoadingIndicator.displayName = "Datagrid.DefaultLoadingIndicator";
PreloaderLoadingIndicator.displayName = "Datagrid.PreloaderLoadingIndicator";

export { Datagrid };

/****************** export interfaces section */


/**
 * Represents the options for a DatagridView call.
 * 
 * @template DataType - The type of the data shown in the grid.
 */
export interface IDatagridViewCallOptions<DataType extends object = any, PropsExtensions = unknown, StateExtensions = unknown> {
    /**
     * The DatagridView context.
     * 
     * This property provides access to the DatagridView component's state and methods.
     */
    datagridContext: DatagridView<DataType, PropsExtensions, StateExtensions>;
}
/**
 * @typedef IDatagridViewProps
 * Represents the properties for the `DatagridView` component.
 * 
 * @template DataType - The type of the data shown in the grid.
 */
export type IDatagridViewProps<DataType extends object = any, PropsExtensions = unknown> = {
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

    /***
     * Whether selection is enabled for the grid.
     * If false, the grid does not allow selection of rows.
     */
    selectable?: boolean;

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
    containerStyle?: IViewStyle;

    /** The style to apply to the content container. 
     * 
     * This property is used to customize the appearance of the grid.
    */
    contentContainerStyle?: IViewStyle;

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
    columns: IDatagridViewColumnProps<DataType>[];

    /**
     * The order by configuration for the grid.
     * 
     * This property is used to specify the order by configuration for the grid.
     * 
     * @see {@link IDatagridViewOrderBy} for more information about order by configurations.
     */
    orderBy?: IDatagridViewOrderBy<DataType>;

    /**
     * A function to get the key for a row.
     * 
     * This property is used to specify a custom function for getting the key for a row.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns The key for the row.
     */
    getRowKey?: (options: IDatagridViewCallOptions<DataType, PropsExtensions> & { rowData: DataType }) => string | number;

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
    isRowSelectable?: (options: IDatagridViewCallOptions<DataType, PropsExtensions> & { rowData: DataType }) => boolean;

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
    rowDataMutator?: (options: IDatagridViewCallOptions<DataType, PropsExtensions> & { rowData: DataType }) => DataType;

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
     * @see {@link IDatagridViewPagination} for more information about pagination configurations.
     */
    pagination?: Partial<IDatagridViewPagination>;

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
     * When the `isLoading` prop is set to `true`, the `loadingIndicator` will be shown in place of the actual data.
     * If no `loadingIndicator` is provided, the datagrid will not display any loading UI.
     *
     * @type {React.ReactNode}
     * @example
     * // Using a custom progress bar component
     * <DatagridView
     *   isLoading={true}
     *   loadingIndicator={<LoadingIndicator />}
     * />
     *
     * @example
     * // Using a simple text-based loading indicator
     * <DatagridView
     *   isLoading={true}
     *   loadingIndicator={<Text>Loading...</Text>}
     * />
     *
     * @example
     * // No loading indicator (default behavior)
     * <DatagridView
     *   isLoading={true}
     * />
     *
     * @remarks
     * - The `loadingIndicator` is only rendered when the `isLoading` prop is `true`.
     * - You can pass any valid React element, including functional components, class components, or HTML elements.
     * - If you pass `null` or omit this prop, no loading indicator will be shown.
     */
    loadingIndicator?: JSX.Element | null;


    /**
     * Defines the actions that can be performed within the DatagridView component.
     * 
     * The `actions` property allows you to specify a list of actions or a function that dynamically generates actions
     * based on the current state of the DatagridView. These actions can be shown in the DatagridView's toolbar or other interactive elements.
     * 
     * @type {(IDatagridAction | null)[] | ((dataTableContext: DatagridView<DataType>) => (IDatagridAction | null)[])}
     * 
     * @template DataType - The type of the data shown in the grid.
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
     * <DatagridView
     *   data={data}
     *   columns={columns}
     *   actions={actions}
     * />
     * ```
     * 
     * @remarks
     * - The `actions` property can be a static array of actions or a function that dynamically generates actions based on the DatagridView's state.
     * - Each action must conform to the `IDatagridAction` interface.
     * - If no actions are provided, the toolbar will not display any actions.
     * 
     * @see {@link IDatagridAction} for the structure of an action.
     */
    actions?: (IDatagridAction | null)[] | ((options: IDatagridViewCallOptions<DataType, PropsExtensions>) => (IDatagridAction | null)[]);

    /**
     * Controls whether the set of action buttons is displayed on top of the datagrid.
     * When set to `true`, the action buttons will be visible.
     * When set to `false`, the action buttons will be hidden.
     *
     * @default true
     * @type {boolean}
     * @example
     * <DataGrid showActions={false} />
     */
    showActions?: boolean;

    /***
     * The props to pass to the actions toolbar.
     */
    actionsProps?: Partial<Omit<IAppBarProps, "children" | "actions">> & {
        /***
         * Whether to render a divider (after actions) between the actions and the content.
         */
        divider?: boolean;
    };

    /**
     * Defines the actions that can be performed on the selected rows within the DatagridView component.
     * 
     * The `selectedRowsActions` property allows you to specify a list of actions or a function that dynamically generates actions
     * based on the current state of the DatagridView and the selected rows. These actions can be shown in the DatagridView's toolbar
     * or other interactive elements.
     * 
     * @type {(IDatagridAction | null)[] | ((dataTableContext: DatagridView<DataType>) => (IDatagridAction | null)[])}
     * 
     * @template DataType - The type of the data shown in the grid.
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
     * <DatagridView
     *   data={data}
     *   columns={columns}
     *   selectedRowsActions={selectedRowsActions}
     * />
     * ```
     * 
     * @example
     * ```typescript
     * const dynamicActions = (datagridContext: DatagridView<any>) => {
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
     * <DatagridView
     *   data={data}
     *   columns={columns}
     *   selectedRowsActions={dynamicActions}
     * />
     * ```
     * 
     * @remarks
     * - The `selectedRowsActions` property can be a static array of actions or a function that dynamically generates actions based on the DatagridView's state and selected rows.
     * - Each action must conform to the `IDatagridAction` interface.
     * - If no actions are provided, the toolbar will not display any actions for selected rows.
     * 
     * @see {@link IDatagridAction} for the structure of an action.
     */
    selectedRowsActions?: (IDatagridAction | null)[] | ((dataTableContext: DatagridView<DataType>) => (IDatagridAction | null)[]);

    /**
     * Whether to display headers in the DatagridView.
     */
    showHeaders?: boolean;

    /***
     * Whether to display filters in the DatagridView.
     */
    showFilters?: boolean;

    /**
     * Controls whether the aggregated totals are displayed in the grid.
     * When set to `true`, the aggregated totals (e.g., sums, averages) will be visible.
     * When set to `false`, the aggregated totals will be hidden.
     *
     * @default true
     * @type {boolean}
     * @example
     * <DataGrid showAggregatedValues={false} />
     */
    showAggregatedValues?: boolean;

    /***
     * A flag indicating whether to show only the aggregated totals.
     * Default is to false
     */
    showOnlyAggregatedValues?: boolean;

    /**
     * Controls whether the toolbar is displayed.
     * When set to `true`, the toolbar will be visible.
     * When set to `false`, the toolbar will be hidden.
     *
     * @default true
     * @type {boolean}
     * @example
     * <DataGrid showToolbar={false} />
     */
    showToolbar?: boolean;

    /**
     * Allows adding extra actions to the toolbar.
     * This prop accepts either:
     * - A function that returns an array of React nodes (e.g., buttons), or
     * - An array of React nodes directly.
     *
     * @type {((datagridContext: DatagridView<DataType>) => ((IDatagridViewToolbarAction<DataType>|null)[])) | (IDatagridViewToolbarAction<DataType>|null)[]}
     * @remarks Toolbar actions are rendered in the order they are defined. Toolbar represents the top-right area of the DatagridView, rendered directly under the actions bar.
     */
    toolbarActions?: ((options: IDatagridViewCallOptions<DataType, PropsExtensions>) => ((IDatagridViewToolbarAction<DataType> | null)[])) | (IDatagridViewToolbarAction<DataType> | null)[];

    /**
     * Minimum height the DataGrid should maintain
     */
    minHeight?: number;

    /**
     * Maximum height the DataGrid can expand to
     */
    maxHeight?: number;

    /***
     * Whether to bind the dimensions change event and update the component's state
     * Default is true
     */
    bindDimensionsChangeEvent?: boolean;

    /**
     * The default aggregation function to use for columns that support aggregation.
     */
    defaultAggregationFunction?: keyof IDatagridAggregationFunctions;

    /***
     * Whether the datagrid is resizable.
     */
    resizable?: boolean;

    /***
     * A callback function that is called when the datagrid is sorted.
     * if specified, it will be called when the datagrid is sorted and the datagrid won't be sorted internally.
     * @param options An object containing the datagrid context and the order by configuration.
     */
    onSort?: (options: IDatagridViewCallOptions<DataType, IDatagridViewOrderBy<DataType>>) => any;

    /***
     * A callback function that is called when the datagrid is paginated.
     * if specified, it will be called when the datagrid is paginated and the datagrid won't be paginated internally.
     * @param options An object containing the datagrid context and the pagination configuration.
     */
    onPaginate?: (options: IDatagridViewCallOptions<DataType, IDatagridViewPagination>) => any;

    /***
     * If true, the values of the aggregatable columns will be abreviated to the first letter of the value.
     * For example, if the value is "100", it will be abreviated to "1K"
     */
    abreviateAggregatableValues?: boolean;

    /**
     * A list of view names to be shown in the datagrid.
     * 
     * This property is used to specify a list of view names that should be shown in the datagrid.
     * 
     * If provided, it will override the default view names.
    */
    viewNames?: IDatagridViewName[];

    /***
     * A callback function that is called when the user toggles between views.
     * 
     * This callback function is called when the user toggles between views using the datagrid's toolbar.
     * @param options An object containing the datagrid context and the current view name.
     */
    onToggleView?: (options: IDatagridViewCallOptions<DataType> & { viewName: IDatagridViewName }) => void;

    /**
     * The props to be passed to the datagrid's filter group.
     */
    filterGroupProps?: Omit<IFilterGroupProps<DataType>, "columns">;
} & PropsExtensions;


/**
 * Represents an action that can be performed within the DatagridView component's toolbar.
 *
 * This interface extends the `IButtonProps` interface, adding a context specific to the DatagridView.
 * Actions defined by this interface can be used in the DatagridView's toolbar or other interactive elements.
 *
 * @template DataType - The type of data being displayed in the grid.
 * @template DatagridPropExtensions - The type of the DatagridView component's props.
 * @template DatagridStateExtensions - The type of the DatagridView component's state.
 * @extends {IButtonProps}
 */
export interface IDatagridViewToolbarAction<DataType extends object = any, DatagridPropExtensions = unknown, DatagridStateExtensions = unknown> extends IButtonProps<{
    /**
     * The DatagridView context.
     *
     * This property provides access to the DatagridView component's state and methods.
     */
    datagridContext: DatagridView<DataType, DatagridPropExtensions, DatagridStateExtensions>;
}> { }
/**
 * Represents an action that can be performed within the DatagridView component.
 * 
 * The `IDatagridAction` interface extends the `IAppBarAction` interface, adding a context specific to the DatagridView.
 * Actions defined by this interface can be used in the DatagridView's toolbar or other interactive elements.
 * 
 * @template DataType - The type of the data shown in the grid.
 * 
 * @extends {IAppBarAction}
 * 
 * @property {DatagridView<any>} datagridContext - The context of the DatagridView component, providing access to its state and methods.
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
 * - Actions can be dynamically generated based on the DatagridView's state or user interactions.
 * - The `datagridContext` provides access to the DatagridView's methods, such as `getSelectedRows` or `toggleRowSelection`.
 * 
 * @see {@link IAppBarAction} for the base action interface.
 */
export interface IDatagridAction<DataType extends object = any, DatagridPropExtensions = unknown, DatatagridStateExtensions = any> extends IAppBarAction<{ datagridContext: DatagridView<DataType, DatagridPropExtensions, DatatagridStateExtensions> }> { }


const DatagridContext = createContext<DatagridView<any, any, any> | null>(null);

/**
 * Hook to access the DatagridView component's context.
 * 
 * This hook returns the DatagridView component's context, which provides access to the grid's state and methods.
 * 
 * @template DataType - The type of the data shown in the grid.
 * 
 * @returns The DatagridView component's context, or null if not found.
 */
export function useDatagrid<DataType extends object = any>(): (DatagridView<DataType>) | null {
    /**
     * Returns the DatagridView component's context from the React context API.
     * 
     * The useContext hook is used to access the DatagridView component's context, which is stored in the DatagridContext.
     * 
     * @see {@link DatagridContext} for more information about the DatagridView component's context.
     */
    return useContext(DatagridContext);
}

/**** Hooks sections */


/**
 * A hook to subscribe to events on the DatagridView component and call a function when the event is triggered.
 * 
 * This hook takes an event or an array of events to subscribe to, and an optional callback function or force render flag.
 * If the callback function is provided, it will be called with the event arguments when the event is triggered.
 * If the force render flag is set to true, the component will be forced to re-render when the event is triggered.
 * If the force render flag is set to false, the component will not be forced to re-render.
 * If the force render flag is not provided, the component will be forced to re-render.
 * 
 * @param {IDatagridEvent | IDatagridEvent[]} event - The event or events to subscribe to.
 * @param {((...args: any[]) => any) | boolean} [callbackOrForceRender] - The callback function or force render flag.
 * @returns {void}
 * 
 * @example
 * const MyComponent = () => {
 *   useDatagridOnEvent("row-click", (event) => console.log("Row clicked:", event));
 *   return <DatagridView />;
 * };
 */
export function useDatagridOnEvent(event: IDatagridEvent | IDatagridEvent[], callbackOrForceRender?: (boolean | ((...args: any[]) => any))) {
    const datagridContext = useDatagrid();
    const fRender = useForceRender();
    useEffect(() => {
        const subscribers: Record<string, { remove: Function }> = {};
        if (typeof datagridContext?.on == "function") {
            (Array.isArray(event) ? event : [event]).map((event) => {
                if (isNonNullString(event)) {
                    (subscribers as any)[String(event.toLowerCase().trim())] = datagridContext?.on(event, (...args: any[]) => {
                        const canForceRender = typeof callbackOrForceRender === "function" ? callbackOrForceRender(...args, event) : !!callbackOrForceRender;
                        if (canForceRender !== false) {
                            fRender();
                        }
                    });
                }
            });
        }
        return () => {
            for (let i in subscribers) {
                subscribers[i].remove();
            }
        };
    }, [event, datagridContext?.on, callbackOrForceRender]);
}

export type IDatagridViewColumnName<DataType extends object = any> = IFilterColumnName<DataType>;
/**
 * @typedef IDatagridViewStateColumn
 * Represents a column in the DatagridView component's state.
 * @extends {IDatagridViewColumnProps}
 * @template DataType - The type of the data shown in the grid.
 * @see {@link IDatagridViewColumnProps} for more information about column properties.  
 */
export type IDatagridViewStateColumn<DataType extends object = any> = Omit<IDatagridViewColumnProps<DataType>, "name" | "getAggregationValue" | "aggregationFunction" | "sortable" | "filterable" | "groupable" | "aggregatable" | "visible"> & {
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
     * The test ID for the column.
     * 
     * This property is used for testing purposes and can be used to identify the column in the grid.
     */
    testID?: string;

    /***
     * The unique name of the column.
     */
    name: IDatagridViewColumnName<DataType>;
}


/**
 * @typedef IDatagridViewColumnProps
 * Represents the properties of a column in the DatagridView component.
 * 
 * @extends {IField}
 * @see {@link IField} for more information about the properties of a column.
 * 
 * @template DataType - The type of the data shown in the grid.
 */
export type IDatagridViewColumnProps<DataType extends object = any> = Omit<IField, "name"> & {
    /**
     * Whether the column is sortable.
     * 
     * If true, the column can be sorted in ascending or descending order.
     */
    sortable?: boolean;

    labelProps?: Partial<Omit<ILabelProps, "children">>;

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

    /***
     * The flex value of the column or cell column in a header or cell.
     */
    flex?: number;

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
    computeCellValue?: (options: IDatagridViewCallOptions<DataType> & { rowData: DataType }) => any;

    /***
     * A custom render function for the column.
     * 
     * This property is used to render the column in a custom way.
     * 
     * @param options An object containing the row data and the datagrid context.
     * @returns The rendered column.
     */
    renderRowCell?: (options: IDatagridViewCallOptions<DataType> & { rowData: DataType; column: IDatagridViewStateColumn<DataType> }) => React.ReactNode;

    /**
     * A custom render function for the header of the column.
     * 
     * This property is used to render the header of the column in a custom way.
     * @param options An object containing the row data and the datagrid context.
     * @returns The rendered header.
     */
    renderHeader?: (options: IDatagridViewCallOptions<DataType> & { column: IDatagridViewStateColumn<DataType> }) => React.ReactNode;

    /**
     * Whether the column is resizable.
     */
    resizable?: boolean;
} & IFilterProps<DataType, any>;

interface IDatagridViewMeasuredLayout extends LayoutRectangle {
    pageX: number;
    pageY: number;
}
/**
 * Represents the state of the DatagridView component.
 * @typedef IDatagridViewState
 * 
 * @template DataType - The type of the data shown in the grid.
 * @template StateExtensions - The type of the component's state. This type is used to extend the component's state with additional properties.
 */
export type IDatagridViewState<DataType extends object = any, StateExtensions = unknown> = StateExtensions & {
    /**
     * The data to be shown in the grid.
     * 
     * This property contains either an array of grouped rows or an array of data rows.
     */
    data: Array<IDatagridViewGroupedRow<DataType>> | Array<DataType>;

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
     * A map of columns by their names.
     * 
     * This property allows for efficient lookup of columns by their names.
     */
    columnsByName: Record<string, IDatagridViewStateColumn<DataType>>;

    /**
     * The list of columns in the grid.
     * 
     * This property contains an array of column objects, each representing a column in the grid.
     */
    columns: IDatagridViewStateColumn<DataType>[];

    /**
     * The list of aggregatable columns in the grid.
     * 
     * This property contains an array of column objects that support aggregation.
     */
    aggregatableColumns: IDatagridViewStateColumn[];

    /**
     * The list of visible columns in the grid.
     * 
     * This property contains an array of column objects that are currently visible in the grid.
     */
    visibleColumns: IDatagridViewStateColumn<DataType>[];

    /**
     * The list of groupable columns in the grid.
     * 
     * This property contains an array of column objects that support grouping.
     */
    groupableColumns: IDatagridViewStateColumn<DataType>[];

    /**
     * The list of columns that are currently grouped.
     * 
     * This property contains an array of column names that are currently grouped in the grid.
     */
    groupedColumns: (IDatagridViewColumnName<DataType>)[];

    /**
     * A map of grouped rows by their keys.
     * 
     * This property allows for efficient lookup of grouped rows by their keys.
     */
    groupedRowsByKeys: Record<string, IDatagridViewGroupedRow<DataType>>;

    /**
     * The current order by configuration of the grid.
     * 
     * This property determines how the data is sorted in the grid.
     * 
     * @see {@link IDatagridViewOrderBy} for more information about order by configurations.
     */
    orderBy: IDatagridViewOrderBy<DataType>;

    /**
     * The current pagination configuration of the grid.
     * 
     * This property determines how the data is paginated in the grid.
     * 
     * @see {@link IDatagridViewPagination} for more information about pagination configurations.
     */
    pagination: IDatagridViewPagination;

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
    aggregatedColumnsValues: Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>>;

    /**
     * A flag indicating whether to display grouped columns.
     * 
     * This property determines whether to display the grouped columns in the grid.
     */
    displayGroupedColumns: boolean;

    /***
     * A flag indicating whether to display filters.
     */
    showFilters: boolean;

    /***
     * A flag indicating whether to display headers.
     */
    showHeaders: boolean;

    /**
     * The layout of the view container.
     */
    containerLayout: IDatagridViewMeasuredLayout;

    /***
     * The layout of the table.
     */
    contentContainerLayout: IDatagridViewMeasuredLayout;

    /***
     * toolbarActionsContainerLayout
     */
    toolbarActionsContainerLayout: IDatagridViewMeasuredLayout;

    /**
     * Wheither the layout has been measured.
     */
    isLayoutMeasured: boolean;

    /***
     * A flag indicating whether to show the aggregated totals.
     */
    showAggregatedValues: boolean;

    /***
     * A flag indicating whether to show only the aggregated totals.
     */
    showOnlyAggregatedValues: boolean;

    /***
     * A flag indicating whether to display the toolbar.
     */
    showToolbar: boolean;
    /**
     * A flag indicating whether to display the actions toolbar.
     */
    showActions: boolean;

    includeColumnLabelInGroupedRowHeader?: boolean;

    /***
     * The default aggregation function to use for columns that support aggregation.
     */
    aggregationFunction: keyof IDatagridAggregationFunctions;

    /***
     * The width of each column in the DatagridView.
     * It represents the width of each column in the DatagridView.
     */
    columnsWidths: Record<IDatagridViewColumnName<DataType>, number>;

    /***
     * The width of resized columns in the DatagridView.
     * It represents the width of resized columns in the DatagridView.
     */
    resizedColumnsWidths: Partial<Record<IDatagridViewColumnName<DataType>, number>>;

    /***
     * If true, the aggregatable column values will be abreviate
     */
    abreviateAggregatableValues: boolean;
};

/**
 * A map of events that can be triggered by the DatagridView component. Each key is an event name.
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
     * Triggered to toggle loading state of the DatagridView component.
     */
    toggleIsLoading: string;

    /***
     * Triggered when a column is sorted.
     */
    columnSorted: string;

    /***
     * Triggered when the aggregation function is changed.
     */
    aggregationFunctionChanged: string;


    /***
     * Triggered when the abreviateAggregatableValues is changed.
     */
    abreviateAggregatableValuesChanged: string;

    /***
     * Triggered when the view is toggled.
     */
    toggleView: string;
}

/**
 * A type representing the possible events that can be triggered by the DatagridView component.
 * @typedef IDatagridEvent
 */
export type IDatagridEvent = keyof IDatagridEventMap;

/**
 * An interface representing the accumulator object used in aggregation functions.
 * It is an object with properties that are the keys of the IDatagridAggregationFunctions interface.
 * @typedef IDatagridAggregationAccumulator
 * @template DataType - The type of the data shown in the grid.
 * @see {@link IDatagridAggregationFunctions} for more information about aggregation functions.
 */
export interface IDatagridAggregationAccumulator<DataType extends object = any> extends Record<keyof IDatagridAggregationFunctions | string, number> {

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
export type IDatagridAggregationFunction<DataType extends object = any> = (acc: IDatagridAggregationAccumulator, currentValue: number, currentIndex: number, data: DataType[]) => number;

/**
 * An interface representing the possible aggregation functions that can be used in the DatagridView component.
 * @typedef IDatagridAggregationFunctions
 * @template DataType - The type of the data shown in the grid.
 * @see {@link IDatagridAggregationFunction} for more information about aggregation functions.
 */
export interface IDatagridAggregationFunctions<DataType extends object = any> {
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
 * A type representing the possible aggregators that can be used in the DatagridView component.
 * @typedef IDatagridAggregator
 */
export type IDatagridAggregator = keyof IDatagridAggregationFunctions;

/**
 * An interface representing a grouped row in the DatagridView component.
 * @typedef IDatagridViewGroupedRow
 * @template DataType - The type of the data shown in the grid.
 */
export interface IDatagridViewGroupedRow<DataType extends object = any> {
    /**
     * A flag indicating that this is a grouped row.
     */
    isDatagridGroupedRowData: true;
    /**
     * The label of the grouped row.
     */
    label: string;
    /**
     * The key of the grouped row.
     */
    datagridGroupedRowKey: string;

    /***
     * The data of the grouped row.
     */
    data: DataType[];

    /***
     * The aggregated values of the grouped row.
     */
    aggregatedColumnsValues: Record<IDatagridViewColumnName<DataType>, Record<keyof IDatagridAggregationFunctions, number>>;
}


/**
 * Represents the data structure for a row in the DatagridView component.
 * 
 * The `IDatagridViewRowOrGroup` type is a union type that can represent either a standard data row
 * or a grouped row in the DatagridView. This allows the grid to handle both individual data rows
 * and grouped rows seamlessly.
 * 
 * @template DataType - The type of the data displayed in the grid.
 * 
 * @example
 * ```typescript
 * // Example of a standard data row
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 * 
 * const rowData: IDatagridViewRowOrGroup<User> = {
 *   id: 1,
 *   name: "John Doe",
 *   age: 30,
 * };
 * 
 * // Example of a grouped row
 * const groupedRowData: IDatagridViewRowOrGroup<User> = {
 *   isDatagridGroupedRowData: true,
 *   label: "Age Group: 30-40",
 *   datagridGroupedRowKey: "ageGroup_30_40",
 * };
 * ```
 * 
 * @remarks
 * - Standard data rows are represented by the `DataType` type.
 * - Grouped rows are represented by the `IDatagridViewGroupedRow` interface, which includes additional metadata for grouping.
 * - This type is used internally by the DatagridView component to handle both individual and grouped rows.
 * 
 * @see {@link IDatagridViewGroupedRow} for the structure of grouped rows.
 */
export type IDatagridViewRowOrGroup<DataType extends object = any> =
    | DataType
    | IDatagridViewGroupedRow<DataType>;

/**
 * An interface representing the view name map of the DatagridView component.
 * Eeach key is a view name name and each value is the custom datagrid view props interface.
 * @typedef IDatagridViews
 * @example 
 * ```
 * import "@resk/native";
 * declare module "@resk/native"{
 *    interface IDatagridViews {
 *      table: IDatagridTableViewProps;
 *      card: IDatagridCardViewProps;
 *    }
 * }
 * ```
 */
export interface IDatagridViews<DataType extends object = any> { }

/**
 * A type representing the possible view name names of the DatagridView component.
 * @typedef IDatagridViewName
 */
export type IDatagridViewName = keyof IDatagridViews;

/**
 * A type representing the order by configuration of the DatagridView component.
 * @typedef IDatagridViewOrderBy
 * @template DataType - The type of the data shown in the grid.
 * @see {@link IDatagridViewOrderBy}
 */
export interface IDatagridViewOrderBy<DataType extends object = any> {
    column: IDatagridViewColumnName<DataType>;
    direction?: IResourceQueryOptionsOrderByDirection;
    ignoreCase?: boolean;
};

/**
 * An interface representing the pagination configuration of the DatagridView component.
 */
export interface IDatagridViewPagination extends IResourcePaginationMetaData {
    /**
     * The page sizes of the pagination.
     */
    pageSizes?: number[];
}

export interface IDatagridRegisterViewOptions {
    /***
     * The name of the display view.
     */
    name: IDatagridViewName;
    /***
     * The label of the display view.
     */
    label?: string;
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

    /***
     * A function that determines whether the datagrid view is rendable or not.
     * 
     * @param {DatagridView} options - The DatagridView instance.
     * @returns {boolean} - Returns true if the datagrid view is rendable, otherwise false.
     */
    rendable?: (options: { datagrid: DatagridView }) => boolean
}


/**
 * Props for the loading indicator component used in the Datagrid.
 *
 * @interface IDatagridViewLoadingIndicatorProps
 * @property {boolean} [isLoading] - Optional flag indicating whether the Datagrid is in a loading state.
 */
export interface IDatagridViewLoadingIndicatorProps {
    isLoading?: boolean;
    testID?: string;
}


const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
    },
    loadingIndicatorContainer: {
        width: "100%",
        position: "absolute",
        top: 0, left: 0,
        pointerEvents: "none",
        height: "100%",
    },
    contentContainer: {
        width: "100%",
        overflow: "hidden",
    },
    toolbarActionsContainer: {
        width: "100%",
        alignSelf: "flex-start",
    },
    paginationContentContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    paginationItem: {
        paddingHorizontal: 7,
        marginTop: -4,
    },
    disabled: {
        pointerEvents: "none",
    },
    actionsToolbar: {
        width: "100%",
    },
    headerScrollViewContentContainer: {
        minWidth: '100%',
    },
    headerScrollView: {
        width: '100%',
    },
    columnHeaderOrCell: {
        alignSelf: "flex-start",
        position: "relative",
        flexDirection: "column",
        paddingVertical: 7,
        marginHorizontal: 7,
    },
    columnHeaderContentContainer: {
        width: '100%',
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        position: "relative",
    },
    columnHeaderLabelContainer: {
        flexWrap: "wrap",
        alignSelf: "flex-start",
    },
    toolbarButton: {},
    toolbarContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    resizeHandle: {
        position: 'absolute',
        top: 0,
        right: -5,
        width: 10,
        height: '100%',
        zIndex: 10,
        // Visual indicator for the handle (optional)
        borderRightWidth: 10,
    },
    resizeHandleActive: {
        width: 14,
        right: -7,
    },
    button: {
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginHorizontal: 5,
    }
});