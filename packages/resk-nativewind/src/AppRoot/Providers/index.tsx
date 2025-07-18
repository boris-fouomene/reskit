"use client";
import { Dialog, Preloader } from "@components/Dialog";
import { Drawer } from "@components/Drawer";
import { useHydrationStatus } from "@utils/useHydrationStatus";

export function Providers() {
    const hydrationStatus = useHydrationStatus();
    if (!hydrationStatus) return null;
    return <>
        <Dialog.Provider.Component testID={"resk-dialog-provider"} />
        <Dialog.Alert.Component testID={"resk-dialog-alert-provider"} />
        <Preloader.Component testID={"resk-preloader-provider"} />
        <Drawer.Provider.Component />
    </>
}