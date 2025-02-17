import { IBreakpoints } from "@src/breakpoints/types";
import { ScaledSize } from "react-native";

/**
 * @interface IDimensions
 * Defines the properties related to the dimensions of the device screen.
 *
 * The `IDimensions` interface extends `ScaledSize` and adds additional properties
 * to provide comprehensive information about the current media type and the device's 
 * characteristics, such as whether it is a mobile phone, tablet, or desktop.
 *
 * This interface is crucial for implementing responsive designs and adapting the UI
 * based on the user's device capabilities and orientation.
 */
export interface IDimensions extends ScaledSize {
    /** 
     * @type currentMedia
     * The current media type based on defined breakpoints.
     * This property can hold the key corresponding to the active media type (e.g., 'sp', 'md', 'lg') 
     * or be an empty string if no breakpoint matches.
     */
    currentMedia?: keyof IBreakpoints | '';

    /**
     * @type isMobile
     * Indicates if the device is a mobile device. 
     * A mobile device typically refers to a device with a screen size smaller than a tablet.
     * It's a combination of the `small phone, phone and mediumPhone` properties.
     * Returns `true` if the device is classified as mobile based on the breakpoints.
     */
    isMobile: boolean;

    /**
     * @type isTablet
     * Indicates if the device is a tablet.
     * Returns `true` if the device is classified as a tablet based on the breakpoints.
     */
    isTablet: boolean;

    /** 
     * @type isDesktop
     * Indicates if the device is a desktop. 
     * Returns `true` if the device is classified as desktop based on the breakpoints.
     */
    isDesktop: boolean;

    /** 
     * @type isMobileOrTablet
     * Indicates if the device is either a mobile device or a tablet. 
     * Returns `true` if the device is classified as either.
     */
    isMobileOrTablet: boolean;

    /** 
     * @type isTabletOrDesktop
     * Indicates if the device is either a tablet or a desktop.
     * Returns `true` if the device falls into either category.
     */
    isTabletOrDeskTop: boolean;

    /** 
     * @type isPhone
     * Indicates if the device is a phone. 
     * Returns `true` if the device is classified as a phone based on the breakpoints.
     */
    isPhone: boolean;

    /** 
     * @type isSmallPhone
     * Indicates if the device is a small phone.
     * Returns `true` if the device is classified as a small phone based on the breakpoints.
     */
    isSmallPhone: boolean;


    /** 
     * @type isMediumPhone
     * Indicates if the device is a medium phone.
     * Returns `true` if the device is classified as a medium phone based on the breakpoints.
     */
    isMediumPhone: boolean;

    /** 
     * @type isMediumPhone
     * The screen dimensions of the device as a `ScaledSize` object,
     * which includes width and height values.
     */
    screen: ScaledSize;

    /** 
     * @type window
     * The window dimensions of the device as a `ScaledSize` object,
     * which includes width and height values.
     */
    window: ScaledSize;

    /** 
     * @type isPortrait
     * Indicates if the device is in portrait mode. 
     * Returns `true` if the height is greater than the width.
     */
    isPortrait: boolean;

    /** 
     * @type isLandscape
     * Indicates if the device is in landscape mode. 
     * Returns `true` if the width is greater than the height.
     */
    isLandscape: boolean;
}

