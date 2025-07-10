import { ISurfaceProps, Surface } from "@components/Surface";
import { isValidElement, ReactNode } from "react";
import { Icon, IIconSource } from "@components/Icon";
import { IIconVariant } from "@variants/icon";
import { IClassName } from "@src/types";
import { defaultStr, isNonNullString, isObj } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { Text } from "@html/Text";
import { Div } from "@html/Div";
import { textVariant, ITextVariant } from "@variants/text";
import { iconVariant as iconVariants } from "@variants/icon";
import { alertVariant, IAlertVariant } from "@variants/alert";
import { IHtmlTextProps } from "@html/types";
import { useAlert } from "./hook";
import { CloseAlert } from "./Close";
import { INavItemsProps, Nav } from "@components/Nav";
import { IAlertHook } from "./types";


/**
 * A versatile alert component for displaying notifications, warnings, errors, and informational messages.
 * 
 * The Alert component provides a flexible and accessible way to communicate important information
 * to users. It supports multiple predefined types (info, warning, error, success) with automatic
 * icon and color scheme selection, or can be fully customized with custom content and styling.
 * 
 * The component features a sophisticated layout system with header, message, and action areas,
 * making it suitable for both simple notifications and complex interactive dialogs.
 * 
 * ## Key Features
 * - **Automatic type-based styling**: Predefined visual themes for common alert types
 * - **Flexible content**: Support for text, React elements, and rich content
 * - **Interactive actions**: Built-in support for action buttons with context awareness
 * - **Dismissible behavior**: Optional close functionality with customizable close icons
 * - **Responsive layout**: Adapts to different screen sizes and content lengths
 * - **Accessibility ready**: Comprehensive ARIA support and keyboard navigation
 * - **Animation support**: Smooth transitions for show/hide states
 * 
 * ## Layout Structure
 * ```
 * ┌─────────────────────────────────────────────────────────┐
 * │ Header: [Icon] [Title] [HeaderContent] [Close Button]   │
 * ├─────────────────────────────────────────────────────────┤
 * │ Message: Detailed description or rich content           │
 * ├─────────────────────────────────────────────────────────┤
 * │ Children: Custom content area                           │
 * ├─────────────────────────────────────────────────────────┤
 * │ Actions: [Button 1] [Button 2] [Button N]              │
 * └─────────────────────────────────────────────────────────┘
 * ```
 * 
 * @example
 * ```tsx
 * // Simple success notification
 * <Alert 
 *   title="Upload Complete" 
 *   message="Your file has been successfully uploaded."
 *   type="success"
 *   dismissible={true}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Error alert with custom actions
 * <Alert 
 *   title="Connection Failed"
 *   message="Unable to connect to the server. Please check your internet connection."
 *   type="error"
 *   actions={{
 *     items: [
 *       {
 *         label: "Retry",
 *         variant: { colorScheme: "primary" },
 *         onPress: (context) => {
 *           retryConnection();
 *           context.close();
 *         }
 *       },
 *       {
 *         label: "Cancel",
 *         variant: { colorScheme: "muted" },
 *         onPress: (context) => context.close()
 *       }
 *     ]
 *   }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Centered modal alert with rich content
 * <Alert 
 *   title="System Update Available"
 *   centered={true}
 *   headerContent={<Badge variant="info">v2.1.0</Badge>}
 *   message={
 *     <View>
 *       <Text className="mb-2">New features in this update:</Text>
 *       <Text>• Enhanced performance and stability</Text>
 *       <Text>• New dark mode theme</Text>
 *       <Text>• Improved accessibility features</Text>
 *       <Text>• Bug fixes and security updates</Text>
 *     </View>
 *   }
 *   actions={{
 *     items: [
 *       {
 *         label: "Update Now",
 *         variant: { colorScheme: "primary" },
 *         onPress: (ctx) => { startUpdate(); ctx.close(); }
 *       },
 *       {
 *         label: "Remind Later",
 *         variant: { colorScheme: "muted" },
 *         onPress: (ctx) => { scheduleReminder(); ctx.close(); }
 *       }
 *     ]
 *   }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom styled alert with progress indicator
 * <Alert 
 *   title="File Processing"
 *   type="info"
 *   icon="material-cloud-upload"
 *   headerContent={
 *     <View className="flex-1 mx-4">
 *       <ProgressBar progress={uploadProgress} />
 *       <Text className="text-xs text-center mt-1">
 *         {Math.round(uploadProgress * 100)}% Complete
 *       </Text>
 *     </View>
 *   }
 *   message="Please wait while we process your files..."
 *   dismissible={false}
 *   variant={{
 *     colorScheme: "primary",
 *     size: "lg",
 *     rounded: "lg"
 *   }}
 * />
 * ```
 * 
 * @param props - The alert component props
 * @returns The rendered alert component or null if shouldRender is false
 * 
 * @public
 * @component
 * @since 1.0.0
 * 
 * @see {@link IAlertProps} for detailed prop documentation
 * @see {@link useAlert} for alert state management
 * @see {@link IAlertVariant} for styling options
 * @see {@link IAlertHook} for action context properties
 */
