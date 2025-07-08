"use client";
import { Div } from "@html/Div";
import { IAlertHook } from "./types";
import { IHtmlDivProps } from "@html/types";
import { useHydrationStatus } from "@utils/useHydrationStatus";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import { addClassName, isDOMElement, removeClassName } from "@resk/core/utils";
import { TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native";

export function CloseAlert({ children, isOpen, open, close, ...props }: TouchableOpacityProps & IAlertHook) {
    const hydrationStatus = useHydrationStatus();
    const isDocumentAvailable = typeof document !== "undefined" && document;
    const elementRef = useRef<View>(null);
    const closeAlert = useCallback(() => {
        if (!hydrationStatus) return;
        if (typeof close == "function") {
            return close();
        }
        if (isDocumentAvailable && isDOMElement(elementRef.current)) {
            const alertElement = elementRef.current.closest('.resk-alert');
            removeClassName(alertElement, "opacity-100")
            addClassName(alertElement, "opacity-0");
            if (alertElement) {
                setTimeout(() => {
                    try { (alertElement as any)?.remove?.(); } catch (e) { }
                }, 300);
            }
        }
    }, [close, isDocumentAvailable, hydrationStatus]);
    return <TouchableOpacity {...props} ref={elementRef} onPress={closeAlert}>
        {hydrationStatus ? children : <ActivityIndicator
            size={"small"}
            testID="resk-alert-close-icon-loading"
        />}
    </TouchableOpacity>
}