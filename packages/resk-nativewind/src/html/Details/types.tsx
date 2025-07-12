

import { ReactElement } from "react";
import { IHtmlDivProps } from "@html/types";
import { IClassName, ITouchableProps } from "@src/types";
import { IIconProps } from "@components/Icon";

/**
 * Properties for the HTML Details component that provides collapsible/expandable content functionality.
 * 
 * This interface extends the base HTML div properties to create a native-like details/summary element
 * with customizable icons, styling, and responsive behavior. The component mimics the HTML `<details>`
 * element but provides enhanced styling capabilities and cross-platform compatibility.
 * 
 * @example
 * ```tsx
 * // Basic usage with simple content
 * <Details
 *   summary={<Text>Click to expand</Text>}
 *   open={false}
 * >
 *   <Text>This content is hidden by default</Text>
 * </Details>
 * 
 * // Advanced usage with custom icons and styling
 * <Details
 *   summary={<Text className="font-bold">Advanced Settings</Text>}
 *   summaryClassName="bg-gray-100 p-4 rounded-t"
 *   contentClassName="bg-white p-4 border rounded-b"
 *   iconPosition="right"
 *   expandedIconProps={{
 *     fontIconName: "chevron-up",
 *     size: 20,
 *     color: "blue"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "chevron-down", 
 *     size: 20,
 *     color: "gray"
 *   }}
 *   open={true}
 * >
 *   <View>
 *     <Text>Advanced configuration options</Text>
 *     <Button title="Save Settings" />
 *   </View>
 * </Details>
 * 
 * // Controlled component usage
 * const [isOpen, setIsOpen] = useState(false);
 * <Details
 *   summary={<Text>Controlled Details</Text>}
 *   open={isOpen}
 *   onPress={() => setIsOpen(!isOpen)}
 * >
 *   <Text>Content visibility controlled by parent state</Text>
 * </Details>
 * ```
 * 
 * @since 1.0.0
 * @public
 */
export interface IHtmlDetailsProps extends IHtmlDivProps, IHtmlDetailsIcons {
    /**
     * The summary element that serves as the clickable header for the details component.
     * 
     * This element is always visible and acts as the trigger to expand or collapse
     * the details content. It typically contains text, but can include any valid
     * React element such as icons, buttons, or complex layouts.
     * 
     * @example
     * ```tsx
     * // Simple text summary
     * summary={<Text>Click me to expand</Text>}
     * 
     * // Complex summary with icons and styling
     * summary={
     *   <View className="flex-row items-center gap-2">
     *     <Icon fontIconName="settings" size={16} />
     *     <Text className="font-semibold">Settings</Text>
     *     <Badge text="New" />
     *   </View>
     * }
     * 
     * // Interactive summary with custom styling
     * summary={
     *   <Pressable className="bg-blue-50 p-3 rounded">
     *     <Text className="text-blue-700">Advanced Options</Text>
     *   </Pressable>
     * }
     * ```
     */
    summary: ReactElement;

    /**
     * Optional CSS class names to apply custom styling to the summary element container.
     * 
     * This allows for comprehensive styling of the summary section including padding,
     * margins, background colors, borders, and responsive design adjustments.
     * 
     * @example
     * ```tsx
     * // Basic styling
     * summaryClassName="bg-gray-100 p-4 rounded cursor-pointer"
     * 
     * // Hover and focus states
     * summaryClassName="bg-white hover:bg-gray-50 focus:bg-blue-50 transition-colors p-3 border rounded"
     * 
     * // Responsive design
     * summaryClassName="p-2 md:p-4 bg-gray-100 md:bg-white border-b md:border md:rounded"
     * 
     * // State-based styling
     * summaryClassName={cn(
     *   "p-4 border rounded-t transition-all",
     *   isOpen ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
     * )}
     * ```
     * 
     * @defaultValue undefined
     */
    summaryClassName?: IClassName;

    /**
     * The collapsible content that is shown or hidden based on the component's open state.
     * 
     * This content is rendered within the details container and can be any valid React
     * element or null. When null, the details component will still render but without
     * expandable content, which can be useful for loading states or conditional rendering.
     * 
     * @example
     * ```tsx
     * // Simple text content
     * children={<Text>This is the expandable content</Text>}
     * 
     * // Complex layout with multiple elements
     * children={
     *   <View className="space-y-4">
     *     <Text className="text-lg font-semibold">Content Title</Text>
     *     <Text>Detailed description goes here...</Text>
     *     <Button title="Action Button" onPress={handleAction} />
     *     <Image source={{ uri: 'https://example.com/image.jpg' }} />
     *   </View>
     * }
     * 
     * // Conditional content rendering
     * children={hasData ? <DataDisplay data={data} /> : null}
     * 
     * // Loading state
     * children={isLoading ? <LoadingSpinner /> : <ActualContent />}
     * ```
     * 
     * @defaultValue null
     */
    children?: ReactElement | null;

    /**
     * Optional CSS class names to apply custom styling to the content container.
     * 
     * This enables styling of the expandable content area including animations,
     * padding, background colors, borders, and layout properties. Useful for
     * creating smooth expand/collapse animations and visual hierarchy.
     * 
     * @example
     * ```tsx
     * // Basic content styling
     * contentClassName="p-4 bg-white border-t"
     * 
     * // Animation and transitions
     * contentClassName="p-4 bg-white transition-all duration-300 ease-in-out"
     * 
     * // Border and shadow effects
     * contentClassName="p-6 bg-white border border-gray-200 rounded-b shadow-sm"
     * 
     * // Responsive padding and spacing
     * contentClassName="p-3 md:p-6 bg-gray-50 md:bg-white space-y-4"
     * 
     * // State-based styling with animations
     * contentClassName={cn(
     *   "transition-all duration-200 overflow-hidden",
     *   "p-4 bg-white border-x border-b rounded-b",
     *   isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
     * )}
     * ```
     * 
     * @defaultValue undefined
     */
    contentClassName?: IClassName;

