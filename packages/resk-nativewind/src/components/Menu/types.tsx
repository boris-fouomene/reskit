
import { IButtonProps } from "@components/Button/types";
import { IExpandableProps } from "@components/Expandable/types";
import { IClassName, IReactNullableElement, IViewStyle } from "../../types";
import { ReactNode } from "react";
import { PressableProps, ScrollViewProps, Animated, ViewProps } from "react-native";
import { PressableStateCallbackType } from "react-native";
import { IHtmlDivProps } from "@html/types";
import { useBreakpoints } from "@utils/breakpoints";
import { IHtmlDetailsProps } from "@html/Details";
import { IKeyboardAvoidingViewProps } from "@components/KeyboardAvoidingView";

/**
 * Represents the possible positions where the menu can be displayed
 * relative to its anchor element.
 * 
 * This type is used to specify the alignment of a menu in relation to 
 * another UI component, such as a button or an icon. Depending on the 
 * value provided, the menu will render in one of the four cardinal 
 * directions: above, below, to the left, or to the right of the anchor.
 * 
 * @enum {string}
 * @example
 * // Usage in a component to determine the menu position
 * const menuPosition: IMenuPosition = 'bottom';
 * 
 * // This will render the menu below the anchor element
 * renderMenu(menuPosition);
 * 
 * // Other examples of possible values:
 * const topMenu: IMenuPosition = 'top';    // Menu appears above the anchor
 * const leftMenu: IMenuPosition = 'left';  // Menu appears to the left of the anchor
 * const rightMenu: IMenuPosition = 'right';// Menu appears to the right of the anchor
 */
export type IMenuPosition = 'top' | 'bottom' | 'left' | 'right';



/**
 * Measurements of the anchor element's position and size.
 * 
 * This interface provides the necessary dimensions and coordinates 
 * of an anchor element, which can be used to position related UI 
 * components, such as menus or tooltips, accurately on the screen.
 * 
 * It captures the anchor's position in the viewport and its size, 
 * allowing developers to dynamically adjust the placement of 
 * associated elements based on the anchor's measurements.
 * 
 * @interface IMenuAnchorMeasurements
 * @property {number} pageX - X coordinate of the anchor element 
 *                            relative to the entire window. This value 
 *                            indicates how far the anchor is from the 
 *                            left edge of the viewport.
 * @property {number} pageY - Y coordinate of the anchor element 
 *                            relative to the entire window. This value 
 *                            indicates how far the anchor is from the 
 *                            top edge of the viewport.
 * @property {number} width - The width of the anchor element in pixels. 
 *                            This is useful for calculating horizontal 
 *                            alignment of related UI components.
 * @property {number} height - The height of the anchor element in pixels. 
 *                             This is useful for calculating vertical 
 *                             alignment of related UI components.
 * 
 * @example
 * // Example of using IMenuAnchorMeasurements to position a menu
 * const anchorMeasurements: IMenuAnchorMeasurements = {
 *     pageX: 100,
 *     pageY: 200,
 *     width: 50,
 *     height: 30,
 * };
 * 
 * // Function to calculate menu position based on anchor measurements
 * const calculateMenuPosition = (measurements: IMenuAnchorMeasurements) => {
 *     const { pageX, pageY, width, height } = measurements;
 *     // Position menu to the right of the anchor
 *     return {
 *         left: pageX + width,
 *         top: pageY,
 *     };
 * };
 * 
 * const menuPosition = calculateMenuPosition(anchorMeasurements);
 * // This will position the menu at (150, 200) based on the anchor's measurements
 */
export interface IMenuAnchorMeasurements {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
};


