import { JSX, ReactNode } from "react";
import { IFontIconName, IIconButtonProps } from "@components/Icon/types";
import { INavItemProps, INavItems, INavItemsProps } from "@components/Nav/types";
import { IClassName } from "@src/types";
import { ITextVariant } from "@variants/text";
import { ISurfaceProps } from "@components/Surface";
import { appBarVariant, IAppBarVariant } from "@variants/appBar";
import { IIconButtonVariant } from "@variants/iconButton";
import { IMenuProps } from "@components/Menu/types";

/**
 * Configuration for responsive action display breakpoints in the AppBar component.
 * 
 * This interface defines how the AppBar adapts its action visibility based on available
 * viewport width. The responsive system automatically hides lower-priority actions
 * in an overflow menu when screen space is limited, accounting for the menu button
 * itself taking up one action slot.
 * 
 * @interface IAppBarResponsiveConfig
 * @since 1.1.0
 * 
 * @example
 * ```tsx
 * // Custom responsive configuration
 * const customConfig: IAppBarResponsiveConfig = {
 *   breakpoints: [
 *     { width: 1200, maxActions: 6 }, // Desktop: show up to 6 actions
 *     { width: 768, maxActions: 4 },  // Tablet: show up to 4 actions
 *     { width: 480, maxActions: 2 },  // Mobile landscape: show 2 actions
 *     { width: 320, maxActions: 1 }   // Mobile portrait: show 1 action
 *   ],
 *   defaultMaxActions: 1 // Fallback for very small screens
 * };
 * 
 * <AppBar 
 *   actions={actions}
 *   actionsProps={{ responsiveConfig: customConfig }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Using with constrained contexts (drawer, modal)
 * const drawerConfig: IAppBarResponsiveConfig = {
 *   breakpoints: [
 *     { width: 400, maxActions: 3 },
 *     { width: 300, maxActions: 2 },
 *     { width: 200, maxActions: 1 }
 *   ],
 *   defaultMaxActions: 1
 * };
 * ```
 */
export interface IAppBarResponsiveConfig {
    /** 
     * Array of breakpoints defining maximum visible actions at different viewport widths.
     * Breakpoints are automatically sorted in descending order for optimal matching.
     * Each breakpoint defines a minimum width threshold and corresponding action limit.
     * The system accounts for the overflow menu button taking up one action slot.
     * 
     * @example
     * ```tsx
     * breakpoints: [
     *   { width: 1024, maxActions: 5 }, // Large screens show 5 actions
     *   { width: 768, maxActions: 3 },  // Medium screens show 3 actions
     *   { width: 480, maxActions: 1 }   // Small screens show 1 action
     * ]
     * ```
     */
    breakpoints: {
        /** 
         * Minimum viewport width in pixels for this breakpoint to apply.
         * Must be a positive number representing CSS pixels.
         */
        width: number;
        /** 
         * Maximum number of actions to display directly in the AppBar at this breakpoint.
         * Additional actions are automatically moved to the overflow menu.
         * Should be between 1-8 for optimal user experience (Miller's Rule).
         * Note: The system reserves one slot for the overflow menu button when needed.
         */
        maxActions: number;
    }[];

    /** 
     * Default maximum visible actions when viewport width is smaller than the smallest
     * breakpoint or when viewport width cannot be determined.
     * 
     * @defaultValue 1
     * @example
     * ```tsx
     * // Conservative default for unknown contexts
     * defaultMaxActions: 1
     * ```
     */
    defaultMaxActions: number;
}

/**
 * Content-related properties for the AppBar component.
 * 
 * This interface groups all properties related to displaying textual content
 * within the AppBar, including titles, subtitles, and their styling options.
 * The content is typically displayed in the center area of the AppBar.
 * 
 * @interface IAppBarContent
 * @since 1.1.0
 * 
 * @example
 * ```tsx
 * // Basic title and subtitle
 * const contentProps: IAppBarContent = {
 *   title: "Dashboard",
 *   subtitle: "Welcome back, John",
 *   titleVariant: "heading-lg",
 *   subtitleVariant: "body-sm"
 * };
 * 
 * <AppBar {...contentProps} />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom styled content
 * const styledContentProps: IAppBarContent = {
 *   title: <span className="font-bold text-primary">My App</span>,
 *   titleClassName: "text-center",
 *   contentClassName: "bg-gradient-to-r from-blue-500 to-purple-600"
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Dynamic content with ReactNode
 * const dynamicContent: IAppBarContent = {
 *   title: (
 *     <div className="flex items-center gap-2">
 *       <Icon name="dashboard" />
 *       <span>Dashboard</span>
 *     </div>
 *   ),
 *   subtitle: `Last updated: ${new Date().toLocaleString()}`
 * };
 * ```
 */
export interface IAppBarContent {
    /** 
     * The main title displayed in the AppBar.
     * Can be a string, ReactNode, or any renderable content.
     * Typically displayed prominently in the center of the AppBar.
     * 
     * @example
     * ```tsx
     * title: "My Application"
     * title: <Logo size="md" />
     * title: <span className="font-bold">Custom Title</span>
     * ```
     */
    title?: ReactNode;

    /** 
     * An optional subtitle displayed below or alongside the title.
     * Used for additional context, user information, or secondary details.
     * 
     * @example
     * ```tsx
     * subtitle: "Version 2.1.0"
     * subtitle: "Welcome back, John Doe"
     * subtitle: <Badge variant="success">Online</Badge>
     * ```
     */
    subtitle?: ReactNode;

