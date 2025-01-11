import { ITouchableRippleProps } from "./types";

export const useAnimations = ({ disableRipple, rippleColor }: ITouchableRippleProps) => {
    return { fadeIn: null, fadeOut: null, rippleContent: null };
}