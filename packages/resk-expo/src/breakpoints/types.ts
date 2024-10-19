/**
 * @group Breakpoints
 * @interface IBreakpoints
 * Represents a collection of defined breakpoints for various device sizes used for responsive design. 
 * The IBreakpoints interface contains multiple IBreakpoint objects, each
 * corresponding to a specific device size category (e.g., small phones,
 * tablets, desktops). It allows you to specify various breakpoints for 
 * different screen sizes. These breakpoints can be used to apply styles conditionally 
 * based on the dimensions of the user's device. This is particularly useful in 
 * responsive web design to ensure your layout adapts to different screen sizes.
 * 
 * @property {IBreakpoint} [sp] - Defines the breakpoint for small phones. (e.g., up to 320px)..
 * @property {IBreakpoint} [mp] - Defines the breakpoint for medium phones.  (e.g., 321px to 480px)
 * @property {IBreakpoint} [xs] - Defines the breakpoint for extra small devices (landscape phones, 576px and up).
 * @property {IBreakpoint} [sm] - Defines the breakpoint for small devices (tablets, 768px and up).
 * @property {IBreakpoint} [md] - Defines the breakpoint for medium devices (laptops, 1024px and up).
 * @property {IBreakpoint} [lg] - Defines the breakpoint for large devices (desktops, 1200px and up).
 * @property {IBreakpoint} [xl] - Defines the breakpoint for extra-large devices (large desktops, higher than 1200px).
 * 
 * @example
 * ```ts
 * const breakpoints: IBreakpoints = {
 *   sp: { min: 0, max: 320 },       // Small phones: Up to 320px
 *   mp: { min: 321, max: 480 },     // Medium phones: Between 321px and 480px
 *   xs: { min: 481, max: 576 },     // Extra small devices: 481px to 576px
 *   sm: { min: 577, max: 768 },     // Small devices: 577px to 768px
 *   md: { min: 769, max: 1024 },    // Medium devices: 769px to 1024px
 *   lg: { min: 1025, max: 1200 },   // Large devices: 1025px to 1200px
 *   xl: { min: 1201, max: 1600 },   // Extra-large devices: Over 1200px
 * };
 * 
 * // You can use the defined breakpoints to apply styles conditionally:
 * const isSmallPhone = (width: number) => width <= breakpoints.sp?.max;
 * ```
 * 
 * @remarks
 * - Breakpoints help in creating responsive designs where the layout adjusts to different screen sizes.
 * - Each breakpoint is defined by an optional `IBreakpoint` object, which can include `min` and `max` width values.
 * 
 * @note
 * Breakpoints provide a flexible way to handle various screen sizes, ensuring better user experience across devices.
 */
export interface IBreakpoints {
    sp?: IBreakpoint; // Small phone breakpoint (e.g., up to 320px)
    mp?: IBreakpoint; // Medium phone breakpoint (e.g., 321px to 480px)
    xs?: IBreakpoint; // Extra small devices (e.g., landscape phones, 576px and up)
    sm?: IBreakpoint; // Small devices (e.g., tablets, 768px and up)
    md?: IBreakpoint; // Medium devices (e.g., laptops, 1024px and up)
    lg?: IBreakpoint; // Large devices (e.g., desktops, 1200px and up)
    xl?: IBreakpoint; // Extra large devices (e.g., large desktops, 1200px and up)
}


/**
 * @group Breakpoints
 * @interface IBreakpoint
 * Represents a single breakpoint definition.
 *
 * The `IBreakpoint` interface defines the properties of a responsive design breakpoint, 
 * including its minimum and maximum width, an optional name, and a descriptive label. 
 * It defines the limits of screen sizes at which specific styles
 * can be applied, allowing for tailored layouts across different devices.
 * These breakpoints are essential in creating media queries or adapting UI components 
 * based on different screen sizes.
 * 
 * @property {number} [max] - The maximum width for the breakpoint (e.g., the upper limit of the screen width).
 * @property {number} [min] - The minimum width for the breakpoint (e.g., the lower limit of the screen width).
 * @property {keyof IBreakpoints} [name] - The name of the breakpoint, corresponding to one of the keys 
 * in the `IBreakpoints` interface (e.g., 'xs', 'sm', 'md').
 * @property {string} [label] - A descriptive label for the breakpoint (e.g., "Tablet" or "Desktop"). 
 * Useful for documentation or tooltips in UI applications.
 * 
 * @example
 * ```ts
 * const smallPhoneBreakpoint: IBreakpoint = {
 *   min: 0,
 *   max: 320,
 *   name: 'sp',
 *   label: 'Small Phone'
 * };
 * 
 * const mediumDeviceBreakpoint: IBreakpoint = {
 *   min: 768,
 *   max: 1024,
 *   name: 'md',
 *   label: 'Medium Device (Tablet or Laptop)'
 * };
 * 
 * // Using the breakpoints to conditionally apply styles or logic:
 * const isMediumDevice = (width: number) => width >= mediumDeviceBreakpoint.min 
 *    && width <= mediumDeviceBreakpoint.max;
 * 
 * if (isMediumDevice(800)) {
 *   console.log("The current device is a medium-sized device.");
 * }
 * ```
 * 
 * @remarks
 * - Breakpoints provide essential guidelines for creating responsive designs.
 * - The `min` and `max` properties define the width range for the breakpoint.
 * - The `name` property should correspond to one of the defined breakpoints in `IBreakpoints`.
 * 
 * @note
 * Using descriptive labels for breakpoints helps in maintaining clarity in UI design and when debugging.
 * 
 * @see IBreakpoints
 */