    /** 
     * CSS class name applied to the title element for custom styling.
     * 
     * @example
     * ```tsx
     * titleClassName: "text-2xl font-bold text-primary"
     * titleClassName: "truncate max-w-xs"
     * ```
     */
    titleClassName?: IClassName;

    /** 
     * Typography variant for the title text styling.
     * Uses the design system's text variants for consistent typography.
     * 
     * @example
     * ```tsx
     * titleVariant: "heading-lg"    // Large heading style
     * titleVariant: "heading-md"    // Medium heading style
     * titleVariant: "body-lg"       // Large body text style
     * ```
     */
    titleVariant?: ITextVariant;

    /** 
     * CSS class name applied to the subtitle element for custom styling.
     * 
     * @example
     * ```tsx
     * subtitleClassName: "text-sm text-muted-foreground"
     * subtitleClassName: "italic opacity-75"
     * ```
     */
    subtitleClassName?: IClassName;

    /** 
     * Typography variant for the subtitle text styling.
     * Typically smaller and less prominent than the title variant.
     * 
     * @example
     * ```tsx
     * subtitleVariant: "body-sm"     // Small body text
     * subtitleVariant: "caption"     // Caption text
     * subtitleVariant: "body-xs"     // Extra small body text
     * ```
     */
    subtitleVariant?: ITextVariant;

    /** 
     * CSS class name applied to the entire content container of the AppBar.
     * Affects the layout and styling of the title/subtitle area.
     * 
     * @example
     * ```tsx
     * contentClassName: "text-center"           // Center-align content
     * contentClassName: "bg-gradient-to-r from-blue-500 to-purple-600"
     * contentClassName: "p-4 rounded-lg shadow-sm"
     * ```
     */
    contentClassName?: IClassName;
}

/**
 * Navigation-related properties for the AppBar component.
 * 
 * This interface defines properties for back navigation functionality within the AppBar.
 * It provides flexible options for customizing the back button's appearance, behavior,
 * and positioning, including support for custom render functions and complete customization.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarNavigation
 * @since 1.1.0
 * 
 * @example
 * ```tsx
 * // Basic back navigation
 * const navigationProps: IAppBarNavigation = {
 *   onBackActionPress: () => router.back(),
 *   backActionPosition: "left"
 * };
 * 
 * <AppBar {...navigationProps} />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom back button styling
 * const customBackNavigation: IAppBarNavigation = {
 *   onBackActionPress: handleGoBack,
 *   backActionClassName: "text-primary hover:bg-primary/10",
 *   backActionProps: {
 *     variant: "ghost",
 *     size: "lg",
 *     fontIconName: "arrow-left"
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Custom back action with render function
 * const customRenderNavigation: IAppBarNavigation<UserContext> = {
 *   backAction: ({ handleBackPress, computedAppBarVariant, context }) => (
 *     <Button
 *       variant={computedAppBarVariant === "primary" ? "ghost" : "outline"}
 *       onPress={handleBackPress}
 *       leftIcon="chevron-left"
 *     >
 *       {context.user?.preferences.backButtonText || "Back"}
 *     </Button>
 *   )
 * };
 * ```
 */
export interface IAppBarNavigation<Context = unknown> {
    /** 
     * Callback function invoked when the back action button is pressed.
     * This function handles the navigation logic and receives the press event.
     * 
     * @param event - The press event from the back button interaction
     * @returns Any value (typically void or a Promise for async navigation)
     * 
     * @example
     * ```tsx
     * onBackActionPress: () => router.back()
     * onBackActionPress: async (event) => {
     *   await saveChanges();
     *   navigation.goBack();
     * }
     * onBackActionPress: (event) => {
     *   console.log('Back button pressed', event);
     *   window.history.back();
     * }
     * ```
     */
    onBackActionPress?: (event: any) => any;

    /**
     * The position of the back action button within the AppBar layout.
     * Determines whether the back button appears on the left or right side.
     * 
     * @defaultValue "left"
     * @example
     * ```tsx
     * backActionPosition: "left"   // Standard back button position
     * backActionPosition: "right"  // Alternative positioning (RTL layouts)
     * ```
     */
    backActionPosition?: "left" | "right";

    /** 
     * CSS class name applied to the BackAction component when rendered.
     * Used for custom styling of the back button container.
     * 
     * @example
     * ```tsx
     * backActionClassName: "mr-2 text-primary"
     * backActionClassName: "rounded-full bg-white/10 hover:bg-white/20"
     * ```
     */
    backActionClassName?: IClassName;

    /** 
     * Properties passed to the underlying IconButton component for the back action.
     * Excludes 'onPress' as it's handled by the onBackActionPress callback.
     * 
     * @example
     * ```tsx
     * backActionProps: {
     *   variant: "ghost",
     *   size: "md",
     *   fontIconName: "arrow-left",
     *   accessibilityLabel: "Go back to previous page"
     * }
     * ```
     */
    backActionProps?: Omit<IIconButtonProps, "onPress">;

