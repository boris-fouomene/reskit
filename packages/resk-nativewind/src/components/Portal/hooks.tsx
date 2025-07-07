"use client";
import { useEffect, useState } from "react";
import { IPortalProps } from "./types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";
import allVariants from "@variants/all";
import Platform from "@platform";
import { isNextJs } from "@platform/isNext";

export const usePortal = ({ visible, className, backdropClassName, onPress, absoluteFill, withBackdrop }: Partial<IPortalProps>) => {
    const [shouldRender, setShouldRender] = useState(!!(Platform.isNative() && (!isNextJs() && typeof document !== "undefined" && document)));
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        if (!shouldRender) {
            setShouldRender(true);
        }
    }, []);
    useEffect(() => {
        if (visible) {
            setIsAnimating(true);
        }
    }, [visible]);
    return {
        className: cn("inset-0 web:transition-all transition ease-in-out duration-300", absoluteFill && classes.absoluteFill, visible ? ["opacity-100 visible pointer-events-auto"] : ["opacity-0 invisible pointer-events-none"], className),
        backdropClassName: cn("inset-0 flex-1 w-full h-full transition-opacity duration-300 ease-in-out", visible ? "opacity-50" : "opacity-0", classes.absoluteFill, allVariants({ backdrop: withBackdrop }), backdropClassName),
        visible,
        shouldRender: shouldRender && visible,
        handleBackdrop: withBackdrop || absoluteFill || typeof onPress === "function",
    }
}