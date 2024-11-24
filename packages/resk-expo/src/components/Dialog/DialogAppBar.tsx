import { AppBar } from "@components/AppBar";
import { GestureResponderEvent } from "react-native";
import { IDialogActionsProps } from "./types";
import { useCanRender } from "./utils";

/**
 * A functional component that renders an application bar specifically designed for use within a dialog context.
 * This component integrates with the modal's context to provide functionalities such as back navigation and responsiveness.
 * 
 * @template DialogContextExtend - A generic type parameter that allows for extending the context properties for the dialog.
 * 
 * @param {IDialogActionsProps<DialogContextExtend>} props - The properties for configuring the AppBar.
 * This includes any additional context or actions specific to the dialog's functionality.
 * 
 * @returns {JSX.Element | null} Returns the AppBar component if the modal can be rendered and is in full-screen mode; otherwise, it returns null.
 * 
 * @example
 * // Example usage of DialogAppBar within a dialog component
 * const MyDialog = () => {
 *     const handleBackPress = (event: GestureResponderEvent) => {
 *         console.log("Back action pressed", event);
 *     };
 *     
 *     return (
 *         <Dialog>
 *             <DialogAppBar 
 *                 onBackActionPress={handleBackPress}
 *                 title="My Dialog Title"
 *                 actions={[{ label: "Save", onPress: () => console.log("Save pressed") }]}
 *             />
 *             <Text>Dialog content goes here.</Text>
 *         </Dialog>
 *     );
 * };
 * 
 * @remarks
 * The `DialogAppBar` component checks if it can render based on the modal's context. 
 * If the modal is not in full-screen mode or cannot be rendered, it will return null, 
 * ensuring that the AppBar is only displayed when appropriate.
 */
export default function DialogAppBar<DialogContextExtend = any>(props: IDialogActionsProps<DialogContextExtend>) {
    const { canRender, context: modalContext } = useCanRender(true);
    if (!canRender || !modalContext || !modalContext.fullScreen) return null;
    const { responsive } = modalContext;
    return <AppBar
        testID="rn-dialog-appbar"
        {...props}
        context={Object.assign({}, modalContext, props.context)}
        onBackActionPress={(event: GestureResponderEvent) => {
            if (typeof props?.onBackActionPress == "function") props?.onBackActionPress(event);
            if (modalContext?.handleDismiss) {
                modalContext.handleDismiss(event);
            }
            return false;
        }}
        bindResizeEvent={!responsive}
    />
};

DialogAppBar.displayName = "DialogAppBar"