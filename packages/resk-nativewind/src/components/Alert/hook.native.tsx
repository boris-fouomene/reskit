import { useState } from "react";
import { IAlertHook } from "./types";
import useStateCallback from "@utils/stateCallback";

export const useAlert = (): IAlertHook => {
    const [isOpen, setIsOpen] = useStateCallback(true);
    const [shouldRender, setShouldRender] = useState(true);
    return {
        open: () => setIsOpen(true),
        close: () => setIsOpen(false, () => {
            setTimeout(() => {
                setShouldRender(false)
            }, 300);
        }),
        isOpen,
        shouldRender,
    }
}