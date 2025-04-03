import { Datagrid, AttachDatagridView, IDatagridDataType, useDatagrid, IDatagridGroupedRow } from "./Datagrid";
import Label from "@components/Label";


export interface IDatagridTableViewProps<DataType extends IDatagridDataType = any> {

}

declare module "./Datagrid" {
    export interface IDatagridViews {
        table: IDatagridTableViewProps;
    }
}

@AttachDatagridView({
    name: "table",
})
export class DatagridTableView<DataType extends IDatagridDataType = any> extends Datagrid.View<DataType, IDatagridTableViewProps> {
    static Rows<DataType extends IDatagridDataType = any>(): JSX.Element | null {
        return null;
    }
    static Columns(): JSX.Element | null {
        return null;
    }
    _render() {
        return <Label>
            I'm display from table
        </Label>
    }
}



function t() {
    return <Datagrid
        data={[]}
        columns={[]}
    />
}