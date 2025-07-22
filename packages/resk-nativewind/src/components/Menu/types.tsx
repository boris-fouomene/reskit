
import { IClassName, IReactNullableElement } from "../../types";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { IMenuVariant } from "@variants/menu";
import { INavItemProps, INavItemsProps } from "@components/Nav/types";
import { IBottomSheetVariant } from "@variants/bottomSheet";
import { IPercentage } from "@resk/core/types";
import { ITextVariant } from "@variants/text";

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
    /**
     * The computed placement of the menu.
     */
    computedPlacement: IMenuPosition;
    /**
     * The placement of the menu along the x-axis.
     */
    xPlacement?: IMenuPosition;
    /**
     * The placement of the menu along the y-axis.
     */
    yPlacement?: IMenuPosition;

    /**
     * The left position of the menu.
     */
    left?: number;

    /**
     * The top position of the menu.
     */
    top?: number;

    /**
     * The height of the menu.
     */
    height?: number;

    /**
     * The width of the menu.
     */
    width?: number;

    /***
        The bottom position of the menu.
    */
    bottom?: number;

    /**
     * The right position of the menu.
     */
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


export type IMenuContext<Context = unknown> = Context & {
    menu: {
        /**
         * Method to measure the anchor element and calculate the position of the anchor relative to the window.
         * This method is called when the menu is opened.
         * It takes a boolean value indicating whether the anchorMeasurements should be updated or not.
         * It returns a promise that resolves with the updated anchorMeasurements.
         * It must be called before the menu is opened (When the menu is controlled externally by providing the visible prop).
         * @param updateState {boolean} Whether to update the anchorMeasurements or not.
         * @returns 
         */
        measureAnchor: (updateState: boolean) => Promise<IMenuAnchorMeasurements>;
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

        /***
            Whether the menu is rendered as a bottom sheet
        */
        renderedAsBottomSheet: boolean;

        isMobile: boolean;
        isTablet: boolean;
        isDesktop: boolean;
        windowWidth: number;
        windowHeight: number;
        testID: string;
        maxHeight?: number;
    }
}


export interface IUseMenuPositionProps {
    /** Current width of the menu */
    menuWidth: number;

    /** Current height of the menu */
    menuHeight: number;

    /**
     * Whether to render the menu as a bottom sheet on mobile devices.
     * 
     * When enabled on mobile devices:
     * - Menu slides up from the bottom of the screen
     * - Covers the full viewport width
     * - Includes swipe-to-dismiss gestures
     * - Better touch interaction for mobile users
     * - Automatically includes a title header with close button
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Enable bottom sheet only on mobile
     * <Menu
     *   renderAsBottomSheetOnMobile={true}
     *   renderAsBottomSheetOnTablet={false}
     *   bottomSheetTitle="Mobile Actions"
     * />
     * ```
     */
    renderAsBottomSheetOnMobile?: boolean;

    /**
     * Whether to render the menu as a bottom sheet on tablet devices.
     * 
     * When enabled on tablet devices:
     * - Menu slides up from the bottom of the screen
     * - Covers the full viewport width
     * - Includes swipe-to-dismiss gestures
     * - Better touch interaction for tablet users
     * - Automatically includes a title header with close button
     * 
     * Note: Tablets typically have more screen space, so consider whether
     * bottom sheet is the best UX compared to standard dropdown menus.
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Enable bottom sheet on both mobile and tablet
     * <Menu
     *   renderAsBottomSheetOnMobile={true}
     *   renderAsBottomSheetOnTablet={true}
     *   bottomSheetTitle="Touch-Friendly Menu"
     * />
     * 
     * // Different behavior per device
     * <Menu
     *   renderAsBottomSheetOnMobile={true}
     *   renderAsBottomSheetOnTablet={false} // Use dropdown on tablet
     *   bottomSheetTitle="Mobile Actions"
     * />
     * ```
     */
    renderAsBottomSheetOnTablet?: boolean;

    /**
     * Whether to render the menu as a navigation menu on mobile devices.
     * 
     * Navigation menu mode on mobile provides:
     * - Full-screen overlay presentation
     * - Optimized for primary navigation items
     * - Hierarchical menu structure support
     * - Touch-friendly spacing and sizing
     * - Slide-in animations from left/right
     * - Proper focus management for accessibility
     * - Breadcrumb navigation for nested items
     * 
     * Perfect for main app navigation, user menus, or complex menu structures
     * that need more space than a standard dropdown can provide.
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Main navigation menu for mobile
     * <Menu
     *   renderAsNavigationMenuOnMobile={true}
     *   anchor={<Icon name="menu" />}
     *   items={[
     *     { id: 'home', label: 'Home', icon: 'home' },
     *     { id: 'profile', label: 'Profile', icon: 'user' },
     *     { 
     *       id: 'settings', 
     *       label: 'Settings', 
     *       icon: 'settings',
     *       children: [
     *         { id: 'account', label: 'Account Settings' },
     *         { id: 'privacy', label: 'Privacy' },
     *         { id: 'notifications', label: 'Notifications' }
     *       ]
     *     }
     *   ]}
     * />
     * 
     * // User menu with navigation structure
     * <Menu
     *   renderAsNavigationMenuOnMobile={true}
     *   anchor={<Avatar src={user.avatar} />}
     *   items={userNavigationItems}
     *   className="navigation-menu-mobile"
     * />
     * ```
     */
    renderAsNavigationMenuOnMobile?: boolean;

