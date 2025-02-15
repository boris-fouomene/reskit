import { Component, forwardRef, useMemo, useRef, useState } from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { ITouchableRippleProps } from './types';
import { defaultStr } from '@resk/core';
import { getColors } from './utils';
import Theme, { useTheme } from '@theme/index';
import Platform from "@platform";
import useStateCallback from '@utils/stateCallback';
import { useAnimations } from './animations';

const isAndroid = Platform.isAndroid();



/**
 * A custom `TouchableRipple` component that implements Material Design's ripple effect 
 * without any third-party dependencies. This component enhances user interaction 
 * by providing visual feedback when the user presses and holds the button.
 * 
 * @component
 * 
 * @param {ITouchableRippleProps} props - The properties for the component.
 * 
 * @param {React.ReactNode | ((state: PressableState) => React.ReactNode)} props.children - 
 * The content to be displayed inside the button. Can be a React node or a function 
 * that receives the current state of the button (pressed, hovered) and returns 
 * the content to render.
 * 
 * @param {(event:GestureResponderEvent) => void} [props.onPress] - Callback function that is called when the button is pressed. 
 * This function should contain the logic to be executed upon the press event.
 * 
 * @param {string} [props.rippleColor] - Custom color for the ripple effect. 
 * Defaults to a semi-transparent version of the theme's onSurface color if not provided.
 * 
 * @param {string} [props.hoverColor] - Custom background color when the button is hovered over. 
 * Defaults to a faded version of the ripple color if not specified.
 * 
 * @param {boolean} [props.disabled=false] - If true, disables the button, preventing any interaction.
 * 
 * @param {string} [props.testID] - Optional test ID used for testing purposes, defaults to "resk-touchable-ripple".
 * 
 * @param {React.Ref} ref - A ref that can be used to access the underlying Pressable component.
 * 
 * @returns {JSX.Element} A `Pressable` component with ripple effect and hover functionality.
 * 
 * @example
 * Basic usage of the `TouchableRipple` component:
 * ```tsx
 * <TouchableRipple onPress={() => alert('Button Pressed!')}>
 *   <Text>Press Me!</Text>
 * </TouchableRipple>
 * ```
 * 
 * @example
 * Customizing the ripple and hover colors:
 * ```tsx
 * <TouchableRipple 
 *   onPress={() => console.log('Custom Button Pressed!')}
 *   rippleColor="rgba(0, 150, 136, 0.6)"
 *   hoverColor="#e0f7fa"
 * >
 *   <Text style={{ color: '#00796b' }}>Custom Styled Button</Text>
 * </TouchableRipple>
 * ```
 * 
 * @note 
 * The ripple effect is animated using the `Animated` API from React Native. 
 * The component uses the `Pressable` component to handle touch interactions, 
 * providing built-in support for hover and press states.
 * 
 * @example
 * Using a function as children to customize rendering based on the button state:
 * ```tsx
 * <TouchableRipple 
 *   onPress={(event) => alert('State-based Button Pressed!')}
 * >
 *   {(state) => (
 *     <Text style={{ color: state.pressed ? 'white' : 'black' }}>
 *       {state.pressed ? 'Pressed!' : 'Press Me!'}
 *     </Text>
 *   )}
 * </TouchableRipple>
 * ```
 */
export const TouchableRipple = forwardRef<View, ITouchableRippleProps>(({ children, disabled, style,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    disableRipple,
    testID,
    borderRadius,
    rippleDuration,
    shadowEnabled,
    borderWidth,
    maskDuration,
    onLayout,
    onPressIn,
    onPressOut,
    ...props }, ref) => {
    const theme = useTheme();
    const { rippleColor, hoverColor } = getColors({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme });
    testID = defaultStr(testID, "resk-touchable-ripple");
    const isRippleDisabled = useMemo(() => {
        return disableRipple || disabled || isAndroid;
    }, [disableRipple, disabled, isAndroid]);

    borderWidth = typeof borderWidth == "number" && borderWidth || 0;
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 300;
    maskDuration = typeof maskDuration == "number" && maskDuration > 0 ? maskDuration : 200;
    shadowEnabled = typeof shadowEnabled == "boolean" ? shadowEnabled : false;
    const { startRipple, stopRipple, onLayout: onRippleLayout, rippleContent } = useAnimations({ ...props, testID, disableRipple: isRippleDisabled, rippleColor, borderWidth, borderRadius, maskDuration, rippleDuration, shadowEnabled });
    const shadowStyle = useMemo(() => {
        return shadowEnabled !== false ? {
            shadowOffset: {
                height: 1.5,
                width: 0,
            }
        } : undefined;
    }, [shadowEnabled]);
    return <Pressable
        ref={ref}
        {...props}
        onLayout={(evt) => {
            if (typeof onLayout == "function") onLayout(evt);
            onRippleLayout?.(evt);
        }}
        onPressIn={(evt) => {
            if (typeof onPressIn == "function") onPressIn(evt);
            startRipple?.(evt);
        }}
        onPressOut={(evt) => {
            if (typeof onPressOut == "function") onPressOut(evt);
            stopRipple?.(evt);
        }}
        android_ripple={disableRipple ? undefined : Object.assign({
            color: rippleColor,
            borderless: borderWidth === 0,
            radius: borderRadius,
            duration: rippleDuration,
        }, props.android_ripple)}
        testID={testID}
        style={(state) => {
            const cStyle = typeof style === 'function' ? style(state) : style;
            const isHover = (state as any)?.hovered && !disabled;
            return ([
                styles.container,
                state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
                shadowStyle,
                disabled && Theme.styles.disabled,
                typeof borderRadius == "number" && { borderRadius },
                cStyle,
                isHover && hoverColor && { backgroundColor: hoverColor },
            ]);
        }}
    >
        {typeof children === "function" ? (state) => {
            return <>
                {rippleContent}
                {children(state)}
            </>
        } : <>
            {rippleContent}
            {children}
        </>}
    </Pressable>;
});



const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignSelf: "flex-start",
        userSelect: "none",
    },
});

export * from "./utils";
export * from "./types";

TouchableRipple.displayName = "TouchableRipple";