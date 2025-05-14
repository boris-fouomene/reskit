"use client";
import { View as RNView, Pressable } from "react-native";
import { IHtmlDivProps } from "../types";
import { normalizeNativeProps } from "../utils";
import { withAsChild } from "@components/Slot";
import { pickTouchableProps } from "@utils/touchHandler";


/**
 * A wrapper component for the HTML `<div>` element.
 *
 * This component accepts the standard HTML props for the `<div>` element, as well
 * as any additional props supported by the underlying React Native component.
 *
 * @example
 * <Div style={{ backgroundColor: 'red' }}>Hello, world!</Div>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div}
 * @see {@link https://reactnative.dev/docs/view#props}
 */
export const Div = withAsChild(function Div(props: IHtmlDivProps) {
    const { touchableProps } = pickTouchableProps(props as any);
    const Component = touchableProps ? Pressable : RNView;
    return <Component {...props} {...normalizeNativeProps(props)} />
}, "Html.Div");