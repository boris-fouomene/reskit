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
export default class Preloader extends createProvider<IPreloaderProps, DialogControlled, IPreloaderProps>(
    DialogControlled,
    { dismissable: false, fullScreen: false, isProvider: true, isPreloader: true },
    (options) => {
        options.isPreloader = true;
        options.isProvider = true;
        return options;
    }
) { }

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