    /** 
     * Custom back action element or render function for complete customization.
     * When provided, this overrides the default back button implementation.
     * 
     * - Use `null` or `false` to hide the back action completely
     * - Use a JSX element for static custom back button
     * - Use a function for dynamic back button based on context
     * 
     * @param context - Extended context object with computed styles and handlers
     * @returns ReactNode to render as the back action, or null/false to hide
     * 
     * @example
     * ```tsx
     * // Hide back action
     * backAction: false
     * 
     * // Static custom back button
     * backAction: <CustomBackButton onPress={handleBack} />
     * 
     * // Dynamic back action with context
     * backAction: ({ handleBackPress, computedAppBarVariant, context }) => (
     *   <Button
     *     variant={computedAppBarVariant === "primary" ? "ghost" : "solid"}
     *     onPress={handleBackPress}
     *     leftIcon="chevron-left"
     *     className={context.isConstrained ? "text-sm" : "text-md"}
     *   >
     *     {context.viewport?.width < 768 ? "Back" : "Go Back"}
     *   </Button>
     * )
     * ```
     */
    backAction?: JSX.Element | null | false | ((context: Context & {
        /** Properties for the default back action button */
        backActionProps?: Omit<IIconButtonProps, "onPress">;
        /** CSS class name for the back action */
        className: string;
        /** Icon button variant to use */
        variant?: IIconButtonVariant;
        /** Computed AppBar variant for consistent styling */
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        /** Pre-configured back press handler */
        handleBackPress: (event: any) => void;
    }) => ReactNode);
}

/**
 * Layout-related properties for the AppBar component.
 * 
 * This interface defines properties for customizing the left and right areas of the AppBar
 * layout. These areas are typically used for navigation elements, secondary actions, or
 * custom content that should be positioned at the edges of the AppBar.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarLayout
 * @since 1.1.0
 * 
 * @example
 * ```tsx
 * // Static content in left and right areas
 * const layoutProps: IAppBarLayout = {
 *   left: <Logo size="sm" />,
 *   right: <UserAvatar />
 * };
 * 
 * <AppBar {...layoutProps} />
 * ```
 * 
 * @example
 * ```tsx
 * // Dynamic content with context
 * const dynamicLayoutProps: IAppBarLayout<UserContext> = {
 *   left: ({ computedAppBarVariant }) => (
 *     <Icon 
 *       name="menu" 
 *       color={computedAppBarVariant === "primary" ? "white" : "black"}
 *     />
 *   ),
 *   right: ({ context, handleBackPress }) => (
 *     context.user.isAdmin ? (
 *       <AdminMenu onBackPress={handleBackPress} />
 *     ) : (
 *       <UserMenu />
 *     )
 *   )
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Responsive layout based on viewport
 * const responsiveLayout: IAppBarLayout = {
 *   left: ({ context }) => (
 *     context.viewport?.width < 768 ? (
 *       <MobileNavToggle />
 *     ) : (
 *       <BreadcrumbNavigation />
 *     )
 *   ),
 *   right: ({ context }) => (
 *     <div className={context.isConstrained ? "text-xs" : "text-sm"}>
 *       <NotificationBell />
 *       <Settings />
 *     </div>
 *   )
 * };
 * ```
 */
export interface IAppBarLayout<Context = unknown> {
    /** 
     * Content for the left side of the AppBar.
     * Can be static ReactNode content or a dynamic render function that receives context.
     * Typically used for navigation elements, logos, or menu toggles.
     * 
     * @example
     * ```tsx
     * // Static content
     * left: <Logo size="sm" />
     * left: <MenuButton />
     * 
     * // Dynamic content with context
     * left: ({ computedAppBarVariant, handleBackPress }) => (
     *   <div className="flex items-center gap-2">
     *     <BackButton onPress={handleBackPress} />
     *     <Logo variant={computedAppBarVariant} />
     *   </div>
     * )
     * ```
     */
    left?: ReactNode | ((context: Context & {
        /** Computed AppBar variant for consistent styling */
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        /** Pre-configured back press handler */
        handleBackPress: (event: any) => void;
    }) => ReactNode);

    /** 
     * Content for the right side of the AppBar.
     * Can be static ReactNode content or a dynamic render function that receives context.
     * Typically used for user actions, settings, notifications, or secondary navigation.
     * 
     * @example
     * ```tsx
     * // Static content
     * right: <UserAvatar />
     * right: <NotificationBell />
     * 
     * // Dynamic content with context
     * right: ({ computedAppBarVariant, context }) => (
     *   <div className="flex items-center gap-2">
     *     <ThemeToggle variant={computedAppBarVariant} />
     *     {context.user?.isAdmin && <AdminSettings />}
     *     <UserMenu />
     *   </div>
     * )
     * ```
     */
    right?: ReactNode | ((context: Context & {
        /** Computed AppBar variant for consistent styling */
        computedAppBarVariant: ReturnType<typeof appBarVariant>;
        /** Pre-configured back press handler */
        handleBackPress: (event: any) => void;
    }) => ReactNode);
}



/**
 * Properties for the main AppBar component.
 * 
 * This is the primary interface for the AppBar component, combining all feature-specific
 * interfaces (content, navigation, layout) with core AppBar functionality. The AppBar
 * serves as the main navigation and action bar for applications, providing a consistent
 * header interface across different screens and contexts.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarProps
 * @extends ISurfaceProps - Inherits surface styling capabilities
 * @extends IAppBarContent - Content-related properties (title, subtitle)
 * @extends IAppBarNavigation - Navigation-related properties (back button)
 * @extends IAppBarLayout - Layout-related properties (left, right areas)
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Basic AppBar with title and actions
 * <AppBar
 *   title="Dashboard"
 *   actions={[
 *     { id: 'save', label: 'Save', onPress: handleSave },
 *     { id: 'share', label: 'Share', onPress: handleShare }
 *   ]}
 *   onBackActionPress={() => router.back()}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced AppBar with custom context and responsive actions
 * <AppBar<UserContext>
 *   title="User Profile"
 *   subtitle={`Welcome, ${user.name}`}
 *   context={{ user, preferences }}
 *   variant="primary"
 *   left={<Logo />}
 *   right={<UserMenu />}
 *   actions={userActions}
 *   actionsProps={{
 *     viewportWidth: containerWidth,
 *     responsiveConfig: customResponsiveConfig,
 *     overflowMenuAccessibilityLabel: "More user actions"
 *   }}
 *   onBackActionPress={handleBackNavigation}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // AppBar in constrained context (modal, drawer)
 * <AppBar
 *   title="Settings"
 *   variant="surface"
 *   actions={settingsActions}
 *   actionsProps={{
 *     viewportWidth: 350, // Drawer width
 *     maxVisibleActions: 2,
 *     menuProps: {
 *       anchorClassName: "text-sm",
 *       preferredPosition: "bottom-start"
 *     }
 *   }}
 *   className="border-b"
 * />
 * ```
 */
