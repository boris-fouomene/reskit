import { ITextInputProps } from "@components/TextInput/types";
import { ReactElement, ReactNode } from "react";
import { PressableProps, FlatListProps } from "react-native";
import { ObservableComponent } from "@utils/index";
import { IMenuContext, IMenuProps } from "@components/Menu/types";
import { INavContext } from "@components/Nav";
import { IFontIconName } from "@components/Icon/types";
import { IClassName } from "@src/types";

export interface IDropdownContext<ItemType = any, ValueType = any> extends ObservableComponent<Omit<IDropdownProps<ItemType, ValueType>, "items" | "getHashKey">, IDropdownState<ItemType, ValueType>, IDropdownEvent> {
    /***
     * The filtered items. based on the search text
     */
    filteredItems?: IDropdownPreparedItem<ItemType, ValueType>[];

    /**
     * The items by hash key.
     */
    itemsByHashKey: IDropdownPreparedItems<ItemType, ValueType>;

    /***
     * The visibility of the dropdown.
     */
    visible: boolean;
    getHashKey: (value: ValueType) => string;
    /***
     * get the selected items by hash key
     * Return a record of selected items indexed by their unique hash keys, allowing for quick access to the selected items.
     * @returns {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} A record of selected items, indexed by their unique hash keys.
     */
    getSelectedItemsByHashKey: () => Record<string, IDropdownPreparedItem<ItemType, ValueType>>;
    /***
     * get the prepared items
     * Return an array of prepared items that are ready to be displayed in the dropdown.
     * @returns {IDropdownPreparedItem<ItemType, ValueType>[]} An array of prepared items.
     */
    getPreparedItems: () => IDropdownPreparedItem<ItemType, ValueType>[];

    /***
     * Check if a given value is selected.
     * 
     * @param {ValueType} value - The value to check.
     * @returns {boolean} True if the value is selected, false otherwise.
     */
    isSelected: (value: ValueType) => boolean;

    /***
     * The search text.
     */
    searchText?: string;
    /***
     * The onSearch callback function.
     */
    onSearch?: (text: string) => any;
    /***
     * The state of the dropdown.
     */
    state: IDropdownState<ItemType, ValueType>;
    /***
     * Toggle the selection of a prepared item.
     * 
     * @param {IDropdownPreparedItem<ItemType, ValueType> & { index: number }} preparedItem - The prepared item to toggle.
     * @returns {void} This method does not return a value.
     */
    toggleItem: (preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }, menuContext?: IMenuContext) => any;
    /***
     * Check if a given hash key is selected.
     * 
     * @param {string} hasKey - The hash key to check.
     * @returns {boolean} True if the hash key is selected, false otherwise.
     */
    isSelectedByHashKey: (hasKey: string) => boolean;

    /***
     * Open the dropdown.
     * @returns {void} This method does not return a value.
     */
    open: () => void;
    /**
     * Close the dropdown.
     * @returns {void} This method does not return a value.
     */
    close: () => void;
    /***
     * Toggle the visibility of the dropdown.
     */
    toggle: () => void;
    /***
     * Check if the dropdown is open.
     * @returns {boolean} True if the dropdown is open, false otherwise.
     */
    isOpen: () => boolean;
    /***
     * Get the test ID for the dropdown.
     * @returns {string} The test ID for the dropdown.
     */
    getTestID: () => string;
    /***
     * Select all items in the dropdown.
     * @returns {void} This method does not return a value.
     */
    selectAll: () => void;
    /***
     * Unselect all items in the dropdown.
     * @returns {void} This method does not return a value.
     */
    unselectAll: () => void;
    /**
     * Prepare the state of the dropdown.
     * @param {IDropdownProps<ItemType, ValueType>} props - The props for the dropdown.
     */
    prepareState(props?: IDropdownProps<ItemType, ValueType>): IDropdownState<ItemType, ValueType>;

    /***
     * The dropdown actions.
     */
    dropdownActions?: IDropdownAction[];
    /***
     * the corresponding selected text calculated from selected items
     */
    anchorSelectedText?: string;
    /***
     * get the selected values and hash key
     * Return an object containing the selected values and their corresponding hash keys.
     * @param {ValueType | ValueType[]} [defaultValue] - The default value to use if no value is selected.
     * @param {IDropdownPreparedItems<ItemType, ValueType>} [itemsByHashKey] - An optional object of items indexed by their hash keys.
     * @returns {selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>} An object containing the selected values and their corresponding hash keys.
     */
    getSelectedValuesAndHashKey(defaultValue?: ValueType | ValueType[], itemsByHashKey?: IDropdownPreparedItems<ItemType, ValueType>): { selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> };
}

