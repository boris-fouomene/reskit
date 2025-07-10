"use client";
import { Dialog } from "@components/Dialog";

export function Providers() {
    return <>
        <Dialog.Provider.Component />
        <Dialog.Alert.Component />
    </>
}