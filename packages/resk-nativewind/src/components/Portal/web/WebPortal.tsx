"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { IPortalProps } from '../types';
import { normalizeGestureEvent } from '@html/events';
import allVariants from '@variants/all';
import { StyleSheet } from 'react-native';
import { Div } from "@html/Div";
import { useAccessibilityEscape } from '@html/accessibility';
import { getClasses } from '../utils';
import { isNextJs } from '@platform/isNext';


export function Portal({ children, onAccessibilityEscape, style, className, onPress, withBackdrop, visible, absoluteFill, id, testID }: IPortalProps) {
    const { visibleClassName, backdropClassName, handleBackdrop } = getClasses({ visible, absoluteFill, withBackdrop });
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    const [shouldRender, setShouldRender] = useState(typeof document !== "undefined" && typeof document.body !== "undefined" && !isNextJs());
    useEffect(() => {
        if (!shouldRender && typeof document !== "undefined" && typeof document.body !== "undefined") {
            setShouldRender(true);
        }
    }, []);
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
    useAccessibilityEscape(target, onAccessibilityEscape);
    if (!shouldRender) return null;
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
        className={cn(hasOnPress && "pointer-events-auto", "portal", allVariants({ backdrop: withBackdrop }), backdropClassName, className, visibleClassName)}
    >
        {visible ? children : null}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
};