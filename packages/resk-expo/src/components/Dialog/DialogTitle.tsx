import Label from "@components/Label";
import { StyleSheet } from "react-native";
import { useCanRender } from "./utils";
import { IDialogTitleProps } from "./types";

/**
 * A functional component that renders the title of a dialog.
 * 
 * This component utilizes the `useCanRender` hook to determine if it should be rendered
 * based on the modal context. It will not render if the modal context is in full-screen mode
 * or if rendering is not allowed.
 * 
 * @param props - The properties for the dialog title component.
 * @param props.style - Optional custom styles to apply to the title.
 * @param props.textBold - A boolean to determine if the text should be bold.
 * 
 * @returns A React element representing the dialog title or null if it should not render.
 * 
 * @example
 * <DialogTitle text="My Dialog Title" style={{ color: 'blue' }} textBold />
 */

export default function DialogTitle(props: IDialogTitleProps) {
    const { context: modalContext, canRender } = useCanRender(true);
    if (!canRender || !modalContext || modalContext.fullScreen) return null;
    return <Label testID="rn-dialog-title" textBold {...props} style={[styles.container, props.style]} />
};


const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        fontSize: 16,
        marginHorizontal: 10,
        lineHeight: 25,
        fontWeight: '500',
    }
})