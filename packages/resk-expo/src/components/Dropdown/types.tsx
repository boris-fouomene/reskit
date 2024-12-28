import { IAppBarAction, IAppBarProps } from "@components/AppBar/types";
import { ITextInputProps } from "@components/TextInput/types";
import { ReactNode } from "react";
import { FlashListProps } from "@shopify/flash-list";
import { IViewProps } from "@components/View";
import { PressableProps } from "react-native";
import Component from "@utils/Component";

export interface IDropdownContext<ItemType = any, ValueType = any> extends Component<Omit<IDropdownProps<ItemType, ValueType>, "items" | "getHashKey">, IDropdownState<ItemType, ValueType>> {
    filteredItems?: IDropdownPreparedItem<ItemType, ValueType>[];
    itemsByHashKey: IDropdownPreparedItems<ItemType, ValueType>;
    visible: boolean;
    getHashKey: (value: ValueType) => string;
    getSelectedItemsByHashKey: () => Record<string, IDropdownPreparedItem<ItemType, ValueType>>;
    isSelected: (value: ValueType) => boolean;
    searchText?: string;
    onSearch?: (text: string) => any;
    state: IDropdownState<ItemType, ValueType>;
    toggleItem: (preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }) => any;
    isSelectedByHashKey: (hasKey: string) => boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
    getTestID: () => string;
    selectAll: () => void;
    unselectAll: () => void;
    prepareState(props?: IDropdownProps<ItemType, ValueType>): IDropdownState<ItemType, ValueType>;
    getSelectedValuesAndHashKey(defaultValue?: ValueType | ValueType[], itemsByHashKey?: IDropdownPreparedItems<ItemType, ValueType>): { selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> };
}

export interface IDropdownState<ItemType = any, ValueType = any> {
    itemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>,
    selectedValues: ValueType[]
    visible: boolean;
    selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>;
    preparedItems: IDropdownPreparedItem<ItemType, ValueType>[];
};

export type IDropdownAction = IAppBarAction | null | undefined;

/*** la preops actions représentant les actions du composant Dropdown */
export type IDropdownActions = IDropdownAction[] | ((options: IDropdownContext<any, any>) => IDropdownAction[]);

export type IDropdownPreparedItems<ItemType = any, ValueType = any> = Record<string, IDropdownPreparedItem<ItemType, ValueType>>;


export interface IDropdownOnChangeOptions<ItemType = any, ValueType = any> extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'> {
    value: ValueType | ValueType[] | undefined;
    dropdownContext: IDropdownContext<ItemType, ValueType>;
};

export interface IDropdownCallbackOptions<ItemType = any, ValueType = any> {
    item: ItemType, index: number, isDropdown: true;
}

export interface IDropdownProps<ItemType = any, ValueType = any> extends Omit<ITextInputProps, "onChange"> {
    items?: ItemType[];
    testID?: string;
    getItemValue?: (options: IDropdownCallbackOptions<ItemType, ValueType>) => ValueType | undefined;
    getItemLabel?: (options: Omit<IDropdownCallbackOptions<ItemType, ValueType>, 'value'> & { value: ValueType }) => ReactNode;
    multiple?: boolean;
    onChange?: (options: IDropdownOnChangeOptions<ItemType, ValueType>) => void;
    defaultValue?: ValueType | ValueType[];
    getHashKey?: (value: ValueType) => string;
    filter?: (preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean;
    listProps?: FlashListProps<IDropdownPreparedItem<ItemType, ValueType>>;
    showSearch?: boolean;
    /**** spécifie si le dropdown est en charge de charger les items */
    isLoading?: boolean;
    isFullScreen?: boolean;
    /*** les props du container de la liste */
    listContainerProps?: IViewProps;
    /*** les props à passer au composant Tooltip qui wrap l'anchor */
    anchorContainerProps?: PressableProps;
    fullScreenAppBarProps?: IAppBarProps;

    dropdownActions?: IDropdownActions;
    elevation?: number;
};

export interface IDropdownPreparedItem<ItemType = any, ValueType = any> {
    value: ValueType;
    hashKey: string;
    item: ItemType;
    label: ReactNode;
    labelText: string;
};