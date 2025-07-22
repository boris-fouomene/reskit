import { JSX, ReactNode } from "react";
import { IIconButtonProps } from "@components/Icon/types";
import { INavItemProps, INavItems, INavItemsProps } from "@components/Nav/types";
import { IClassName } from "@src/types";
import { ITextVariant } from "@variants/text";
import { ISurfaceProps } from "@components/Surface";
import { appBarVariant, IAppBarVariant } from "@variants/appBar";
import { IIconButtonVariant } from "@variants/iconButton";

/**
 * Configuration for responsive action display breakpoints.
 * 
 * @interface IAppBarResponsiveConfig
 * @since 1.1.0
 */
export interface IAppBarResponsiveConfig {
    /** Breakpoints for determining max visible actions based on viewport width */
    breakpoints: {
        /** Viewport width threshold */
        width: number;
        /** Maximum visible actions at this breakpoint */
        maxActions: number;
    }[];
    /** Default maximum visible actions when no breakpoint matches */
    defaultMaxActions: number;
}

/**
 * Content-related properties for the AppBar.
 * 
 * @interface IAppBarContent
 * @since 1.1.0
 */
export interface IAppBarContent {
    /** The main title displayed in the AppBar. */
    title?: ReactNode;
    /** An optional subtitle displayed below the title. */
    subtitle?: ReactNode;
    /** Class name for the title element. */
    titleClassName?: IClassName;
    /** The variant to use for the title. */
    titleVariant?: ITextVariant;
    /** Class name for the subtitle element. */
    subtitleClassName?: IClassName;
    /** The variant to use for the subtitle. */
    subtitleVariant?: ITextVariant;
    /** Class name for the content container of the AppBar. */
    contentClassName?: IClassName;
}

/**
 * Navigation-related properties for the AppBar.
 * 
 * @interface IAppBarNavigation
 * @since 1.1.0
 */
export interface IAppBarNavigation<Context = unknown> {
    /** Callback invoked when the back action button is pressed. */
    onBackActionPress?: (event: any) => any;
    /**
     * The position of the back action.
     * 
     * @defaultValue "left"
     */
    backActionPosition?: "left" | "right";
    /** Class name for the BackAction component when rendered. */
    backActionClassName?: IClassName;
    /** Properties for the back action button. */
    backActionProps?: Omit<IIconButtonProps, "onPress">;
    /** Custom back action element or render function. */
    backAction?: JSX.Element | null | false | ((context: Context & { 
        backActionProps?: Omit<IIconButtonProps, "onPress">;
        className: string;
        variant?: IIconButtonVariant;
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        handleBackPress: (event: any) => void;
    }) => ReactNode);
}

/**
 * Layout-related properties for the AppBar.
 * 
 * @interface IAppBarLayout
 * @since 1.1.0
 */
export interface IAppBarLayout<Context = unknown> {
    /** Content for the left side of the AppBar. */
    left?: ReactNode | ((context: Context & { 
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        handleBackPress: (event: any) => void;
    }) => ReactNode);
    /** Content for the right side of the AppBar. */
    right?: ReactNode | ((context: Context & { 
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        handleBackPress: (event: any) => void;
    }) => ReactNode);
}



/**
 * Properties for the AppBar component.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarProps
 * @extends ISurfaceProps
 * @since 1.0.0
 */
export interface IAppBarProps<Context = unknown> extends 
    Omit<ISurfaceProps, "title" | "variant">,
    IAppBarContent,
    IAppBarNavigation<Context>,
    IAppBarLayout<Context>{
    
    /** Context object passed to actions and render functions. */
    context?: Context;
    /** Visual variant for the AppBar. */
    variant?: IAppBarVariant;


    /** Array of actions to display in the AppBar. */
    actions?: IAppBarActionsProps<Context>["actions"];
    /** Properties for the actions container. */
    actionsProps?: IAppBarActionsProps<Context>;
    /** The maximum visible number of actions to display directly on the AppBar. */
    maxVisibleActions?: IAppBarActionsProps<Context>["maxVisibleActions"];
    /** Class name for the actions container. */
    actionsClassName?: IClassName;
}

/**
 * Properties for the AppBar actions container.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarActionsProps
 * @since 1.0.0
 */
export interface IAppBarActionsProps<Context = unknown> {
    /** Test identifier for automation testing. */
    testID?: string;
    /** Class name for the actions container. */
    className?: IClassName;

    // Viewport and Responsive Configuration
    /** 
     * The width of the current viewport/container, used to calculate responsive action display.
     * This should be the actual available width where the AppBar is rendered (window, drawer, modal, etc.).
     */
    viewportWidth?: number;
    /** Responsive configuration for action display breakpoints. */
    responsiveConfig?: IAppBarResponsiveConfig;

    // Action Configuration
    /** Array of actions to display in the AppBar. */
    actions?: INavItems<IAppBarActionProps<Context>>;
    /** 
     * The maximum visible number of actions to display directly on the AppBar.
     * When not specified, uses responsive configuration or default calculation.
     */
    maxVisibleActions?: number;
    /** Priority-based action sorting (higher priority actions show first). */
    actionPriority?: Record<string, number>;

