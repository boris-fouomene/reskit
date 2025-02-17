import { IIconProps, IIconSource } from "@components/Icon/types";
import { ILabelProps } from "@components/Label";
import { IViewProps } from "@components/View";
import { ILabelOrLeftOrRightProps } from "@hooks/index";
import { ReactNode } from "react";
import { GestureResponderEvent, PressableProps, ViewProps } from "react-native";
import { AnimatedProps } from "react-native-reanimated";
/**
 * Interface for Expandable component props that provides collapsible/expandable functionality with customizable icons and content.
 * 
 * @interface IExpandableProps
 * @param {IExpandableProps} props - The properties for configuring the expandable component.
 * @param {React.ForwardedRef<RNView>} ref - A ref forwarded to the root view of the component.
 *
 * 
 * @returns {JSX.Element} The rendered expandable component.
 * @extends {Omit<PressableProps, "children">}
 * @extends {ILabelOrLeftOrRightProps<IExpandableCallbackOptions>}
 * 
 * 
 * @example
 * ```tsx
 * import {Expandable} from "@resk/native";
 * <Expandable
 *   label="Settings"
 *   expandedIcon="chevron-up"
 *   unexpandedIcon="chevron-down"
 *   defaultExpanded={true}
 *   expandIconPosition="right"
 * >
 *   <View>
 *     <Text>Expanded Content</Text>
 *   </View>
 * </Expandable>
 * ```
 */
export type IExpandableProps = Omit<PressableProps, "children"> & ILabelOrLeftOrRightProps<IExpandableCallbackOptions> & {
    /** 
     * The content to be shown/hidden when expanding/collapsing
     * @type {JSX.Element}
     */
    children?: JSX.Element;

    /**
     * Props to customize the label appearance and behavior
     * @type {ILabelProps}
     */
    labelProps?: ILabelProps;

    /**
     * Callback fired when the expandable section is toggled
     * @param {Object} options - Toggle event options
     * @param {GestureResponderEvent} options.event - The native event
     * @param {boolean} [options.expanded] - The new expanded state
     */
    onToggleExpand?: (options: { event?: GestureResponderEvent; expanded: boolean }) => any;

    /**
     * Controls the expanded state when used as a controlled component
     * @type {boolean}
     */
    expanded?: boolean;

    /**
     * Icon to display when the section is expanded
     * @type {IIconSource}
     * @default "chevron-up"
     */
    expandedIcon?: IIconSource;

    /**
     * Initial expanded state when uncontrolled
     * @type {boolean}
     * @default false
     */
    defaultExpanded?: boolean;

    /**
     * Props applied to the expanded state icon
     * @type {IIconProps}
     */
    expandedIconProps?: IIconProps;

    /**
     * Icon to display when the section is collapsed
     * @type {IIconSource}
     * @default "chevron-down"
     */
    unexpandedIcon?: IIconSource;

    /**
     * Props applied to the unexpanded state icon
     * @type {IIconProps}
     */
    unexpandedIconProps?: IIconProps;

    /**
     * Props for the left container view
     * @type {IViewProps}
     */
    leftContainerProps?: IViewProps;

    /**
     * Position of the expand/collapse icon
     * @type {"left" | "right"}
     * @default "right"
     */
    expandIconPosition?: "left" | "right";

    /**
     * Props for the content wrapper view
     * @type {IViewProps}
     */
    contentProps?: AnimatedProps<ViewProps>;

    /**
     * Whether to mount children even when collapsed
     * @type {boolean}
     * @default false
     */
    autoMountChildren?: boolean;

    /**
     * Props for the right container view
     * @type {IViewProps}
     */
    rightContainerProps?: IViewProps;

    /**
     * Props for the content container view
     * @type {IViewProps}
     */
    contentContainerProps?: IViewProps;

    /**
     * Whether to show the expand/collapse icon
     * @type {boolean}
     * @default true
     */
    showExpandIcon?: boolean;

    /**
     * Props for the main container view
     * @type {IViewProps}
     */
    containerProps?: IViewProps;

    /**
     * Whether to use primary color for expanded state
     * @type {boolean}
     * @default true
     */
    usePrimaryColorWhenExpended?: boolean;

    /**
     * Size of the expand/collapse icon
     * @type {number}
     * @default 20
     */
    expandIconSize?: number;
}

/**
 * Configuration options passed to callbacks when the expandable state changes
 * 
 * @interface IExpandableCallbackOptions
 * 
 * @property {string} [color] - The current color value at the time of callback
 * @property {boolean} expanded - The current expanded state
 * 
 * @example
 * ```tsx
 * const handleToggle = ({ expanded, color }: IExpandableCallbackOptions) => {
 *   console.log(`Expandable is now ${expanded ? 'open' : 'closed'}`);
 *   console.log(`Current color: ${color}`);
 * };
 * ```
 */
export interface IExpandableCallbackOptions {
    color?: string; //la couleur à l'instant t
    expanded: boolean;
}

/**
 * Represents the context for an expandable component, providing state management
 * for its expanded/collapsed state.
 * 
 * @interface IExpandableContext
 * 
 * @property {boolean} expanded - Indicates whether the expandable component is currently expanded.
 * This property is crucial for determining the visibility of the content within the expandable component.
 * 
 * @property {function} toggleExpand - A function to update the expanded state of the component.
 * 
 * @param {boolean} expanded - The new expanded state to set. Pass `true` to expand the component,
 * or `false` to collapse it.
 * 
 * @param {function} [callback] - An optional callback function that is invoked after the expanded state is updated.
 * This can be useful for performing additional actions or side effects based on the new state.
 * 
 * @example
 * // Example of using IExpandableContext in a functional component
 * 
 * import React, { useContext } from 'react';
 * import { IExpandableContext, useExpandable } from './ExpandableContext';
 * 
 * const MyExpandableComponent: React.FC = () => {
 *   const { expanded, toggleExpand } = useContext<IExpandableContext>(useExpandable());
 * 
 *   const toggleExpand = () => {
 *     toggleExpand(!expanded, (newExpanded) => {
 *       console.log('The component is now', newExpanded ? 'expanded' : 'collapsed');
 *     });
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={toggleExpand}>
 *         {expanded ? 'Collapse' : 'Expand'}
 *       </button>
 *       {expanded && <div>Here is the expandable content!</div>}
 *     </div>
 *   );
 * };
 * 
 * @remarks
 * This context is typically used in conjunction with an expandable component to manage its state
 * in a controlled manner. By using this context, you can easily share the expanded state across
 * different components or parts of your application.
 */
export type IExpandableContext = {
    expanded: boolean;
    toggleExpand: (event?: GestureResponderEvent, callback?: (newExpanded: boolean) => void) => void;
    /***
     * The icon to display to toggle the expandable state.
     */
    expandIcon: ReactNode;
};