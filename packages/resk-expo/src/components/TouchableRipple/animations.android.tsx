import { useRef } from "react";
import Platform from "@platform";
import {
    Animated,
} from 'react-native';

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = ({ disableRipple, rippleColor }: { disableRipple?: boolean, rippleColor?: string }) => {
    return { fadeIn: null, fadeOut: null, rippleContent: null };
}