/**
 * Result of position calculations containing the final position and coordinates.
 * 
 * This interface encapsulates the outcome of calculations performed to 
 * determine the appropriate position of a menu relative to its anchor 
 * element. It includes both the designated position (e.g., top, bottom, 
 * left, right) as well as the exact coordinates where the menu should 
 * be rendered on the screen.
 * 
 * By using this interface, developers can easily access both the 
 * positioning strategy and the pixel-perfect coordinates needed to 
 * render the menu accurately.
 * 
 * @interface IMenuCalculatedPosition
 * @property {IMenuPosition} position - The calculated position of the menu 
 *                                       relative to the anchor element. This 
 *                                       will be one of the values defined in 
 *                                       the `IMenuPosition` type, indicating 
 *                                       where the menu is intended to appear 
 *                                       (e.g., 'top', 'bottom', 'left', or 
 *                                       'right').
 * @property {number} x - Final X coordinate in pixels where the menu 
 *                        should be rendered on the screen. This value is 
 *                        calculated based on the anchor's measurements and 
 *                        the desired position of the menu.
 * @property {number} y - Final Y coordinate in pixels where the menu 
 *                        should be rendered on the screen. Similar to the 
 *                        X coordinate, this value is derived from the anchor 
 *                        measurements and the calculated position.
 * 
 * @example
 * // Example of using IMenuCalculatedPosition to render a menu
 * const calculatedPosition: IMenuCalculatedPosition = {
 *     position: 'bottom',  // Indicates the menu should appear below the anchor
 *     x: 150,              // Final X coordinate for the menu
 *     y: 220,              // Final Y coordinate for the menu
 * };
 * 
 * // Function to render the menu based on calculated position
 * const renderMenu = (menuPosition: IMenuCalculatedPosition) => {
 *     const { position, x, y } = menuPosition;
 *     // Render the menu at the specified coordinates
 *     return (
 *         <Menu style={{ position: 'absolute', left: x, top: y }}>
 *           
 *         </Menu>
 *     );
 * };
 * 
 * // Call the render function with the calculated position
 * renderMenu(calculatedPosition);
 */
export interface IMenuCalculatedPosition {
    xPosition?: IMenuPosition;
    yPosition?: IMenuPosition;
    left?: number;
    top?: number;
    height?: number;
    width?: number;
    bottom?: number;
    calculatedFromPosition: IMenuPosition;
    right?: number;
    /**
     * The max width of the menu.
     */
    maxWidth?: number;
    /**
     * The max height of the menu.
     */
    maxHeight?: number;
}

/***
 * Interface representing the context related to the menu at a given moment.
 * 
 * This interface defines the structure of the context that provides information 
 * and methods for managing the state of a menu (or drawer) in a React application. 
 * It includes properties to determine visibility and methods to open and close the menu.
 * 
 * @interface IMenuContext
 * 
 * @property {boolean} [visible] - 
 *         Optional property indicating whether the menu is currently visible. 
 *         This can be used to conditionally render the menu or perform actions 
 *         based on its visibility state.
 * 
 * @property {() => boolean} [isOpen] - 
 *         Optional method that returns a boolean indicating whether the menu is open. 
 *         This can be useful for checking the menu state without directly accessing 
 *         the visibility property.
 * 
 * @property {(event?: GestureResponderEvent, callback?: Function) => any} open - 
 *         Method to open the menu. This method can accept an optional event parameter 
 *         (for gesture events) and an optional callback function to be executed after 
 *         the menu has been opened. This allows for additional actions to be performed 
 *         in response to the menu being opened.
 * 
 * @property {(event?: GestureResponderEvent, callback?: Function) => any} close - 
 *         Method to close the menu. Similar to open, this method can accept 
 *         an optional event parameter and an optional callback function. This provides 
 *         flexibility in handling menu closure and executing follow-up actions.
 * 

 * @example
 * // Example of using IMenuContext in a React component
 * const MyMenuComponent: React.FC = () => {
 *     const menuContext = useContext(MenuContext); // Assuming MenuContext is created using React's Context API
 *     const handleOpen = (event: GestureResponderEvent) => {
 *         menuContext.open(event, () => {
 *             console.log("Menu opened");
 *         });
 *     };
 *     const handleClose = (event: GestureResponderEvent) => {
 *         menuContext.close(event, () => {
 *             console.log("Menu closed");
 *         });
 *     };
 *     
 *     return (
 *         <View>
 *             <Button title="Open Menu" onPress={handleOpen} />
 *             {menuContext.visible && (
 *                 <View>
 *                     <Text>Menu Item 1</Text>
 *                     <Text onPress={handleClose}>Close Menu</Text>
 *                 </View>
 *             )}
 *         </View>
 *     );
 * };
 */
