"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Platform from "@platform";
import { Animated, View } from "react-native";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { isNumber } from "@resk/core/utils";
import { remapProps } from "nativewind";
export function ProgressBarFillIndeterminate({ style, indeterminateDuration, className, ...props }: IHtmlDivProps & { indeterminateDuration?: number }) {
    const [width, setWidth] = useState<number>(0);
    const { current: transition } = useRef<Animated.Value>(
        new Animated.Value(0)
    );
    indeterminateDuration = isNumber(indeterminateDuration) && indeterminateDuration > 500 ? indeterminateDuration : INDETERMINATE_DURATION;
    const indeterminateAnimation = useRef<Animated.CompositeAnimation | null>(null);
    const startAnimation = useCallback(() => {
        if (!indeterminateAnimation.current) {
            indeterminateAnimation.current = Animated.timing(transition, {
                duration: indeterminateDuration,
                toValue: 1,
                // Animated.loop does not work if useNativeDriver is true on web
                useNativeDriver,
                isInteraction: false,
            });
        }
        transition.setValue(0);
        Animated.loop(indeterminateAnimation.current).start();
    }, [transition, indeterminateDuration]);
    useEffect(() => {
        startAnimation();
        return () => {
            if (indeterminateAnimation.current) {
                indeterminateAnimation.current.stop();
            }
        }
    }, []);
    return <View className={cn("w-full h-full bg-transparent")} testID={props.testID + "-animated-container"}
        onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width);
        }}
    >
        <RemapedAnimateView
            {...props as any}
            className={cn("w-full progress-bar-indeterminate-animated", className)}
            style={[
                {
                    style,
                    height: "100%",
                    width,
                    transform: [
                        {
                            translateX: transition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-width, 0.5 * width],
                            }),
                        },
                        {
                            scaleX: transition.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.0001, 1, 0.001],
                            }),
                        },
                    ],
                },
            ]}
        />
    </View>
}
const RemapedAnimateView = remapProps(Animated.View, {
    className: "style"
});
const useNativeDriver = Platform.canUseNativeDriver();
const INDETERMINATE_DURATION = 1500;