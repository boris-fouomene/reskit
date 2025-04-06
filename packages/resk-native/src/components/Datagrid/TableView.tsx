import { useMemo } from "react";
import { Datagrid, AttachDatagridView, useDatagrid, IDatagridViewRowOrGroup, IDatagridViewName, IDatagridViewGroupedRow, IDatagridViewStateColumn } from "./Datagrid";
import { FlatList, SectionList, StyleSheet, View } from "react-native";
import test from "node:test";
import { IViewStyle } from "@src/types";
import { isNumber } from "@resk/core";

export interface IDatagridTableViewProps<DataType extends object = any> {

}

declare module "./Datagrid" {
    export interface IDatagridViews {
        table: IDatagridTableViewProps;
    }
}

@AttachDatagridView({
    name: "table",
})
export class DatagridTableView<DataType extends object = any> extends Datagrid.View<DataType, IDatagridTableViewProps> {
    renderTableHeader() {
        return <View style={styles.headers}>
            <Columns datagridContext={this} />
        </View>
    }
    getViewName(): IDatagridViewName {
        return "table";
    }
    getColumnWidthStyle(column: IDatagridViewStateColumn<DataType>): IViewStyle {
        if (!column) return null;
        if (isNumber(column.width) && column.width > 0) {
            return { width: column.width };
        }
        if (isNumber(column.flex) && column.flex >= 0) {
            return { flex: column.flex };
        }
        return { flex: 1 };
    }
    getTableCellStyle(column: IDatagridViewStateColumn<DataType>, rowData: DataType): IViewStyle {
        const s = super.getTableCellStyle(column, rowData);
        return [s, this.getColumnWidthStyle(column)];
    }
    getTableColumnHeaderStyle(column: IDatagridViewStateColumn<DataType>): IViewStyle {
        const s = super.getTableColumnHeaderStyle(column);
        return [s, this.getColumnWidthStyle(column)];
    }
    renderTableBody() {
        return <DatagridTableViewRendered<DataType>
            context={this}
        />
    }
}

interface IDatagridTableViewCommonProps<DataType extends object = any> {
    datagridContext: DatagridTableView<DataType>;
}

function Columns<DataType extends object = any>({ datagridContext }: IDatagridTableViewCommonProps<DataType>): JSX.Element | null {
    const visibleColumns = datagridContext.getVisibleColumns();
    const columns = useMemo(() => {
        return visibleColumns.map((column, index) => {
            return datagridContext.renderTableColumnHeader(column.name, index);
        });
    }, [visibleColumns]);
    return <>
        {columns}
    </>;
}
Columns.displayName = "DatagridTableView.Columns";


function DatagridTableViewRendered<DataType extends object = any>({ context }: { context: DatagridTableView<DataType> }) {
    const stateData = context.getData();
    const hasGroupedRows = context.hasGroupedRows();
    const isLoading = context.isLoading();
    const sections = useMemo(() => {
        if (hasGroupedRows) {
            return stateData as IDatagridViewGroupedRow<DataType>[];
        }
        return [
            {
                label: "Non groupedData",
                isDatagridGroupedRowData: true,
                datagridGroupedRowKey: "not-grouped-data",
                data: stateData as DataType[],
            }
        ]
    }, [hasGroupedRows, stateData]);
    return <SectionList<DataType>
        sections={sections}
        extraData={hasGroupedRows || isLoading}
        renderSectionHeader={function (options: any) {
            if (!hasGroupedRows) {
                return null;
            }
            console.log("will render aggregated header ", options);
            return null;
        }}
        renderItem={function ({ item: rowData, index: rowIndex }: { item: DataType, index: number }) {
            return <Rows
                rowData={rowData}
                rowIndex={rowIndex}
                datagridContext={context}
            />
        }}
    />
}

function Rows<DataType extends object = any>({ datagridContext, rowData, rowIndex }: IDatagridTableViewCommonProps<DataType> & { rowData: DataType, rowIndex: number }): JSX.Element | null {
    const visibleColumns = datagridContext.getVisibleColumns();
    const rowsCells = useMemo(() => {
        return datagridContext.renderTableRow(rowData, rowIndex);
    }, [rowData, visibleColumns]);
    const testID = datagridContext.getTestID();
    return <View testID={testID + "-row"} style={[styles.row]}>
        {rowsCells}
    </View>;
}
Rows.displayName = "DatagridTableView.Rows";

interface IT extends Record<string, any> {
    abc11: string;
    myTest: string;
}
function t() {
    return <Datagrid<IT>
        data={[
            { abc11: "abc11", myTest: "myTest" },
            { abc11: "abc11", myTest: "myTest" },
        ]}
        columns={[
            { name: "abc11", type: "text", width: 100 },
            { name: "myTest", type: "text" }
        ]}
    />
}

const styles = StyleSheet.create({
    headers: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
})