export interface IMenuContext {
    /** Indicates whether the menu is currently visible */
    isVisible?: boolean;
    /** Function to check if the menu is open */
    isOpen?: () => boolean;
    /** Method to open the menu, with optional event and callback */
    open: (callback?: Function) => any;
    /** Method to close the menu, with optional event and callback */
    close: (callback?: Function) => any;

    anchorMeasurements?: IMenuAnchorMeasurements;

    /***
     * The current details on the position of the menu
     */
    position: IMenuCalculatedPosition;

    /***
     * Wheather the menu is rendering on fullScreen
     */
    fullScreen: boolean;

    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    windowWidth: number;
    windowHeight: number;
    testID: string;
}


export interface IUseMenuPositionProps {
    /** Current width of the menu */
    menuWidth: number;

    /** Current height of the menu */
    menuHeight: number;

    /** Whether the menu should be responsive or not. If set to true, the menu will fill the entire screeen on mobile devices, and will be fixed on desktop. */
    fullScreenOnMobile?: boolean;

    /***
     * Whether the menu should be responsive on tablet devices or not. If set to true, the menu will fill the entire screeen on tablet devices, and will be fixed on desktop.
     */
    fullScreenOnTablet?: boolean;

    /***
     * Breakpoint options for the useBreakpoints hook.
     */
    breakpointOptions?: Parameters<typeof useBreakpoints>[0];

    /***
     * If true, the menu will have the same width as the anchor element.
     */
    sameWidth?: boolean;

    /***
     * The minimum width of the menu.
     */
    minWidth?: number;

    /**
     * The minimum height of the menu.
     */
    minHeight?: number;

    /***
     * The maximum width of the menu.
     */
    maxHeight?: number;

    className?: IClassName;

    /** Specifies a fixed position for the menu on the screen. */
    position?: IMenuPosition;

    /**
     * Measurements of the anchor element, which include its position 
*         and size. This is essential for calculating the menu's position 
*         relative to the anchor. If the anchor is not available, this 
*         can be set to null.
     */
    anchorMeasurements?: IMenuAnchorMeasurements;

    /**
     * The visibility of the menu. This property is used to control the visibility of the menu.
     */
    visible?: boolean;
    /***
     * Use to force the menu to be displayed in a specific axis.
     * If specified, the menu position will be calculated based on the specified axis.
     * Default is undefined, which means the menu will be displayed in the preferred axis.
     */
    preferedPositionAxis?: "horizontal" | "vertical";
}



export interface IMenuProps<ItemContext = unknown> extends Omit<PressableProps, "children" | "style" | "className">, Omit<IUseMenuPositionProps, "menuWidth" | "menuHeight"> {

    /** Optional callback that is invoked when the menu opens. */
    onOpen?: () => void;

    /** Required callback that is invoked when the menu closes. */
    onClose?: () => void;

    /** The anchor element or function associated with the Menu component. */
    anchor: ReactNode | ((menuContext: IMenuContext) => ReactNode);

    /***
     * The class name for the touchable component.
     */
    anchorContainerClassName?: IClassName;

    /** Menu content, either as static JSX or a function returning JSX based on the menu context. */
    children?: IReactNullableElement | ((options: IMenuContext) => IReactNullableElement);

    /***
     * Default true
     * if true, the menu content will be wrapped in a ScrollView
     * if false, the menu content will be rendered directly
     */
    withScrollView?: boolean;

    /***
     * Props for the scrollView component that wraps the menu content.
     * This allows for customization of the scrollView's appearance and behavior.
     */
    scrollViewProps?: Omit<ScrollViewProps, "children">;

    /***
     * Whether the menu should be dismissable
     */
    dismissable?: boolean;

    /***
        The callback function that is called when the menu is dismissed.
        This is considered when the menu is controlled externally by providing the visible prop.
    */
    onDismiss?: () => void;

