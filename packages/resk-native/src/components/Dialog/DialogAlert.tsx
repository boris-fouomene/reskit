import DialogControlled, { IDialogControlledProps } from "./Controlled";
import { createProvider, isValidElement } from "@utils";
import { isNonNullString } from "@resk/core/utils";
import i18n from "@resk/core/i18n";
import { IAppBarAction } from "@components/AppBar";
import { ReactNode } from "react";
import Label from "@components/Label";
import Theme from "@theme/index";


/**
 * A DialogAlert class that extends the DialogControlled component.
 * This class provides a way to display alert dialogs with customizable buttons and messages.
 * 
 * @extends createProvider
 * @see {@link createProvider}
 */
export default class DialogAlert extends createProvider<IDialogControlledProps, DialogControlled>(DialogControlled, { isProvider: true, dismissable: false, fullScreen: false }) {
    /**
     * Opens an alert dialog with the specified properties.
     * 
     * This static method retrieves the instance of the DialogAlert and calls its open method.
     * It allows for customization of the dialog through the provided properties.
     * @template {Context}, A generic type parameter that extends the context of the dialog actions
     * @param props - The properties to customize the dialog.
     * @param props.message - The message to display in the dialog.
     * @param props.onOk - The callback function to call when the OK button is pressed.
     * @param props.okButton - The OK button properties.
     * @param props.cancelButton - The cancel button properties.
     * @param props.onCancel - The callback function to call when the cancel button is pressed.
     * @param innerProviderRef - An optional reference to access the instance of the DialogControlled.
     * @param callback - An optional callback function that is called after opening the dialog.
     * 
     * @returns The result of the open method or undefined if the instance is not valid.
     * 
     * @example
     * DialogAlert.open({
     *   message: "Are you sure you want to delete this item?",
     *   onOk: () => console.log("OK button pressed"),
     *   onCancel: () => console.log("Cancel button pressed"),
     * });
     */
    static open<Context = any>(props: IDialogControlledProps & { message?: ReactNode, onOk?: IAppBarAction<Context>["onPress"], okButton?: false | IAppBarAction<Context>, cancelButtonBefore?: boolean, cancelButton?: false | IAppBarAction<Context>, onCancel?: IAppBarAction<Context>["onPress"] }, innerProviderRef?: any, callback?: Function) {
        const instance = this.getProviderInstance(innerProviderRef);
        if (!instance || typeof instance?.open !== "function") return;
        const { okButton: oButton, message, cancelButton: cButton, onOk, onCancel, cancelButtonBefore, children, ...rest } = Object.assign({}, props);
        const okButton = oButton === false ? undefined : Object.assign({}, oButton);
        console.log(okButton, " is opening dialog");
        if (okButton) {
            const { onPress: onOkPress } = okButton;
            okButton.onPress = async (event, context) => {
                try {
                    const r = typeof onOkPress == "function" ? await onOkPress(event, context) : typeof onOk == "function" ? await onOk(event, context) : undefined;
                    if (r !== false) {
                        instance.close();
                    }
                    return r;
                } catch (e) { }
            }
            okButton.label = okButton.label || i18n.t("dialog.alertOkButton");
            okButton.colorScheme = isNonNullString(okButton.colorScheme) ? okButton.colorScheme : "primary";
        }
        const cancelButton = cButton === false ? undefined : Object.assign({}, cButton);
        if (cancelButton) {
            cancelButton.label = cancelButton.label || i18n.t("dialog.alertCancelButton");
            cancelButton.colorScheme = isNonNullString(cancelButton.colorScheme) ? cancelButton.colorScheme : "error";
            if (typeof cancelButton.onPress !== "function" && typeof onCancel === "function") {
                cancelButton.onPress = onCancel;
            }
        }
        const actions = Array.isArray(props?.actions) && props.actions.length ? props?.actions : [cancelButtonBefore ? cancelButton : okButton, cancelButtonBefore ? okButton : cancelButton];
        return instance.open(Object.assign({}, { dismissable: false, children: <Label testID="resk-dialog-alert-label" style={Theme.styles.ph1} children={(isValidElement(children, true) && children || message) as ReactNode} /> }, instance?.props, rest, { fullScreen: false, actions }), callback);
    };
}