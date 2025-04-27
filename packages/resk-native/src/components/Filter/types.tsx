import { IFormFieldValidatorOptions } from "@components/Form";
import { IMenuItemProps } from "@components/Menu";
import { IAuthSessionStorage } from "@resk/core";
import { IField, IFieldType, IMergeWithoutDuplicates, IMongoLogicalOperatorName, IMongoOperatorName, IMongoQuery } from "@resk/core/types";
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


export type IFilterColumnName<DataType extends object = any> = (keyof DataType & string) | string;

export type IFilterProps<DataType extends object = any, FieldType extends IFieldType = IFieldType> = Omit<IField<FieldType>, "type" | "name" | "onChange"> & {

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
    defaultValue?: Array<IFilterGroupState<DataType>["columns"][number] & {
        getFilterValue?: (groupContext: IFilterGroupContext<DataType>) => IFilterProps<DataType>["defaultValue"]
    }>;
}
export interface IFilterGroupContext<DataType extends object = any> {
    testID: string,
    getColumn: (columnName: IFilterColumnName<any>) => IFilterProps<any> | null;
    sessionStorage: IAuthSessionStorage | null;
    removeFilter: (filterKey: string) => void;
}

export interface IFilterGroupState<DataType extends object = any> {
    columns: Array<{
        name: IFilterProps<DataType>["name"];
        value?: IFilterProps<DataType>["defaultValue"];
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
    }>;
}