/**
 * Represents the state of a dropdown component.
 * 
 * This interface defines the structure of the state that manages the items, 
 * selection, visibility, and prepared items within a dropdown. It provides 
 * essential information needed to render the dropdown and handle user interactions.
 * 
 * @interface IDropdownState
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} itemsByHashKey - 
 * A record of prepared items indexed by their unique hash keys. This allows for 
 * efficient access to items within the dropdown.
 * 
 * @property {ValueType[]} selectedValues - An array of values representing the 
 * currently selected items in the dropdown. This can be used to track user 
 * selections and manage the state of the dropdown.
 * 
 * @property {boolean} visible - A boolean flag indicating whether the dropdown 
 * is currently visible. This is useful for controlling the display of the dropdown 
 * based on user interactions.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} selectedItemsByHashKey - 
 * A record of selected items indexed by their unique hash keys. This allows for 
 * quick access to the selected items and their associated data.
 * 
 * @property {IDropdownPreparedItem<ItemType, ValueType>[]} preparedItems - 
 * An array of prepared items that are ready to be displayed in the dropdown. 
 * This array contains the items that have been processed and formatted for rendering.
 * 
 * @example
 * // Example usage of the IDropdownState interface
 * 
 * const dropdownState: IDropdownState<{ id: number }, string> = {
 *     itemsByHashKey: {
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         },
 *         "item-2-hash": {
 *             value: "item-2",
 *             hashKey: "item-2-hash",
 *             item: { id: 2 },
 *             label: <span>Item 2</span>, // ReactNode
 *             labelText: "Item 2" // Plain text representation
 *         }
 *     },
 *     selectedValues: ["item-1"],
 *     visible: true,
 *     selectedItemsByHashKey: {
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     },
 *     preparedItems: [
 *         {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         },
 *         {
 *             value: "item-2",
 *             hashKey: "item-2-hash",
 *             item: { id: 2 },
 *             label: <span>Item 2</span>, // ReactNode
 *             labelText: "Item 2" // Plain text representation
 *         }
 *     ]
 * };
 * 
 * @remarks
 * - This interface is particularly useful for managing the internal state of 
 *   dropdown components, allowing for efficient rendering and interaction.
 * - Ensure that the `itemsByHashKey` and `selectedItemsByHashKey` are kept 
 *   in sync to avoid inconsistencies in the dropdown state.
 */
export interface IDropdownState<ItemType = any, ValueType = any> {
    itemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>,
    selectedValues: ValueType[]
    visible: boolean;
    selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>>;
    preparedItems: IDropdownPreparedItem<ItemType, ValueType>[];
};

export interface IDropdownAction<Context = unknown> extends INavContext<Context> { }


