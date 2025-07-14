"use client";
import { Icon, IIconProps } from "@components/Icon";
import { IExpandableProps } from "./types";
import { cn } from "@utils/cn";
import { useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import useStateCallback from "@utils/stateCallback";
import { addClassName, removeClassName } from "@resk/core/utils";

export function ExpandableIcon({ expanded, toggleExpand, isControlled, id, onExpandChange, parentId, expandedIcon, collapsedIcon, className, variant, ...props }: IExpandableIconProps) {
    const iconRef = useRef<View>(null);
    const isNative = typeof toggleExpand === "function";
    const [internalExpanded, setInternalExpanded] = useStateCallback(expanded);
    const isExpanded = isNative || isControlled ? expanded : internalExpanded;
    const handleToggleExpand = isControlled && typeof onExpandChange == "function" ? () => onExpandChange(!expanded) : undefined;
    variant = { size: "25px", ...variant }
    const expandedIconElt = Icon.getIcon({
        ...props,
        variant,
        icon: expandedIcon || "chevron-up" as never,
        className,
        //onPress:  : undefined,
    }), collapsedIconElt = Icon.getIcon({
        ...props,
        variant,
        className,
        icon: collapsedIcon || "chevron-down" as never,
    });
    return <TouchableOpacity
        id={id}
        ref={iconRef}
        className={cn("resk-expandable-icon-container", `resk-expandable-${expanded ? "expanded" : "collapsed"}-icon-container`, "overflow-hidden align-center items-center justify-center flex flex-col")}
        onPress={isNative ? toggleExpand : isControlled ? handleToggleExpand : typeof document !== "undefined" && document ? (event) => {
            const target = event.target;
            const icon = iconRef.current || target;
            if (icon) {
                const element: HTMLElement = (icon as any)?.closest?.('.resk-expandable');
                if (!element) return;
                const content = element.querySelector(".resk-expandable-content");
                if (content) {
                    const newExpanded = !internalExpanded;
                    const cb = () => typeof onExpandChange == "function" ? onExpandChange(newExpanded) : undefined;
                    const hiddenClassName = "hidden";
                    setInternalExpanded(newExpanded, (expanded) => {
                        const duration = 300;
                        if (expanded) {
                            removeClassName(content, hiddenClassName);
                            addClassName(content, "opacity-0");
                            setTimeout(() => {
                                removeClassName(content, "opacity-0");
                                addClassName(content, "opacity-100");
                            }, duration)
                            cb();
                        } else {
                            addClassName(content, "opacity-0");
                            removeClassName(content, "opacity-100");
                            setTimeout(() => {
                                addClassName(content, hiddenClassName);
                            }, duration);
                            cb();
                        }
                    })
                }
            }
        } : undefined}
    >
        {isExpanded ? expandedIconElt : collapsedIconElt}
    </TouchableOpacity>
}

export interface IExpandableIconProps extends Omit<IIconProps, "children" | "fontIconName" | "src"> {
    expanded: boolean;
    toggleExpand?: () => void;
    onExpandChange?: IExpandableProps["onExpandChange"];
    expandedIcon?: IExpandableProps["expandedIcon"];
    collapsedIcon?: IExpandableProps["collapsedIcon"];
    /**
     * The id of the expand icon component, passed by it's parent
     */
    parentId: string;

    isControlled: boolean;
}