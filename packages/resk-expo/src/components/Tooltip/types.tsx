


import { IReactComponent } from "../../types";
import { ReactNode } from "react"
import { PressableProps } from "react-native";
import { IMerge } from "@resk/core";

export type ITooltipActions = "press" | "longpress" | "hover";
export type ITooltipPositions = "top" | "right" | "bottom" | "left";


/**
 * The props for the Tooltip component, extending the base PressableProps.
 * This type allows merging additional props dynamically.
 *
 * @template T - A generic type for extending or merging additional properties.
 */
export type ITooltipProps<T = any> = PressableProps & IMerge<{
    /**
     * The content to display inside the tooltip.
     * It can be a ReactNode that supports complex structures like JSX elements.
     *
     * @type {React.ReactNode}
     */
    tooltip?: ReactNode;

    /**
     * The title displayed within the tooltip, typically a brief label or description.
     * Can be used as an alternative to the `tooltip` property.
     *
     * @type {React.ReactNode}
     */
    title?: ReactNode;

    /**
     * Optionally specify the element type to render the Tooltip with.
     * By default, it uses `Pressable`, but can be changed to any custom component.
     *
     * @type {IReactComponent}
     */
    as?: IReactComponent;

    /**
     * If true, disables the tooltip from being triggered and displayed.
     *
     * @type {boolean}
     */
    disabled?: boolean;

    /**
     * Actions to perform on the Tooltip component.
     * This is an array of action definitions that are specific to how the Tooltip should behave.
     *
     * @type {ITooltipActions[]}
     */
    actions?: ITooltipActions[];

    /**
     * Positions where the tooltip can be displayed relative to the target element.
     * This is an array of position values that define where the Tooltip should appear.
     *
     * @type {ITooltipPositions[]}
     */
    positions?: ITooltipPositions[];
}, T>;
