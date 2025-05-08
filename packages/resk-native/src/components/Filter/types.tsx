import { IFormFieldValidatorOptions } from "@components/Form/types";
import { IMenuItemProps } from "@components/Menu/types";
import { IAuthSessionStorage } from "@resk/core";
import { IField, IFieldType, IMongoLogicalOperatorName, IMongoOperatorName, IMongoQuery } from "@resk/core/types";
import { ReactNode } from "react";
import { ScrollViewProps, ViewProps } from "react-native";

export interface IFilterState extends IFilterProcessedProps {
    betweenStartValue?: any;
    betweenEndValue?: any;

    handleZero?: boolean;

    moduloDivisor?: number;

    moduloRemainder?: number;
};

export type IFilterRegexAction = "$regexequals" | "$regexcontains" | "$regexnotcontains" | "$regexnotequals" | "$regexstartswith" | "$regexendswith";
export type IFilterBetweenAction = "$between" | "$today" | "$thisday" | "$yesterday" | "$prevWeek" | "$week" | "$month" | "$period";

export type IFilterAction = IFilterRegexAction | IFilterBetweenAction | Exclude<IMongoOperatorName, "$not">;


export type IFilterOperators = Partial<Record<IFilterOperator, string>>;
export type IFilterActions = Partial<Record<IFilterAction, string>>;

export type IFilterOnChangeOptions<DataType extends object = any, FieldType extends IFieldType = IFieldType> = Omit<IFormFieldValidatorOptions<FieldType>, "context"> & IFilterState
    & {
        operator: IMongoOperatorName;
        action: IFilterAction;
        operators: IFilterOperators;
        actions: IFilterActions;
        mango: IMongoQuery<DataType>;
        name: string;
    }


export type IFilterOperator = Exclude<IMongoLogicalOperatorName, "$not">;

/**
 * Represents the processed properties of a filter in the Filter component.
 * 
 * The `IFilterProcessedProps` interface defines the structure of the processed properties
 * for a filter, including its type, actions, operators, and additional metadata.
 * 
 * @example
 * ```typescript
 * const processedFilter: IFilterProcessedProps = {
 *   type: "text",
 *   isFilter: true,
 *   actions: { "$regexcontains": "Contains", "$regexstartswith": "Starts with" },
 *   action: "$regexcontains",
 *   ignoreCase: true,
 *   canIgnoreCase: true,
 *   manualRun: false,
 *   defaultValue: "example",
 *   operators: { "$eq": "Equals", "$ne": "Not Equals" },
 *   operator: "$eq",
 *   isTextFilter: true,
 *   isNumber: false,
 *   selectorActiveFieldName: "mergedField",
 *   selectorFields: {
 *     field1: { name: "field1", type: "text" },
 *     field2: { name: "field2", type: "number" },
 *   },
 *   hasSelectorFields: true,
 * };
 * ```
 * 
 * @remarks
 * - This interface is used internally to manage the state and configuration of a filter.
 * - It includes metadata for advanced filtering features, such as case sensitivity and merged fields.
 * 
 * @property {IFieldType} type - The type of the filter (e.g., "text", "number").
 * @property {boolean} isFilter - Indicates whether the component is a filter.
 * @property {IFilterActions} actions - The list of supported actions for the filter.
 * @property {IFilterAction} action - The currently selected action for the filter.
 * @property {boolean} ignoreCase - Whether to ignore case when filtering.
 * @property {boolean} [canIgnoreCase] - Whether the filter supports case-insensitive operations (applicable for text filters).
 * @property {boolean} [manualRun] - Whether the filter requires manual execution to apply changes.
 * @property {any} [defaultValue] - The default value of the filter.
 * @property {IFilterOperators} operators - The list of supported operators for the filter.
 * @property {IFilterOperator} operator - The currently selected operator for the filter.
 * @property {boolean} isTextFilter - Indicates whether the filter is a text-based filter.
 * @property {boolean} isNumber - Indicates whether the filter is a number-based filter.
 * @property {string} [selectorActiveFieldName] - The name of the active field in merged selectors.
 * @property {Record<string, IField<any>>} selectorFields - The merged fields used for filtering.
 * @property {boolean} hasSelectorFields - Indicates whether the filter has merged fields.
 */
export interface IFilterProcessedProps {
    type: IFieldType;
    isFilter: boolean;
    actions: IFilterActions;
    action: IFilterAction;
    ignoreCase: boolean;
    /*** spécifie si l'action d'ignorer la casse est supportée par le composant Filter. valable pour les filtre de type texte */
    canIgnoreCase?: boolean;
    manualRun?: boolean;
    defaultValue?: any;
    operators: IFilterOperators;
    operator: IFilterOperator;
    isTextFilter: boolean;
    isNumber: boolean;
    /***le nom du champ  mergé qui est actif à l'instant t, utile lorsqu'on récupère en paramètres les champs mergés*/
    selectorActiveFieldName?: string;
    /*** les champs mergés qui seront utilisés pour le filtre des données */
    selectorFields: Record<string, IField<any>>;
    hasSelectorFields: boolean;
};


/**
 * Represents the state of a filter group in the Filter component.
 * 
 * The `IFilterGroupState` interface defines the structure of the state for a group of filters,
 * including the columns and their associated values, operators, and actions.
 * 
 * @template DataType - The type of the data being filtered (default is `any`).
 * 
 * @example
 * ```typescript
 * const filterGroupState: IFilterGroupState<User> = {
 *   columns: [
 *     { name: "age", value: 30, operator: "$gte", action: "$between" },
 *   ],
 * };
 * ```
 * 
 * @property {Array<{ name: string; value?: any; filterKey: string; action?: IFilterAction; ignoreCase?: boolean; operator?: IFilterOperator }>} columns - The list of filters in the group, including their values and configurations.
 */
