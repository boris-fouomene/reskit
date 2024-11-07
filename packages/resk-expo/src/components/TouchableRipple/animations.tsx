import { useRef } from "react";
import Platform from "@platform";
import {
    Animated,
    StyleSheet,
    Pressable,
    View,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = () => {
    const animatedRef = useRef(new Animated.Value(1));
    const fadeIn = () => {
        Animated.timing(animatedRef.current, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(animatedRef.current, {
            toValue: 1,
            duration: 200,
            useNativeDriver,
        }).start();
    };
    return { fadeIn, fadeOut, animatedRef };
}