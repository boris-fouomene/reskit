
import { ModalProps } from "react-native";

export interface IModalBaseProps extends Omit<ModalProps, "onShow" | "onRequestClose"> {
    onShow?: (event: any) => void;
    onRequestClose?: (event: any) => void;
}