export interface IAppBarProps<Context = unknown> extends
    Omit<ISurfaceProps, "title" | "variant">,
    IAppBarContent,
    IAppBarNavigation<Context>,
    IAppBarLayout<Context> {

    /** 
     * Context object passed to actions and render functions.
     * Provides additional data and functionality to action handlers and custom renderers.
     * 
     * @example
     * ```tsx
     * context: {
     *   user: currentUser,
     *   permissions: userPermissions,
     *   theme: currentTheme
     * }
     * ```
     */
    context?: Context;

    /** 
     * Visual variant for the AppBar styling.
     * Determines the overall appearance and color scheme of the AppBar.
     * 
     * @example
     * ```tsx
     * variant: {colorScheme:"primary"}    // Primary theme colors
     * variant: {colorScheme:"secondary"}  // Secondary theme colors
     * variant: {colorScheme:"surface"}    // Neutral surface colors
     * variant: {colorScheme:"ghost"}      // Minimal styling
     * ```
     */
    variant?: IAppBarVariant;

    /** 
     * Array of actions to display in the AppBar.
     * Actions are automatically managed with responsive behavior and overflow handling.
     * Shorthand for `actionsProps.actions`.
     * 
     * @example
     * ```tsx
     * actions: [
     *   {
     *     id: 'save',
     *     label: 'Save',
     *     fontIconName: 'save',
     *     onPress: handleSave,
     *     visibilityPriority:100,
     *   },
     *   {
     *     id: 'share',
     *     label: 'Share',
     *     fontIconName: 'share',
     *     onPress: handleShare,
     *     minViewportWidth: 768
     *   }
     * ]
     * ```
     */
    actions?: IAppBarActionsProps<Context>["actions"];

    /** 
     * Comprehensive properties for the actions container.
     * Provides full control over action rendering, responsive behavior, and styling.
     * 
     * @example
     * ```tsx
     * actionsProps: {
     *   actions: actionList,
     *   viewportWidth: containerWidth,
     *   responsiveConfig: customConfig,
     *   onAppBarActionClassName: "mx-1",
     *   menuProps: {
     *     anchorClassName: "text-primary",
     *     preferredPosition: "bottom-end"
     *   },
     *   overflowMenuAccessibilityLabel: "Additional actions"
     * }
     * ```
     */
    actionsProps?: IAppBarActionsProps<Context>;

    /** 
     * The maximum visible number of actions to display directly on the AppBar.
     * When exceeded, additional actions move to the overflow menu.
     * Shorthand for `actionsProps.maxVisibleActions`.
     * 
     * @example
     * ```tsx
     * maxVisibleActions: 3  // Show max 3 actions, rest in overflow menu
     * maxVisibleActions: 1  // Show only 1 action directly
     * ```
     */
    maxVisibleActions?: IAppBarActionsProps<Context>["maxVisibleActions"];

    /** 
     * CSS class name applied to the actions container.
     * Used for custom styling of the entire actions area.
     * Shorthand for `actionsProps.className`.
     * 
     * @example
     * ```tsx
     * actionsClassName: "gap-2 px-4"
     * actionsClassName: "border-l pl-4 ml-4"
     * ```
     */
    actionsClassName?: IClassName;
}

/**
 * Properties for the AppBar actions container component.
 * 
 * This interface defines comprehensive configuration options for managing and displaying
 * actions within the AppBar. It includes responsive behavior, overflow handling, custom
 * rendering, performance optimizations, and accessibility features. The actions system
 * automatically handles viewport-aware display with intelligent overflow menu management.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarActionsProps
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Basic actions configuration
 * const actionsProps: IAppBarActionsProps = {
 *   actions: [
 *     { id: 'save', label: 'Save', onPress: handleSave },
 *     { id: 'delete', label: 'Delete', onPress: handleDelete }
 *   ],
 *   maxVisibleActions: 2
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Advanced responsive configuration
 * const responsiveActionsProps: IAppBarActionsProps<UserContext> = {
 *   actions: userActions,
 *   viewportWidth: containerWidth,
 *   responsiveConfig: {
 *     breakpoints: [
 *       { width: 1024, maxActions: 5 },
 *       { width: 768, maxActions: 3 },
 *       { width: 480, maxActions: 1 }
 *     ],
 *     defaultMaxActions: 1
 *   },
 *   menuProps: {
 *     anchorClassName: "text-primary",
 *     preferredPosition: "bottom-end",
 *     showBackdrop: true
 *   },
 *   context: { user, permissions },
 *   accessibilityLabel: "User actions",
 *   overflowMenuAccessibilityLabel: "More user actions"
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Custom rendering with performance optimizations
 * const customActionsProps: IAppBarActionsProps = {
 *   actions: largeActionList,
 *   enableVirtualization: true,
 *   renderAction: (action, index) => (
 *     <CustomActionButton key={action.id} {...action} />
 *   ),
 *   onAppBarActionClassName: "custom-action-style",
 *   onMenuActionClassNamee: "custom-menu-item-style"
 * };
 * ```
 */
