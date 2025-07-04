"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { IPortalProps } from '../types';
import { normalizeGestureEvent } from '@html/events';
import allVariants from '@variants/all';
import { StyleSheet } from 'react-native';
import { classes } from '@variants/classes';
import { Div } from "@html/Div";
import { useAccessibilityEscape } from '@html/accessibility';
import useStateCallback from '@utils/stateCallback';
import { isNextJs } from '@platform/isNext';
import { classes as utilClasses } from '../utils';


export function Portal({ children, onAccessibilityEscape, autoMountChildren, style, className, onPress, withBackdrop, visible, absoluteFill, id, testID }: IPortalProps) {
    const isVisible = !!visible || !!autoMountChildren;
    const [shouldRender, setShouldRender] = useStateCallback(isVisible && !isNextJs());
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    useEffect(() => {
        return () => {
            if (typeof document === "undefined" || !document || !document?.body) return;
            const element = document.querySelector(target) as HTMLElement;
            if (element) {
                try {
                    element.remove();
                } catch (e) {
                    console.error(e, " removing portal element with id ", target);
                }
            }
        }
    }, [target]);
    useAccessibilityEscape(target, onAccessibilityEscape, shouldRender);
    useEffect(() => {
        if (!shouldRender) {
            setShouldRender(true);
        }
    }, []);
    if (!shouldRender || typeof document === "undefined" || !document || !document?.body) return null;
    const hasOnPress = typeof onPress == "function";
    return createPortal(<Div
        onPress={hasOnPress ? function (event) {
            const element = document.querySelector(target) as HTMLElement;
            if ((event as any).target !== element && event.currentTarget !== event.target) return
            onPress(normalizeGestureEvent(event as any));
        } : undefined}
        id={targetId}
        testID={defaultStr(testID, "portal-" + targetId)}
        style={StyleSheet.flatten([{ zIndex: visible ? (Math.max(getMaxZindex(), 1000) + 1) : 0 }, style])}
        className={cn(absoluteFill && classes.absoluteFill, hasOnPress && "pointer-events-auto", "portal", allVariants({ backdrop: withBackdrop }), className, !visible && utilClasses.hidden)}
    >
        {children}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
};