export function Alert({ title, icon, headerContent, centered, dismissible, closeIcon, actions, closeIconVariant, closeIconClassName, closeIconContainerClassName, iconClassName, messageProps, children, type, titleVariant, iconContainerClassName, iconVariant, variant, messageVariant, titleClassName, testID, message, messageClassName, headerClassName, className, ...rest }: IAlertProps) {
    const { isOpen, open, close, shouldRender, className: alertClassName } = useAlert();
    testID = defaultStr(testID, "resk-alert");
    dismissible = centered ? !!dismissible : dismissible !== false;
    let iconByType: IIconSource | undefined = undefined, variantByType: IAlertVariant | undefined = undefined;
    switch (String(type).toLowerCase()) {
        case "info":
            type = "info";
            iconByType = "material-info" as IIconSource;
            variantByType = { colorScheme: "info" };
            break;
        case "warning":
            type = "warning";
            iconByType = "material-warning" as IIconSource;
            variantByType = { colorScheme: "warning" };
            break;
        case "error":
            type = "error";
            iconByType = "material-error" as IIconSource;
            variantByType = { colorScheme: "error" };
            break;
        case "success":
            type = "success";
            iconByType = "material-check-circle" as IIconSource;
            variantByType = { colorScheme: "success" };
            break;
    }
    variant = Object.assign({}, variant);
    variant.centered = typeof variant.centered == "boolean" ? variant.centered : !!centered;
    const computedVariant = alertVariant({ ...variantByType, ...variant });
    const iconContent = Icon.getIcon({ icon: icon ?? iconByType, className: cn("resk-alert-icon", computedVariant.icon(), iconVariants(iconVariant), iconClassName), testID: testID + "-icon" });
    const closeIContent = Icon.getIcon({ icon: closeIcon ?? "close" as never, className: cn("resk-alert--close-icon", computedVariant.closeIcon(), iconVariants(closeIconVariant), closeIconClassName), testID: testID + "-close-icon" });
    const navItems: INavItemsProps<IAlertHook>["items"] = [];
    (Array.isArray(actions) ? actions : []).map((act) => {
        if (!isObj(act)) return;
        const newAct = Object.clone(act);
        newAct.context = { ...act.context, isOpen, open, close };
        navItems.push(newAct);
    });
    title = isValidElement(title) || isNonNullString(title) ? title : undefined;
    message = isValidElement(message) || isNonNullString(message) ? message : undefined;
    if (!shouldRender) return null;
    return <Surface {...rest} testID={testID} className={cn("resk-alert transform transition-opacity duration-300 flex flex-col w-full", isOpen ? ["opacity-100"] : ["opacity-0"], alertClassName, computedVariant.base(), className)}>
        {<Div className={cn("w-full resk-alert-header", computedVariant.header(), headerClassName)}>
            {iconContent || title ? <Div className={cn("flex flex-row justify-start items-center self-center grow")}>
                {iconContent ? <Div className={cn("overflow-hidden align-center items-center justify-center flex flex-col resk-alert-icon-container", computedVariant.iconContainer(), iconContainerClassName)} testID={testID + "-icon-container"}>{iconContent}</Div> : null}
                <Text testID={testID + "-title"} className={cn("resk-alert-title", computedVariant.title(), textVariant(titleVariant), titleClassName)}>
                    {title}
                </Text>
            </Div> : null}
            {isValidElement(headerContent) ? headerContent : null}
            {closeIContent && dismissible ? <CloseAlert
                className={cn("overflow-hidden align-center grow-0 items-center justify-center flex flex-col resk-alert-close-icon-container", computedVariant.closeIconContainer(), closeIconContainerClassName)}
                children={closeIContent} isOpen={isOpen} open={open} close={close}
                testID={testID + "-close-icon-container"}
            /> : null}
        </Div>}
        {message ? <Text numberOfLines={10} {...messageProps} testID={testID + "-message"} className={cn("resk-alert-message w-full", computedVariant.message(), textVariant(messageVariant), messageProps?.className, messageClassName)}>
            {message}
        </Text> : null}
        {children ? children : null}
        {navItems?.length ? <Nav.Items<IAlertHook>
            items={navItems}
            className={cn("resk-alert-actions w-full flex flex-row flex-wrap", computedVariant.actions(), actions?.className)}
        /> : null}
    </Surface>
}