    // Action Styling
    /** Class name applied to each action button rendered directly in the AppBar. */
    actionClassName?: IClassName;
    /** Class name applied to actions rendered inside overflow menu. */
    actionMenuItemClassName?: IClassName;

    // Action Rendering
    /** Custom function to render individual actions. */
    renderAction?: INavItemsProps<IAppBarContext<Context>>["renderItem"];
    /** Custom function to render expandable actions. */
    renderExpandableAction?: INavItemsProps<IAppBarContext<Context>>["renderExpandableItem"];

    // Context and State
    /** Context object passed to actions for extended functionality. */
    context?: IAppBarContext<Context>;

    // Platform-specific Configuration
    /** 
     * Fallback element during hydration process (Next.js only).
     * Prevents hydration mismatches on server-side rendering.
     */
    hydrationFallback?: ReactNode;

    // Menu Configuration
    /** Class name for the overflow menu anchor button. */
    menuAnchorClassName?: IClassName;
    /** Icon properties for the overflow menu anchor button. */
    menuAnchorIconProps?: IIconButtonProps;
    /** Custom overflow menu configuration. */
    menuProps?: {
        /** Position preference for the overflow menu. */
        position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
        /** Maximum height for the overflow menu. */
        maxHeight?: number;
        /** Custom class name for the menu container. */
        className?: IClassName;
    };

    // Performance and Accessibility
    /** Enable performance optimizations for large action lists. */
    enableVirtualization?: boolean;
    /** Accessibility label for the actions container. */
    accessibilityLabel?: string;
    /** Accessibility label for the overflow menu button. */
    overflowMenuAccessibilityLabel?: string;
}
/**
 * Context type for AppBar components with enhanced functionality.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarContext
 * @since 1.0.0
 */
export type IAppBarContext<Context = unknown> = Context & {
    /** Computed AppBar variant for consistent styling. */
    appBarVariant: IAppBarVariant;
    /** Current viewport dimensions for responsive behavior. */
    viewport?: {
        width: number;
        height: number;
    };
    /** Whether the AppBar is rendered in a constrained container (drawer, modal). */
    isConstrained?: boolean;
    /** Performance flags for optimization. */
    performance?: {
        enableVirtualization: boolean;
        enableMemoization: boolean;
    };
}

/**
 * Action priority levels for organizing AppBar actions.
 * 
 * @enum IAppBarActionPriority
 * @since 1.1.0
 */
export enum IAppBarActionPriority {
    /** Critical actions that should always be visible. */
    CRITICAL = 100,
    /** High priority actions shown when space allows. */
    HIGH = 75,
    /** Normal priority actions (default). */
    NORMAL = 50,
    /** Low priority actions, first to be moved to overflow menu. */
    LOW = 25,
    /** Optional actions, hidden on smaller viewports. */
    OPTIONAL = 10
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
 * @extends {INavItemProps<IAppBarContext<Context>>}
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Basic action
 * const saveAction: IAppBarActionProps = {
 *   id: 'save',
 *   label: 'Save',
 *   onPress: () => handleSave(),
 *   priority: IAppBarActionPriority.HIGH
 * };
 * 
 * // Action with custom rendering
 * const customAction: IAppBarActionProps = {
 *   id: 'custom',
 *   priority: IAppBarActionPriority.NORMAL,
 *   render: ({ context }) => (
 *     <CustomButton variant={context.appBarVariant} />
 *   )
 * };
 * ```
 */
export interface IAppBarActionProps<Context = unknown> extends INavItemProps<IAppBarContext<Context>> {
    /** 
     * Priority level for this action (affects visibility order and overflow behavior).
     * Higher priority actions remain visible longer as viewport shrinks.
     */
    priority?: IAppBarActionPriority | number;
    
    /** 
     * Whether this action should always be visible regardless of viewport constraints.
     * Use sparingly for critical actions only.
     */
    alwaysVisible?: boolean;
    
    /**
     * Minimum viewport width required to show this action directly in the AppBar.
     * Below this width, the action moves to overflow menu.
     */
    minViewportWidth?: number;
    
    /**
     * Group identifier for related actions.
     * Actions in the same group are shown/hidden together.
     */
    group?: string;
    
    /**
     * Accessibility configuration for the action.
     */
    accessibility?: {
        /** Accessibility label for screen readers. */
        label?: string;
        /** Accessibility hint describing the action's behavior. */
        hint?: string;
        /** Accessibility role override. */
        role?: string;
    };
}

/**
 * Properties for the BackAction component in the AppBar.
 * 
 * @interface IBackActionProps
 * @extends IIconButtonProps
 * @since 1.0.0
 * 
 * @description
 * Interface representing the properties for the BackAction component.
 * This interface extends the {@link IIconButtonProps} interface to inherit all 
 * the properties of the IconButton, allowing for additional customization of
 * the back navigation button in the AppBar.
 * 
 * @example
 * ```tsx
 * const backActionProps: IBackActionProps = {
 *   icon: 'arrow-left',
 *   variant: 'ghost',
 *   size: 'md',
 *   accessibilityLabel: 'Go back'
 * };
 * ```
 * 
 * @see {@link IIconButtonProps} for inherited properties.
 */
export interface IBackActionProps extends IIconButtonProps { }