    /***
     * The class name for the backdrop.
     */
    backdropClassName?: IClassName;

    /***
     * Whether the menu should be rendered as a bottom sheet in full screen mode.
     * If set to true, the menu will be rendered as a bottom sheet on mobile (when the fullScreenOnMobile prop is set to true) or tablet (when the fullScreenOnTablet pros is set to true) devices, and as a regular menu on desktop.
     */
    //renderAsBottomSheetInFullScreen?: boolean;

    /***
     * The title of the bottom sheet when the menu is rendered as a bottom sheet.
     */
    bottomSheetTitle?: ReactNode;

    /***
     * Whether to show a divider between the title and the content when the menu is rendered as a bottom sheet.
     */
    bottomSheetTitleDivider?: boolean;

    style?: ViewProps["style"];

    items?: IMenuItemsProps<ItemContext>["items"];

    itemsProps?: Omit<IMenuItemsProps<ItemContext>, "items">;
}


export interface IMenuItem<ItemContext = unknown> extends IButtonProps<ItemContext> {
    /***
     * if true, the menu item will be rendered as a section, if false, it will be rendered as an item
     */
    section?: boolean;
    /***
     * Props for the sub items. In case of existance of sub items.  If provided, the menu item will be expandable.
     */
    items?: IMenuItem<ItemContext>[];
    /**
     * Props for the expandable component that will be used to expand the menu item. In case of existance of sub items.
     */
    expandableProps?: Omit<IHtmlDetailsProps, "summary">;

    /***
     * level of the menu item in the hierarchy. 
     * this is used to determine the indentation of the menu item.
     * this value is auto calculated by the menu items component.
     */
    level?: number;

    /***
     * if true, the menu will be closed when the button is pressed.
     */
    closeOnPress?: boolean;

    dividerClassName?: IClassName;
};

/**
 * @typedef IMenuItemProps
 * Represents the properties required for a menu item component, extending the base menu item type.
 * This type is specifically designed to include context-specific properties, allowing for enhanced
 * functionality and behavior within the menu item.
 *
 * @template ItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu item's implementation. This can be any object type, enabling
 * customization of the properties passed to the menu item.
 *
 * @extends IMenuItem<IMenuItemContext<ItemContext>> - This type extends the base
 * menu item type, incorporating the context properties defined in `ItemContext`. This ensures
 * that the menu item has access to both its base properties and any additional context-specific data.
 * @see {@link IMenuItem} for more information on the base menu item type.
 *
 * @example
 * // Example of using IMenuItemProps to create a menu item with extended context
 * interface CustomMenuItemContext {
 *   isActive: boolean; // Indicates if the menu item is currently active
 *   onClick: () => void; // Function to be executed when the menu item is clicked
 * }
 * 
 * const menuItem: IMenuItemProps<CustomMenuItemContext> = {
 *   label: "Dashboard",
 *   onPress: () => console.log("Dashboard clicked"),
 *   context: {
 *     isActive: true,
 *     onClick: () => console.log("Dashboard item clicked"),
 *   },
 * };
 */
export interface IMenuItemProps<ItemContext = unknown> extends IMenuItem<IMenuItemContext<ItemContext>> {

};


export type IMenuItemContext<ItemContext = unknown> = {
    menu: IMenuContext;
} & Omit<ItemContext, "menu">;



/**
 * Represents the base properties for a collection of menu items, extending the view properties.
 * This type is designed to facilitate the rendering of multiple menu items within a menu component,
 * allowing for customization of the layout and behavior of the items.
 *
 * @template ItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu items. This can be any object type, enabling extensibility
 * of the menu item's contextual behavior.
 *
 * @extends IHtmlDivProps - This type extends the properties of a Div, allowing for additional layout and
 * styling options that are applicable to the container of the menu items.
 *
 * @property {Array<IMenuItem<ItemContext> | undefined | null>} [items] - Optional property
 * that defines an array of menu items. Each item can either be a valid menu item object, null, or undefined.
 * This array is utilized to render the individual menu items within the menu component.
 *
 * @example
 * const menuItems: IMenuItems = {
 *   items: [
 *     { label: "Home", onPress: () => console.log("Home pressed") },
 *     { label: "Settings", onPress: () => console.log("Settings pressed") },
 *     { label: "Help", items: [{ label: "FAQ", onPress: () => console.log("FAQ pressed") }] },
 *   ],
 * };
 *
 * // Rendering the menu items in a component
 * const MyMenu = () => {
 *   return (
 *     <View>
 *       <MenuItems items={menuItems.items} />
 *     </View>
 *   );
 * };
 */
