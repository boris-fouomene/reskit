import { ITouchableRippleProps } from "./types";
import useStateCallback from "@utils/stateCallback";
import { useEffect, useRef } from "react";
import { Animated, GestureResponderEvent, LayoutChangeEvent, LayoutRectangle, StyleSheet } from "react-native";
import Platform from "@platform";

export default function useGetRippleContent({ testID, disableRipple, disabled, rippleColor, rippleOpacity, rippleDuration }: ITouchableRippleProps): {
    rippleContent?: JSX.Element | null;
    startRipple?: (event: GestureResponderEvent) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
} {
    const isRippleDisabled = !!(disabled || disableRipple);
    const timerRef = useRef<any>(null);
    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
        }
    }, [])
    const [ripples, setRipples] = useStateCallback<Array<{
        key: number;
        x: number;
        y: number;
        size: number;
        opacity: Animated.Value;
        scale: Animated.Value;
    }>>([]);
    const nextKey = useRef(0);
    // Clean up completed ripples
    useEffect(() => {
        const timeoutIds: NodeJS.Timeout[] = [];

        ripples.forEach((ripple) => {
            const id = setTimeout(() => {
                setRipples(prevRipples =>
                    prevRipples.filter(r => r.key !== ripple.key)
                );
            }, rippleDuration);

            timeoutIds.push(id);
        });

        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    }, [ripples, rippleDuration]);
    if (isRippleDisabled) {
        return {};
    }
    return {
        rippleContent: <>
            {ripples.map((ripple, index) => (
                <Animated.View
                    key={ripple.key}
                    testID={testID + "-ripple-" + index}
                    style={[
                        styles.ripple,
                        {
                            left: ripple.x - ripple.size / 2,
                            top: ripple.y - ripple.size / 2,
                            width: ripple.size,
                            height: ripple.size,
                            borderRadius: ripple.size / 2,
                            backgroundColor: rippleColor,
                            opacity: ripple.opacity,
                            transform: [{ scale: ripple.scale }],
                        },
                    ]}
                />
            ))}
        </>,
        startRipple: (event: GestureResponderEvent) => {
            const { currentTarget, target } = event;
            (currentTarget || target)?.measure((x, y, width, height, pageX, pageY) => {
                const touchX = event.nativeEvent.pageX - pageX;
                const touchY = event.nativeEvent.pageY - pageY;

                // Calculate ripple size (diagonal of the button for full coverage)
                const size = Math.max(width, height) * 2;

                // Create animated values for scale and opacity
                const opacity = new Animated.Value(rippleOpacity as number);
                const scale = new Animated.Value(0);

                // Add the new ripple
                const newRipple = {
                    key: nextKey.current,
                    x: touchX,
                    y: touchY,
                    size,
                    opacity,
                    scale,
                };

                nextKey.current += 1;
                setRipples(prevRipples => [...prevRipples, newRipple]);

                // Animate the ripple
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: rippleDuration,
                        useNativeDriver,
                    }),
                    Animated.sequence([
                        Animated.delay((rippleDuration as number) * 0.5),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: rippleDuration,
                            useNativeDriver,
                        }),
                    ]),
                ]).start();
            });
        }
    };
}

const isWeb = Platform.isWeb();

const useNativeDriver = Platform.canUseNativeDriver();

/** State of the {@link TouchableRipple} */
interface ITouchableRippleState {
    width: number;
    height: number;
    left: number;
    top: number,
}

const styles = StyleSheet.create({
    ripple: {
        position: 'absolute',
    },
});
