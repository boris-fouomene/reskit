import { Dimensions } from 'react-native';
import React, { useEffect, useState } from "react";
import { IDimensions } from './types';
import Breakpoints from '../breakpoints';
import _ from "lodash";
import { IObservable, isNonNullString, isObj, isObservable, observable } from '@resk/core';
import useStableMemo from "@utils/useStableMemo";
import { IReactComponent, IStyle } from "../types";
import { StyleSheet } from "react-native";
import { IBreakpoints } from '@src/breakpoints/types';



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
export const useDimensions = (responsive: boolean = true): IDimensions => {
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


// Defines the structure for style properties and media queries
type IStyleProps = {
	style?: IStyle; // The base style to apply
	mediaQueryStyle?: (dimensions: IDimensions) => IStyle | (Record<keyof IBreakpoints | 'mobile' | 'phone' | 'tablet' | 'desktop', IStyle>);
};

/**
 * @interface IWithResponsiveStyle
 * Type definition for a component's props that includes responsive styling capabilities.
 * 
 * This type extends the base props `T` by omitting any properties that are already defined in 
 * the `IStyleProps` interface, while also ensuring that the component has all the properties 
 * defined in `IStyleProps`. This allows for a clean integration of responsive styles 
 * without conflicting with existing props.
 * 
 * @template T - The base props type that extends `IStyleProps`. Defaults to `any`.
 * 
 * ### Key Features:
 * - **Omitted Properties**: By using `Omit<T, keyof IStyleProps>`, any properties from `T` that 
 *   overlap with `IStyleProps` are removed, preventing prop collisions.
 * - **Responsive Style Properties**: The resulting type includes all properties from `IStyleProps`, 
 *   ensuring that any component using this type will have access to responsive styling features.
 * 
 * ### Usage Example:
 * This type is typically used in conjunction with higher-order components (HOCs) 
 * or styled components to define props that require responsive styling.
 * 
 * ```typescript
 * interface IStyleProps {
 *   style?: React.CSSProperties; // Base style prop
 *   mediaQueryStyle?: (dimensions: IDimensionsProps) => React.CSSProperties; // Function for responsive styles
 * }
 * 
 * // Define a component's props using IWithResponsiveStyle
 * interface IMyComponentProps extends IWithResponsiveStyle<React.HTMLProps<HTMLDivElement>> {
 *   title: string; // Additional prop
 * }
 * 
 * const MyComponent: React.FC<IMyComponentProps> = ({ title, style, mediaQueryStyle }) => {
 *   const responsiveStyle = mediaQueryStyle ? mediaQueryStyle(getDeviceDimensions()) : {};
 *   return <div style={{ ...style, ...responsiveStyle }}>{title}</div>;
 * };
 * ```
 */
export type IWithResponsiveStyle<T extends IStyleProps = any> =
	Omit<T, keyof IStyleProps> & IStyleProps;
/**
 * @function useMediaQueryStyle
 * A custom hook that applies responsive styles based on media queries.
 * 
 * @param {IWithResponsiveStyle<T>} props - The properties including base style and media queries.
 * @returns {IStyle} - The computed style that combines the base style with the applicable media query styles.
 * 
 * ### Example Usage:
 * 1. **Basic Usage**:
 *    ```typescript
 *    const styles = useMediaQueryStyle({
 *        style: { color: 'black', fontSize: 16 },
 *        mediaQueryStyle: (dimensions) => ({
 *            fontSize: dimensions.isMobile ? 14 : 18,
 *        }),
 *    });
 *    ```
 *    This example applies a base style and adjusts the font size based on whether the device is mobile.
 * 
 * 2. **Using Object for Media Queries**:
 *    ```typescript
 *    const styles = useMediaQueryStyle({
 *        style: { color: 'black' },
 *        mediaQueryStyle: {
 *            mobile: { fontSize: 14 },
 *            tablet: { fontSize: 16 },
 *            desktop: { fontSize: 18 },
 *        },
 *    });
 *    ```
 *    Here, different styles are applied based on the current media type, allowing for more granular control.
 */
export function useMediaQueryStyle<T extends IStyleProps = any>({ style, mediaQueryStyle }: IWithResponsiveStyle<T>): IStyle {
	const dimensions = useDimensions(!!mediaQueryStyle); // Hook to get current dimensions
	const currentMedia = Breakpoints.getCurrentMedia(); // Get the current media type
	// Use stable memoization to optimize performance
	return useStableMemo(() => {
		if (!mediaQueryStyle) return StyleSheet.flatten([style]); // Return base style if no media queries are defined
		const dimensions = getDimensions(); // Get current dimensions
		// If mediaQueryStyle is a function, call it with dimensions
		if (typeof mediaQueryStyle === "function") {
			return StyleSheet.flatten([style, mediaQueryStyle(dimensions)]);
		}
		// If mediaQueryStyle is an object, check for applicable styles
		if (isObj(mediaQueryStyle)) {
			if (mediaQueryStyle[currentMedia]) {
				return StyleSheet.flatten([style, mediaQueryStyle[currentMedia]]);
			}
			const mQueries: Record<keyof IBreakpoints | 'mobile' | 'phone' | 'tablet' | 'desktop', IStyle> = mediaQueryStyle;
			// Determine which style key to apply based on device type
			const { isMobile, isDesktop, isPhone, isTablet } = dimensions;
			const styleKey = isPhone && "phone" in mQueries ? "phone" :
				isMobile && "mobile" in mQueries ? "mobile" :
					isTablet && "tablet" in mQueries ? "tablet" :
						isDesktop && "desktop" in mQueries ? "desktop" :
							undefined;

			if (styleKey) return StyleSheet.flatten([style, mQueries[styleKey]]);
			return StyleSheet.flatten([style]);
		}
		return StyleSheet.flatten([style]); // Default to base style
	}, [mediaQueryStyle, currentMedia, dimensions.window, dimensions.screen, style]);
}


/**
 *
 * A Higher-Order Component (HOC) that enhances a wrapped component with responsive styles.
 * This HOC utilizes media queries to dynamically adjust styles based on the current viewport size,
 * making it ideal for responsive design in React Native applications.
 * 
 * @param {IReactComponent<IProps, IState>} Component - The React component to be enhanced with responsive styles.
 * @param {string} [displayName] - An optional custom display name for the wrapped component, useful for debugging.
 * @returns {React.ForwardRefExoticComponent<React.PropsWithoutRef<IProps> & React.RefAttributes<any>>} - A functional component that renders the wrapped component with responsive styles.
 * 
 * ### Key Features:
 * - **Responsive Styling**: Automatically applies styles that adapt to different screen sizes and orientations.
 * - **Flexible Component Types**: Can wrap both functional and class components, providing versatility.
 * - **Custom Display Name**: Allows for setting a custom display name, aiding in debugging and inspection in React DevTools.
 * 
 * ### Example Usage:
 * 
 * 1. **Basic Usage**:
 *    Wrap a functional component to provide it with responsive styles:
 *    ```typescript
 *    const MyComponent: React.FC<IStyleProps> = ({ style }) => (
 *        <View style={style}>
 *            <Text>Hello, World!</Text>
 *        </View>
 *    );
 *    
 *    const StyledComponent = withResponsiveStyle(MyComponent);
 *    ```
 *    In this example, `MyComponent` is enhanced to receive responsive styles based on the current media queries.
 * 
 * 2. **Using with a Class Component**:
 *    Wrap a class component to enable responsive styling:
 *    ```typescript
 *    class MyClassComponent extends React.Component<IStyleProps,MyComponentState> {
 *        render() {
 *            return (
 *                <View style={this.props.style}>
 *                    <Text>Hello from Class Component!</Text>
 *                </View>
 *            );
 *        }
 *    }
 *    
 *    const EnhancedClassComponent = withResponsiveStyle(MyClassComponent);
 *    ```
 *    Here, `MyClassComponent` is wrapped with the HOC, allowing it to receive responsive styles just like a functional component.
 * 
 * 3. **Custom Display Name**:
 *    Provide a custom display name for easier debugging:
 *    ```typescript
 *    const StyledComponent = withResponsiveStyle(MyComponent, 'CustomStyledComponent');
 *    ```
 *    This custom display name will appear in React DevTools, making it easier to identify the component.
 */
export function withResponsiveStyle<IProps extends IStyleProps = any, IState = any>(Component: IReactComponent<IProps, IState>, displayName?: string) {
	// Define a functional component that wraps the provided component
	const fn = React.forwardRef<any, IWithResponsiveStyle<IProps>>((props, ref): React.ReactNode => {
		const style = useMediaQueryStyle(props); // Get responsive styles using the custom hook
		const { mediaQueryStyle, ...rest } = props;
		return <Component ref={ref} {...rest as IProps} style={style} />; // Render the wrapped component with props and responsive styles
	});
	// Set a display name for the wrapped component for better debugging
	if (isNonNullString(Component?.displayName)) {
		fn.displayName = Component.displayName + "_WithResponsiveStyle"; // Append suffix to original display name
	} else if (isNonNullString(displayName)) {
		fn.displayName = displayName; // Use custom display name if provided
	}
	return fn; // Return the enhanced component
}

export default { addListener, getDimensions };