/**
 * Alert component interface defining all available props for customizing the alert's appearance and behavior.
 * 
 * This interface extends ISurfaceProps while omitting conflicting props like 'title' and 'variant'
 * to provide a specialized implementation for alert components.
 * 
 * @public
 * @interface IAlertProps
 * @extends {Omit<ISurfaceProps, "title" | "variant">}
 * @since 1.0.0
 */
export interface IAlertProps extends Omit<ISurfaceProps, "title" | "variant"> {
    /**
     * The main title/heading content of the alert.
     * 
     * Can be a string, React element, or any valid ReactNode. When provided as a string,
     * it will be rendered using the Text component with appropriate styling. When provided
     * as a React element, it will be rendered as-is.
     * 
     * @example
     * ```tsx
     * // String title
     * <Alert title="Success!" type="success" />
     * 
     * // Custom React element title
     * <Alert 
     *   title={<Text className="font-bold text-lg">Custom Title</Text>} 
     *   type="info" 
     * />
     * 
     * // With JSX content
     * <Alert 
     *   title={
     *     <View className="flex-row items-center">
     *       <Text>Upload Complete</Text>
     *       <Badge>New</Badge>
     *     </View>
     *   } 
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    title?: ReactNode;

    /**
     * Icon variant configuration for customizing the main alert icon appearance.
     * 
     * Controls the visual styling of the icon displayed next to the title.
     * This includes size, color scheme, and other visual properties defined
     * in the icon variant system.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Warning" 
     *   type="warning"
     *   iconVariant={{ size: "lg", colorScheme: "warning" }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link IIconVariant} for available variant options
     * @since 1.0.0
     */
    iconVariant?: IIconVariant;

    /**
     * Text variant configuration for the alert title styling.
     * 
     * Defines the typography and color styling for the title text including
     * font size, weight, color, and other text-specific properties.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Important Notice"
     *   titleVariant={{ size: "xl", weight: "bold", colorScheme: "primary" }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link ITextVariant} for available text variant options
     * @since 1.0.0
     */
    titleVariant?: ITextVariant;

    /**
     * Additional CSS classes to apply to the title text element.
     * 
     * These classes will be merged with the computed variant classes and
     * can be used for custom styling or overriding default styles.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Styled Title"
     *   titleClassName="text-2xl font-extrabold text-purple-600"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    titleClassName?: IClassName;

    /**
     * Additional CSS classes to apply to the alert header container.
     * 
     * The header contains the icon, title, headerContent, and close button.
     * Use this prop to customize the header's layout, spacing, or background.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Header"
     *   headerClassName="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-lg"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    headerClassName?: IClassName;

    /**
     * The main message/description content of the alert.
     * 
     * Displays below the header and provides detailed information about the alert.
     * Can be a string, React element, or any valid ReactNode. For long messages,
     * the component automatically handles text wrapping and truncation.
     * 
     * @example
     * ```tsx
     * // Simple text message
     * <Alert 
     *   title="Upload Complete"
     *   message="Your file has been successfully uploaded to the server."
     * />
     * 
     * // Rich content message
     * <Alert 
     *   title="Update Available"
     *   message={
     *     <View>
     *       <Text>A new version is available with the following features:</Text>
     *       <Text>• Improved performance</Text>
     *       <Text>• Bug fixes</Text>
     *       <Text>• New UI components</Text>
     *     </View>
     *   }
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    message?: ReactNode;

    /**
     * Additional CSS classes to apply to the message text element.
     * 
     * These classes will be merged with the computed variant classes and
     * message-specific styling.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   message="This is a custom styled message"
     *   messageClassName="text-sm italic text-gray-600 leading-relaxed"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    messageClassName?: IClassName;

    /**
     * Text variant configuration for the alert message styling.
     * 
     * Controls the typography and visual appearance of the message text
     * including font size, weight, color, and line height.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   message="Detailed information about the alert"
     *   messageVariant={{ size: "sm", colorScheme: "muted" }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link ITextVariant} for available variant options
     * @since 1.0.0
     */
    messageVariant?: ITextVariant;

