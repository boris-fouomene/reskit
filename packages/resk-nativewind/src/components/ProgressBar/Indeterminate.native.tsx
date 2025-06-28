"use client";
import { IHtmlDivProps } from "@html/types";
import { cn } from "@utils/cn";
import { View } from "react-native";
import Animated, { interpolate, Keyframe, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { remapProps } from "nativewind";
import { Div } from "@html/Div";
import { useEffect, useState } from "react";
import { isNumber } from "@resk/core/utils";

export function ProgressBarIndeterminateFill({ className, ...props }: IHtmlDivProps) {
    const progress = useSharedValue(0);
    const [width, setWidth] = useState<number>(0);
    const duration = 500;
    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration }),
            -1, // infinite
            false // don't reverse
        );
    }, [duration]);
    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            progress.value,
            [0, 0.5, 1],
            [-width * 0.3, width * 0.5, width * 1.3]
        );

        const scaleX = interpolate(
            progress.value,
            [0, 0.2, 0.5, 0.8, 1],
            [0, 1, 1, 1, 0]
        );

        return {
            transform: [{ translateX }, { scaleX }],
        };
    });
    return <View className={cn("native-progress-bar-indeterminate relative overflow-hidden")} onLayout={(e) => { setWidth(e.nativeEvent.layout.width); }}>
        <Animated.View
            style={[
                {
                    height: "100%",
                    width: width ? width * 0.4 : "100%",
                    position: 'absolute', left: 0, top: 0, bottom: 0, right: 0
                },
                animatedStyle,
            ]}
        >
            <Div className={cn("native-indeterminate-progressbar-fil", className)} />
        </Animated.View>
    </View>
}

const keyframe = new Keyframe({
    0: {
        transform: [{ translateX: 0 }, { scaleX: 0 }],
    },
    40: {
        transform: [{ translateX: 0 }, { scaleX: 0.4 }],
    },
    100: {
        transform: [{ translateX: "100%" }, { scaleX: 0.5 }],
    },
});
const RemaptedAnimated = remapProps(Animated.View, {
    className: "style"
});