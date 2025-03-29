import { IFieldType } from "@resk/core/types";
import { isNonNullString, isObj } from "@resk/core/utils";
import { IDatagridDataType, IDatagridStateColumn } from "./types";

export class DatagridColumn<DataType extends IDatagridDataType = any, PropsType extends IDatagridStateColumn = any> {
    static reflectMetadataKey = Symbol("datagrid-field");
    static registerComponent(type: IFieldType, component: typeof DatagridColumn) {
        if (!isNonNullString(type) || typeof (component) !== "function") return;
        const components = DatagridColumn.getRegisteredComponents();
        components[type] = component;
        Reflect.defineMetadata(DatagridColumn.reflectMetadataKey, components, DatagridColumn);
    }
    static getRegisteredComponents(): Record<IFieldType, typeof DatagridColumn> {
        const components = Reflect.getMetadata(DatagridColumn.reflectMetadataKey, DatagridColumn);
        return isObj(components) ? components : {} as any;
    }
}

export function AttachDatagridColumn(type: IFieldType) {
    return (target: typeof DatagridColumn) => {
        DatagridColumn.registerComponent(type, target as typeof DatagridColumn);
    };
}