import { View as RNView, ViewProps } from "react-native";
import { withBreakpointStyle } from "@src/dimensions";
import { IViewProps } from "./types";

/***
 * The `View` component is a wrapper around the React Native `View` component.
 * This enhanced component utilizes the `withBreakpointStyle` HOC to provide
 * responsive design capabilities based on media queries.
 *
 * ### Usage:
 * This component can be used just like a standard React Native `View`,
 * but it allows for the definition of `breakpointStyle`, which can adjust
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
 *       breakpointStyle={(dimensions: IDimensionsProps) => ({
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
const View = withBreakpointStyle<IViewProps>(RNView, "View");

export default View;

// Set a display name for better debugging in React DevTools
View.displayName = "ReskNativeView";

export * from "./types";
