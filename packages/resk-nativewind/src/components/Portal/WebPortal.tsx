"use client";
import { defaultStr, getMaxZindex } from '@resk/core/utils';
import { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@utils/cn';
import { IPortalProps } from './types';
import { StyleSheet, View } from 'react-native';
import { ModalBase } from '@components/ModalBase';
import { isNextJs } from '@platform/isNext';


export function Portal({ children, style, visible, id, className, testID, contentClassName, ...props }: IPortalProps) {
    const [shouldRender, setShouldRender] = useState(!!(!isNextJs() && typeof document !== "undefined" && document));
    useEffect(() => {
        if (!shouldRender) {
            setShouldRender(true);
        }
    }, []);
    const uId = useId();
    const targetId = defaultStr(id, uId);
    const zIndex = useMemo(() => {
        if (!visible) {
            return 0;
        }
        return Math.max(getMaxZindex(), 1000) + 1;
    }, [visible]);
    if (!shouldRender || typeof document === "undefined" || !document) return null;
    testID = defaultStr(testID, "resk-portal");
    return createPortal(<ModalBase
        id={targetId}
        testID={testID}
        {...props}
        visible={visible}
        style={StyleSheet.flatten([{ zIndex }, style])}
        className={cn("resk-portal", className)}
    >
        <View className={cn("resk-portal-content flex-col flex-1 w-full h-full items-start justify-start self-start", contentClassName)} style={[{ zIndex }]} testID={testID + "-portal-content"}>
            {children}
        </View>
    </ModalBase>, document.querySelector("#reskit-app-root") || document.body);
};