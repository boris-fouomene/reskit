import { IIconProps, IIconSource } from "@components/Icon";
import { ILabelProps } from "@components/Label";
import { ISwiperProps } from "@components/Swiper/types";
import { ITouchableRippleProps } from "@components/TouchableRipple";
import { IViewProps } from "@components/View";
import { IStyle } from "../../types";
import { ReactNode } from "react";
import { Animated, GestureResponderEvent, ScrollViewProps, ViewProps } from "react-native";
import { IThemeColorTokenKey } from "@theme/types";

/**
 * Represents the properties for a Tab component.
 * 
 * This type extends the properties of ISwiperProps while omitting the `onChange` property.
 * It includes additional properties specific to the Tab component, allowing for customization
 * of tab items, tab content, and interaction behavior.
 * 
 * @typedef {ITabProps}
 */
export type ITabProps = Omit<ISwiperProps, "onChange"> & {
    /**
     * Callback function that is triggered when the active tab changes.
     * 
     * @param {Object} options - The options for the onChange callback.
     * @param {number} options.index - The index of the newly active tab.
     * @param {string} [options.sessionName] - Optional session name associated with the tab change.
     * @param {function} options.setActiveIndex - Function to programmatically set the active tab index.
     */
    onChange?: (options: { index: number; sessionName?: string; setActiveIndex: (index: number) => any }) => any;

    /**
     * Properties for customizing the tab items.
     */
    tabItemsProps?: ITabItemsProps; // Props for the tab items.

    /**
     * Properties for customizing individual tab items.
     */
    tabItemProps?: ITabItemProps; // Props for the individual tab items.

    /**
     * Properties for customizing the tab content.
     */
    tabContentProps?: ITabContentProps; // Props for the tab content.

    /**
     * Optional session name for the tab component.
     */
    sessionName?: string;

    /**
     * Indicates whether interaction between the children of the Tab should be disabled.
     * If set to true, interactions will be disabled.
     */
    disabled?: boolean;
};


/**
 * Interface representing the properties for the TabItem component.
 * 
 * The `ITabItemProps` type extends the properties of the `ITouchableRippleProps`
 * interface, omitting the `children` and `style` properties. It defines the
 * structure of the props that can be passed to the `TabItem` component, allowing
 * for customization of its appearance and behavior.
 * 
 * @interface ITabItemProps
 * @extends ITouchableRippleProps
 */
export type ITabItemProps = Omit<ITouchableRippleProps, "children" | "style"> & {
    /**
     * Function to determine if the TabItem should be rendered based on the provided options.
     * 
     * @param {ITabItemProps} options - The options for determining renderability.
     * @returns {boolean} Returns true if the TabItem should be rendered, false otherwise.
     */
    renderable?: ((options: ITabItemProps) => boolean) | false;

    /**
     * Additional properties for customizing the label component.
     */
    labelProps?: ILabelProps;

    /** 
     * Indicates whether the TabItem is currently active.
     * 
     * @type {boolean}
     */
    active?: boolean;

    /** 
     * Indicates if the TabItem should be styled as primary.
     * 
     * @type {boolean}
     */
    primary?: boolean;

    /** 
     * Indicates if the TabItem should be styled as secondary.
     * 
     * @type {boolean}
     */
    secondary?: boolean;

    /** 
     * The label to display for the TabItem.
     * 
     * @type {ReactNode}
     */
    label: ReactNode;

    /** 
     * The color of the TabItem. If not provided, defaults to the theme's text color.
     * 
     * @type {string}
     */
    color?: string;

    /** 
     * The position of the icon relative to the label ('top' or 'bottom').
     * 
     * @type {"top" | "bottom"}
     */
    iconPosition?: "top" | "bottom";

    /** 
     * The icon to display in the TabItem.
     * 
     * @type {IIconSource}
     */
    icon?: IIconSource;

    /** 
     * Additional properties for customizing the icon.
     * 
     * @type {IIconProps}
     */
    iconProps?: IIconProps;

    /** 
     * Optional children to render inside the TabItem.
     * 
     * @type {JSX.Element}
     */
    children?: JSX.Element;

    /** 
     * The index of the TabItem in the tab list.
     * 
     * @type {number}
     */
    index?: number;

    /** 
     * Additional styles for the TabItem.
     * 
     * @type {IStyle}
     */
    style?: IStyle;
}


/**
 * Interface representing the properties for the TabItems component.
 * 
 * The `ITabItemsProps` interface defines the structure of the props that can be
 * passed to the `TabItems` component, which manages a collection of tab items.
 * This interface allows for customization of the tab behavior, styling, and events.
 * 
 * @interface ITabItemsProps
 * @extends IViewProps
 */
export interface ITabItemsProps extends IViewProps {

    /**
     * Callback function that is called when a tab item is pressed.
     * 
     * @param {GestureResponderEvent} event - The event object for the press action.
     * @returns {any} Returns any value (usually used for side effects).
     */
    onPress?: (event: GestureResponderEvent) => void;

    /**
     * Indicates whether the tabs should be scrollable.
     * 
     * @type {boolean}
     */
    scrollable?: boolean;

    /**
     * Disables the indicator that appears below the tabs.
     * 
     * @type {boolean}
     */
    disableIndicator?: boolean;

    /**
     * Additional styling properties for the tab indicator.
     * 
     * @type {Animated.AnimatedProps<ViewProps>}
     */
    indicatorProps?: Animated.AnimatedProps<ViewProps>;

    /**
     * Indicates whether the tab items should be fixed.
     * 
     * @type {boolean}
     */
    fixed?: boolean;

    /**
     * The elevation level of the component, affecting its shadow and depth.
     * 
     * @type {number}
     */
    elevation?: number;

    /**
     * Additional properties for the ScrollView component.
     * 
     * @type {ScrollViewProps}
     */
    scrollViewProps?: ScrollViewProps;

    /***
     * tabItems color scheme
     */
    colorScheme?: IThemeColorTokenKey;
}


/**
 * Interface representing the properties for the TabContent component.
 * 
 * The `ITabContentProps` interface extends the `ISwiperProps` interface, 
 * allowing the `TabContent` component to inherit all properties from `Swiper`.
 * In addition, it includes a specific property for styling the container of 
 * each tab item within the `TabContent`.
 * 
 * @interface ITabContentProps
 * @extends ISwiperProps
 */
export interface ITabContentProps extends ISwiperProps {
    /** Styling for TabContent.Item Component container. */
    tabItemContainerStyle: IStyle
}
