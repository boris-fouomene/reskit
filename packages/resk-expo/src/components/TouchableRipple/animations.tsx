import { useRef } from "react";
import Platform from "@platform";
import {
    Animated,
    StyleSheet,
    Pressable,
    View,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = (disableRipple?: boolean) => {
    const animatedRef = useRef(new Animated.Value(1));
    const fadeIn = () => {
        if (disableRipple) return;
        Animated.timing(animatedRef.current, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver,
        }).start();
    };
    const fadeOut = () => {
        if (disableRipple) return;
        Animated.timing(animatedRef.current, {
            toValue: 1,
            duration: 200,
            useNativeDriver,
        }).start();
    };
    return { fadeIn, fadeOut, animatedRef };
}