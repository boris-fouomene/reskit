"use client";
import { IHtmlDivProps } from "@html/types";
import { ReactNode } from "react";

export function CloseAlert({ closeIcon }: IHtmlDivProps & { closeIcon: ReactNode, isOpen: boolean, open: () => void, close: () => void }) {
    return <>{closeIcon}</>;
}