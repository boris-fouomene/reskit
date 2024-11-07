import { useRef } from "react";
import Platform from "@platform";
import {
    Animated,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = () => {
    const animatedRef = useRef(new Animated.Value(1));
    return { fadeIn: null, fadeOut: null, animatedRef };
}