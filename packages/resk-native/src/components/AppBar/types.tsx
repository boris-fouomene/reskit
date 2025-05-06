import { ILabelProps } from "@components/Label/types";
import { ISurfaceProps } from "@components/Surface/types";
import { ReactNode } from "react";
import { IThemeColorsTokenName } from "@theme/types";
import { GestureResponderEvent, ViewProps } from "react-native";
import { IIconButtonProps } from "@components/Icon/types";
import { IMenuItemBase, IMenuRenderItemsOptions } from "@components/Menu/types";
import { ILabelOrLeftOrRightProps } from "@hooks/label2left2right";


/**
 * Props for the AppBar component.
 * 
 * This interface defines the properties required for the AppBar component, which
 * serves as a top navigation bar for the application. The AppBar can display a title,
 * subtitle, actions, and handle back navigation, providing a consistent user interface
 * across the application.
 *
 * @template IAppBarActionContext - A generic type parameter that allows 
 * extending the context for AppBar actions. This enables customization of the 
 * properties passed to action items within the AppBar.
 *
 * @interface IAppBarProps
 * 
 * @extends {ISurfaceProps} - Inherits properties from the ISurfaceProps interface,
 * which defines the structure for surface-related properties like elevation and styling.
 * 
 * @extends {ILabelOrLeftOrRightProps<IAppBarContext<IAppBarActionContext>>} - Inherits properties from the ILabelOrLeftOrRightProps interface,
 * which defines the structure for properties like label, left, and right.
 *
 * @property {string} [backgroundColor] - The background color of the AppBar.
 *
 * @property {string} [textColor] - The color of the text elements in the AppBar component.
 *
 * @property {number} [statusBarHeight] - Extra padding to add at the top of the header
 * to account for a translucent status bar. This is automatically handled on iOS >= 11
 * including iPhone X using `SafeAreaView`. If using Expo, a height for the status bar
 * is set automatically. Pass `0` or a custom value to disable the default behavior.
 *
 * @property {ReactNode} title - The main title displayed in the AppBar.
 *
 * @property {ReactNode} [subtitle] - An optional subtitle displayed below the title.
 *
 * @property {ILabelProps} [titleProps] - Additional properties for the title label.
 *
 * @property {ILabelProps} [subtitleProps] - Additional properties for the subtitle label.
 *
 * @property {IThemeColorsTokenName} [colorScheme] - The color scheme key for theming
 * the AppBar elements. This property is used to set the color of the title and subtitle and the background color of the AppBar.
 *
 * @property {number} [maxActions] - The maximum number of actions to display directly
 * on the AppBar. Any additional actions will be displayed through a Menu component.
 *
 * @property {number} [windowWidth] - The width of the window, used to calculate
 * the maximum number of actions to display. This field allows for dynamic adjustment
 * of displayed actions based on the AppBar's size.
 *
 * @property {(event: GestureResponderEvent) => void} [onBackActionPress] - Callback
 * invoked when the back action button is pressed, allowing for custom back navigation.
 *
 * @property {boolean} [bindResizeEvent] - Indicates if the AppBar content should 
 * be updated on page resize events.
 *
 * @property {number} [elevation] - The elevation level of the AppBar component,
 * affecting its shadow and depth appearance.
 *
 * @property {React.ReactNode | false | null | ((props: IBackActionProps) => ReactNode)} 
 * [backAction] - The component for the back action. If a string is provided, it is 
 * treated as the name of the FontIcon to render for the back action. This property 
 * specifies whether the back action is rendered or not.
 *
 * @property {IBackActionProps} [backActionProps] - Properties for the BackAction 
 * component when it is rendered.
 *
 * @property {IAppBarActionContext} [context] - The context for the action,
 * used to extend the context for the actions.
 *
 * @property {IAppBarAction<IAppBarActionContext>[]} [actions] - An array of 
 * actions to display in the AppBar. These actions can be buttons or other interactive
 * elements that respond to user interactions.
 * 
 *  @param {IMenuItemRenderFunc<IAppBarActionContext>} props.renderAction - The function used to render 
 * an appBar action. This function receives the item properties and is responsible for generating
 * the corresponding JSX.
 *
 * @param {IMenuItemRenderFunc<IAppBarActionContext>} props.renderExpandableAction - The function used to
 * render expandable actions. Similar to the render function, this handles the rendering of
 *
 * @example
 * // Example of using IAppBarProps in a functional AppBar component
 * const MyAppBar: React.FC<IAppBarProps> = ({
 *     backgroundColor = '#6200EE',
 *     title,
 *     subtitle,
 *     onBackActionPress,
 *     actions,
 * }) => {
 *     return (
 *         <View style={{ backgroundColor }}>
 *             <Text>{title}</Text>
 *             {subtitle && <Text>{subtitle}</Text>}
 *             {actions && actions.map(action => (
 *                 <TouchableOpacity key={action.label} onPress={action.onPress}>
 *                     <Text>{action.label}</Text>
 *                 </TouchableOpacity>
 *             ))}
 *             <Button onPress={onBackActionPress}>Back</Button>
 *         </View>
 *     );
 * };
 */