    /**
     * Controls the initial or current open/closed state of the details component.
     * 
     * When `true`, the details content is visible and expanded. When `false`, the content
     * is hidden and collapsed. This can be used for both controlled and uncontrolled
     * component patterns depending on whether you also provide state change handlers.
     * 
     * @example
     * ```tsx
     * // Always open by default
     * open={true}
     * 
     * // Always closed by default  
     * open={false}
     * 
     * // Controlled state
     * const [isOpen, setIsOpen] = useState(false);
     * open={isOpen}
     * 
     * // Conditional initial state
     * open={user.preferences.expandDetailsByDefault}
     * 
     * // Based on content availability
     * open={hasContent && shouldShowByDefault}
     * ```
     * 
     * @defaultValue false
     */
    open?: boolean;

    /**
     * Determines the positioning of the expand/collapse icon relative to the summary content.
     * 
     * - `"left"`: Icon appears before the summary content (common in file explorers)
     * - `"right"`: Icon appears after the summary content (common in mobile interfaces)
     * 
     * The icon position affects both visual hierarchy and user interaction patterns.
     * Left positioning is often used for tree-like structures, while right positioning
     * is preferred for card-based or list-based interfaces.
     * 
     * @example
     * ```tsx
     * // Tree-like structure (file explorer style)
     * iconPosition="left"
     * 
     * // Card or list interface (mobile-friendly)
     * iconPosition="right"
     * 
     * // Responsive positioning
     * iconPosition={isMobile ? "right" : "left"}
     * 
     * // Based on content type
     * iconPosition={isMenuItem ? "right" : "left"}
     * ```
     * 
     * @defaultValue "right"
     */
    iconPosition?: "left" | "right";


}

interface IHtmlDetailsIcons {
    /**
     * Configuration properties for the icon displayed when the details component is expanded (open).
     * 
     * This icon is shown when the details content is visible and typically suggests that clicking
     * will collapse/close the content (e.g., chevron-up, minus, or collapse icon). The icon
     * provides visual feedback about the current expanded state and indicates the available
     * collapse action to users.
     * 
     * @example
     * ```tsx
     * // Simple chevron pointing up (suggests collapse action)
     * expandedIconProps={{
     *   fontIconName: "chevron-up",
     *   size: 20
     * }}
     * 
     * // Minus icon indicating collapse action
     * expandedIconProps={{
     *   fontIconName: "minus-circle",
     *   size: 24,
     *   color: "red",
     *   className: "transition-transform duration-200"
     * }}
     * 
     * // Material Design collapse icon
     * expandedIconProps={{
     *   fontIconName: "expand_less",
     *   size: 18,
     *   color: "#666"
     * }}
     * 
     * // Custom SVG collapse icon
     * expandedIconProps={{
     *   source: require('./icons/collapse.svg'),
     *   size: 16,
     *   tintColor: "blue"
     * }}
     * 
     * // Rotated arrow indicating current state
     * expandedIconProps={{
     *   fontIconName: "arrow-right",
     *   size: 16,
     *   className: "transform rotate-90 transition-transform duration-200"
     * }}
     * ```
     * 
     * @defaultValue { fontIconName: "chevron-up", size: 16 }
     */
    expandedIconProps?: Omit<IIconProps, keyof ITouchableProps>;

    /**
     * Configuration properties for the icon displayed when the details component is collapsed (closed).
     * 
     * This icon is shown when the details content is hidden and typically suggests that clicking
     * will expand/open the content (e.g., chevron-down, plus, or expand icon). The icon serves
     * as a visual cue to users that there is hidden content available and indicates how to
     * access it.
     * 
     * @example
     * ```tsx
     * // Simple chevron pointing down (suggests expand action)
     * collapsedIconProps={{
     *   fontIconName: "chevron-down", 
     *   size: 20
     * }}
     * 
     * // Plus icon indicating expand/add action
     * collapsedIconProps={{
     *   fontIconName: "plus-circle",
     *   size: 24,
     *   color: "green",
     *   className: "transition-all duration-200 hover:scale-110"
     * }}
     * 
     * // Material Design expand icon
     * collapsedIconProps={{
     *   fontIconName: "expand_more",
     *   size: 18,
     *   color: "#333",
     *   className: "transform transition-transform duration-300"
     * }}
     * 
     * // Conditional icon based on content state
     * collapsedIconProps={{
     *   fontIconName: hasNewContent ? "notification" : "chevron-down",
     *   size: 16,
     *   color: hasNewContent ? "orange" : "gray"
     * }}
     * 
     * // Right-pointing arrow (common in tree views)
     * collapsedIconProps={{
     *   fontIconName: "arrow-right",
     *   size: 16,
     *   className: "transition-transform duration-200"
     * }}
     * ```
     * 
     * @defaultValue { fontIconName: "chevron-down", size: 16 }
     */
    collapsedIconProps?: Omit<IIconProps, keyof ITouchableProps>;
}
export interface IHtmlDetailsIconProps extends IHtmlDetailsIcons {
    testID?: string;
    className?: IClassName;
}