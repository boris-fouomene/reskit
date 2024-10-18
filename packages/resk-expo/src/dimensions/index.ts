import { Dimensions, ScaledSize } from 'react-native';
import { useEffect, useState } from "react";
import { IDimensions } from './types';
import Breakpoints from '../breakpoints';
import _, { add } from "lodash";
import { IObservable, isObj, isObservable, observable } from '@resk/core';



/***
 * Returns the device dimensions properties for calculating new dimensions 
 * when the screen size changes.
 * 
 * This function retrieves the current dimensions of the device's window and 
 * calculates several properties related to the device's media type. It helps in 
 * responsive design by providing information about whether the device is a mobile, 
 * tablet, or desktop, as well as its orientation (portrait or landscape).
 * 
 * @returns {IDimensions} - An object containing various properties about 
 * the device dimensions and media type, including:
 * - `currentMedia`: The current media type based on the defined breakpoints.
 * - `isMobile`: A boolean indicating if the device is classified as mobile.
 * - `isTablet`: A boolean indicating if the device is classified as a tablet.
 * - `isDesktop`: A boolean indicating if the device is classified as desktop.
 * - `isMobileOrTablet`: A boolean indicating if the device is either mobile or tablet.
 * - `isTabletOrDeskTop`: A boolean indicating if the device is either tablet or desktop.
 * - `isPhone`: A boolean indicating if the device is classified as a phone.
 * - `isSmallPhone`: A boolean indicating if the device is classified as a small phone.
 * - `window`: An object representing the dimensions of the window.
 * - `screen`: An object representing the dimensions of the screen.
 * - `isPortrait`: A boolean indicating if the device is in portrait orientation.
 * - `isLandscape`: A boolean indicating if the device is in landscape orientation.
 * 
 * @example
 * ```ts
 * const dimensionsProps = getDimensions();
 * console.log(dimensionsProps.isMobile); // Outputs: true or false based on the device type
 * console.log(dimensionsProps.isPortrait); // Outputs: true if in portrait mode
 * ```
 */
const getDimensions = (): IDimensions => {
	const screen = Dimensions.get("window");
	return {
		currentMedia: Breakpoints.getCurrentMedia(),
		isMobile: Breakpoints.isMobileMedia(),
		isTablet: Breakpoints.isTabletMedia(),
		isDesktop: Breakpoints.isDesktopMedia(),
		isMobileOrTablet: Breakpoints.isMobileOrTabletMedia(),
		isTabletOrDeskTop: Breakpoints.isTabletOrDeskTopMedia(),
		isPhone: Breakpoints.isPhoneMedia(),
		isSmallPhone: Breakpoints.isSmallPhoneMedia(),
		...screen,
		window: Dimensions.get("window"),
		screen: Dimensions.get("screen"),
		isPortrait: screen.height >= screen.width,
		isLandscape: screen.width >= screen.height,
	};
};

const events: IObservable = {} as IObservable;
if (!isObservable(events)) {
	observable(events);
	Breakpoints.init();
	let mediaTimer: any = null;
	const updateMedia = () => {
		clearTimeout(mediaTimer);
		events.trigger(RESIZE_PAGE, getDimensions());
		Breakpoints.update();
	}
	Dimensions.addEventListener('change', (e) => {
		Breakpoints.update();
		clearTimeout(mediaTimer);
		mediaTimer = setTimeout(updateMedia, 150);
	});
}

const RESIZE_PAGE = "RESIZE_PAGE";


/***
 * A custom hook that retrieves the page dimensions and updates them 
 * when the window is resized.
 * 
 * This hook listens for resize events on the window and updates the 
 * dimensions state accordingly. If the `responsive` parameter is set to 
 * `false`, it will not listen for resize events, which can be useful 
 * in scenarios where responsive behavior is not desired.
 * 
 * @param {boolean} responsive - A flag indicating whether to listen for 
 * resize events. Defaults to `true`. If set to `false`, the hook will not 
 * subscribe to the resize event listener.
 * 
 * @returns {IDimensions} - An object representing the current dimensions 
 * of the window, including properties such as width and height.
 * 
 * @example
 * ```ts
 * const dimensions = useDimensions();
 * console.log(dimensions.width); // Outputs the current width of the window
 * ```
 */
const useDimensions = (responsive: boolean = true): IDimensions => {
	const [dimensions, setDimensions] = useState(getDimensions());
	responsive = typeof responsive == "boolean" ? responsive : true;
	useEffect(() => {
		const bind = responsive ? events.on(RESIZE_PAGE, () => {
			setDimensions(getDimensions());
		}) : null;
		return () => {
			bind?.remove();
		}
	}, [responsive]);
	return dimensions;
};




/***
 * Attaches a listener to monitor changes in screen dimensions in a responsive manner.
 * 
 * This function allows you to attach a listener to the `Dimensions` event for screen size changes 
 * and provides a debounced callback to update properties (such as styles) automatically.
 * 
 * When the screen size changes, the provided callback function is triggered with the updated 
 * dimensions, allowing for dynamic adjustments to UI properties.
 * 
 * @param {function} callback - The function that will be executed whenever the screen size changes.
 * It receives the updated dimensions (`IDimensions`) as an argument.
 * 
 * @param {number} [timeout=200] - The debounce timeout in milliseconds before invoking the callback 
 * after the screen size changes. Defaults to `200ms`.
 * 
 * @returns {object | null} - Returns an object with a `remove` function to remove the listener 
 * when the component is unmounted, or `null` if the `callback` is not a valid function.
 * 
 * @example
 * ```ts
 * const updateStyles = (dimensions) => {
 *   console.log("New screen dimensions:", dimensions);
 * };
 * 
 * const listener = addListener(updateStyles, 300);
 * 
 * // To remove the listener when necessary
 * listener?.remove();
 * ```
 */
const addListener = (callback: (dimensions: IDimensions) => any, timeout: number = 200) => {
	if (typeof callback !== 'function') return null;
	timeout = typeof timeout === 'number' ? timeout : 200;
	return Dimensions.addEventListener("change", _.debounce(() => {
		return callback(getDimensions());
	}, timeout));
};

export default { addListener, getDimensions, useDimensions };