    /**
     * Custom icon to display in the alert header.
     * 
     * Overrides the default icon that would be automatically selected based on the alert type.
     * Can be any valid icon source supported by the Icon component.
     * 
     * @example
     * ```tsx
     * // Using a material icon
     * <Alert 
     *   title="Custom Alert"
     *   icon="material-star"
     *   type="info"
     * />
     * 
     * // Using a custom icon source
     * <Alert 
     *   title="Upload"
     *   icon={{ uri: "https://example.com/upload-icon.png" }}
     * />
     * ```
     * 
     * @defaultValue Automatically selected based on alert type
     * @see {@link IIconSource} for supported icon formats
     * @since 1.0.0
     */
    icon?: IIconSource;

    /**
     * Additional CSS classes to apply to the main alert icon.
     * 
     * These classes customize the appearance of the icon displayed next to the title.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Icon Style"
     *   icon="material-info"
     *   iconClassName="text-3xl text-blue-500 animate-pulse"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    iconClassName?: IClassName;

    /**
     * Additional CSS classes to apply to the icon container element.
     * 
     * The icon container wraps the icon and controls its positioning and spacing
     * within the header layout.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Styled Icon Container"
     *   icon="material-warning"
     *   iconContainerClassName="bg-yellow-100 rounded-full p-2 mr-3"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    iconContainerClassName?: IClassName;

    /**
     * Alert variant configuration for overall styling and behavior.
     * 
     * Controls the visual theme, color scheme, size, and layout properties
     * of the entire alert component. This is the primary way to customize
     * the alert's appearance.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Variant"
     *   variant={{ 
     *     colorScheme: "primary", 
     *     size: "lg", 
     *     rounded: "xl",
     *     shadow: "lg"
     *   }}
     * />
     * ```
     * 
     * @defaultValue Computed based on alert type
     * @see {@link IAlertVariant} for available variant options
     * @since 1.0.0
     */
    variant?: IAlertVariant;

    /**
     * Predefined alert type that automatically configures icon and color scheme.
     * 
     * Each type comes with a default icon and color scheme that follows
     * common UI patterns for different types of notifications.
     * 
     * @example
     * ```tsx
     * // Success alert with green colors and check icon
     * <Alert title="Success!" type="success" />
     * 
     * // Error alert with red colors and error icon
     * <Alert title="Error occurred" type="error" />
     * 
     * // Warning alert with yellow colors and warning icon
     * <Alert title="Be careful" type="warning" />
     * 
     * // Info alert with blue colors and info icon
     * <Alert title="Did you know?" type="info" />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    type?: "info" | "warning" | "error" | "success";

    /**
     * Additional props to pass to the message Text component.
     * 
     * Allows fine-grained control over the message text rendering including
     * accessibility props, text truncation, and other Text component features.
     * The 'variant' prop is omitted to avoid conflicts with messageVariant.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   message="This is a long message that might need truncation"
     *   messageProps={{
     *     numberOfLines: 3,
     *     ellipsizeMode: "tail",
     *     accessible: true,
     *     accessibilityLabel: "Alert message"
     *   }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link IHtmlTextProps} for available props (excluding variant)
     * @since 1.0.0
     */
    messageProps?: Omit<IHtmlTextProps, "variant">;

    /**
     * Custom icon for the close/dismiss button.
     * 
     * Overrides the default "close" icon used in the dismiss button.
     * Only relevant when dismissible is true.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Dismissible Alert"
     *   dismissible={true}
     *   closeIcon="material-close-circle"
     * />
     * ```
     * 
     * @defaultValue "close"
     * @see {@link IIconSource} for supported icon formats
     * @since 1.0.0
     */
    closeIcon?: IIconSource;

    /**
     * Additional CSS classes to apply to the close icon.
     * 
     * Customizes the appearance of the dismiss button icon.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Close Icon"
     *   dismissible={true}
     *   closeIconClassName="text-red-500 hover:text-red-700 text-xl"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    closeIconClassName?: IClassName;

    /**
     * Additional CSS classes to apply to the close icon container.
     * 
     * The close icon container wraps the close icon and controls its
     * positioning within the header.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Styled Close Container"
     *   dismissible={true}
     *   closeIconContainerClassName="bg-gray-100 hover:bg-gray-200 rounded-full p-1"
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    closeIconContainerClassName?: IClassName;

    /**
     * Icon variant configuration for the close button icon.
     * 
     * Controls the visual styling of the dismiss button icon including
     * size and color properties.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Custom Close Icon Variant"
     *   dismissible={true}
     *   closeIconVariant={{ size: "sm", colorScheme: "muted" }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link IIconVariant} for available variant options
     * @since 1.0.0
     */
    closeIconVariant?: IIconVariant;