    /**
     * Whether to render the menu as a navigation menu on tablet devices.
     * 
     * Navigation menu mode on tablet provides:
     * - Full-screen or large overlay presentation
     * - Optimized spacing for tablet touch targets
     * - Support for multi-column layouts
     * - Hierarchical menu structure with breadcrumbs
     * - Optimized for both portrait and landscape orientations
     * - Better utilization of available tablet screen space
     * 
     * Consider tablet-specific design patterns:
     * - Tablets have more screen real estate than phones
     * - Users may prefer sidebar/drawer patterns
     * - Touch targets can be smaller than mobile but larger than desktop
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Navigation menu optimized for tablets
     * <Menu
     *   renderAsNavigationMenuOnTablet={true}
     *   renderAsNavigationMenuOnMobile={true}
     *   anchor={<Button>Main Menu</Button>}
     *   items={mainNavigationItems}
     *   className="tablet:grid tablet:grid-cols-2 tablet:gap-4"
     * />
     * 
     * // Different layouts per device
     * <Menu
     *   renderAsNavigationMenuOnMobile={true}  // Full overlay on mobile
     *   renderAsNavigationMenuOnTablet={false} // Standard dropdown on tablet
     *   anchor={<Icon name="menu" />}
     *   items={navigationItems}
     * />
     * 
     * // Advanced tablet navigation with sections
     * <Menu
     *   renderAsNavigationMenuOnTablet={true}
     *   anchor={<Button>Browse</Button>}
     *   items={[
     *     {
     *       id: 'products',
     *       label: 'Products',
     *       children: productCategories,
     *       className: 'tablet:col-span-1'
     *     },
     *     {
     *       id: 'services', 
     *       label: 'Services',
     *       children: serviceCategories,
     *       className: 'tablet:col-span-1'
     *     }
     *   ]}
     * />
     * ```
     */
    renderAsNavigationMenuOnTablet?: boolean;

    /***
     * If true, the menu will have the same width as the anchor element.
     */
    sameWidth?: boolean;

    /***
     * The minimum width of the menu.
     */
    minWidth?: number | IPercentage;

    /**
     * The minimum height of the menu.
     */
    minHeight?: number | IPercentage;

    /***
     * The maximum width of the menu.
     */
    maxHeight?: number | IPercentage;

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
    preferredPositionAxis?: "horizontal" | "vertical";
}

export interface IMenuState {
    anchorMeasurements: IMenuAnchorMeasurements,
    visible: boolean
}

/**
 * Comprehensive configuration interface for the Menu component.
 * 
 * The Menu component is a highly versatile, responsive menu solution that adapts
 * to different screen sizes and provides both controlled and uncontrolled modes.
 * It supports desktop dropdowns, mobile bottom sheets, and tablet-optimized layouts.
 * 
 * @template Context - Custom context type to pass additional data to menu items and children
 * 
 * @since 1.0.0
 * @public
 * 
 * @example
 * ```tsx
 * // Basic uncontrolled menu
 * <Menu
 *   anchor={<Button>Open Menu</Button>}
 *   onOpen={() => console.log('Menu opened')}
 *   onClose={() => console.log('Menu closed')}
 * >
 *   <Text>Menu Content</Text>
 * </Menu>
 * 
 * // Controlled menu with custom context
 * interface UserContext {
 *   user: { id: string; name: string };
 *   permissions: string[];
 * }
 * 
 * const [menuVisible, setMenuVisible] = useState(false);
 * const userContext: UserContext = {
 *   user: { id: '1', name: 'John Doe' },
 *   permissions: ['read', 'write']
 * };
 * 
 * <Menu<UserContext>
 *   visible={menuVisible}
 *   context={userContext}
 *   onRequestClose={() => setMenuVisible(false)}
 *   anchor={(context) => (
 *     <Button>
 *       {context.user.name}'s Menu
 *     </Button>
 *   )}
 *   items={[
 *     { id: 'profile', label: 'Profile', icon: 'user' },
 *     { id: 'settings', label: 'Settings', icon: 'settings' }
 *   ]}
 *   bottomSheetTitle="User Actions"
 *   renderAsBottomSheetOnMobile={true}
 * />
 * 
 * // Menu with dynamic content based on context
 * <Menu
 *   anchor={<Icon name="more" />}
 *   sameWidth={false}
 *   minWidth={200}
 *   position="bottom"
 * >
 *   {(context) => (
 *     <View>
 *       <Text>Screen: {context.menu.isDesktop ? 'Desktop' : 'Mobile'}</Text>
 *       <Text>Position: {context.menu.position.computedPlacement}</Text>
 *     </View>
 *   )}
 * </Menu>
 * ```
 */
export interface IMenuProps<Context = unknown> extends Omit<ViewProps, "children" | "className" | "ref">, Omit<IUseMenuPositionProps, "menuWidth" | "menuHeight"> {

    // ========================================
    // CORE CONTROL PROPERTIES
    // ========================================

