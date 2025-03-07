import { IAppBarAction, IAppBarProps } from "@components/AppBar/types";
import { ITextInputProps } from "@components/TextInput/types";
import { ReactNode } from "react";
import { IViewProps } from "@components/View";
import { PressableProps, FlatListProps } from "react-native";
import { IFontIconProps } from "@components/Icon";
import { ObservableComponent } from "@utils/index";
import { IMenuProps } from "@components/Menu";
import { BigListProps } from "react-native-big-list";

/**
 * Represents the context for a dropdown component, providing methods and state 
 * management for dropdown interactions.
 * 
 * This interface extends the Dropdown `Component` class and includes properties and methods 
 * necessary for managing the state and behavior of a dropdown. It provides access 
 * to filtered items, selection management, visibility control, and utility functions 
 * for interacting with the dropdown items.
 * 
 * @interface IDropdownContext
 * @template ItemType - The type of the item being represented.
 * @template ValueType - The type of the value associated with the item.
 * 
 * @extends Component<Omit<IDropdownProps<ItemType, ValueType>, "items" | "getHashKey">, IDropdownState<ItemType, ValueType>>
 * 
 * @property {IDropdownPreparedItem<ItemType, ValueType>[]} [filteredItems] - An optional array of 
 * prepared items that match the current search criteria. This is useful for displaying 
 * filtered results in the dropdown.
 * 
 * @property {IDropdownPreparedItems<ItemType, ValueType>} itemsByHashKey - A record of prepared 
 * items indexed by their unique hash keys, allowing for efficient access to items within 
 * the dropdown.
 * 
 * @property {boolean} visible - A boolean flag indicating whether the dropdown is currently visible. 
 * This is useful for controlling the display of the dropdown based on user interactions.
 * 
 * @property {(value: ValueType) => string} getHashKey - A function that takes a value and returns 
 * its corresponding hash key. This is used for identifying items uniquely within the dropdown.
 * 
 * @property {() => Record<string, IDropdownPreparedItem<ItemType, ValueType>>} getSelectedItemsByHashKey - 
 * A function that returns a record of selected items indexed by their unique hash keys, allowing for 
 * quick access to the selected items.
 * 
 * @property {() => IDropdownPreparedItem<ItemType, ValueType>[]} getPreparedItems - A function that 
 * returns an array of prepared items that are ready to be displayed in the dropdown.
 * 
 * @property {(value: ValueType) => boolean} isSelected - A function that checks if a given value 
 * is currently selected in the dropdown.
 * 
 * @property {string} [searchText] - An optional string representing the current search text entered 
 * by the user. This can be used to filter the dropdown items based on user input.
 * 
 * @property {((text: string) => any) | undefined} [onSearch] - An optional function that is called 
 * when the user performs a search. It takes the search text as an argument and can be used to 
 * update the filtered items.
 * 
 * @property {IDropdownState<ItemType, ValueType>} state - The current state of the dropdown, 
 * including items, selected values, visibility, and prepared items.
 * 
 * @property {(preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }) => any} 
 * toggleItem - A function that toggles the selection state of a prepared item based on user interaction.
 * 
 * @property {(hasKey: string) => boolean} isSelectedByHashKey - A function that checks if an item 
 * is selected based on its hash key.
 * 
 * @property {() => void} open - A function that opens the dropdown, making it visible to the user.
 * 
 * @property {() => void} close - A function that closes the dropdown, hiding it from the user.
 * 
 * @property {() => void} toggle - A function that toggles the visibility of the dropdown.
 * 
 * @property {() => boolean} isOpen - A function that returns a boolean indicating whether the dropdown 
 * is currently open.
 * 
 * @property {() => string} getTestID - A function that returns a test ID for the dropdown, useful 
 * for testing purposes.
 * 
 * @property {() => void} selectAll - A function that selects all items in the dropdown.
 * 
 * @property {() => void} unselectAll - A function that unselects all items in the dropdown.
 * 
 * @property {(props?: IDropdownProps<ItemType, ValueType>) => IDropdownState<ItemType, ValueType>} 
 * prepareState - A function that prepares and returns the current state of the dropdown based on 
 * the provided props.
 * 
 * @property {IDropdownAction[]} [dropdownActions] - An optional array of actions that can be 
 * performed within the dropdown, such as selecting or unselecting items.
 ```typescript
 * 
 * @property {string} [anchorSelectedText] - An optional string representing the 
 * corresponding selected text calculated from the selected items. This can be 
 * displayed in the dropdown to indicate the current selection.
 * 
 * @property {(defaultValue?: ValueType | ValueType[], itemsByHashKey?: IDropdownPreparedItems<ItemType, ValueType>) => 
 * { selectedValues: ValueType[], selectedItemsByHashKey: Record<string, IDropdownPreparedItem<ItemType, ValueType>> }} 
 * getSelectedValuesAndHashKey - A function that retrieves the selected values and 
 * their corresponding hash keys based on the provided default value and items. 
 * This is useful for managing the selection state and ensuring consistency.
 * 
 * @example
 * // Example usage of the IDropdownContext interface
 * 
 * const dropdownContext: IDropdownContext<{ id: number }, string> = {
 *     filteredItems: [
 *         {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     ],
 *     itemsByHashKey: {
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     },
 *     visible: true,
 *     getHashKey: (value) => `item-${value}`,
 *     getSelectedItemsByHashKey: () => ({
 *         "item-1-hash": {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     }),
 *     getPreparedItems: () => [
 *         {
 *             value: "item-1",
 *             hashKey: "item-1-hash",
 *             item: { id: 1 },
 *             label: <span>Item 1</span>, // ReactNode
 *             labelText: "Item 1" // Plain text representation
 *         }
 *     ],
 *     isSelected: (value) => value === "item-1",
 *     state: {
 *         itemsByHashKey: {
 *             "item-1-hash": {
 *                 value: "item-1",
 *                 hashKey: "item-1-hash",
 *                 item: { id: 1 },
 *                 label: <span>Item 1</span>, // ReactNode
 *                 labelText: "Item 1" // Plain text representation
 *             }
 *         },
 *         selectedValues: ["item-1"],
 *         visible: true,
 *         selectedItemsByHashKey: {
 *             "item-1-hash": {
 *                 value: "item-1",
 *                 hashKey: "item-1-hash",
 *                 item: { id: 1 },
 *                 label: <span>Item 1</span>, // ReactNode
 *                 labelText: "Item 1" // Plain text representation
 *             }
 *         },
 *         preparedItems: []
 *     },
 *     toggleItem: (preparedItem) => { },
 *     isSelectedByHashKey: (hasKey) => hasKey === "item-1-hash",
 *     open: () => {  },
 *     close: () => {  },
 *     toggle: () => { },
 *     isOpen: () => true,
 *     getTestID: () => "dropdown-test-id",
 *     selectAll: () => {  },
 *     unselectAll: () => {  },
 *     prepareState: (props) => ({  }),
 *     dropdownActions: [],
 *     anchorSelectedText: "Item 1",
 *     getSelectedValuesAndHashKey: (defaultValue, itemsByHashKey) => ({
 *         selectedValues: ["item-1"],
 *         selectedItemsByHashKey: {
 *             "item-1-hash": {
 *                 value: "item-1",
 *                 hashKey: "item-1 ,
 *                 item: { id: 1 },
 *                 label: <span>Item 1</span>, // ReactNode
 *                 labelText: "Item 1" // Plain text representation
 *             }
 *         }
 *     })
 * };
 * 
 * @remarks
 * - This interface is essential for managing the context of dropdown components, 
 *   providing a structured way to handle user interactions and state management.
 * - Ensure that the methods and properties are implemented correctly to maintain 
 *   a smooth user experience within the dropdown.
 */
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
    toggleItem: (preparedItem: IDropdownPreparedItem<ItemType, ValueType> & { index: number }) => any;
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

