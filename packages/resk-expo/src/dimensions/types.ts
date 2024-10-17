import { ScaledSize } from "react-native";
/**
 * @interface IBreakpoints
 * Defines the breakpoints for responsive design.
 *
 * The `IBreakpoints` export interface allows you to specify various breakpoints for 
 * different screen sizes, which can be used to apply styles conditionally 
 * based on the device's dimensions.
 */
export interface IBreakpoints {
    sp?: IBreakpoint; // Small phone breakpoint
    mp?: IBreakpoint; // Medium phone breakpoint
    xs?: IBreakpoint; // Small devices (landscape phones, 576px and up)
    sm?: IBreakpoint; // Medium devices (tablets, 768px and up)
    md?: IBreakpoint; // Medium devices (laptops, 1024px and up)
    lg?: IBreakpoint; // Extra large devices (large desktops, 1200px and up)
    xl?: IBreakpoint; // Extra large devices (large desktops)
}

/**
 * @interface IBreakpoint
 * Represents a single breakpoint definition.
 *
 * The `IBreakpoint` export interface defines the properties of a breakpoint, 
 * including its minimum and maximum width, name, and label.
 */
export interface IBreakpoint {
    max?: number;     // Maximum width for the breakpoint
    min?: number;     // Minimum width for the breakpoint
    name?: keyof IBreakpoints; // The name of the breakpoint (e.g., 'xs', 'sm')
    label?: string;   // The definition or label for the breakpoint
}

/**
 * @interface IMainBreakpoints
 * Represents a collection of breakpoints and the currently active breakpoint.
 *
 * The `IMainBreakpoints` export interface encapsulates all defined breakpoints, 
 * along with the current active breakpoint, and optional maximum size constraints.
 */
export interface IMainBreakpoints {
    all: IBreakpoints; // All defined breakpoints
    max?: {
        max?: number;   // Maximum size constraint for breakpoints
        min?: number;   // Minimum size constraint for breakpoints
    };
    /** 
     * The active breakpoint at the current time.
     * It can be null if no breakpoint is active.
     */
    current?: IBreakpoint | null;
}

/**
 * @interface IDimensionsProps
 * Defines the properties related to the dimensions of the device screen.
 *
 * The `IDimensionsProps` export interface extends `ScaledSize` and adds properties 
 * to determine the current media type and whether the device is mobile, tablet, or desktop.
 */
export interface IDimensionsProps extends ScaledSize {
    currentMedia?: keyof IBreakpoints | ''; // Current media type based on breakpoints
    breakpoint?: IBreakpoint | null; // Current active breakpoint or null
    isMobile: boolean; // Indicates if the device is a mobile device
    isTablet: boolean; // Indicates if the device is a tablet
    isDesktop: boolean; // Indicates if the device is a desktop
    isMobileOrTablet: boolean; // Indicates if the device is either mobile or tablet
    isTabletOrDeskTop: boolean; // Indicates if the device is either tablet or desktop
    isPhone: boolean; // Indicates if the device is a phone
    isSmallPhone: boolean; // Indicates if the device is a small phone
    screen: ScaledSize; // Screen dimensions of the device
    window: ScaledSize; // Window dimensions of the device
    isPortrait: boolean; // Indicates if the device is in portrait mode
    isLandscape: boolean; // Indicates if the device is in landscape mode
}
