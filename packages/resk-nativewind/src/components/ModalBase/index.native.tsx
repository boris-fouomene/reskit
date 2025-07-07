import { Modal } from "react-native";
import { IModalBaseProps } from "./types";

export function ModalBase(props: IModalBaseProps) {
    return <Modal {...props} />
}