export interface IMenuItems<ItemContext = unknown> extends IHtmlDivProps {
    items?: (IMenuItem<ItemContext> | undefined | null)[]
}

/**
 * @typedef IMenuItemsProps
 * @description
 * Represents the properties required for a collection of menu items, extending the base menu items type.
 * This type is specifically designed to include context-specific properties, allowing for enhanced
 * functionality and behavior within the collection of menu items.
 *
 * @template ItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu items. This can be any object type, enabling customization
 * of the properties passed to the menu items.
 *
 * @extends IMenuItems<IMenuItemContext<ItemContext>> - This type extends the base
 * menu items type, incorporating the context properties defined in `IMenuItemContext`. This ensures
 * that the collection of menu items has access to both its base properties and any additional context-specific data.
 *
 * @example
 * // Example of using IMenuItemsProps to create a collection of menu items with extended context
 * interface CustomMenuItemContext {
 *   isActive: boolean; // Indicates if the menu item is currently active
 *   onClick: () => void; // Function to be executed when the menu item is clicked
 * }
 * 
 * const menuItemsProps: IMenuItemsProps<CustomMenuItemContext> = {
 *   items: [
 *     {
 *       label: "Dashboard",
 *       onPress: () => console.log("Dashboard clicked"),
 *       context: {
 *         isActive: true,
 *         onClick: () => console.log("Dashboard item clicked"),
 *       },
 *     },
 *     {
 *       label: "Reports",
 *       onPress: () => console.log("Reports clicked"),
 *       context: {
 *         isActive: false,
 *         onClick: () => console.log("Reports item clicked"),
 *       },
 *     },
 *   ],
 * };
 *
 * // Rendering the menu items in a component
 * const MyMenuItems = () => {
 *   return (
 *     <View>
 *       <MenuItems {...menuItemsProps} />
 *     </View>
 *   );
 * };
 */
export interface IMenuItemsProps<ItemContext = unknown> extends IMenuItems<IMenuItemContext<ItemContext>> {
    /**
     * Additional context options to pass to the rendering functions.
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
     */
    context?: ItemContext;
};

/**
 * Type definition for a function that renders a menu item.
 * This function receives the properties of the menu item and an optional index,
 * and returns a IReactNullableElement representing the rendered item.
 *
 * @template ItemContext - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @param {IMenuItem<ItemContext>} props - The properties of the menu item to render.
 * This includes all relevant data required to display the item, such as its label, icon,
 * and any action handlers.
 *
 * @param {number} [index] - An optional index indicating the position of the item in the
 * list of menu items. This can be useful for applying specific styles or behaviors based
 * on the item's position within the menu.
 *
 * @returns {IReactNullableElement} Returns a IReactNullableElement representing the rendered menu item. This can
 * be any valid React element, including custom components, JSX, or null if the item should
 * not be rendered.
 *
 * @example
 * ```tsx
 * const renderMenuItem: IMenuItemRenderFunc = (props, index) => {
 *   return (
 *     <div key={index} onClick={props.onPress}>
 *       {props.label}
 *     </div>
 *   );
 * };
 * ```
 *
 * In the example above, the `renderMenuItem` function takes menu item properties and an
 * index, returning a JSX element that displays the item's label and attaches an onClick
 * handler to it.
 */
export type IMenuItemRenderFunc<ItemContext = unknown> = (props: IMenuItem<ItemContext>, index: number) => IReactNullableElement;