export interface IBreakpoint {
    max?: number; // Maximum width for the breakpoint (e.g., 320px for small phones)
    min?: number; // Minimum width for the breakpoint (e.g., 768px for tablets)
    name?: keyof IBreakpoints; // The name of the breakpoint (e.g., 'sm', 'md')
    label?: string; // A label to describe the breakpoint (e.g., "Tablet", "Desktop")
}


/**
 * @group Breakpoints
 * @interface INormalizedBreakpoints
 * Encapsulates all defined breakpoints, the current active breakpoint, and optional maximum size constraints.
 * 
 * The `INormalizedBreakpoints` interface provides a structure to hold all available breakpoints for a responsive design system.
 * It also includes optional constraints on the minimum and maximum sizes, as well as tracking the current active breakpoint 
 * based on the device's screen size.
 * 
 * @property {IBreakpoints} all - An object containing all defined breakpoints. Each key corresponds to a specific device size (e.g., 'sm', 'md').
 * @property {object} [max] - Optional size constraints for the breakpoints.
 * @property {number} [max.max] - The maximum size constraint for breakpoints (e.g., to limit layout changes beyond a certain screen width).
 * @property {number} [max.min] - The minimum size constraint for breakpoints (e.g., to define a lower limit for layout adaptations).
 * @property {IBreakpoint | null} [current] - The currently active breakpoint based on the screen size. 
 * It can be `null` if no breakpoint is active, meaning the screen size doesn't match any defined breakpoints.
 * 
 * @example
 * ```ts
 * const createdBreakpoints: INormalizedBreakpoints = {
 *   all: {
 *     sp: { min: 0, max: 320, label: "Small Phone" },
 *     md: { min: 768, max: 1024, label: "Tablet or Laptop" },
 *     lg: { min: 1200, max: 1600, label: "Large Desktop" }
 *   },
 *   max: {
 *     max: 1600, // Screen widths above 1600px will not change the layout further.
 *     min: 320  // Layout is adapted for screens as small as 320px.
 *   },
 *   current: { min: 768, max: 1024, label: "Tablet or Laptop" }
 * };
 * 
 * // Example usage to check the current breakpoint:
 * if (createdBreakpoints.current) {
 *   console.log(`The current breakpoint is: ${createdBreakpoints.current.label}`);
 * } else {
 *   console.log("No active breakpoint.");
 * }
 * ```
 * 
 * @remarks
 * - The `all` property holds all available breakpoints that can be applied based on screen size.
 * - The `current` property helps identify which breakpoint is active at a particular screen width.
 * - `max` defines optional limits on how the layout should adapt beyond certain sizes.
 * 
 * @note
 * Managing breakpoints with this interface makes it easy to keep track of the active breakpoint and handle screen constraints effectively.
 * 
 * @see IBreakpoints
 */
export interface INormalizedBreakpoints {
    all: IBreakpoints; // All defined breakpoints (e.g., for phones, tablets, desktops)
    max?: {
        max?: number;   // Optional: The maximum size constraint for breakpoints (e.g., no layout changes beyond this width)
        min?: number;   // Optional: The minimum size constraint for breakpoints (e.g., layout changes occur from this width upwards)
    };
    /**
     * @property {IBreakpoint | null} [current]
     * The currently active breakpoint at runtime, based on the device's screen size.
     * It can be `null` if no breakpoint matches the current screen size.
     */
    current?: IBreakpoint | null;
}

/**
 * @group Breakpoints
 * @interface IMediaQueryTemplate
 * Template for CSS media query strings.
 * 
 * This type represents the various formats of media queries that can be generated 
 * based on defined breakpoints. It allows for both minimum and maximum width 
 * specifications to create flexible, responsive styles.
 * 
 * @type IMediaQueryTemplate
 * @example
 * const mobileMediaQuery: IMediaQueryTemplate = '@media (max-width: 320px)'; 
 * const tabletMediaQuery: IMediaQueryTemplate = '@media (min-width: 768px) and (max-width: 1024px)';
 */
export type IMediaQueryTemplate = | `@media (min-width: ${number}px)`   // Media query for minimum width
    | `@media (max-width: ${number}px)`   // Media query for maximum width
    | `@media (min-width: ${number}px) and (max-width: ${number}px)` // Combined min and max
    | `@media (max-width: ${number}px) and (min-width: ${number}px)` // Order doesn't matter
    | `@media (min-width: ${number}px) and (min-width: ${number}px)` // Two minimum widths
    | `@media (max-width: ${number}px) and (max-width: ${number}px)`; // Two maximum widths

/**
 * @group Breakpoints
 * 
 * @interface IBreakpointsMediaQueries
 * Represents global styles including breakpoints and corresponding media queries.
 * 
 * The IBreakpointsMediaQueries interface encapsulates the defined breakpoints along with the
 * generated media queries. This structure makes it easy to manage responsive styles
 * in a centralized manner.
 * 
 * @interface IBreakpointsMediaQueries
 * @property {IBreakpoints} breakpoints - The defined breakpoints for responsive design.
 * @property {Record<string, MediaQueryTemplate>} mediaQueries - The generated media queries
 *                                                             for each breakpoint.
 * 
 * @example
 * // Creating global styles using defined breakpoints
 * const breakpoints: IBreakpoints = {
 *   sp: { max: 320 },
 *   md: { min: 1024 },
 * };
 * 
 * const globalStyles: IBreakpointsMediaQueries = {
 *   breakpoints,
 *   mediaQueries: createMediaQueries(breakpoints),
 * };
 */
export type IBreakpointsMediaQueries = {
    breakpoints: IBreakpoints;
    mediaQueries: Record<string, IMediaQueryTemplate>;
};