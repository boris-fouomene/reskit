"use client";
import { Dialog, Preloader } from "@components/Dialog";
import { Drawer } from "@components/Drawer";

export function Providers() {
    return <>
        <Dialog.Provider.Component testID={"resk-dialog-provider"} />
        <Dialog.Alert.Component testID={"resk-dialog-alert-provider"} />
        <Preloader.Component testID={"resk-preloader-provider"} />
        <Drawer.Provider.Component />
    </>
}