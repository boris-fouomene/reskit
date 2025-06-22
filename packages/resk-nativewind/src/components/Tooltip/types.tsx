

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
     * title : "Hover over me for more info!"
     * 
     * // A tooltip with JSX content
     * title: <div><strong>Important:</strong> This feature is in beta.</div>
     */
    title?: ReactNode;
};


export type ITooltipProps<AsProps extends ITouchableProps & { id?: PressableProps["id"]; } = PressableProps> = ITooltipBaseProps & Partial<AsProps> & {
    ref?: React.Ref<View>;
    as?: ComponentType<ITooltipBaseProps & AsProps>;
    children?: JSX.Element | null;
    testID?: PressableProps["testID"];
    disabled?: PressableProps["disabled"];
    id?: PressableProps["id"];
    className?: IClassName;
}
