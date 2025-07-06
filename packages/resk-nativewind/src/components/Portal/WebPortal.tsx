"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useId, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { IPortalProps } from './types';
import { normalizeGestureEvent } from '@html/events';
import { StyleSheet } from 'react-native';
import { Div } from "@html/Div";
import { useAccessibilityEscape } from '@html/accessibility';
import { usePortal } from './hooks';
import { classes } from '@variants/classes';


export function Portal({ children, onAccessibilityEscape, style, onPress, visible, id, testID, ...props }: IPortalProps) {
    const { className, shouldRender, backdropClassName, handleBackdrop } = usePortal({ ...props, visible });
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    useAccessibilityEscape(target, onAccessibilityEscape);
    const zIndex = useMemo(() => {
        if (!visible) {
            return 0;
        }
        return Math.max(getMaxZindex(), 1000) + 1;
    }, [visible]);
    if (!shouldRender || typeof document === "undefined" || !document) return null;
    const hasOnPress = typeof onPress == "function";
    return createPortal(<Div
        id={targetId}
        testID={defaultStr(testID, "portal-" + targetId)}
        style={StyleSheet.flatten([{ zIndex }, style])}
        className={cn(hasOnPress && "pointer-events-auto", "portal", className)}
    >
        {handleBackdrop && visible ? <Div
            testID={testID + "-backdrop"}
            className={cn("portal-backdrop", "flex-1 w-full h-full", visible ? "opacity-50" : "opacity-0", classes.absoluteFill, backdropClassName)}
            onPress={onPress}
        /> : null}
        {children}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
};