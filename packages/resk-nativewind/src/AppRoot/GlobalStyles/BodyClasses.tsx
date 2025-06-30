"use client";
import { addClassName, isDOMElement, removeClassName } from "@resk/core/utils";
import { useBreakpoints } from "@utils/breakpoints";
import { useEffect } from "react";
import Platform from "@resk/core/platform";

export function BodyClasses() {
    const { isMobile, isTablet, isDesktop } = useBreakpoints();
    useEffect(() => {
        if (typeof document !== 'undefined' && document && isDOMElement(document.body) && typeof window !== "undefined" && window) {
            const body = document.body;
            removeClassName(body, "mobile tablet desktop");
            const className = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
            addClassName(body, className);
            removeClassName(body, "not-touch-device");
            removeClassName(body, "is-touch-device");
            addClassName(body, Platform.isTouchDevice() ? "is-touch-device" : "not-touch-device");
        }
    }, [isMobile, isTablet, isDesktop]);
    return null; // This component does not render anything
}