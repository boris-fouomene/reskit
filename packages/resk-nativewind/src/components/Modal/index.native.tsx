"use client";
import { Modal as RNModal, View } from "react-native";
import { IModalProps } from "./types";
import { Backdrop } from "@components/Backdrop";
import { usePrepareModal } from "./hook";
import { defaultStr } from "@resk/core/utils";

export function Modal({ children, backdropClassName, testID, contentClassName, ...props }: IModalProps) {
    const preparedModal = usePrepareModal({ backdropClassName, variant: props.variant, contentClassName });
    testID = defaultStr(testID, "resk-modal");
    return <RNModal transparent {...props}>
        {<Backdrop testID={testID + "-modal-backdrop"} className={preparedModal.backdropClassName} onPress={props.onRequestClose} />}
        <View className={preparedModal.contentClassName} testID={testID + "-modal-content"}>
            {children}
        </View>
    </RNModal>
}