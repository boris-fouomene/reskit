"use client";
import { IHtmlDivProps } from "@html/types";
import { defaultStr, isNumber } from "@resk/core/utils";
import { IClassName } from "@src/types";
import { cn } from "@utils/cn";
import useStateCallback from "@utils/stateCallback";
import { MouseEvent, useCallback, useEffect, useId, useRef } from "react";

interface IWebRipplePops extends IHtmlDivProps {
    rippleDuration?: number
    color?: string
    className?: IClassName,
    targetSelector?: string
}

export function RippleContent({ rippleDuration, targetSelector, className }: IWebRipplePops) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const id = useId();
    targetSelector = defaultStr(targetSelector, ".resk-btn");
    const clearRipple = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }
    const [rippleStyle, setRippleStyle] = useStateCallback({
        position: 'absolute',
        borderRadius: '50%',
        opacity: 0,
        width: 35,
        height: 35,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
    });
    const handleRipple = useCallback((event: MouseEvent) => {
        if (!event || !event.currentTarget) return;
        event?.stopPropagation()
        const { pageX, pageY, currentTarget } = event;
        const rect = currentTarget.getBoundingClientRect()
        const left = pageX - (rect.left + window.scrollX)
        const top = pageY - (rect.top + window.scrollY)
        const size = Math.max(rect.width, rect.height);
        setRippleStyle((prev) => {
            return { ...prev, left, top, opacity: 1, transform: 'translate(-50%, -50%)', transition: 'initial', }
        }, () => {
            timerRef.current = setTimeout(() => {
                clearRipple();
                setRippleStyle((prev) => {
                    return { ...prev, opacity: 0, transform: `scale(${size / 9})`, transition: `all ${rippleDuration}ms` }
                });
            }, 50)
        })
    }, [rippleDuration])
    useEffect(() => {
        clearRipple();
        if (typeof document === 'undefined') return;
        try {
            const element = document.querySelector(`#${id}`);
            if (element) {
                const rippleElement = element.closest(targetSelector);
                if (rippleElement) {
                    rippleElement.addEventListener("click", handleRipple as any);
                    return () => {
                        rippleElement.removeEventListener("click", handleRipple as any);
                    }
                }
            }
        } catch (e) { }
    }, [targetSelector, handleRipple]);
    useEffect(() => {
        return () => {
            clearRipple();
        }
    }, [])
    rippleDuration = isNumber(rippleDuration) && rippleDuration > 0 ? rippleDuration : 600;
    return <s id={id} className={cn("resk-ripple absolute", className)} style={rippleStyle as any} />
}