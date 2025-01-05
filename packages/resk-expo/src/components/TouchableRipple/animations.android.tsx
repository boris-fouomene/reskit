import { useRef } from "react";
import Platform from "@platform";
import { ITouchableRippleProps } from "./types";

const useNativeDriver = Platform.isMobileNative();

export const useAnimations = ({ disableRipple, rippleColor }: ITouchableRippleProps) => {
    return { fadeIn: null, fadeOut: null, rippleContent: null };
}