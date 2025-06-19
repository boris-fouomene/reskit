import { ReactElement, ReactNode } from "react";
import { IIconButtonProps } from "@components/Icon/types";
import { INavItemProps, INavItemsProps } from "@components/Nav/types";
import { IClassName } from "@src/types";
import { IVariantPropsText } from "@variants/text";
import { ISurfaceProps } from "@components/Surface";
import { IVariantPropsAppBar } from "@variants/appBar";


export interface IAppBarProps<Context = unknown> extends Omit<ISurfaceProps, "title" | "variant"> {
    /** The main title displayed in the AppBar. */
    title?: ReactNode;
    /** An optional subtitle displayed below the title. */
    subtitle?: ReactNode;

    titleClassName?: IClassName;
    /** The variant to use for the title. */
    titleVariant?: IVariantPropsText;
    /** Additional properties for the subtitle label. */
    subtitleClassName?: IClassName;
    /** The variant to use for the subtitle. */
    subtitleVariant?: IVariantPropsText;


    /** Callback invoked when the back action button is pressed. */
    onBackActionPress?: (event: any) => any;

    /** If backAction is a string, it is the name of the FontIcon to render for the back action. */
    backAction?: ReactElement | null | false | ((context: Context & { handleBackPress: (event: any) => void }) => ReactNode);

    /** class name for the BackAction component when rendered. */
    backActionClassName?: IClassName;
    
    /***
     * Class name for the content of the AppBar.
     */
    contentClassName?: IClassName;

    left?: ReactNode;

    right?: ReactNode;

    actions?: IAppBarActionsProps<Context>["actions"];


    actionsProps?: IAppBarActionsProps<Context>;


    context?: IAppBarActionsProps<Context>["context"];
    
    variant?: IVariantPropsAppBar;
}

export interface IAppBarActionsProps<Context = unknown> {
    testID?: string;

    /** The width of the viewport, used to calculate the maximum number of actions to display. */
    viewportWidth?: number;

    /** an array of actions to display in the AppBar. These actions can be buttons or other interactive elements that respond to user interactions. */
    actions?: IAppBarActionProps<Context>[];

    /** The maximum visible number of actions to display directly on the AppBar. 
     * This value is used to determine the number of actions that can be displayed on the AppBar.
     * The rest of the actions will be displayed in a menu.
    */
    maxVisibleActions?: number;

    /**
     * A class name to apply to each AppBar action button rendered directly inside the AppBar (outside of any dropdown or menu).
     *
     * This is useful for customizing the look and feel of AppBar actions that are always visible, such as icons or buttons for notifications, settings, etc.
     *
     * @example
     * ```tsx
     * <AppBar
     *   actionClassName="text-white hover:bg-primary-600 transition-colors"
     * />
     * ```
     */
    actionClassName?: string;

    /**
     * A class name to apply specifically to AppBar actions rendered inside an action menu (e.g., a dropdown or overflow menu).
     *
     * Use this to distinguish styles between actions shown directly in the AppBar and those shown inside a contextual or overflow menu.
     *
     * @example
     * ```tsx
     * <AppBar
     *   actionMenuItemClassName="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
     * />
     * ```
     *
     * @remarks
     * This is particularly useful when the AppBar overflows or groups certain actions into a dropdown menu on smaller screens.
     */
    actionMenuItemClassName?: string;
    /**
     * The function used to render an appBar action. This function receives the item properties and is responsible for generating the corresponding JSX.
     */
    renderAction?: INavItemsProps<Context>["renderItem"];

    /**
     * The function used to render expandable actions. Similar to the render function, this handles the rendering of
     */
    renderExpandableAction?: INavItemsProps<Context>["renderExpandableItem"];

    /** The context to pass to each action, used to extend the context for the actions. */
    context?: Context; // The context for actions requiring specific context information.

    /***
        The fallback element to render as actions during the hydration process, 
        when the component is not yet mounted.
        only on nextjs platform
    */
    hydrationFallback?: ReactNode;
}

/**
 * Type definition for actions that can be included in an application bar (AppBar).
 * 
 * The `IAppBarActionProps` type extends the properties of {@link INavItemProps}, allowing
 * developers to define actions that can be performed from the AppBar. This type
 * can be used to create buttons or interactive elements within the AppBar that 
 * respond to user interactions.
 *
 * @template Context - A generic type parameter that allows 
 * extending the context for AppBar actions. This enables customization of the 
 * properties passed to action items within the AppBar.
 *
 * @interface IAppBarActionProps
 * 
 * @extends {INavItemProps<Context>} - Inherits the properties 
 * and methods from the `INavItemProps` interface, which defines the structure 
 * for menu items, ensuring consistency and reusability across different components.
 *
 * @example
 * // Example of using IAppBarActionProps in an AppBar component
 * const MyAppBarAction: React.FC<IAppBarActionProps> = (props) => {
 *     return (
 *         <Button onPress={props.onPress}>
 *             {props.label}
 *         </Button>
 *     );
 * };
 */
export interface IAppBarActionProps<Context = unknown> extends INavItemProps<Context> { };

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