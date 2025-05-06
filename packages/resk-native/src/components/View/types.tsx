import { ViewProps,View } from "react-native";
import { IWithBreakpointStyle } from "../../dimensions/types";
import { IViewStyle } from '../../types/index';
import { Ref } from "react";

/***
 * The props for the `View` component are a combination of the standard
 * props from React Native's `View` and the additional props from the
 * `withBreakpointStyle` HOC.
 * 
 * ### Props:
 * - `style`: The base style to apply to the view.
 * - `mediaQueries`: A function or an object that defines styles based on device dimensions.
 * - Other standard `ViewProps` from React Native's `View`.
    @interface IViewProps
    @extends {IWithBreakpointStyle<ViewProps,IViewStyle>}
 */
export interface IViewProps extends IWithBreakpointStyle<ViewProps,IViewStyle>{
   ref?:Ref<View>;
};