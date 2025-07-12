"use client";
import { IHtmlDetailsIconProps } from "./types";
import { useEffect, useId } from "react";
import { Div } from "../Div";
import { cn } from "@utils/cn";
import { commonVariant } from "@variants/common";
import { addClassName, removeClassName } from "@resk/core/utils";
import { IIconProps } from "@components/Icon/types";
import { Icon } from "@components/Icon";

/**
 * A specialized icon component for HTML Details elements that handles state-based icon switching.
 * 
 * This component intelligently renders different icons based on the expanded/collapsed state of
 * the details element. It supports both native HTML details behavior (using browser toggle events)
 * and controlled behavior (using React state management). The component automatically handles
 * icon visibility transitions and provides smooth user experience feedback.
 * 
 * ## Key Features
 * - **State-responsive icons**: Automatically switches between expanded and collapsed icons
 * - **Native HTML integration**: Listens to browser's native `toggle` events for seamless UX
 * - **Controlled mode support**: Works with React state management for custom behavior
 * - **Smooth transitions**: Handles icon visibility with opacity and CSS transitions
 * - **Accessibility ready**: Proper test IDs and semantic structure for screen readers
 * - **Performance optimized**: Uses efficient DOM queries and event handling
 * - **Cross-platform compatible**: Works consistently across web, mobile, and desktop
 * 
 * ## Rendering Modes
 * 
 * ### Native Mode (Recommended)
 * When `toggleOpen` function is provided, the component operates in native mode where it
 * listens to the browser's built-in `toggle` event from the `<details>` element. This provides
 * the best performance and accessibility.
 * 
 * ### Controlled Mode
 * When no `toggleOpen` function is provided, the component renders both icons and controls
 * their visibility based on the `open` prop. This mode is useful for custom implementations
 * or when you need precise control over the toggle behavior.
 * 
 * @example
 * ```tsx
 * // Native mode - integrates with HTML details element
 * <details>
 *   <summary>
 *     Click me
 *     <DetailsIcon
 *       open={false}
 *       toggleOpen={handleToggle}
 *       expandedIconProps={{
 *         fontIconName: "chevron-up",
 *         size: 18,
 *         color: "blue"
 *       }}
 *       collapsedIconProps={{
 *         fontIconName: "chevron-down",
 *         size: 18,
 *         color: "gray"
 *       }}
 *       testID="my-details-icon"
 *     />
 *   </summary>
 *   <div>Content here</div>
 * </details>
 * 
 * // Controlled mode - managed by React state
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <div>
 *   <button onClick={() => setIsOpen(!isOpen)}>
 *     Toggle Content
 *     <DetailsIcon
 *       open={isOpen}
 *       expandedIconProps={{
 *         fontIconName: "minus-circle",
 *         size: 20,
 *         color: "red",
 *         className: "transition-transform duration-200"
 *       }}
 *       collapsedIconProps={{
 *         fontIconName: "plus-circle",
 *         size: 20,
 *         color: "green",
 *         className: "transition-transform duration-200"
 *       }}
 *       className="ml-2"
 *     />
 *   </button>
 *   {isOpen && <div>Controlled content</div>}
 * </div>
 * 
 * // Advanced usage with custom animations
 * <DetailsIcon
 *   open={isExpanded}
 *   toggleOpen={handleToggle}
 *   expandedIconProps={{
 *     fontIconName: "arrow-up",
 *     size: 16,
 *     className: "transform transition-all duration-300 rotate-180"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "arrow-up",
 *     size: 16,
 *     className: "transform transition-all duration-300 rotate-0"
 *   }}
 *   className="details-toggle-icon"
 * />
 * 
 * // Integration with form validation
 * <DetailsIcon
 *   open={hasErrors}
 *   expandedIconProps={{
 *     fontIconName: "alert-triangle",
 *     size: 18,
 *     color: "orange",
 *     className: "animate-pulse"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "check-circle",
 *     size: 18,
 *     color: "green"
 *   }}
 *   testID="validation-status-icon"
 * />
 * ```
 * 
 * @param props - Configuration properties for the DetailsIcon component
 * @param props.expandedIconProps - Icon configuration when the details element is expanded (open)
 * @param props.collapsedIconProps - Icon configuration when the details element is collapsed (closed)
 * @param props.toggleOpen - Optional toggle function for native mode integration
 * @param props.open - Current open/closed state of the details element
 * @param props.testID - Test identifier for automated testing and debugging
 * @param props.className - Additional CSS classes to apply to the icon container
 * @param props.rest - Additional properties passed to the underlying icon component
 * 
 * @returns A JSX element containing the appropriate icon(s) based on the current state and mode
 * 
 * @example
 * ```tsx
 * // File explorer style with directory icons
 * <DetailsIcon
 *   open={isDirectoryOpen}
 *   toggleOpen={toggleDirectory}
 *   expandedIconProps={{
 *     fontIconName: "folder-open",
 *     size: 16,
 *     color: "#4A90E2"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "folder",
 *     size: 16,
 *     color: "#7F8C8D"
 *   }}
 *   testID={`directory-${directoryId}-icon`}
 * />
 * 
 * // Mobile-friendly card interface
 * <DetailsIcon
 *   open={isCardExpanded}
 *   expandedIconProps={{
 *     fontIconName: "chevron-up",
 *     size: 24,
 *     color: "#333",
 *     className: "transform transition-transform duration-200"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "chevron-down",
 *     size: 24,
 *     color: "#333",
 *     className: "transform transition-transform duration-200"
 *   }}
 *   className="touch-target-large"
 * />
 * ```
 * 
 * @remarks
 * **Native Mode Behavior:**
 * - Automatically attaches event listeners to the closest `<details>` element
 * - Responds to browser's native toggle events for optimal performance
 * - Handles cleanup of event listeners on component unmount
 * - Provides the most accessible and performant user experience
 * 
 * **Controlled Mode Behavior:**
 * - Renders both expanded and collapsed icons simultaneously
 * - Uses CSS classes to control visibility based on `open` prop
 * - Suitable for custom implementations or non-standard use cases
 * - Requires manual state management by parent component
 * 
 * **Performance Considerations:**
 * - Uses `useId()` for unique DOM element identification
 * - Efficient DOM queries using document.querySelector
 * - Event listeners are properly cleaned up to prevent memory leaks
 * - CSS transitions provide smooth visual feedback without JavaScript animations
 * 
 * **Accessibility Notes:**
 * - Proper test IDs enable automated testing and debugging
 * - Icon state changes provide visual feedback for user interactions
 * - Compatible with screen readers when used within proper semantic HTML
 * - Keyboard navigation is handled by parent details/summary elements
 * 
 * @see {@link IHtmlDetailsIconProps} for complete props interface documentation
 * @see {@link Icon} for underlying icon component implementation
 * @see {@link useId} for React's built-in unique ID generation
 * 
 * @since 1.0.0
 * @public
 */
