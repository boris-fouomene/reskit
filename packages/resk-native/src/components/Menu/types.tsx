
import { IButtonProps } from "@components/Button/types";
import { IExpandableProps } from "@components/Expandable";
import { IViewProps } from "@components/View";
import { IReactNullableElement } from "../../types";
import { ReactNode } from "react";
import { PressableProps, ScrollViewProps, ViewProps, Animated } from "react-native";
import { PressableStateCallbackType } from "react-native";

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
 * @property {() => boolean} [isMenuOpen] - 
 *         Optional method that returns a boolean indicating whether the menu is open. 
 *         This can be useful for checking the menu state without directly accessing 
 *         the visibility property.
 * 
 * @property {(event?: GestureResponderEvent, callback?: Function) => any} openMenu - 
 *         Method to open the menu. This method can accept an optional event parameter 
 *         (for gesture events) and an optional callback function to be executed after 
 *         the menu has been opened. This allows for additional actions to be performed 
 *         in response to the menu being opened.
 * 
 * @property {(event?: GestureResponderEvent, callback?: Function) => any} closeMenu - 
 *         Method to close the menu. Similar to openMenu, this method can accept 
 *         an optional event parameter and an optional callback function. This provides 
 *         flexibility in handling menu closure and executing follow-up actions.
 * 

 * @example
 * // Example of using IMenuContext in a React component
 * const MyMenuComponent: React.FC = () => {
 *     const menuContext = useContext(MenuContext); // Assuming MenuContext is created using React's Context API
 *     const handleOpen = (event: GestureResponderEvent) => {
 *         menuContext.openMenu(event, () => {
 *             console.log("Menu opened");
 *         });
 *     };
 *     const handleClose = (event: GestureResponderEvent) => {
 *         menuContext.closeMenu(event, () => {
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
export interface IMenuContext extends Omit<IMenuProps, "children" | "anchor" | "anchorContainerProps"> {
    /** Indicates whether the menu is currently visible */
    isMenuVisible?: boolean;
    /** Function to check if the menu is open */
    isMenuOpen?: () => boolean;
    /** Method to open the menu, with optional event and callback */
    openMenu: (callback?: Function) => any;
    /** Method to close the menu, with optional event and callback */
    closeMenu: (callback?: Function) => any;
    /***
     * this is a flag to know if the menu is a menu or not
     */
    isMenu: boolean;

    anchorMeasurements?: IMenuAnchorMeasurements;

    /***
     * The current details on the position of the menu
     */
    menuPosition: IMenuCalculatedPosition;

    /***
     * Wheather the menu is rendering on fullScreen
     */
    fullScreen: boolean;

    /***
     * A function that animates the menu
     */
    animateMenu: (visible: boolean, callback?: () => void) => void;
}


/**
 * Props for the useMenuPosition hook.
 * 
 * This interface defines the properties required by the `useMenuPosition` 
 * hook, which calculates the optimal position for a menu based on the 
 * measurements of its anchor element and other relevant parameters. 
 * The hook utilizes these properties to determine where to render the 
 * menu on the screen, ensuring proper alignment and spacing.
 * 
 * @interface IUseMenuPositionProps
 * 
 * @property {IMenuAnchorMeasurements} anchorMeasurements - 
 *         Measurements of the anchor element, which include its position 
 *         and size. This is essential for calculating the menu's position 
 *         relative to the anchor. If the anchor is not available, this 
 *         can be set to null.
 * 
 * @property {number} menuWidth - 
 *         The current width of the menu in pixels. This value is used 
 *         to ensure that the menu is positioned correctly in relation 
 *         to its anchor, accounting for its own dimensions.
 * 
 * @property {number} menuHeight - 
 *         The current height of the menu in pixels. Like `menuWidth`, 
 *         this value is crucial for accurate positioning and rendering 
 *         of the menu.
 * 
 * @property {number} [padding] - 
 *         Optional padding in pixels between the menu and its anchor. 
 *         This allows for customizable spacing, improving the visual 
 *         aesthetics and usability of the menu.
 * 
 * @property {IMenuPosition} [position] - 
 *         Optional property to force the menu to a specific position 
 *         (e.g., 'top', 'bottom', 'left', or 'right'). This can be 
 *         useful when a certain layout is desired regardless of the 
 *         anchor's measurements.
 * 
 * @property {boolean} [fullScreen] - 
 *         Optional flag to enable full-screen mode for the menu. When 
 *         set to true, the menu will take up the entire screen, which 
 *         can be useful for mobile or immersive experiences.
 * 
 * 
 * @property {boolean} [responsive] - 
 *         Optional flag to enable responsive behavior for the menu. 
 *         When set to true, the menu will adjust its position and size 
 *         based on the viewport dimensions, ensuring a good user experience 
 *         across different screen sizes. Ii's mostly used when the fullScreen props is not false to ensure the menu fit  the screen in mobile or tablet device.

 * 
 * @example
 * // Example usage of IUseMenuPositionProps with the useMenuPosition hook
 * const menuProps: IUseMenuPositionProps = {
 *     anchor: {
 *         pageX: 100,
 *         pageY: 200,
 *         width: 50,
 *         height: 30,
 *     },
 *     menuWidth: 200,
 *     menuHeight: 150,
 *     padding: 10,                // 10 pixels of padding
 *     position: 'bottom',         // Force menu to appear below the anchor
 *     fullScreen: false,        // Menu is not in full-screen mode
 *     responsive: true,           // Enable responsive behavior
 * };
 * 
 * // Hook usage with the defined props
 * const { menuPosition } = useMenuPosition(menuProps);
 */
export interface IUseMenuPositionProps {
    /** Current width of the menu */
    menuWidth: number;

    /** Current height of the menu */
    menuHeight: number;

    /** Padding between menu and anchor */
    padding?: number;

    /**
    *     Optional flag to enable responsive behavior for the menu. 
    *        When set to true, the menu will adjust its position and size 
    *        based on the viewport dimensions, ensuring a good user experience 
    *        across different screen sizes. Ii's mostly used when the fullScreen props is not false to ensure the menu fit  the screen in mobile or tablet device.

     */

    responsive?: boolean;

    /** Specifies a fixed position for the menu on the screen. */
    position?: IMenuPosition;

    /** When true, the menu occupies the entire screen. */
    fullScreen?: boolean;


    /**
     * The minimum width of the menu.
     * This property is used to set a minimum width for the menu.
     * If the menu width is less than the specified value, it will be adjusted to match the anchor width.
     */
    minWidth?: number;

    /**
     * If true, the menu will be the same width as the anchor element.
     * Default is false.
     */
    sameWidth?: boolean;

    /***
     * Optional border radius for the menu. This allows for rounded corners, 
     * enhancing the visual appeal of the menu.
     */
    borderRadius?: number;

    /***
     * Optional elevation for the menu. This property is used to adjust the shadow and
     * depth of the menu, providing a visual cue to the user that the menu is
     * part of the application's interface.
     */
    elevation?: number;

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




    /***
    * Wheather the menu should be dynamic height or not.
    * Default is true.
    * 
    */
    dynamicHeight?: boolean;

}



/**
 * 
 * 
 * @interface IMenuProps

 * 
 * 
 * 
 * 
 * @property {Element | ((options: IMenuContext) => Element)} [children] - Menu content, either as static JSX or a function returning JSX based on the menu context.
 */



/**
 * @typedef IMenuItems
 * @description
 * Props for the Menu component.
 * This interface defines the properties required for the Menu component, which 
 * is used to display a contextual menu that can be anchored to a specific element 
 * in the UI. The Menu can be shown or hidden based on user interactions, and 
 * it can be customized with various styles and behaviors.
 * 
 * @template MenuItemContext - A generic type parameter that allows extending
 * the context for menu items. This enables customization of the properties passed
 * to menu items within the Menu.
 * 
 * @property {Omit<AnimatedProps<ViewProps>, "children">} - Inherits properties from AnimatedProps and ViewProps, excluding the 'children' property.
 * 
 * @property {IViewProps} [menuProps] - Optional properties for customizing the menu's content layout and styling.
 * @property {boolean} [animated] - 
 *         Optional flag to enable or disable animations when the menu appears or 
 *         disappears. This can enhance the user experience by providing smooth 
 *         transitions.
 * @property {boolean} [sameWidth] - 
 *         Optional flag to determine if the menu width should be the same as the anchor element width.
 *         Default is false.
 * @property {boolean} [withScrollView] - 
 *         Optional flag to determine if the menu content should be wrapped in a ScrollView.
 *         If set to false, the menu content will be rendered directly.
 *         Default is true.
 * @property {ScrollViewProps} [scrollViewProps] - 
 *         Optional props for the scrollView component that wraps the menu content.
 *         This allows for customization of the scrollView's appearance and behavior.
 *
 * @property {IMenuPosition} [position] - 
 *         Optional property to force the menu to a specific position (e.g., 'top', 
 *         'bottom', 'left', or 'right') relative to the anchor. This can be useful 
 *         for ensuring consistent placement in specific layouts.
 * 
 *  @property {boolean} [fullScreen] - 
 *         Optional flag to enable full-screen mode for the menu. When set to true, 
 *         the menu will occupy the entire screen, which can be useful for mobile 
 *         or immersive experiences.
 * 
 * 
 *  * 
 * @property {number} [borderRadius] - 
 *         Optional border radius for the menu. This allows for rounded corners, 
 *         enhancing the visual appeal of the menu.
 * 
 * @property {Function} [onOpen] - Optional callback that is invoked when the menu opens.
 * 
 * @property {() => void} onClose - 
 *         A callback function that is triggered when the menu should be closed. 
 *         This is typically used to update the state that controls the menu's visibility.
 * 
 * @property {IMenuAnchor} anchor - The anchor element or function associated with the Menu component.
 * @property {Omit<PressableProps, 'children'>} [anchorContainerProps] - 
 * @property {Omit<PressableProps, 'children' | 'onPress'>} [anchorContainerProps] - Props for the pressable component parent of the anchor element.
 * @property {Element | ((options: IMenuContext) => Element)} [children] - Menu content, either as static JSX or a function returning JSX based on the menu context.
 * @property {boolean} [responsive] - 
 *         Optional flag to enable responsive behavior for the menu. 
 *         When set to true, the menu will adjust its position and size 
 *         based on the viewport dimensions, ensuring a good user experience 
 *         across different screen sizes. Ii's mostly used when the fullScreen props is not false to ensure the menu fit  the screen in mobile or tablet device.
 *
 * @property {IMenuItems<MenuItemContext>["items"]} [items] - An optional
 * property that defines an array of menu items. Each item can either be a valid menu
 * item object or undefined/null.
 *
 * @property {IMenuItems<MenuItemContext>} [itemsProps] - Props for the
 * menu items component. This allows for additional customization of the items rendered within
 * the menu.
 *    

 * @example
 * // Example of using IMenuProps in a functional Menu component
 * const MyMenu: React.FC<IMenuProps> = ({
 *     animated = true,
 *     position,
 *     fullScreen,
 *     borderRadius = 8,
 *     onOpen,
 *     onClose,
 *     anchor,
 *     anchorContainerProps,
 *     children,
 * }) => {
 *     return (
 *         <View style={{orderRadius }}>
 *             {typeof anchor === 'function' ? anchor({ openMenu: onOpen }) : anchor}
 *             {isVisible && (
 *                 <Animated.View style={{ position: fullScreen ? 'absolute' : 'relative' }}>
 *                     {children}
 *                 </Animated.View>
 *             )}
 *         </View>
 *     );
 * };
 *
 * // Usage of MyMenu component
 * const App: React.FC = () => {
 *     const [menuVisible, setMenuVisible] = React.useState(false);
 *
 *     return (
 *         <View>
 *             <MyMenu
 *                 animated
 *                 isVisible={menuVisible}
 *                 onOpen={() => setMenuVisible(true)}
 *                 onClose={() => setMenuVisible(false)}
 *                 anchor={<Button title="Open Menu" onPress={() => setMenuVisible(true)} />}
 *                 anchorContainerProps={{ onPress: () => console.log("Anchor pressed") }}
 *             >
 *                 <Text>This is the menu content!</Text>
 *             </MyMenu>
 *         </View>
 *     );
 * };
 */
export type IMenuProps<MenuItemContext = any> = Omit<Animated.AnimatedProps<ViewProps>, "children"> & Omit<IUseMenuPositionProps, "menuWidth" | "menuHeight"> & {
    /***
     * Default false
     * if true, the menu will be the same width as the anchor element
     */
    sameWidth?: boolean;

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
    scrollViewProps?: ScrollViewProps;

    /** Optional callback that is invoked when the menu opens. */
    onOpen?: () => void;

    /** Required callback that is invoked when the menu closes. */
    onClose?: () => void;

    /** The anchor element or function associated with the Menu component. */
    anchor: IMenuAnchor;

    /** Props for the touchable component when the anchor is a ReactNode. */
    anchorContainerProps?: Omit<PressableProps, 'children'>;

    /** Menu content, either as static JSX or a function returning JSX based on the menu context. */
    children?: IReactNullableElement | ((options: IMenuContext) => IReactNullableElement);

    /**
     * An optional property that defines an array of menu items. Each item can either be a valid menu item object or undefined/null.
     */
    items?: IMenuItems<MenuItemContext>["items"];

    /***
     * Props for the menu items component. This allows for additional customization of the items rendered within
     * the menu.
     */
    itemsProps?: Omit<IMenuItems<MenuItemContext>, "items">;

    /***
     * Whether the menu should be dismissable
     */
    dismissable?: boolean;

    /***
        The callback function that is called when the menu is dismissed.
        This is considered when the menu is controlled externally by providing the visible prop.
    */
    onDismiss?: () => void;

    /** Enables or disables animations for opening and closing the menu. */
    animated?: boolean;

    /***
     * The duration of the animation in milliseconds.
     */
    animationDuration?: number;

    /***
     * Whether the bottom sheet should be full screen or not when the menu is rendered as a bottom sheet.
     */
    bottomSheetFullScreen?: boolean;

    /***
     * The minimum height of the bottom sheet when the menu is rendered as a bottom sheet.
     */
    bottomSheetMinHeight?: number;

    /***
     * The title of the bottom sheet when the menu is rendered as a bottom sheet.
     */
    bottomSheetTitle?: ReactNode;

    /***
     * Whether to show a divider between the title and the content when the menu is rendered as a bottom sheet.
     */
    bottomSheetTitleDivider?: boolean;
}

/**
 * Type definition for IMenuAnchor.
 * 
 * The IMenuAnchor type represents a value that can be either a Element 
 * or a function that returns a Element. This is particularly useful for 
 * creating flexible anchor components for a menu system in a React Native 
 * application, allowing developers to specify either a static element or a 
 * dynamic one that depends on the current menu state.
 * 
 * The function can accept a combined type of `IMenuContext` and 
 * `PressableStateCallbackType`, enabling the anchor to react to both the 
 * menu's state and the pressable state (like being pressed or focused).
 * @see {@link IMenuContext} for more details on the `IMenuContext` type.
 * 
 * @type IMenuAnchor
 * 
 * @example
 * // Example of using IMenuAnchor in a React Native component
 * const MyMenuAnchor: React.FC = () => {
 *     const menuContext = useMenu(); // Assuming useMenu is a custom hook that provides the menu context
 *     
 *     const anchor: IMenuAnchor = (menuState) => (
 *         <Pressable 
 *             onPress={menuState.openMenu} 
 *             style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
 *             <Text>Open Menu</Text>
 *         </Pressable>
 *     );
 *     
 *     // Alternatively, you can use a static Element
 *     const staticAnchor: IMenuAnchor = (
 *         <Pressable onPress={menuContext.openMenu}>
 *             <Text>Open Menu</Text>
 *         </Pressable>
 *     );
 *     
 *     return (
 *         <View>
 *             {typeof anchor === 'function' ? anchor(menuContext) : anchor}
 *         </View>
 *     );
 * };
 */
export type IMenuAnchor = ReactNode | ((menuState: IMenuContext & PressableStateCallbackType) => ReactNode);



/**
 * @typedef IMenuItemBase
 * Represents the base properties for a menu item component, extending the button properties 
 * and allowing for additional context from the menu context and a hierarchical structure of menu items.
 * This type is particularly useful for creating complex menu structures where each 
 * menu item may contain sub-items, enabling a nested menu system.
 * This type is designed to facilitate 
 * the integration of menu items within a broader menu system that manages visibility 
 * and behavior through context.
 * 
 * @template MenuItemContext - A generic type that allows the inclusion of additional context properties 
 *               specific to the menu item's context implementation. This can be any object type, 
 *               allowing for extensibility of the menu item's contextual behavior.
 * 
 * @property {IMenuItemBase<MenuItemContext>[]} [items] - An optional property 
 *               that defines an array of sub-menu items. Each sub-menu item is also of type `IMenuItemBase`, 
 *               allowing for recursive nesting of menu items.
 *
 * @property {boolean} [section] - Optional flag indicating whether the menu item should be rendered as a section.
 * When set to true, the menu item is treated as a section, which may affect its styling and behavior.
 * If false or omitted, the menu item is rendered as a standard item.
 * 
 * @example
 * const menuItem: IMenuItemBase = {
 *   label: "Settings",
 *   section: true, // This item will be rendered as a section
 *   onPress: () => console.log("Settings clicked"),
 * };
 *
 * @property {IMenuItemBase<MenuItemContext>[]} [items] - Optional property that defines an array of sub-menu items.
 * Each sub-menu item can be of the same type, allowing for recursive nesting of menu items.
 * If provided, the menu item will be expandable, enabling users to reveal additional options or information.
 *
 * @example
 * const expandableMenuItem: IMenuItemBase = {
 *   label: "Profile",
 *   items: [
 *     { label: "View Profile", onPress: () => console.log("View Profile clicked") },
 *     { label: "Edit Profile", onPress: () => console.log("Edit Profile clicked") },
 *   ],
 * };
 *
 * @property {IExpandableProps} [expandableProps] - Optional properties for the expandable component.
 * This allows for further customization of the expand/collapse behavior of the menu item.
 * This can include animations, styling, and any other relevant properties for the expandable behavior.
 *
 * @example
 * const expandableProps: IExpandableProps = {
 *   onExpand: () => console.log("Menu expanded"),
 *   onCollapse: () => console.log("Menu collapsed"),
 * };
 *
 * @property {number} [level] - Optional property that indicates the level of the menu item in the hierarchy.
 * This value is used to determine the indentation of the menu item and is auto-calculated by the menu items component.
 * A higher level indicates a deeper nesting within the menu structure.
 *
 * @example
 * const nestedMenuItem: IMenuItemBase = {
 *   label: "Settings",
 *   level: 1, // Indicates that this item is one level deep in the menu hierarchy
 *   items: [
 *     {
 *       label: "Account",
 *       level: 2, // This item is two levels deep
 *     },
 *   ],
 * };
 */
export type IMenuItemBase<MenuItemContext = any> = IButtonProps<MenuItemContext> & {
    /***
     * if true, the menu item will be rendered as a section, if false, it will be rendered as an item
     */
    section?: boolean;
    /***
     * Props for the sub items. In case of existance of sub items.  If provided, the menu item will be expandable.
     */
    items?: IMenuItemBase<MenuItemContext>[];
    /**
     * Props for the expandable component that will be used to expand the menu item. In case of existance of sub items.
     */
    expandableProps?: IExpandableProps;

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
};

/**
 * @typedef IMenuItemProps
 * Represents the properties required for a menu item component, extending the base menu item type.
 * This type is specifically designed to include context-specific properties, allowing for enhanced
 * functionality and behavior within the menu item.
 *
 * @template MenuItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu item's implementation. This can be any object type, enabling
 * customization of the properties passed to the menu item.
 *
 * @extends IMenuItemBase<IMenuItemContext<MenuItemContext>> - This type extends the base
 * menu item type, incorporating the context properties defined in `MenuItemContext`. This ensures
 * that the menu item has access to both its base properties and any additional context-specific data.
 * @see {@link IMenuItemBase} for more information on the base menu item type.
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
export type IMenuItemProps<MenuItemContext = any> = IMenuItemBase<IMenuItemContext<MenuItemContext>>;


/**
 * @typedef MenuItemContext
 * Represents the context for a menu item, which combines the properties 
 * of the base menu context with any additional properties defined by the user. 
 * This type is particularly useful in scenarios where you want to extend 
 * the functionality of a menu item with custom properties or behaviors, 
 * enabling a more flexible and dynamic menu system.
 * 
 * @template MenuItemContext - An optional generic type parameter that allows 
 * you to extend the base menu context with additional properties specific to your 
 * application. By default, this parameter is set to `any`, meaning you can 
 * pass any type of context extension. This flexibility allows for the 
 * incorporation of various custom properties that can be utilized within 
 * the menu item.
 * 
 * @example
 * // Defining a custom menu item context with additional properties
 * interface CustomMenuItemContext {
 *   isActive: boolean; // Indicates if the menu item is currently active
 *   onClick: () => void; // Function to be executed when the menu item is clicked
 * }
 * 
 * // Creating a menu item context that includes the custom properties
 * const menuItemContext: IMenuItemContext<CustomMenuItemContext> = {
 *   // Properties from the base IMenuContext would go here
 *   isMenuOpen: true, // Example property from IMenuContext
 *   isActive: true,
 *   onClick: () => console.log('Menu item clicked!'),
 * };
 * 
 * // Usage in a menu item component
 * const MenuItem: React.FC<IMenuItemContext<CustomMenuItemContext>> = ({ isActive, onClick }) => {
 *   return (
 *     <div onClick={onClick} style={{ fontWeight: isActive ? 'bold' : 'normal' }}>
 *       Menu Item
 *     </div>
 *   );
 * };
 * 
 * @returns A read-only context object that merges the base menu context 
 * with any additional properties defined in `MenuItemContext`. 
 * This ensures that the context is immutable, preventing accidental 
 * modifications during runtime and maintaining the integrity of the menu state.
 * 
 * @remarks
 * - This type is particularly useful in scenarios where menu items need 
 *   to share common properties while also allowing for specific, 
 *   customizable behavior.
 * - Using `Readonly` ensures that the context cannot be altered, which 
 *   helps maintain the integrity of the menu state throughout the 
 *   application.
 * - This approach promotes better type safety and clarity in your code, 
 *   making it easier to understand the relationship between menu items 
 *   and their context.
 */
export type IMenuItemContext<MenuItemContext = any> = Readonly<IMenuContext & MenuItemContext>;



/**
 * Represents the base properties for a collection of menu items, extending the view properties.
 * This type is designed to facilitate the rendering of multiple menu items within a menu component,
 * allowing for customization of the layout and behavior of the items.
 *
 * @template MenuItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu items. This can be any object type, enabling extensibility
 * of the menu item's contextual behavior.
 *
 * @extends IViewProps - This type extends the properties of a view, allowing for additional layout and
 * styling options that are applicable to the container of the menu items.
 *
 * @property {Array<IMenuItemBase<MenuItemContext> | undefined | null>} [items] - Optional property
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
export type IMenuItems<MenuItemContext = any> = IViewProps & {
    items?: (IMenuItemBase<MenuItemContext> | undefined | null)[]
}

/**
 * @typedef IMenuItemsProps
 * @description
 * Represents the properties required for a collection of menu items, extending the base menu items type.
 * This type is specifically designed to include context-specific properties, allowing for enhanced
 * functionality and behavior within the collection of menu items.
 *
 * @template MenuItemContext - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu items. This can be any object type, enabling customization
 * of the properties passed to the menu items.
 *
 * @extends IMenuItems<IMenuItemContext<MenuItemContext>> - This type extends the base
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
export type IMenuItemsProps<MenuItemContext = any> = IMenuItems<IMenuItemContext<MenuItemContext>> & {
    /**
     * Additional context options to pass to the rendering functions.
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
     */
    context?: MenuItemContext;
};

/**
 * Type definition for a function that renders a menu item.
 * This function receives the properties of the menu item and an optional index,
 * and returns a IReactNullableElement representing the rendered item.
 *
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @param {IMenuItemBase<MenuItemContext>} props - The properties of the menu item to render.
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
export type IMenuItemRenderFunc<MenuItemContext = any> = (props: IMenuItemBase<MenuItemContext>, index: number) => IReactNullableElement;


type IMenuRenderItemsOptionsBase<MenuItemContext = any> = {
    /**
     * The function used to render a
    * standard menu item. This function receives the item properties and is responsible for generating
    * the corresponding JSX.
     */
    render: IMenuItemRenderFunc<MenuItemContext>,

    /**
     * The function used to
    * render expandable menu items. Similar to the render function, this handles the rendering of
    * items that can expand to show additional content.
     */
    renderExpandable: IMenuItemRenderFunc<MenuItemContext>,

    /**
     * additioonal parameters that allows extending the context
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
    *
    */
    context?: MenuItemContext;
}
/**
 * Represents the options for rendering each menu item, providing the necessary properties
 * to customize the rendering process for each item in a menu. it represents the options to be passed to the renderMenuItem function.
 *
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @property {IMenuItemBase<MenuItemContext>} item - The menu item to render. This includes
 * all relevant data required to display the item, such as its label, icon, and any action handlers.
 *
 * @property {number} index - The index of the item in the list. This can be useful for applying
 * specific styles or behaviors based on the item's position within the menu.
 *
 * @property {IMenuItemRenderFunc<MenuItemContext>} render - The function used to render a
 * standard menu item. This function receives the item properties and is responsible for generating
 * the corresponding JSX.
 *
 * @property {IMenuItemRenderFunc<MenuItemContext>} renderExpandable - The function used to
 * render expandable menu items. Similar to the render function, this handles the rendering of
 * items that can expand to show additional content.
 *
 * @property {number} [level] - An optional property indicating the current level of the menu item
 * in the hierarchy. This value can be used to determine the indentation of the menu item.
 *
 * @property {IMenuItemContext<MenuItemContext>} [context] - additioonal parameters that allows extending the context
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
 *     isMenuOpen: true,
 *   },
 * };
 */
export type IMenuRenderItemOptions<MenuItemContext = any> = IMenuRenderItemsOptionsBase<MenuItemContext> & {
    /**
     * The menu item to render. This includes
    * all relevant data required to display the item, such as its label, icon, and any action handlers.
     */
    item: IMenuItemBase<MenuItemContext>,
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
 * @template MenuItemContext - A generic type parameter that allows extending the context
 * for menu items, enabling customization of properties specific to the application.
 *
 * @property {IMenuItems<MenuItemContext>["items"]} [items] - An optional property that defines
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
export type IMenuRenderItemsOptions<MenuItemContext = any> = IMenuRenderItemsOptionsBase<MenuItemContext> & {
    items?: IMenuItems<MenuItemContext>["items"];
}