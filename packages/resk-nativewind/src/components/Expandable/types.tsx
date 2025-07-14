import { IIconProps, IIconSource } from "@components/Icon";
import { IHtmlDivProps } from "@html/types";
import { IClassName } from "@src/types";
import { IExpandableVariant } from "@variants/expandable";
import { IIconVariant } from "@variants/icon";
import { ReactNode } from "react";

export interface IExpandableProps extends IHtmlDivProps {
    label?: ReactNode;
    children?: ReactNode;
    headerClassName?: IClassName;
    contentClassName?: IClassName;
    /**
     * Controls the expanded state when expandable is true.
     * If not provided, the button will manage its own internal state.
     */
    expanded?: boolean;

    /**
     * Callback fired when the expansion state changes.
     * Only relevant when expandable is true.
     */
    onExpandChange?: (expanded: boolean) => void;

    /**
     * Icon to show when expanded. Defaults to "chevron-up".
     * Only relevant when expandable is true.
     */
    expandedIcon?: IIconSource;

    iconClassName?: IClassName;

    iconVariant?: IIconVariant;

    iconPosition?: "left" | "right";

    iconSize?: IIconProps["size"];

    /**
     * Icon to show when collapsed. Defaults to "chevron-down".
     * Only relevant when expandable is true.
     */
    collapsedIcon?: IIconSource;

    variant?: IExpandableVariant;

    headerContainerClassName?: IClassName;
}