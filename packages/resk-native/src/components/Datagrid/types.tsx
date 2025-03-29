import { IField, IResourceQueryOptionsOrderBy } from "@resk/core/types";

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
// Enhanced Column Definition with Pivot Support
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
export interface IDatagridGroupedRow<DataType extends IDatagridDataType = any> {
    isDatagridGroup: true;
    label: string;
    data: DataType[]
}

export type IDatagridStateData<DataType extends IDatagridDataType = any> = Array<IDatagridGroupedRow<DataType> | DataType>;

export type IDatagridStateColumn<DataType extends IDatagridDataType = any> = Omit<IDatagridColumnProps<DataType>, "getAggregationValue" | "aggregationFunction" | "sortable" | "filterable" | "groupable" | "aggregatable" | "visible"> & {
    sortable: boolean;
    filterable: boolean;
    groupable: boolean;
    aggregatable: boolean;
    visible: boolean;
    aggregationFunction: IDatagridAggregationFunction<DataType>;
}

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