type IMenuRenderItemsOptionsBase<ItemContext = unknown> = {
    /**
     * The function used to render a
    * standard menu item. This function receives the item properties and is responsible for generating
    * the corresponding JSX.
     */
    render: IMenuItemRenderFunc<ItemContext>,

    /**
     * The function used to
    * render expandable menu items. Similar to the render function, this handles the rendering of
    * items that can expand to show additional content.
     */
    renderExpandable: IMenuItemRenderFunc<ItemContext>,

    /**
     * additioonal parameters that allows extending the context
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
    *
    */
    context?: ItemContext;
}
/**
 * Represents the options for rendering each menu item, providing the necessary properties
 * to customize the rendering process for each item in a menu. it represents the options to be passed to the renderMenuItem function.
 *
 * @template ItemContext - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @property {IMenuItem<ItemContext>} item - The menu item to render. This includes
 * all relevant data required to display the item, such as its label, icon, and any action handlers.
 *
 * @property {number} index - The index of the item in the list. This can be useful for applying
 * specific styles or behaviors based on the item's position within the menu.
 *
 * @property {IMenuItemRenderFunc<ItemContext>} render - The function used to render a
 * standard menu item. This function receives the item properties and is responsible for generating
 * the corresponding JSX.
 *
 * @property {IMenuItemRenderFunc<ItemContext>} renderExpandable - The function used to
 * render expandable menu items. Similar to the render function, this handles the rendering of
 * items that can expand to show additional content.
 *
 * @property {number} [level] - An optional property indicating the current level of the menu item
 * in the hierarchy. This value can be used to determine the indentation of the menu item.
 *
 * @property {IMenuItemContext<ItemContext>} [context] - additioonal parameters that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * 
 * @property {IReactNullableElement[]} itemsNodes - The child nodes of the current item, rendered
 * using the renderMenuItem method applied to each child item.
 *
 * @example
 * const renderOptions: IMenuRenderItemOptions<CustomMenuItemContext> = {
 *   item: {
 *     label: "Settings",
 *     onPress: () => console.log("Settings clicked"),
 *   },
 *   index: 0,
 *   render: (props) => <MenuItem {...props} />,
 *   renderExpandable: (props) => <ExpandableMenuItem {...props} />,
 *   level: 1,
 *   context: {
 *     isOpen: true,
 *   },
 * };
 */
export interface IMenuRenderItemOptions<ItemContext = unknown> extends IMenuRenderItemsOptionsBase<ItemContext> {
    /**
     * The menu item to render. This includes
    * all relevant data required to display the item, such as its label, icon, and any action handlers.
     */
    item: IMenuItem<ItemContext>,
    /**
     * The index of the item in the list. This can be useful for applying
    * specific styles or behaviors based on the item's position within the menu.
     */
    index: number,



    /**
     * An optional property indicating the current level of the menu item
        * in the hierarchy. This value can be used to determine the indentation of the menu item.
     */
    level?: number,


    /**
     * The child nodes of the current item, rendered
    * using the renderMenuItem method applied to each child item.
     */
    itemsNodes?: IReactNullableElement[];
};

/**
 * @typedef IMenuRenderItemsOptions
 * Represents the options for rendering a collection of menu items, extending the base render items options.
 * This type is designed to facilitate the customization of the rendering process for each item in a menu.
 *
 * @template ItemContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @property {IMenuItems<ItemContext>["items"]} [items] - An optional property that defines
 * an array of menu items. Each item can either be a valid menu item object or undefined/null.
 * This array is utilized to render the individual menu items within the menu component.
 * 
 * @see {@link IMenuItems} for more information on the `items` property.
 * @see {@link IMenuRenderItemOptions} for more information on the base render item options.
 *
 * @example
 * const menuRenderOptions: IMenuRenderItemsOptions<CustomMenuItemContext> = {
 *   items: [
 *     { label: "Home", onPress: () => console.log("Home pressed") },
 *     { label: "Settings", onPress: () => console.log("Settings pressed") },
 *   ],
 * };
 */
export interface IMenuRenderItemsOptions<ItemContext = unknown> extends IMenuRenderItemsOptionsBase<ItemContext> {
    items?: IMenuItems<ItemContext>["items"];
}