import DialogControlled, { IDialogControlledProps } from "./Controlled";
import { createProvider } from "@utils";

/**
 * A DialogProvider component that extends the DialogControlled component.
 * 
 * This class serves as a provider for managing dialog instances, allowing dialogs to be opened
 * and closed programmatically. It simplifies the interaction with dialog components within an application.
 * 
 * @extends createProvider
 * @see {@link createProvider}
 */
export default class DialogProvider extends createProvider<IDialogControlledProps, DialogControlled>(DialogControlled, { isProvider: true, dismissable: false }) {

  /**
   * Opens a dialog with the specified properties.
   * 
   * This static method retrieves the instance of the DialogProvider and calls its open method.
   * It allows for customization of the dialog through the provided properties.
   * 
   * @param props - The properties to customize the dialog.
   * @param innerProviderRef - An optional reference to access the instance of the DialogControlled.
   * @param callback - An optional callback function that is called after opening the dialog.
   * 
   * @returns The result of the open method or undefined if the instance is not valid.
   * 
   * @example
   * DialogProvider.open({ title: "Confirmation", message: "Are you sure?" }, myRef, () => {
   *     console.log("Dialog opened");
   * });
   */
  static open(props: IDialogControlledProps, innerProviderRef?: any, callback?: Function) {
    const instance = this.getProviderInstance(innerProviderRef);
    if (!instance || typeof instance?.open !== "function") return;
    return instance.open(props, callback);
  };

  /**
   * Closes the currently open dialog.
   * 
   * This static method retrieves the instance of the DialogProvider and calls its close method.
   * It can also pass properties to the close method for any necessary cleanup.
   * 
   * @param innerProviderRef - An optional reference to access the instance of the DialogControlled.
   * @param callback - An optional callback function that is called after closing the dialog.
   * 
   * @returns The result of the close method or undefined if the instance is not valid.
   * 
   * @example
   * DialogProvider.close({ result: "Confirmed" }, myRef, () => {
   *     console.log("Dialog closed");
   * });
   */
  static close(innerProviderRef?: any, callback?: Function) {
    const instance = this.getProviderInstance(innerProviderRef);
    if (!instance || typeof instance?.close !== "function") return;
    return instance.close(callback);
  }
}