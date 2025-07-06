"use client";
import useStateCallback from "@utils/stateCallback";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { IPortalProps } from "./types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";
import allVariants from "@variants/all";
import Platform from "@platform";
import { isNextJs } from "@platform/isNext";
import { isDOMElement } from "@resk/core/utils";
import { InteractionManager } from "react-native";
const isNative = Platform.isNative();

export const usePortal = ({ visible, className, absoluteFill, withBackdrop }: Partial<IPortalProps>) => {
    const [shouldRender, setShouldRender] = useStateCallback(false);
    const shouldRenderRef = useRef(shouldRender);
    shouldRenderRef.current = shouldRender;
    const isMountedRef = useRef(false);
    absoluteFill = absoluteFill !== false;
    const computedClass = visible ? ["pointer-events-auto opacity-100 visible"] : ["pointer-events-none opacity-0 invisible"];
    const visibleRef = useRef(visible);
    visibleRef.current = visible;
    const onAnimationEnd = useCallback((e?: any) => {
        if (isDOMElement(e?.target) && e.currentTarget !== e.target) {
            return;
        }
        console.log("will set should render ", visibleRef.current, className);
        if (shouldRenderRef.current && !visibleRef.current) {
            setShouldRender(false);
        }
    }, []);
    useEffect(() => {
        setShouldRender(true, () => {
            isMountedRef.current = true;
        });
        return () => {
            isMountedRef.current = false;
        }
    }, [])
    useEffect(() => {
        if (visible && !shouldRenderRef.current && isMountedRef.current) {
            setShouldRender(true);
        }
    }, [visible]);
    const interactionRef = useRef(null);
    useLayoutEffect(() => {
        if (!isNative || !isMountedRef.current) return;
        if (interactionRef.current) {
            InteractionManager.clearInteractionHandle(interactionRef.current);
        }
        (interactionRef.current as any) = InteractionManager.createInteractionHandle();
        // Wait for all interactions to complete
        InteractionManager.runAfterInteractions(onAnimationEnd);
        return () => {
            if (interactionRef.current) {
                InteractionManager.clearInteractionHandle(interactionRef.current);
            }
        };
    }, [visible, onAnimationEnd]);
    //const visibleClassName = visible ? "animate-fade-in" : "animate-fade-out";
    return {
        className: cn(absoluteFill && classes.absoluteFill, computedClass, className),
        backdropClassName: cn(allVariants({ backdrop: withBackdrop })),
        visible,
        shouldRender,
        onAnimationEnd,
        handleBackdrop: withBackdrop || absoluteFill,
    }
}