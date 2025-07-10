
import { IClassName } from "@src/types";
import { ModalProps } from "react-native";

export interface IModalProps extends Omit<ModalProps, "onShow" | "onRequestClose"> {
    onShow?: (event: any) => void;
    onRequestClose?: (event: any) => void;

    /**
     * The class name of the backdrop
     */
    backdropClassName?: IClassName;

    /**
     * Whether the modal can be dismissed by the user.
     * @default : true
     */
    dismissible?: boolean;
}