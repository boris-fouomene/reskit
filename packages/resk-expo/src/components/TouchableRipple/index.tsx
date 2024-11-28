import { defaultStr } from '@resk/core';
import React, { useMemo, useRef } from 'react';
import { useAnimations } from './animations';
import {
    StyleSheet,
    Pressable,
    View,
} from 'react-native';
import { Colors, useTheme } from '@theme';
import Platform from '@platform/index';
import { ITouchableRippleProps } from './types';
import { getColors } from './utils';
import { Animated } from 'react-native';

export * from "./types";

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
export const TouchableRipple = React.forwardRef<View, ITouchableRippleProps>(({
    children,
    onPress,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    style,
    disabled = false,
    disableRipple,
    testID,
    borderless,
    borderRadius,
    ...props
}, ref) => {
    const theme = useTheme();
    const { rippleColor, hoverColor } = getColors({ rippleColor: customRippleColor, hoverColor: customHoverColor, theme });
    testID = defaultStr(testID, "resk-touchable-ripple");;
    const { fadeIn, fadeOut, rippleContent } = useAnimations({ disableRipple, rippleColor, testID: testID + "-ripple-effect" });
    const { webStyle } = useMemo(() => {
        return {
            webStyle: !isAndroid ? [typeof borderRadius === "number" && { borderRadius } || null] : null
        }
    }, [borderRadius, isAndroid])
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            ref={ref}
            {...props}
            android_ripple={disableRipple ? undefined : Object.assign({
                color: rippleColor,
                borderless,
                radius: borderRadius,
            }, props.android_ripple)}
            onPressOut={(event) => {
                if (disabled) return;
                typeof fadeOut == "function" && fadeOut();
                if (typeof props.onPressOut == "function") {
                    props.onPressOut(event);
                }
            }}
            onPressIn={(event) => {
                if (disabled) return;
                typeof fadeIn == "function" && fadeIn();
                if (typeof props.onPressIn == "function") {
                    props.onPressIn(event);
                }
            }}
            testID={testID}
            style={(state) => {
                const cStyle = typeof style === 'function' ? style(state) : style;
                const isHover = (state as any)?.hovered && !disabled;
                return ([
                    styles.container,
                    state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
                    webStyle,
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
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        alignSelf: "flex-start",
        userSelect: "none",
    },
    ripple: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
});

TouchableRipple.displayName = "TouchableRipple";