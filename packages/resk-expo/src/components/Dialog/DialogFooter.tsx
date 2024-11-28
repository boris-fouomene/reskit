import View, { IViewProps } from "@components/View";
import { StyleSheet } from "react-native";
import { useCanRender } from "./utils";
import isValidElement from "@utils/isValidElement";

/**
 * A functional component that renders the footer of a dialog.
 * This component is designed to be used within a dialog context and will only display
 * when the dialog is not in full-screen mode and can render its children.
 * 
 * @param {IViewProps} props - The properties for configuring the View component.
 * This includes standard view properties such as style, accessibility, and layout options.
 * 
 * @returns {JSX.Element | null} Returns the View component as the dialog footer if the modal context
 * is available and the footer can be rendered; otherwise, it returns null.
 * 
 * @example
 * // Example usage of DialogFooter within a dialog component
 * const MyDialog = () => {
 *     return (
 *         <Dialog>
 *             <Text>Dialog content goes here.</Text>
 *             <DialogFooter style={{ backgroundColor: 'lightgray' }}>
 *                 <Button onPress={() => console.log("Footer button pressed")}>
 *                     Close
 *                 </Button>
 *             </DialogFooter>
 *         </Dialog>
 *     );
 * };
 * 
 * @remarks
 * The `DialogFooter` component checks if it can render based on the validity of its children
 * and the modal's context. If the modal is in full-screen mode or cannot render, it will return null,
 * ensuring that the footer is only displayed when appropriate.
 */
export default function DialogFooter(props: IViewProps) {
    const { context: modalContext, canRender } = useCanRender(isValidElement(props.children));
    if (!modalContext || modalContext.fullScreen || !canRender) return null;
    return <View testID="resk-dialog-footer" {...props} style={[styles.container, props.style]} />
};


const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    }
})

DialogFooter.displayName = "DialogFooter";