/**
 * Represents an action that can be performed in a dropdown component.
 * 
 * This type alias defines the structure of an action that can be associated with 
 * a dropdown. An action can be an instance of `IAppBarAction` that includes a 
 * `dropdownContext`, or it can be `null` or `undefined` if no action is specified.
 * 
 * @type IDropdownAction
 * 
 * @example
 * // Example usage of the IDropdownAction type alias
 * 
 * const dropdownAction: IDropdownAction = {
 *     label: "Select All",
 *     onPress: (context) => {
 *         context.selectAll(); // Call the selectAll method from the dropdown context
 *     },
 *     dropdownContext: {}
 * };
 * 
 * @remarks
 * - This type is useful for defining actions that can be triggered from within 
 *   the dropdown, such as selecting all items or performing custom operations.
 * - Ensure that the `dropdownContext` is properly passed to the action to allow 
 *   access to dropdown methods and state.
 */
export type IDropdownAction = IAppBarAction<{ dropdownContext: IDropdownContext }> | null | undefined;

/**
 * Represents a collection of actions that can be performed in a dropdown component.
 * 
 * This type alias defines a structure for either an array of `IDropdownAction` 
 * instances or a function that takes a dropdown context and returns an array of 
 * actions. This flexibility allows for dynamic generation of actions based on 
 * the current state of the dropdown.
 * 
 * @type IDropdownActions
 * 
 * @example
 * // Example usage of the IDropdownActions type alias
 * 
 * const dropdownActions: IDropdownActions = [
 *     {
 *         label: "Select All",
 *         onPress: (context) => {
 *             context.selectAll(); // Call the selectAll method from the dropdown context
 *         },
 *         dropdownContext: {}
 *     },
 *     {
 *         label: "Unselect All",
 *         onPress: (context) => {
 *             context.unselectAll(); // Call the unselectAll method from the dropdown context
 *         },
 *         dropdownContext: {}
 *     }
 * ];
 * 
 * // Dynamic actions based on dropdown context
 * const dynamicActions: IDropdownActions = (context) => {
 *     return context.isOpen() ? dropdownActions : [];
 * };
 * 
 * @remarks
 * - This type is particularly useful for managing multiple actions that can be 
 *   performed in the dropdown, allowing for both static and dynamic action 
 *   definitions.
 * - When using a function to generate actions, ensure that it returns an array 
 *   of actions based on the current dropdown context.
 */
