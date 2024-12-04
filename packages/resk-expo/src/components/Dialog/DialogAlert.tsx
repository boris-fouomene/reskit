import DialogControlled, { IDialogControlledProps } from "./Controlled";
import { createProvider } from "@utils";


export default class DialogAlert extends createProvider<IDialogControlledProps, DialogControlled>(DialogControlled, { isProvider: true, dismissable: false }) {
    static open(props: IDialogControlledProps, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open(props, callback);
    };

    static close(props?: IDialogControlledProps, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props, callback);
    }
}