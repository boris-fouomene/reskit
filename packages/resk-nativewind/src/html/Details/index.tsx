import { cn } from "@utils/cn";
import { Div } from "../Div";
import { defaultStr } from "@resk/core/utils";
import { commonVariant } from "@variants/common"
import { useDetailsState } from "./state";
import { IHtmlDetailsProps } from "./types";
import { DetailsIcon } from "./Icon";

/**
 * A cross-platform HTML Details component that provides collapsible/expandable content functionality.
 * 
 * This component renders a native HTML `<details>` element with enhanced styling capabilities and 
 * cross-platform compatibility. It features customizable icons, responsive behavior, and comprehensive
 * accessibility support. The component automatically manages open/closed state while allowing for
 * controlled usage patterns.
 * 
 * ## Key Features
 * - **Native HTML semantics**: Uses actual `<details>` and `<summary>` elements for optimal accessibility
 * - **Customizable icons**: Configurable expand/collapse icons with full styling control
 * - **Flexible positioning**: Icons can be positioned on left or right side of content
 * - **Responsive design**: Built-in responsive behavior and styling capabilities
 * - **State management**: Supports both controlled and uncontrolled usage patterns
 * - **Accessibility**: Full keyboard navigation and screen reader support
 * - **Cross-platform**: Works consistently across web, mobile, and desktop platforms
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
 * // Advanced usage with custom styling and icons
 * <Details
 *   summary={<Text className="font-bold text-lg">Advanced Settings</Text>}
 *   summaryClassName="bg-gray-100 p-4 rounded-t hover:bg-gray-200 transition-colors"
 *   contentClassName="bg-white p-6 border border-gray-200 rounded-b shadow-sm"
 *   iconPosition="right"
 *   expandedIconProps={{
 *     fontIconName: "chevron-up",
 *     size: 20,
 *     color: "blue",
 *     className: "transition-transform duration-200"
 *   }}
 *   collapsedIconProps={{
 *     fontIconName: "chevron-down", 
 *     size: 20,
 *     color: "gray",
 *     className: "transition-transform duration-200"
 *   }}
 *   open={true}
 *   className="border border-gray-300 rounded"
 * >
 *   <Div className="space-y-4">
 *     <Text className="text-gray-700">Advanced configuration options:</Text>
 *     <Switch label="Enable notifications" />
 *     <Button title="Save Settings" onPress={handleSave} />
 *   </Div>
 * </Details>
 * 
 * // Controlled component with external state management
 * const [isOpen, setIsOpen] = useState(false);
 * const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 * 
 * <Details
 *   summary={
 *     <Div className="flex-row items-center gap-2">
 *       <Text>Form Settings</Text>
 *       {hasUnsavedChanges && <Badge text="•" color="red" />}
 *     </Div>
 *   }
 *   open={isOpen}
 *   onPress={() => setIsOpen(!isOpen)}
 *   summaryClassName="p-3 bg-blue-50 rounded"
 *   iconPosition="left"
 * >
 *   <FormComponent 
 *     onChange={() => setHasUnsavedChanges(true)}
 *     onSave={() => setHasUnsavedChanges(false)}
 *   />
 * </Details>
 * 
 * // Disabled state with custom styling
 * <Details
 *   summary={<Text>Disabled Details</Text>}
 *   disabled={true}
 *   summaryClassName="opacity-50"
 *   contentClassName="opacity-50"
 * >
 *   <Text>This content cannot be interacted with</Text>
 * </Details>
 * 
 * // Nested details for hierarchical content
 * <Details
 *   summary={<Text>Main Category</Text>}
 *   contentClassName="pl-4"
 * >
 *   <Details
 *     summary={<Text>Subcategory 1</Text>}
 *     contentClassName="pl-4"
 *   >
 *     <Text>Nested content here</Text>
 *   </Details>
 *   <Details
 *     summary={<Text>Subcategory 2</Text>}
 *     contentClassName="pl-4"
 *   >
 *     <Text>More nested content</Text>
 *   </Details>
 * </Details>
 * ```
 * 
 * @param props - The properties for configuring the Details component
 * @param props.className - Additional CSS classes to apply to the root details element
 * @param props.expandedIconProps - Configuration for the icon displayed when content is expanded (visible)
 * @param props.collapsedIconProps - Configuration for the icon displayed when content is collapsed (hidden)
 * @param props.iconPosition - Position of the expand/collapse icon relative to summary content ("left" | "right")
 * @param props.disabled - Whether the details component should be disabled and non-interactive
 * @param props.testID - Test identifier for automated testing (defaults to "resk-details")
 * @param props.contentClassName - CSS classes to apply to the collapsible content container
 * @param props.open - Controls the open/closed state of the details (for controlled usage)
 * @param props.summaryClassName - CSS classes to apply to the clickable summary element
 * @param props.summary - The clickable header content that toggles the details visibility
 * @param props.children - The collapsible content that is shown/hidden based on state
 * @param props.rest - Additional HTML details element properties
 * 
 * @returns A JSX element representing the Details component with native HTML semantics
 * 
 * @example
 * ```tsx
 * // Integration with form validation
 * const [errors, setErrors] = useState<string[]>([]);
 * 
 * <Details
 *   summary={
 *     <Div className="flex-row items-center justify-between">
 *       <Text>Validation Errors</Text>
 *       {errors.length > 0 && (
 *         <Badge text={errors.length.toString()} color="red" />
 *       )}
 *     </Div>
 *   }
 *   open={errors.length > 0}
 *   summaryClassName={cn(
 *     "p-3 rounded",
 *     errors.length > 0 ? "bg-red-50 border-red-200" : "bg-gray-50"
 *   )}
 *   contentClassName="bg-red-25 border-red-100 border-t"
 * >
 *   <Div className="space-y-2">
 *     {errors.map((error, index) => (
 *       <Text key={index} className="text-red-700 text-sm">
 *         • {error}
 *       </Text>
 *     ))}
 *   </Div>
 * </Details>
 * ```
 * 
 * @remarks
 * - The component uses native HTML `<details>` and `<summary>` elements for optimal accessibility
 * - State management is handled automatically unless `open` prop is provided for controlled usage
 * - Icons are positioned based on `iconPosition` prop and respond to current expanded/collapsed state
 * - When disabled, all interactive elements become non-functional and styling is adjusted accordingly
 * - The component supports nested usage for creating hierarchical expandable content structures
 * 
 * @see {@link IHtmlDetailsProps} for complete prop interface documentation
 * @see {@link useDetailsState} for state management implementation details
 * @see {@link DetailsIcon} for icon component implementation
 * 
 * @since 1.0.0
 * @public
 */
