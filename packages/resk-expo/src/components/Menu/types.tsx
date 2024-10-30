
import { ReactNode } from "react";
import { GestureResponderEvent, PressableProps, ViewProps } from "react-native";
import { PressableStateCallbackType } from "react-native";
import { AnimatedProps } from "react-native-reanimated";

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
export type IMenuAnchorMeasurements = {
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
    position: IMenuPosition;
    x: number;
    y: number;
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
export interface IMenuContext {
    /** Indicates whether the menu is currently visible */
    visible?: boolean;
    /** Function to check if the menu is open */
    isOpen?: () => boolean;
    /** Method to open the menu, with optional event and callback */
    openMenu: (event?: GestureResponderEvent, callback?: Function) => any;
    /** Method to close the menu, with optional event and callback */
    closeMenu: (event?: GestureResponderEvent, callback?: Function) => any;
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
 * @property {IMenuAnchorMeasurements | null} anchorMeasurements - 
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
 * @property {number} [screenPadding] - 
 *         Optional padding from the edges of the screen in pixels. This 
 *         ensures that the menu does not get too close to the screen 
 *         edges, improving usability and aesthetics.
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
 *     anchorMeasurements: {
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
 *     screenPadding: 20,          // 20 pixels of padding from screen edges
 *     responsive: true,           // Enable responsive behavior
 * };
 * 
 * // Hook usage with the defined props
 * const { menuPosition } = useMenuPosition(menuProps);
 */
export interface IUseMenuPositionProps {
    /** Measurements of the anchor element */
    anchorMeasurements: IMenuAnchorMeasurements | null;
    /** Current width of the menu */
    menuWidth: number;
    /** Current height of the menu */
    menuHeight: number;
    /** Padding between menu and anchor */
    padding?: number;
    /** Force menu to specific position */
    position?: IMenuPosition;
    /** Enable full-screen mode */
    fullScreen?: boolean;
    /** Padding from screen edges */
    screenPadding?: number;

    responsive?: boolean;
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
 * Props for the Menu component.
 * 
 * This interface defines the properties required for the Menu component, which 
 * is used to display a contextual menu that can be anchored to a specific element 
 * in the UI. The Menu can be shown or hidden based on user interactions, and 
 * it can be customized with various styles and behaviors.
 *
 * @interface IMenuProps
 *  * 
 * @property {IViewProps} [menuProps] - Optional properties for customizing the menu's content layout and styling.
 * @property {boolean} [animated] - 
 *         Optional flag to enable or disable animations when the menu appears or 
 *         disappears. This can enhance the user experience by providing smooth 
 *         transitions.
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
 * @property {number} [screenPadding] - 
 *         Optional padding in pixels from the edges of the screen. This ensures 
 *         that the menu does not get too close to the screen edges, improving 
 *         usability and aesthetics.
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
 *
 * @example
 * // Example of using IMenuProps in a functional Menu component
 * const MyMenu: React.FC<IMenuProps> = ({
 *     animated = true,
 *     position,
 *     fullScreen,
 *     screenPadding = 16,
 *     borderRadius = 8,
 *     onOpen,
 *     onClose,
 *     anchor,
 *     anchorContainerProps,
 *     children,
 * }) => {
 *     return (
 *         <View style={{ padding: screenPadding, borderRadius }}>
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
export type IMenuProps = Omit<AnimatedProps<ViewProps>, "children"> & {
    /** Enables or disables animations for opening and closing the menu. */
    animated?: boolean;

    /** Specifies a fixed position for the menu on the screen. */
    position?: IMenuPosition;

    /** When true, the menu occupies the entire screen. */
    fullScreen?: boolean;

    /** Defines padding from the screen edges. */
    screenPadding?: number;

    /** Sets the border radius for the menu, allowing for rounded corners. */
    borderRadius?: number;

    /** Optional callback that is invoked when the menu opens. */
    onOpen?: () => void;

    /** Required callback that is invoked when the menu closes. */
    onClose: () => void;

    /** The anchor element or function associated with the Menu component. */
    anchor: IMenuAnchor;

    /** Props for the touchable component when the anchor is a ReactNode. */
    anchorContainerProps?: Omit<PressableProps, 'children' | "onPress"> & {
        onPress?: (event?: GestureResponderEvent) => any
    };

    /** Menu content, either as static JSX or a function returning JSX based on the menu context. */
    children?: Element | ((options: IMenuContext) => Element);
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