export interface IAppBarActionsProps<Context = unknown> {
    /** 
     * Test identifier for automation testing.
     * Used to locate the actions container in automated tests.
     * 
     * @example
     * ```tsx
     * testID: "appbar-actions"
     * testID: "user-profile-actions"
     * ```
     */
    testID?: string;

    /** 
     * CSS class name applied to the actions container.
     * Controls the styling and layout of the entire actions area.
     * 
     * @example
     * ```tsx
     * className: "flex gap-2 px-4"
     * className: "border-l border-gray-200 pl-4 ml-4"
     * ```
     */
    className?: IClassName;

    // Viewport and Responsive Configuration
    /** 
     * The width of the current viewport/container in pixels.
     * Used to calculate responsive action display based on available space.
     * Should represent the actual available width where the AppBar is rendered
     * (window, drawer, modal, etc.).
     * 
     * @example
     * ```tsx
     * viewportWidth: window.innerWidth        // Full window width
     * viewportWidth: 350                      // Drawer width
     * viewportWidth: drawerRef.current?.clientWidth  // Dynamic container width
     * ```
     */
    viewportWidth?: number;

    /** 
     * Responsive configuration for action display breakpoints.
     * Defines how many actions to show at different viewport widths.
     * Uses APP_BAR_DEFAULT_RESPONSIVE_CONFIG if not provided.
     * 
     * @example
     * ```tsx
     * responsiveConfig: {
     *   breakpoints: [
     *     { width: 1200, maxActions: 6 },
     *     { width: 768, maxActions: 4 },
     *     { width: 480, maxActions: 2 },
     *     { width: 320, maxActions: 1 }
     *   ],
     *   defaultMaxActions: 1
     * }
     * ```
     */
    responsiveConfig?: IAppBarResponsiveConfig;

    // Action Configuration
    /** 
     * Array of actions to display in the AppBar.
     * Actions are automatically sorted by priority and managed with responsive overflow.
     * 
     * @example
     * ```tsx
     * actions: [
     *   {
     *     id: 'save',
     *     label: 'Save Document',
     *     fontIconName: 'save',
     *     onPress: handleSave,
     *     visibilityPriority: 100, // High priority
     *     accessibility: { label: 'Save the current document' }
     *   },
     *   {
     *     id: 'share',
     *     label: 'Share',
     *     fontIconName: 'share',
     *     onPress: handleShare,
     *     minViewportWidth: 768,
     *     group: 'sharing'
     *   }
     * ]
     * ```
     */
    actions?: INavItems<IAppBarActionProps<Context>>;

    /** 
     * Maximum number of actions to display directly in the AppBar.
     * When not specified, uses responsive configuration for automatic calculation.
     * Additional actions are moved to the overflow menu.
     * Note: The system accounts for the overflow menu button taking one action slot.
     * 
     * @example
     * ```tsx
     * maxVisibleActions: 3  // Show max 3 actions, rest overflow to menu
     * maxVisibleActions: 1  // Show only 1 action, rest in menu
     * maxVisibleActions: 0  // All actions in overflow menu
     * ```
     */
    maxVisibleActions?: number;


    // Action Styling
    /** 
     * CSS class name applied to each action button rendered directly in the AppBar.
     * Used for consistent styling of visible actions.
     * 
     * @example
     * ```tsx
     * onAppBarActionClassName: "mx-1 hover:bg-gray-100"
     * onAppBarActionClassName: "rounded-lg transition-colors"
     * ```
     */
    onAppBarActionClassName?: IClassName;

    /** 
     * CSS class name applied to actions rendered inside the overflow menu.
     * Used for styling menu items differently from direct actions.
     * 
     * @example
     * ```tsx
     * onMenuActionClassNamee: "px-4 py-2 text-left"
     * onMenuActionClassNamee: "hover:bg-primary/10"
     * ```
     */
    onMenuActionClassNamee?: IClassName;

    // Action Rendering
    /** 
     * Custom function to render individual actions.
     * Provides complete control over action appearance and behavior.
     * 
     * @param action - The action properties to render
     * @param index - The index of the action in the actions array
     * @returns Rendered action element
     * 
     * @example
     * ```tsx
     * renderAction: (action, index) => (
     *   <CustomActionButton
     *     key={action.id}
     *     variant={action.priority === 'high' ? 'primary' : 'ghost'}
     *     {...action}
     *   />
     * )
     * ```
     */
    renderAction?: INavItemsProps<IAppBarContext<Context>>["renderItem"];

    /** 
     * Custom function to render expandable/nested actions.
     * Used for actions that contain sub-actions or dropdowns.
     * 
     * @param action - The expandable action properties to render
     * @param index - The index of the action in the actions array
     * @returns Rendered expandable action element
     * 
     * @example
     * ```tsx
     * renderExpandableAction: (action, index) => (
     *   <DropdownActionButton
     *     key={action.id}
     *     items={action.items}
     *     {...action}
     *   />
     * )
     * ```
     */
    renderExpandableAction?: INavItemsProps<IAppBarContext<Context>>["renderExpandableItem"];

