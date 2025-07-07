"use client";
import { Modal as RNModal } from "react-native";
import { IModalProps } from "./types";
import { defaultStr } from "@resk/core/utils";

export function Modal({ children, testID, ...props }: IModalProps) {
    testID = defaultStr(testID, "resk-modal");
    return <RNModal transparent {...props}>
        {children}
    </RNModal>
}