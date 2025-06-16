
import { IButtonProps } from "@components/Button/types";
import { IClassName, IReactNullableElement } from "../../types";
import { ReactNode } from "react";
import { PressableProps, ViewProps } from "react-native";
import { IHtmlDivProps } from "@html/types";
import { useBreakpoints } from "@utils/breakpoints";
import { IHtmlDetailsProps } from "@html/Details";
import { IVariantPropsMenu } from "@variants/menu";

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


export type IMenuContext<Context = unknown> = Context & {
    menu: {
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



export interface IMenuProps<Context = unknown> extends Omit<PressableProps, "children" | "style" | "className">, Omit<IUseMenuPositionProps, "menuWidth" | "menuHeight"> {

    /** Optional callback that is invoked when the menu opens. */
    onOpen?: () => void;

    /** Required callback that is invoked when the menu closes. */
    onClose?: () => void;

    /** The anchor element or function associated with the Menu component. */
    anchor: ReactNode | ((menuContext: IMenuContext<Context>) => ReactNode);

    /***
     * The class name for the touchable component.
     */
    anchorContainerClassName?: IClassName;

    /** Menu content, either as static JSX or a function returning JSX based on the menu context. */
    children?: IReactNullableElement | ((options: IMenuContext<Context>) => IReactNullableElement);

    /***
     * Default true
     * if true, the menu content will be wrapped in a ScrollView
     * if false, the menu content will be rendered directly
     */
    withScrollView?: boolean;

    /***
     * The class name for the scroll view.
     * This is used to apply style to the scroll view.
     */
    scrollViewClassName?: IClassName;

    /***
     * The class name for the scroll view content container.
     * This is used to apply contentContainerStyle to the scroll view.
     */
    scrollViewContentContainerClassName?: IClassName;

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

    items?: IMenuItems<Context>["items"];

    itemsProps?: Omit<IMenuItems<Context>, "items">;

    /***
     * The variant to use for the menu.
     */
    variant?: IVariantPropsMenu;

    /***
     * Additional context options to pass to each item, enabling customization of the properties passed to item.
     */
    context?: Context;
}


export interface IMenuItem<Context = unknown> extends IButtonProps<Context> {
    /***
     * if true, the menu item will be rendered as a section, if false, it will be rendered as an item
     */
    section?: boolean;
    /***
     * Props for the sub items. In case of existance of sub items.  If provided, the menu item will be expandable.
     */
    items?: IMenuItem<Context>[];
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

export interface IMenuItemProps<Context = unknown> extends IMenuItem<IMenuContext<Context>> {

};




/**
 * Represents the base properties for a collection of menu items, extending the view properties.
 * This type is designed to facilitate the rendering of multiple menu items within a menu component,
 * allowing for customization of the layout and behavior of the items.
 *
 * @template Context - A generic type parameter that allows the inclusion of additional
 * context properties specific to the menu items. This can be any object type, enabling extensibility
 * of the menu item's contextual behavior.
 *
 * @extends IHtmlDivProps - This type extends the properties of a Div, allowing for additional layout and
 * styling options that are applicable to the container of the menu items.
 *
 * @property {Array<IMenuItem<Context> | undefined | null>} [items] - Optional property
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
export interface IMenuItems<Context = unknown> extends IHtmlDivProps {
    items?: (IMenuItem<Context> | undefined | null)[]
}


export interface IMenuItemsProps<Context = unknown> extends IMenuItems<IMenuContext<Context>> {
    /**
     * Additional context options to pass to the rendering functions.
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
     */
    context?: Context;
};

/**
 * Type definition for a function that renders a menu item.
 * This function receives the properties of the menu item and an optional index,
 * and returns a IReactNullableElement representing the rendered item.
 *
 * @template Context - A generic type parameter that allows extending the context
 * for menu items. This enables customization of the properties passed to the menu item
 * render function, allowing for additional context-specific data to be included.
 *
 * @param {IMenuItem<Context>} props - The properties of the menu item to render.
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
export type IMenuItemRenderFunc<Context = unknown> = (props: IMenuItem<Context>, index: number) => IReactNullableElement;


type IMenuRenderItemsOptionsBase<Context = unknown> = {
    /**
     * The function used to render a
    * standard menu item. This function receives the item properties and is responsible for generating
    * the corresponding JSX.
     */
    render: IMenuItemRenderFunc<Context>,

    /**
     * The function used to
    * render expandable menu items. Similar to the render function, this handles the rendering of
    * items that can expand to show additional content.
     */
    renderExpandable: IMenuItemRenderFunc<Context>,

    /**
     * additioonal parameters that allows extending the context
    * for menu items. This enables customization of the properties passed to the menu item
    * render function, allowing for additional context-specific data to be included.
    *
    */
    context?: Context;
}

export interface IMenuRenderItemOptions<Context = unknown> extends IMenuRenderItemsOptionsBase<Context> {
    /**
     * The menu item to render. This includes
    * all relevant data required to display the item, such as its label, icon, and any action handlers.
     */
    item: IMenuItem<Context>,
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


export interface IMenuRenderItemsOptions<Context = unknown> extends IMenuRenderItemsOptionsBase<Context> {
    items?: IMenuItems<Context>["items"];
}