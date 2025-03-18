import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
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
import { Portal } from "@components/Portal";

const useNativeDriver = Platform.canUseNativeDriver();
const version = parseInt(String(Platform.Version));
const isAndroid = Platform.isAndroid() && (typeof version == "number" ? version >= 21 : true); //ANDROID_VERSION_LOLLIPOP;

/** State of the {@link TouchableRipple} */
interface ITouchableRippleState {
    width: number;
    height: number;
    visible: boolean,
    ripple: {
        radii: number;
        dia: number;
        offset: {
            top: number;
            left: number;
        };
    };
}


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
export const TouchableRipple = forwardRef<View, ITouchableRippleProps>(({
    children, disabled, style,
    rippleColor: customRippleColor,
    hoverColor: customHoverColor,
    disableRipple,
    testID, borderRadius,
    rippleDuration,
    shadowEnabled,
    borderWidth,
    maskDuration,
    onLayout,
    rippleLocation,
    rippleOpacity,
    ...props
}, ref) => {
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
    rippleLocation = typeof rippleLocation == "string" ? rippleLocation : "tapLocation";
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity > 0 && rippleOpacity <= 1 ? rippleOpacity : 0.7;
    const opacityAnimation = useRef<Animated.Value>(new Animated.Value(0.1)).current;
    const scaleAnimation = useRef<Animated.Value>(new Animated.Value(0)).current;
    const [rippleState, setRippleState] = useStateCallback<ITouchableRippleState>({
        height: 1,
        width: 1,
        visible: false,
        ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
    });

    const shadowStyle = useMemo(() => {
        return shadowEnabled ? {
            shadowOffset: {
                height: 1.5,
                width: 0,
            }
        } : undefined;
    }, [shadowEnabled, isRippleDisabled]);
    const rippleContent = !isRippleDisabled && rippleState.visible ? <Portal testID={testID + "-ripple-portal"}>
        <Animated.View
            testID={testID + "-animated-container"}
            style={[{
                ...StyleSheet.absoluteFillObject,
                height: rippleState.height,
                width: rippleState.width,
                left: -(borderWidth),
                top: -(borderWidth),
                opacity: opacityAnimation,
            }, !rippleState.visible && styles.animatedHidden]}
        >
            <Animated.View
                testID={testID + "-animated-content"}
                style={{
                    height: rippleState.ripple.dia,
                    width: rippleState.ripple.dia,
                    opacity: rippleOpacity,
                    ...rippleState.ripple.offset,
                    backgroundColor: rippleColor,
                    borderRadius: rippleState.ripple.radii,
                    transform: [{ scale: scaleAnimation }],
                }}
            />
        </Animated.View>
    </Portal> : null;
    return <Pressable
        ref={ref}
        {...props}
        disabled={disabled}
        onLayout={onLayout}
        onPressIn={(event) => {
            if (!disabled && typeof props.onPressIn == 'function') {
                props.onPressIn(event);
            }
            if (isRippleDisabled) return;
            const { target, currentTarget } = event;
            (currentTarget || target).measureInWindow((x, y, width, height) => {
                const { nativeEvent: { pageX, pageY } } = event;
                let radii;
                let hotSpotX = pageX;
                let hotSpotY = pageY;

                if (rippleLocation === 'center') {
                    hotSpotX = width / 2;
                    hotSpotY = height / 2;
                }
                const offsetX = Math.max(hotSpotX, width - hotSpotX);
                const offsetY = Math.max(hotSpotY, height - hotSpotY);
                radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
                setRippleState({
                    ...rippleState,
                    visible: true,
                    ripple: {
                        dia: radii * 2,
                        offset: {
                            left: hotSpotX - radii,
                            top: hotSpotY - radii,
                        },
                        radii,
                    },
                }, () => {

                    // scaling up the ripple layer
                    Animated.parallel([
                        Animated.timing(scaleAnimation, {
                            duration: rippleDuration,
                            toValue: 1,
                            useNativeDriver,
                        }),
                        Animated.timing(opacityAnimation, {
                            duration: rippleDuration,
                            toValue: 1,
                            useNativeDriver,
                        }),
                    ]).start(() => {
                        // hide the ripple layer
                        Animated.timing(opacityAnimation, {
                            duration: maskDuration,
                            toValue: 0,
                            useNativeDriver,
                        }).start(() => {
                            setRippleState({
                                ...rippleState,
                                visible: false,
                            })
                        });
                    });
                });
            });
        }}
        onPress={props.onPress}
        style={(state) => {
            const cStyle = typeof style === 'function' ? style(state) : style;
            const isHover = (state as any)?.hovered && !disabled;
            return StyleSheet.flatten([
                styles.container,
                state.pressed && !disabled && rippleColor && { backgroundColor: rippleColor },
                shadowStyle,
                disabled && Theme.styles.disabled,
                typeof borderRadius == "number" && { borderRadius },
                cStyle,
                isHover && hoverColor && { backgroundColor: hoverColor },
            ]);
        }}
        android_ripple={
            disableRipple ? undefined : Object.assign({
                color: rippleColor,
                duration: rippleDuration,
                foreground: Platform.OS === 'android' && Platform.Version >= 28 && !!props?.android_ripple?.borderless
            }, props.android_ripple)
        }
        testID={testID}
    >
        {
            typeof children === "function" ? (state) => {
                return isRippleDisabled ? children(state) : <>
                    {rippleContent}
                    {children(state)}
                </>
            } : isRippleDisabled ? children : <>
                {rippleContent}
                {children}
            </>}
    </Pressable>;
});



const styles = StyleSheet.create({
    container: {
        //overflow: 'hidden',
        alignSelf: "flex-start",
        //userSelect: "none",
    },
    animatedHidden: {
        opacity: 0,
        display: 'none',
    }
});

export * from "./utils";
export * from "./types";

TouchableRipple.displayName = "TouchableRipple";