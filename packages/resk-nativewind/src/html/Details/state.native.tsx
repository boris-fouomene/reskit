"use client";
import { useState, useEffect } from 'react'
export const useDetailsState = (open?: boolean): {
    isOpen: boolean;
    toggleOpen?: () => void;
} => {
    const [isOpen, setIsOpen] = useState(!!open);
    useEffect(() => {
        if (typeof open == "boolean" && open !== isOpen) {
            setIsOpen(open);
        }
    }, [!!open])
    return { isOpen: !!open, toggleOpen: () => { setIsOpen(!isOpen) } };
}