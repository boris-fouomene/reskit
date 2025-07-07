
import { IClassName, IReactNullableElement } from "../../types";
import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { IVariantPropsMenu } from "@variants/menu";
import { INavItemProps, INavItemsProps } from "@components/Nav/types";
import { IVariantPropsBottomSheet } from "@variants/bottomSheet";
import { IPercentage } from "@resk/core/types";

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
    computedPlacement: IMenuPosition;
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

    /** Whether the menu should be responsive or not. If set to true, the menu will fill the entire screeen on mobile devices, and will be fixed on desktop. */
    fullScreenOnMobile?: boolean;

    /***
     * Whether the menu should be responsive on tablet devices or not. If set to true, the menu will fill the entire screeen on tablet devices, and will be fixed on desktop.
     */
    fullScreenOnTablet?: boolean;

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
    preferedPositionAxis?: "horizontal" | "vertical";
}

export interface IMenuState {
    anchorMeasurements: IMenuAnchorMeasurements,
    visible: boolean
}

export interface IMenuProps<Context = unknown> extends Omit<ViewProps, "children" | "className" | "ref">, Omit<IUseMenuPositionProps, "menuWidth" | "menuHeight"> {

    /** Optional callback that is invoked when the menu opens.
     * It's only considered when the menu is not controlled externally by providing the visible prop.
     */
    onOpen?: () => void;

    ref?: React.Ref<View & IMenuContext<Context>>;

    /** Required callback that is invoked when the menu closes.
     * It's only considered when the menu is not controlled externally by providing the visible prop.
     */
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
        The class name for the content container.
        This is used to apply style to the content container.
        The content container is the flex-1 container that wraps the menu content and items.
    */
    contentContainerClassName?: IClassName;

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
        @param {IMenuContext<Context>} menuContext The current menu context.
        @remarks
        This function is called when the menu is dismissed, either by clicking outside the menu or by pressing the escape key.
        It is used to update the visible state of the menu.
        This is useful when the menu is controlled externally by providing the visible prop.
        If the menu is not controlled externally, this function is not called.
    */
    onRequestClose?: (menuContext: IMenuContext<Context>) => void;

    /***
        The callback function that is called when the menu is opened.
        This is considered when the menu is controlled externally by providing the visible prop.
        @param {IMenuContext<Context>} menuContext The current menu context.
        @remarks
        This function is called when the menu is opened, either by clicking on the anchor element or by pressing the menu button.
        It is used to update the visible state of the menu.
        This is useful when the menu is controlled externally by providing the visible prop.
        If the menu is not controlled externally, this function is not called.
    */
    onRequestOpen?: (menuContext: IMenuContext<Context>) => void;


    /***
     * Whether the menu should be rendered as a bottom sheet in full screen mode.
     * If set to true, the menu will be rendered as a bottom sheet on mobile (when the fullScreenOnMobile prop is set to true) or tablet (when the fullScreenOnTablet pros is set to true) devices, and as a regular menu on desktop.
     */
    renderAsBottomSheetInFullScreen?: boolean;

    /***
     * The title of the bottom sheet when the menu is rendered as a bottom sheet.
     */
    bottomSheetTitle?: ReactNode;

    /***
     * The className to use for the bottom sheet title.
     */
    bottomSheetTitleClassName?: IClassName;

    /***
     * Whether to show a divider between the title and the content when the menu is rendered as a bottom sheet.
     */
    displayBottomSheetTitleDivider?: boolean;

    items?: INavItemsProps<Context>["items"];

    itemsProps?: Omit<INavItemsProps<Context>, "items">;

    /***
     * The variant to use for the menu.
     */
    variant?: IVariantPropsMenu;

    /***
        The variant to use for the bottom sheet.
        It will be used only if the menu is rendered as a bottom sheet.
    */
    bottomSheetVariant?: IVariantPropsBottomSheet;

    /***
     * Additional context options to pass to each item, enabling customization of the properties passed to item.
     */
    context?: Context;

    /***
        Whether the menu is disabled or not.
    */
    disabled?: boolean;

    /***
     * The Bottom Sheet Animation Duration in milli seconds
     * @default 300
     */
    animationDuration?: number;
}




export interface IMenuItemProps<Context = unknown> extends INavItemProps<IMenuContext<Context>> { };


export interface IMenuItemsProps<Context = unknown> extends Omit<INavItemsProps<IMenuContext<Context>>, "renderItem" | "context" | "renderExpandableItem"> {
    context?: Context;
};
