"use client";
import { View as RNView, Pressable } from "react-native";
import { IHtmlDivProps } from "../types";
import { normalizeNativeProps } from "../utils";
import { useMemo } from "react";


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
export function Div({ onPress, ...props }: IHtmlDivProps) {
    const Component = useMemo(() => {
        if (typeof onPress === 'function') {
            return Pressable;
        }
        return RNView;
    }, [onPress]);
    return <Component onPress={onPress}{...props} {...normalizeNativeProps(props)} />
}   