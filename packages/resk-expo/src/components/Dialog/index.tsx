import Dialog from "./Dialog";
import DialogControlled from "./Controlled";
//import DialogActions from "./DialogActions";
//import DialogAppBar from "./DialogAppBar";
//import DialogTitle from "./DialogTitle";
//import DialogFooter from "./DialogFooter";
import Provider from "./Provider";
import Preloader from "./Preloader";


export * from "./types";
export * from "./Controlled";
export { Preloader };

type DialogComponent = typeof Dialog & {
    //Actions: typeof DialogActions;
    //AppBar: typeof DialogAppBar;
    //Title: typeof DialogTitle;
    //Footer: typeof DialogFooter;
    Provider: typeof Provider;
    Controlled: typeof DialogControlled;
}

const DialogComponent = Dialog as DialogComponent;
//DialogComponent.Title = DialogTitle;
//DialogComponent.Footer = DialogFooter;
DialogComponent.Provider = Provider;
DialogComponent.Provider.displayName = "Dialog.Provider";
DialogComponent.Controlled;
export { DialogComponent as Dialog };

