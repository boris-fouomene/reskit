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
export default class DialogProvider extends createProvider<IDialogControlledProps, DialogControlled, IDialogControlledProps>(DialogControlled, { isProvider: true, dismissable: false }) { }