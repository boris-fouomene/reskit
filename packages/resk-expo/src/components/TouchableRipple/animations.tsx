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
    const { testID, rippleSize, rippleColor, rippleDuration, rippleOpacity } = useGetProps(props);
    return {
        fadeIn: (event: GestureResponderEvent) => {
            if (typeof ref?.current?.startRipple == "function") {
                ref.current.startRipple(event);
            }
        },
        fadeOut: (event: GestureResponderEvent) => {
            if (typeof ref?.current?.fadeOut == "function") {
                ref.current.fadeOut(event);
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
    scale: Animated.Value;
    opacity: Animated.Value;
}
type IProps = ITouchableRippleProps & { buttonRef?: React.RefObject<View>, buttonLayoutRef?: React.RefObject<LayoutChangeEvent> };
const RippleEffect = forwardRef<{
    startRipple?: (event: GestureResponderEvent) => void;
    fadeIn?: (event: GestureResponderEvent) => void;
    fadeOut?: (event: GestureResponderEvent) => void;
}, IProps>(({ disableRipple, buttonLayoutRef, ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const { testID, rippleSize, rippleColor, rippleDuration, rippleOpacity } = useGetProps(props);
    const nextKey = useRef(0);
    const startRipple = useCallback((event: any) => {
        if (disableRipple) return;
        const { locationX, locationY } = event.nativeEvent;
        const { width: cWidth, height: cHeight } = Object.assign({}, buttonLayoutRef?.current?.nativeEvent?.layout || { width: 0, height: 0 });
        const width = typeof cWidth == "number" && cWidth > 0 ? cWidth : 0;
        const height = typeof cHeight == "number" && cHeight > 0 ? cHeight : 0;
        // Calculate ripple size
        const size = typeof rippleSize == "number" && rippleSize > 0
            ? rippleSize
            : Math.max(width, height) * 2;
        const finalScale = (4 * size) / 100;
        const scale = new Animated.Value(0);
        const opacity = new Animated.Value(rippleOpacity);
        const newRipple: Ripple = {
            x: locationX - size / 2,
            y: locationY - size / 2,
            size,
            key: nextKey.current,
            scale,
            opacity,
        };
        setRipples(prevRipples => [...prevRipples, newRipple]);
        nextKey.current += 1;
        Animated.sequence([
            Animated.timing(scale, {
                toValue: finalScale,
                duration: rippleDuration,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: rippleOpacity,
                    duration: rippleDuration * 0.25,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: rippleDuration * 0.75,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            setRipples(prevRipples =>
                prevRipples.filter(ripple => ripple.key !== newRipple.key)
            );
        });
    }, [rippleSize]);
    const fadeOut = useCallback(() => {
        ripples.forEach(ripple => {
            Animated.timing(ripple.opacity, {
                toValue: 0,
                duration: rippleDuration * 0.25,
                useNativeDriver: true,
            }).start();
        });
    }, [ripples, rippleDuration]);
    useImperativeHandle(ref, () => ({
        startRipple,
        fadeOut,
    }));
    return <>
        {disableRipple ? null : ripples.map(({ x, y, size, key, scale, opacity }) => (
            <Animated.View
                key={key}
                testID={testID + "-ripple" + "-" + key}
                style={[
                    styles.ripple,
                    {
                        left: x,
                        top: y,
                        backgroundColor: rippleColor,
                        width: size,
                        height: size,
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
        ))}
    </>
});
const useGetProps = ({ rippleSize, rippleDuration, rippleOpacity, testID, ...props }: IProps) => {
    testID = defaultStr(testID, "resk-ripple-effect");
    rippleSize = typeof rippleSize == "number" && rippleSize > 0 ? rippleSize : 0;
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 300;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity >= 0 ? rippleOpacity : 0.3;
    return {
        ...props,
        testID,
        rippleSize,
        rippleDuration,
        rippleOpacity,
    }
};
RippleEffect.displayName = "RippleEffect";
const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
