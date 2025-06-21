

"use client";
import { IClassName, ITouchableProps } from "@src/types";
import { ComponentProps, ComponentType, JSX, ReactNode } from "react"
import { PressableProps, View } from "react-native";

/**
 * 
 * @interface ITooltipBaseProps
 * @description
 * Represents the properties required for rendering a tooltip component.
 * This interface provides flexibility in displaying additional information
 * to users in a concise manner, enhancing user experience and interface
 * interactivity.
 *
 * @group Tooltip
 * @example
 * // Example usage of ITooltipBaseProps
 * const tooltipProps: ITooltipBaseProps = {
 *     tooltip: <span>This is a detailed tooltip content.</span>,
 *     title: 'Tooltip Title',
 *     disabled: false,
 * };
 */
export interface ITooltipBaseProps {
    /**
     * The content to display inside the tooltip.
     * This can include any valid ReactNode, allowing for complex structures
     * such as JSX elements, strings, or even other components.
     * 
     * @type {React.ReactNode}
     * @example
     * // A simple tooltip with text
     * tooltip: "Hover over me for more info!"
     * 
     * // A tooltip with JSX content
     * tooltip: <div><strong>Important:</strong> This feature is in beta.</div>
     */
    tooltip?: ReactNode;

    /**
     * The title displayed within the tooltip, typically a brief label or description.
     * This property can be used as an alternative to the `tooltip` property,
     * providing a succinct summary of the tooltip's purpose.
     * 
     * @type {React.ReactNode}
     * @example
     * // Using a title for the tooltip
     * title: "Click here to learn more"
     * 
     * // Title with JSX content
     * title: <span style={{ color: 'blue' }}>Info</span>
     */
    title?: ReactNode;
};

/**
 * @group Tooltip
 * @interface ITooltipProps
 * @description
 * The props for the Tooltip component, extending the base PressableProps.
 * This type allows merging additional props dynamically, enabling 
 * developers to customize the Tooltip component's behavior and appearance.

 * @example
 * // Example usage of ITooltipProps with custom properties
 * const customTooltipProps: ITooltipProps<{ customProp: string }> = {
 *     customProp: "This is a custom property",
 *     as: CustomComponent,
 *     tooltip: <span>Custom Tooltip Content</span>,
 *     title: "Custom Tooltip Title",
 *     disabled: false,
 * };
 */
export type ITooltipProps<AsProps extends ITouchableProps = PressableProps> = ITooltipBaseProps & Partial<AsProps> & {
    ref?: React.Ref<View>;
    as?: ComponentType<ITooltipBaseProps & AsProps>;
    children?: JSX.Element | null;
    testID?: PressableProps["testID"];
    disabled?: PressableProps["disabled"];
    id?: PressableProps["id"];
    className?: IClassName;
}