export type IDropdownActions<Context = unknown> = IDropdownAction<Context>[] | ((options: IDropdownContext<any, any>) => IDropdownAction<Context>[]);
/**
 * Represents a collection of prepared items in a dropdown component.
 * 
 * This type alias defines a record structure where each key is a unique string 
 * identifier (hash key) for a prepared dropdown item, and the value is the 
 * corresponding prepared item itself. This structure allows for efficient 
 * access and management of dropdown items, facilitating operations such as 
 * selection, filtering, and rendering.
 * 
 * @type IDropdownPreparedItems
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {Record<string, IDropdownPreparedItem<ItemType, ValueType>>} - A record 
 * where each key is a unique string (hash key) and each value is an instance of 
 * `IDropdownPreparedItem`, representing a prepared item in the dropdown.
 * 
 * @example
 * // Example usage of the IDropdownPreparedItems type alias
 * 
 * const preparedItems: IDropdownPreparedItems<{ id: number }, string> = {
 *     "item-1-hash": {
 *         value: "item-1",
 *         hashKey: "item-1-hash",
 *         item: { id: 1 },
 *         label: <span>Item 1</span>, // ReactNode
 *         labelText: "Item 1" // Plain text representation
 *     },
 *     "item-2-hash": {
 *         value: "item-2",
 *         hashKey: "item-2-hash",
 *         item: { id: 2 },
 *         label: <span>Item 2</span>, // ReactNode
 *         labelText: "Item 2" // Plain text representation
 *     }
 * };
 * 
 * // Function to get a prepared item by its hash key
 * function getPreparedItemByHashKey(hashKey: string): IDropdownPreparedItem<any, any> | undefined {
 *     return preparedItems[hashKey];
 * }
 * 
 * const item = getPreparedItemByHashKey("item-1-hash");
 * console.log(item); // Output: { value: "item-1", hashKey: "item-1-hash", ... }
 * 
 * @remarks
 * - This type alias is particularly useful in dropdown components where multiple 
 * prepared items need to be stored and accessed efficiently.
 * - Ensure that the keys used in the record are unique to avoid conflicts and 
 * rendering issues.
 */
export type IDropdownPreparedItems<ItemType = any, ValueType = any> = Record<string, IDropdownPreparedItem<ItemType, ValueType>>;

/**
 * Represents the options provided to callback functions when the dropdown value changes.
 * 
 * This interface extends the `Partial<IDropdownPreparedItem<ItemType, ValueType>>` 
 * interface, omitting the `value` property, and includes additional properties 
 * necessary for handling changes in the dropdown selection.
 * 
 * @interface IDropdownOnChangeOptions
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'>
 * 
 * @property {ValueType | ValueType[] | undefined} value - The new value(s) selected 
 * from the dropdown. This can be a single value, an array of values (for multi-select), 
 * or `undefined` if no value is selected.
 * 
 * @property {IDropdownContext<ItemType, ValueType>} dropdown - The context of 
 * the dropdown, providing access to methods and state management for the dropdown component.
 * 
 * @example
 * // Example usage of the IDropdownOnChangeOptions interface
 * 
 * const handleDropdownChange = (options: IDropdownOnChangeOptions<{ id: number }, string>) => {
 *     console.log(`New value selected: ${options.value}`);
 *     console.log(`Dropdown context:`, options.dropdown);
 * };
 * 
 * // Simulating a dropdown change event
 * const dropdownChangeOptions: IDropdownOnChangeOptions<{ id: number }, string> = {
 *     value: "item-1",
 *     dropdown: {  }
 * };
 * handleDropdownChange(dropdownChangeOptions);
 * // Output: New value selected: item-1
 * // Output: Dropdown context: {  }
 * 
 * @remarks
 * - This interface is particularly useful for managing the change events in dropdown components, 
 *   allowing for efficient handling of user selections.
 * - Ensure that the `dropdown` is properly passed to access the necessary methods 
 *   and state related to the dropdown.
 */
export interface IDropdownOnChangeOptions<ItemType = any, ValueType = any> extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'> {
    value: ValueType | ValueType[] | undefined;
    dropdown: IDropdownContext<ItemType, ValueType>;
};

