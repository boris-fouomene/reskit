"use client";
import useStateCallback from "@utils/stateCallback";
import { ReactElement, useEffect, useRef } from "react";
import { Animated, GestureResponderEvent, StyleSheet } from "react-native";
import Platform from "@platform";
import { IButtonProps } from "./types";
import { cn } from "@utils/cn";


/**
 * Hook to generate the content of the ripple effect and the function to start the animation
 * 
 * @param {{ testID: string, disableRipple: boolean, disabled: boolean, rippleColor: string, rippleClassName: string, rippleOpacity: number, rippleDuration: number }} props - The props for the ripple effect
 * 
 * @returns {{ rippleContent?: ReactElement | null; startRipple?: (event: GestureResponderEvent) => void }} - The content of the ripple effect and the function to start the animation
 */
export function useGetRippleContent({ testID, disableRipple, disabled, rippleColor, rippleClassName, rippleOpacity, rippleDuration }: Partial<IButtonProps>): {
    rippleContent?: ReactElement | null;
    startRipple?: (event: GestureResponderEvent) => void;
} {
    rippleDuration = typeof rippleDuration == "number" && rippleDuration > 0 ? rippleDuration : 500;
    rippleOpacity = typeof rippleOpacity == "number" && rippleOpacity > 0 && rippleOpacity <= 1 ? rippleOpacity : 0.9;
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
    const className = cn("absolute", rippleClassName);
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
                    style={{
                        left: ripple.x - ripple.size / 2,
                        top: ripple.y - ripple.size / 2,
                        width: ripple.size,
                        height: ripple.size,
                        borderRadius: ripple.size / 2,
                        backgroundColor: rippleColor as any,
                        opacity: ripple.opacity,
                        transform: [{ scale: ripple.scale }],
                    }}
                    className={className}
                />
            ))}
        </>,
        startRipple: (event: GestureResponderEvent) => {
            const { currentTarget, target } = event;
            (currentTarget || target)?.measure((x, y, width, height, pageX, pageY) => {
                const touchX = event.nativeEvent.pageX - pageX;
                const touchY = event.nativeEvent.pageY - pageY;
                const size = Math.max(width, height) * 2;
                const opacity = new Animated.Value(rippleOpacity as number);
                const scale = new Animated.Value(0);
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

const useNativeDriver = Platform.canUseNativeDriver();

