import { Datagrid, AttachDatagridView, IDatagridDataType } from "./Datagrid";
import Label from "@components/Label";

declare module "./Datagrid" {
    export interface IDatagridViews {
        table: typeof Datagrid.View;
    }
}

@AttachDatagridView("table")
export class DatagridTableView<DataType extends IDatagridDataType = any> extends Datagrid.View<DataType> {
    _render() {
        return <Label>
            I'm display from table
        </Label>
    }
}