export type IAppBarProps<IAppBarActionContext = any> = ISurfaceProps & {
    backgroundColor?: string;
    /** The color of the text elements in the AppBar component. */
    textColor?: string;
    /**
     * Extra padding to add at the top of header to account for translucent status bar.
     * This is automatically handled on iOS >= 11 including iPhone X using `SafeAreaView`.
     * If you are using Expo, we assume translucent status bar and set a height for status bar automatically.
     * Pass `0` or a custom value to disable the default behaviour, and customize the height.
     */
    statusBarHeight?: number;

    /** The main title displayed in the AppBar. */
    title?: ReactNode;
    /** An optional subtitle displayed below the title. */
    subtitle?: ReactNode;
    /** Additional properties for the title label. */
    titleProps?: ILabelProps;
    /** Additional properties for the subtitle label. */
    subtitleProps?: ILabelProps;
    /** The color scheme key for theming the AppBar elements. */
    colorScheme?: IThemeColorsTokenName;

    /** The maximum number of actions to display directly on the AppBar. */
    maxActions?: number;
    /** The width of the window, used to calculate the maximum number of actions to display. */
    windowWidth?: number;

    /** Callback invoked when the back action button is pressed. */
    onBackActionPress?: (event: GestureResponderEvent) => any;
    /** Indicates if the AppBar content should be updated on page resize. */
    bindResizeEvent?: boolean;
    /** the elevation level of the AppBar component. */
    elevation?: number;

    /** If backAction is a string, it is the name of the FontIcon to render for the back action. */
    backAction?: JSX.Element| null | false | ((props: IBackActionProps) => ReactNode);
    /** Properties for the BackAction component when rendered. */
    backActionProps?: IBackActionProps;
    /** The context to pass to each action, used to extend the context for the actions. */
    context?: IAppBarContext<IAppBarActionContext>; // The context for actions requiring specific context information.
    /** an array of actions to display in the AppBar. These actions can be buttons or other interactive elements that respond to user interactions. */
    actions?: IAppBarAction<IAppBarContext<IAppBarActionContext>>[];

    /**
     * The function used to render an appBar action. This function receives the item properties and is responsible for generating the corresponding JSX.
     */
    renderAction?: IMenuRenderItemsOptions<IAppBarContext<IAppBarActionContext>>["render"];

    /**
     * The function used to render expandable actions. Similar to the render function, this handles the rendering of
     */
    renderExpandableAction?: IMenuRenderItemsOptions<IAppBarContext<IAppBarActionContext>>["renderExpandable"];


    /***
     * Additional props for each action.
     */
    actionProps?: IAppBarAction<IAppBarActionContext>;

    /**
     * Additional props for the content of the AppBar.
     */
    contentProps?: ViewProps;
} & Omit<ILabelOrLeftOrRightProps<IAppBarContext<IAppBarActionContext>>, "label">


/**
 * Type definition for actions that can be included in an application bar (AppBar).
 * 
 * The `IAppBarAction` type extends the properties of {@link IMenuItemBase}, allowing
 * developers to define actions that can be performed from the AppBar. This type
 * can be used to create buttons or interactive elements within the AppBar that 
 * respond to user interactions.
 *
 * @template IAppBarActionContext - A generic type parameter that allows 
 * extending the context for AppBar actions. This enables customization of the 
 * properties passed to action items within the AppBar.
 *
 * @interface IAppBarAction
 * 
 * @extends {IMenuItemBase<IAppBarActionContext>} - Inherits the properties 
 * and methods from the `IMenuItemBase` interface, which defines the structure 
 * for menu items, ensuring consistency and reusability across different components.
 *
 * @example
 * // Example of using IAppBarAction in an AppBar component
 * const MyAppBarAction: React.FC<IAppBarAction> = (props) => {
 *     return (
 *         <Button onPress={props.onPress}>
 *             {props.label}
 *         </Button>
 *     );
 * };
 */
export type IAppBarAction<IAppBarActionContext = any> = IMenuItemBase<IAppBarContext<IAppBarActionContext>>;

/**
 * 
 * @interface IBackActionProps
 * @description
 * Interface representing the properties for the BackAction component.
 * This interface extends the {@link IIconButtonProps} interface to inherit all 
 * the properties of the IconButton, allowing for additional customization.
 * @extends IIconButtonProps
 * @see {@link IIconButtonProps} for additional properties.
 */
export interface IBackActionProps extends IIconButtonProps { }


/**
 * Context for the AppBar component.
 * 
 * This interface extends the provided action context for the AppBar, adding a 
 * boolean property to indicate that this context is specifically for the AppBar.
 * 
 * @template IAppBarActionContext - A generic type parameter that allows extending 
 * the context for AppBar actions, enabling customization of the properties 
 * passed to action items within the AppBar.
 * 
 * @interface IAppBarContext
 * 
 * @extends IAppBarActionContext - Inherits properties from the provided action context.
 * 
 * @property {boolean} isAppBar - Indicates that this context is specifically for the AppBar.
 * 
 * @example
 * // Example of using IAppBarContext in a functional component
 * const MyAppBar: React.FC = () => {
 *     const context: IAppBarContext = {
 *         isAppBar: true,
 *         // ... other context properties
 *     };
 *     
 *     return (
 *         <AppBar context={context}>
 *             {content}
 *         </AppBar>
 *     );
 * };
 */
export type IAppBarContext<IAppBarActionContext = any> = IAppBarActionContext & {
    isAppBar: boolean;
    textColor: string;
    backgroundColor: string;
};