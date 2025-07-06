"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { IPortalProps } from './types';
import { StyleSheet } from 'react-native';
import { Div } from "@html/Div";
import { useAccessibilityEscape } from '@html/accessibility';
import { usePortal } from './hooks';


export function Portal({ children, onAccessibilityEscape, style, onPress, visible, id, testID, ...props }: IPortalProps) {
    const { className, shouldRender, backdropClassName, handleBackdrop } = usePortal({ ...props, visible, onPress });
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
    return createPortal(<Div
        id={targetId}
        testID={defaultStr(testID, "portal-" + targetId)}
        style={StyleSheet.flatten([{ zIndex }, style])}
        className={cn("portal", className)}
    >
        {handleBackdrop ? <Div
            testID={testID + "-backdrop"}
            className={cn("portal-backdrop", backdropClassName)}
            onPress={onPress}
        /> : null}
        {children}
    </Div>, document.querySelector("#reskit-app-root") || document.body);
};