export function Details({ className, expandedIconProps, collapsedIconProps, iconPosition, disabled, testID, contentClassName, open, summaryClassName, summary, children, ...rest }: IHtmlDetailsProps) {
    testID = defaultStr(testID, "resk-details");
    const { isOpen, toggleOpen } = useDetailsState(open);
    const restProps = !toggleOpen && isOpen ? { open } : {};
    const isIconOnLeft = iconPosition !== "right" ? true : false;
    const icon = <DetailsIcon
        testID={testID + "-icon"}
        toggleOpen={toggleOpen}
        open={isOpen}
        className={cn("details-icon")}
        expandedIconProps={expandedIconProps}
        collapsedIconProps={collapsedIconProps}
    />
    return <Div testID={testID} {...rest} disabled={disabled} className={cn("list-none", className, "details-group")} {...restProps} asHtmlTag="details">
        <Div asHtmlTag="summary" className={cn("list-none flex flex-row items-center", !disabled && "cursor-pointer", summaryClassName)} onPress={toggleOpen} testID={testID + "-summary"}>
            {isIconOnLeft ? icon : null}
            {summary}
            {!isIconOnLeft ? icon : null}
        </Div>
        <Div className={cn("w-100 px-[20px] py-[7px]", disabled && "pointer-events-none", contentClassName, toggleOpen && commonVariant({ hidden: !isOpen }))} testID={testID + "-content"}>
            {children}
        </Div>
    </Div>
}


export * from "./types";

Details.displayName = "Html.Details";