"use client";
import { Modal as RNModal } from "react-native";
import { IModalProps } from "./types";
import { defaultStr } from "@resk/core/utils";
import { Backdrop } from "@components/Backdrop";
import { cn } from "@utils/cn";
import { JSX } from "react";
import { commonVariant } from "@variants/common";

export function Modal({ children, dismissible, withBackdrop, visible, onRequestClose, testID, backdropClassName, ...props }: IModalProps): JSX.Element {
    testID = defaultStr(testID, "resk-modal");
    return <RNModal animationType="fade"  {...props} visible={!!visible} transparent>
        {backdropClassName && withBackdrop !== false ? <Backdrop
            testID={testID + "-modal-backdrop"}
            className={cn("resk-modal-backdrop", commonVariant({ backdrop: withBackdrop }), backdropClassName)}
        /> : null}
        {children}
    </RNModal>
}