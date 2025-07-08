import { useState } from "react";
import { IAlertHook } from "./types";

export const useAlert = (): IAlertHook => {
    const [isOpen, setIsOpen] = useState(true);
    return {
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen,
    }
}