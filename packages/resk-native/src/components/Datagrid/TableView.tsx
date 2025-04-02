import { Datagrid, AttachDatagridView, IDatagridDataType } from "./Datagrid";
import Label from "@components/Label";

type ITest = {
    myExample: string;
};
declare module "./Datagrid" {
    export interface IDatagridViews {
        table: ITest;
    }
}

@AttachDatagridView({
    name: "table",
})
export class DatagridTableView<DataType extends IDatagridDataType = any> extends Datagrid.View<DataType, ITest> {
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
        tableViewProps={{
            myExample: "test"
        }}
    />
}