    // Context and State
    /** 
     * Context object passed to actions for extended functionality.
     * Provides additional data and computed values to action handlers.
     * 
     * @example
     * ```tsx
     * context: {
     *   appBarVariant: "primary",
     *   viewport: { width: 1024, height: 768 },
     *   isConstrained: false,
     *   performance: { enableVirtualization: true }
     * }
     * ```
     */
    context?: IAppBarContext<Context>;

    /** 
     * Custom overflow menu configuration.
     * Provides extensive customization options for the overflow menu behavior,
     * appearance, and interaction patterns.
     * 
     * @example
     * ```tsx
     * menuProps: {
     *   // Anchor customization
     *   anchorClassName: "text-primary hover:bg-primary/10",
     *   anchorIconSize: 24,
     *   anchorClosedIconName: "more-vertical",  // Icon when menu is closed
     *   anchorOpenIconName: "x",               // Icon when menu is open
     *   anchorIconVariant: "ghost",
     *   
     *   // Menu behavior
     *   preferredPosition: "bottom-end",
     *   showBackdrop: true,
     *   closeOnItemSelect: true,
     *   
     *   // Menu styling
     *   className: "min-w-48 shadow-lg",
     *   itemClassName: "px-4 py-2",
     *   
     *   // Advanced features
     *   enableVirtualScrolling: true,
     *   searchable: true,
     *   grouping: { enabled: true, sortGroups: true }
     * }
     * ```
     */
    menuProps?: Omit<IMenuProps<IAppBarContext<Context>>, "context" | "items" | "anchor"> & {
        /** CSS class name for the overflow menu anchor button */
        anchorClassName?: IClassName;
        /** Size of the overflow menu anchor icon */
        anchorIconSize?: IIconButtonProps["size"];
        /** 
         * Icon name for the overflow menu anchor button when the menu is closed.
         * This is the default state icon that users see before opening the menu.
         * Common examples: "more-horizontal", "more-vertical", "menu", "dots-three"
         * 
         * @defaultValue "more-vertical"
         * @example
         * ```tsx
         * anchorClosedIconName: "more-horizontal"  // Three horizontal dots
         * anchorClosedIconName: "menu"             // Hamburger menu icon
         * anchorClosedIconName: "dots-three"       // Three vertical dots
         * ```
         */
        anchorClosedIconName?: IFontIconName;
        /**
         * Icon name for the overflow menu anchor button when the menu is open.
         * This icon provides visual feedback that the menu is currently active/open.
         * Common examples: "x", "close", "chevron-up", "minus"
         * 
         * @defaultValue Same as anchorClosedIconName (no state change)
         * @example
         * ```tsx
         * anchorOpenIconName: "x"              // X icon when menu is open
         * anchorOpenIconName: "close"          // Close icon when menu is open  
         * anchorOpenIconName: "chevron-up"     // Up arrow when menu is open
         * anchorOpenIconName: "minus"          // Minus icon when menu is open
         * ```
         */
        anchorOpenIconName?: IFontIconName;
        /** Visual variant for the overflow menu anchor button */
        anchorIconVariant?: IIconButtonVariant;
        /** Custom anchor element (overrides default icon button) */
        anchor?: IMenuProps<IAppBarContext<Context>>["anchor"];
    };

    // Performance and Accessibility
    /** 
     * Enable performance optimizations for large action lists.
     * Implements virtual scrolling and lazy rendering for better performance.
     * 
     * @defaultValue false
     * @example
     * ```tsx
     * enableVirtualization: true  // For 50+ actions
     * ```
     */
    enableVirtualization?: boolean;

    /** 
     * Accessibility label for the entire actions container.
     * Used by screen readers to describe the actions area.
     * 
     * @example
     * ```tsx
     * accessibilityLabel: "Document actions"
     * accessibilityLabel: "User profile actions"
     * ```
     */
    accessibilityLabel?: string;

    /** 
     * Accessibility label for the overflow menu button.
     * Helps users understand what the overflow menu contains.
     * 
     * @defaultValue "More actions"
     * @example
     * ```tsx
     * overflowMenuAccessibilityLabel: "Additional document actions"
     * overflowMenuAccessibilityLabel: "More user options"
     * ```
     */
    overflowMenuAccessibilityLabel?: string;
}
/**
 * Context type for AppBar components with enhanced functionality.
 * 
 * This type extends the base context with AppBar-specific properties that provide
 * computed styles, viewport information, performance flags, and constraint details.
 * The context is passed to actions, render functions, and other AppBar components
 * to enable dynamic behavior and consistent styling.
 * 
 * @template Context - Generic type parameter for extending context functionality
 * @interface IAppBarContext
 * @since 1.0.0
 * 
 * @example
 * ```tsx
 * // Basic context usage in action render function
 * const contextualAction: IAppBarActionProps<UserContext> = {
 *   id: 'theme-toggle',
 *   render: ({ context }) => (
 *     <ThemeToggle 
 *       variant={context.appBarVariant}
 *       size={context.isConstrained ? 'sm' : 'md'}
 *       user={context.user}
 *     />
 *   )
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Responsive behavior based on viewport
 * const responsiveAction: IAppBarActionProps = {
 *   id: 'search',
 *   render: ({ context }) => (
 *     <SearchInput 
 *       placeholder={context.viewport?.width < 768 ? "Search..." : "Search documents..."}
 *       showIcon={context.viewport?.width >= 480}
 *       variant={context.appBarVariant}
 *     />
 *   )
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Performance-aware rendering
 * const optimizedAction: IAppBarActionProps = {
 *   id: 'notifications',
 *   render: ({ context }) => (
 *     <NotificationBell 
 *       enableVirtualization={context.performance?.enableVirtualization}
 *       memoized={context.performance?.enableMemoization}
 *     />
 *   )
 * };
 * ```
 */