    /**
     * Controls the visibility of the menu for external state management.
     * 
     * When provided, the menu operates in **controlled mode**. In this mode:
     * - The parent component manages visibility state
     * - Use `onRequestOpen` and `onRequestClose` callbacks
     * - `onOpen` and `onClose` callbacks are ignored
     * 
     * When undefined, the menu operates in **uncontrolled mode**:
     * - Menu manages its own visibility state internally
     * - Use `onOpen` and `onClose` callbacks
     * - `onRequestOpen` and `onRequestClose` are ignored
     * 
     * @since 1.0.0
     * @default undefined (uncontrolled mode)
     * 
     * @example
     * ```tsx
     * // Controlled mode
     * const [visible, setVisible] = useState(false);
     * <Menu
     *   visible={visible}
     *   onRequestOpen={() => setVisible(true)}
     *   onRequestClose={() => setVisible(false)}
     *   anchor={<Button>Toggle Menu</Button>}
     * />
     * 
     * // Uncontrolled mode
     * <Menu
     *   onOpen={() => console.log('Menu opened')}
     *   onClose={() => console.log('Menu closed')}
     *   anchor={<Button>Toggle Menu</Button>}
     * />
     * ```
     */
    visible?: boolean;

    /**
     * Ref object to access the menu context and imperative methods.
     * 
     * The ref provides access to the complete menu context including:
     * - Menu state (isVisible, isOpen)
     * - Control methods (open, close, measureAnchor)
     * - Layout information (windowWidth, windowHeight, position)
     * - Device detection (isDesktop, isMobile, isTablet)
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * const menuRef = useRef<View & IMenuContext>();
     * 
     * <Menu
     *   ref={menuRef}
     *   anchor={<Button>Menu</Button>}
     * />
     * 
     * // Access menu context
     * const openMenu = () => menuRef.current?.menu.open();
     * const checkPosition = () => console.log(menuRef.current?.menu.position);
     * ```
     */
    ref?: React.Ref<View & IMenuContext<Context>>;

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Callback invoked when the menu opens in uncontrolled mode.
     * 
     * This callback is only triggered when:
     * - Menu is in uncontrolled mode (`visible` prop is undefined)
     * - Menu opens via user interaction or imperative API
     * 
     * For controlled mode, use `onRequestOpen` instead.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Open</Button>}
     *   onOpen={() => {
     *     console.log('Menu opened');
     *     analytics.track('menu_opened');
     *   }}
     * />
     * ```
     */
    onOpen?: () => void;

    /**
     * Callback invoked when the menu closes in uncontrolled mode.
     * 
     * This callback is only triggered when:
     * - Menu is in uncontrolled mode (`visible` prop is undefined)
     * - Menu closes via user interaction, backdrop click, or imperative API
     * 
     * For controlled mode, use `onRequestClose` instead.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Open</Button>}
     *   onClose={() => {
     *     console.log('Menu closed');
     *     analytics.track('menu_closed');
     *   }}
     * />
     * ```
     */
    onClose?: () => void;

    /**
     * Callback invoked when the menu requests to open in controlled mode.
     * 
     * This callback is only triggered when:
     * - Menu is in controlled mode (`visible` prop is provided)
     * - User attempts to open the menu via anchor interaction
     * 
     * Use this to update your external visibility state.
     * 
     * @param menuContext - Current menu context with state and methods
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * const [visible, setVisible] = useState(false);
     * 
     * <Menu
     *   visible={visible}
     *   onRequestOpen={(context) => {
     *     console.log('Menu wants to open', context.menu.anchorMeasurements);
     *     setVisible(true);
     *   }}
     *   anchor={<Button>Open Menu</Button>}
     * />
     * ```
     */
    onRequestOpen?: (menuContext: IMenuContext<Context>) => void;

    /**
     * Callback invoked when the menu requests to close in controlled mode.
     * 
     * This callback is triggered when:
     * - Menu is in controlled mode (`visible` prop is provided)
     * - User attempts to close via backdrop click, escape key, or menu item selection
     * - Dismissible behavior is enabled (default)
     * 
     * Use this to update your external visibility state.
     * 
     * @param menuContext - Current menu context with state and methods
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * const [visible, setVisible] = useState(false);
     * 
     * <Menu
     *   visible={visible}
     *   onRequestClose={(context) => {
     *     console.log('Menu wants to close', context.menu.position);
     *     setVisible(false);
     *   }}
     *   anchor={<Button>Open Menu</Button>}
     * />
     * ```
     */
    onRequestClose?: (menuContext: IMenuContext<Context>) => void;

    // ========================================
    // ANCHOR CONFIGURATION
    // ========================================

    /**
     * The anchor element or render function that triggers the menu.
     * 
     * The anchor serves as the reference point for menu positioning and
     * the interactive element that opens the menu (unless using controlled mode).
     * 
     * **Static Anchor:**
     * - Any React element (button, icon, text, etc.)
     * - Automatically becomes clickable to open menu
     * - Menu positions relative to this element
     * 
     * **Dynamic Anchor:**
     * - Function receiving menu context
     * - Enables conditional rendering based on menu state
     * - Useful for complex anchor designs
     * 
     * @param menuContext - Available when using function form
     * @returns React element to render as anchor
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Static anchor
     * <Menu anchor={<Button>Open Menu</Button>} />
     * 
     * // Icon anchor
     * <Menu anchor={<Icon name="more-vertical" />} />
     * 
     * // Dynamic anchor with context
     * <Menu
     *   anchor={(context) => (
     *     <Button 
     *       variant={context.menu.isVisible ? 'pressed' : 'default'}
     *       disabled={context.menu.fullScreen}
     *     >
     *       {context.menu.isVisible ? 'Close' : 'Open'} Menu
     *     </Button>
     *   )}
     * />
     * 
     * // Complex anchor with badges
     * <Menu
     *   anchor={(context) => (
     *     <View>
     *       <Avatar src={user.avatar} />
     *       {unreadCount > 0 && (
     *         <Badge count={unreadCount} />
     *       )}
     *     </View>
     *   )}
     * />
     * ```
     */
    anchor: ReactNode | ((menuContext: IMenuContext<Context>) => ReactNode);

    /**
     * CSS classes for styling the anchor container wrapper.
     * 
     * The anchor container is the touchable wrapper around your anchor element.
     * Use this to customize spacing, positioning, or interaction states.
     * 
     * Applied classes:
     * - Your custom classes
     * - Built-in cursor pointer styles
     * - Common variant styles (disabled state)
     * - Relative positioning class
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Icon name="menu" />}
     *   anchorContainerClassName="p-2 rounded-lg hover:bg-gray-100 transition-colors"
     * />
     * 
     * // Custom button-like anchor container
     * <Menu
     *   anchor={<Text>Menu</Text>}
     *   anchorContainerClassName="
     *     px-4 py-2 border border-gray-300 rounded-md
     *     hover:border-blue-500 focus:ring-2 focus:ring-blue-200
     *     active:bg-gray-50
     *   "
     * />
     * ```
     */
    anchorContainerClassName?: IClassName;

    // ========================================
    // CONTENT CONFIGURATION
    // ========================================

    /**
     * Menu content that can be static JSX or dynamic function.
     * 
     * **Static Content:**
     * - Any React elements (Text, View, Image, etc.)
     * - Rendered as-is within the menu
     * 
     * **Dynamic Content:**
     * - Function receiving menu context
     * - Access to menu state, device info, positioning data
     * - Enables responsive and context-aware content
     * 
     * @param context - Menu context with state and device information
     * @returns React elements to render in menu
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Static content
     * <Menu anchor={<Button>Menu</Button>}>
     *   <Text>Static menu content</Text>
     *   <Button>Action 1</Button>
     *   <Button>Action 2</Button>
     * </Menu>
     * 
     * // Dynamic content with context
     * <Menu anchor={<Button>Menu</Button>}>
     *   {(context) => (
     *     <View>
     *       <Text>Device: {context.menu.isDesktop ? 'Desktop' : 'Mobile'}</Text>
     *       <Text>Position: {context.menu.position.computedPlacement}</Text>
     *       <Text>Window Size: {context.menu.windowWidth}x{context.menu.windowHeight}</Text>
     *       
     *       {context.menu.isDesktop ? (
     *         <DesktopMenuItems />
     *       ) : (
     *         <MobileMenuItems />
     *       )}
     *       
     *       <Button onPress={() => context.menu.close()}>
     *         Close Menu
     *       </Button>
     *     </View>
     *   )}
     * </Menu>
     * 
     * // Conditional content based on user permissions
     * <Menu<{user: User}> 
     *   context={{user: currentUser}}
     *   anchor={<Avatar />}
     * >
     *   {(context) => (
     *     <View>
     *       <Text>Welcome, {context.user.name}</Text>
     *       {context.user.isAdmin && (
     *         <Button>Admin Panel</Button>
     *       )}
     *       <Button onPress={() => context.menu.close()}>
     *         Logout
     *       </Button>
     *     </View>
     *   )}
     * </Menu>
     * ```
     */
    children?: IReactNullableElement | ((context: IMenuContext<Context>) => IReactNullableElement);

    /**
     * Pre-configured navigation items for quick menu setup.
     * 
     * When provided, these items are automatically rendered using the
     * internal MenuItems component with proper styling and interactions.
     * Items support icons, labels, nested menus, and custom actions.
     * 
     * Items automatically close the menu when selected (unless closeOnPress is false).
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>User Menu</Button>}
     *   items={[
     *     {
     *       id: 'profile',
     *       label: 'Profile',
     *       icon: 'user',
     *       onPress: () => navigation.navigate('Profile')
     *     },
     *     {
     *       id: 'settings',
     *       label: 'Settings', 
     *       icon: 'settings',
     *       onPress: () => navigation.navigate('Settings')
     *     },
     *     { type: 'divider' },
     *     {
     *       id: 'logout',
     *       label: 'Logout',
     *       icon: 'log-out',
     *       onPress: handleLogout,
     *       closeOnPress: true // default behavior
     *     }
     *   ]}
     * />
     * 
     * // Nested menu items
     * <Menu
     *   anchor={<Button>Tools</Button>}
     *   items={[
     *     {
     *       id: 'export',
     *       label: 'Export',
     *       icon: 'download',
     *       children: [
     *         { id: 'pdf', label: 'PDF', onPress: () => exportPDF() },
     *         { id: 'csv', label: 'CSV', onPress: () => exportCSV() },
     *         { id: 'json', label: 'JSON', onPress: () => exportJSON() }
     *       ]
     *     }
     *   ]}
     * />
     * ```
     */
    items?: INavItemsProps<Context>["items"];

    /**
     * Additional configuration for the items rendering.
     * 
     * Customize how navigation items are displayed, including styling,
     * behavior, and layout options. This extends the base Nav.Items props
     * excluding items and context which are handled separately.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Menu</Button>}
     *   items={menuItems}
     *   itemsProps={{
     *     className: "space-y-1 p-2",
     *     size: "large",
     *     showIcons: true,
     *     variant: "ghost"
     *   }}
     * />
     * ```
     */
    itemsProps?: Omit<INavItemsProps<Context>, "items">;

    // ========================================
    // SCROLL BEHAVIOR
    // ========================================

    /**
     * Controls whether menu content is wrapped in a ScrollView.
     * 
     * **When true (default):**
     * - Content scrollable if it exceeds menu height
     * - Respects maxHeight constraints
     * - Better for long content lists
     * - ScrollView props can be customized
     * 
     * **When false:**
     * - Content rendered directly without scroll wrapper
     * - Better performance for simple content
     * - Content may overflow if too tall
     * - Use for simple, short content
     * 
     * @default true
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Long scrollable content (default)
     * <Menu
     *   anchor={<Button>Long Menu</Button>}
     *   withScrollView={true} // default
     *   maxHeight={300}
     * >
     *   {longContentList.map(item => (
     *     <MenuItem key={item.id} {...item} />
     *   ))}
     * </Menu>
     * 
     * // Simple non-scrollable content
     * <Menu
     *   anchor={<Button>Simple Menu</Button>}
     *   withScrollView={false}
     * >
     *   <Button>Action 1</Button>
     *   <Button>Action 2</Button>
     *   <Button>Action 3</Button>
     * </Menu>
     * ```
     */
    withScrollView?: boolean;

    /**
     * CSS classes for the main content container.
     * 
     * The content container is the flex-1 wrapper that holds all menu content
     * including items and children. It sits between the backdrop and the actual
     * content, providing the main structural layout.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Menu</Button>}
     *   contentContainerClassName="
     *     bg-white dark:bg-gray-800 
     *     border border-gray-200 dark:border-gray-700
     *     rounded-lg shadow-lg
     *     max-w-sm
     *   "
     * />
     * ```
     */
    contentContainerClassName?: IClassName;

    /**
     * CSS classes for the ScrollView wrapper when `withScrollView` is true.
     * 
     * Applied to the ScrollView component that wraps the menu content.
     * Use this to control scrolling behavior, styling, and constraints.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Menu</Button>}
     *   withScrollView={true}
     *   scrollViewClassName="
     *     max-h-64 overflow-y-auto
     *     scrollbar-thin scrollbar-thumb-gray-300
     *   "
     * />
     * ```
     */
    scrollViewClassName?: IClassName;

    /**
     * CSS classes for the ScrollView's content container.
     * 
     * Applied to the contentContainerStyle of the ScrollView.
     * Use this to control padding, spacing, and layout of scrollable content.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Menu</Button>}
     *   withScrollView={true}
     *   scrollViewContentContainerClassName="
     *     p-4 space-y-2
     *     pb-safe-area-bottom
     *   "
     * />
     * ```
     */
    scrollViewContentContainerClassName?: IClassName;

    // ========================================
    // INTERACTION BEHAVIOR
    // ========================================

    /**
     * Controls whether the menu can be dismissed by user interaction.
     * 
     * **When true (default):**
     * - Menu closes on backdrop click
     * - Menu closes on escape key press
     * - onRequestClose callback is triggered
     * 
     * **When false:**
     * - Menu stays open until explicitly closed
     * - Backdrop clicks are ignored
     * - Escape key is ignored
     * - Use for critical confirmations or forced interactions
     * 
     * @default true
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Normal dismissible menu
     * <Menu
     *   anchor={<Button>Regular Menu</Button>}
     *   dismissible={true} // default
     * />
     * 
     * // Non-dismissible confirmation menu
     * <Menu
     *   anchor={<Button>Delete Account</Button>}
     *   dismissible={false}
     * >
     *   <Text>Are you sure you want to delete your account?</Text>
     *   <View style={{flexDirection: 'row', gap: 8}}>
     *     <Button variant="destructive" onPress={confirmDelete}>
     *       Delete
     *     </Button>
     *     <Button onPress={() => menuRef.current?.menu.close()}>
     *       Cancel
     *     </Button>
     *   </View>
     * </Menu>
     * ```
     */
    dismissible?: boolean;

    /**
     * Disables the menu and its anchor interaction.
     * 
     * When true:
     * - Anchor becomes non-interactive
     * - Menu cannot be opened
     * - Visual disabled styling is applied
     * - Useful for loading states or permission restrictions
     * 
     * @default false
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * const [loading, setLoading] = useState(false);
     * 
     * <Menu
     *   anchor={<Button>User Actions</Button>}
     *   disabled={loading || !hasPermission}
     *   items={userMenuItems}
     * />
     * ```
     */
    disabled?: boolean;

    // ========================================
    // RESPONSIVE & MOBILE CONFIGURATION
    // ========================================

    /**
     * Whether to render the menu as a bottom sheet on mobile devices.
     * 
     * Bottom sheet mode provides a mobile-optimized menu experience:
     * - Slides up from the bottom of the screen
     * - Full-width presentation for easy touch interaction
     * - Native-feeling swipe gestures for dismissal
     * - Automatic title header with close button
     * - Better accessibility for mobile screen readers
     * - Respects safe area insets (notches, home indicators)
     * 
     * Best for:
     * - Action sheets and quick actions
     * - User account menus
     * - Settings and preferences
     * - Any menu with 3-8 primary actions
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Mobile-first action menu
     * <Menu
     *   anchor={<Button>Actions</Button>}
     *   renderAsBottomSheetOnMobile={true}
     *   bottomSheetTitle="Quick Actions"
     *   items={[
     *     { id: 'edit', label: 'Edit', icon: 'edit' },
     *     { id: 'share', label: 'Share', icon: 'share' },
     *     { id: 'delete', label: 'Delete', icon: 'trash', variant: 'destructive' }
     *   ]}
     * />
     * 
     * // User account menu with custom title
     * <Menu
     *   anchor={<Avatar src={user.avatar} />}
     *   renderAsBottomSheetOnMobile={true}
     *   bottomSheetTitle={
     *     <View className="flex-row items-center">
     *       <Avatar size="sm" src={user.avatar} />
     *       <Text className="ml-2 font-medium">{user.name}</Text>
     *     </View>
     *   }
     *   items={userMenuItems}
     * />
     * ```
     */
    renderAsBottomSheetOnMobile?: boolean;

    /**
     * Whether to render the menu as a bottom sheet on tablet devices.
     * 
     * Bottom sheet mode on tablets provides:
     * - Optimized for touch interaction with larger targets
     * - Full-width or constrained-width presentation options
     * - Better for complex forms or detailed content
     * - Works well in both portrait and landscape orientations
     * - Can utilize more vertical space than mobile
     * 
     * Consider tablet-specific UX patterns:
     * - Tablets have more screen space - bottom sheets might not always be optimal
     * - Users may expect more traditional dropdown/popover behavior
     * - Consider using only for specific use cases like media selection
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Media picker optimized for tablets
     * <Menu
     *   anchor={<Button>Select Media</Button>}
     *   renderAsBottomSheetOnMobile={true}
     *   renderAsBottomSheetOnTablet={true}
     *   bottomSheetTitle="Choose Media"
     *   contentContainerClassName="tablet:max-w-2xl tablet:mx-auto"
     * >
     *   <MediaGrid />
     * </Menu>
     * 
     * // Different behavior per device
     * <Menu
     *   anchor={<Button>Options</Button>}
     *   renderAsBottomSheetOnMobile={true}   // Bottom sheet on mobile
     *   renderAsBottomSheetOnTablet={false}  // Standard dropdown on tablet
     *   items={menuItems}
     * />
     * ```
     */
    renderAsBottomSheetOnTablet?: boolean;

    /**
     * Whether to render the menu as a navigation menu on mobile devices.
     * 
     * Navigation menu mode transforms the menu into a full-screen navigation interface
     * optimized for mobile devices. This mode provides:
     * 
     * **Mobile Navigation Features:**
     * - Full-screen overlay with proper backdrop
     * - Slide-in animation from left or right edge
     * - Large touch targets optimized for thumbs
     * - Hierarchical navigation with breadcrumbs
     * - Search functionality for large menu sets
     * - Proper focus management for accessibility
     * - Support for nested menu structures
     * - Mobile-optimized typography and spacing
     * 
     * **Perfect for:**
     * - Main application navigation
     * - Complex menu hierarchies (e.g., product catalogs)
     * - User account management sections
     * - Multi-level settings menus
     * - E-commerce category browsing
     * 
     * **UX Considerations:**
     * - Use for primary navigation, not quick actions
     * - Ensure clear "back" navigation for nested items
     * - Consider limiting depth to 3-4 levels maximum
     * - Include search for menus with 20+ items
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Main app navigation
     * <Menu
     *   anchor={<Icon name="menu" size={24} />}
     *   renderAsNavigationMenuOnMobile={true}
     *   items={[
     *     { 
     *       id: 'dashboard', 
     *       label: 'Dashboard', 
     *       icon: 'home',
     *       onPress: () => navigate('/dashboard')
     *     },
     *     {
     *       id: 'products',
     *       label: 'Products',
     *       icon: 'package',
     *       children: [
     *         { id: 'electronics', label: 'Electronics' },
     *         { id: 'clothing', label: 'Clothing' },
     *         { id: 'books', label: 'Books' }
     *       ]
     *     },
     *     {
     *       id: 'account',
     *       label: 'My Account',
     *       icon: 'user',
     *       children: [
     *         { id: 'profile', label: 'Profile Settings' },
     *         { id: 'orders', label: 'Order History' },
     *         { id: 'preferences', label: 'Preferences' }
     *       ]
     *     }
     *   ]}
     *   className="mobile-nav-menu"
     * />
     * 
     * // E-commerce category navigation
     * <Menu
     *   anchor={<Button>Browse Categories</Button>}
     *   renderAsNavigationMenuOnMobile={true}
     *   items={categoryHierarchy}
     *   searchable={true}
     *   placeholder="Search categories..."
     * />
     * 
     * // User settings navigation
     * <Menu
     *   anchor={<Button>Settings</Button>}
     *   renderAsNavigationMenuOnMobile={true}
     *   items={[
     *     {
     *       id: 'general',
     *       label: 'General',
     *       children: [
     *         { id: 'language', label: 'Language & Region' },
     *         { id: 'timezone', label: 'Time Zone' }
     *       ]
     *     },
     *     {
     *       id: 'privacy',
     *       label: 'Privacy & Security',
     *       children: [
     *         { id: 'data', label: 'Data Management' },
     *         { id: 'permissions', label: 'App Permissions' }
     *       ]
     *     }
     *   ]}
     * />
     * ```
     */
    renderAsNavigationMenuOnMobile?: boolean;

    /**
     * Whether to render the menu as a navigation menu on tablet devices.
     * 
     * Navigation menu mode on tablets provides a rich navigation interface that
     * takes advantage of the larger screen real estate while maintaining touch-friendly
     * interaction patterns.
     * 
     * **Tablet Navigation Features:**
     * - Full-screen or large overlay presentation
     * - Multi-column layouts for better space utilization
     * - Larger touch targets optimized for tablet interaction
     * - Support for both portrait and landscape orientations
     * - Enhanced visual hierarchy with icons and descriptions
     * - Side-panel or drawer-style navigation options
     * - Better accommodation of complex menu structures
     * 
     * **Tablet-Specific Considerations:**
     * - More screen space allows for richer content presentation
     * - Users may expect desktop-like interaction patterns
     * - Consider hybrid approaches (drawer + dropdown)
     * - Optimize for both one-handed and two-handed use
     * - Take advantage of landscape mode for wider layouts
     * 
     * **Optimal Use Cases:**
     * - Complex application navigation with multiple sections
     * - Content management interfaces
     * - Dashboard navigation with data visualization
     * - Educational apps with course/lesson hierarchies
     * - Creative tools with feature categorization
     * 
     * @default false
     * @since 1.1.0
     * 
     * @example
     * ```tsx
     * // Dashboard navigation optimized for tablets
     * <Menu
     *   anchor={<Button>Navigation</Button>}
     *   renderAsNavigationMenuOnTablet={true}
     *   items={[
     *     {
     *       id: 'analytics',
     *       label: 'Analytics',
     *       icon: 'bar-chart',
     *       description: 'View reports and insights',
     *       children: [
     *         { id: 'overview', label: 'Overview', icon: 'eye' },
     *         { id: 'reports', label: 'Custom Reports', icon: 'file-text' },
     *         { id: 'exports', label: 'Data Exports', icon: 'download' }
     *       ]
     *     },
     *     {
     *       id: 'content',
     *       label: 'Content Management',
     *       icon: 'edit',
     *       description: 'Manage your content',
     *       children: contentManagementItems
     *     }
     *   ]}
     *   className="tablet:grid tablet:grid-cols-2 tablet:gap-6"
     * />
     * 
     * // Multi-level navigation with visual enhancements
     * <Menu
     *   renderAsNavigationMenuOnTablet={true}
     *   anchor={<Icon name="apps" />}
     *   items={applicationSections}
     *   itemsProps={{
     *     showDescriptions: true,
     *     variant: 'card',
     *     size: 'large'
     *   }}
     *   className="tablet:max-w-4xl tablet:mx-auto"
     * />
     * 
     * // Responsive navigation (different per device)
     * <Menu
     *   anchor={<Button>Menu</Button>}
     *   renderAsNavigationMenuOnMobile={true}   // Full overlay on mobile
     *   renderAsNavigationMenuOnTablet={true}   // Enhanced layout on tablet
     *   items={navigationItems}
     *   className="
     *     mobile:w-full 
     *     tablet:w-3/4 tablet:max-w-3xl tablet:mx-auto
     *   "
     * />
     * ```
     */
    renderAsNavigationMenuOnTablet?: boolean;

    /**
     * Title displayed in bottom sheet header on mobile/tablet.
     * 
     * Only visible when:
     * - `renderAsBottomSheetOnMobile` is true and currently on mobile device
     * - `renderAsBottomSheetOnTablet` is true and currently on tablet device
     * 
     * Can be string, JSX, or any React node.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Simple string title
     * <Menu
     *   bottomSheetTitle="User Menu"
     *   renderAsBottomSheetOnMobile={true}
     * />
     * 
     * // Custom JSX title
     * <Menu
     *   bottomSheetTitle={
     *     <View style={{flexDirection: 'row', alignItems: 'center'}}>
     *       <Avatar size="sm" src={user.avatar} />
     *       <Text style={{marginLeft: 8}}>{user.name}</Text>
     *     </View>
     *   }
     *   renderAsBottomSheetOnMobile={true}
     * />
     * ```
     */
    bottomSheetTitle?: ReactNode;

    /**
     * Text styling variant for the bottom sheet title.
     * 
     * Controls typography, color, and styling of the title text.
     * Uses the same variant system as other text components.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   bottomSheetTitle="Menu Title"
     *   bottomSheetTitleVariant={{
     *     size: 'xl',
     *     weight: 'bold',
     *     color: 'primary'
     *   }}
     *   renderAsBottomSheetOnMobile={true}
     * />
     * ```
     */
    bottomSheetTitleVariant?: ITextVariant;

    /**
     * CSS classes for styling the bottom sheet title.
     * 
     * Custom classes to apply to the title text element.
     * Combined with variant styles and default title styling.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   bottomSheetTitle="Settings"
     *   bottomSheetTitleClassName="
     *     text-xl font-semibold text-gray-900 dark:text-white
     *     tracking-tight
     *   "
     *   renderAsBottomSheetOnMobile={true}
     * />
     * ```
     */
    bottomSheetTitleClassName?: IClassName;

    /**
     * Whether to show a divider line below the bottom sheet title.
     * 
     * **When true (default):**
     * - Horizontal divider separates title from content
     * - Better visual hierarchy
     * - Recommended for most cases
     * 
     * **When false:**
     * - No divider line
     * - Seamless title-to-content transition
     * - Use for minimal designs
     * 
     * @default true
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // With divider (default)
     * <Menu
     *   bottomSheetTitle="Actions"
     *   displayBottomSheetTitleDivider={true}
     *   renderAsBottomSheetOnMobile={true}
     * />
     * 
     * // Without divider for minimal look
     * <Menu
     *   bottomSheetTitle="Quick Actions"
     *   displayBottomSheetTitleDivider={false}
     *   renderAsBottomSheetOnMobile={true}
     * />
     * ```
     */
    displayBottomSheetTitleDivider?: boolean;

    // ========================================
    // STYLING & VARIANTS
    // ========================================

    /**
     * Visual styling variant for the menu in desktop/popup mode.
     * 
     * Controls colors, shadows, borders, spacing, and other visual aspects
     * of the menu when rendered as a desktop dropdown or popup.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Styled Menu</Button>}
     *   variant={{
     *     colorScheme: 'primary',
     *     shadow: 'xl',
     *     rounded: 'lg',
     *     padding: 4
     *   }}
     * />
     * ```
     */
    variant?: IMenuVariant;

    /**
     * Visual styling variant for the menu in mobile bottom sheet mode.
     * 
     * Controls the appearance when menu is rendered as a bottom sheet
     * on mobile devices. Separate from desktop variant to allow
     * different styling approaches for different form factors.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * <Menu
     *   anchor={<Button>Responsive Menu</Button>}
     *   variant={{colorScheme: 'surface'}} // Desktop styling
     *   bottomSheetVariant={{
     *     colorScheme: 'primary',
     *     elevation: 'high'
     *   }} // Mobile bottom sheet styling
     *   renderAsBottomSheetOnMobile={true}
     * />
     * ```
     */
    bottomSheetVariant?: IBottomSheetVariant;

    // ========================================
    // CONTEXT & DATA
    // ========================================

    /**
     * Additional context data passed to menu items and children functions.
     * 
     * This custom context is merged with the menu's internal context,
     * allowing you to pass user data, permissions, state, or any other
     * information that menu items or dynamic content might need.
     * 
     * Type-safe when using the generic Context parameter.
     * 
     * @since 1.0.0
     * 
     * @example
     * ```tsx
     * // Define custom context type
     * interface AppMenuContext {
     *   user: User;
     *   permissions: Permission[];
     *   currentTheme: 'light' | 'dark';
     *   onNavigate: (route: string) => void;
     * }
     * 
     * const appContext: AppMenuContext = {
     *   user: currentUser,
     *   permissions: userPermissions,
     *   currentTheme: theme,
     *   onNavigate: navigate
     * };
     * 
     * <Menu<AppMenuContext>
     *   context={appContext}
     *   anchor={<Avatar src={currentUser.avatar} />}
     *   items={[
     *     {
     *       id: 'profile',
     *       label: 'Profile',
     *       onPress: (event, context) => {
     *         context.onNavigate(`/users/${context.user.id}`);
     *       }
     *     },
     *     {
     *       id: 'admin',
     *       label: 'Admin Panel',
     *       visible: (context) => context.permissions.includes('admin'),
     *       onPress: (event, context) => {
     *         context.onNavigate('/admin');
     *       }
     *     }
     *   ]}
     * >
     *   {(context) => (
     *     <View>
     *       <Text>Welcome, {context.user.name}</Text>
     *       <Text>Theme: {context.currentTheme}</Text>
     *       <Text>Screen: {context.menu.isDesktop ? 'Desktop' : 'Mobile'}</Text>
     *     </View>
     *   )}
     * </Menu>
     * ```
     */
    context?: Context;
}




export interface IMenuItemProps<Context = unknown> extends INavItemProps<IMenuContext<Context>> { };


export interface IMenuItemsProps<Context = unknown> extends Omit<INavItemsProps<IMenuContext<Context>>, "renderItem" | "context" | "renderExpandableItem"> {
    context?: Context;
};
