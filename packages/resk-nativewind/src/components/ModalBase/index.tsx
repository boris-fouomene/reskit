"use client";
import { IModalBaseProps } from "./types";
import { ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./styles.css";
import { normalizeGestureEvent } from "@html/events";
import { IClassName } from "@src/types";
import { classes } from "@variants/classes";
import { StyleSheet, View } from "react-native";
import { cn } from "@utils/cn";
import { defaultStr, getMaxZindex } from "@resk/core/utils";
import { useAccessibilityEscape } from "@html/accessibility";
import { Div } from "@html/Div";



export function ModalBase({ animationType, onAccessibilityEscape, onRequestClose, className: modalClassName, id, transparent, style, children, onDismiss, onShow, visible, ...props }: IModalBaseProps): ReactNode {
    const [isRendering, setIsRendering] = useState(false);
    const wasVisible = useRef(false);
    const wasRendering = useRef(false);
    const generatedId = useId();
    const modalId = defaultStr(id, generatedId);
    useAccessibilityEscape(`#{${modalId}`, function () {
        if (typeof onAccessibilityEscape === "function") {
            onAccessibilityEscape();
        }
        if (typeof onRequestClose == "function") {
            onRequestClose(undefined as any);
        }
    });
    const isAnimated = animationType && animationType !== 'none';
    const onAnimationEnd = useCallback(
        (e: any) => {
            console.log(e, " is ending animation ", e?.currentTarget)
            if (e && e?.currentTarget && e?.currentTarget !== e?.target) {
                return;
            }
            if (visible) {
                if (typeof onShow === "function") {
                    onShow(e && e?.target ? normalizeGestureEvent(e) : undefined);
                }
            } else {
                setIsRendering(false);
            }
        },
        [onShow, visible]
    );

    useEffect(() => {
        if (wasRendering.current && !isRendering && typeof onDismiss === "function") {
            onDismiss();
        }
        wasRendering.current = isRendering;
    }, [isRendering, onDismiss]);

    useEffect(() => {
        if (visible) {
            setIsRendering(true);
        }
        if (visible !== wasVisible.current && !isAnimated) {
            onAnimationEnd(undefined);
        }
        wasVisible.current = visible as boolean;
    }, [isAnimated, visible, onAnimationEnd]);
    const rProps = { onAnimationEnd };
    const canRender = isRendering || visible;
    const className = useMemo(() => {
        const animatedStyle = visible ? "resk-modal-animated-in" : "resk-modal-animated-out";
        const className: IClassName = [];
        if (animationType === 'slide') {
            className.push(visible ? "resk-modal-slide-in" : "resk-modal-slide-out");
            className.push(animatedStyle);
        } else if (animationType === 'fade') {
            className.push(visible ? "resk-modal-fade-in" : "resk-modal-fade-out");
            className.push(animatedStyle);
        }
        if (visible) {
            className.push(classes.absoluteFill);
        } else {
            className.push("resk-modal-hidden");
        }
        return className;
    }, [canRender, visible, modalClassName, animationType]);
    const zIndex = useMemo(() => {
        if (!visible) return 0;
        return Math.max(getMaxZindex(), 1000) + 1;
    }, [visible]);
    return canRender ? <Div
        {...props}
        {...rProps}
        id={modalId}
        role="dialog"
        className={cn(className, modalClassName, transparent && "bg-transparent", "resk-modal")}
        style={StyleSheet.flatten([{ zIndex }, style])}
    >
        {children}
    </Div> : null;
}