import { useState } from "react";

export const useAlert = ({ }: {}) => {
    const [isOpen, setIsOpen] = useState(true);
    return {
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen,
    }
}