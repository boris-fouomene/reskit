import { useMemo } from "react";
import { Datagrid, AttachDatagridView, useDatagrid, IDatagridViewRowData } from "./Datagrid";
import Label from "@components/Label";


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
    renderTableRow(rowData: IDatagridViewRowData<DataType>, rowIndex: number) {
        return <Rows datagridContext={this} rowData={rowData} rowIndex={rowIndex} />
    }
    renderRows() {
        const { data } = this.state;
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

function Rows<DataType extends object = any>({ datagridContext, rowData, rowIndex }: IDatagridTableViewCommonProps<DataType> & { rowData: IDatagridViewRowData<DataType>, rowIndex: number }): JSX.Element | null {
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