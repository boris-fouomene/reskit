import { Dimensions } from "react-native";
import { IBreakpoints, IBreakpoint, INormalizedBreakpoints, IMediaQueryTemplate } from "./types";
import { addClassName, isDOMElement, isObj, Platform, removeClassName } from "@resk/core";
import { isNumber } from "lodash";

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
 * // Creating media queries from defined breakpoints
 * const breakpoints: IBreakpoints = {
 *   sp: { max: 320 },
 *   md: { min: 1024 },
 * };
 * 
 * const mediaQueries = createMediaQueries(breakpoints);
 * console.log(mediaQueries.sp); // Output: '@media (max-width: 320px)'
 * console.log(mediaQueries.md); // Output: '@media (min-width: 1024px)'
 */
const createMediaQueries = (breakpoints: IBreakpoints): Record<string, IMediaQueryTemplate> => {
    const mediaQueries: Record<string, IMediaQueryTemplate> = {};
    // Loop through each breakpoint and generate corresponding media query strings
    for (const key in breakpoints) {
        const breakpoint = breakpoints[key as keyof IBreakpoints];
        if (isObj(breakpoint) && breakpoint) {
            // Generate media query for min-width if defined
            if (breakpoint.min !== undefined) {
                mediaQueries[key] = `@media (min-width: ${breakpoint.min}px)`;
            }
            // Generate media query for max-width if defined
            if (breakpoint.max !== undefined) {
                mediaQueries[key] = `@media (max-width: ${breakpoint.max}px)`;
            }
            // Generate combined media query for both min and max widths
            if (breakpoint.min !== undefined && breakpoint.max !== undefined) {
                mediaQueries[key] = `@media (min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px)`;
            }
        }
    }
    return mediaQueries; // Return the generated media queries
};

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