/**
 * Represents the options provided to callback functions in a dropdown component.
 * 
 * This interface defines the structure of the options that are passed to callback 
 * functions when interacting with items in a dropdown. It provides essential 
 * information about the item being interacted with, including its index and 
 * a flag indicating that the context is within a dropdown.
 * 
 * @interface IDropdownCallOptions
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {ItemType} item - The item that is being interacted with. This can be any 
 * type of data structure that contains the information needed for the dropdown item.
 * 
 * @property {number} index - The index of the item within the dropdown list. This 
 * can be useful for identifying the position of the item in the list, especially 
 * when multiple items are present.
 * 
 * @property {boolean} isDropdown - A boolean flag that indicates whether the context 
 * is within a dropdown. This is typically set to `true` and can be used to differentiate 
 * between dropdown interactions and other types of interactions in the application.
 * 
 * @example
 * // Example usage of the IDropdownCallOptions interface
 * 
 * const handleDropdownItemClick = (options: IDropdownCallOptions<{ id: number }, string>) => {
 *     console.log(`Item clicked: ${options.item}, Index: ${options.index}`);
 *     // Perform actions based on the clicked item
 * };
 * 
 * // Simulating a dropdown item click
 * const dropdownItem = { id: 1, name: "Item 1" };
 * handleDropdownItemClick({ item: dropdownItem, index: 0, isDropdown: true });
 * // Output: Item clicked: [object Object], Index: 0
 * 
 * @remarks
 * - This interface is particularly useful in dropdown components where callback 
 * functions need to receive contextual information about the item being interacted with.
 * - Ensure that the `isDropdown` property is consistently set to `true` when using this 
 * interface in dropdown-related callbacks.
 */
export interface IDropdownCallOptions<ItemType = any, ValueType = any> {
    item: ItemType; // The item being interacted with
    index: number; // The index of the item in the dropdown list
    isDropdown: true; // Indicates that the context is within a dropdown
}