export type IFilterColumnName<DataType extends object = any> = (keyof DataType & string) | string;

/**
 * Represents the properties for a filter in the Datagrid or Filter component.
 * 
 * The `IFilterProps` type extends the base `IField` interface and provides additional properties
 * specific to filtering functionality, such as operators, actions, and visibility settings.
 * 
 * @template DataType - The type of the data being filtered (default is `any`).
 * @template FieldType - The type of the field being filtered (default is `IFieldType`).
 * 
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * 
 * const filterProps: IFilterProps<User> = {
 *   name: "age",
 *   type: "number",
 *   filterable: true,
 *   visible: true,
 *   ignoreCase: false,
 *   operators: ["$gte", "$lte"],
 *   actions: ["$between"],
 *   removable: true,
 *   onFilterRemove: () => console.log("Filter removed"),
 *   onChange: (options) => console.log("Filter changed:", options),
 * };
 * ```
 * 
 * @remarks
 * - This type is used to define the configuration of a filter, including its behavior and appearance.
 * - The `onChange` callback is triggered whenever the filter value changes.
 * - The `removable` property determines whether the filter can be removed by the user.
 * 
 * @property {IFilterColumnName<DataType>} name - The name of the column being filtered. Must be unique.
 * @property {FieldType} type - The type of the field being filtered (e.g., "text", "number").
 * @property {boolean} [filterable] - Whether the column is filterable. Defaults to `true`.
 * @property {boolean} [visible] - Whether the column is visible. Defaults to `true`.
 * @property {boolean} [ignoreCase] - Whether to ignore case when filtering. Defaults to `false`.
 * @property {IFilterOperator[]} [operators] - The list of supported operators for the filter.
 * @property {IFilterAction[]} [actions] - The list of supported actions for the filter.
 * @property {IFilterAction} [action] - The currently selected action for the filter.
 * @property {IFilterOperator} [operator] - The currently selected operator for the filter.
 * @property {boolean} [removable] - Whether the filter can be removed by the user.
 * @property {() => void} [onFilterRemove] - Callback function triggered when the filter is removed.
 * @property {(options: IFilterOnChangeOptions<DataType, FieldType>) => any} [onChange] - Callback function triggered when the filter value changes.
 * @property {string} [selectorActiveFieldName] - The name of the active field in merged selectors.
 * @property {IMenuItemProps[]} [customMenuActions] - Custom menu actions for the filter.
 */
export type IFilterProps<DataType extends object = any, FieldType extends IFieldType = IFieldType> = Omit<IField<FieldType>, "type" | "name" | "onChange" | "label"> & {

    /**
     * The name of the column.
     * 
     * This property is required and must be a unique string.
     */
    name: IFilterColumnName<DataType>;

    type: FieldType;

    /**
     * Whether the column is filterable.
     * 
     * If true, the column can be filtered using a filter input.
     */
    filterable?: boolean;


    /**
     * Whether the column is visible.
     * 
     * If false, the column is hidden from the grid.
     */
    visible?: boolean;

    /**
     * Whether to ignore case when sorting the column.
     * 
     * If true, the column is sorted in a case-insensitive manner.
     */
    ignoreCase?: boolean;


    operators?: IFilterOperator[];
    actions?: IFilterAction[];
    action?: IFilterAction;
    operator?: IFilterOperator;
    orOperator?: false;
    andOperator?: false;
    renderLabel?: boolean;
    testID?: string;
    onChange?: (options: IFilterOnChangeOptions<DataType, FieldType>) => any;
    selectorActiveFieldName?: string;
    customMenuActions?: IMenuItemProps[];
    /***
     * Whether to display a remove button in the filter menu.
     */
    removable?: boolean;
    /**
     * Callback function to be called when the filter is removed.
     * It only exists if the `removable` prop is set to true.
     * @param {void} void
     * @returns {void}
     */
    onFilterRemove?: () => void;

    label?: ReactNode;
};



export interface IFilterGroupProps<DataType extends object = any> extends Omit<ViewProps, "children"> {
    columns: IFilterProps<DataType>[];
    withScrollView?: boolean;
    /***
     * Whether the filter group is disabled.
     */
    disabled?: boolean;
    scrollViewProps?: ScrollViewProps;
    sessionName?: string;
    removable?: boolean;
    defaultValue?: Array<IFilterGroupStateColumn<DataType> & {
        getFilterValue?: (groupContext: IFilterGroupContext<DataType>) => any;
    }>;
}
export interface IFilterGroupContext<DataType extends object = any> {
    testID: string,
    getColumn: (columnName: IFilterColumnName<any>) => IFilterProps<DataType> | null;
    sessionStorage: IAuthSessionStorage | null;
    removeFilter: (filterKey: string) => void;
}

export interface IFilterGroupStateColumn<DataType extends object = any> {
    name: IFilterColumnName<DataType>;
    value?: any;
    /***
     * unique key used to identify the filter from the group
     */
    filterKey: string;
    /***
     * action to apply to the filter
     */
    action?: IFilterAction;
    /**
     * ignore case for the filter
     */
    ignoreCase?: boolean;
    /***
     * operator to apply to the filter
     */
    operator?: IFilterOperator;
};

export interface IFilterGroupState<DataType extends object = any> {
    columns: Array<IFilterGroupStateColumn<DataType>>;
}