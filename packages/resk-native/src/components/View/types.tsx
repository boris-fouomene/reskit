import { ViewProps } from "react-native";
import { IWithBreakpointStyle } from "../../dimensions/types";

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
export type IViewProps = Omit<ViewProps, "style"> & IWithBreakpointStyle<ViewProps> & {
    // Additional props can be defined here if needed
};