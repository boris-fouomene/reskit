import { IFormFieldValidatorOptions } from "@components/Form";
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
};



export interface IFilterGroupProps<DataType extends object = any> extends Omit<ViewProps, "children"> {
    columns: IFilterProps<DataType>[];
    withScrollView?: boolean;
    scrollViewProps?: ScrollViewProps;
    sessionName?: string;
}

export interface IFilterGroupState<DataType extends object = any> {
    columns: Array<{
        name: IFilterProps<DataType>["name"];
        value: IFilterProps<DataType>["defaultValue"];
        key: string;
        action: IFilterAction;
        ignoreCase: boolean;
        operator: IFilterOperator;
    }>;
}