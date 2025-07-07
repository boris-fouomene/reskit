"use client";
import { isNumber } from "@resk/core/utils";
import { ComponentProps, useCallback, useEffect, useRef } from "react";
import { Animated, LayoutChangeEvent, View } from "react-native";
import Platform from "@platform";
import useStateCallback from "@utils/stateCallback";
import { cn } from "@utils/cn";
import { isRTL } from "@utils/i18nManager";
import { remapProps } from "nativewind";

const useNativeDriver = Platform.canUseNativeDriver();

const RemaptedAnimated = remapProps(Animated.View, {
    className: "style"
})
export function IndeterminateProgressBar({ className, testID, indeterminateDuration, ...props }: ComponentProps<typeof Animated.View> & { indeterminateDuration?: number }) {
    const indeterminateAnimation = useRef<Animated.CompositeAnimation | null>(null);
    const [width, setWidth] = useStateCallback(0);
    const { current: timer } = useRef<Animated.Value>(
        new Animated.Value(0)
    );
    const animationScale = 1;
    const duration = isNumber(indeterminateDuration) && indeterminateDuration > 100 ? indeterminateDuration : 2000;
    const startAnimation = useCallback(() => {
        if (!indeterminateAnimation.current) {
            indeterminateAnimation.current = Animated.timing(timer, {
                duration,
                toValue: 1,
                // Animated.loop does not work if useNativeDriver is true on web
                useNativeDriver,
                isInteraction: false,
            });
        }
        // Reset timer to the beginning
        timer.setValue(0);
        Animated.loop(indeterminateAnimation.current).start();
    }, [animationScale, duration, timer]);

    const onLayout = (event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width);
    };

    useEffect(() => {
        startAnimation();
        return () => { }
    }, [startAnimation]);
    return <View
        onLayout={onLayout}
        accessible
        accessibilityRole="progressbar"
        accessibilityState={{ busy: true }}
        testID={testID + "-container"}
        className="h-full w-full resk-progress-bar-indeterminate-container overflow-hidden flex-col flex"
    >
        <RemaptedAnimated
            {...props}
            testID={`${testID}-fill`}
            className={cn(className, "flex-1 resk-progress-bar-indeterminate-fill")}
            style={[
                {
                    width,
                    transform: [
                        {
                            translateX: timer.interpolate(
                                {
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [
                                        (isRTL ? 1 : -1) * 0.5 * width,
                                        (isRTL ? 1 : -1) *
                                        0.5 * indeterminateWidth *
                                        width,
                                        (isRTL ? -1 : 1) * 0.7 * width,
                                    ],
                                }
                            ),
                        },
                        {
                            scaleX: timer.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [
                                    0.0001,
                                    indeterminateWidth,
                                    0.0001,
                                ],
                            }),
                        },
                    ],
                },
            ]}
        />
    </View>
}

const indeterminateWidth = 0.6;