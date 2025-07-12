"use client";
import { IModalProps } from "./types";
import { JSX, ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./styles.css";
import { normalizeGestureEvent } from "@html/events";
import { IClassName } from "@src/types";
import { classes } from "@variants/classes";
import { StyleSheet } from "react-native";
import { cn } from "@utils/cn";
import { addClassName, defaultStr, getMaxZindex } from "@resk/core/utils";
import { useAccessibilityEscape } from "@html/accessibility";
import { Div } from "@html/Div";
import { createPortal } from "react-dom";
import { Backdrop } from "@components/Backdrop";
import { commonVariant } from "@variants/common";


const hiddenStyle = "resk-modal-hidden opacity-0 invisible";
export function Modal({ animationType = "fade", dismissible, withBackdrop, backdropClassName, onAccessibilityEscape, testID, onRequestClose, className: modalClassName, id, transparent = true, style, children, onDismiss, onShow, visible, ...props }: IModalProps): JSX.Element | null {
    const [isRendering, setIsRendering] = useState(false);
    const wasVisible = useRef(false);
    const wasRendering = useRef(false);
    const generatedId = useId();
    const dismissibleRef = useRef(dismissible !== false);
    dismissibleRef.current = dismissible !== false;
    const modalId = defaultStr(id, generatedId);
    useAccessibilityEscape(`#${modalId}`, function () {
        if (typeof onAccessibilityEscape === "function") {
            onAccessibilityEscape();
        }
        if (!dismissibleRef.current) return;
        if (typeof onRequestClose == "function") {
            onRequestClose(undefined as any);
        }
    });
    const isAnimated = animationType && animationType !== 'none';
    const onAnimationEnd = useCallback(
        (e: any) => {
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
        if (!isRendering) return [hiddenStyle]
        const animatedStyle = visible ? "resk-modal-animated-in" : "resk-modal-animated-out";
        const className: IClassName = [classes.absoluteFill];
        if (animationType === 'slide') {
            className.push(visible ? "resk-modal-slide-in" : "resk-modal-slide-out");
            className.push(animatedStyle);
        } else if (animationType === 'fade') {
            className.push(visible ? "resk-modal-fade-in" : "resk-modal-fade-out");
            className.push(animatedStyle);
        } else {
            if (!visible) {
                className.push(hiddenStyle);
            }
        }
        return className;
    }, [isRendering, visible, animationType]);
    const zIndex = useMemo(() => {
        if (!visible) return 0;
        return Math.max(getMaxZindex(), 1000) + 1;
    }, [visible]);
    if (!canRender || typeof document === "undefined" || !document) return null;
    testID = defaultStr(testID, "resk-modal");
    return createPortal(<Div
        {...props}
        {...rProps}
        testID={testID}
        id={modalId}
        role="dialog"
        className={cn("flex flex-col flex-1", className, modalClassName, "bg-transparent", "resk-modal")}
        style={StyleSheet.flatten([{ zIndex }, style])}
    >
        {backdropClassName && withBackdrop !== false ? <Backdrop
            testID={testID + "-modal-backdrop"}
            className={cn("resk-modal-backdrop", commonVariant({ backdrop: withBackdrop }), !visible && "pointer-events-none", backdropClassName)}
        /> : null}
        {children}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
}