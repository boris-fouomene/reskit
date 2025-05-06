import { AppBar } from '@components/AppBar';
import { StyleSheet } from 'react-native';
import { IDialogActionsProps } from './types';
import { useCanRender } from './utils';

/**
 * Functional component that renders the actions for a dialog within an AppBar.
 * 
 * The `DialogActions` component is responsible for displaying a set of actions
 * (buttons or interactive elements) within the AppBar of a dialog. It utilizes the
 * `useCanRender` hook to determine if the actions should be displayed based on the
 * provided context and the presence of actions.
 * 
 * @template DialogContextExtend - A generic type parameter that allows extending the context
 * for the dialog actions, enabling customization of the properties passed to the actions.
 * 
 * @param {IDialogActionsProps<DialogContextExtend>} props - The properties for the dialog actions.
 * @param {string} [props.testID] - Optional test identifier for testing purposes.
 * @param {IAppBarAction<DialogContextExtend>[]} [props.actions] - An array of actions to display in the AppBar.
 * @param {object} [props.context] - Optional context object to extend the dialog's context.
 * @param {object} [props.style] - Additional styles for the AppBar component.
 * 
 * @returns {JSX.Element | null} Returns the AppBar component with the specified actions, or null if
 * the actions cannot be rendered or if the dialog is in full-screen mode.
 * 
 * @example
 * // Example of using DialogActions in a Dialog component
 * const MyDialog: React.FC<IDialogProps> = () => {
 *     const actions = [
 *         { label: 'Cancel', onPress: () => console.log('Cancelled') },
 *         { label: 'Save', onPress: () => console.log('Saved') },
 *     ];
 *     
 *     return (
 *         <Dialog>
 *             <DialogActions actions={actions} />
 *         </Dialog>
 *     );
 * };
 */
export default function DialogActions<DialogContextExtend = any>({ testID, actions, actionProps, ...props }: IDialogActionsProps<DialogContextExtend>) {
    const { context, canRender } = useCanRender(!!(Array.isArray(actions) && actions.length));
    if (!canRender || !context) return null;
    const { fullScreen } = context;
    if (fullScreen) {
        return null;
    }
    actionProps = Object.assign({}, actionProps);
    return <AppBar
        colorScheme={"background"}
        testID={"resk-dialog-actions"}
        maxActions={2}
        title={null}
        subtitle={null}
        backAction={false}
        windowWidth={context.maxWidth}
        statusBarHeight={0}
        actionProps={{ compact: true, ...actionProps, }}
        {...props}
        context={Object.assign({}, context, props.context)}
        style={[styles.header, props.style]}
        actions={actions}
        bindResizeEvent={false}
    />
}

DialogActions.displayName = "DialogActions";

const styles = StyleSheet.create({
    header: {
        justifyContent: "flex-end",
    },
    actionContent: {
        maxWidth: 150,
    }
});
