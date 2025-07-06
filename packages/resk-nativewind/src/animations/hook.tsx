"use client";
import useStateCallback from "@utils/stateCallback";
import { IAnimatedVisibilityProps } from "./types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { isNonNullString, isNumber } from "@resk/core/utils";
import { cn } from "@utils/cn";
const keyframes = require("./key-frames");

export const useAnimatedVisibility = ({ style, visible, onVisible, className, enteringAnimationName, exitingAnimationName, onHidden, animationDuration = 300, animationTimingFunction, ...props }: IAnimatedVisibilityProps) => {
    const [isRendering, setIsRendering] = useStateCallback(false);
    const wasVisible = useRef(false);
    const wasRendering = useRef(false);
    const enteringAnimation = useMemo(() => {
        if (isNonNullString(enteringAnimationName) && keyframes[enteringAnimationName]) {
            return enteringAnimationName;
        }
        return 'fade-in';
    }, [enteringAnimationName]);
    const exitingAnimation = useMemo(() => {
        if (isNonNullString(exitingAnimationName) && keyframes[exitingAnimationName]) {
            return exitingAnimationName;
        }
        return 'fade-out';
    }, [exitingAnimationName]);
    const animationEndCallback = useCallback(
        (e?: any) => {
            console.log(e, " is animation callback end");
            if (e && e?.currentTarget && e?.currentTarget !== e?.target) {
                return;
            }
            if (visible) {
                if (typeof onVisible === 'function') {
                    onVisible();
                }
            } else {
                setIsRendering(false);
            }
        },
        [onVisible, visible]
    );
    const animationName = visible ? enteringAnimation : exitingAnimation;
    const isAnimated = !!animationName && animationName //!== "none";
    useEffect(() => {
        if (wasRendering.current && !isRendering && typeof onHidden === 'function') {
            onHidden();
        }
        wasRendering.current = isRendering;
    }, [isRendering, onHidden]);

    useEffect(() => {
        if (visible) {
            setIsRendering(true);
        }
        if (visible !== wasVisible.current && !isAnimated && typeof animationEndCallback === 'function') {
            animationEndCallback();
        }
        wasVisible.current = !!visible;
    }, [isAnimated, visible, animationEndCallback]);
    animationTimingFunction = isNonNullString(animationTimingFunction) ? animationTimingFunction : visible ? 'ease-in' : 'ease-out';
    return {
        style: [
            !visible ? { pointerEvents: "none", opactity: 0 } : { opactity: 1 },
            isNumber(animationDuration) && animationDuration > 0 ? { animationDuration } : {},
            { animationTimingFunction },
            style,
        ],
        shouldRender: isRendering || visible,
        className: cn(className, `resk-animated-visibility-${visible ? 'visible' : 'invisible'}`, 'resk-animated-visibility', visible ? "visible" : "invisible", isRendering && [animationName, animationTimingFunction]),
        animationTimingFunction,
        isRendering,
        setIsRendering,
        wasVisible,
        visible,
        wasRendering,
        isAnimated,
        onAnimationEnd: animationEndCallback,
        animationName,
        enteringAnimation,
        exitingAnimation,
    }
}