import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Platform from "@platform";
import {
    Animated,
    StyleSheet,
    Easing,
    GestureResponderEvent,
    View,
    LayoutChangeEvent,
} from 'react-native';
import { ITouchableRippleProps } from "./types";
import { defaultStr } from "@resk/core";

export const useAnimations = (props: IProps): {
    fadeIn?: (event: GestureResponderEvent) => void;
    fadeOut?: (event: GestureResponderEvent) => void;
    rippleContent?: JSX.Element | null;
    startRipple?: (event: GestureResponderEvent) => void;
} => {
    const ref = useRef<any>(null);
    return {
        fadeIn: (event: GestureResponderEvent) => {
            if (typeof ref?.current?.startRipple == "function") {
                ref.current.startRipple(event);
            }
        },
        rippleContent: <RippleEffect
            {...Object.assign({}, props)}
            ref={ref}
        />
    };
}
interface Ripple {
    x: number;
    y: number;
    size: number;
    key: number;
    animation: Animated.Value;
}
type IProps = ITouchableRippleProps & { buttonRef?: React.RefObject<View>, buttonLayoutRef?: React.RefObject<LayoutChangeEvent> };
const RippleEffect = forwardRef<{
    startRipple?: (event: GestureResponderEvent) => void;
    fadeIn?: (event: GestureResponderEvent) => void;
    fadeOut?: (event: GestureResponderEvent) => void;
}, IProps>(({ disableRipple, rippleSize, buttonLayoutRef, rippleDuration, rippleOpacity, rippleColor, testID }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const containerSize = useRef({ width: 0, height: 0 });
    testID = defaultStr(testID, "resk-ripple-effect");
    rippleSize = typeof rippleSize == "number" && rippleSize > 0 ? rippleSize : 0;
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 300;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity >= 0 ? rippleOpacity : 0.3;
    const nextKey = useRef(0);
    const startRipple = useCallback((event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const { width: cWidth, height: cHeight } = Object.assign({}, buttonLayoutRef?.current?.nativeEvent?.layout || { width: 0, height: 0 });
        const width = typeof cWidth == "number" && cWidth > 0 ? cWidth : 0;
        const height = typeof cHeight == "number" && cHeight > 0 ? cHeight : 0;
        // Calculate ripple size
        const size = typeof rippleSize == "number" && rippleSize > 0
            ? rippleSize
            : Math.max(width, height) * 2;
        const newRipple: Ripple = {
            x: locationX - size / 2,
            y: locationY - size / 2,
            size,
            key: nextKey.current,
            animation: new Animated.Value(0)
        };
        setRipples(prevRipples => [...prevRipples, newRipple]);
        nextKey.current += 1;

        Animated.sequence([
            Animated.timing(newRipple.animation, {
                toValue: 1,
                duration: rippleDuration,
                useNativeDriver: true,
            }),
            Animated.timing(newRipple.animation, {
                toValue: 0,
                duration: rippleDuration,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setRipples(prevRipples =>
                prevRipples.filter(ripple => ripple.key !== newRipple.key)
            );
        });
    }, [rippleSize]);
    useImperativeHandle(ref, () => ({
        startRipple,
    }));
    return <>
        {disableRipple ? null : ripples.map(ripple => (
            <Animated.View
                key={ripple.key}
                testID={testID + "-ripple" + "-" + ripple.key}
                style={[
                    styles.ripple,
                    {
                        left: ripple.x,
                        top: ripple.y,
                        backgroundColor: rippleColor,
                        width: ripple.size,
                        height: ripple.size,
                        opacity: ripple.animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [rippleOpacity, 0],
                        }),
                        transform: [
                            {
                                scale: ripple.animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                        ],
                    },
                ]}
            />
        ))}
    </>
});
RippleEffect.displayName = "RippleEffect";
const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
