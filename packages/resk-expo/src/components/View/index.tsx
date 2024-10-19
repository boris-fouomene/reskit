import { View as RNView, ViewProps } from "react-native";
import { IWithBreakpointStyle, withBreakpointStyle } from "@src/dimensions";

/***
 * The `View` component is a wrapper around the React Native `View` component.
 * This enhanced component utilizes the `withBreakpointStyle` HOC to provide
 * responsive design capabilities based on media queries.
 *
 * ### Usage:
 * This component can be used just like a standard React Native `View`,
 * but it allows for the definition of `mediaQueryStyle`, which can adjust
 * the component's styles based on the current dimensions of the device.
 *
 * Example:
 * ```typescript
 * import View from "$ecomponents/View";
 *
 * export function MyComponent({ children, ...rest }) {
 *   return (
 *     <View 
 *       {...rest} 
 *       mediaQueryStyle={(dimensions: IDimensionsProps) => ({
 *         padding: dimensions.isMobile ? 10 : 20,
 *         backgroundColor: dimensions.isTablet ? 'lightblue' : 'white',
 *       })}
 *     >
 *       {children}
 *     </View>
 *   );
 * }
 * ```
 * In this example, the `View` component's padding and background color
 * are adjusted based on whether the device is mobile or tablet.
 */
const View = withBreakpointStyle(RNView, "View");

export default View;

// Set a display name for better debugging in React DevTools
View.displayName = "ViewComponent";

/***
 * The props for the `View` component are a combination of the standard
 * props from React Native's `View` and the additional props from the
 * `withBreakpointStyle` HOC.
 * 
 * ### Props:
 * - `style`: The base style to apply to the view.
 * - `mediaQueries`: A function or an object that defines styles based on device dimensions.
 * - Other standard `ViewProps` from React Native's `View`.
 */
export type IViewProps = IWithBreakpointStyle<ViewProps> & {
    // Additional props can be defined here if needed
};