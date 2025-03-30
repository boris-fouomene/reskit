import { AttachDatagridDisplayView, Datagrid, IDatagridDataType } from "./Datagrid";
import Label from "@components/Label";

declare module "./Datagrid" {
    export interface IDatagridDisplayViewMap {
        table: DatagridTableDisplayView;
    }
}

@AttachDatagridDisplayView({
    name: "table",
    label: "Table",
    optimizedFor: ["mobile", "tablet", "desktop"],
})
export class DatagridTableDisplayView<DataType extends IDatagridDataType = any> extends Datagrid.DisplayView<DataType> {
    render() {
        return <Label>
            I'm display from table
        </Label>
    }
}