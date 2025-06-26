"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { styles } from './utils';
import { IPortalProps } from './types';
import { normalizeGestureEvent } from '@html/events';
import allVariants from '@variants/all';
import { StyleSheet } from 'react-native';
import { classes } from '@variants/classes';
import { Div } from "@html/Div";
import { useAnimatedVisibility } from '@utils/animations';
import { useAccessibilityEscape } from '@html/accessibility';
import { PortalStateContext } from './context';


export function Portal({ children, onAccessibilityEscape, style, className, animationDuration, onPress, withBackdrop, visible, absoluteFill, id, testID }: IPortalProps) {
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const target = `#${targetId}`;
    const { shouldRender, ...rest } = useAnimatedVisibility({ visible, duration: animationDuration });
    useAccessibilityEscape(target, onAccessibilityEscape, shouldRender);
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
        style={StyleSheet.flatten([absoluteFill && styles.absoluteFill, { zIndex: Math.max(getMaxZindex(), 1000) }, style])}
        className={cn(absoluteFill && classes.absoluteFill, hasOnPress && "pointer-events-auto", "portal", allVariants({ backdrop: withBackdrop }), className)}
    >
        <PortalStateContext.Provider value={{ shouldRender, ...rest }}>
            {children}
        </PortalStateContext.Provider>
    </Div>, document.querySelector("#root") || document.body);
};

export * from "./hooks";