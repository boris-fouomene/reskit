import { forwardRef, useMemo, useRef } from 'react';
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

const useNativeDriver = Platform.canUseNativeDriver();
const version = parseInt(String(Platform.Version));
const isAndroid = Platform.isAndroid() && (typeof version == "number" ? version >= 21 : true); //ANDROID_VERSION_LOLLIPOP;

/** State of the {@link TouchableRipple} */
interface ITouchableRippleState {
    width: number;
    height: number;
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
    onPressIn,
    onPressOut,
    rippleLocation,
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

    const animatedOpacityRef = useRef<Animated.Value>(new Animated.Value(0.1));
    const animatedRippleScaleRef = useRef<Animated.Value>(new Animated.Value(0));
    const rippleAniRef = useRef<Animated.CompositeAnimation>();
    const pendingRippleAni = useRef<(() => void)>();
    const [rippleState, setRippleState] = useStateCallback<ITouchableRippleState>({
        height: 1,
        width: 1,
        ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
    });

    const showRipple = () => {
        animatedOpacityRef.current.setValue(1);
        animatedRippleScaleRef.current.setValue(0.3);

        // scaling up the ripple layer
        (rippleAniRef).current = Animated.timing(animatedRippleScaleRef.current, {
            duration: rippleDuration,
            toValue: 1,
            useNativeDriver,
        });

        // enlarge the shadow, if enabled
        (rippleAniRef as any).current.start(() => {
            (rippleAniRef).current = undefined;

            // if any pending animation, do it
            if (pendingRippleAni.current) {
                pendingRippleAni.current();
            }
        });
    }
    const hideRipple = () => {
        pendingRippleAni.current = () => {
            // hide the ripple layer
            Animated.timing(animatedOpacityRef.current, {
                duration: maskDuration,
                toValue: 0,
                useNativeDriver,
            }).start();
            pendingRippleAni.current = undefined;
        };

        if (!rippleAniRef.current && typeof pendingRippleAni.current == "function") {
            // previous ripple animation is done, good to go
            pendingRippleAni.current();
        }
    }

    const shadowStyle = useMemo(() => {
        return shadowEnabled ? {
            shadowOffset: {
                height: 1.5,
                width: 0,
            }
        } : undefined;
    }, [shadowEnabled, isRippleDisabled]);
    const rippleContent = !isRippleDisabled ? <Animated.View
        testID={testID + "-animated-container"}
        style={{
            ...StyleSheet.absoluteFillObject,
            height: rippleState.height,
            width: rippleState.width,
            left: -(borderWidth),
            top: -(borderWidth),
            opacity: animatedOpacityRef.current,
        }}
    >
        <Animated.View
            testID={testID + "-animated-content"}
            style={{
                height: rippleState.ripple.dia,
                width: rippleState.ripple.dia,

                ...rippleState.ripple.offset,
                backgroundColor: rippleColor,
                borderRadius: rippleState.ripple.radii,
                transform: [{ scale: animatedRippleScaleRef.current }],
            }}
        />
    </Animated.View> : null;
    return <Pressable
        ref={ref}
        {...props}
        disabled={disabled}
        onLayout={(evt) => {
            if (typeof onLayout == "function") onLayout(evt);
            if (isRippleDisabled) return;
            const { width, height } = evt.nativeEvent.layout;
            if (width === rippleState.width && height === rippleState.height) {
                return;
            }
            setRippleState({
                ...rippleState,
                height,
                width,
            });
        }}
        onPressIn={(evt) => {
            if (typeof onPressIn == "function") onPressIn(evt);
            if (isRippleDisabled) {
                return;
            }
            const { nativeEvent: { pageX, pageY } } = evt;
            const { width, height } = rippleState;
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
                ripple: {
                    dia: radii * 2,
                    offset: {
                        left: hotSpotX - radii,
                        top: hotSpotY - radii,
                    },
                    radii,
                },
            }, showRipple);
        }}
        onPressOut={(evt) => {
            if (typeof onPressOut == "function") onPressOut(evt);
            if (isRippleDisabled) {
                return;
            }
            hideRipple();
        }}
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
                borderless: borderWidth === 0,
                duration: rippleDuration,
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
        overflow: 'hidden',
        alignSelf: "flex-start",
        userSelect: "none",
    },
});

export * from "./utils";
export * from "./types";

TouchableRipple.displayName = "TouchableRipple";