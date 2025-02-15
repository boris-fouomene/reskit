import { forwardRef, useImperativeHandle, useRef } from "react";
import {
    Animated,
    StyleSheet,
    GestureResponderEvent,
    LayoutChangeEvent,
} from 'react-native';
import { ITouchableRippleProps } from "./types";
import useStateCallback from "@utils/stateCallback";
import Platform from "@platform";

const useNativeDriver = Platform.canUseNativeDriver();
export const useAnimations = (props: ITouchableRippleProps): {
    startRipple?: (event: GestureResponderEvent) => void;
    stopRipple?: (event: GestureResponderEvent) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
    rippleContent?: JSX.Element | null;
} => {
    const ref = useRef<any>(null);
    return {
        startRipple: (event: GestureResponderEvent) => {
            if (typeof ref?.current?.startRipple == "function") {
                ref.current.startRipple(event);
            }
        },
        stopRipple: (event: GestureResponderEvent) => {
            if (typeof ref?.current?.stopRipple == "function") {
                ref.current.stopRipple(event);
            }
        },
        onLayout: (event: LayoutChangeEvent) => {
            if (typeof ref?.current?.onLayout == "function") {
                ref.current.onLayout(event);
            }
        },
        rippleContent: <RippleEffect
            {...props}
            ref={ref}
        />
    };
}

const RippleEffect = forwardRef<{
    startRipple?: (event: GestureResponderEvent) => void;
    stopRipple?: (event: GestureResponderEvent) => void;
}, ITouchableRippleProps>(({ disableRipple, children, testID, rippleColor, borderWidth, borderRadius, rippleOpacity, maskDuration, rippleDuration, rippleLocation }, ref) => {
    const animatedOpacity = useRef<Animated.Value>(new Animated.Value(0));
    const animatedRippleScale = useRef<Animated.Value>(new Animated.Value(0));
    const rippleAni = useRef<Animated.CompositeAnimation>();
    const pendingRippleAni = useRef<(() => void)>();
    borderWidth = typeof borderWidth == "number" && borderWidth || 0;
    rippleLocation = typeof rippleLocation == "string" ? rippleLocation : "tapLocation";
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity >= 0 ? rippleOpacity : 0.3;
    const [rippleState, setRippleState] = useStateCallback<ITouchableRippleState>({
        height: 1,
        width: 1,
        ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
    });
    const showRipple = () => {
        animatedOpacity.current.setValue(1);
        animatedRippleScale.current.setValue(0.3);
        // scaling up the ripple layer
        (rippleAni).current = Animated.timing(animatedRippleScale.current, {
            duration: rippleDuration,
            toValue: 1,
            useNativeDriver
        });
        rippleAni.current.start(() => {
            (rippleAni).current = undefined;

            // if any pending animation, do it
            if (pendingRippleAni.current) {
                pendingRippleAni.current();
            }
        });
    }
    const hideRipple = () => {
        pendingRippleAni.current = () => {
            // hide the ripple layer
            Animated.timing(animatedOpacity.current, {
                duration: maskDuration,
                toValue: 0,
                useNativeDriver,
            }).start();
            pendingRippleAni.current = undefined;
        };

        if (!rippleAni.current && typeof pendingRippleAni.current == "function") {
            // previous ripple animation is done, good to go
            pendingRippleAni.current();
        }
    }
    const startRipple = (evt: GestureResponderEvent) => {
        if (disableRipple) return;
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
    };
    const onLayout = (evt: LayoutChangeEvent) => {
        if (disableRipple) return;
        const { width, height } = evt.nativeEvent.layout;
        if (width === rippleState.width && height === rippleState.height) {
            return;
        }
        setRippleState({
            ...rippleState,
            height,
            width,
        });
    }
    const stopRipple = () => {
        if (disableRipple) {
            return;
        }
        hideRipple();
    };
    useImperativeHandle(ref, () => ({
        startRipple,
        stopRipple,
        onLayout,
    }));
    return disableRipple ? null : <Animated.View
        testID={testID + "-animated-container"}
        style={{
            height: rippleState.height,
            width: rippleState.width,
            left: -(borderWidth),
            top: -(borderWidth),
            opacity: animatedOpacity.current,
            position: 'absolute',
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
                transform: [{ scale: animatedRippleScale.current }],
            }}
        />
    </Animated.View>
});
RippleEffect.displayName = "RippleEffect";
const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});



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