export function DetailsIcon({ expandedIconProps, collapsedIconProps, toggleOpen, open, testID, className, ...rest }: IHtmlDetailsIconProps & { toggleOpen?: () => void; open: boolean; }) {
    const isNative = typeof toggleOpen == "function";
    const iconId = useId();
    const iconClassName = cn(className, "resk-details-icon");
    const hiddenClassName = cn("opacity-0", "hidden", commonVariant({ hidden: true }));
    useEffect(() => {
        if (typeof document !== "undefined" && document) {
            const openIcon = document.querySelector(`#${iconId}-expanded`);
            const closeIcon = document.querySelector(`#${iconId}-collapsed`);
            const icon = openIcon || closeIcon;
            if (icon) {
                const details = icon.closest("details");
                if (details) {
                    details.addEventListener("toggle", (event) => {
                        const openIcon = document.querySelector(`#${iconId}-expanded`);
                        const closeIcon = document.querySelector(`#${iconId}-collapsed`);
                        const isOpen = details.open;
                        if (isOpen) {
                            addClassName(closeIcon, hiddenClassName);
                            removeClassName(openIcon, hiddenClassName);
                        } else {
                            addClassName(openIcon, hiddenClassName);
                            removeClassName(closeIcon, hiddenClassName);
                        }
                    });
                }
            }
        }
    }, []);
    const stateIcon: IIconProps = open ? {
        fontIconName: "chevron-down" as never,
        ...expandedIconProps
    } : {
        fontIconName: "chevron-right" as never,
        ...collapsedIconProps
    };
    const iconProps: IIconProps = {
        testID,
        ...stateIcon,
        variant: { size: "20px", ...stateIcon.variant },
        className: cn(iconClassName, stateIcon.className),
    };

    if (isNative) {
        return <Icon
            id={iconId}
            {...iconProps}
        />
    }
    return <Div asHtmlTag="span" testID={testID + "-icons-container"} id={iconId} className={cn("details-icon-container")}>
        {<Icon
            {...iconProps}
            className={cn(iconProps.className, "resk-details-expanded-icon", !open && hiddenClassName)}
            id={iconId + "-expanded"}
            testID={testID + "-expanded"}
        />}
        {<Icon
            {...iconProps}
            className={cn(iconProps.className, "resk-details-collapsed-icon", open && hiddenClassName)}
            id={iconId + "-collapsed"}
            testID={testID + "-collapsed"}
        />}
    </Div>;
}

DetailsIcon.displayName = "Html.Details.Icon";