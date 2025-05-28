import { IIconProps, IIconSource } from "@components/Icon";
import { IHtmlDivProps } from "@html/types";
import { IClassName } from "@src/types";
import { ReactElement } from "react";
import { GestureResponderEvent, View } from "react-native";

export interface IExpandableProps extends IHtmlDivProps {
    /** 
     * The content to be shown/hidden when expanding/collapsing
     * @type {ReactElement}
     */
    children?: ReactElement;

    labelClassName?: IClassName;

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

    /** ClassName applied to the expanded state icon */
    expandedIconClassName?: IClassName;

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

    /***
     * Class name applied to the unexpanded state icon
     */
    unexpandedIconClassName?: IClassName;

    leftContainerClassName?: IClassName;

    /**
     * Position of the expand/collapse icon
     * @type {"left" | "right"}
     * @default "right"
     */
    expandIconPosition?: "left" | "right";

    contentClassName?: IClassName;

    /**
     * Whether to mount children even when collapsed
     * @type {boolean}
     * @default false
     */
    autoMountChildren?: boolean;


    rightContainerClassName?: IClassName;

    /**
     * Whether to show the expand/collapse icon
     * @type {boolean}
     * @default true
     */
    showExpandIcon?: boolean;


    containerClassName?: IClassName;

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

    ref?: React.Ref<View>;
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