export type IDropdownActions = IDropdownAction[] | ((options: IDropdownContext<any, any>) => IDropdownAction[]);
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
 * @property {IDropdownContext<ItemType, ValueType>} dropdownContext - The context of 
 * the dropdown, providing access to methods and state management for the dropdown component.
 * 
 * @example
 * // Example usage of the IDropdownOnChangeOptions interface
 * 
 * const handleDropdownChange = (options: IDropdownOnChangeOptions<{ id: number }, string>) => {
 *     console.log(`New value selected: ${options.value}`);
 *     console.log(`Dropdown context:`, options.dropdownContext);
 * };
 * 
 * // Simulating a dropdown change event
 * const dropdownChangeOptions: IDropdownOnChangeOptions<{ id: number }, string> = {
 *     value: "item-1",
 *     dropdownContext: {  }
 * };
 * handleDropdownChange(dropdownChangeOptions);
 * // Output: New value selected: item-1
 * // Output: Dropdown context: {  }
 * 
 * @remarks
 * - This interface is particularly useful for managing the change events in dropdown components, 
 *   allowing for efficient handling of user selections.
 * - Ensure that the `dropdownContext` is properly passed to access the necessary methods 
 *   and state related to the dropdown.
 */
export interface IDropdownOnChangeOptions<ItemType = any, ValueType = any> extends Omit<Partial<IDropdownPreparedItem<ItemType, ValueType>>, 'value'> {
    value: ValueType | ValueType[] | undefined;
    dropdownContext: IDropdownContext<ItemType, ValueType>;
};

