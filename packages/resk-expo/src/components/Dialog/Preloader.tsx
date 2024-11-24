import DialogControlled, { IDialogControlledProps, IDialogControlledState } from "./Controlled";
import { IDialogProps } from "./types";
import { createProvider } from "@utils";

/**
 * A Preloader component that extends the DialogControlled component.
 * 
 * This class acts as a provider for a preloader dialog, allowing it to be opened and closed
 * programmatically. It is designed to be used as a loading indicator and can be configured
 * to be dismissible or full-screen.
 * 
 * @extends createProvider
 * @see {@link createProvider}
 */
export default class Preloader extends createProvider<IPreloaderProps, DialogControlled>(
    DialogControlled,
    { dismissable: false, fullScreen: false, isProvider: true, isPreloader: true }
) {
    /**
     * Opens the preloader dialog.
     * 
     * This static method retrieves the instance of the Preloader and calls its open method.
     * It merges the provided properties with default values to configure the dialog.
     * 
     * @param props - Optional properties to customize the preloader dialog.
     * @param ref - An optional ref to access the instance of the DialogControlled.
     * @param callback - An optional callback function that is called after opening the dialog.
     * 
     * @returns The result of the open method or undefined if the instance is not valid.
     * 
     * @example
     * Preloader.open({ title: "Loading...", message: "Please wait..." }, myRef, () => {
     *     console.log("Preloader opened");
     * });
     */
    static open = (props?: IPreloaderProps, ref?: React.RefObject<DialogControlled>, callback?: Function) => {
        const instance = this.getProviderInstance(ref);
        if (!instance || typeof instance?.open !== "function") return;
        return instance.open({
            ...Object.assign({}, props),
            isPreloader: true,
            isProvider: true,
        }, callback);
    }

    /**
     * Closes the preloader dialog.
     * 
     * This static method retrieves the instance of the Preloader and calls its close method.
     * It passes the provided properties to the close method for any necessary cleanup.
     * 
     * @param props - Optional properties for closing the preloader dialog.
     * @param ref - An optional ref to access the instance of the DialogControlled.
     * @param callback - An optional callback function that is called after closing the dialog.
     * 
     * @returns The result of the close method or undefined if the instance is not valid.
     * 
     * @example
     * Preloader.close({ message: "Done!" }, myRef, () => {
     *     console.log("Preloader closed");
     * });
     */
    static close(props?: IPreloaderProps, ref?: React.RefObject<DialogControlled>, callback?: Function) {
        const instance = this.getProviderInstance(ref);
        if (!instance || typeof instance?.close !== "function") return;
        return instance.close(props as IDialogProps, callback);
    }
}

/**
 * Interface for the properties specific to the Preloader component.
 * 
 * This interface extends the IDialogControlledProps to include properties
 * that are specific to the Preloader's behavior.
 * 
 * @interface IPreloaderProps
 * @extends IDialogControlledProps
 */
export interface IPreloaderProps extends IDialogControlledProps { }