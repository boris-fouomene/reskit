"use client";
import { useEffect, useState } from "react";
import { IPortalProps } from "./types";
import { cn } from "@utils/cn";
import { classes } from "@variants/classes";
import allVariants from "@variants/all";
import Platform from "@platform";

export const usePortal = ({ visible, className, absoluteFill, withBackdrop }: Partial<IPortalProps>) => {
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const computedClass = visible ? ["pointer-events-auto opacity-100 visible"] : ["pointer-events-none opacity-0 invisible"];
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (visible) {
            setIsAnimating(true);
        }
        return () => { };
    }, [visible]);

    return {
        className: cn(absoluteFill && classes.absoluteFill, computedClass, className),
        backdropClassName: cn(allVariants({ backdrop: withBackdrop })),
        visible,
        shouldRender: mounted,
        handleBackdrop: withBackdrop || absoluteFill,
    }
}