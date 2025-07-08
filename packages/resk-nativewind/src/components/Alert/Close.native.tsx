import { ReactNode } from "react";

export function CloseAlert({ closeIcon }: { closeIcon: ReactNode, isOpen: boolean, open: () => void, close: () => void }) {
    return <>{closeIcon}</>;
}