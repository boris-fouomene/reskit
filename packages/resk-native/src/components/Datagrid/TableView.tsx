import { useMemo } from "react";
import { Datagrid, AttachDatagridView, useDatagrid, IDatagridViewRowOrGroup, IDatagridViewName } from "./Datagrid";
import { FlatList, SectionList } from "react-native";

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
        return <Columns datagridContext={this} />
    }
    getViewName(): IDatagridViewName {
        return "table";
    }
    _render() {
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
    const { Component, props } = useMemo(() => {
        return {
            Component: hasGroupedRows ? SectionList : FlatList,
            props: hasGroupedRows ? {
                sections: stateData,
            } : {
                data: stateData,
            },
        };
    }, [hasGroupedRows, stateData]);
    const C = Component as any;
    return <C
        {...props}
        renderSectionHeader={(options: any) => {
            console.log("rendering section ", options);
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
    return <>
        {rowsCells}
    </>;
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