/**
 * Represents the options provided to callback functions in a dropdown component.
 * 
 * This interface defines the structure of the options that are passed to callback 
 * functions when interacting with items in a dropdown. It provides essential 
 * information about the item being interacted with, including its index and 
 * a flag indicating that the context is within a dropdown.
 * 
 * @interface IDropdownCallbackOptions
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
 * // Example usage of the IDropdownCallbackOptions interface
 * 
 * const handleDropdownItemClick = (options: IDropdownCallbackOptions<{ id: number }, string>) => {
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
export interface IDropdownCallbackOptions<ItemType = any, ValueType = any> {
    item: ItemType; // The item being interacted with
    index: number; // The index of the item in the dropdown list
    isDropdown: true; // Indicates that the context is within a dropdown
}

/**
 * Represents the properties for a dropdown component.
 * 
 * This interface defines the structure of the props that can be passed to a dropdown 
 * component, allowing for customization of its behavior and appearance. It extends 
 * the `ITextInputProps` interface, omitting the `onChange` property to provide 
 * a specific change handling mechanism for the dropdown.
 * 
 * @interface IDropdownProps
 * @template ItemType - The type of the items in the dropdown.
 * @template ValueType - The type of the value associated with the items.
 * 
 * @extends Omit<ITextInputProps, "onChange">
 * 
 * @property {ItemType[]} [items] - An optional array of items to be displayed in the dropdown.
 * 
 * @property {string} [testID] - An optional test ID for the dropdown, useful for testing purposes.
 * 
 * @property {(options: IDropdownCallbackOptions<ItemType, ValueType>) => ValueType | undefined} [getItemValue] - 
 * An optional function that retrieves the value associated with a dropdown item based on the provided options.
 * 
 * @property {(options: Omit<IDropdownCallbackOptions<ItemType, ValueType>, 'value'> & { value: ValueType }) => ReactNode} [getItemLabel] - 
 * An optional function that retrieves the label to be displayed for a dropdown item based on the provided options.
 * 
 * @property {boolean} [multiple] - An optional flag indicating whether multiple items can be selected in the dropdown.
 * 
 * @property {(options: IDropdownOnChangeOptions<ItemType, ValueType>) => void} [onChange] - 
 * An optional callback function that is called when the selected value(s) change.
 * 
 * @property {ValueType | ValueType[]} [defaultValue] - An optional default value or values for the dropdown.
 * 
 * @property {(value: ValueType) => string} [getHashKey] - An optional function that returns a unique hash key for a given value.
 * 
 * @property {(preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean} [filter] - 
 * An optional function that determines whether a prepared item should be included in the dropdown based on filtering criteria.
 * 
 * @property {FlatListProps<IDropdownPreparedItem<ItemType, ValueType>>} [listProps] - 
 * Optional properties for customizing the list of dropdown items.
 * 
 * @property {boolean} [showSearch] - An optional flag indicating whether the dropdown should display a search input.
 * 
 * @property {Omit<ITextInputProps, "value" | "defaultValue">} [searchProps] - 
 * Optional properties for customizing the search input within the dropdown.
 * 
 * @property {boolean} [isLoading] - An optional flag indicating whether the dropdown is currently loading items.
 * 
 * @property {boolean} [isFullScreen] - An optional flag indicating whether the dropdown should be displayed in full screen mode.
 * 
 * @property {IViewProps} [listContainerProps] - Optional properties for the container of the dropdown list.
 * 
 * @property {PressableProps} [anchorContainerProps] - Optional properties to pass to the Tooltip component that wraps the anchor.
 * @property {IDropdownActions} [dropdownActions] - An optional array of actions that can be performed within the dropdown.
 * 
 * @example
 * // Example usage of the IDropdownProps interface
 * 
 * const dropdownProps: IDropdownProps<{ id: number }, string> = {
 *     items: [{ id: 1 }, { id: 2 }],
 *     testID: "my-dropdown",
 *     getItemValue: (options) => options.item.id.toString(),
 *     getItemLabel: (options) => <span>{options.value}</span>,
 *     multiple: true,
 *     onChange: (options) => {
 *         console.log("Selected values:", options.value);
 *     },
 *     defaultValue: "1",
 *     getHashKey: (value) => `item-${value}`,
 *     filter: (preparedItem) => preparedItem.labelText.includes("Item"),
 *     showSearch: true,
 *     searchProps: { placeholder: "Search items..." },
 *     isLoading: false,
 *     isFullScreen: false,
 *     listContainerProps: { style: { padding: 10 } ```typescript
 *     },
 *     anchorContainerProps: { onPress: () => console.log("Anchor pressed") },
 *     dropdownActions: [
 *         {
 *             title: "Action 1",
 *             onPress: (event,{dropdownContext}) => console.log("Action 1 pressed"),
 *         },
 *         {
 *             title: "Action 2",
 *             onPress: () => console.log("Action 2 pressed"),
 *         },
 *     ],
 * };
 * 
 * // Rendering the dropdown component
 * <Dropdown {...dropdownProps} />
 * 
 * @remarks
 * - This interface is essential for creating flexible and customizable dropdown components 
 *   that can handle various use cases, including single and multiple selections, loading states, 
 *   and search functionalities.
 * - Ensure that the appropriate props are passed to customize the dropdown according to 
 *   the application's requirements.
 */
export interface IDropdownProps<ItemType = any, ValueType = any> extends Omit<ITextInputProps, "onChange"> {
    items?: ItemType[]; // An optional array of items to be displayed in the dropdown
    testID?: string; // An optional test ID for the dropdown
    getItemValue?: (options: IDropdownCallbackOptions<ItemType, ValueType>) => ValueType | undefined; // Function to get item value
    getItemLabel?: (options: Omit<IDropdownCallbackOptions<ItemType, ValueType>, 'value'> & { value: ValueType }) => ReactNode; // Function to get item label
    multiple?: boolean; // Flag for multiple selections
    onChange?: (options: IDropdownOnChangeOptions<ItemType, ValueType>) => void; // Callback for value changes
    defaultValue?: ValueType | ValueType[]; // Default value(s) for the dropdown
    getHashKey?: (value: ValueType) => string; // Function to get unique hash key
    filter?: (preparedItem: IDropdownPreparedItem<ItemType, ValueType>, index: number) => boolean; // Function to filter items
    listProps?: BigListProps<IDropdownPreparedItem<ItemType, ValueType>>; // Props for the item list

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
    /*** Props for the list container */
    listContainerProps?: IViewProps; // Props for the list container
    /*** Props for the Tooltip component wrapping the anchor */
    anchorContainerProps?: PressableProps; // Props for the anchor container

    dropdownActions?: IDropdownActions; // Optional actions for the dropdown

    /***
     * The name of the icon to be used for the selected state of the dropdown items.
     * If not provided, the default icon will be used.
     * by default : it's value is 'check' form multiple selection and 'radiobox-marked' for single selection
     */
    selectedIconName?: IFontIconProps["name"];

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
        dropdownContext: IDropdownContext<ItemType, ValueType>;
        isLoading: boolean;
        multiple: boolean;
        /***
         * The selected items.
         */
        selectedItems: ItemType[];
        selectedValues: ValueType[];
    }) => JSX.Element;
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