export interface IDropdownProps<ItemType = any, ValueType = any> extends Omit<ITextInputProps, "onChange" | "ref"> {
    items?: ItemType[]; // An optional array of items to be displayed in the dropdown
    testID?: string; // An optional test ID for the dropdown
    getItemValue?: (options: IDropdownCallOptions<ItemType, ValueType>) => ValueType | undefined; // Function to get item value
    getItemLabel?: (options: Omit<IDropdownCallOptions<ItemType, ValueType>, 'value'> & { value: ValueType }) => ReactNode; // Function to get item label
    multiple?: boolean; // Flag for multiple selections
    onChange?: (options: IDropdownOnChangeOptions<ItemType, ValueType>) => void; // Callback for value changes
    defaultValue?: ValueType | ValueType[]; // Default value(s) for the dropdown
    getHashKey?: (value: ValueType) => string; // Function to get unique hash key
    filter?: (preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean; // Function to filter items
    listProps?: FlatListProps<IDropdownPreparedItem<ItemType, ValueType>>; // Props for the item list

    /**
     * Whether the dropdown should display a search input
     */
    showSearch?: boolean; // Flag for search input visibility
    /***
     * The props of the search input
     */
    searchProps?: Omit<ITextInputProps, "value" | "defaultValue">; // Props for the search input

    /**** Specifies if the dropdown is responsible for loading items */
    isLoading?: boolean; // Flag for loading state
    isFullScreen?: boolean; // Flag for full screen display

    listContainerClassName?: IClassName;

    listContentContainerClassName?: IClassName;

    /*** Props for the Tooltip component wrapping the anchor */
    anchorContainerProps?: PressableProps; // Props for the anchor container

    dropdownActions?: IDropdownActions; // Optional actions for the dropdown

    /***
     * The name of the icon to be used for the selected state of the dropdown items.
     * If not provided, the default icon will be used.
     * by default : it's value is 'check' form multiple selection and 'radiobox-marked' for single selection
     */
    selectedIconName?: IFontIconName;

    /***
     * Props for the menu component that wraps the dropdown.
     * This allows for customization of the menu's appearance and behavior.
     */
    menuProps?: Omit<IMenuProps, "anchor">;

    /***
     * The props for the anchor component.
     * This allows for customization of the anchor's appearance and behavior.
     * By default, it's rendered as a TextInput component.
     */
    anchor?: (options: Omit<ITextInputProps, "onChange"> & {
        dropdown: IDropdownContext<ItemType, ValueType>;
        isLoading: boolean;
        multiple: boolean;
        /***
         * The selected items.
         */
        selectedItems: ItemType[];
        selectedValues: ValueType[];
    }) => ReactElement;

    /***
     * Use When getItemLabel is not specified
     * It represent a key of ItemType to be used as label when ItemType is an object
     * If a string is provided, we will retrieve the value of the field using the string as key
     */
    itemLabelField?: keyof ItemType | string;

    /***
     * Use When getItemValue is not specified
     * It represent the field of the item to be used as value when ItemType is an object
     */
    valueField?: keyof ItemType | string;
};

/**
 * Represents a prepared item in a dropdown component.
 * 
 * This interface defines the structure of an item that has been processed and is ready 
 * to be displayed in a dropdown menu. Each prepared item contains essential information 
 * that allows for efficient rendering and interaction within the dropdown.
 * 
 * @interface IDropdownPreparedItem
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @property {ValueType} value - The value associated with the dropdown item. This is the 
 * value that will be returned when the item is selected.
 * 
 * @property {string} hashKey - A unique key generated for the item, used for efficient 
 * identification and rendering within the dropdown. This key should be unique across 
 * all items in the dropdown.
 * 
 * @property {ItemType} item - The original item data that this prepared item represents. 
 * This can be any type of data structure that contains the information needed for the 
 * dropdown item.
 * 
 * @property {ReactNode} label - The label to be displayed for the dropdown item. This can 
 * be a string, a React component, or any valid React node that represents the visual 
 * representation of the item in the dropdown.
 * 
 * @property {string} labelText - A plain text representation of the label, useful for 
 * accessibility purposes and for situations where a simple text representation is needed.
 * 
 * @example
 * // Example usage of the IDropdownPreparedItem interface
 * 
 * const dropdownItem: IDropdownPreparedItem<{ id: number }, string> = {
 *     value: "item-1",
 *     hashKey: "item-1-hash",
 *     item: { id: 1 },
 *     label: <span>Item 1</span>, // ReactNode
 *     labelText: "Item 1" // Plain text representation
 * };
 * 
 * // Function to render a dropdown item
 * function renderDropdownItem(item: IDropdownPreparedItem<any, any>) {
 *     return (
 *         <div key={item.hashKey}>
 *             {item.label} {}
 *         </div>
 *     );
 * }
 * 
 * @remarks
 * - This interface is particularly useful in dropdown components where items need to be 
 * prepared for display, allowing for efficient rendering and interaction.
 * - Ensure that the `hashKey` is unique for each item to avoid rendering issues.
 * - The `label` can be customized to include icons or other components for enhanced 
 * user experience.
 */
export interface IDropdownPreparedItem<ItemType = any, ValueType = any> {
    value: ValueType; // The value associated with the dropdown item
    hashKey: string; // A unique key for the item
    item: ItemType; // The original item data
    label: ReactNode; // The label to be displayed for the item
    labelText: string; // Plain text representation of the label
};


/**
 * Represents the possible events that can be triggered within a dropdown component.
 * 
 * This type defines a set of string literals that represent various events that can occur
 * during the lifecycle of a dropdown. These events are useful for tracking user interactions
 * and managing the state of the dropdown component.
 * 
 * @type IDropdownEvent
 * 
 * @example
 * // Example usage of the IDropdownEvent type
 * 
 * const handleDropdownEvent = (event: IDropdownEvent) => {
 *     switch (event) {
 *         case "toggleVisibility":
 *             console.log("Dropdown visibility toggled");
 *             break;
 *         case "selectItem":
 *             console.log("Item selected in dropdown");
 *             break;
 *         case "open":
 *             console.log("Dropdown opened");
 *             break;
 *         case "close":
 *             console.log("Dropdown closed");
 *             break;
 *         case "toggleItem":
 *             console.log("Item selection toggled");
 *             break;
 *         case "unselectItem":
 *             console.log("Item unselected");
 *             break;
 *         default:
 *             console.log("Unknown dropdown event");
 *     }
 * };
 * 
 * // Simulating a dropdown event
 * handleDropdownEvent("open"); // Output: "Dropdown opened"
 * 
 * @remarks
 * - This type is particularly useful for event handling in dropdown components, allowing
 *   developers to respond to specific user actions.
 * - Ensure that event handlers are properly implemented to manage the state and behavior
 *   of the dropdown based on these events.
 */
export type IDropdownEvent = "toggleVisibility" | "selectItem" | "open" | "close" | "toggleItem" | "unselectItem" | "selectAll" | "unselectAll";