    /**
     * Navigation actions to display at the bottom of the alert.
     * 
     * Provides interactive buttons or links that users can interact with.
     * Each action receives the alert's hook context (isOpen, open, close)
     * for controlling alert behavior.
     * 
     * @example
     * ```tsx
     * <Alert 
     *   title="Confirm Action"
     *   message="Are you sure you want to proceed?"
     *   actions={{
     *     items: [
     *       {
     *         label: "Cancel",
     *         variant: { colorScheme: "muted" },
     *         onPress: (context) => context.close()
     *       },
     *       {
     *         label: "Confirm",
     *         variant: { colorScheme: "primary" },
     *         onPress: (context) => {
     *           // Perform action
     *           handleConfirm();
     *           context.close();
     *         }
     *       }
     *     ]
     *   }}
     * />
     * ```
     * 
     * @defaultValue undefined
     * @see {@link INavItemsProps} for action configuration options
     * @see {@link IAlertHook} for available context properties
     * @since 1.0.0
     */
    actions?: INavItemsProps<IAlertHook>;

    /**
     * Whether the alert can be dismissed by the user.
     * 
     * When true, displays a close button that allows users to dismiss the alert.
     * When centered is true, dismissible defaults to true unless explicitly set to false.
     * 
     * @example
     * ```tsx
     * // Dismissible alert
     * <Alert 
     *   title="You can close this"
     *   dismissible={true}
     * />
     * 
     * // Non-dismissible alert
     * <Alert 
     *   title="Important: Cannot be closed"
     *   dismissible={false}
     * />
     * 
     * // Centered alerts are dismissible by default
     * <Alert 
     *   title="Centered Modal Alert"
     *   centered={true}
     *   // dismissible defaults to true
     * />
     * ```
     * 
     * @defaultValue false (true when centered)
     * @since 1.0.0
     */
    dismissible?: boolean;

    /**
     * Whether the alert should be centered on screen.
     * 
     * When true, the alert behaves like a modal dialog, typically centered
     * vertically and horizontally. Centered alerts are usually dismissible
     * and may include overlay behavior.
     * 
     * @example
     * ```tsx
     * // Inline alert (default)
     * <Alert 
     *   title="Inline Notification"
     *   message="This appears in the normal document flow"
     * />
     * 
     * // Centered modal alert
     * <Alert 
     *   title="Modal Alert"
     *   message="This appears centered on screen"
     *   centered={true}
     * />
     * 
     * // Centered with custom actions
     * <Alert 
     *   title="Confirm Delete"
     *   message="This action cannot be undone"
     *   centered={true}
     *   actions={{
     *     items: [
     *       { label: "Cancel", onPress: (ctx) => ctx.close() },
     *       { label: "Delete", onPress: (ctx) => { handleDelete(); ctx.close(); }}
     *     ]
     *   }}
     * />
     * ```
     * 
     * @defaultValue false
     * @since 1.0.0
     */
    centered?: boolean;

    /**
     * Additional content to display in the alert header.
     * 
     * This content is positioned between the title/icon section and the close button
     * in the header row. It's useful for displaying supplementary information,
     * action buttons, badges, or any custom UI elements that enhance the alert.
     * 
     * The headerContent is rendered as-is and should be properly styled by the consumer.
     * It has access to the full width between the title and close button areas.
     * 
     * @example
     * ```tsx
     * // Badge in header
     * <Alert 
     *   title="Update Available"
     *   headerContent={<Badge variant="info">New</Badge>}
     * />
     * 
     * // Action button in header
     * <Alert 
     *   title="File Upload"
     *   headerContent={
     *     <Button size="sm" variant="ghost">
     *       View Details
     *     </Button>
     *   }
     * />
     * 
     * // Multiple elements in header
     * <Alert 
     *   title="Task Complete"
     *   headerContent={
     *     <View className="flex-row items-center space-x-2">
     *       <Badge variant="success">Done</Badge>
     *       <Text className="text-xs text-gray-500">2 min ago</Text>
     *     </View>
     *   }
     * />
     * 
     * // Progress indicator
     * <Alert 
     *   title="Uploading..."
     *   headerContent={
     *     <View className="flex-1 mx-4">
     *       <ProgressBar progress={0.7} />
     *     </View>
     *   }
     * />
     * ```
     * 
     * @defaultValue undefined
     * @since 1.0.0
     */
    headerContent?: ReactNode;
}