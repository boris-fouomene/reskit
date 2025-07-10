"use client";
import { Modal as RNModal } from "react-native";
import { IModalProps } from "./types";
import { defaultStr } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { cn } from "@utils/cn";
import { JSX } from "react";

export function Modal({ children, dismissible, visible, onRequestClose, testID, backdropClassName, ...props }: IModalProps): JSX.Element {
    testID = defaultStr(testID, "resk-modal");
    return <RNModal animationType="fade"  {...props} visible={!!visible} transparent>
        <Backdrop
            testID={testID + "-modal-backdrop"}
            className={cn("resk-modal-backdrop", backdropClassName)}
            onPress={dismissible != false ? onRequestClose : undefined}
        />
        {children}
    </RNModal>
}