export type IAppBarContext<Context = unknown> = Context & {
    /** 
     * Computed AppBar variant for consistent styling across all child components.
     * Provides the resolved variant that accounts for theme, state, and props.
     * 
     * @example
     * ```tsx
     * // Use in action rendering
     * render: ({ context }) => (
     *   <Button variant={context.appBarVariant === 'primary' ? 'ghost' : 'solid'}>
     *     Action
     *   </Button>
     * )
     * ```
     */
    appBarVariant: IAppBarVariant;

    /** 
     * Current viewport dimensions for responsive behavior.
     * Provides real-time viewport size information for dynamic layouts.
     * May be undefined during initial render or SSR.
     * 
     * @example
     * ```tsx
     * // Responsive content based on viewport
     * render: ({ context }) => (
     *   <div>
     *     {context.viewport?.width > 768 ? (
     *       <FullSearchBar />
     *     ) : (
     *       <SearchIcon />
     *     )}
     *   </div>
     * )
     * ```
     */
    viewport?: {
        /** Current viewport width in pixels */
        width: number;
        /** Current viewport height in pixels */
        height: number;
    };

    /** 
     * Indicates whether the AppBar is rendered in a constrained container.
     * True for contexts like drawers, modals, or sidebars with limited space.
     * Used to adjust spacing, sizing, and interaction patterns.
     * 
     * @example
     * ```tsx
     * // Adjust spacing in constrained contexts
     * render: ({ context }) => (
     *   <Button 
     *     size={context.isConstrained ? 'sm' : 'md'}
     *     className={context.isConstrained ? 'px-2' : 'px-4'}
     *   >
     *     Action
     *   </Button>
     * )
     * ```
     */
    isConstrained?: boolean;

    /** 
     * Performance optimization flags and settings.
     * Controls various performance features like virtualization and memoization.
     * 
     * @example
     * ```tsx
     * // Performance-aware component rendering
     * render: ({ context }) => (
     *   <ActionsList 
     *     virtual={context.performance?.enableVirtualization}
     *     memoize={context.performance?.enableMemoization}
     *   />
     * )
     * ```
     */
    performance?: {
        /** Whether virtual scrolling is enabled for large lists */
        enableVirtualization: boolean;
        /** Whether component memoization is enabled */
        enableMemoization: boolean;
    };
}



/**
 * Type definition for actions that can be included in an application bar (AppBar).
 * 
 * The `IAppBarActionProps` type extends the properties of {@link INavItemProps}, allowing
 * developers to define actions that can be performed from the AppBar. This type
 * can be used to create buttons or interactive elements within the AppBar that 
 * respond to user interactions with intelligent responsive behavior.
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
 * // Basic action with visibility priority
 * const saveAction: IAppBarActionProps = {
 *   id: 'save',
 *   label: 'Save',
 *   onPress: () => handleSave(),
 *   visibilityPriority: 90  // High visibility priority (stays visible longer)
 * };
 * 
 * // Action with custom priority based on context
 * const contextualAction: IAppBarActionProps = {
 *   id: 'share',
 *   label: 'Share',
 *   onPress: handleShare,
 *   visibilityPriority: user.isPremium ? 80 : 30,  // Dynamic priority
 *   minViewportWidth: 768
 * };
 * 
 * // Critical action that's always visible
 * const criticalAction: IAppBarActionProps = {
 *   id: 'emergency',
 *   label: 'Emergency Stop',
 *   onPress: handleEmergency,
 *   alwaysVisible: true  // Bypasses all responsive hiding
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Using predefined priority constants for consistency
 * const VISIBILITY_PRIORITIES = {
 *   CRITICAL: 100,
 *   HIGH: 75,
 *   NORMAL: 50,
 *   LOW: 25,
 *   OPTIONAL: 10
 * } as const;
 * 
 * const actions: IAppBarActionProps[] = [
 *   { id: 'save', label: 'Save', visibilityPriority: VISIBILITY_PRIORITIES.CRITICAL },
 *   { id: 'edit', label: 'Edit', visibilityPriority: VISIBILITY_PRIORITIES.HIGH },
 *   { id: 'export', label: 'Export', visibilityPriority: VISIBILITY_PRIORITIES.NORMAL },
 *   { id: 'archive', label: 'Archive', visibilityPriority: VISIBILITY_PRIORITIES.LOW }
 * ];
 * ```
 */
export interface IAppBarActionProps<Context = unknown> extends INavItemProps<IAppBarContext<Context>> {
    /** 
     * Visibility priority level for responsive display management.
     * 
     * Determines the order in which actions are hidden when viewport space is limited.
     * Higher numbers mean higher priority - these actions stay visible longer as the 
     * screen shrinks. Lower priority actions are moved to the overflow menu first.
     * 
     * **Recommended Priority Ranges:**
     * - `90-100`: Critical actions (save, submit, emergency)
     * - `70-89`: High priority actions (share, edit, delete, search)
     * - `40-69`: Normal priority actions (export, print, copy, settings)
     * - `20-39`: Low priority actions (archive, duplicate, rename)
     * - `1-19`: Optional actions (debug, advanced options, metadata)
     * 
     * @defaultValue 50 (normal priority)
     * 
     * @example
     * ```tsx
     * // Critical action - always among the last to be hidden
     * visibilityPriority: 95
     * 
     * // High priority - important but not critical
     * visibilityPriority: 80
     * 
     * // Normal priority - standard action
     * visibilityPriority: 50
     * 
     * // Low priority - first to move to overflow menu  
     * visibilityPriority: 25
     * 
     * // Fine-grained custom priority
     * visibilityPriority: 73  // Slightly higher than normal, lower than high
     * 
     * // Dynamic priority based on context
     * visibilityPriority: user.isAdmin ? 85 : 40
     * ```
     */
    visibilityPriority?: number;

