export interface IAlertHook {
    isOpen: boolean;
    open?: () => void;
    close?: () => void;
    shouldRender: boolean;
    className?: string;
}