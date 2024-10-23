import {
    Pressable,
    SafeAreaView,
    View,
    StyleSheet,
    Button,
    SwitchChangeEvent,
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ISwitchProps } from './types';
import { processColorsInProps } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';
import { useToggleable } from './utils';
import { useMemo } from 'react';
import Tooltip from '@components/Tooltip';
import { useTheme } from '@theme/index';

const Switch = ({
    duration = 400,
    trackColors,
    ...props
}: ISwitchProps & { duration?: number, trackColors?: { off: string, on: string } }) => {
    const theme = useTheme();
    const { defaultValue, checkedValue, checked, toggleStatus, uncheckedValue } = useToggleable<SwitchChangeEvent>(props);
    const height = useSharedValue(0);
    const width = useSharedValue(0);
    const value = useSharedValue(!!checked ? 1 : 0);
    useMemo(() => {
        value.value = checked ? 1 : 0;
    }, [checked]);
    trackColors = Object.assign({}, {
        on: theme.colors.primary, //on: '#82cab2', off: '#fa7f7c' 
        off: theme.colors.secondary,
    }, trackColors)
    const trackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            value.value,
            [0, 1],
            [trackColors.off, trackColors.on]
        );
        const colorValue = withTiming(color, { duration });
        return {
            backgroundColor: colorValue,
            borderRadius: height.value / 2,
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const moveValue = interpolate(
            Number(value.value),
            [0, 1],
            [0, width.value - height.value]
        );
        const translateValue = withTiming(moveValue, { duration });

        return {
            transform: [{ translateX: translateValue }],
            borderRadius: height.value / 2,
        };
    });

    return (
        <Tooltip onPress={toggleStatus}>
            <Animated.View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                    width.value = e.nativeEvent.layout.width;
                }}
                style={[switchStyles.track, props.style, trackAnimatedStyle]}>
                <Animated.View
                    style={[switchStyles.thumb, thumbAnimatedStyle]}></Animated.View>
            </Animated.View>
        </Tooltip>
    );
};

Switch.displayName = "Switch";

const switchStyles = StyleSheet.create({
    track: {
        alignItems: 'flex-start',
        width: 45,
        height: 20,
        padding: 0,
    },
    thumb: {
        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'white',
    },
});

export default Switch;