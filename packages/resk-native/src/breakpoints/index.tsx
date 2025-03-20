import { Dimensions, PixelRatio, ViewStyle } from "react-native";
import { IBreakpoints, IBreakpoint, INormalizedBreakpoints, IMediaQueryTemplate, IBreakpointNamePhone, IBreakpointNameSmallPhone, IBreakpointNameMobile, IBreakpointNameTablet, IBreakpointNameDesktop, IBreakpointNameMediumPhone, IBreakpointName, IBreakpointColumns } from "./types";
import { addClassName, isDOMElement, isNonNullString, isObj, isNumber, removeClassName } from "@resk/core";
import { IStyle } from "@src/types";
import Platform from "@platform/index";


// int comparer for sorts
const compareInts = function compare(a: any, b: any): number {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
};

// Indicates if an object is numeric
const isNumeric = function (obj: any): boolean {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

// Given a breakpointsRef.current object, will convert simple "max" values to a rich breakpoint object
// which can contain min, max, and name
const setMaxWidths = function (breakpoints: IBreakpoints) {
    const maxWidths: number[] = [];
    if (!isObj(breakpoints)) return [];
    for (let name in breakpoints) {
        const m = breakpoints[name as keyof IBreakpoints]?.max;
        if (m && isNumber(m)) {
            maxWidths.push(m);
        }
    }
    maxWidths.sort(compareInts);
    return maxWidths;
};

// Given a breakpointsRef.current object, will assign "min" values based on the
// existing breakpointsRef.current "max" values.
const setMinWidths = function (breakpoints: IBreakpoints, maxWidths: number[]): void {
    if (!isObj(breakpoints)) return;
    for (let name in breakpoints) {
        const breakpoint = breakpoints[name as keyof IBreakpoints];
        if (typeof breakpoint?.min === "number") {
            continue;
        }
        for (let i = 0; i < maxWidths.length; i++) {
            if (breakpoint?.max == maxWidths[i] && isNumber(maxWidths[i])) {
                if (i === 0) {
                    breakpoint.min = 0;
                } else {
                    breakpoint.min = maxWidths[i - 1] + 1;
                }
                break;
            }
        }
    }
};

export default class Breakpoints {
    public static readonly defaultBreakpoints: IBreakpoints = {
        sp: {
            max: 320,  // Small phone breakpoint (320px and below)
            name: 'sp',
            label: "Small phone",
            gutter: 3, // Small phone gutter
        },
        mp: {
            max: 399,  // Medium phone breakpoint (399px and below)
            name: 'mp',
            label: "Medium phone",
            gutter: 4, // Medium phone gutter
        },
        xs: {
            max: 600,  // Small devices (landscape phones, 600px and below)
            name: 'xs',
            label: "Phone : Small devices (landscape phones, 600 and bellow)",
            gutter: 5, // Phone : Small devices (landscape phones, 600 and bellow) gutter
        },
        sm: {
            max: 767,  // Medium devices (tablets, 767px and below)
            name: 'sm',
            label: "Medium devices (tablets, 767px bellow)",
            gutter: 6, // Medium devices (tablets, 767px and below) gutter
        },
        md: {
            max: 1024,  // Medium devices (laptops, 1024px and up)
            name: 'md',
            label: "medium devices (laptops, 1024px and up)",
            gutter: 7, // medium devices (laptops, 1024px and up) gutter
        },
        lg: {
            max: 1199,  // Large devices (large desktops, 1200px and up)
            name: 'lg',
            label: "large devices (large desktops, 1200px and up)",
            gutter: 8, //Large devices gutter
        },
        xl: {
            max: Infinity,  // Extra large devices (large desktops and beyond)
            name: 'xl',
            label: "Extra large devices (large desktops)",
            gutter: 10,
        },
    }
    /**
    * @constant breakpointsRef
    * A reference object holding the current set of normalized breakpoints.
    * 
    * The `breakpointsRef` object is used to store and update breakpoints dynamically. It contains the `current` property,
    * which holds a normalized version of breakpoints used for responsive design. Each breakpoint defines the maximum width
    * and other metadata such as name and label.
    * 
    * @example
    * ```ts
    * console.log(breakpointsRef.current.all.sp); // { max: 320, name: 'sp', label: 'Small phone' }
    * ```
    */
    private static readonly breakpointsRef: { current: INormalizedBreakpoints & { mediaQueries: Record<keyof IBreakpoints, IMediaQueryTemplate> } } = {
        current: {
            all: this.defaultBreakpoints,
            mediaQueries: this.createMediaQueries(this.defaultBreakpoints)
        }
    }
    /**
    * Generates a collection of media query strings based on the defined breakpoints.
    * 
    * The createMediaQueries function takes an IBreakpoints object and returns an
    * object where each key corresponds to a media query template. This allows for
    * easy access to the appropriate media query for applying responsive styles.
    * 
    * @param breakpoints - An object containing the defined breakpoints.
    * @returns An object with media query templates for each breakpoint key.
    * 
    * @example
    * // Creating breakpoint columns from defined breakpoints
    * const breakpoints: IBreakpoints = {
    *   sp: { max: 320 },
    *   md: { min: 1024 },
    * };
    * 
    * const mediaQueries = createMediaQueries(breakpoints);
    * console.log(mediaQueries.sp); // Output: '@media (max-width: 320px)'
    * console.log(mediaQueries.md); // Output: '@media (min-width: 1024px)'
    */
    public static createMediaQueries(breakpoints: IBreakpoints): Record<keyof IBreakpoints, IMediaQueryTemplate> {
        const mediaQueries: Record<keyof IBreakpoints, IMediaQueryTemplate> = {} as Record<keyof IBreakpoints, IMediaQueryTemplate>;
        // Loop through each breakpoint and generate corresponding media query strings
        for (const key in breakpoints) {
            const breakpoint = breakpoints[key as keyof IBreakpoints];
            if (isObj(breakpoint) && breakpoint) {
                // Generate media query for min-width if defined
                if (isNumber(breakpoint.min)) {
                    mediaQueries[key as keyof IBreakpoints] = `@media (min-width: ${breakpoint.min}px)`;
                }
                // Generate media query for max-width if defined
                if (isNumber(breakpoint.max)) {
                    mediaQueries[key as keyof IBreakpoints] = `@media (max-width: ${breakpoint.max}px)`;
                }
                // Generate combined media query for both min and max widths
                if (isNumber(breakpoint.min) && isNumber(breakpoint.max)) {
                    mediaQueries[key as keyof IBreakpoints] = `@media (min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px)`;
                }
            }
        }
        return mediaQueries; // Return the generated breakpoint columns
    }
    /**
  * @function normalize
     * Merges raw breakpoints with the existing normalized breakpoints and converts the object to a fully normalized format.
     *
     * The `normalize` function takes a `breakpoints` object with simple integer values for `max` widths 
     * and merges it with the existing breakpoints stored in `breakpointsRef`. 
     * It then normalizes the merged object by calculating both `min` and `max` widths for each breakpoint and adding
     * an upper-bound breakpoint to account for the largest screen sizes.
     * 
     * @param {IBreakpoints} breakpoints - The raw breakpoints object that will be merged and normalized.
     * 
     * @example
     * ```ts
     * const rawBreakpoints = {
     *   sp: { max: 350, name: 'sp', label: 'Small phone' },
     *   md: { max: 1024, name: 'md', label: 'Medium devices (laptops)' }
     * };
     * 
     * normalize(rawBreakpoints);
     * console.log(breakpointsRef.current.all.sp); // Updated breakpoints with normalization
     * ```
     * 
     * @remarks
     * This function works by:
     * - Merging the input `breakpoints` into the current `breakpointsRef`.
     * - Using helper functions (`setMaxWidths`, `setMinWidths`, `addMaxBreakpoint`) to normalize the breakpoints object.
     * 
     * @see INormalizedBreakpoints for more details on the structure and format of normalized breakpoints.
     * @returns {INormalizedBreakpoints} The normalized breakpoints object.
     */
    public static normalize(breakpoints?: IBreakpoints): INormalizedBreakpoints {
        // Merge the incoming breakpoints with the current normalized breakpoints reference
        const all: IBreakpoints = Object.assign({}, this.breakpointsRef.current.all, breakpoints);
        this.breakpointsRef.current = {
            ...this.breakpointsRef.current,
            all,
            mediaQueries: this.createMediaQueries(all)
        };
        // Normalize the breakpoints object
        const maxWidths = setMaxWidths(this.breakpointsRef.current.all); // Calculate max widths for each breakpoint
        setMinWidths(this.breakpointsRef.current.all, maxWidths);        // Set min widths based on the next largest breakpoint
        addMaxBreakpoint(this.breakpointsRef.current, maxWidths);        // Add a max breakpoint for the largest screens
        return this.breakpointsRef.current;
    }

    /**
     * @function update
     * Updates the current media breakpoint based on the given width and returns the name of the active breakpoint.
     *
     * The `update` function checks the current window width (or an optional specified width) against 
     * the defined breakpoints. If the width falls within a defined breakpoint range, it updates the `current` 
     * breakpoint in the `breakpointsRef` and returns the name of the active breakpoint. 
     * This function is useful for responsive designs where the layout needs to adapt based on the device's dimensions.
     * 
     * @param {Object} [opts] - Optional parameters to customize the function's behavior.
     * @param {number} [opts.width] - An optional width to check against the breakpoints. If not provided, 
     * the window width will be used.
     * 
     * @returns {string | null} - The name of the current active breakpoint, or `null` if no breakpoints are active 
     * for the given width.
     * 
     * @example
     * ```ts
     * // Update breakpoints and get the name of the current breakpoint
     * const currentBreakpoint = update(); 
     * console.log(currentBreakpoint); // Outputs the name of the current breakpoint (e.g., 'sm', 'md')
     * 
     * // Update with a custom width
     * const customBreakpoint = update({ width: 500 });
     * console.log(customBreakpoint); // Outputs the name of the breakpoint for the width 500
     * ```
     * 
     * @remarks
     * The function works by:
     * - Retrieving the current window width or using a specified width from the `opts` parameter.
     * - Iterating through all defined breakpoints to check if the width falls within the range specified by the `min` 
     *   and `max` properties of each breakpoint.
     * - If a match is found, it updates the current breakpoint reference and returns the name of that breakpoint.
     * 
     * @see breakpointsRef for the current set of breakpoints and active breakpoint reference.
     */
    public static update(opts?: { width?: number }): string | null {
        this.updateDeviceClassName();
        const width = isNumeric(opts?.width) ? opts?.width : Dimensions.get('window').width; // Get the window width
        if (!width) {
            return null; // Return null if no valid width is provided
        }
        const _breakpoints = this.breakpointsRef.current.all; // Access the defined breakpoints
        for (let name in _breakpoints) {
            const breakpoint = _breakpoints[name as keyof IBreakpoints]; // Get the current breakpoint
            if (!breakpoint || !breakpoint?.max || !breakpoint?.min) continue; // Skip if invalid

            // Check if the width is within the breakpoint's min and max range
            if (width <= breakpoint.max && width >= breakpoint.min) {
                this.breakpointsRef.current.current = breakpoint; // Update the current breakpoint
                return name; // Return the name of the current breakpoint
            }
        }
        return null; // Return null if no active breakpoint is found
    }

    /**
     * @function init
     * Initializes breakpoint management by normalizing the provided breakpoints 
     * and setting the current active breakpoint based on the initial window width.
     *
     * The `init` function takes a set of defined breakpoints, normalizes them,
     * and determines which breakpoint is currently active based on the window's width at the 
     * time of initialization. This is essential for ensuring responsive behavior in applications 
     * that rely on breakpoints for layout adjustments.
     * 
     * @param {IBreakpoints} breakpoints - The set of breakpoints to be initialized. Each breakpoint
     * should define its maximum and minimum width values to allow for accurate detection of 
     * the current active breakpoint.
     * 
     * @example
     * ```ts
     * const myBreakpoints: IBreakpoints = {
     *   sp: { max: 320, min: 0, name: 'sp', label: 'Small phone' },
     *   md: { max: 1024, min: 768, name: 'md', label: 'Medium devices' },
     *   lg: { max: 1200, min: 1025, name: 'lg', label: 'Large devices' }
     * };
     * 
     * init(myBreakpoints); // Initializes breakpoints and sets the current active breakpoint
     * console.log(breakpointsRef.current.current); // Outputs the active breakpoint based on window width
     * ```
     * 
     * @remarks
     * The function performs the following steps:
     * - Retrieves the current window width using the `Dimensions` API.
     * - Calls `normalize` to ensure the provided breakpoints are correctly formatted.
     * - Iterates through the normalized breakpoints to check if the current width falls within 
     *   any breakpoint's defined range (`min` and `max`). 
     * - Updates the `current` breakpoint reference in `breakpointsRef` if a matching breakpoint is found.
     * 
     * @see IBreakpoints for details on the structure of the breakpoints object.
     * @see normalize for more information on the normalization process.
     */
    public static init(breakpoints?: IBreakpoints) {
        const width = Dimensions.get('window').width; // Get the current window width
        this.normalize(breakpoints); // Normalize the provided breakpoints
        // Iterate through all defined breakpoints to find the current active one
        for (let name in this.breakpointsRef.current.all) {
            const breakpoint = this.breakpointsRef.current.all[name as keyof IBreakpoints]; // Get the current breakpoint
            if (!(breakpoint) || !breakpoint?.max || !breakpoint?.min) continue; // Skip if invalid

            // Check if the width falls within the breakpoint's min and max range
            if (width <= breakpoint.max && width >= breakpoint.min) {
                this.breakpointsRef.current.current = breakpoint; // Set the current breakpoint
                break; // Exit the loop once the active breakpoint is found
            }
        }
        this.updateDeviceClassName();
    }


    /**
     * @function getCurrentMedia
     * Returns the current media type based on the provided window width.
     *
     * This function determines the active media type by checking the specified width 
     * against predefined breakpoints. If no valid width is provided, it defaults to 
     * using the current window width retrieved from the `Dimensions` API.
     *
     * @param {number} [width] - The width of the window to check against the defined breakpoints.
     * If the provided width is less than or equal to 300, the function will use the current 
     * window width instead.
     *
     * @returns {keyof IBreakpoints | ''} - The key of the current media type based on the breakpoints,
     * or an empty string if no matching breakpoint is found. The return value corresponds to 
     * the defined breakpoint keys, such as 'sp', 'mp', 'xs', 'sm', 'md', 'lg', and 'xl'.
     *
     * @example
     * ```ts
     * const currentMediaType = getCurrentMedia(); // Uses current window width
     * console.log(currentMediaType); // Outputs the active media type (e.g., 'md')
     * 
     * const customWidthMediaType = getCurrentMedia(500); // Uses a custom width of 500
     * console.log(customWidthMediaType); // Outputs the media type corresponding to the width of 500
     * ```
     *
     * @remarks
     * The function iterates through all defined breakpoints and checks if the provided 
     * width falls within the range defined by the `max` and `min` properties of each breakpoint. 
     * If a match is found, the corresponding breakpoint key is returned. If no match is found, 
     * the function returns the name of the currently active breakpoint or an empty string.
     */
    public static getCurrentMedia(windowWidth?: number): keyof IBreakpoints {
        // If width is valid and greater than 300, use it; otherwise, get the current window windowWidth
        windowWidth = isNumber(windowWidth) && windowWidth >= MIN_WIDTH ? windowWidth : Dimensions.get("window").width;
        // Iterate through defined breakpoints to find the current media type
        for (let i in this.breakpointsRef.current.all) {
            const breakpoint = this.breakpointsRef.current.all[i as keyof IBreakpoints];
            if (!breakpoint || !isNumber(breakpoint?.max) || !isNumber(breakpoint?.min)) continue;
            // Return the key of the first matching media type based on the width
            if (windowWidth <= breakpoint.max) return i as keyof IBreakpoints;
        }
        // Return the name of the current breakpoint or an empty string if none found
        return this.breakpointsRef.current.current?.name || "lg";
    }

    /***
     * Determines whether the current device matches any of the specified media aliases.
     * 
     * This function checks if the current breakpoint is included in the provided 
     * media aliases (as a single string or an array). It returns true if a match is found.
     * 
     * @param {string | string[]} alias - A string or an array of media aliases to check against.
     * 
     * @returns {boolean} - Returns true if the current device matches any of the aliases; otherwise, false.
     * 
     * @example
     * ```ts
     * const isMobile = isMediaDevice('mobile');
     * console.log(isMobile); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isMediaDevice(alias: string | string[]): boolean {
        const currentBreakpoint = this.currentBreakpoint;
        if (!(currentBreakpoint) || !alias) return false;
        const aliasSplit = typeof alias === "string" ? alias.trim().toLowerCase().split(",") : alias;
        if (currentBreakpoint?.name) {
            return aliasSplit.includes(currentBreakpoint.name.toLowerCase());
        }
        return false;
    }

    /***
     * Determines if the current media is classified as a phone.
     * 
     * This function utilizes the `isMediaDevice` function to check if the current 
     * device matches the predefined phone breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is a phone; otherwise, false.
     * 
     * @example
     * ```ts
     * const isPhone = isPhoneMedia();
     * console.log(isPhone); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isPhoneMedia(): boolean {
        return this.isMediaDevice(this.phoneBreakpoints);
    }

    /***
     * Determines if the current media is classified as a phone.
     * 
     * This function utilizes the `isMediaDevice` function to check if the current 
     * device matches the predefined phone breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is a medium phone; otherwise, false.
     * 
     * @example
     * ```ts
     * const isPhone = isMediumPhoneMedia();
     * console.log(isPhone); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isMediumPhoneMedia(): boolean {
        return this.isMediaDevice(this.mediumPhoneBreakpoints);
    }


    /***
     * Determines if the current media is classified as a small phone.
     * 
     * This function utilizes the `isMediaDevice` function to check if the current 
     * device matches the predefined small phone breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is a small phone; otherwise, false.
     * 
     * @example
     * ```ts
     * public static isSmallPhone = isSmallPhoneMedia();
     * console.log(isSmallPhone); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isSmallPhoneMedia(): boolean {
        return this.isMediaDevice(this.smallPhoneBreakpoints);
    }

    /***
     * Determines if the current media is classified as mobile, which includes phones, 
     * small phones, and tablets.
     * 
     * This function utilizes the `isMediaDevice` function to check against the mobile 
     * breakpoints and the small phone breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is classified as mobile; otherwise, false.
     * 
     * @example
     * ```ts
     * const isMobile = isMobileMedia();
     * console.log(isMobile); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isMobileMedia(): boolean {
        return this.isMediaDevice(this.mobileBreakpoints) || this.isMediaDevice(this.smallPhoneBreakpoints);
    }

    /***
     * Determines if the current media is classified as a tablet.
     * 
     * This function utilizes the `isMediaDevice` function to check if the current 
     * device matches the predefined tablet breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is a tablet; otherwise, false.
     * 
     * @example
     * ```ts
     * const isTablet = isTabletMedia();
     * console.log(isTablet); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isTabletMedia(): boolean {
        return this.isMediaDevice(this.tabletBreakpoints);
    }

    /***
     * Determines if the current environment is classified as desktop.
     * 
     * This function utilizes the `isMediaDevice` function to check if the current 
     * device matches the predefined desktop breakpoints.
     * 
     * @returns {boolean} - Returns true if the current device is a desktop; otherwise, false.
     * 
     * @example
     * ```ts
     * const isDesktop = isDesktopMedia();
     * console.log(isDesktop); // Outputs: true or false based on the current breakpoint
     * ```
     */
    public static isDesktopMedia(): boolean {
        return this.isMediaDevice(this.desktopBreakpoints);
    }

    /***
     * Determines if the screen is in portrait orientation.
     * 
     * This function checks the dimensions of the screen and returns true if 
     * the height is greater than or equal to the width, indicating portrait mode.
     * 
     * @returns {boolean} - Returns true if the screen is in portrait mode; otherwise, false.
     * 
     * @example
     * ```ts
     * const portrait = isPortrait();
     * console.log(portrait); // Outputs: true or false based on the screen orientation
     * ```
     */
    public static isPortrait(): boolean {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    }

    /***
     * The name of the breakpoint for small phones.
     *  
     * @remarks
     * This constant is used to identify the breakpoint for small phones.
     * It is used in the `smallPhoneBreakpoints` array to ensure consistency.
     */
    public static readonly smallPhoneBreakpoint = "sp";
    /**
     * @constant smallPhoneBreakpoints
     * An array representing the breakpoints for small phone devices.
     *
     * This array includes the key 'sp', which corresponds to the breakpoint
     * defined for small phones. It can be used in responsive design to apply
     * styles specifically for small phone screens.
     * 
     * @example
     * ```ts
     * console.log(smallPhoneBreakpoints); // Outputs: ["sp"]
     * ```
     */
    public static readonly smallPhoneBreakpoints: IBreakpointNameSmallPhone[] = [this.smallPhoneBreakpoint, "smallPhone"];

    /***
     * The name of the breakpoint for phones.
     * 
     * @remarks
     * This constant is used to identify the breakpoint for phones.
     * It is used in the `phoneBreakpoints` array to ensure consistency.
     */
    public static readonly phoneBreakpoint = "xs";

    /**
     * @constant phoneBreakpoints
     * An array representing the breakpoints for all phone devices.
     *
     * This array currently references the mobileBreakpoints array,
     * which includes keys for various phone breakpoints. It can be used
     * interchangeably to apply styles for any phone device.
     * 
     * @example
     * ```ts
     * console.log(phoneBreakpoints); // Outputs: ["mobile", "sp", "xs", "mp"]
     * ```
     */
    public static readonly phoneBreakpoints: IBreakpointNamePhone[] = [this.phoneBreakpoint, "phone"];

    /***
     * The name of the breakpoint for medium phones.
     *  
     * @remarks
     * This constant is used to identify the breakpoint for medium phones.
     * It is used in the `mediumPhoneBreakpoints` array to ensure consistency.
     */
    public static readonly mediumPhoneBreakpoint = "mp";

    /**
     * @constant mediumPhoneBreakpoints
     * An array representing the breakpoints for medium phone devices.
     * This array includes the key 'xs' and the generic 'mediumPhone'.
     * It can be used in responsive design to apply styles specifically for
     * medium phone screens.
     */
    public static readonly mediumPhoneBreakpoints: IBreakpointNameMediumPhone[] = [this.mediumPhoneBreakpoint, "mediumPhone"];

    /**
     * @constant mobileBreakpoints
     * An array representing the breakpoints for mobile devices.
     *
     * This array includes the key 'mobile' as well as keys for small phone
     * breakpoints and other mobile-related breakpoints ('xs' and 'mp').
     * It is useful for applying styles to a wider range of mobile devices.
     * 
     * @example
     * ```ts
     * console.log(mobileBreakpoints); // Outputs: ["mobile", "sp", "xs", "mp"]
     * ```
     */
    public static readonly mobileBreakpoints: IBreakpointNameMobile[] = ["mobile", ...this.smallPhoneBreakpoints, ...this.phoneBreakpoints, ...this.mediumPhoneBreakpoints];


    /**
     * @constant tabletBreakpoints
     * An array representing the breakpoints for tablet devices.
     *
     * This array includes keys for tablet devices ('tablet', 'md', and 'sm').
     * It can be used in responsive design to apply styles specifically for
     * tablet screens.
     * 
     * @example
     * ```ts
     * console.log(tabletBreakpoints); // Outputs: ["tablet", "md", "sm"]
     * ```
     */
    public static readonly tabletBreakpoints: IBreakpointNameTablet[] = ["tablet", "md", "sm"];

    /**
     * @constant desktopBreakpoints
     * An array representing the breakpoints for desktop devices.
     *
     * This array includes keys for desktop devices ('desktop', 'xl', and 'lg').
     * It is useful for applying styles specifically for larger screens.
     * 
     * @example
     * ```ts
     * console.log(desktopBreakpoints); // Outputs: ["desktop", "xl", "lg"]
     * ```
     */
    public static readonly desktopBreakpoints: IBreakpointNameDesktop[] = ["desktop", "xl", "lg"];


    /**
     * Updates the device class name on the `<body>` element based on the current media (mobile, tablet, desktop).
     * 
     * This function dynamically changes the class name of the `<body>` element to indicate the type of device
     * being used (mobile, tablet, or desktop). It also checks if the device is a touch device and applies the appropriate
     * class (`is-touch-device` or `not-touch-device`).
     * 
     * @returns {string | boolean} - Returns the applied device class name (`"mobile"`, `"tablet"`, or `"desktop"`), 
     * or `false` if the function is unable to execute (e.g., when `document` is not available).
     * 
     * @example
     * ```ts
     * const currentDeviceClass = updateDeviceClassName();
     * console.log("The body class has been updated to:", currentDeviceClass);
     * // Output could be: "The body class has been updated to: desktop"
     * ```
     * 
     * @remarks
     * - This function checks if the environment is a browser (i.e., `document` is available).
     * - It ensures the `<body>` element has the correct class representing the device type and touch capability.
     * 
     * @remarks
     * - It depends on utility functions like `isDOMElement`, `isMobileMedia`, `isTabletMedia`, `removeClassName`, and `addClassName`.
     * - If no valid `<body>` element is found, or `document` is undefined (e.g., in a non-browser environment), 
     * the function returns `false`.
     * 
     * @see isMobileMedia
     * @see isTabletMedia
     * @see Platform.isTouchDevice
     */
    public static updateDeviceClassName(): string | boolean {
        if (typeof document !== 'undefined' && document && isDOMElement(document.body)) {
            let b = document.body;
            let deviceKey = "data-device-name";
            let c = b.getAttribute(deviceKey);

            // Remove the current device class if it exists
            if (c) {
                removeClassName(b, c);
            }

            // Determine the new device class based on breakpoint columns
            let className = this.isMobileMedia() ? "mobile" : this.isTabletMedia() ? "tablet" : "desktop";
            if (this.isSmallPhoneMedia()) {
                className += "small-phone";
            } else if (this.isPhoneMedia()) {
                className += "phone";
            } else if (this.isMediumPhoneMedia()) {
                className += "medium-phone";
            }
            // Add the new device class to the body element
            addClassName(b, className);
            b.setAttribute(deviceKey, className);

            // Update touch device class
            removeClassName(b, "not-touch-device");
            removeClassName(b, "is-touch-device");
            addClassName(b, Platform.isTouchDevice() ? "is-touch-device" : "not-touch-device");
            return className; // Return the applied class name
        }
        return false; // Return false if the function cannot be executed (e.g., outside of a browser)
    };

    /***
     * Determines if the current device is either a mobile device or a tablet.
     * 
     * This function checks if the current media matches mobile breakpoints (phones and small phones) 
     * or tablet breakpoints. It returns true if the current device falls into either category, 
     * providing a convenient way to determine if the device is suitable for mobile or tablet 
     * user interfaces.
     * 
     * @returns {boolean} - Returns true if the current device is classified as either mobile or tablet; otherwise, false.
     * 
     * @example
     * ```ts
     * const isMobileOrTablet = isMobileOrTabletMedia();
     * console.log(isMobileOrTablet); // Outputs: true or false based on the current device type
     * ```
     */
    public static isMobileOrTabletMedia(): boolean {
        return this.isMobileMedia() || this.isTabletMedia();
    };

    /***
     * Determines if the current device is either a tablet or a desktop.
     * 
     * This function checks if the current media matches tablet breakpoints or desktop breakpoints. 
     * It returns true if the current device falls into either category, providing a useful way to 
     * determine if the device is suitable for tablet or desktop user interfaces.
     * 
     * @returns {boolean} - Returns true if the current device is classified as either tablet or desktop; otherwise, false.
     * 
     * @example
     * ```ts
     * const isTabletOrDesktop = isTabletOrDeskTopMedia();
     * console.log(isTabletOrDesktop); // Outputs: true or false based on the current device type
     * ```
     */
    public static isTabletOrDeskTopMedia(): boolean {
        return this.isTabletMedia() || this.isDesktopMedia();
    };

    /**
     * @function getBreakpointSizeCorners
     * Retrieves the minimum and maximum size corners from the provided breakpoint Keys.
     * 
     * @param {Array<keyof IBreakpoints>} breakpointKeys - An array of breakpoint Keys.
     * @returns {{max: number, min: number} | null} - An object containing the min and max sizes, or null if the input is invalid.
     * 
     * The function checks if the provided `breakpointKeys` array is valid and non-empty. It then iterates through each breakpoint key,
     * retrieving its associated breakpoint from the list of normalized breakpoints. If the breakpoint has valid `min` and `max`
     * properties, it updates the `min` and `max` values accordingly.
     * 
     * ### Example Usage:
     * 1. **Basic Usage**:
     *    ```typescript
     *    const breakpoint = getBreakpointSizeCorners(['sm', 'lg']);
     *    console.log(breakpoint); // Output: { min: 320, max: 768 }
     *    ```
     *    In this example, the function retrieves the min and max sizes for the 'sm' and 'lg' breakpoint.
     *
     * 2. **Handling Empty Input**:
     *    ```typescript
     *    const breakpoint = getBreakpointSizeCorners([]);
     *    console.log(breakpoint); // Output: null
     *    ```
     *    Here, an empty array is passed, resulting in a null output since no breakpoints keys were provided.
     *
     * 3. **Invalid Media Key**:
     *    ```typescript
     *    const breakpoint = getBreakpointSizeCorners(['sm', 'invalidKey']);
     *    console.log(breakpoint); // Output: { min: 320, max: 768 }
     *    ```
     *    In this case, 'invalidKey' does not exist in the breakpoint, but the function still returns valid sizes from 'small'.
     *
     * 4. **Max Size Greater Than Min**:
     *    ```typescript
     *    const breakpoint = getBreakpointSizeCorners(['xs', 'lg']);
     *    console.log(breakpoint); // Output: { min: 768, max: 1200 }
     *    ```
     *    This demonstrates that the max size can be greater than the min size, reflecting the range of available breakpoint.
     */
    public static getBreakpointSizeCorners(breakpointKeys: (keyof IBreakpoints)[]): { max: number; min: number } | null {
        // Check if the input is a valid non-empty array
        if (!Array.isArray(breakpointKeys) || !breakpointKeys.length) return null;

        let min = 0; // Initialize minimum size
        let max = 0; // Initialize maximum size

        // Iterate through the provided breakpoint keys
        breakpointKeys.map((breakpoint) => {
            // Validate the breakpoint key and ensure it exists in breakpointKeysRef
            if (!breakpoint || !this.breakpointsRef.current?.all[breakpoint] || !isObj(this.breakpointsRef.current?.all[breakpoint])) return;

            const breakpointQuery: IBreakpoint | undefined = this.breakpointsRef.current.all[breakpoint]; // Get the breakpoint query
            if (isObj(breakpointQuery) && breakpointQuery) {
                // Update the minimum size if a valid min value is found
                if (breakpointQuery.min && isNumber(breakpointQuery.min) && (min > breakpointQuery.min || min === 0)) {
                    min = breakpointQuery.min;
                }

                // Update the maximum size if a valid max value is found
                if (breakpointQuery.max && isNumber(breakpointQuery.max) && (max < breakpointQuery.max || max === 0)) {
                    max = breakpointQuery.max;
                }
            }
        });

        // Return the calculated min and max sizes
        return { min, max };
    }
    /**
     *It represents an object where each key corresponds to a media query template. This allows for
    * easy access to the appropriate media query for applying responsive styles.
     * @see {@link Breakpoints.createMediaQueries} from more
     */
    public static get mediaQueries(): Record<keyof IBreakpoints, IMediaQueryTemplate> {
        return this.breakpointsRef.current.mediaQueries;
    }
    /***
     * Returns the current breakpoint
     * @returns {IBreakpoint}
     */
    public static get currentBreakpoint(): IBreakpoint {
        return this.breakpointsRef.current.current as IBreakpoint;
    }
    /***
     * Returns all breakpoints
     * @returns {IBreakpoints}
     */
    public static get allBreakpoints(): IBreakpoints {
        return this.breakpointsRef.current.all;
    }

    /**
     * Generates a column style object for a responsive grid system.
     * 
     * The `col` method calculates and returns the styles for a column in a responsive grid layout.
     * It determines the appropriate width, padding, and visibility based on the provided breakpoint columns,
     * the current screen width, and optional configuration parameters.
     * 
     * @param {IBreakpointColumns} [breakpointCols=["col-4", "phone-12", "tablet-6", "desktop-4"]] - 
     * An array of breakpoint column definitions. Each definition specifies the number of columns (1-12) 
     * for a specific breakpoint (e.g., `col-md-4`).
     * 
     * @param {number} [windowWidth] - An optional width to calculate the column styles. If not provided, the current window width is used.
     * 
     * @param {boolean} [withMultiplicater=false] - A flag indicating whether to include the `multiplicater` value in the returned object.
     * 
     * @returns {ViewStyle & {multiplicater:number}} - An object containing the computed styles for the column, including `width`, `paddingRight`, and optional visibility styles.
     * If `withMultiplicater` is true, the `multiplicater` value is also included.
     * 
     * @example
     * ```typescript
     * // Example usage with default breakpoint columns:
     * const columnStyles = Breakpoints.col();
     * console.log(columnStyles);
     * // Output: { width: '33.33333333%', paddingRight: 14.4, currentMedia: 'md' }
     * 
     * // Example usage with custom breakpoint columns:
     * const customColumnStyles = Breakpoints.col(["col-md-6"], 500);
     * console.log(customColumnStyles);
     * // Output: { width: '50.00000000%', paddingRight: 14.4, currentMedia: 'sm' }
     * 
     * // Example usage with multiplicater:
     * const columnStylesWithMultiplicater = Breakpoints.col(["col-lg-3"], undefined, true);
     * console.log(columnStylesWithMultiplicater);
     * // Output: { width: '25.00000000%', paddingRight: 14.4, currentMedia: 'lg', multiplicater: 3 }
     * ```
     */
    public static col(breakpointCols: IBreakpointColumns = ["col-4", "phone-12", "tablet-6", "desktop-4"], windowWidth?: number, withMultiplicater?: boolean) {
        const currentMedia = Breakpoints.getCurrentMedia(windowWidth);
        const otherStyle: IStyle = {} as IStyle;
        let commonMultiplicater: number = 0;

        // Split the media query string into an array
        const split = Array.isArray(breakpointCols) && breakpointCols.length ? breakpointCols : ["col-4", "phone-12", "tablet-6", "desktop-4"];
        const opts: Partial<Record<IBreakpointName, number>> = {};

        split.map((s) => {
            if (!s || !isNonNullString(s) || !s.includes("-")) return;
            const sSplit = s.trim().split("-");
            let breakpoinName: IBreakpointName = split[0] as IBreakpointName;
            const colNumberStr = sSplit[1];
            if (!canBeNumber(colNumberStr)) {
                return;
            }
            const colNumber = parseInt(colNumberStr);
            if (isNaN(colNumber) || colNumber < 0 || colNumber > 12) {
                return;
            }
            if ((breakpoinName as any) === "col") {
                commonMultiplicater = colNumber;
            } else {
                if (breakpoinName in this.smallPhoneBreakpoints) {
                    breakpoinName = this.smallPhoneBreakpoint;
                } else if (breakpoinName in this.mediumPhoneBreakpoints) {
                    breakpoinName = this.mediumPhoneBreakpoint;
                } else if (breakpoinName in this.phoneBreakpoints) {
                    breakpoinName = this.phoneBreakpoint;
                } else if (breakpoinName in this.tabletBreakpoints) {
                    breakpoinName = currentMedia in this.tabletBreakpoints ? currentMedia : "md";
                } else if (breakpoinName in this.desktopBreakpoints) {
                    breakpoinName = currentMedia in this.desktopBreakpoints ? currentMedia : "lg";
                }
                // Determine the appropriate styles based on breakpoint columns
                if (currentMedia === breakpoinName) {
                    opts[currentMedia] = colNumber;
                    if (colNumber === 0) {
                        (otherStyle as any).display = "none";
                        (otherStyle as any).opacity = 0;
                    }
                }
            }
        });
        const multiplicater = typeof opts[currentMedia] == "number" ? opts[currentMedia] : commonMultiplicater;
        // Return the computed styles for the column
        const ret = {
            ...(otherStyle as object),
            width: (colWidth * multiplicater).toFixed(8) + '%'
        } as ViewStyle & { multiplicater: number };
        if (withMultiplicater) {
            ret.multiplicater = multiplicater;
        }
        return ret;
    }
    /***
    * @group Breakpoints
    * Returns the number of columns available in the current view.
    * This function calculates how many columns can fit based on the provided media query and width.
    * 
    * Example usage:
    * ```typescript
    * const numberOfCols = numColumns(["md-5", "xs-3", "lg-8","sm-10"]);
    * console.log(numberOfCols); // Outputs the number of columns based on the screen size.
    * ```
    * 
    * @param {IBreakpointColumns} breakpointCols - The breakpoint columns to use for the column calculation (optional).
    * 
    * @param {number} width - The size of the window (optional). If not provided, the current window size is used.
    * 
    * @returns {number} The number of columns currently available in the view, ensuring a minimum of 1 column.
    */
    public static numColumns(breakpointCols?: IBreakpointColumns, width?: number) {
        const { multiplicater } = this.col(breakpointCols, width, true);
        let numColumns = 1;
        if (multiplicater && multiplicater > 0) {
            numColumns = Math.trunc(12 / multiplicater);
        }
        return Math.max(numColumns, 1);
    }
    /**
     * Converts provided width percentage to independent pixel (dp).
     * @param  {string} widthPercent The percentage of screen's width that UI element should cover
     *                               along with the percentage symbol (%).
     * @return {number}              The calculated dp depending on current device's screen width.
     */
    static widthPercent(widthPercent: number | string) {
        // Parse string percentage input and convert it to number.
        const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent) || 0;
        let width = Dimensions.get("window").width;
        if (this.isDesktopMedia()) {
            width = width / 3;
        } else if (this.isTabletMedia()) {
            width = width / 2;
        }
        // Use PixelRatio.roundToNearestPixel method in order to round the layout
        // size (dp) to the nearest one that correspons to an integer number of pixels.
        return this.roundToNearestPixel(width * elemWidth / 100);
    };

    /**
     * Converts provided height percentage to independent pixel (dp).
     * @param  {string} heightPercent The percentage of screen's height that UI element should cover
     *                                along with the percentage symbol (%).
     * @return {number}               The calculated dp depending on current device's screen height.
     */
    static heightPercent(heightPercent: string | number) {
        // Parse string percentage input and convert it to number.
        const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
        let height = Dimensions.get("window").height;
        if (height > 600 && height < 1000) {
            height = height / 2;
        } else if (height > 1000) {
            height = height / 3;
        }
        // Use PixelRatio.roundToNearestPixel method in order to round the layout
        // size (dp) to the nearest one that correspons to an integer number of pixels.
        return this.roundToNearestPixel(height * elemHeight / 100);
    };
    /**
     * Rounds a number to the nearest pixel while maintaining consistent behavior across platforms.
     * 
     * @param size - The size in logical pixels to be rounded
     * @param config - Optional configuration object to customize the behavior
     * @returns {number}, the rounded value
     * 
     * @example
     * ```typescript
     * // Basic usage
     * const result = roundToNearestPixel(16.7);
     * console.log(result.value); // Rounded pixel value
     * ```
     * @remarks
     * This function handles the disparity between web and native environments by normalizing
     * the pixel ratio calculations. On web, it caps the maximum pixel ratio to avoid
     * excessive scaling that can occur with high-DPI displays.
     */
    static roundToNearestPixel = (size: number) => {
        size = typeof size === "number" ? size : 0;
        // Check if we're running on web
        if (Platform.isWeb()) {
            // For web, we need to account for the difference in pixel density
            // Typical mobile devices have pixel ratios of 2-3, while web often reports much higher
            // We'll normalize it to be closer to mobile values
            const normalizedRatio = Math.min(isNumber(window.devicePixelRatio) ? window.devicePixelRatio : 3, PixelRatio.get(), 3);
            return Math.round(size * normalizedRatio) / normalizedRatio;
        }
        return PixelRatio.roundToNearestPixel(size);
    }

    /**
     * Retrieves a comprehensive list of all breakpoint names, including custom aliases.
     * 
     * The `allBreakpointsNames` method returns an array of all defined breakpoint names
     * from the `Breakpoints.allBreakpoints` object, along with additional aliases such as
     * `"tablet"`, `"desktop"`, `"mobile"`, `"phone"`, `"mediumPhone"`, and `"smallPhone"`.
     * 
     * This method is useful for obtaining a complete list of breakpoints and their aliases
     * for responsive design purposes.
     * 
     * @returns {IBreakpointName[]} - An array of all breakpoint names and aliases.
     * 
     * @example
     * ```typescript
     * // Example usage:
     * const breakpointNames = Breakpoints.allBreakpointsNames();
     * console.log(breakpointNames);
     * // Output: ["sp", "mp", "xs", "sm", "md", "lg", "xl", "tablet", "desktop", "mobile", "phone", "mediumPhone", "smallPhone"]
     * ```
     * 
     * @remarks
     * - The method combines the keys of the `Breakpoints.allBreakpoints` object with additional
     *   aliases to provide a comprehensive list of breakpoint names.
     * - This list can be used for validation, configuration, or debugging purposes in responsive
     *   design systems.
     * 
     * @see {@link Breakpoints.allBreakpoints} for the source of the breakpoint keys.
     */
    static get allBreakpointsNames(): IBreakpointName[] {
        return [...Object.keys(Breakpoints.allBreakpoints) as any as IBreakpointName[], "tablet", "desktop", "mobile", "phone", "mediumPhone", "smallPhone"];
    }
    /**
     * Retrieves the gutter size for the current or specified breakpoint.
     * 
     * The `getGutter` method calculates the gutter (spacing) value for the current breakpoint
     * based on the window width or an optionally provided width. The gutter value is defined
     * in the `Breakpoints.allBreakpoints` object for each breakpoint.
     * 
     * @param {number} [windowWidth] - An optional width to determine the active breakpoint. 
     * If not provided, the current window width is used.
     * 
     * @returns {number} - The gutter size in pixels for the active breakpoint. Returns `0` if no gutter is defined.
     * 
     * @example
     * ```typescript
     * // Example usage with the current window width:
     * const gutter = Breakpoints.getGutter();
     * console.log(gutter); // Output: 6 (for example, if the current breakpoint is "sm")
     * 
     * // Example usage with a custom width:
     * const customGutter = Breakpoints.getGutter(500);
     * console.log(customGutter); // Output: 5 (for example, if the width corresponds to the "xs" breakpoint)
     * ```
     * 
     * @remarks
     * - The method uses the `Breakpoints.getCurrentMedia` function to determine the active breakpoint.
     * - If the active breakpoint has a defined `gutter` value, it is returned. Otherwise, the method returns `0`.
     * - This method is useful for dynamically adjusting spacing in responsive layouts.
     * 
     * @see {@link Breakpoints.getCurrentMedia} for determining the active breakpoint.
     * @see {@link Breakpoints.allBreakpoints} for the definition of breakpoints and their gutter values.
     */
    static getGutter(windowWidth?: number) {
        const media = Breakpoints.getCurrentMedia(windowWidth);
        const all = Breakpoints.allBreakpoints;
        if (isObj(all) && all[media]) {
            return isNumber(all[media]?.gutter) ? all[media].gutter : 0;
        }
        return 0;
    }
}

// Given a breakpointsRef.current object, will create a "max" breakpoint
// going from the largest breakpoint's max value to infinity
const addMaxBreakpoint = function (breakpoints: INormalizedBreakpoints, maxWidths: number[]) {
    if (!maxWidths || maxWidths.length === 0) {
        return;
    }
    const largestBreakpoint = maxWidths[maxWidths.length - 1];
    if (!isNumeric(largestBreakpoint)) return;
    breakpoints.max = {
        min: largestBreakpoint + 1,
        max: Infinity
    };
};



const canBeNumber = function isNumeric(value: any): boolean {
    if (typeof value !== "string") return false;
    return /^-?\d+$/.test(value);
}


let colWidth = 100 / 12;



const MIN_WIDTH = 200;

const getWidth = (windowWidth?: number) => {
    const _width = Dimensions.get("window").width;
    if (typeof windowWidth == 'number' && windowWidth > MIN_WIDTH && windowWidth < (_width - 10)) {
        return windowWidth;
    }
    return _width;
}