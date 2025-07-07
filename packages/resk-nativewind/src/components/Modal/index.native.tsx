"use client";
import { Modal as RNModal } from "react-native";
import { IModalProps } from "./types";
import { defaultStr } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { cn } from "@utils/cn";

export function Modal({ children, visible, testID, backdropClassName, ...props }: IModalProps) {
    testID = defaultStr(testID, "resk-modal");
    return <RNModal transparent {...props} visible={!!visible}>
        <Backdrop
            testID={testID + "-modal-backdrop"}
            className={cn("resk-modal-backdrop", backdropClassName)}
            onPress={props.onRequestClose}
        />
        {children}
    </RNModal>
}