import { IAppBarAction, IAppBarProps } from "@components/AppBar/types";
import { IModalContext, IModalProps } from "@components/Modal";
import { IViewProps } from "@components/View";
import { ILabelProps } from "@components/Label";
import { ScrollViewProps } from "react-native";

/**
 * Interface representing the properties for the Dialog component.
 * 
 * The `IDialogProps` interface extends `IModalProps` to include additional properties
 * specific to the Dialog component. This interface allows developers to customize
 * the appearance and behavior of dialog boxes within the application.
 * 
 * @template DialogContextExtend - A generic type parameter that allows extending the context
 * for the Dialog component, enabling customization of the properties passed to the dialog's context.
 * 
 * @extends {IModalProps} - Inherits properties from the `IModalProps` interface, which defines
 * the structure for modal-related properties such as visibility, animation, and styling.
 * 
 * @property {IAppBarAction<IDialogContext<DialogContextExtend>>[]} [actions] - An optional array
 * of actions that can be displayed in the dialog's app bar. Each action can be a button or
 * interactive element that responds to user interactions.
 * 
 * @property {IViewProps} [dialogContentProps] - Additional properties for the content view of
 * the dialog. This allows customization of the layout and styling of the dialog's content area.
 * 
 * @property {IDialogTitleProps} [titleProps] - Additional properties for the dialog title.
 * This can include styling options such as font size, color, and alignment.
 * 
 * @property {string | React.ReactNode} [title] - The title of the dialog, which can be a string
 * or a React node. This property allows for flexible title content, including custom components.
 * 
 * @property {IViewProps} [footerProps] - Additional properties for the footer of the dialog.
 * This can be used to customize the layout and styling of the footer area, which may contain
 * buttons or other interactive elements.
 * 
 * @property {IAppBarProps} [actionsProps] - Properties for the app bar actions within the
 * dialog. This allows for customization of the app bar's appearance and behavior.
 * 
 * @property {IDialogActionsProps<DialogContextExtend>} [fullScreenAppBarProps] - Properties for
 * the full-screen app bar actions. This allows for customization of the app bar when the dialog
 * is in full-screen mode.
 * 
 * @property {DialogContextExtend} [context] - An optional context object that can be used to
 * extend the dialog's functionality. This can include any additional state or methods needed
 * for the dialog's operation.
 * 
 * @example
 * // Example of using IDialogProps in a functional Dialog component
 * const MyDialog: React.FC<IDialogProps> = ({
 *     title = "Default Title",
 *     actions,
 *     dialogContentProps,
 *     footerProps,
 * }) => {
 *     return (
 *         <Modal>
 *             <View {...dialogContentProps}>
 *                 <Text>{title}</Text>
 *             </View>
 *             <View {...footerProps}>
 *                 {actions && actions.map(action => (
 *                     <Button key={action.label} onPress={action.onPress}>
 *                         {action.label}
 *                     </Button>
 *                 ))}
 *             </View>
 *         </Modal>
 *     );
 * };
 */
export interface IDialogProps<DialogContextExtend = any> extends IModalProps {
  actions?: IAppBarAction<IDialogContext<DialogContextExtend>>[];
  dialogContentProps?: IViewProps;
  titleProps?: IDialogTitleProps;
  title?: string | React.ReactNode;
  footerProps?: IViewProps;
  actionsProps?: IAppBarProps;
  fullScreenAppBarProps?: IDialogActionsProps<DialogContextExtend>;
  context?: DialogContextExtend;
  /**
   * If true, the dialog content will be wrapped in a ScrollView
   */
  withScrollView?: boolean;

  scrollViewProps?: ScrollViewProps;
}

/**
 * Type representing the context for the Dialog component.
 * 
 * The `IDialogContext` type extends the `IModalContext` to include additional properties
 * specific to the dialog's context. This allows for enhanced functionality and state management
 * within the dialog.
 * 
 * @template DialogContextExtend - A generic type parameter that allows extending the context
 * for the Dialog component, enabling customization of the properties passed to the dialog's context.
 * 
 * @extends {IModalContext} - Inherits properties from the `IModalContext` interface, which defines
 * the structure for modal-related context properties such as visibility and state.
 * 
 * @example
 * // Example of using IDialogContext in a functional component
 * const MyDialogContext: React.FC<IDialogContext> = (props) => {
 *     const { isModal, ...contextProps } ```typescript
 *     return (
 *         <DialogContext.Provider value={contextProps}>
 *         </DialogContext.Provider>
 *     );
 * };
 */
export type IDialogContext<DialogContextExtend = any> = IModalContext & DialogContextExtend;


/**
 * Type representing the properties for the actions in the Dialog's app bar.
 * 
 * The `IDialogActionsProps` type extends the `IAppBarProps` to include properties
 * specific to the dialog's app bar actions. This allows for customization of the
 * app bar's appearance and behavior when used within a dialog.
 * 
 * @template DialogContextExtend - A generic type parameter that allows extending the properties
 * for the app bar actions, enabling customization of the actions based on the dialog's context.
 * 
 * @extends {IAppBarProps} - Inherits properties from the `IAppBarProps` interface, which defines
 * the structure for app bar-related properties such as layout, styling, and action handlers.
 * 
 * @example
 * // Example of using IDialogActionsProps in a Dialog component
 * const MyDialogActions: React.FC<IDialogActionsProps> = ({ actions }) => {
 *     return (
 *         <AppBar>
 *             {actions.map(action => (
 *                 <Button key={action.label} onPress={action.onPress}>
 *                     {action.label}
 *                 </Button>
 *             ))}
 *         </AppBar>
 *     );
 * };
 */
export type IDialogActionsProps<DialogContextExtend = any> = IAppBarProps<DialogContextExtend> & {};


/**
 * Interface representing the properties for the title of the Dialog component.
 * 
 * The `IDialogTitleProps` interface extends `ILabelProps` to include additional properties
 * specific to the dialog title. This allows for customization of the title's appearance
 * and behavior within the dialog.
 * 
 * @extends {ILabelProps} - Inherits properties from the `ILabelProps` interface, which defines
 * the structure for label-related properties such as text, styling, and accessibility.
 * 
 * @example
 * // Example of using IDialogTitleProps in a Dialog component
 * const MyDialogTitle: React.FC<IDialogTitleProps> = ({ text, style }) => {
 *     return (
 *         <Text style={style}>
 *             {text}
 *         </Text>
 *     );
 * };
 */
export interface IDialogTitleProps extends ILabelProps { }