const defaultBreakpoints: IBreakpoints = {
    sp: {
        max: 320,  // Small phone breakpoint (320px and below)
        name: 'sp',
        label: "Small phone",
    },
    mp: {
        max: 399,  // Medium phone breakpoint (399px and below)
        name: 'mp',
        label: "Medium phone",
    },
    xs: {
        max: 575,  // Small devices (landscape phones, 576px and up)
        name: 'xs',
        label: "Small devices (landscape phones, 576px and up)",
    },
    sm: {
        max: 767,  // Medium devices (tablets, 768px and up)
        name: 'sm',
        label: "Medium devices (tablets, 768px and up)",
    },
    md: {
        max: 1024,  // Medium devices (laptops, 1024px and up)
        name: 'md',
        label: "medium devices (laptops, 1024px and up)",
    },
    lg: {
        max: 1199,  // Large devices (large desktops, 1200px and up)
        name: 'lg',
        label: "large devices (large desktops, 1200px and up)",
    },
    xl: {
        max: Infinity,  // Extra large devices (large desktops and beyond)
        name: 'xl',
        label: "Extra large devices (large desktops)",
    },
};
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
const breakpointsRef: { current: INormalizedBreakpoints & { medias: Record<string, IMediaQueryTemplate> } } = {
    current: {
        all: defaultBreakpoints,
        medias: createMediaQueries(defaultBreakpoints)
    }
};

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
const normalize = function (breakpoints?: IBreakpoints): INormalizedBreakpoints {
    // Merge the incoming breakpoints with the current normalized breakpoints reference
    const all: IBreakpoints = Object.assign({}, breakpointsRef.current.all, breakpoints);
    breakpointsRef.current = {
        ...breakpointsRef.current,
        all,
        medias: createMediaQueries(all)
    };
    // Normalize the breakpoints object
    const maxWidths = setMaxWidths(breakpointsRef.current.all); // Calculate max widths for each breakpoint
    setMinWidths(breakpointsRef.current.all, maxWidths);        // Set min widths based on the next largest breakpoint
    addMaxBreakpoint(breakpointsRef.current, maxWidths);        // Add a max breakpoint for the largest screens
    return breakpointsRef.current;
};


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
const update = function (opts?: { width?: number }): string | null {
    updateDeviceClassName();
    const width = isNumeric(opts?.width) ? opts?.width : Dimensions.get('window').width; // Get the window width
    if (!width) {
        return null; // Return null if no valid width is provided
    }
    const _breakpoints = breakpointsRef.current.all; // Access the defined breakpoints
    for (let name in _breakpoints) {
        const breakpoint = _breakpoints[name as keyof IBreakpoints]; // Get the current breakpoint
        if (!breakpoint || !breakpoint?.max || !breakpoint?.min) continue; // Skip if invalid

        // Check if the width is within the breakpoint's min and max range
        if (width <= breakpoint.max && width >= breakpoint.min) {
            breakpointsRef.current.current = breakpoint; // Update the current breakpoint
            return name; // Return the name of the current breakpoint
        }
    }
    return null; // Return null if no active breakpoint is found
};



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
function init(breakpoints?: IBreakpoints) {
    const width = Dimensions.get('window').width; // Get the current window width
    normalize(breakpoints); // Normalize the provided breakpoints

    // Iterate through all defined breakpoints to find the current active one
    for (let name in breakpointsRef.current.all) {
        const breakpoint = breakpointsRef.current.all[name as keyof IBreakpoints]; // Get the current breakpoint
        if (!(breakpoint) || !breakpoint?.max || !breakpoint?.min) continue; // Skip if invalid

        // Check if the width falls within the breakpoint's min and max range
        if (width <= breakpoint.max && width >= breakpoint.min) {
            breakpointsRef.current.current = breakpoint; // Set the current breakpoint
            break; // Exit the loop once the active breakpoint is found
        }
    }
    updateDeviceClassName();
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
const getCurrentMedia = (width?: number): keyof IBreakpoints | '' => {
    // If width is valid and greater than 300, use it; otherwise, get the current window width
    width = width && width > 300 ? width : Dimensions.get("window").width;
    // Iterate through defined breakpoints to find the current media type
    for (let i in breakpointsRef.current.all) {
        const breakpoint = breakpointsRef.current.all[i as keyof IBreakpoints];
        if (!breakpoint || !breakpoint?.max || !breakpoint?.min) continue;
        // Return the key of the first matching media type based on the width
        if (width <= breakpoint.max) return i as keyof IBreakpoints;
    }
    // Return the name of the current breakpoint or an empty string if none found
    return breakpointsRef.current.current?.name || "";
}

const getCurrentBreakpoint = (): IBreakpoint => {
    return breakpointsRef.current.current as IBreakpoint;
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
const isMediaDevice = (alias: string | string[]): boolean => {
    const currentBreakpoint = getCurrentBreakpoint();
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
const isPhoneMedia = (): boolean => {
    return isMediaDevice(phoneBreakpoints);
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
 * const isSmallPhone = isSmallPhoneMedia();
 * console.log(isSmallPhone); // Outputs: true or false based on the current breakpoint
 * ```
 */
const isSmallPhoneMedia = (): boolean => {
    return isMediaDevice(smallPhoneBreakpoints);
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
const isMobileMedia = (): boolean => {
    return isMediaDevice(mobileBreakpoints) || isMediaDevice(smallPhoneBreakpoints);
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
const isTabletMedia = (): boolean => {
    return isMediaDevice(tabletBreakpoints);
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
const isDesktopMedia = (): boolean => {
    return isMediaDevice(desktopBreakpoints);
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
const isPortrait = (): boolean => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
}


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
const smallPhoneBreakpoints = ["sp"];

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
const mobileBreakpoints = ["mobile", ...smallPhoneBreakpoints, "xs", "mp"];

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
const phoneBreakpoints = mobileBreakpoints;

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
const tabletBreakpoints = ["tablet", "md", "sm"];

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
const desktopBreakpoints = ["desktop", "xl", "lg"];


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
 * @note
 * - It depends on utility functions like `isDOMElement`, `isMobileMedia`, `isTabletMedia`, `removeClassName`, and `addClassName`.
 * - If no valid `<body>` element is found, or `document` is undefined (e.g., in a non-browser environment), 
 * the function returns `false`.
 * 
 * @see isMobileMedia
 * @see isTabletMedia
 * @see Platform.isTouchDevice
 */
const updateDeviceClassName = (): string | boolean => {
    if (typeof document !== 'undefined' && document && isDOMElement(document.body)) {
        let b = document.body;
        let deviceKey = "data-device-name";
        let c = b.getAttribute(deviceKey);

        // Remove the current device class if it exists
        if (c) {
            removeClassName(b, c);
        }

        // Determine the new device class based on media queries
        let className = isMobileMedia() ? "mobile" : isTabletMedia() ? "tablet" : "desktop";

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
const isMobileOrTabletMedia = (): boolean => {
    return isMobileMedia() || isTabletMedia();
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
const isTabletOrDeskTopMedia = (): boolean => {
    return isTabletMedia() || isDesktopMedia();
};

/**
 * @function getMediaSizeCorners
 * Retrieves the minimum and maximum size corners from the provided media breakpoints.
 * 
 * @param {Array<keyof IBreakpoints>} medias - An array of media breakpoint keys.
 * @returns {{max: number, min: number} | null} - An object containing the min and max sizes, or null if the input is invalid.
 * 
 * The function checks if the provided `medias` array is valid and non-empty. It then iterates through each media key,
 * retrieving its associated breakpoint from the list of normalized breakpoints. If the breakpoint has valid `min` and `max`
 * properties, it updates the `min` and `max` values accordingly.
 * 
 * ### Example Usage:
 * 1. **Basic Usage**:
 *    ```typescript
 *    const breakpoints = getMediaSizeCorners(['sm', 'lg']);
 *    console.log(breakpoints); // Output: { min: 320, max: 768 }
 *    ```
 *    In this example, the function retrieves the min and max sizes for the 'sm' and 'lg' breakpoints.
 *
 * 2. **Handling Empty Input**:
 *    ```typescript
 *    const breakpoints = getMediaSizeCorners([]);
 *    console.log(breakpoints); // Output: null
 *    ```
 *    Here, an empty array is passed, resulting in a null output since no breakpoints were provided.
 *
 * 3. **Invalid Media Key**:
 *    ```typescript
 *    const breakpoints = getMediaSizeCorners(['sm', 'invalidKey']);
 *    console.log(breakpoints); // Output: { min: 320, max: 768 }
 *    ```
 *    In this case, 'invalidKey' does not exist in the breakpoints, but the function still returns valid sizes from 'small'.
 *
 * 4. **Max Size Greater Than Min**:
 *    ```typescript
 *    const breakpoints = getMediaSizeCorners(['xs', 'lg']);
 *    console.log(breakpoints); // Output: { min: 768, max: 1200 }
 *    ```
 *    This demonstrates that the max size can be greater than the min size, reflecting the range of available breakpoints.
 */
export const getMediaSizeCorners = (medias: (keyof IBreakpoints)[]): { max: number; min: number } | null => {
    // Check if the input is a valid non-empty array
    if (!Array.isArray(medias) || !medias.length) return null;

    let min = 0; // Initialize minimum size
    let max = 0; // Initialize maximum size

    // Iterate through the provided media keys
    medias.map((media) => {
        // Validate the media key and ensure it exists in breakpointsRef
        if (!media || !breakpointsRef.current?.all[media] || !isObj(breakpointsRef.current?.all[media])) return;

        const mediaQuery: IBreakpoint = breakpointsRef.current.all[media]; // Get the media query

        // Update the minimum size if a valid min value is found
        if (mediaQuery.min && isNumber(mediaQuery.min) && (min > mediaQuery.min || min === 0)) {
            min = mediaQuery.min;
        }

        // Update the maximum size if a valid max value is found
        if (mediaQuery.max && isNumber(mediaQuery.max) && (max < mediaQuery.max || max === 0)) {
            max = mediaQuery.max;
        }
    });

    // Return the calculated min and max sizes
    return { min, max };
};
export default {
    getCurrentMedia,
    init,
    normalize,
    smallPhoneBreakpoints,
    mobileBreakpoints,
    phoneBreakpoints,
    tabletBreakpoints,
    desktopBreakpoints,
    isMediaDevice,
    update,
    isPhoneMedia,
    isSmallPhoneMedia,
    isMobileMedia,
    isTabletMedia,
    isDesktopMedia,
    isPortrait,
    createMediaQueries,
    isMobileOrTabletMedia,
    isTabletOrDeskTopMedia,
    getMediaSizeCorners,
    /**
     *It represents an object where each key corresponds to a media query template. This allows for
    * easy access to the appropriate media query for applying responsive styles.
     * 
     */
    get medias(): Record<string, IMediaQueryTemplate> {
        return breakpointsRef.current.medias;
    }
}