    /** 
     * Whether this action should always be visible regardless of viewport constraints.
     * When true, the action bypasses all responsive hiding and overflow menu behavior.
     * Use sparingly for critical actions only (emergency stops, primary save actions).
     * 
     * @defaultValue false
     * 
     * @example
     * ```tsx
     * // Emergency action that must always be visible
     * alwaysVisible: true
     * 
     * // Conditional always-visible based on context
     * alwaysVisible: action.type === 'emergency' || user.role === 'safety-officer'
     * ```
     */
    alwaysVisible?: boolean;

    /**
     * Minimum viewport width (in pixels) required to show this action directly in the AppBar.
     * Below this width, the action is automatically moved to the overflow menu regardless
     * of its visibility priority. Useful for actions that need specific screen real estate.
     * 
     * @example
     * ```tsx
     * // Only show search bar on larger screens
     * minViewportWidth: 768  // Hide on mobile, show on tablet+
     * 
     * // Show detailed actions only on desktop
     * minViewportWidth: 1024  // Hide on mobile/tablet, show on desktop
     * 
     * // Context-aware minimum width
     * minViewportWidth: isComplexAction ? 640 : 320
     * ```
     */
    minViewportWidth?: number;

    /**
     * Custom CSS class names to apply when this action is rendered directly on the AppBar.
     * These classes are applied in addition to the default AppBar action styling.
     * Use for context-specific styling when the action is visible in the main bar.
     * 
     * @example
     * ```tsx
     * // Different styling when shown directly on AppBar
     * onAppBarClassName: "bg-primary text-white px-4 py-2 rounded-md"
     * 
     * // Responsive AppBar styling
     * onAppBarClassName: "hidden sm:flex items-center space-x-2"
     * 
     * // Brand-specific styling for primary actions
     * onAppBarClassName: "bg-brand-500 hover:bg-brand-600 text-white font-medium"
     * ```
     */
    onAppBarClassName?: string;

    /**
     * Custom CSS class names to apply when this action is rendered in the overflow menu.
     * These classes are applied in addition to the default menu item styling.
     * Use for context-specific styling when the action is in the dropdown menu.
     * 
     * @example
     * ```tsx
     * // Different styling when shown in overflow menu
     * onMenuClassName: "text-gray-700 hover:bg-gray-50 px-3 py-2"
     * 
     * // Menu-specific layout styling
     * onMenuClassName: "flex items-center justify-between w-full"
     * 
     * // Danger action styling in menu context
     * onMenuClassName: "text-red-600 hover:bg-red-50 hover:text-red-700"
     * ```
     */
    onMenuClassName?: string;

    /**
     * Accessibility configuration for the action.
     * Provides enhanced accessibility support for screen readers and assistive technologies.
     * 
     * @example
     * ```tsx
     * accessibility: {
     *   label: "Save the current document to disk",
     *   hint: "Press to save your changes permanently", 
     *   role: "button"
     * }
     * ```
     */
    accessibility?: {
        /** 
         * Detailed accessibility label for screen readers.
         * Should describe what the action does in detail.
         */
        label?: string;
        /** 
         * Accessibility hint describing the action's behavior or outcome.
         * Provides additional context for users with disabilities.
         */
        hint?: string;
        /** 
         * Accessibility role override for the action element.
         * Defaults to appropriate role based on action type.
         */
        role?: string;
    };

    /**
     * Controls whether this action can be rendered in the overflow menu.
     * 
     * When set to `false`, the action will never appear in the dropdown menu, 
     * even if there's insufficient space on the AppBar. This is useful for:
     * - Actions that require AppBar context and don't work well in menus
     * - Critical actions that must always be immediately visible
     * - Actions with custom styling that breaks in menu context
     * 
     * **Note:** If both `visibleOnAppBar` and `visibleOnMenu` are false, 
     * the action will not be rendered at all.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Action that should never go to menu (AppBar only)
     * visibleOnMenu: false
     * 
     * // Conditional menu visibility based on action type
     * visibleOnMenu: action.type !== 'primary-navigation'
     * 
     * // Complex actions that don't work well in menu context
     * visibleOnMenu: !action.hasComplexInteraction
     * ```
     */
    visibleOnMenu?: boolean;

    /**
     * Controls whether this action can be rendered directly on the AppBar.
     * 
     * When set to `false`, the action will only appear in the overflow menu,
     * never directly on the AppBar. This is useful for:
     * - Secondary actions that shouldn't clutter the main interface
     * - Actions that work better in a menu context (e.g., multi-step workflows)
     * - Administrative or advanced actions that should be less prominent
     * 
     * **Note:** If both `visibleOnAppBar` and `visibleOnMenu` are false, 
     * the action will not be rendered at all.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Action that should only appear in menu
     * visibleOnAppBar: false
     * 
     * // Conditional AppBar visibility based on user role
     * visibleOnAppBar: user.role === 'admin' || action.priority === 'high'
     * 
     * // Keep secondary actions in menu only
     * visibleOnAppBar: action.category !== 'secondary'
     * ```
     */
    visibleOnAppBar?: boolean;
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

